# PORTFOLIO_PROJECT_LIFECYCLE — documento mestre de `/portfolio/:slug`

Status: **obrigatório para todo projeto criado a partir de 2026-09-11**.

Este é o documento principal de qualquer novo site em `/portfolio/<slug>`.
Os demais padrões continuam válidos como documentação especializada e são
referenciados aqui, nunca duplicados.

```text
PORTFOLIO_PROJECT_LIFECYCLE
├── Entity Enrichment ....... docs/PORTFOLIO_ENTITY_ENRICHMENT_STANDARD.md
├── Media Enrichment ........ docs/PORTFOLIO_ENTITY_ENRICHMENT_STANDARD.md (§ mídia) + docs/PORTFOLIO_COVER_STANDARD.md
├── Landing Blueprint ....... docs/PORTFOLIO_LANDING_BLUEPRINT_STANDARD.md + docs/PORTFOLIO_CREATIVE_DIRECTION_STANDARD.md
├── Search Discovery ........ src/config/portfolio-discovery.json + src/lib/portfolio-search.ts
├── SEO ..................... docs/PORTFOLIO_CONVERSION_INTELLIGENCE_STANDARD.md + docs/SEO_LOCAL_TEMPLATE.md
├── Funnel .................. docs/PORTFOLIO_FUNNELS.md + docs/PORTFOLIO_FUNNEL_CONTEXT_STANDARD.md
├── Cover ................... docs/PORTFOLIO_COVER_STANDARD.md + docs/PORTFOLIO_COVER_STATUS_CONTRACT.md
├── QA ...................... docs/design/ACCESSIBILITY.md · RESPONSIVE.md · MOTION.md
└── Publication ............. docs/PORTFOLIO_NEW_CLIENT_PLAYBOOK.md + docs/0WEB_EXECUTION_CONTRACT.md
```

## 1. Princípio

Um projeto novo **não** é `dados + template + publicar`. O fluxo oficial é:

```text
INTAKE → ENTITY DISCOVERY → ENTITY RESOLUTION → EVIDENCE COLLECTION →
MEDIA DISCOVERY → CONTENT ENRICHMENT → DISCOVERY INDEX → BLUEPRINT →
SEO / ENTITY → FUNNEL → COVER / OG → QA → READINESS GATE → PUBLISH →
POST-PUBLISH VALIDATION
```

Regra fundamental de todo o ciclo:

> **DADO AUSENTE pode ser aceitável. PESQUISA NÃO REALIZADA não é aceitável.**

## 2. Manifesto por projeto

Cada projeto novo tem um registro em `src/config/portfolio-project-manifests.json`
(tipos em `src/lib/portfolio-project-lifecycle.ts`):

```ts
PortfolioProjectManifest {
  slug
  lifecycleContract: 1
  stage: draft | research | enrichment | design | ready | published
  lifecycle: {
    intake, entityDiscovery, entityResolution, evidence, media,
    content, discovery, blueprint, seo, funnel, cover, qa, publish
  }
  blockers[]        // impedem READY/PUBLISH
  warnings[]        // pendência editorial, não impede publicação
  ownerRequired[]   // só o que depende do proprietário
  searchQa[]        // consultas testadas
  lastUpdatedAt
}
```

Estados por etapa: `not_started | in_progress | complete | blocked | not_applicable`.

Não existe banco novo nem painel novo: o manifesto é arquivo versionado.

## 3. Bloqueio × pendência

| Situação | Estado correto |
|---|---|
| Instagram inexistente | `not_applicable` |
| Instagram existe, handle não confirmado | etapa `entityResolution` segue `complete`; bloqueio **só** da integração Instagram |
| Nenhuma avaliação disponível | `not_applicable` |
| Avaliações nunca pesquisadas | `entityDiscovery = in_progress` (incompleto) |
| Provider indisponível | ingestão `blocked`; a entidade continua `resolved` |

Nunca converter “provider inacessível” em “empresa não encontrada”.

## 4. Entity discovery obrigatório

Registrar a **tentativa** para: Google/Maps, site oficial, Instagram, Facebook,
outras redes pertinentes, diretórios públicos, telefone, endereço, horário,
serviços, produtos, fotos, reviews e identidade. Existência não é obrigatória;
pesquisa é.

## 5. Entity resolution

Ledger por fonte, em `docs/portfolio/enrichment/<slug>.json`:
`searched / found / resolved / verified / accessible / ingestable / usable` + `blocker`.

## 6. Evidence registry

Cada fato relevante carrega `field, value, sourceType, sourceUrl?, confidence,
verifiedAt, status`. Tipos aceitos: `OWNER_SUPPLIED`,
`OWNER_SUPPLIED_PUBLIC_EVIDENCE`, `OFFICIAL_WEBSITE`, `GOOGLE`,
`OFFICIAL_SOCIAL`, `PUBLIC_DIRECTORY`, `PUBLIC_WEB`. Campo vazio permanece vazio.

## 7. Media enrichment e media plan

Inventário obrigatório: `realBusinessPhotos`, `officialBrandAssets`,
`externalMedia`, `licensedMedia`, `generatedMedia`, `graphicMedia`, `missingMedia`.
Ter `coverImage` **não** torna a página visualmente completa.

