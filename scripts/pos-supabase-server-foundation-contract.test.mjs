import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const ignoredDirectories = new Set([".git", ".next", "node_modules"]);
const sourceRoots = ["app", "components", "lib"];
const approvedServiceRoleSourceFiles = new Set([
  "lib/supabase/config.ts",
  "lib/supabase/service.ts",
]);
const approvedServiceHelperImports = new Set(["app/admin/supabase/page.tsx"]);
const serviceHelperPathPattern = /@\/lib\/supabase\/service|["']\.\.?\/.*supabase\/service["']/;
const forbiddenBusinessQueryPatterns = [
  /\.from\(\s*["'`]group_events["'`]\s*\)/i,
  /\.from\(\s*["'`]external_reservation_submissions["'`]\s*\)/i,
  /\.from\(\s*["'`]customers["'`]\s*\)/i,
  /\.from\(\s*["'`]cheffing_[^"'`]*["'`]\s*\)/i,
  /\.from\(\s*["'`]pos_[^"'`]*["'`]\s*\)/i,
  /\.rpc\(\s*["'`](?:pos_[^"'`]*|.*reservation.*|.*payment.*)["'`]\s*\)/i,
];
const forbiddenWritePatterns = [
  /\.insert\(/,
  /\.update\(/,
  /\.delete\(/,
  /\.upsert\(/,
];
const forbiddenPublicServiceRoleExactName = [
  "NEXT_PUBLIC",
  "SUPABASE",
  "SERVICE",
  "ROLE",
  "KEY",
].join("_");
const forbiddenPublicServiceRolePattern = new RegExp(
  ["NEXT_PUBLIC", "[A-Z0-9_]*SERVICE[A-Z0-9_]*ROLE[A-Z0-9_]*"].join("_"),
);

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

test("environment placeholders include server-only Supabase service key without committed env files", () => {
  assert.equal(existsSync(path.join(root, ".env")), false);
  assert.equal(existsSync(path.join(root, ".env.local")), false);

  const envExample = read(".env.example");
  assert.match(envExample, /^NEXT_PUBLIC_SUPABASE_URL=$/m);
  assert.match(envExample, /^NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$/m);
  assert.match(envExample, /^SUPABASE_SERVICE_ROLE_KEY=$/m);
  assert.match(envExample, /^POS_ACCESS_PASSWORD_HASH=$/m);
  assert.match(envExample, /^POS_SESSION_SECRET=$/m);
  assert.match(envExample, /^POS_SESSION_MAX_AGE_SECONDS=259200$/m);
});

test("service-role key is never exposed through NEXT_PUBLIC variables", () => {
  const scannedFiles = walkFiles(".").filter((file) =>
    /\.(ts|tsx|js|jsx|mjs|md|example|json)$/.test(file),
  );

  const violations = scannedFiles.flatMap((file) => {
    const source = read(file);
    return [
      source.includes(forbiddenPublicServiceRoleExactName)
        ? `${file}: forbidden public service-role variable`
        : null,
      forbiddenPublicServiceRolePattern.test(source)
        ? `${file}: NEXT_PUBLIC service-role variable`
        : null,
    ].filter(Boolean);
  });

  assert.deepEqual(violations, []);
});

test("service-role key usage stays in approved server-only Supabase source files", () => {
  const sourceFiles = sourceRoots.flatMap(walkFiles).filter((file) =>
    /\.(ts|tsx|js|jsx)$/.test(file),
  );

  const violations = sourceFiles.flatMap((file) => {
    const normalizedFile = normalizePath(file);
    const source = read(file);

    if (
      !/SUPABASE_SERVICE_ROLE_KEY|serviceRole|service role|service-role/i.test(source) ||
      approvedServiceRoleSourceFiles.has(normalizedFile) ||
      approvedServiceHelperImports.has(normalizedFile)
    ) {
      return [];
    }

    return [`${file}: unapproved service-role usage`];
  });

  assert.deepEqual(violations, []);
});

test("server-only service helper is not imported by client components", () => {
  const sourceFiles = sourceRoots.flatMap(walkFiles).filter((file) =>
    /\.(ts|tsx|js|jsx)$/.test(file),
  );

  const violations = sourceFiles.flatMap((file) => {
    const source = read(file);

    if (!source.includes("\"use client\"") || !serviceHelperPathPattern.test(source)) {
      return [];
    }

    return [`${file}: client component imports server-only Supabase service helper`];
  });

  assert.deepEqual(violations, []);
});

test("Supabase foundation does not add business reads, writes, browser storage, or integrations", () => {
  const sourceFiles = sourceRoots.flatMap(walkFiles).filter((file) =>
    /\.(ts|tsx|js|jsx)$/.test(file),
  );

  const violations = sourceFiles.flatMap((file) => {
    const source = read(file);
    const forbiddenBusinessQueries = forbiddenBusinessQueryPatterns
      .filter((pattern) => pattern.test(source))
      .map((pattern) => `${file}: ${pattern}`);
    const forbiddenWrites = forbiddenWritePatterns
      .filter((pattern) => pattern.test(source))
      .map((pattern) => `${file}: ${pattern}`);
    const forbiddenPersistence = [/\blocalStorage\b/, /\bsessionStorage\b/]
      .filter((pattern) => pattern.test(source))
      .map((pattern) => `${file}: ${pattern}`);
    return [
      ...forbiddenBusinessQueries,
      ...forbiddenWrites,
      ...forbiddenPersistence,
    ];
  });

  assert.deepEqual(violations, []);
});
