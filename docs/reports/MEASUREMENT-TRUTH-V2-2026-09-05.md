# MEASUREMENT_TRUTH — Rodada 1 (Telemetria V2)

Data: 2026-09-05 · Escopo: apenas qualidade da medição. Nenhuma mudança visual,
de oferta, rota, funil, CTA, SEO, `/portfolio` ou `/servicos`.

## 1. Tracking antigo (V1) — onde estava o problema

Fluxo existente (mantido, não duplicado):

```
browser → trackEvent() (src/lib/analytics.ts)
        → persistEvent() (src/lib/persistence.ts)
        → analytics-queue (idempotente por event id)
        → analytics_events (Supabase)
```

Complementos: `visitantes_rastreio`/`visitor_events` (middleware server-side),
`dynamic_form_leads` (leads), `whatsapp_redirect_tokens` (WhatsApp).
Sessão/visitante: `src/lib/visitor.ts` (`sessionStorage`/`localStorage`).

Defeitos comprovados:

| Defeito | Causa no código |
|---|---|
| `utm_source = "site"` em 56.637/56.643 | `DEFAULT_UTM` em `src/lib/site-config.ts` era aplicado a todo evento via `getActiveUtms()` |
| Sem `page_view` confiável | Nenhum evento de navegação existia; nenhuma rota emitia page view |
| `social_proof_view` = 38.293 (~68%) | `SocialProof.tsx` emitia no `onAnimationStart`, a cada ciclo de 8,5s |
| Sem separação humano/bot/QA | Classificação existia só no middleware, não nos eventos de produto |

## 2. Tracking V2 — contrato implementado

`src/lib/telemetry-v2.ts` (funções puras + integração no caminho existente):

- `TELEMETRY_VERSION = 2`; todo evento novo grava `metadata_json.tv = 2`.
- `MEASUREMENT_TRUTH_V2_CUTOVER = 2026-09-05T22:00:00.000Z`.
- Envelope por evento: `tv`, `traffic_type`, `ft_channel`, `ft_source`,
  `ft_medium`, `ft_campaign`, `ft_landing_path`, `ct_channel`, `ct_source`.
- Histórico V1 preservado integralmente; nada foi migrado nem reescrito.

## 3. Atribuição

- **First touch** (`sessionStorage: 0web_first_touch_v2`): primeira aquisição
  real da sessão. Navegação interna nunca sobrescreve UTM/referral.
- **Current touch**: origem da entrada atual, exposta em paralelo (`ct_*`).
- **Classificação**: `utm` → `referral` (hostname normalizado) → `internal`
  (mesmo domínio, contexto de navegação, não aquisição) → `direct` (sem UTM e
  sem referrer) → `unknown` (só quando realmente indeterminável).
- `utm_source = "site"` foi eliminado do caminho de eventos.

## 4. Page view

`src/components/site/TelemetryPageView.tsx`, montado uma única vez em
`__root.tsx`. Uma navegação real = 1 evento. Idempotência determinística por
`path normalizado + contador de transição` em memória do documento: StrictMode,
hidratação, remount e re-render repetem a chave e não emitem nada; recarregar a
página é um documento novo e volta a contar. `?foo=1` e `?foo=2` são a mesma
página (path normalizado, minúsculo, sem barra final).

## 5. Prova social

| | Antes | Depois |
|---|---|---|
| `social_proof_view` | 1 por ciclo de animação (~49 eventos/sessão na home) | 1 por sessão |
| `portfolio_social_proof_view` | 1 por mount/rota | 1 por sessão + projeto |

Regra determinística (sem amostragem aleatória). Componentes e experiência
visual intactos.

## 6. Bots / QA

`traffic_type` marcado, nunca apagado: `human`, `bot` (UA conhecido),
`automation` (`navigator.webdriver`, Playwright), `internal` (localhost,
preview, `/app`, `/qa`, `?qa=1`), `unknown`. Métricas comerciais filtram por
`traffic_type = 'human'`; os registros continuam auditáveis.

