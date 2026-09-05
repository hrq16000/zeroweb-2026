# PORTFOLIO_CONVERSION_BASELINE

Data: 2026-09-05 · Escopo: medição do funil por projeto em `/portfolio/:slug`
Estado preservado: `MAINTENANCE_MODE` · nenhuma alteração visual, de motion, SEO,
capa, CTA público ou funil. Nenhum painel, rota ou base nova.

---

## 1. Fontes canônicas (uma por etapa — nunca somadas entre si)

| Etapa | Fonte canônica | Por projeto | Contínua | Confiável |
|---|---|---|---|---|
| VIEW | `analytics_events.event_name='portfolio_view'` (path `/portfolio/:slug`) | Sim | Sim | **Sim** |
| CTA | `analytics_events.event_name IN ('funnel_open','wa_funnel_open')` | Sim (path) | Sim | **Sim** |
| POPUP | `analytics_events.event_name='popup_view'` (pop-up comercial 0WEB) | Sim (path) | Sim | **Sim** |
| LEAD | `dynamic_form_leads.metadata_json->>page_url`, fallback `client_key` | Sim | Sim | **Sim** |
| WHATSAPP | `whatsapp_redirect_tokens.used_at` (join por `lead_id`) | Sim (via lead) | Sim | **Sim** |

GA4/GTM permanecem apenas como fonte analítica externa. Nenhuma métrica soma
fontes equivalentes.

Implementação única: `src/lib/portfolio-funnel-metrics.functions.ts`
(`getPortfolioFunnelMetrics`, autenticada), exibida em
`src/components/admin/PortfolioFunnelPanel.tsx`, já montada em
`/app/portfolio` e `/app/portfolio/:slug`, com janelas de **7 / 30 / 90 dias**.

## 2. Duas lacunas objetivas encontradas e corrigidas (medição, não produto)

1. **LEAD e WHATSAPP estavam zerados para todos os projetos.** A função lia
   `metadata_json.portfolio_slug`, chave que **não existe em nenhum dos 241
   leads** dos últimos 30 dias. A atribuição real já existia sob `page_url`
   (212 leads) e `client_key` (229 leads). Passou a usar essas chaves.
2. **CTA subcontava.** A fonte era só o botão flutuante (148 eventos), abaixo do
   número de leads — impossível como denominador. A intenção comercial real é a
   abertura de funil: `funnel_open` (107) + `wa_funnel_open` (322), mecanismos
   distintos e mutuamente exclusivos por projeto. O clique do botão flutuante é
   etapa anterior do mesmo caminho e **não é somado**, para não duplicar.

Nenhum evento novo foi criado, nenhum tracker paralelo, nenhuma tabela nova.
Teste de regressão: `src/lib/portfolio-funnel-metrics.test.ts`.

## 3. Regra de VIEW confirmada no runtime

`src/components/portfolio/PortfolioView.tsx`: uma visita por
`sessionStorage['0web:portfolio_view:<slug>']`.
- mesma sessão + mesmo slug + refresh → **não infla** (chave persiste na aba);
- mesma sessão + slug diferente → **conta no novo projeto** (chave por slug);
- nova sessão → **conta novamente**.

## 4. Privacidade

`portfolio_view`, `funnel_open`, `wa_funnel_open` e `popup_view` carregam apenas
slug, rota, origem e trigger. Nenhum nome, telefone, e-mail, endereço ou texto
livre em analytics. O número de WhatsApp continua resolvido server-side por
token; nunca vai para analytics. `PII_REGRESSION = 0`.

Observação registrada (não alterada nesta rodada): 23 leads guardam `ip` e
`user_agent` em `dynamic_form_leads.metadata_json`. É a base de leads, não a de
analytics, e está sob RLS — fica como item a revisar, não como regressão.

## 5. Baseline comercial — 30 dias (dados reais, após correção)

