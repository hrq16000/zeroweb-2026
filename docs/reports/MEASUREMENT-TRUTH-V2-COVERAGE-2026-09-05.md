# MEASUREMENT_TRUTH — Rodada 2 · Fechamento do cutover V2 e cobertura ponta a ponta

Data: 2026-09-05 · Escopo: somente qualidade de medição.
Nenhuma alteração de design, copy, oferta, funil comercial, `/portfolio`,
`/servicos`, rotas ou SEO. `/portfolio` permanece em MAINTENANCE_MODE.

## 1. Cutover oficial

- Constante única: `MEASUREMENT_TRUTH_V2_CUTOVER = 2026-09-05T22:00:00.000Z`
  (`src/lib/telemetry-v2.ts`).
- Réplica operacional em SQL: `scripts/measurement-funnel.sql` (`\set cutover`).
- Nenhum outro arquivo declara data de corte.

## 2. Estado das gates

| Gate | Status | Evidência |
|---|---|---|
| V1_V2_SEPARATION | PASS | consulta separa por `tv`; nunca soma silenciosa |
| POST_CUTOVER_QUERY | PASS | filtro absoluto `created_at >= cutover` + `tv='2'` + `traffic_type` |
| PAGE_VIEW_PRODUCTION | PASS | 1 page_view por carga real; SPA nav gera 1; rerender/resize 0; path sem query |
| FIRST_TOUCH_PRODUCTION | PASS | UTM na 1ª URL persiste como `ft_channel=utm/ft_source=google` nas páginas seguintes; sem UTM → `direct` |
| SERVICOS_MEASUREMENT_COVERAGE | COMPLETE | page_view + `cta_click`/`contact_cta_click` + `checkout_started` + handoff WhatsApp já emitidos |
| LEAD_TO_SESSION_ATTRIBUTION | IMPLEMENTED (aguardando dados) | quiz de portfólio e funil dinâmico passam a gravar `session_id`/`visitor_id` técnicos no lead |
| WHATSAPP_TO_SESSION_ATTRIBUTION | PARTIAL | token→lead já existe (243/244); lead→sessão só a partir de agora |
| SOCIAL_PROOF_EVENT_RATE | PASS | 0,20 evento por sessão pós-cutover (contrato: ≤1) |
| BOT_QA_EXCLUSION | PASS | localhost/preview/QA classificados `internal`; padrão comercial é `human` |
| PII_IN_V2_ANALYTICS | PASS | allowlist + sanitização; auditoria de bundle limpa |
| FUNNEL_QUERY | PASS | `scripts/measurement-funnel.sql` reescrito |
| TYPECHECK / TESTS / BUILD / PRIVACY | PASS | tsgo 0 erros · 369 testes · build ok · privacidade ok |
| SECURITY | SEM FINDING NOVO | pendência de parceiros é pré-existente e coberta por RLS + trigger |

## 3. Volume pós-cutover (leitura em 2026-09-05 22:5x UTC)

| Métrica | Valor |
|---|---|
| Eventos V2 | 80 |
| Sessões V2 | 15 |
| Eventos V2 humanos | 21 |
| Eventos V1 após o cutover | 494 (versão publicada ainda antiga) |
| Prova social por sessão | 0,20 |

`DATA_MATURITY = INSUFFICIENT` — a produção ainda não recebeu a versão V2, por
isso o volume V1 posterior ao cutover. Nada foi extrapolado.

## 4. Correção mínima aplicada

- `submitPortfolioQuiz` aceita e grava `session_id`/`visitor_id` (identificadores
  opacos, sem PII), os mesmos usados em `analytics_events`.
- `submitFunnel` passa a gravar `session_id` já presente no `client_metadata`.
- `BeautyBookingQuiz` envia esses identificadores.
- Nenhuma tabela nova, nenhum tracker paralelo, nenhuma mudança visual.

## 5. Lacunas conhecidas (sem ação nesta rodada)

- Leads e redirects anteriores ao cutover continuam sem vínculo de sessão: é
  histórico, não se reconstrói.
- `experiment_view` gera vários eventos por page view; ruído de volume, não de
  verdade. Avaliar em rodada própria.
- 62 dos 68 projetos ainda sem número privado de WhatsApp configurado, o que
  mantém o estágio de redirect artificialmente baixo (diagnóstico anterior).

## 6. Estado final

`MEASUREMENT_TRUTH = OBSERVING` — a fundação está correta e provada em
navegação real; falta apenas publicar e acumular volume V2 humano.