## 7. Privacidade

Allowlist de query params: `utm_*`, `gclid`, `fbclid` — nada mais é persistido
(apenas hostname do referrer, nunca a URL externa completa).
`sanitizeAnalyticsParams()` descarta chaves de PII (nome, e-mail, telefone,
mensagem, endereço, texto livre, tokens), strings acima de 120 caracteres e
qualquer valor com e-mail/telefone.

## 8. Consulta de funil

`scripts/measurement-funnel.sql` — leitura, sem painel novo.
`SESSION → PAGE_VIEW → CTA → LEAD → WHATSAPP` por path, projeto, serviço,
first-touch source, campanha e período. Fontes: `analytics_events` (sessão,
page_view V2, CTA `funnel_open|wa_funnel_open`), `dynamic_form_leads` (lead),
`whatsapp_redirect_tokens.used_at` (WhatsApp).

## 9. Cutover

`MEASUREMENT_TRUTH_V2_CUTOVER = 2026-09-05T22:00:00.000Z`.
Relatórios devem separar `PRE_V2` (`metadata_json->>'tv'` nulo) de `V2`
(`= '2'`) e exibir a divisão quando o período cruzar o corte.

## 10. Baseline BEFORE (V1, contaminado — nunca somar ao V2)

```
V1_EVENTS_30D             = 56.612
V1_SOCIAL_PROOF_VIEW_30D  = 38.293  (~68%)
V1_UTM_SITE               = 56.637 / 56.643
PORTFOLIO_VISITS_30D      ≈ 5.931
HOME_VISITS_30D           ≈ 901
SERVICOS_VISITS_30D       ≈ 3
```

Ainda não existe volume V2. A validação desta rodada é técnica (contrato +
testes), não estatística.

## Gates

```
TELEMETRY_VERSION                  = 2
CUTOVER_TIMESTAMP                  = 2026-09-05T22:00:00.000Z
PAGE_VIEW_IMPLEMENTED              = YES
PAGE_VIEW_IDEMPOTENCY              = PASS
FIRST_TOUCH_ATTRIBUTION            = PASS
INTERNAL_NAV_PRESERVES_ATTRIBUTION = PASS
DIRECT_CLASSIFICATION              = PASS
EXTERNAL_REFERRER_CLASSIFICATION   = PASS
UTM_SOURCE_LITERAL_SITE_REMOVED    = YES
SOCIAL_PROOF_EVENT_STORM_FIXED     = YES
BOT_TRAFFIC_CLASSIFICATION         = PASS
INTERNAL_QA_CLASSIFICATION         = PASS
PII_IN_ANALYTICS                   = 0
FUNNEL_QUERY_AVAILABLE             = YES
V1_HISTORY_PRESERVED               = YES
V1_V2_SEPARATION                   = PASS

PORTFOLIO_ORIGINALITY_AND_COVERS   = CLOSED
TOTAL_PROJECTS                     = 68
COMPLETE                           = 68/68
PUBLIC_VISUAL_CHANGED              = NO
PORTFOLIO_LAYOUT_CHANGED           = NO
SERVICOS_CHANGED                   = NO
CTA_BEHAVIOR_CHANGED               = NO
FUNNEL_BEHAVIOR_CHANGED            = NO
SEO_CHANGED                        = NO
ROUTES_CHANGED                     = NO
DATABASE_DESTRUCTIVE_CHANGE        = NO   (nenhuma migration; V2 usa metadata_json)

TYPECHECK = PASS · TESTS = 369/0 · BUILD = PASS · PRIVACY = PASS
```

## Próxima decisão

Não iniciar upsell, `/servicos`, imagens, bundle, unificação de leads ou
`funnel_error`. Aguardar volume V2 real após o cutover; qualquer decisão de
conversão tomada com o histórico V1 seria inferência, não evidência.
