# Pixel das páginas locais (por cidade)

## O que é medido

As páginas `/criacao-de-site-institucional/<cidade>` usam o pixel próprio,
anônimo e LGPD-safe já existente (`quiz_pixel_events`) — sem cookie, sem IP,
sem nome/telefone/e-mail.

| Evento | `event_type` | `step_key` | Quando dispara |
| --- | --- | --- | --- |
| Visualização da página | `step_view` | `page_view` | Montagem da página local |
| Clique em CTA | `answer_click` | `cta_click` | Clique em "Diagnóstico gratuito" |
| Abandono | `abandon` | `page_abandon` | Saída da página sem nenhum clique de CTA |
| Diagnóstico enviado | `submit` | (do quiz) | Envio do quiz da cidade |

A chave (`quiz_key`) é sempre `institucional-<slug-da-cidade>`, a mesma do quiz
local — assim página, quiz e lead ficam no mesmo eixo, sem criar novo padrão.

## Onde ver

`/app/leads` → seção **Pixel das páginas locais**: sessões, views, cliques em
CTA, abandonos, diagnósticos e taxa de conversão por cidade, com filtro de 7/30/90
dias. Leitura restrita a `admin`/`super_admin`.

## Código

- `src/components/site/LocalPagePixel.tsx` — componente invisível + `trackLocalCta`.
- `src/lib/city-pixel.functions.ts` — agregação server-side (`cityPixelStats`).
- `src/components/app/CityPixelPanel.tsx` — painel no `/app/leads`.

## Nova página local

1. Renderizar `<LocalPagePixel quizKey={`institucional-${slug}`} />` no topo da página.
2. Chamar `trackLocalCta(`institucional-${slug}`, "<rótulo>")` em cada CTA principal.
3. Manter o `quizKey` do quiz igual ao da página. Nada mais é necessário: a cidade
   aparece automaticamente no painel.
