import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

const root = process.cwd();

const requiredRoutes = [
  "app/page.tsx",
  "app/pos/page.tsx",
  "app/pos/comanda/page.tsx",
  "app/pos/cobro/page.tsx",
  "app/cocina/page.tsx",
  "app/ticket/page.tsx",
  "app/turno/page.tsx",
  "app/admin/page.tsx",
  "app/admin/catalogo/page.tsx",
  "app/admin/mesas/page.tsx",
  "app/admin/reservas/page.tsx",
  "app/admin/comandas/page.tsx",
  "app/admin/produccion/page.tsx",
  "app/admin/caja/page.tsx",
  "app/admin/informes/page.tsx",
  "app/admin/usuarios/page.tsx",
  "app/admin/fiscal/page.tsx",
  "app/admin/sikim-app/page.tsx",
  "app/admin/supabase/page.tsx",
  "app/admin/help/page.tsx",
  "app/ayuda/page.tsx",
];

const sourceRoots = ["app", "components", "lib"];
const forbiddenSourcePatterns = [
  /\blocalStorage\b/,
  /\bsessionStorage\b/,
  /service_role/i,
];
const allowedSupabaseClientFiles = new Set([
  "lib/supabase/client.ts",
  "lib/supabase/server.ts",
  "lib/supabase/service.ts",
]);
const allowedServiceRoleFiles = new Set([
  "app/admin/supabase/page.tsx",
  "lib/supabase/service.ts",
]);
const forbiddenSupabaseBusinessQueryPatterns = [
  /\.from\(\s*["'`](?:reservations?|customers?|orders?|order_lines?|cheffing_[^"'`]*|group_events?|external_reservation_submissions|pos_[^"'`]*)["'`]/i,
  /\.rpc\(\s*["'`](?:accept_reservation|reject_reservation|send_to_kitchen|create_order|record_payment|close_shift|pos_[^"'`]*)["'`]/i,
];

const ignoredDirectories = new Set([".git", ".next", "node_modules"]);

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

test("the initial POS UI shell exposes every required route", () => {
  const missingRoutes = requiredRoutes.filter(
    (route) => !existsSync(path.join(root, route)),
  );

  assert.deepEqual(missingRoutes, []);
});

test("the UI shell does not add forbidden backend or persistence artifacts", () => {
  assert.equal(existsSync(path.join(root, "supabase")), false);
  assert.equal(existsSync(path.join(root, ".env")), false);
  assert.equal(existsSync(path.join(root, ".env.local")), false);

  const committedZipCandidates = walkFiles(".").filter((file) =>
    file.toLowerCase().endsWith(".zip"),
  );

  assert.deepEqual(committedZipCandidates, []);
});

test("environment example contains only approved placeholder variables", () => {
  const envExamplePath = path.join(root, ".env.example");
  assert.equal(existsSync(envExamplePath), true);

  const envExample = readFileSync(envExamplePath, "utf8")
    .replaceAll("\r\n", "\n")
    .trimEnd();
  assert.equal(
    envExample,
    [
      "NEXT_PUBLIC_SUPABASE_URL=",
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=",
      "SUPABASE_SERVICE_ROLE_KEY=",
      "",
      "POS_ACCESS_PASSWORD_HASH=",
      "POS_SESSION_SECRET=",
      "POS_SESSION_MAX_AGE_SECONDS=259200",
    ].join("\n"),
  );
});

test("frontend source avoids browser persistence and only uses approved Supabase helpers", () => {
  const sourceFiles = sourceRoots.flatMap(walkFiles).filter((file) =>
    /\.(ts|tsx|js|jsx|css)$/.test(file),
  );

  const violations = sourceFiles.flatMap((file) => {
    const normalizedFile = normalizePath(file);
    const source = readFileSync(path.join(root, file), "utf8");
    const generalViolations = forbiddenSourcePatterns
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
    const supabaseCreateClientViolations =
      /createClient\(/.test(source) && !allowedSupabaseClientFiles.has(normalizedFile)
        ? [`${file}: unexpected createClient usage`]
        : [];
    const businessQueryViolations = forbiddenSupabaseBusinessQueryPatterns
      .filter((pattern) => pattern.test(source))
      .map((pattern) => `${file}: ${pattern}`);

    return [
      ...generalViolations,
      ...supabaseImportViolations,
      ...supabaseCreateClientViolations,
      ...businessQueryViolations,
    ];
  });

  assert.deepEqual(violations, []);
});
