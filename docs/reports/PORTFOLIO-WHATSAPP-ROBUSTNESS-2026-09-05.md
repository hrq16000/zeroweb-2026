# Robustez do canal WhatsApp — /portfolio

Data: 2026-09-05 · Escopo: micro-rodada. Sem alteração de design, motion, SEO,
copy comercial ou funil. `PORTFOLIO_STATUS = MAINTENANCE_MODE`.

## Fonte canônica

Server-only, em `src/lib/whatsapp-redirect.server.ts`:

- `portfolioWhatsAppEnvName(clientKey)` — aliases legados preservados + convenção
  nova `PORTFOLIO_WHATSAPP_<CLIENT_KEY>`.
- `getPortfolioWhatsAppChannelState(clientKey)` → `CONFIGURED | NOT_CONFIGURED | INVALID`.
- `resolvePortfolioWhatsAppContact(clientKey)` — inalterado na assinatura; só
  devolve dígitos quando `CONFIGURED`.

Nenhum número em bundle, analytics ou log. Sem fallback para a 0WEB.

`ADMIN_EDIT_AVAILABLE = NO` — números continuam como segredos de servidor.
Um número oficial novo entra apenas cadastrando o segredo pela convenção acima:
não exige alteração de página, rota ou código.

## Inventário real (resolver server-side, 68 chaves)

| Estado | Qtde |
|---|---|
| CONFIGURED | 7 |
| NOT_CONFIGURED | 61 |
| INVALID | 0 |
| UNKNOWN | 0 |

CONFIGURED: heloa-gas, dyzpromo, renata-beauty, r-beauty, emporio-lelecute,
paraiso-do-hot-dog, rm-fretes.

## Comportamento novo

1. O lead é salvo **antes** de qualquer verificação de canal.
2. Sem canal, `submitPortfolioQuiz` devolve `redirectPath: null` +
   `whatsappChannel`, registra o incidente existente
   (`funnel_whatsapp_routing / missing_client_whatsapp_number`) e **não lança erro**.
3. O formulário mostra confirmação honesta com protocolo, sem prometer retorno.
4. `/r/whatsapp/:token` com lead válido e canal ausente responde **200**
   “Solicitação registrada”, sem consumir token nem expor contato. Token
   inválido/expirado permanece igual.

## Métricas

`portfolio-funnel-metrics` passa a expor `whatsappChannel` e
`whatsappRateReason`. Canal ausente vira `—`/`WHATSAPP_NOT_CONFIGURED`, nunca
`0%`, e é excluído do denominador do total. Painel existente mostra a coluna;
nenhum dashboard novo.

## Gates

typecheck PASS · bun test 374/0 (5 novos: configured/not-configured/invalid/
chave desconhecida/convenção) · client-privacy PASS · portfolio-boundaries 68 OK ·
build PASS · dist sem contato operacional.

Grupo B permanece `INSUFFICIENT_DATA`. Os 61 projetos seguem aguardando número
oficial do cliente — backlog operacional, não dívida técnica.