Prioridade: mídia real do negócio → mídia real de trabalhos/produtos →
identidade oficial → mídia pública utilizável → licenciada → gerada
contextual → composição gráfica original. Proibido simular variedade
recortando a mesma foto.

Media plan em `docs/portfolio/media-plans/<slug>.json`, por seção:
`section, requiredMediaRole, sourceType, asset, status`. Seção sem mídia
resolve por `generate | license | graphic | change-layout | no-media-needed` —
nunca silenciosamente vazia.

Imagem gerada é sempre `GENERATED_CONTEXTUAL_MEDIA` e nunca representa
estabelecimento, funcionário, cliente, trabalho executado ou produto real.

## 8. Cover gate

Verificar `identityMatch, segmentMatch, smallCardReadability, contrast,
focalPoint, crop, visualQuality, genericPenalty, duplicatePenalty`.
Pergunta obrigatória: *olhando só o card pequeno, dá para entender o tipo de
negócio?* Capa semanticamente errada reprova.

## 9. Discovery index e Search QA

Todo projeto novo entra em `src/config/portfolio-discovery.json` com
`aliases, categories, services, equipment, products, problems, useCases,
locality, tags, keywords` — apenas relações sustentáveis.

Antes de publicar, testar e registrar em `searchQa` buscas que **devem**
encontrar (nome, segmento, serviço principal, produto/equipamento, problema,
localização) e termos de segmentos sem relação que **não** devem ranquear alto.

## 10. Blueprint readiness

Ordem correta: `evidência → conteúdo → necessidade da seção → variante →
Blueprint`. Nunca escolher seções primeiro e preencher depois. O Blueprint é
vocabulário, não template: hero, ritmo, composição, motion e identidade são
próprios de cada cliente (`docs/PORTFOLIO_LANDING_BLUEPRINT_STANDARD.md`).

## 11. SEO readiness

`title, description, H1, canonical, OG, alt, hierarquia de headings, schema,
localidade, entidade, sitemap, links internos`. Schema só com fatos confirmados.

## 12. Funnel readiness

`funnelType, CTA, campos, WhatsApp/contexto server-side, tracking, slug, origem,
mobile`. Proibido reaproveitar mecanicamente o funil de outro negócio.

## 13. Prova social

Classificar `REAL | EXTERNAL_VERIFIED | OWNER_SUPPLIED_VERIFIED | NOT_AVAILABLE`.
Nunca `GENERATED`, `INFERRED` ou `PLACEHOLDER` como prova.

## 14. Readiness gate

```bash
bun run check:portfolio-project-readiness
bun run check:portfolio-project-readiness -- --slug=<slug>
bun run check:portfolio-project-readiness -- --json
```

Avalia: `entityResearchDone, evidenceRecorded, mediaPlanDone, coverApproved,
discoveryIndexPresent, blueprintValid, seoValid, funnelValid, qaDone`.

**Legado protegido:** o gate só avalia projetos com manifesto
(`lifecycleContract >= 1`). Projetos antigos continuam sob os gates existentes
e nunca falham por não ter manifesto.

## 15. Scaffold e ordem de estados

`bun run scaffold:portfolio -- --slug <slug> --name "<Nome>"` gera, além do que
já gerava: manifesto, enrichment stub, discovery stub, media plan stub — todos
com estados inicializados e **sem dados fictícios**.

Um projeto nasce `draft` e avança `draft → research → enrichment → design →
ready → published`. Nunca nasce `ready` nem `published`.

## 16. Autonomia e pedidos ao proprietário

Avançar sozinho sempre que houver informação suficiente: pesquisar entidade,
catalogar evidências, classificar assets, montar discovery index, propor media
plan, validar SEO/busca e rodar gates. Pedir decisão humana apenas em conflito
real, dado crítico não resolvido, direito de uso incerto, mudança editorial
relevante ou publicação.

Só perguntar ao proprietário o que continua bloqueado depois da pesquisa; a
lista vai em `ownerRequired` no formato:

```text
OWNER_REQUIRED:
- confirmar garantia
- fornecer foto da fachada
```

## 17. Definition of Done

`/portfolio/:slug` só é `READY` quando:

- [ ] entidade pesquisada
- [ ] fontes registradas
- [ ] conflitos tratados
- [ ] serviços confirmados
- [ ] mídia inventariada
- [ ] plano visual executado
- [ ] capa aprovada
- [ ] landing enriquecida
- [ ] Blueprint válido
- [ ] busca indexada
- [ ] SEO completo
- [ ] funil funcionando
- [ ] mobile validado
- [ ] desktop validado
- [ ] acessibilidade básica validada
- [ ] analytics/tracking validado
- [ ] gates aprovados

`build PASS`, `TypeScript PASS` e `route PASS` **não** significam pronto:
faltam ENTITY, CONTENT, MEDIA, DISCOVERY, DESIGN, SEO, FUNNEL, COVER e QA.

Nem todo projeto terá Google, reviews, Instagram, endereço ou galeria — isso não
impede publicar. O que não pode faltar é a verificação de cada possibilidade.
