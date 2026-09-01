#!/usr/bin/env node
/**
 * Gerador parametrizado de novos sites em /portfolio/<slug>.
 *
 * Garante, desde o primeiro commit, os itens que o playbook exige:
 *  - registro em src/config/portfolio-clients.json
 *  - chave em src/lib/portfolio-client-keys.ts
 *  - componente exclusivo do cliente (sem Header/Footer da 0WEB)
 *  - diretório próprio de assets
 *  - migration do funil individual `funnel-<slug>`
 *  - pop-up de captação + share + SEO herdados da rota /portfolio/$slug
 *
 * Uso:
 *   node scripts/scaffold-portfolio-client.mjs --slug pizzaria-do-ze \
 *     --name "Pizzaria do Zé" [--client-key pizzaria-do-ze] [--cta proposal]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

const slug = flag("slug");
const siteName = flag("name");
const ctaMode = flag("cta") ?? "proposal";
const clientKey = flag("client-key") ?? slug;
const dryRun = args.includes("--dry-run");

if (!slug || !siteName) {
  console.error("Uso: node scripts/scaffold-portfolio-client.mjs --slug <slug> --name \"<Nome>\"");
  process.exit(1);
}
if (!/^[a-z0-9][a-z0-9_-]*$/.test(slug)) {
  console.error("[scaffold] slug inválido (use minúsculas, números, - ou _)");
  process.exit(1);
}

const pascal = slug
  .split(/[-_]/)
  .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
  .join("");
const componentName = `${pascal}Page`;
const componentFile = `src/components/site/${componentName}.tsx`;
const assetsDir = `public/images/${slug}`;
const funnelSlug = `funnel-${slug}`;
const secretName = `${slug.toUpperCase().replace(/[^A-Z0-9]/g, "_")}_WHATSAPP_NUMBER`;

const written = [];
const write = (relPath, content) => {
  const full = resolve(root, relPath);
  if (existsSync(full)) {
    console.warn(`[scaffold] já existe, mantido: ${relPath}`);
    return;
  }
  if (!dryRun) {
    mkdirSync(resolve(full, ".."), { recursive: true });
    writeFileSync(full, content, "utf8");
  }
  written.push(relPath);
};

const componentSource = `import { lazy } from "react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { LazySection } from "@/components/portfolio/LazySection";

// Seções pesadas (galerias, mapas, carrosséis) entram por chunk sob demanda.
// Ver docs/PORTFOLIO_PERFORMANCE.md
// const Galeria = lazy(() => import("./${pascal}Galeria"));

/**
 * Site exclusivo de ${siteName} (/portfolio/${slug}).
 * Identidade do cliente é soberana: nada de Header/Footer/copy da 0WEB.
 * Contato é resolvido no servidor pelo clientKey — nunca no bundle público.
 */
export function ${componentName}() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main>
        <section className="mx-auto max-w-5xl px-4 py-16 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            ${siteName}
          </p>
          <h1 className="mt-3 font-display text-3xl md:text-5xl font-bold leading-tight">
            ${siteName}: uma presença digital clara para o seu público.
          </h1>
          <p className="mt-4 max-w-[65ch] text-muted-foreground">
            Conheça os serviços, a identidade e os próximos passos de ${siteName}.
          </p>
          {/* Única imagem LCP do projeto: priority. As demais ficam lazy por padrão. */}
          <PortfolioImage
            src="/images/${slug}/capa.webp"
            alt="${siteName}"
            priority
            width={1200}
            height={800}
            className="mt-8 w-full rounded-3xl object-cover"
          />

          <div className="mt-8">
            <FunnelCTAButton
              clientKey="${clientKey}"
              companySlug="${slug}"
              formSlug="${funnelSlug}"
              location="${slug}_hero"
            >
              Falar com a equipe
            </FunnelCTAButton>
          </div>
        </section>
      </main>

      {/* Exemplo de seção sob demanda:
      <LazySection minHeight={320} fallback={<div className="h-80 animate-pulse rounded-2xl bg-muted" />}>
        <Galeria />
      </LazySection>
      */}

      {/* TODO: preencher com conteúdo real do cliente antes de ativar:
      <PortfolioSocialProofPopup clientKey="${clientKey}" eyebrow="" title="" description="" ctaLabel="" ctaHref="#" /> */}
      <PortfolioHostCredit />
    </div>
  );
}
`;

const migrationName = `${new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14)}_seed_${slug.replace(/-/g, "_")}_funnel.sql`;
const migrationSource = `-- Funil individual de ${siteName} (${funnelSlug}).
-- Modelo: supabase/migrations/*_seed_paraiso_hot_dog_funnel.sql
-- Preencha as perguntas reais do cliente antes de aplicar.

insert into public.dynamic_forms (slug, name, status, description)
values ('${funnelSlug}', '${siteName}', 'published', 'Funil individual de ${siteName}')
on conflict (slug) do update
  set name = excluded.name,
      status = 'published',
      description = excluded.description;

-- TODO: inserir as etapas em public.dynamic_form_questions referenciando o form acima.
`;

write(componentFile, componentSource);
write(`${assetsDir}/.gitkeep`, "");
write(`supabase/migrations/${migrationName}`, migrationSource);

// Registro central de clientes
const registryPath = resolve(root, "src/config/portfolio-clients.json");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
if (!registry.some((c) => c.slug === slug)) {
  registry.push({
    clientKey,
    slug,
    siteName,
    routeFile: "src/routes/portfolio.$slug.tsx",
    componentFile,
    assetsDir,
    ctaMode,
    socialProofRequired: true,
    hostCaptureRequired: true,
  });
  if (!dryRun) writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`, "utf8");
  written.push("src/config/portfolio-clients.json");
}

// Allowlist de client keys
const keysPath = resolve(root, "src/lib/portfolio-client-keys.ts");
if (existsSync(keysPath)) {
  const source = readFileSync(keysPath, "utf8");
  if (!source.includes(`"${clientKey}"`)) {
    const patched = source.replace(/(\[\s*)/, `$1\n  "${clientKey}",`);
    if (!dryRun) writeFileSync(keysPath, patched, "utf8");
    written.push("src/lib/portfolio-client-keys.ts");
  }
}

console.log(`\n[scaffold] ${siteName} → /portfolio/${slug}`);
for (const file of written) console.log(`  + ${file}`);

console.log(`
Próximos passos obrigatórios (docs/PORTFOLIO_NEW_CLIENT_PLAYBOOK.md):
  1. Registrar o site em src/lib/portfolio-site-registry.ts (sitemap + SEO + card).
  2. Ligar o branch "${slug}" em src/routes/portfolio.$slug.tsx.
  3. Preencher a migration supabase/migrations/${migrationName} com as etapas reais.
  4. Cadastrar o secret privado ${secretName} (somente servidor).
  5. Adicionar imagens reais em ${assetsDir}.
  6. Otimizar imagens em .webp e manter apenas 1 imagem priority (docs/PORTFOLIO_PERFORMANCE.md).
  7. Rodar: bun run validate:portfolio-performance && bun run validate:portfolio-boundaries && bun run validate:portfolio-meta && bun test && bun run build

Herdados automaticamente pela rota compartilhada: pop-up de captação da 0WEB,
botão de compartilhamento, SEO base, breadcrumbs e JSON-LD.
`);
