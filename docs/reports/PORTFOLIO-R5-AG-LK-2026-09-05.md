# Rodada 5 — subfamília AG Electrical + LK Alvenaria

## Divergência factual
O cluster de 8 projetos descrito no pedido não existe mais nos dados gerados.
Estado atual do gate: 68 projetos · 0 cluster · 0 clone · 0 SHARED_FALLBACK.
Subfamília selecionada: o par mais semelhante restante.

- SELECTED: `ag-electrical-services`, `lk-alvenaria`
- DEFERRED (não tocados): demais 4 HIGH_SIMILARITY

## Antes → depois
| Métrica | Antes | Depois |
|---|---|---|
| Score do par | 64 / 64 (HIGH_SIMILARITY) | 50 / 50 (ATTENTION, SAME_FAMILY) |
| Clusters | 0 | 0 |
| SHARED_FALLBACK | 0 | 0 |
| COMPLETE | 68/68 | 68/68 |

## Mudanças
- AG: composição de painel/circuito (hero tipográfico, barramento L1–L4, galeria com scroll-snap, painel técnico assimétrico). Hero gerenciado corrigido de `logo.webp` para foto real `rack-2.webp`.
- LK: composição de cronograma de obra (linha do tempo vertical, ficha de obra tabular). Panfleto `portfolio.webp` com telefone visível removido da experiência pública; o componente ignora heros com esse padrão de arquivo (`COVER_ASSET_PENDING`).
- Funis, CTAs, SEO, tracking, WhatsApp server-side, URLs e banco preservados.

## Débito registrado
`ORIGINALITY_METRIC_ASSET_FILENAME_DEBT` — a métrica ainda pontua ordem de seções
e nomes de arquivos de asset, mantendo o par em SAME_FAMILY apesar da direção
visual distinta.

## Validação
typecheck OK · originality report PASS · projects 68/68 COMPLETE · boundaries OK ·
runtime overrides OK · source-privacy OK · bun test 324/0 · build OK ·
QA Playwright 390/768/1440 HTTP 200, overflow 0, sem imagem quebrada.
