# Rodada 9 — Checkpoint global + auditoria segura das capas

Data: 2026-09-05 · Escopo: validação de produção, novo baseline de originalidade e capas.
Nenhuma página de projeto foi redesenhada nesta rodada.

## Etapa 1 — Produção (6 projetos recompostos)

Correção de rota: o slug de Darléia é `artesanatos-darleia-oliveira` (`darleia-artes` = 404, nunca existiu).

| Slug | HTTP | Composição nova visível | SEO | H1 renderizado | CTA/funil | Overflow | Console |
|---|---|---|---|---|---|---|---|
| artesanatos-darleia-oliveira | 200 | SIM | title/description/canonical/OG OK | 1 | OK | 0 | limpo |
| thays-camilla | 200 | SIM | OK | 1 | OK | 0 | limpo |
| lolipa-arte-em-festas | 200 | SIM | OK | 1 | OK | 0 | limpo |
| premium-envelopamentos | 200 | SIM | OK | 1 | OK | 0 | limpo |
| angel-mix-brecho | 200 | SIM | OK | 1 | OK | 0 | limpo |
| reuse-house-brecho | 200 | SIM | OK | 1 | OK | 0 | limpo |

Validado em navegador real a 390 / 768 / 1440 px, incluindo `prefers-reduced-motion: reduce`
(nenhum bloco de texto preso em `opacity: 0`). Sem `wa.me`/`tel:` no HTML público.

LATEST_6_PRODUCTION = PASS · VISUAL_VERSION_CURRENT = YES · SEO_REGRESSION = 0 ·
FUNNEL_REGRESSION = 0 · PRIVACY_REGRESSION = 0

## Etapa 2 — Baseline global atual

TOTAL_PROJECTS = 68 · ORIGINAL = 0 · ACCEPTABLE = 22 · ATTENTION = 46 ·
HIGH_SIMILARITY = 0 · CLONE = 0 · SHARED_FALLBACK = 0 · SIMILARITY_CLUSTERS = 0

Nenhum projeto com score > 60. Passivo restante (pior → melhor):

| Projeto | Score | Nearest match | Cluster | Razão |
|---|---|---|---|---|
| acai-total-araucaria | 59 | aguia-sul-sinalizacao | — | SAME_FAMILY |
| diego-montador-moveis | 59 | aguia-sul-sinalizacao | — | SAME_FAMILY |
| mp-festas-eventos | 59 | studio-de-cilios | — | SAME_FAMILY |
| mary-diarista | 58 | aguia-sul-sinalizacao | — | SAME_FAMILY |
| confeitaria-sabor-da-realeza | 56 | studio-de-cilios | — | SAME_FAMILY |
| paulo-mestre-de-obras | 56 | diego-montador-moveis | — | SAME_FAMILY |
| denise-gomes-psicologa | 54 | liz-moraes-nail-designer | — | SAME_FAMILY |
| ecommerce-on | 54 | acai-total-araucaria | — | SAME_FAMILY |

Nenhuma estrutura idêntica, asset compartilhado ou identidade placeholder.
A família Águia Sul / Açaí Total / Diego / Mary foi apenas medida — sem redesenho.

## Etapa 3 — Auditoria das capas

Cobertura corrigida: além dos 25 `NEEDS_REVIEW` registrados, 13 projetos não tinham
entrada de revisão. NEEDS_REVIEW_TOTAL real = 38.

Método: leitura de dimensões + OCR (português) de cada asset + inspeção visual em
contact sheet. Classificação conservadora; na dúvida, não publica.

Classificação dos 13 sem revisão:

| Projeto | Categoria | Evidência |
|---|---|---|
| paraiso-do-hot-dog | B — SAFE_REAL_ASSET_NEEDS_CROP | arte própria com produto; OCR sem contato/preço/endereço |
| rm-fretes | B — SAFE_REAL_ASSET_NEEDS_CROP | `carroceria-carga.png` própria; `anuncio-oficial.png` tem telefone (C) |
| heloa-gas | B — SAFE_REAL_ASSET_NEEDS_CROP | composição de produto, sem pessoas/fachada/contato |
| denise-gomes-psicologa | E — material insuficiente | único asset é arte vertical com muito texto; recorte 16:10 corta texto e retrato |
| ton-e-cor | D — LOGO_ONLY | banner de marca; logo não vira capa fotográfica |
| paulo-mestre-de-obras | C — contato visível | `capa.webp` traz telefone; fotos de obra sem comprovação de autoria (F) |
| raphael-construcoes | F/E | sem material comprovadamente do cliente |
| jc-revestimentos | F/E | idem |
| hbk-iluminacao-led | F/E | idem |
| casa-nativa | F/E | idem |
| almeida-torres | F/E | idem |
| clinica-integrada | F/E | idem |
| r_beauty | F/E | idem |

Os 25 `NEEDS_REVIEW` anteriores permanecem bloqueados pelos motivos já registrados
(`BLOCKED_CONTACT`, `BLOCKED_ADDRESS`, `BLOCKED_PROMOTIONAL_PRICE`, `BLOCKED_QUALITY`)
ou por ausência de material real. Nenhum foi liberado sem evidência nova.

## Etapa 4 — Capas efetivamente alteradas

Geradas com o mecanismo existente (`scripts/build-portfolio-covers.mjs`, 1600×1000, 16:10):

| Projeto | Fonte | Modo | Focal | Resultado |
|---|---|---|---|---|
| paraiso-do-hot-dog | `capa.png` | crop | 0.44 / 0.50 | logo + produto legíveis |
| rm-fretes | `carroceria-carga.png` | frame | 0.50 / 0.50 | arte quadrada preservada sem corte |
| heloa-gas | `hero.jpg` | crop | 0.50 / 0.55 | produto centralizado |

Não alteradas: todas as demais (35 seguem `NEEDS_REVIEW` / `COVER_ASSET_PENDING`).
Angel Mix e REuse House continuam com `COVER_ASSET_PENDING` (capa dedicada) e
`LOGO_NO_CONTRAST_VARIANT` — não há material novo do cliente.

Correção pontual de script: o relatório de baixa resolução quebrava quando a capa usa
`mode: frame` (sem objeto `crop`).

## QA e gates

- Grid `/portfolio` em 390 e 1440: overflow 0, nenhuma imagem quebrada, console limpo, lazy loading ativo.
- typecheck: PASS · `bun test`: 324 pass / 0 fail · completeness: 68/68 COMPLETE
- originality: 0 HIGH_SIMILARITY / 0 CLONE / 0 SHARED_FALLBACK (sem mudança de fórmula)
- boundaries: PASS · client-privacy: bundle limpo · build + scan do `dist`: PASS

## Dívida conhecida

- `COVER_MISSING = 26` no gate de originalidade mede apenas `catalog.image`; o runtime
  já resolve `capa-card.jpg` via `coverFor()`. A métrica está defasada, não a capa.
- 35 capas continuam pendentes por falta de material real e seguro.
- 1 finding crítico do security scan segue em aberto desde a publicação anterior.

## Recomendação para a próxima rodada

Priorizar (B) corrigir a métrica de assets/capas em vez de (A) dissolver os scores 56–59:
os pares restantes são "mesma família de negócio" sem estrutura idêntica, com ganho
marginal, enquanto a métrica de capas hoje reporta ausência falsa e esconde as
pendências reais.
