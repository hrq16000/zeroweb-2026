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

## Q3A — dimensões, copy e assets (atualização)

### Dimensões medidas

`STRUCTURE_SIMILARITY`, `SECTION_ORDER_SIMILARITY`, `COMPONENT_SIMILARITY`,
`STYLE_SIMILARITY`, `COPY_SIMILARITY`, `ASSET_PATTERN_SIMILARITY`,
`IDENTITY_SIMILARITY`. Nenhuma é condensada em score opaco: todas aparecem no
relatório, na matriz de pares e no admin.

Pesos atuais: estrutura 0.28 · ordem de seções 0.22 · componentes 0.18 ·
estilo 0.13 · copy 0.12 · padrão de assets 0.04 · identidade 0.03.

### Copy: boilerplate excluído

`COPY_BOILERPLATE` remove do cálculo editorial o popup da 0WEB, crédito de
hospedagem, avisos legais, rótulos técnicos e CTAs institucionais comuns.
Só a copy específica do cliente é comparada (trigramas de palavras).

### Infraestrutura compartilhada

`SHARED_INFRA` continua fora do fingerprint: shell, popup, quiz, botões,
imagem, seções lazy e primitivos de UI não geram similaridade.

### Assets percebidos

Marca, capa e imagem social são comparadas por hash de conteúdo entre clientes:

- `ASSET_EXPECTED_SHARED` — arte compartilhada por contrato (0WEB/system).
- `ASSET_SUSPICIOUS_SHARED` — capa ou imagem social repetida entre clientes.
- `ASSET_INVALID_CROSS_CLIENT` — logo de um cliente aparecendo em outro (bloqueante).

### Novos reason codes

`EXCESSIVE_COPY_SIMILARITY` e `VISUAL_COMPOSITION_CLONE`.

### Matriz de pares

`reports/portfolio-originality.md` traz o top 20 de pares com todas as
dimensões, e `reports/portfolio-originality.json` inclui `pairMatrix.nearest`
com os três vizinhos mais próximos de cada projeto.

## Q3B — aprendizados do cluster de comida

Cluster confirmado: `CLUSTER_01` (`beto-pasteis`, `dlara-pizzaria`,
`marmitaria-dom-diego`, `woodhouse-hamburgueres`), par 88,
`IDENTICAL_COMPONENT_STRUCTURE`, com STRUCTURE/ORDER/COMPONENT/STYLE/ASSET/
IDENTITY todos em 100 e COPY em 0.

Leituras confirmadas em duas rodadas:

- **Copy diferente não salva página clonada.** COPY_SIMILARITY 0 e ainda assim
  score 88: as dimensões estruturais dominam o clone percebido.
- **O que mais move o número** é, nesta ordem: esqueleto de blocos, ordem das
  seções, conjunto de componentes próprios e vocabulário de classes.
- **Trocar cor, capa ou logo não dissolve cluster.** Só muda IDENTITY, peso 0.03.
- **O que dissolveu bem** (brechós e comida): mudar o eixo de leitura (coluna
  lateral, disco central, imagem sangrada, caderno), trocar o elemento que
  apresenta a oferta (lista com fio pontilhado, colunas divididas, lista
  numerada, blocos em escada) e variar a posição do CTA na narrativa.
- **Segmento não é estilo.** Quatro negócios de comida receberam registros
  distintos: balcão de bairro, forno noturno, caderno de cozinha e casa
  noturna urbana.