| Projeto | Views | CTA | Popup | Leads | WhatsApp | Classificação |
|---|---:|---:|---:|---:|---:|---|
| paraiso-do-hot-dog | 70 | 10 | 341 | 20 | 20 | HEALTHY_FUNNEL |
| rm-fretes | 47 | 20 | 52 | 26 | 24 | HEALTHY_FUNNEL |
| r_beauty | 42 | 4 | 328 | 6 | 6 | HEALTHY_FUNNEL |
| sos-presentes-cosmeticos | 42 | 0 | 51 | 0 | 0 | HIGH_TRAFFIC_LOW_CTA |
| dyzpromo | 42 | 4 | 367 | 16 | 15 | HEALTHY_FUNNEL |
| marido-de-aluguel | 42 | 5 | 76 | 8 | 0 | GOOD_LEAD_LOW_WHATSAPP |
| emporio-lelecute | 41 | 6 | 196 | 12 | 11 | HEALTHY_FUNNEL |
| renata-beauty | 41 | 1 | 355 | 12 | 10 | HEALTHY_FUNNEL |
| eisenfer-tubos-acos | 39 | 4 | 10 | 6 | 0 | GOOD_LEAD_LOW_WHATSAPP |
| confeitaria-chyrley | 39 | 5 | 26 | 7 | 0 | GOOD_LEAD_LOW_WHATSAPP |
| ag-electrical-services | 39 | 5 | 26 | 7 | 0 | GOOD_LEAD_LOW_WHATSAPP |
| mp-festas-eventos | 39 | 3 | 28 | 6 | 0 | GOOD_LEAD_LOW_WHATSAPP |
| rj-servicos-drywall | 39 | 4 | 69 | 6 | 0 | GOOD_LEAD_LOW_WHATSAPP |
| studio-de-cilios | 39 | 4 | 20 | 4 | 0 | GOOD_LEAD_LOW_WHATSAPP |
| lk-alvenaria | 34 | 4 | 6 | 5 | 0 | GOOD_LEAD_LOW_WHATSAPP |
| angel-mix-brecho | 30 | 0 | 1 | 0 | 0 | HIGH_TRAFFIC_LOW_CTA |
| refrigeracao-maresia | 23 | 4 | 12 | 6 | 0 | GOOD_LEAD_LOW_WHATSAPP |
| lolipa-arte-em-festas | 20 | 0 | 1 | 0 | 0 | HIGH_TRAFFIC_LOW_CTA |
| heloa-gas | 19 | 0 | 2 | 0 | 0 | HIGH_TRAFFIC_LOW_CTA |
| paulo-mestre-de-obras | 19 | 4 | 10 | 6 | 0 | GOOD_LEAD_LOW_WHATSAPP |

Demais projetos: `INSUFFICIENT_DATA` (menos de ~20 visitas na janela).

**Thresholds usados, declarados:** amostra mínima de 20 visitas em 30 dias para
classificar; `HIGH_TRAFFIC_LOW_CTA` = amostra suficiente com CTA = 0;
`GOOD_LEAD_LOW_WHATSAPP` = leads > 0 e WhatsApp = 0; `HEALTHY_FUNNEL` = as cinco
etapas com sinal. Ausência de dado é `—/NO_DATA`, nunca 0.

## 6. Oportunidades registradas (não executar agora)

1. **WhatsApp = 0 em 10 projetos que geram lead.** O lead entra e o redirect
   tokenizado não é consumido. `problem`: perda entre lead e conversa.
   `hypothesis`: o token só é usado em alguns fluxos de funil. `small_change`:
   inspecionar por que `used_at` fica nulo nesses funis. `measurement`:
   `WHATSAPP_PER_LEAD` por projeto.
2. **`sos-presentes-cosmeticos`, `angel-mix-brecho`, `lolipa`, `heloa-gas`:
   tráfego com CTA zero.** Registrar; não redesenhar sem hipótese medida.
3. **Pop-up com volume desproporcional em alguns projetos** (367 exibições para
   42 visitas em `dyzpromo`) — provável reexibição por sessão. Verificar antes
   de qualquer leitura de `POPUP_RATE`.

## 7. Resultado

```text
VIEW_SOURCE      = analytics_events:portfolio_view
CTA_SOURCE       = analytics_events:funnel_open|wa_funnel_open
POPUP_SOURCE     = analytics_events:popup_view
LEAD_SOURCE      = dynamic_form_leads.metadata_json.page_url|client_key
WHATSAPP_SOURCE  = whatsapp_redirect_tokens.used_at

VIEW_RELIABLE      = YES
CTA_RELIABLE       = YES
POPUP_RELIABLE     = YES (volume por sessão a auditar antes de usar POPUP_RATE)
LEAD_RELIABLE      = YES
WHATSAPP_RELIABLE  = YES

NEW_TRACKER_REQUIRED   = NO
NEW_DATABASE_REQUIRED  = NO
NEW_DASHBOARD_REQUIRED = NO

FUNNEL_MEASURABLE_END_TO_END     = YES
PORTFOLIO_CONVERSION_MEASUREMENT = ACTIVE
```
