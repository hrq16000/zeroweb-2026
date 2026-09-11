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

/** Canal comercial: o funil individual nasce com o tipo do negócio. */
const FUNNEL_TYPES = {
  orcamento: "Solicitar orçamento",
  pedido: "Fazer pedido",
  agendamento: "Agendar atendimento",
  diagnostico: "Solicitar diagnóstico",
  reserva: "Consultar disponibilidade",
  solicitacao: "Solicitar atendimento",
  contato: "Iniciar contato",
};
const funnelType = flag("funnel-type") ?? "orcamento";
if (!FUNNEL_TYPES[funnelType]) {
  console.error(`[scaffold] --funnel-type inválido. Use: ${Object.keys(FUNNEL_TYPES).join(", ")}`);
  process.exit(1);
}
const ctaLabel = FUNNEL_TYPES[funnelType];

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
import { PortfolioBlueprintRenderer } from "@/components/portfolio/blueprint/PortfolioBlueprintRenderer";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import type { CtaRenderOptions, PortfolioBlueprint } from "@/lib/portfolio-blueprint";

/**
 * WORKBENCH de ${siteName} (/portfolio/${slug}) — Portfolio Blueprint.
 *
 * NÃO PUBLICAR enquanto o marcador CREATIVE_BRIEF_REQUIRED existir.
 *
 * Regras do pipeline (docs/PORTFOLIO_PROJECT_LIFECYCLE.md):
 *  - hero, ordem, variants, densidade, mídia e motion são ESCOLHA consciente;
 *    "hero split + offers grid + authority split + cta banner" é fallback
 *    técnico, não direção criativa;
 *  - nada de conteúdo inventado: sem avaliação, endereço, telefone, garantia,
 *    número de anos, equipe, certificação ou métrica sem fonte auditável;
 *  - todo contato comercial passa pelo funil \`${funnelSlug}\` (contactMode=funnelOnly).
 */
const SCAFFOLD_STATE = "CREATIVE_BRIEF_REQUIRED";

