# Padrão — Coerência de funil por projeto (/portfolio/:slug)

Cada projeto é o site de um cliente. O bloco "próximo passo", o CTA e a
mensagem enviada ao WhatsApp precisam falar do negócio daquele cliente,
nunca de "o projeto", nunca do funil comercial da 0WEB e nunca com a
intenção de outro segmento.

## Fonte de verdade

- `src/config/portfolio-funnel-context.json` — contrato por slug:
  `intent`, `nextStepTitle`, `nextStepBody`, `primaryCtaLabel`, `theme`.
- `src/lib/portfolio-funnel-context.ts` — resolver, léxico proibido por
  intenção e auditoria (`PASS` / `WARNING` / `FAIL`).

Precedência: contrato do projeto > fallback por segmento > fallback neutro
(`Fale com a empresa`, intenção `contato`). O fallback nunca copia texto de
outro projeto.

## Intenções suportadas

`orcamento`, `agendamento`, `pedido`, `avaliacao`, `visita`, `contato`,
`reserva`, `diagnostico`, `solicitacao`.

A intenção define o modo do funil (`booking` para agendamento/reserva,
`proposal` nos demais), o assunto e o "PRÓXIMO PASSO" da mensagem.

## Onde é aplicado

- `PortfolioConversionNarrative` — título, descrição, CTA e modo do quiz.
- `BeautyBookingQuiz` — copy semântica e preview da mensagem.
- `r.whatsapp.$token` — assunto e próximo passo da mensagem final,
  resolvidos no servidor pelo `client_key`. O número segue server-only.

## Governança

- `bun run check:portfolio-funnel-context` (também no `prebuild`).
- Relatórios: `reports/portfolio-funnel-context.{json,md}`; linha de base
  anterior às correções em `reports/portfolio-funnel-context-baseline.json`.
- Códigos: `PORTFOLIO_FUNNEL_CONTEXT_MISMATCH`, `PORTFOLIO_FUNNEL_GENERIC_CTA`,
  `PORTFOLIO_FUNNEL_COPY_SHARED`, `PORTFOLIO_FUNNEL_FALLBACK`.
- O score visual penaliza `FUNNEL_CONTEXT_MISMATCH` (P1) e
  `FUNNEL_CONTEXT_FALLBACK` (P2); funil `FAIL` impede classificação PREMIUM.
- Admin: seção "Funil / Próximo passo" em `/app/portfolio/<slug>` com
  intenção, textos, CTA, mensagem e preview desktop/mobile.

## Novo projeto

O wizard cria o projeto com fallback neutro. Antes de publicar, registre o
contrato do slug em `portfolio-funnel-context.json` — o gate acusa
`PORTFOLIO_FUNNEL_FALLBACK` enquanto isso não acontecer.
