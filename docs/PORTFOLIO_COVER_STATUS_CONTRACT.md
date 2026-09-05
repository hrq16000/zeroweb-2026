# Contrato de status de capa do /portfolio

Fonte única de verdade para responder, sem ambiguidade:
quantos projetos têm capa válida, quantos estão pendentes e por quê.

## Arquivos

| Papel | Arquivo |
|---|---|
| Contrato (lógica) | `src/lib/portfolio-cover-status.mjs` |
| Inventário derivado | `src/config/portfolio-cover-status.json` (gerado, não editar à mão) |
| Gerador | `scripts/build-portfolio-cover-status.mjs` (`bun run build:portfolio-cover-status`) |
| Verificação em CI | `bun run check:portfolio-cover-status` |
| Relatório | `bun run report:portfolio-covers` (`--markdown` para tabela completa) |
| Consumidores | gate de originalidade, admin `/app/portfolio/originalidade`, testes |

Entradas: `portfolio-catalog.json` (universo dos projetos), `portfolio-visual-review.json`
(julgamento humano), `portfolio-assets.json` (marca/social) e os arquivos reais em
`public/images/<slug>`.

## Definição de VALID

Uma capa é `VALID` **somente** quando todas as condições valem:

1. existe julgamento humano `coverReview: "APPROVED"` na revisão visual;
2. há `coverSource` registrado e o arquivo existe no repositório;
3. o asset é material editorial — não é imagem social/OG nem marca/logo.

Consequências explícitas do contrato:

- `socialImage != portfolioCover` — arte 1200×630 de Open Graph nunca satisfaz capa;
- `heroImage != cardCover` — hero só vale como capa quando aprovado para essa função;
- "o arquivo existe" nunca basta; sem revisão humana o status é `UNCERTAIN_ORIGIN`.

## Status canônicos

| Status | Significado |
|---|---|
| `VALID` | Capa editorial aprovada e existente |
| `NEEDS_CROP` | Material real e seguro, mas enquadramento/uso não aprovado (inclui OG aprovado como capa) |
| `CONTACT_OR_PII` | Material exibe telefone, e-mail ou endereço |
| `PROMOTIONAL_MATERIAL` | Peça promocional com preço ou campanha |
| `LOGO_ONLY` | Só existe marca/logo do cliente |
| `NO_REAL_ASSET` | Não há fotografia ou material real apropriado |
| `UNCERTAIN_ORIGIN` | Sem julgamento humano registrado |

Pendência = qualquer status diferente de `VALID`. O gerador falha se
`pendentes != soma dos reason codes`.

## Métrica legada

`missingCovers` no gate de originalidade continua existindo apenas para comparação de
baseline e significa "projeto sem campo `image` no catálogo". Ela **não** é a contagem de
capas válidas e não deve ser usada em relatórios. Use `coverValid` / `coverPending`.

## Regras de operação

- Nunca editar `src/config/portfolio-cover-status.json` manualmente.
- Nunca criar um segundo inventário de capas: qualquer nova tela ou script consome o contrato.
- Publicar capa continua exigindo material próprio, seguro e revisão humana registrada.
