#!/usr/bin/env node
/**
 * Resolve o menor escopo seguro para regressão visual.
 *
 * Retorna uma lista CSV de slugs somente quando TODOS os arquivos visuais
 * relevantes pertencem a portfolios individuais identificados. Se houver
 * componente compartilhado, rota, CSS global, ativo não resolvido ou qualquer
 * outra superfície visual ampla, retorna string vazia => gate global.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
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

export function resolveVisualRegressionScope(files, clients) {
  const previewScope = previewOnlyScope(files);
  if (previewScope) return previewScope;
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
    if (assetMatch && (
      knownSlugs.has(assetMatch[1]) || newRoutesOwned.has(`src/routes/portfolio.${assetMatch[1]}.tsx`)
    )) {
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
  process.stdout.write(resolveVisualRegressionScope(input, mergedClients).join(","));
}
