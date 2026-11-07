import assert from "node:assert/strict";
import test from "node:test";
import { resolveVisualRegressionScope } from "../../scripts/resolve-visual-regression-scope.mjs";

const client = { slug: "pet-loja", componentFile: "src/components/site/PetLojaPage.tsx" };
const component = 'import "./pet-loja.css"; export function PetLojaPage() { return null; }';
const configFile = "src/config/portfolio-global-config.json";
const registryFile = "src/components/portfolio/composition/registry.ts";
const routeTreeFile = "src/routeTree.gen.ts";
const registration = '  "pet-loja": lazy(() => import("@/components/site/PetLojaPage").then((m) => ({ default: m.PetLojaPage }))),';
const base = {
  [client.componentFile]: component,
  [registryFile]: "const pages = {\n};\n",
  [configFile]: JSON.stringify({ defaults: { footer: true }, overrides: { anterior: { enabled: true } } }),
  [routeTreeFile]: "const otherRoute = unchanged;\n",
};
const head = {
  ...base,
  [registryFile]: `const pages = {\n${registration}\n};\n`,
  [configFile]: JSON.stringify({ defaults: { footer: true }, overrides: { anterior: { enabled: true }, "pet-loja": { enabled: false } } }),
};
const files = [
  "src/routes/portfolio.pet-loja.tsx",
  "src/routes/portfolio-preview.pet-loja.tsx",
  client.componentFile,
  "src/components/site/pet-loja.css",
  registryFile,
  configFile,
];
const read = (overrides = {}) => (revision, file) => (revision === "base" ? base : { ...head, ...overrides })[file] ?? null;

test("public client plus its private preview and CSS stay scoped after registration", () => {
  assert.deepEqual(resolveVisualRegressionScope(files, [client], read()), ["pet-loja"]);
});

test("catalog publication also verifies the portfolio index", () => {
  const catalog = "src/config/portfolio-catalog.json";
  const readCatalog = (revision, file) => file === catalog
    ? JSON.stringify(revision === "base" ? [{ slug: "anterior" }] : [{ slug: "anterior" }, { slug: "pet-loja" }])
    : read()(revision, file);
  assert.deepEqual(resolveVisualRegressionScope([...files, catalog], [client], readCatalog), ["pet-loja", "portfolio-index"]);
});

test("a shared default change keeps the global gate", () => {
  assert.deepEqual(resolveVisualRegressionScope(files, [client], read({
    [configFile]: JSON.stringify({ defaults: { footer: false }, overrides: { anterior: { enabled: true }, "pet-loja": {} } }),
  })), []);
});

test("another client's configuration cannot be hidden by a new registration", () => {
  assert.deepEqual(resolveVisualRegressionScope(files, [client], read({
    [configFile]: JSON.stringify({ defaults: { footer: true }, overrides: { anterior: { enabled: false }, "pet-loja": {} } }),
  })), []);
});

test("shared registry code is not treated as a client entry", () => {
  assert.deepEqual(resolveVisualRegressionScope(files, [client], read({
    [registryFile]: `const pages = {\n${registration}\n};\nchangeSharedRender();\n`,
  })), []);
});

test("canonical generated routes are scoped but altered parent routing is global", () => {
  const route = `const PortfolioPetLojaRoute = PortfolioPetLojaRouteImport.update({
  id: '/portfolio/pet-loja',
  path: '/portfolio/pet-loja',
  getParentRoute: () => rootRouteImport,
} as any)
`;
  assert.deepEqual(resolveVisualRegressionScope([...files, routeTreeFile], [client], read({
    [routeTreeFile]: base[routeTreeFile] + route,
  })), ["pet-loja"]);
  assert.deepEqual(resolveVisualRegressionScope([...files, routeTreeFile], [client], read({
    [routeTreeFile]: base[routeTreeFile] + route.replace("rootRouteImport", "anotherRouteImport"),
  })), []);
});

test("missing Git evidence and shared CSS fail closed", () => {
  assert.deepEqual(resolveVisualRegressionScope(files, [client]), []);
  assert.deepEqual(resolveVisualRegressionScope([...files, "src/styles.css"], [client], read()), []);
});

test("configuration rejection cannot fall through to the filename-only classifier", () => {
  assert.deepEqual(resolveVisualRegressionScope([
    "src/routes/portfolio.pet-loja.tsx", client.componentFile, configFile,
  ], [client], read({ [configFile]: '{"defaults":{"footer":false},"overrides":{}}' })), []);
});

test("unknown scripts and output generators retain the global gate", () => {
  for (const script of ["scripts/generate-portfolio-perf-images.mjs", "scripts/generate-portfolio-identity-assets.mjs", "scripts/unknown.mjs"]) {
    assert.deepEqual(resolveVisualRegressionScope([...files, script], [client], read()), []);
  }
});

const securityFile = "src/lib/security-headers.ts";
const frame = '  "frame-src \'self\' https://www.youtube.com",';
const securityBefore = `const directives = [\n${frame}\n  "form-action 'self'",\n];\nconst otherSecurity = true;\n`;
const securityAfter = securityBefore.replace(frame, frame.replace('com"', 'com https://form.jotform.com"'));
const formEntry = {
  clientKey: client.slug,
  status: "verified",
  publicIntake: true,
  testSubmissionVerified: true,
  url: "https://form.jotform.com/263077233917057",
};
const cspRead = (after = securityAfter, form = formEntry) => (revision, file) => {
  if (file === securityFile) return revision === "base" ? securityBefore : after;
  if (file === "src/config/portfolio-hosted-form-registry.json") return JSON.stringify({ forms: { [client.slug]: form } });
  return read()(revision, file);
};

test("exact hosted frame origin addition selects its verified consumer without a route diff", () => {
  assert.deepEqual(resolveVisualRegressionScope([securityFile], [client], cspRead()), [client.slug]);
});

test("CSP scope rejects unrelated security edits, broad origins and removals", () => {
  for (const header of [
    securityAfter.replace("otherSecurity = true", "otherSecurity = false"),
    securityAfter.replace("form-action 'self'", "form-action https:"),
    securityAfter.replace("https://form.jotform.com", "https:"),
    securityAfter.replace("https://form.jotform.com", "https://unverified.example"),
    securityAfter.replace(" https://www.youtube.com", ""),
  ]) {
    assert.deepEqual(resolveVisualRegressionScope([securityFile, client.componentFile], [client], cspRead(header)), []);
  }
});

test("unverified or unregistered hosted form cannot grant local security scope", () => {
  assert.deepEqual(resolveVisualRegressionScope([securityFile], [client], cspRead(securityAfter, { ...formEntry, status: "pending" })), []);
  assert.deepEqual(resolveVisualRegressionScope([securityFile], [], cspRead()), []);
});

test("a one-client override repair can be scoped when its route is unchanged", () => {
  assert.deepEqual(resolveVisualRegressionScope([configFile], [client], read()), [client.slug]);
});
