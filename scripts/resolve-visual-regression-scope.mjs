#!/usr/bin/env node
/**
 * Resolve o menor escopo seguro para regressão visual.
 *
 * Retorna uma lista CSV de slugs somente quando TODOS os arquivos visuais
 * relevantes pertencem a portfolios individuais registrados. Se houver
 * componente compartilhado, rota, CSS global, ativo não resolvido ou qualquer
 * outra superfície visual ampla, retorna string vazia => gate global.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

function normalize(file) {
  return String(file ?? "").trim().replace(/\\/g, "/");
}

export function routeComponentClients(routeSource) {
  const source = String(routeSource ?? "");
  const imports = new Map();

  for (const match of source.matchAll(
    /const\s+(\w+)\s*=\s*lazy\(\(\)\s*=>\s*import\("(@\/components\/site\/[^"]+)"\)/gs,
  )) {
    const [, symbol, importPath] = match;
    imports.set(symbol, importPath.replace(/^@\//, "src/") + ".tsx");
  }

  const resolved = [];
  for (const match of source.matchAll(/slug\s*===\s*"([^"]+)"\s*\?\s*\(\s*<(\w+)/gs)) {
    const [, slug, symbol] = match;
    const componentFile = imports.get(symbol);
    if (componentFile) resolved.push({ slug, componentFile });
  }

  return resolved;
}

export function compositionRegistryClients(registrySource) {
  const source = String(registrySource ?? "");
  const resolved = [];
  for (const match of source.matchAll(
    /"([a-z0-9-]+)"\s*:\s*lazy\(\(\)\s*=>\s*import\("(@\/components\/site\/[A-Za-z0-9_-]+)"\)/gs,
  )) {
    const [, slug, importPath] = match;
    resolved.push({ slug, componentFile: importPath.replace(/^@\//, "src/") + ".tsx" });
  }
  return resolved;
}

function isBroadVisualFile(file) {
  return (
    file.startsWith("src/components/") ||
    file.startsWith("src/pages/") ||
    file.startsWith("src/styles/") ||
    file.startsWith("src/assets/") ||
    file.startsWith("src/routes/") ||
    file.startsWith("public/") ||
    /\.(?:css|scss)$/.test(file) ||
    /^tailwind/.test(file) ||
    /^vite\.config/.test(file) ||
    file === "bun.lock"
  );
}

const LOCAL_DIRECTORY_FILES = new Set([
  "src/components/portfolio/PortfolioSeoNetwork.tsx",
  "src/lib/portfolio-place-directory.ts",
  "src/lib/portfolio-places.ts",
  "src/lib/portfolio-seo-network.ts",
  "src/routes/portfolio-em.$local.tsx",
]);

// Casos representativos estáveis para a família local-first:
// - Jardim Itália: bairro com categorias distintas;
// - Mirassol/Guaratuba: fallback por cidade fora do cluster principal.
// Os thresholds continuam idênticos; este escopo só evita cobrar dívida
// histórica de páginas que o diff local-directory não toca.
const LOCAL_DIRECTORY_REPRESENTATIVE_SLUGS = [
  "ag-electrical-services",
  "marmitaria-dom-diego",
  "mirassol-conserta-celular",
  "guaratuba-oficina-nautica",
];

function portfolioIndexScope(files) {
  const relevant = files
    .map(normalize)
    .filter(Boolean)
    .filter(
      (file) =>
        !file.startsWith("tests/") &&
        file !== "scripts/resolve-visual-regression-scope.mjs" &&
        file !== ".lighthouserc.cjs",
    );

  if (!relevant.length) return null;
  return relevant.every((file) => file === "src/routes/portfolio.index.tsx")
    ? ["portfolio-index"]
    : null;
}

function localDirectoryRepresentativeScope(files) {
  const relevant = files
    .map(normalize)
    .filter(Boolean)
    .filter(
      (file) =>
        !file.startsWith("tests/") &&
        file !== "scripts/resolve-visual-regression-scope.mjs",
    );

  if (!relevant.length) return null;
  if (!relevant.every((file) => LOCAL_DIRECTORY_FILES.has(file))) return null;

  const exercisesLocalDirectory =
    relevant.includes("src/routes/portfolio-em.$local.tsx") ||
    relevant.includes("src/lib/portfolio-seo-network.ts") ||
    relevant.includes("src/components/portfolio/PortfolioSeoNetwork.tsx");

  return exercisesLocalDirectory ? [...LOCAL_DIRECTORY_REPRESENTATIVE_SLUGS] : null;
}

/**
 * Reconhece uma PR que cria APENAS uma prévia independente não indexável,
 * mantendo todo o gate sobre a PRÉVIA (e não sobre ~100 páginas antigas).
 *
 * A rota deve ser nova, carregar um componente exclusivo e CSS exclusivo.
 * Qualquer outro componente/rota/config de cliente continua impondo gate global.
 * Os arquivos de infraestrutura listados são os próprios mecanismos que
 * permitem o teste de prévias, não código de renderização compartilhado.
 */
