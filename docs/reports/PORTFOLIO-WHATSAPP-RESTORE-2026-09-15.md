# Restauração de destinos WhatsApp — 2026-09-15

## Motivo

A reconciliação atual classificou 28 portfolios como `MISSING` porque passou a
aceitar como fonte operacional somente env/secret e `portfolio_client_settings`.
O histórico comprova que parte desses destinos existia antes da migração e ficou
órfã quando os defaults em código foram removidos.

## Causa comprovada

- 2026-08-27: o commit `ec3067bd1e0cf942e5dea6d8b68dcac15073a9c5`
  removeu defaults de WhatsApp do resolvedor e passou a depender de env.
- O caso `r-beauty` possuía explicitamente o destino histórico
  `554196048639`; o valor continuou inclusive na allowlist de contato de cliente,
  mas deixou de ser encontrado pelo resolvedor.
- O caso `marido-de-aluguel` / Mestre dos Serviços possui documentação
  first-party identificando `5541997452053` como WhatsApp da operação. Uma regra
  posterior classificou esse mesmo número apenas como institucional e bloqueou o
  portfolio.

## Correção aplicada nesta branch

`src/lib/contact.server.ts` passou a reidratar somente defaults históricos
comprovados quando a configuração atual está vazia. Env/configuração explícita
continua tendo precedência. Não existe fallback entre clientes.

Restaurados até esta etapa:

- `r-beauty`
- `marido-de-aluguel`

Nenhum layout, copy, imagem, SEO, motion ou CTA foi alterado.

## Regra para os demais

Recuperar somente mediante evidência inequívoca do próprio cliente: histórico
Git, material first-party ou presença oficial compatível. Não inventar dígito e
não compartilhar destino entre marcas sem prova.
