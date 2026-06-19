import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const ignoredDirectories = new Set([".git", ".next", "node_modules"]);
const sourceRoots = ["app", "components", "lib"];
const allowedSupabaseClientFiles = new Set([
  "lib/supabase/client.ts",
  "lib/supabase/server.ts",
  "lib/supabase/service.ts",
]);
const allowedServiceRoleFiles = new Set([
  "app/admin/supabase/page.tsx",
  "lib/supabase/service.ts",
]);

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function walkFiles(relativeDirectory) {
  const absoluteDirectory = path.join(root, relativeDirectory);

  if (!existsSync(absoluteDirectory)) {
    return [];
  }

  return readdirSync(absoluteDirectory).flatMap((entry) => {
    const absolutePath = path.join(absoluteDirectory, entry);
    const relativePath = path.relative(root, absolutePath);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      if (ignoredDirectories.has(entry)) {
        return [];
      }

      return walkFiles(relativePath);
    }

    return [relativePath];
  });
}

function normalizePath(file) {
  return file.replaceAll(path.sep, "/");
}

test("password gate files are present", () => {
  [
    "proxy.ts",
    "app/login/page.tsx",
    "app/api/pos-auth/login/route.ts",
    "app/api/pos-auth/logout/route.ts",
    "lib/pos-auth.ts",
    ".env.example",
  ].forEach((file) => assert.equal(existsSync(path.join(root, file)), true, file));
});

test("proxy protects app routes while allowing only the expected public auth and asset paths", () => {
  const proxySource = read("proxy.ts");

  [
    "/login",
    "/api/pos-auth/login",
    "/api/pos-auth/logout",
    "/_next/",
    "POS_SESSION_COOKIE_NAME",
    "verifyPosSession",
    "PUBLIC_PATHS.has(pathname)",
    "loginUrl.searchParams.set(\"next\"",
  ].forEach((expectedText) => assert.equal(proxySource.includes(expectedText), true));

  assert.doesNotMatch(proxySource, /\/pos["'`]/);
  assert.doesNotMatch(proxySource, /\/admin["'`]/);
  assert.doesNotMatch(proxySource, /PUBLIC_FILE_EXTENSION/);
  assert.doesNotMatch(proxySource, /webmanifest|avif|jpeg|jpg|png|svg/);
});

test("password gate keeps secrets server-side and avoids browser persistence", () => {
  assert.equal(existsSync(path.join(root, ".env")), false);
  assert.equal(existsSync(path.join(root, ".env.local")), false);

  const envExample = read(".env.example");
  assert.match(envExample, /^NEXT_PUBLIC_SUPABASE_URL=$/m);
  assert.match(envExample, /^NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$/m);
  assert.match(envExample, /^SUPABASE_SERVICE_ROLE_KEY=$/m);
  assert.match(envExample, /^POS_ACCESS_PASSWORD_HASH=$/m);
  assert.match(envExample, /^POS_SESSION_SECRET=$/m);
  assert.match(envExample, /^POS_SESSION_MAX_AGE_SECONDS=259200$/m);

  const sourceFiles = sourceRoots.flatMap(walkFiles).filter((file) =>
    /\.(ts|tsx|js|jsx)$/.test(file),
  );
  const violations = sourceFiles.flatMap((file) => {
    const normalizedFile = normalizePath(file);
    const source = read(file);
    const generalViolations = [
      /NEXT_PUBLIC_POS_ACCESS_PASSWORD/,
      /NEXT_PUBLIC_.*PASSWORD/,
      /\blocalStorage\b/,
      /\bsessionStorage\b/,
      /service_role/i,
      /POS_ACCESS_PASSWORD_HASH[\s\S]{0,120}(?:\|\||\?\?)\s*["'`][^"'`]+["'`]/,
      /POS_SESSION_SECRET[\s\S]{0,120}(?:\|\||\?\?)\s*["'`][^"'`]+["'`]/,
    ]
      .filter((pattern) => {
        if (pattern.source === "service_role" && allowedServiceRoleFiles.has(normalizedFile)) {
          return false;
        }

        return pattern.test(source);
      })
      .map((pattern) => `${file}: ${pattern}`);
    const supabaseImportViolations =
      /@supabase\//.test(source) && !allowedSupabaseClientFiles.has(normalizedFile)
        ? [`${file}: unexpected Supabase import`]
        : [];

    return [...generalViolations, ...supabaseImportViolations];
  });

  assert.deepEqual(violations, []);
});

test("password gate rejects weak session secrets and GET logout", () => {
  const authSource = read("lib/pos-auth.ts");
  const logoutSource = read("app/api/pos-auth/logout/route.ts");

  assert.match(authSource, /MIN_POS_SESSION_SECRET_LENGTH\s*=\s*32/);
  assert.match(authSource, /sessionSecret\.length\s*<\s*MIN_POS_SESSION_SECRET_LENGTH/);
  assert.match(logoutSource, /export function GET/);
  assert.match(logoutSource, /status:\s*405/);
  assert.match(logoutSource, /Allow:\s*"POST"/);
});
