#!/usr/bin/env node
import { execFileSync } from "node:child_process";

const [base, head] = process.argv.slice(2);
if (!base || !head) process.exit(2);

const git = (...args) =>
  execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();

const files = git("diff", "--name-only", base, head)
  .split("\n")
  .map((value) => value.trim())
  .filter(Boolean);

const allowedCiFiles = new Set([
  ".github/workflows/lighthouse.yml",
  ".github/workflows/portfolio-gates.yml",
  "scripts/resolve-framework-compat-scope.mjs",
]);
const isAllowedFile = (file) =>
  file === "package.json" ||
  file === "bun.lock" ||
  allowedCiFiles.has(file) ||
  /^src\/routes\/.*\.tsx$/.test(file);

if (
  !files.includes("package.json") ||
  !files.includes("bun.lock") ||
  files.some((file) => !isAllowedFile(file))
) {
  process.exit(0);
}

const readJsonAt = (ref, file) => JSON.parse(git("show", `${ref}:${file}`));
const basePackage = readJsonAt(base, "package.json");
const headPackage = readJsonAt(head, "package.json");

const tanstackKeys = [
  "@tanstack/query-core",
  "@tanstack/react-query",
  "@tanstack/react-router",
  "@tanstack/react-router-ssr-query",
  "@tanstack/react-start",
  "@tanstack/router-plugin",
];

const withoutTanstackUpgrade = (pkg) => {
  const clone = structuredClone(pkg);
  clone.dependencies = { ...(clone.dependencies || {}) };
  for (const key of tanstackKeys) delete clone.dependencies[key];
  return clone;
};

if (
  JSON.stringify(withoutTanstackUpgrade(basePackage)) !==
  JSON.stringify(withoutTanstackUpgrade(headPackage))
) {
  process.exit(0);
}

const expected = {
  "@tanstack/query-core": "5.102.0",
  "@tanstack/react-query": "5.102.0",
  "@tanstack/react-router": "1.170.41",
  "@tanstack/react-router-ssr-query": "1.167.3",
  "@tanstack/react-start": "1.168.60",
  "@tanstack/router-plugin": "1.168.42",
};
if (tanstackKeys.some((key) => headPackage.dependencies?.[key] !== expected[key])) {
  process.exit(0);
}

const routeDiff = git("diff", "--unified=0", base, head, "--", "src/routes");
const changedRouteLines = routeDiff
  .split("\n")
  .filter((line) => /^[+-]/.test(line) && !/^(---|\+\+\+)/.test(line))
  .map((line) => line.slice(1));

const allowedRouteChange = (line) =>
  /errorComponent/.test(line) ||
  /error:\s*(Error|unknown)/.test(line) ||
  /error\??\.(message|name)/.test(line) ||
  /String\(error\)/.test(line) ||
  /normalizedError/.test(line) ||
  /function ErrorComponent/.test(line);

if (changedRouteLines.some((line) => !allowedRouteChange(line))) {
  process.exit(0);
}

process.stdout.write("framework\n");
