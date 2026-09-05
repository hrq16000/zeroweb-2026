# Padrão de métricas do funil — /portfolio/:slug

Objetivo: medir `VIEW → CTA → POPUP → LEAD → WHATSAPP` por projeto com **uma
fonte canônica por métrica**, sem tracker paralelo, sem base nova e sem PII.

## Fontes canônicas

| Métrica | Constante | Fonte real |
|---|---|---|
| Visitas | `PORTFOLIO_VIEW_SOURCE` | `analytics_events.event_name = 'portfolio_view'`, slug extraído de `path` `/portfolio/:slug` |
| CTA do cliente | `CTA_CLICK_SOURCE` | `analytics_events.event_name = 'portfolio_contact_floating_click'` |
| Pop-up 0WEB | `POPUP_OPEN_SOURCE` | `analytics_events.event_name = 'popup_view'` (label `portfolio_upsell`) |
| Leads | `LEAD_SOURCE` | `dynamic_form_leads.metadata_json->>portfolio_slug` |
| WhatsApp | `WHATSAPP_SOURCE` | `whatsapp_redirect_tokens.used_at` (token server-side vinculado ao lead) |

Implementação: `src/lib/portfolio-funnel-metrics.functions.ts`
(`getPortfolioFunnelMetrics`, autenticada por `requireSupabaseAuth`).
Consumo: `src/components/admin/PortfolioFunnelPanel.tsx`, exibido em
`/app/portfolio` (visão compacta) e `/app/portfolio/:slug` (bloco “Desempenho”,
períodos de 7, 30 e 90 dias). Nenhum dashboard paralelo foi criado.

## Regra de contagem de VIEW

`src/components/portfolio/PortfolioView.tsx` emite `portfolio_view` uma vez por
**sessão do navegador × slug**, com trava em `sessionStorage`
(`0web:portfolio_view:<slug>`):

- mesma sessão + mesmo slug + refresh/navegação client-side → **não** conta de novo;
- mesma sessão + slug diferente → conta no outro projeto;
- nova sessão (nova aba/janela ou sessão encerrada) → nova view;
- `sessionStorage` indisponível → conta uma vez por montagem (degradação segura).

## GA4/GTM

Pixels externos podem continuar existindo, mas a métrica operacional do
portfólio é exclusivamente a interna acima. **Nunca somar** pageview externo com
view interna: são sistemas de medição distintos.

## Métricas derivadas

`CTA_RATE`, `POPUP_RATE`, `LEAD_RATE` e `WHATSAPP_RATE` usam `views` como
denominador. Sem denominador (`views = 0`), o valor é `null` e a interface mostra
`—`/`NO_DATA`. Zero fabricado é proibido.

## Privacidade

O analytics recebe apenas `portfolio_slug`, nome do evento, rota e identificadores
anônimos de sessão/visitante. Nunca nome, telefone, e-mail ou texto livre. O
número de WhatsApp permanece server-side, resolvido por `clientKey`/token.

## Cidade

Cidade do projeto, cidade informada pelo lead e localização do visitante são
dimensões diferentes e não podem ser combinadas. Métricas por cidade só podem
existir com origem única declarada.
