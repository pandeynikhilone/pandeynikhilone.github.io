import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const forbiddenCharacter = String.fromCharCode(0x2014);
const filesToCheck = ["index.html", "README.md", "package.json", "data/projects.json", "data/auto-projects.json", "vite.config.js", "public/favicon.svg"];

function collect(directory) {
  const found = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) found.push(...collect(path));
    else if (/\.(jsx|js|css|json)$/.test(entry.name)) found.push(path);
  }
  return found;
}

filesToCheck.push(...collect("src"));
for (const path of filesToCheck) {
  assert.ok(existsSync(path), "Missing required file: " + path);
  assert.ok(!readFileSync(path, "utf8").includes(forbiddenCharacter), "Forbidden em dash character found in " + path);
}

const packageConfig = JSON.parse(readFileSync("package.json", "utf8"));
const curated = JSON.parse(readFileSync("data/projects.json", "utf8"));
const discovered = JSON.parse(readFileSync("data/auto-projects.json", "utf8"));
assert.ok(Array.isArray(curated.projects), "Curated catalog must contain a projects array.");
assert.ok(Array.isArray(discovered.projects), "Automatic catalog must contain a projects array.");

const dependencies = { ...packageConfig.dependencies, ...packageConfig.devDependencies };
assert.ok(dependencies.react && dependencies["react-dom"], "React and React DOM must be installed.");
assert.ok(dependencies.vite && dependencies["@vitejs/plugin-react"], "Vite and its React plugin must be installed.");
assert.ok(!Object.keys(dependencies).some((name) => /tailwind|bootstrap/i.test(name)), "The portfolio app must not use Tailwind CSS or Bootstrap.");
const html = readFileSync("index.html", "utf8");
assert.ok(/<link\\s+rel=["']icon["'][^>]*href=["']\\.\\/favicon\\.svg\\?v=\\d+["']/i.test(html),
  "index.html must reference a versioned relative SVG favicon.");
assert.ok(readFileSync("public/favicon.svg", "utf8").includes("<svg"),
  "The public SVG favicon must contain valid SVG markup.");
console.log("Portfolio source, copy, data catalogs, and framework dependencies are valid.");
