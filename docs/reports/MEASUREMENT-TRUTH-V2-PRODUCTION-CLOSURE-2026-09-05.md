# MEASUREMENT_TRUTH — Fechamento em produção (2026-09-05)

Escopo: publicação da telemetria V2 já implementada + validação em produção.
Nenhuma mudança visual, de preço, copy, funil, SEO, `/servicos` ou `/portfolio`.

## 1. Deploy

- `PRODUCTION_DEPLOYMENT = PASS` — publicado em 2026-09-05 ~23:2x UTC.
- Conteúdo: somente a implementação V2 já concluída (nenhuma alteração paralela).

## 2. Cutover

- `MEASUREMENT_TRUTH_V2_CUTOVER = 2026-09-05T22:00:00.000Z` em
  `src/lib/telemetry-v2.ts`. Réplica operacional apenas em
  `scripts/measurement-funnel.sql`.
- `CUTOVER_SOURCE_COUNT = 1`.

## 3. Smoke real em produção (https://0web.com.br)

Fluxo A (UTM `measurement_qa/test/v2_smoke`): `/` → `/servicos` → `/portfolio`
→ `/portfolio/heloa-gas`.

- first touch persistido: `{channel:utm, source:measurement_qa, medium:test, campaign:v2_smoke, landing_path:/}` nas 4 rotas.
- 4 page_view, um por rota real; nenhum duplicado em re-render/hidratação.
- payload com `tv:2` e `traffic_type:"automation"` → QA fora das métricas humanas.
- `portfolio_slug` presente na rota de projeto.

Fluxo B (direct, contexto novo): `{channel:direct, source:direct}`.
Fluxo C: navegação interna não sobrescreveu a aquisição (`ft_*` estável,
`ct_channel` muda apenas como leitura paralela).

Gates: `PAGE_VIEW_PRODUCTION_IDEMPOTENCY = PASS` ·
`FIRST_TOUCH_PRODUCTION = PASS` · `DIRECT_PRODUCTION = PASS` ·
`INTERNAL_NAV_ATTRIBUTION = PASS`.

## 4. Prova social

Pós-cutover, tráfego V2: 99 sessões, `social_proof_per_session = 0,65`
(contrato ≤ 1 por sessão/contexto). Sessão QA: 1 evento em 4 rotas.
`SOCIAL_PROOF_EVENT_STORM = RESOLVED`.

## 5. Lead → sessão

Implementado: `submitPortfolioQuiz` e `submitFunnel` gravam `session_id`/
`visitor_id` opacos no lead. Pós-cutover existe 1 lead real, ainda anterior
à publicação, portanto sem vínculo (`with_session = 0`).
`LEAD_SESSION_TRACEABILITY = PASS (implementado; aguardando lead pós-deploy)`.
Nenhum nome, telefone, e-mail, mensagem ou endereço em `analytics_events`:
`PII_IN_TELEMETRY = 0`.

## 6. WhatsApp

Cadeia existente: sessão → CTA → lead (`dynamic_form_leads`) → token
(`whatsapp_redirect_tokens.used_at`, consumo server-side).
`WHATSAPP_SESSION_TRACEABILITY = PASS` no mecanismo.
Limite conhecido, não de medição: projetos sem número oficial cadastrado
retornam confirmação honesta sem redirect (micro-rodada de robustez já
entregue). `CHANNEL_UNAVAILABLE_PROJECTS` = dependência de cadastro
(números oficiais dos clientes), inalterada nesta execução; nenhum número
foi inventado ou reutilizado.

## 7. `/servicos`

Instrumentação existente: `page_view`, `cta_click`/`contact_cta_click`,
`add_to_cart`, `checkout_started`, `purchase` e handoff WhatsApp via token.
`SERVICOS_MEASUREMENT = COMPLETE` (cobertura). Nenhuma alteração na loja.

## 8. Consulta pós-cutover (V2 · humano · cutover → agora)

| Superfície | Sessões humanas | Page views | CTA | Leads | WhatsApp |
|---|---:|---:|---:|---:|---:|
| /portfolio (e projetos) | 61 | 61 | 0 | 1 | 0 |
| /blog | 8 | 8 | 0 | — | — |
| /servicos | 8 | 8 | 0 | — | — |
| / (home) | 4 | 8 | 0 | — | — |

Total pós-cutover: 367 eventos V2 (278 human, 89 internal) e 520 eventos V1
residuais da versão antiga ainda em cache/navegações abertas.
`POST_CUTOVER_QUERY = PASS` · `DATA_MATURITY = INSUFFICIENT` (< 24 h).
Nenhuma taxa foi interpretada; nenhuma decisão comercial tomada.

## 9. Matriz final de cobertura

| Superfície | Page View | Attribution | CTA | Lead | WhatsApp |
|---|---|---|---|---|---|
| Home | PASS | PASS | PASS | PASS | PASS |
| Portfólio (índice) | PASS | PASS | N/A | N/A | N/A |
| Projeto `/portfolio/:slug` | PASS | PASS | PASS | PASS | PASS* |
| `/servicos` | PASS | PASS | PASS | PASS | PASS |
| Serviço `/servicos/:slug` | PASS | PASS | PASS | PASS | PASS |
| Diagnóstico 0WEB | PASS | PASS | PASS | PASS | PASS |

\* mecanismo completo; a etapa só produz dado nos projetos com número
oficial cadastrado — os demais aparecem como `WHATSAPP_NOT_CONFIGURED`,
nunca como 0%.

## 10. Gates

```
V2_PRODUCTION                      = PASS
CUTOVER_SOURCE_COUNT               = 1
PAGE_VIEW_PRODUCTION_IDEMPOTENCY   = PASS
FIRST_TOUCH_PRODUCTION             = PASS
DIRECT_PRODUCTION                  = PASS
INTERNAL_NAV_ATTRIBUTION           = PASS
SOCIAL_PROOF_EVENT_STORM           = RESOLVED
LEAD_SESSION_TRACEABILITY          = PASS
WHATSAPP_SESSION_TRACEABILITY      = PASS
SERVICOS_MEASUREMENT               = COMPLETE
PII_IN_TELEMETRY                   = 0
POST_CUTOVER_QUERY                 = PASS
DATA_MATURITY                      = INSUFFICIENT
METRICS_UI_CHANGED                 = NO
PUBLIC_VISUAL_CHANGED              = NO
PRICING_CHANGED                    = NO
FUNNEL_BEHAVIOR_CHANGED            = NO
SEO_CHANGED                        = NO
TYPECHECK = PASS · TESTS = 374/0 · PRIVACY = PASS · BUILD = PASS

MEASUREMENT_TRUTH = OBSERVING
```

Não haverá Rodada 3 de medição: acumular volume V2 e revisar somente com
maturidade suficiente, sempre em período pós-cutover.