export const blueprint: PortfolioBlueprint = {
  slug: "${slug}",
  identity: { name: "${siteName}" },
  theme: {},
  layout: { headerCtaLabel: "${ctaLabel}" },
  sections: [
    {
      // TODO(direção criativa): escolher variant a partir do brief.
      type: "hero",
      variant: "editorial",
      order: 10,
      // TODO(direção criativa): definir gramática de motion própria do cliente.
      motion: { intensity: "SUBTLE", reveal: "up" },
      content: {
        eyebrow: SCAFFOLD_STATE,
        headline: "${siteName}",
        subheadline:
          "Composição pendente: substituir por narrativa real do cliente depois de entity resolution, enrichment e media discovery.",
        ctaLabel: "${ctaLabel}",
      },
    },
    {
      type: "cta",
      variant: "banner",
      order: 90,
      content: {
        title: "Pendente de direção criativa",
        text: "Preencher ${creativeBriefFile} e o media plan antes de compor esta seção.",
        ctaLabel: "${ctaLabel}",
      },
    },
  ],
  renderCta: ({ children, className, placement }: CtaRenderOptions) => (
    <FunnelCTAButton
      clientKey="${clientKey}"
      companySlug="${slug}"
      formSlug="${funnelSlug}"
      location={\`${slug}_\${placement}\`}
      className={className}
    >
      {children}
    </FunnelCTAButton>
  ),
  afterContent: (
    <>
      <PortfolioHostCredit />
      <PortfolioUpsellPopup />
    </>
  ),
};

export function ${componentName}() {
  return <PortfolioBlueprintRenderer blueprint={blueprint} />;
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

// --- Ciclo de vida oficial (docs/PORTFOLIO_PROJECT_LIFECYCLE.md) -----------
const today = new Date().toISOString().slice(0, 10);

// Enrichment stub: pesquisa ainda não realizada, sem dados fictícios.
write(
  `docs/portfolio/enrichment/${slug}.json`,
  `${JSON.stringify(
    {
      doc: "Registro de Entity Enrichment (docs/PORTFOLIO_ENTITY_ENRICHMENT_STANDARD.md). Stub do scaffold: nenhuma pesquisa realizada ainda.",
      slug,
      lastResearchAt: null,
      researchLedger: Object.fromEntries(
        [
          "googleEntity",
          "website",
          "instagram",
          "facebook",
          "otherSocial",
          "directories",
          "phone",
          "address",
          "hours",
          "services",
          "products",
          "media",
          "reviews",
          "identity",
        ].map((k) => [
          k,
          {
            searched: false,
            found: false,
            resolved: false,
            verified: false,
            accessible: false,
            ingestable: false,
            usable: false,
          },
        ]),
      ),
      identity: {},
      entity: {
        candidates: [],
        resolutionStatus: "UNRESOLVED",
        resolutionSignals: [],
        unresolvedJustification: null,
      },
      evidence: [],
      sources: [],
      google: { placeId: null, dataId: null, cid: null, status: "not_searched" },
      reviews: { items: [], status: "NOT_SEARCHED" },
      photos: { items: [], status: "NOT_SEARCHED" },
      social: { instagram: { searched: false }, facebook: { searched: false }, other: [] },
      website: { searched: false, url: null },
      location: {},
      services: [],
      media: { discovery: { searched: false }, assets: [] },
      facts: [],
      conflicts: [],
      unverified: [],
      /** Controle de custo: cada chamada do provider fica registrada aqui. */
      providerCalls: [],
    },
    null,
    2,
  )}\n`,
);

// Media plan stub: nenhuma seção pode ficar silenciosamente sem mídia.
write(
  `docs/portfolio/media-plans/${slug}.json`,
  `${JSON.stringify(
    {
      doc: "Media plan (docs/PORTFOLIO_PROJECT_LIFECYCLE.md §7). Preencher antes de fechar o Blueprint.",
      slug,
      status: "MEDIA_ENRICHMENT_NOT_STARTED",
      inventory: {
        realBusinessPhotos: [],
        officialBrandAssets: [],
        externalMedia: [],
        licensedMedia: [],
        generatedMedia: [],
        graphicMedia: [],
        missingMedia: [],
      },
      discovery: {
        searched: false,
        sources: [
          "OWNER_SUPPLIED",
          "GOOGLE_PUBLIC_MEDIA",
          "OFFICIAL_SOCIAL",
          "OFFICIAL_WEBSITE",
          "OFFICIAL_BRAND",
          "LICENSED_MEDIA",
          "GENERATED_CONTEXTUAL_MEDIA",
        ],
        result: null,
      },
      /** Material recebido só para identificar/confirmar dado. Nunca vira Hero/capa automaticamente. */
      referenceOnlyAssets: [],
      /**
       * section | mediaRole | source | asset | provenance | status | mediaNarrative
       * mediaNarrative (adendo §11): ESTABLISH_CONTEXT · SHOW_REALITY · EXPLAIN_SERVICE ·
       * PROVE_CAPABILITY · CREATE_EMOTION · BREAK_VISUAL_RHYTHM · SUPPORT_CONVERSION · BRAND_RECALL
       */
      sections: [],
      cover: { asset: null, strategy: null, approved: false, checks: {} },
      lastUpdatedAt: today,
    },
    null,
    2,
  )}\n`,
);

// Quality matrix stub: avaliada DEPOIS da implementação e ANTES do readiness.
write(
  `docs/portfolio/quality-matrix/${slug}.json`,
  `${JSON.stringify(
    {
      doc: "Quality matrix (docs/PORTFOLIO_LANDING_QUALITY_MATRIX.md + docs/PORTFOLIO_LANDING_EXPERIENCE_ADDENDUM.md + docs/PORTFOLIO_LANDING_MOTION_ADDENDUM.md). Avaliar antes de readiness/publish.",
      slug,
      matrixVersion: 2,
      contractVersion: 3,
      evaluatedAt: null,
      technicalPass: false,
      editorialPass: false,
      score: { total: null, byDimension: {} },
      /**
       * Além das 13 dimensões clássicas, avaliar as de experiência (adendo §19):
       * CONTENT_DEPTH · VISUAL_RHYTHM · MEDIA_NARRATIVE · SECTION_VARIETY ·
       * SIGNATURE_MOMENTS · PROOF_DENSITY · CONVERSION_CONTINUITY
       */
      dimensions: {},
      /** adendo §2/§13/§14/§21 — direção declarada, não default técnico. */
      experience: {
        visualRhythm: null,
        signatureMoments: [],
        motionNarrative: null,
        heroArchetype: null,
      },
      /**
       * MOTION_QUALITY_GATE — docs/PORTFOLIO_LANDING_MOTION_ADDENDUM.md §15.
       * Preencher com a estratégia real de movimento deste negócio; copiar o
       * motion profile de outro cliente é reprovação de originalidade.
       */
      motion: {
        doc: "docs/PORTFOLIO_LANDING_MOTION_ADDENDUM.md",
        profile: {
          intensity: null,
          personality: null,
          entrance: [],
          scroll: [],
          hover: [],
          typography: [],
          media: [],
          transitions: [],
          signatureEffects: [],
          reducedMotionStrategy: null,
          mobileStrategy: null,
        },
        narrativeRoles: {},
        gate: {},
        qualityProfile: {
          motionIntensity: null,
          motionPurpose: null,
          interactionDensity: null,
          scrollExperience: null,
          microinteractionQuality: null,
          reducedMotionCoverage: null,
          motionPerformance: null,
        },
      },
      qualityProfile: {
        visualDensity: null,
        editorialDepth: null,
        motionIntensity: null,
        mediaRichness: null,
        proofLevel: null,
        interactionLevel: null,
        localContext: null,
        conversionIntensity: null,
      },
      hero: { status: null, criteria: {} },
      cover: { status: null, criteria: {} },
      coverage: [],
      deadZones: [],
      mediaSourceMix: {},
      p0: [],
      warnings: [],
      ownerRequired: [],
    },
    null,
    2,
  )}\n`,
);

// Discovery stub no índice de busca.
const discoveryPath = resolve(root, "src/config/portfolio-discovery.json");
if (existsSync(discoveryPath)) {
  const discovery = JSON.parse(readFileSync(discoveryPath, "utf8"));
  discovery.projects ??= {};
  if (!discovery.projects[slug]) {
    discovery.projects[slug] = {
      aliases: [siteName],
      categories: [],
      services: [],
      equipment: [],
      products: [],
      problems: [],
      useCases: [],
      locality: [],
      keywords: [],
    };
    if (!dryRun) writeFileSync(discoveryPath, `${JSON.stringify(discovery, null, 2)}\n`, "utf8");
    written.push("src/config/portfolio-discovery.json");
  }
}

// Manifesto do ciclo de vida: nasce draft, nunca ready/published.
const manifestPath = resolve(root, "src/config/portfolio-project-manifests.json");
if (existsSync(manifestPath)) {
  const manifests = JSON.parse(readFileSync(manifestPath, "utf8"));
  manifests.projects ??= {};
  if (!manifests.projects[slug]) {
    manifests.projects[slug] = {
      slug,
      lifecycleContract: 1,
      /** >= 3 exige as dimensões de experiência (adendo §19) na quality matrix. */
      contractVersion: 3,
      stage: "draft",
      lifecycle: {
        intake: "complete",
        entityDiscovery: "not_started",
        entityResolution: "not_started",
        evidence: "not_started",
        media: "not_started",
        mediaPlan: "not_started",
        content: "not_started",
        discovery: "not_started",
        blueprint: "not_started",
        seo: "not_started",
        funnel: "not_started",
        cover: "not_started",
        qa: "not_started",
        publish: "not_started",
      },
      blockers: [],
      warnings: [],
      ownerRequired: [],
      searchQa: [],
      visualQa: { status: "NOT_EXECUTED", notes: null, evaluatedAt: null },
      notes: {
        enrichment: `docs/portfolio/enrichment/${slug}.json`,
        mediaPlan: `docs/portfolio/media-plans/${slug}.json`,
      },
      lastUpdatedAt: today,
    };
    if (!dryRun) writeFileSync(manifestPath, `${JSON.stringify(manifests, null, 2)}\n`, "utf8");
    written.push("src/config/portfolio-project-manifests.json");
  }
}

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
    funnelType,
    contactMode: "funnelOnly",
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

// Projeto novo nasce rodando pelo PortfolioBlueprintRenderer (legado intacto).
const blueprintRegistryPath = resolve(root, "src/components/portfolio/blueprint/registry.ts");
if (existsSync(blueprintRegistryPath)) {
  const source = readFileSync(blueprintRegistryPath, "utf8");
  if (!source.includes(`"${slug}"`)) {
    const patched = source
      .replace(
        /(export const blueprintModules[\s\S]*?= \{\n)/,
        `$1  "${slug}": () => import("@/components/site/${componentName}"),\n`,
      )
      .replace(
        /(export const blueprintPages[\s\S]*?= \{\n)/,
        `$1  "${slug}": lazy(() =>\n    import("@/components/site/${componentName}").then((m) => ({ default: m.${componentName} })),\n  ),\n`,
      );
    if (!dryRun) writeFileSync(blueprintRegistryPath, patched, "utf8");
    written.push("src/components/portfolio/blueprint/registry.ts");
  }
}

console.log(`\n[scaffold:v2] ${siteName} → /portfolio/${slug}`);
for (const file of written) console.log(`  + ${file}`);

console.log(`
Pipeline obrigatório (docs/PORTFOLIO_PROJECT_LIFECYCLE.md):
  intake → entity discovery → entity resolution → public enrichment →
  media discovery → content → search discovery → blueprint → funnel → seo →
  cover/OG → qa → ready → publish

Próximos passos obrigatórios:
  0. Entity discovery + resolution e, só então, enrichment público
     (node scripts/ingest-portfolio-serpapi.mjs --slug ${slug} --place-id <id>).
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
