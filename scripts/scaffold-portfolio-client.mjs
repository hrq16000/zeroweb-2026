#!/usr/bin/env node
/**
 * Gerador parametrizado de novos sites em /portfolio/<slug>.
 *
 * V2: o scaffold cria infraestrutura, NÃO um template visual pronto.
 * Ele gera:
 *  - registro em src/config/portfolio-clients.json
 *  - chave em src/lib/portfolio-client-keys.ts
 *  - workbench não publicável até direção criativa ser concluída
 *  - creative brief obrigatório
 *  - diretório próprio de assets
 *  - migration do funil individual em DRAFT
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
const normalizedClientKey = clientKey.toUpperCase().replace(/[^A-Z0-9]+/g, "_");
const secretName = `PORTFOLIO_WHATSAPP_${normalizedClientKey}`;
const creativeBriefFile = `docs/portfolio/briefs/${slug}.md`;

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

const componentSource = `import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";

/**
 * WORKBENCH de ${siteName} (/portfolio/${slug}).
 *
 * NÃO PUBLICAR enquanto data-portfolio-scaffold="CREATIVE_BRIEF_REQUIRED" existir.
 * Antes do layout, preencher ${creativeBriefFile} e seguir
 * docs/PORTFOLIO_CREATIVE_DIRECTION_STANDARD.md.
 */
export function ${componentName}() {
  return (
    <div
      data-client-slug="${slug}"
      data-portfolio-scaffold="CREATIVE_BRIEF_REQUIRED"
      className="min-h-dvh bg-background text-foreground"
    >
      <main>
        <section aria-labelledby="${slug}-workbench-title" className="mx-auto max-w-3xl px-4 py-20 md:py-28">
          <p className="text-sm font-medium text-muted-foreground">Direção criativa pendente</p>
          <h1 id="${slug}-workbench-title" className="mt-3 text-3xl font-semibold md:text-5xl">
            ${siteName}
          </h1>
          <p className="mt-5 max-w-[65ch] text-muted-foreground">
            Este componente é somente a base técnica. Substitua esta composição por uma direção autoral do cliente antes de publicar.
          </p>
          <div className="mt-8 transition-opacity">
            <FunnelCTAButton
              clientKey="${clientKey}"
              companySlug="${slug}"
              formSlug="${funnelSlug}"
              location="${slug}_workbench"
            >
              Iniciar contato
            </FunnelCTAButton>
          </div>
        </section>
      </main>
      <PortfolioHostCredit />
    </div>
  );
}
`;

const creativeBriefSource = `# Creative brief — ${siteName}

Contrato: v2 · Slug: \`${slug}\` · Client key: \`${clientKey}\`

> Preencher antes de construir a interface. Nenhum campo pode permanecer como
> \`[PREENCHER]\` quando o projeto estiver \`published\`.

- businessTruth: [PREENCHER]
- audience: [PREENCHER]
- singleGoal: [PREENCHER]
- brandPersonality: [PREENCHER]
- visualMetaphor: [PREENCHER]
- layoutTopology: [PREENCHER]
- heroArchetype: [PREENCHER]
- navigationArchetype: [PREENCHER]
- sectionRhythm: [PREENCHER]
- typePairing: [PREENCHER]
- colorRoles: [PREENCHER]
- imageStrategy: [PREENCHER]
- iconStrategy: [PREENCHER]
- motionGrammar: [PREENCHER]
- interactionSignature: [PREENCHER]
- conversionNarrative: [PREENCHER]
- proofStrategy: [PREENCHER]
- nearestPortfolioRisks: [PREENCHER]
- antiTemplateDecisions: [PREENCHER]

## Assets oficiais recebidos

[PREENCHER]

## Skills selecionadas

[PREENCHER]

## Skills rejeitadas e motivo

[PREENCHER]

## Validação final

- [ ] identidade escopada ao cliente
- [ ] override de motion próprio
- [ ] hero/composição distintos dos portfolios mais próximos
- [ ] imagens classificadas corretamente
- [ ] funil individual funcional
- [ ] secret server-side configurado quando houver contato oficial
- [ ] mobile/desktop/teclado/reduced-motion
- [ ] originality + a11y + performance + privacy + build
`;

const migrationName = `${new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14)}_seed_${slug.replace(/-/g, "_")}_funnel.sql`;
const migrationSource = `-- Funil individual de ${siteName} (${funnelSlug}).
-- Scaffold V2: nasce DRAFT. Preencha perguntas reais e só então publique.

insert into public.dynamic_forms (slug, name, status, description)
values ('${funnelSlug}', '${siteName}', 'draft', 'Funil individual de ${siteName}')
on conflict (slug) do update
  set name = excluded.name,
      status = excluded.status,
      description = excluded.description;

-- TODO: inserir etapas reais em public.dynamic_form_questions.
-- TODO: depois de validar o fluxo, alterar o status para 'published'.
`;

write(componentFile, componentSource);
write(creativeBriefFile, creativeBriefSource);
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
    socialProofRequired: false,
    hostCaptureRequired: true,
    creativeContractVersion: 2,
    creativeBriefFile,
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

console.log(`\n[scaffold:v2] ${siteName} → /portfolio/${slug}`);
for (const file of written) console.log(`  + ${file}`);

console.log(`
Próximos passos obrigatórios:
  1. Preencher ${creativeBriefFile} ANTES de desenhar a página.
  2. Substituir o workbench por composição autoral e remover CREATIVE_BRIEF_REQUIRED.
  3. Registrar catálogo + site registry + rota lazy.
  4. Adicionar assets oficiais/próprios em ${assetsDir}.
  5. Criar override próprio em src/config/portfolio-motion-profiles.json.
  6. Preencher o funil ${funnelSlug}, validar e só então mudar para published.
  7. Cadastrar o secret privado ${secretName} (somente servidor), se houver contato oficial.
  8. Rodar gates de scaffold, boundaries, meta, originality, a11y, privacy, test e build.

Herdados automaticamente pela rota compartilhada: captação 0WEB,
compartilhamento, breadcrumbs e infraestrutura SEO. Visual NÃO é herdado.
`);
