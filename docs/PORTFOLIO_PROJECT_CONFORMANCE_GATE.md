# Gate de conformidade dos projetos `/portfolio/:slug`

Comando: `bun run check:portfolio-projects` (também roda no `prebuild`).
Saída de governança: `node scripts/check-portfolio-projects.mjs --json`.
Projeto único: `node scripts/check-portfolio-projects.mjs --slug=paulo-mestre-de-obras`.

## Fontes de verdade auditadas

O gate não cria arquitetura paralela. Ele agrega os registries existentes:

| Fonte | Papel |
|---|---|
| `src/config/portfolio-catalog.json` | marca, segmento, cidade/UF, status, resumo (SEO) |
| `src/config/portfolio-clients.json` | componente do cliente, diretório de assets, modo de CTA |
| `src/config/portfolio-assets.json` | logo/ícone, imagem social, `socialVersion`, prova social |
| `src/config/portfolio-share-copy.json` | copy do botão “Copiar divulgação” |
| `src/routes/portfolio.$slug.tsx` | descrição/OG/JSON-LD por slug e `PortfolioStandardShell` (pop-up 0WEB) |
| `public/images/<slug>/` | assets reais em disco |

## Códigos

| Código | Significado | Bloqueia build |
|---|---|---|
| `PORTFOLIO_BRAND_MISSING` | título, segmento ou resumo ausentes no catálogo | não |
| `PORTFOLIO_LOGO_MISSING` | logo/ícone inexistente ou não pertencente ao slug | sim |
| `PORTFOLIO_SOCIAL_IMAGE_MISSING` | imagem social ausente, inválida ou de outro cliente | sim |
| `PORTFOLIO_HERO_MISSING` | menos de dois assets próprios em `public/images/<slug>/` | não |
| `PORTFOLIO_CTA_MISSING` | componente sem mecanismo de funil/CTA reconhecido | sim |
| `PORTFOLIO_SEO_MISSING` | sem descrição dedicada na rota e resumo de catálogo curto | sim |
| `PORTFOLIO_POPUP_MISSING` | pop-up comercial da 0WEB não alcançável | não |
| `PORTFOLIO_SHARE_COPY_MISSING` | sem copy de divulgação própria | não |
| `PORTFOLIO_COMPONENT_MISSING` | componente declarado não existe | sim |

## Classificação

- `COMPLETE` — nenhum código emitido.
- `PARTIAL` — apenas avisos de governança.
- `LEGACY` — ao menos um código bloqueante.

Um projeto só é considerado READY/PUBLISHED quando classificado `COMPLETE`.
HTTP 200 não é critério de conclusão.
