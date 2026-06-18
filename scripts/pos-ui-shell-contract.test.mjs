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
  "app/admin/help/page.tsx",
  "app/ayuda/page.tsx",
];

const sourceRoots = ["app", "components", "lib"];
const forbiddenSourcePatterns = [
  /\blocalStorage\b/,
  /\bsessionStorage\b/,
  /@supabase\//,
  /createClient\(/,
  /service_role/i,
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

test("frontend source avoids Supabase clients and browser persistence", () => {
  const sourceFiles = sourceRoots.flatMap(walkFiles).filter((file) =>
    /\.(ts|tsx|js|jsx|css)$/.test(file),
  );

  const violations = sourceFiles.flatMap((file) => {
    const source = readFileSync(path.join(root, file), "utf8");
    return forbiddenSourcePatterns
      .filter((pattern) => pattern.test(source))
      .map((pattern) => `${file}: ${pattern}`);
  });

  assert.deepEqual(violations, []);
});
