import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const manifest = JSON.parse(await readFile(resolve(root, "src/config/brand-integrity.json"), "utf8"));
const failures = [];
for (const [relativePath, expected] of Object.entries(manifest.files ?? {})) {
  try {
    const actual = createHash("sha256").update(await readFile(resolve(root, relativePath))).digest("hex");
    if (actual !== expected) failures.push(`${relativePath}: expected ${expected}, got ${actual}`);
  } catch (error) { failures.push(`${relativePath}: ${error.message}`); }
}
if (failures.length) {
  console.error("Brand integrity check failed. Institutional assets are protected:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Brand integrity OK (${Object.keys(manifest.files ?? {}).length} protected asset).`);
