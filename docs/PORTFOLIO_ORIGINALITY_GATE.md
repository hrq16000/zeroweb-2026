# Gate de originalidade do portfólio

Complementa — não substitui — `docs/PORTFOLIO_CLIENT_STANDARD.md`,
`docs/PORTFOLIO_CONVERSION_NARRATIVE_STANDARD.md` e
`docs/PORTFOLIO_PROJECT_CONFORMANCE_GATE.md`. Nenhuma regra anterior foi removida.

## Princípio

**COMPLETE ≠ ORIGINAL.** O gate de conformidade verifica *presença* (logo, capa,
CTA, SEO, componente). Este gate verifica *exclusividade da composição final
percebida pelo visitante*. Um projeto pode ser `COMPLETE` e, ao mesmo tempo,
`ORIGINALITY_STATUS = CLONE`. As duas dimensões são independentes e coexistem.

## O que pode e o que não pode ser compartilhado

| Camada | Regra |
|---|---|
| **Shared infrastructure** | Pode e deve ser reutilizada: `PortfolioStandardShell`, pop-up comercial da 0WEB, `PortfolioCTAQuiz`, `PortfolioImage`, `LazySection`, primitivos de UI, helpers de SEO, analytics, tokens, acessibilidade. Excluída do fingerprint — reutilizar **não** penaliza. |
| **Brand identity** | Individual e inegociável: paleta, tipografia, logo, fotografia, voz. |
| **Page composition** | Não pode ser clone cosmético. Trocar cor, ícone, título, cidade ou foto **não** torna um layout idêntico em original. |
| **Cover** | Deve representar o projeto. Imagem social (`hero-og.jpg`) e logo não são capa. |
| **Logo** | Autêntica do cliente ou explicitamente marcada como pendente (`LOGO_PLACEHOLDER`). |
| **Fallback de vertical** | Pode existir tecnicamente, mas **não qualifica o projeto como autoral**: recebe `SHARED_FALLBACK`. |

## Fórmula

Contrato único: `scripts/portfolio-originality.mjs`.

```
score = 0.30·STRUCTURE_SIMILARITY
      + 0.25·SECTION_ORDER_SIMILARITY
      + 0.20·COMPONENT_SIMILARITY
      + 0.15·STYLE_SIMILARITY
      + 0.07·ASSET_PATTERN_SIMILARITY
      + 0.03·IDENTITY_SIMILARITY
```

Cada dimensão é um índice de Jaccard sobre conjuntos derivados por análise
estática do componente efetivamente renderizado:

- **STRUCTURE** — trigramas da sequência de tags de bloco (`section > div > h2 …`).
- **SECTION_ORDER** — bigramas do papel inferido de cada seção (hero, services, gallery, proof, faq, cta, footer…).
- **COMPONENT** — componentes próprios do projeto, com a infraestrutura compartilhada removida.
- **STYLE** — classes Tailwind **estruturais** (grid, flex, gap, aspect, max-w…), com toda classe de cor descartada.
- **ASSET_PATTERN** — nomes normalizados dos arquivos em `public/images/<slug>/`.
- **IDENTITY** — hexadecimais e ícones. Peso deliberadamente mínimo.

Além do score, dois hashes detectam duplicação quase exata:
`skeletonHash` (fonte sem strings, sem texto JSX, sem hex) e `structureHash`.

O cálculo é **determinístico**: os mesmos arquivos produzem sempre o mesmo resultado.
Custo: análise estática por regex, um parse por arquivo, sem renderizar páginas.

## Faixas e status

| Score | Status | Leitura |
|---|---|---|
| 0–20 | `ORIGINAL` | Fortemente distinto |
| 21–40 | `ACCEPTABLE` | Mesma família, personalizado |
| 41–60 | `ATTENTION` | Similaridade relevante |
| 61–80 | `HIGH_SIMILARITY` | Excessivamente semelhante |
| 81–100 | `CLONE` | Clone estrutural ou quase |
| — | `SHARED_FALLBACK` | Sem componente próprio: renderiza landing de vertical |

## Reason codes

`IDENTICAL_COMPONENT_STRUCTURE` · `NEAR_DUPLICATE_LAYOUT` · `COPY_ONLY_VARIATION` ·
`COLOR_ONLY_VARIATION` · `ICON_ONLY_VARIATION` · `SHARED_VERTICAL_FALLBACK` ·
`SAME_FAMILY` · `DISTINCT`

## Sinais secundários

Capa: `COVER_MISSING`, `COVER_IS_SOCIAL_IMAGE`, `COVER_IS_LOGO`, `COVER_SHARED_ASSET`,
`COVER_RATIO_MISMATCH`, `COVER_SEVERE_CROP`, `COVER_NO_FOCAL_POINT`.

Logo: `LOGO_MISSING`, `LOGO_PLACEHOLDER`, `LOGO_SHARED`, `LOGO_OUTSIDE_ASSETS_DIR`,
`LOGO_NO_CONTRAST_VARIANT`.

Aparecem no relatório e no admin; não pontuam a estrutura.

## Comandos

```bash
bun run check:portfolio-originality           # report-only, grava reports/ e a visão do admin
bun run check:portfolio-originality:enforce   # falha apenas em REGRESSÃO
bun run check:portfolio-originality:baseline  # regrava a baseline (mudança intencional)
```

Saídas: `reports/portfolio-originality.json`, `reports/portfolio-originality.md`
e `src/config/portfolio-originality.json` (consumida por `/app/portfolio/originalidade`).
Não há tabela nova no banco.

## Política progressiva

- **REPORT_ONLY** (prebuild, hoje): o passivo histórico é reportado, nunca quebra build ou deploy.
- **NEW_OR_MODIFIED** (`--enforce`, CI de PR): falha quando uma alteração **piora** o estado em
  relação a `reports/portfolio-originality.baseline.json` — projeto novo entrando como
  `CLONE`/`HIGH_SIMILARITY`/`SHARED_FALLBACK`, projeto existente piorando de status, ou aumento
  no número de clones, fallbacks, logos placeholder, capas ausentes ou compartilhadas.

`existing debt != new regression`. Reduzir qualquer contador é melhoria e passa.
Regravar a baseline é um ato deliberado e versionado.