export function previewOnlyScope(files) {
  const names = files.map(normalize).filter(Boolean);
  const routes = names.filter((file) => /^src\/routes\/portfolio-preview\.[a-z0-9-]+\.tsx$/.test(file));
  if (routes.length !== 1) return null;
  const route = routes[0];
  const slug = route.match(/^src\/routes\/portfolio-preview\.([a-z0-9-]+)\.tsx$/)?.[1];
  if (!slug) return null;

  let source, componentSource;
  try {
    source = readFileSync(resolve(process.cwd(), route), "utf8");
  } catch {
    return null;
  }
  const match = source.match(/from\s+["']@\/components\/site\/([A-Za-z0-9_-]+)["']/);
  if (!match) return null;
  const component = `src/components/site/${match[1]}.tsx`;
  try {
    componentSource = readFileSync(resolve(process.cwd(), component), "utf8");
  } catch {
    return null;
  }
  const cssMatch = componentSource.match(/import\s+["']\.\/([a-z0-9-]+\.css)["']/);
  if (!cssMatch) return null;
  const css = `src/components/site/${cssMatch[1]}`;

  // Qualquer arquivo fora desta allowlist retorna null (gate global).
  const permitted = new Set([
    route, component, css, "src/routeTree.gen.ts",
    `docs/portfolio/drafts/${slug}-pilot.md`,
    "scripts/resolve-visual-regression-scope.mjs",
    "scripts/playwright-visual-regression.mjs",
    ".lighthouserc.cjs",
    ".github/workflows/lighthouse.yml",
    ".github/workflows/portfolio-gates.yml",
    "tests/portfolio/preview-route-scope.test.mjs",
  ]);
  if (!names.every((name) => permitted.has(name))) return null;

  // A rota deve declarar privacidade e negar produção. Não confiar só em nome.
  if (!source.includes("noindex,nofollow") ||
      !source.includes("throw notFound()") ||
      !source.includes("VERCEL_ENV")) return null;
  return [`preview-${slug}`];
}

const CLIENT_COLLECTIONS = {
  "portfolio-admin-seed": "projects",
  "portfolio-assets": "clients",
  "portfolio-catalog": null,
  "portfolio-clients": null,
  "portfolio-cover-status": "projects",
  "portfolio-discovery": "projects",
  "portfolio-funnel-context": null,
  "portfolio-funnel-destinations": "entries",
  "portfolio-global-config": "overrides",
  "portfolio-hosted-form-registry": "forms",
  "portfolio-identity-contracts": "contracts",
  "portfolio-motion-profiles": "overrides",
  "portfolio-project-manifests": "projects",
  "portfolio-share-copy": null,
  "portfolio-visual-review": null,
  "portfolio-whatsapp": "contacts",
};

// Validation and QA do not generate assets or alter the built site's markup.
// Unknown scripts (including every build/output generator) retain global scope.
const NON_RENDERING_SCRIPTS = new Set([
  "scripts/check-portfolio-funnel-operational.mjs",
  "scripts/check-portfolio-landing-quality.mjs",
  "scripts/check-portfolio-project-readiness.mjs",
  "scripts/playwright-visual-regression.mjs",
  "scripts/portfolio-conformance.mjs",
  "scripts/resolve-visual-regression-scope.mjs",
  "scripts/validate-portfolio-boundaries.mjs",
  "scripts/validate-portfolio-scaffold.mjs",
  "scripts/verify-agropet-portfolio.mjs",
]);

function withoutClients(value, slugs) {
  if (Array.isArray(value)) {
    return value.filter((entry) => !slugs.has(entry?.slug || entry?.clientKey));
  }
  return Object.fromEntries(Object.entries(value || {}).filter(([key]) => !slugs.has(key)));
}

function clientConfigOnly(file, before, after, slugs) {
  const name = file.match(/^src\/config\/(portfolio-[a-z-]+)\.json$/)?.[1];
  if (!Object.hasOwn(CLIENT_COLLECTIONS, name)) return false;
  const collection = CLIENT_COLLECTIONS[name];
  const strip = (source) => {
    const value = source == null ? {} : JSON.parse(source);
    if (!collection) return withoutClients(value, slugs);
    // Generated cover counts are derived from the per-project records.
    if (name === "portfolio-cover-status") {
      delete value.summary;
      delete value.generatedAt;
    }
    value[collection] = withoutClients(value[collection], slugs);
    return value;
  };
  try {
    if (before == null) {
      const value = JSON.parse(after);
      // A newly introduced registry must contain only the scoped clients.
      return name === "portfolio-hosted-form-registry" &&
        Object.keys(withoutClients(value.forms, slugs)).length === 0 &&
        Object.keys(value).every((key) => ["version", "description", "forms"].includes(key));
    }
    return JSON.stringify(strip(before)) === JSON.stringify(strip(after));
  } catch {
    return false;
  }
}

function changedClientConfigSlugs(file, before, after) {
  const name = file.match(/^src\/config\/(portfolio-[a-z-]+)\.json$/)?.[1];
  if (!Object.hasOwn(CLIENT_COLLECTIONS, name)) return [];
  const entries = (source) => {
    const value = source == null ? {} : JSON.parse(source);
    const collection = CLIENT_COLLECTIONS[name];
    const values = collection ? value[collection] : value;
    return Array.isArray(values)
      ? Object.fromEntries(values.map((entry) => [entry?.slug || entry?.clientKey, entry]))
      : values || {};
  };
  try {
    const oldEntries = entries(before), newEntries = entries(after);
    return [...new Set([...Object.keys(oldEntries), ...Object.keys(newEntries)])]
      .filter((slug) => JSON.stringify(oldEntries[slug]) !== JSON.stringify(newEntries[slug]));
  } catch {
    return [];
  }
}

/** Only an exact additive frame origin for a verified hosted form is local. */
function hostedFrameCspClients(before, after, forms) {
  if (before == null || after == null) return null;
  const pattern = /^\s*"frame-src ([^"]+)",?\s*$/gm;
  const oldDirectives = [...before.matchAll(pattern)];
  const newDirectives = [...after.matchAll(pattern)];
  if (oldDirectives.length !== 1 || newDirectives.length !== 1) return null;
  const oldSources = oldDirectives[0][1].split(/\s+/);
  const newSources = newDirectives[0][1].split(/\s+/);
  const added = newSources.filter((source) => !oldSources.includes(source));
  if (!added.length || new Set(newSources).size !== newSources.length) return null;
  if (JSON.stringify(newSources.filter((source) => !added.includes(source))) !== JSON.stringify(oldSources)) return null;
  const matched = [];
  for (const origin of added) {
    try {
      const url = new URL(origin);
      if (url.protocol !== "https:" || url.origin !== origin) return null;
    } catch { return null; }
    const clients = Object.entries(forms || {}).filter(([slug, form]) => {
      try {
        return form.clientKey === slug && form.status === "verified" && form.publicIntake === true &&
          form.testSubmissionVerified === true && new URL(form.url).origin === origin;
      } catch { return false; }
    }).map(([slug]) => slug);
    if (!clients.length) return null;
    matched.push(...clients);
  }
  const withoutComments = (source) => source.replace(/\r\n/g, "\n").split("\n")
    .filter((line) => !line.trim().startsWith("//")).join("\n");
  const restored = after.replace(newDirectives[0][0], oldDirectives[0][0]);
  return withoutComments(before) === withoutComments(restored) ? matched : null;
}

function stripGeneratedRoutes(source, clients) {
  let result = source || "";
  for (const { slug } of clients) {
    const symbol = slug.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("");
    for (const prefix of ["Portfolio", "PortfolioPreview"]) {
      const route = `${prefix}${symbol}Route`;
      const path = `${prefix === "PortfolioPreview" ? "portfolio-preview" : "portfolio"}/${slug}`;
      result = result
        .replace(new RegExp(`^const ${route} =\\s*${route}Import\\.update\\(\\{\\s*id: '/${path}',\\s*path: '/${path}',\\s*getParentRoute: \\(\\) => rootRouteImport,\\s*} as any\\)\\r?\\n`, "gm"), "")
        .replace(new RegExp(`^    '/${path}': \\{\\s*id: '/${path}'\\s*path: '/${path}'\\s*fullPath: '/${path}'\\s*preLoaderRoute: typeof ${route}Import\\s*parentRoute: typeof rootRouteImport\\s*}\\r?\\n`, "gm"), "")
        .split(/\r?\n/)
        .filter((line) => ![
          `import { Route as ${route}Import } from './routes/${prefix === "PortfolioPreview" ? "portfolio-preview" : "portfolio"}.${slug}'`,
          `  '/${path}': typeof ${route}`,
          `    | '/${path}'`,
          `  ${route}: typeof ${route}`,
          `  ${route}: ${route},`,
        ].includes(line))
        .join("\n");
    }
  }
  return result;
}

/**
 * Publicação de um cliente também modifica registros compartilhados e o catálogo.
 * Só escopa quando o diff de cada registro prova que os demais clientes/defaults
 * permanecem iguais. Sem revisões Git (ou com qualquer mudança ampla), fail closed.
 */
export function registeredPortfolioScope(files, clients, readRevision) {
  if (!readRevision) return null;
  const names = files.map(normalize).filter(Boolean);
  const affected = new Set();
  for (const file of names) {
    const config = file.match(/^src\/config\/(portfolio-[a-z-]+)\.json$/)?.[1];
    if (!Object.hasOwn(CLIENT_COLLECTIONS, config)) continue;
    for (const slug of changedClientConfigSlugs(file, readRevision("base", file), readRevision("head", file))) affected.add(slug);
  }
  let cspClients = null;
  if (names.includes("src/lib/security-headers.ts")) {
    let forms;
    try { forms = JSON.parse(readRevision("head", "src/config/portfolio-hosted-form-registry.json")).forms; } catch { return null; }
    cspClients = hostedFrameCspClients(readRevision("base", "src/lib/security-headers.ts"), readRevision("head", "src/lib/security-headers.ts"), forms);
    if (!cspClients) return null;
    if (!cspClients.every((slug) => clients.some((client) => client.slug === slug))) return null;
    for (const slug of cspClients) affected.add(slug);
  }
  const candidates = clients.filter((client) => affected.has(client.slug) ||
    names.includes(`src/routes/portfolio.${client.slug}.tsx`) || names.includes(normalize(client.componentFile)));
  if (!candidates.length) return null;
  const slugs = new Set(candidates.map(({ slug }) => slug));
  const permitted = new Set();
  for (const client of candidates) {
    permitted.add(normalize(client.componentFile));
    permitted.add(`src/routes/portfolio.${client.slug}.tsx`);
    permitted.add(`src/routes/portfolio-preview.${client.slug}.tsx`);
    const source = readRevision("head", normalize(client.componentFile));
    for (const match of (source || "").matchAll(/import\s+["']\.\/([a-z0-9-]+\.css)["']/g)) {
      permitted.add(`src/components/site/${match[1]}`);
    }
  }
  let indexChanged = false;
  for (const file of names) {
    if (permitted.has(file) || candidates.some(({ slug }) => file.startsWith(`public/images/${slug}/`))) continue;
    if (file === "src/lib/security-headers.ts" && cspClients) continue;
    if (file.startsWith("docs/") || file.startsWith("tests/") || NON_RENDERING_SCRIPTS.has(file) ||
        file.startsWith(".github/") || file === ".lighthouserc.cjs" || file.endsWith(".test.ts") ||
        // Validation vocabulary is read by scaffold/originality scripts only.
        file === "src/config/portfolio-structural-families.json") continue;
    const before = readRevision("base", file);
    const after = readRevision("head", file);
    if (file.startsWith("src/config/") && file.endsWith(".json")) {
      if (!clientConfigOnly(file, before, after, slugs)) return null;
      if (/portfolio-(catalog|admin-seed|cover-status|discovery)\.json$/.test(file)) indexChanged = true;
      continue;
    }
    if (file === "src/routeTree.gen.ts") {
      if (stripGeneratedRoutes(before, candidates) !== stripGeneratedRoutes(after, candidates)) return null;
      continue;
    }
    // Registration-only TS files are intentionally restricted to whole-line
    // entries. A changed import, shared function or other client's entry fails.
    const patterns = {
      "src/components/portfolio/composition/registry.ts": /^\s*"([a-z0-9-]+)": lazy\(\(\) => import\("@\/components\/site\/[A-Za-z0-9_-]+"\)\.then\(\(m\) => \(\{ default: m\.[A-Za-z0-9_]+ }\)\)\),?\s*$/,
      "src/config/portfolio-authorial-compositions.ts": /^\s*"([a-z0-9-]+)",?\s*$/,
      "src/lib/portfolio-client-keys.ts": /^\s*"([a-z0-9-]+)",?\s*$/,
      "src/lib/portfolio-site-registry.ts": /^\s*\{ slug: "([a-z0-9-]+)", .* },?\s*$/,
    };
    const pattern = patterns[file];
    if (!pattern) return null;
    const strip = (source) => (source || "").split(/\r?\n/).filter((line) => {
      const slug = line.match(pattern)?.[1];
      return !slug || !slugs.has(slug);
    }).join("\n");
    if (strip(before) !== strip(after)) return null;
    if (file === "src/lib/portfolio-site-registry.ts") indexChanged = true;
  }
  return [...slugs, ...(indexChanged ? ["portfolio-index"] : [])].sort();
}

/**
 * Individual newly authored demo pages can be tested without re-running
 * historical clients, but only when an exact local route → component → CSS
 * triplet is present. Any shared UI diff remains global.
 */
function dedicatedNewClientFiles(files, clients) {
  const knownSlugs = new Set(clients.map((item) => item?.slug).filter(Boolean));
  const registeredComponents = new Set(clients.map((item) => normalize(item?.componentFile)).filter(Boolean));
  const routesDir = resolve(process.cwd(), "src/routes");
  const owned = new Map();

  // A rota independente pode existir há meses: atualizar apenas seu JSX/CSS
  // deve continuar testando ESSE site, em vez de ~100 portfólios não alterados.
  const candidates = readdirSync(routesDir)
    .map((name) => name.match(/^portfolio\.([a-z0-9-]+)\.tsx$/))
    .filter(Boolean)
    .map((match) => match[1])
    .filter((slug) => !knownSlugs.has(slug));

  const discovered = [];
  const byComponent = new Map();
  const byCss = new Map();
  for (const slug of candidates) {
    const routeFile = `src/routes/portfolio.${slug}.tsx`;
    const routeSource = readFileSync(resolve(process.cwd(), routeFile), "utf8");
    const refs = [...routeSource.matchAll(/from ["']@\/components\/site\/([A-Za-z0-9_-]+)["']/g)];
    if (refs.length !== 1) continue;
    const component = `src/components/site/${refs[0][1]}.tsx`;
    if (registeredComponents.has(component) || !existsSync(resolve(process.cwd(), component))) continue;
    const jsxSource = readFileSync(resolve(process.cwd(), component), "utf8");
    const cssRefs = [...jsxSource.matchAll(/import ["']\.\/([a-zA-Z0-9_-]+\.css)["']/g)];
    if (cssRefs.length !== 1) continue;
    const stylesheet = `src/components/site/${cssRefs[0][1]}`;
    if (!existsSync(resolve(process.cwd(), stylesheet))) continue;
    discovered.push({ routeFile, component, stylesheet, slug });
    byComponent.set(component, (byComponent.get(component) ?? 0) + 1);
    byCss.set(stylesheet, (byCss.get(stylesheet) ?? 0) + 1);
  }

  for (const item of discovered) {
    // Uma composição reaproveitada deixa de ser exclusiva: fail closed.
    if (byComponent.get(item.component) !== 1 || byCss.get(item.stylesheet) !== 1) continue;
    owned.set(item.routeFile, item.slug);
    owned.set(item.component, item.slug);
    owned.set(item.stylesheet, item.slug);
  }
  return owned;
}

export function resolveVisualRegressionScope(files, clients, readRevision) {
  // This guard also covers asset-only changes, which have no registration
  // candidate and would otherwise reach the filename-only fallback below.
  if (files.map(normalize).some((file) => file.startsWith("scripts/") && !NON_RENDERING_SCRIPTS.has(file))) {
    return [];
  }
  const previewScope = previewOnlyScope(files);
  if (previewScope) return previewScope;
  const registeredScope = registeredPortfolioScope(files, clients, readRevision);
  if (registeredScope) return registeredScope;
  if (readRevision && (files.map(normalize).includes("src/lib/security-headers.ts") ||
      clients.some(({ slug, componentFile }) => files.map(normalize).includes(`src/routes/portfolio.${slug}.tsx`) ||
        files.map(normalize).includes(normalize(componentFile))))) {
    return [];
  }
  const indexScope = portfolioIndexScope(files);
  if (indexScope) return indexScope;

  const localDirectoryScope = localDirectoryRepresentativeScope(files);
  if (localDirectoryScope) return localDirectoryScope;

  const byComponent = new Map(
    clients
      .filter((client) => client?.componentFile && client?.slug)
      .map((client) => [normalize(client.componentFile), client.slug]),
  );
  const knownSlugs = new Set(clients.map((client) => client?.slug).filter(Boolean));
  const newRoutesOwned = dedicatedNewClientFiles(files, clients);
  const scoped = new Set();
  let sawVisualFile = false;

  for (const raw of files) {
    const file = normalize(raw);
    if (!file) continue;

    // Generated routeTree changes are scoped ONLY in presence of a
    // verified dedicated route and its exclusive component and CSS.
    const changedOwnedRoute = files.some((candidate) =>
      /^src\/routes\/portfolio\.[a-z0-9-]+\.tsx$/.test(normalize(candidate)) &&
      newRoutesOwned.has(normalize(candidate)),
    );
    if (file === "src/routeTree.gen.ts") {
      if (changedOwnedRoute) continue;
      return []; // Rotas geradas sem sua rota exclusiva alterada: gate global.
    }

    const newClientSlug = newRoutesOwned.get(file);
    if (newClientSlug) {
      sawVisualFile = true;
      scoped.add(newClientSlug);
      continue;
    }

    const componentSlug = byComponent.get(file);
    if (componentSlug) {
      sawVisualFile = true;
      scoped.add(componentSlug);
      continue;
    }

    // Uma rota dedicada e registrada afeta só seu portfólio; rotas genéricas
    // (como portfolio.$slug.tsx) continuam sujeitas ao gate global.
    const dedicatedRoute = file.match(/^src\/routes\/portfolio\.([a-z0-9-]+)\.tsx$/);
    if (dedicatedRoute && knownSlugs.has(dedicatedRoute[1])) {
      sawVisualFile = true;
      scoped.add(dedicatedRoute[1]);
      continue;
    }

    const assetMatch = file.match(/^public\/images\/([^/]+)\//);
    if (assetMatch && knownSlugs.has(assetMatch[1])) {
      sawVisualFile = true;
      scoped.add(assetMatch[1]);
      continue;
    }

    if (isBroadVisualFile(file)) {
      // Há impacto visual que não pode ser atribuído com segurança a um único
      // portfolio. String vazia preserva o comportamento global existente.
      return [];
    }
  }

  return sawVisualFile ? [...scoped].sort() : [];
}

const invokedAsScript =
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (invokedAsScript) {
  const clients = JSON.parse(
    readFileSync(resolve(process.cwd(), "src/config/portfolio-clients.json"), "utf8"),
  );
  const routeClients = routeComponentClients(
    readFileSync(resolve(process.cwd(), "src/routes/portfolio.$slug.tsx"), "utf8"),
  );
  const compositionClients = compositionRegistryClients(
    readFileSync(resolve(process.cwd(), "src/components/portfolio/composition/registry.ts"), "utf8"),
  );
  const mergedClients = [...clients];
  for (const discovered of [...routeClients, ...compositionClients]) {
    if (!mergedClients.some(
      (client) =>
        client?.slug === discovered.slug ||
        normalize(client?.componentFile) === normalize(discovered.componentFile),
    )) {
      mergedClients.push(discovered);
    }
  }
  const input = readFileSync(0, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const [base, head] = process.argv.slice(2);
  const revisionCache = new Map();
  const readRevision = base && head ? (revision, file) => {
    const key = `${revision}:${file}`;
    if (revisionCache.has(key)) return revisionCache.get(key);
    try {
      const source = execFileSync("git", ["show", `${revision === "base" ? base : head}:${file}`],
        { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 8 * 1024 * 1024 });
      revisionCache.set(key, source);
      return source;
    } catch {
      revisionCache.set(key, null);
      return null;
    }
  } : undefined;
  process.stdout.write(resolveVisualRegressionScope(input, mergedClients, readRevision).join(","));
}
