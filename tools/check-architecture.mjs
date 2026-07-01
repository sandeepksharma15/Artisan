import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const packagesRoot = path.join(rootDir, "packages", "@craftcss");

const packageOrder = [
  "@craftcss/tokens",
  "@craftcss/foundation",
  "@craftcss/layouts",
  "@craftcss/utilities",
  "@craftcss/components",
  "@craftcss/artisan",
];

const packageNames = new Set(packageOrder);
const orderIndex = new Map(packageOrder.map((name, index) => [name, index]));

const errors = [];

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function walkFiles(dirPath, predicate, bucket = []) {
  for (const entry of readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, predicate, bucket);
      continue;
    }
    if (predicate(fullPath)) {
      bucket.push(fullPath);
    }
  }
  return bucket;
}

function collectLocalCraftDependencies(manifest) {
  const fields = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];
  const localDeps = [];

  for (const field of fields) {
    const deps = manifest[field] ?? {};
    for (const depName of Object.keys(deps)) {
      if (depName.startsWith("@craftcss/")) {
        localDeps.push({ depName, source: `package.json:${field}` });
      }
    }
  }

  return localDeps;
}

function assertDownwardDependency(pkgName, depName, source) {
  if (!packageNames.has(depName)) {
    errors.push(`${pkgName}: unknown internal dependency ${depName} found in ${source}`);
    return;
  }

  const pkgPos = orderIndex.get(pkgName);
  const depPos = orderIndex.get(depName);
  if (depPos > pkgPos) {
    errors.push(
      `${pkgName}: upward dependency to ${depName} is not allowed (${source}). Dependencies must flow downward only.`
    );
  }
}

function collectImports(filePath) {
  const source = readFileSync(filePath, "utf8");
  const imports = new Set();
  const patterns = [
    /\bfrom\s+["'](@craftcss\/[^"']+)["']/g,
    /\bimport\s+["'](@craftcss\/[^"']+)["']/g,
    /@import\s+["'](@craftcss\/[^"']+)["']/g,
  ];

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      imports.add(match[1]);
    }
  }

  return [...imports];
}

for (const packageName of packageOrder) {
  const shortName = packageName.split("/")[1];
  const packageDir = path.join(packagesRoot, shortName);
  const manifestPath = path.join(packageDir, "package.json");
  const tsconfigPath = path.join(packageDir, "tsconfig.json");
  const tsEntryPath = path.join(packageDir, "src", "index.ts");
  const cssEntryPath = path.join(packageDir, "src", "index.css");

  if (!existsSync(packageDir)) {
    errors.push(`Missing package directory: ${packageDir}`);
    continue;
  }

  if (!existsSync(manifestPath)) {
    errors.push(`${packageName}: missing package.json`);
    continue;
  }

  const manifest = readJson(manifestPath);
  if (manifest.name !== packageName) {
    errors.push(`${manifestPath}: expected name ${packageName} but found ${manifest.name}`);
  }

  const requiredScripts = ["build", "dev", "lint", "test", "typecheck"];
  for (const scriptName of requiredScripts) {
    if (!manifest.scripts?.[scriptName]) {
      errors.push(`${packageName}: missing scripts.${scriptName}`);
    }
  }

  if (!manifest.exports?.["."]) {
    errors.push(`${packageName}: missing exports["."] contract`);
  }

  if (manifest.exports?.["./styles.css"] !== "./src/index.css") {
    errors.push(`${packageName}: exports["./styles.css"] must point to ./src/index.css`);
  }

  const filesField = manifest.files ?? [];
  if (!filesField.includes("dist") || !filesField.includes("src/index.css")) {
    errors.push(`${packageName}: files must include dist and src/index.css`);
  }

  if (!existsSync(tsEntryPath)) {
    errors.push(`${packageName}: missing public TS entry at src/index.ts`);
  }
  if (!existsSync(cssEntryPath)) {
    errors.push(`${packageName}: missing public CSS entry at src/index.css`);
  }

  const declaredDeps = collectLocalCraftDependencies(manifest);
  for (const dep of declaredDeps) {
    assertDownwardDependency(packageName, dep.depName, dep.source);
  }

  if (existsSync(tsconfigPath)) {
    const tsconfig = readJson(tsconfigPath);
    const references = tsconfig.references ?? [];
    for (const reference of references) {
      const referencePath = reference?.path;
      if (typeof referencePath !== "string") {
        continue;
      }

      const normalized = referencePath.replace(/\\/g, "/");
      const refName = normalized.split("/").pop();
      if (!refName) {
        continue;
      }
      const depName = `@craftcss/${refName}`;

      if (packageNames.has(depName)) {
        assertDownwardDependency(
          packageName,
          depName,
          `tsconfig.json:references -> ${referencePath}`
        );
      }
    }
  }

  const srcDir = path.join(packageDir, "src");
  if (existsSync(srcDir) && statSync(srcDir).isDirectory()) {
    const sourceFiles = walkFiles(
      srcDir,
      (filePath) =>
        filePath.endsWith(".ts") ||
        filePath.endsWith(".tsx") ||
        filePath.endsWith(".js") ||
        filePath.endsWith(".mjs") ||
        filePath.endsWith(".css")
    );

    for (const filePath of sourceFiles) {
      const imports = collectImports(filePath);
      for (const imported of imports) {
        const segments = imported.split("/");
        const depName = segments.length >= 2 ? `${segments[0]}/${segments[1]}` : imported;
        if (packageNames.has(depName)) {
          const relativePath = path.relative(rootDir, filePath).replace(/\\/g, "/");
          assertDownwardDependency(packageName, depName, relativePath);
        }
      }
    }
  }
}

if (errors.length > 0) {
  console.error("CraftCss architecture checks failed:\n");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("CraftCss architecture checks passed.");
