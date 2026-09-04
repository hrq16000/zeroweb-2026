# Padrão de capas do catálogo /portfolio

Capa é o primeiro contato do visitante com um cliente hospedado. Ela precisa
representar o negócio real, nunca a marca 0WEB, nunca outro cliente e nunca um
contato operacional.

## Fonte de verdade

| Arquivo | Papel |
|---|---|
| `src/config/portfolio-cover-plan.json` | plano curado: `source` (asset do próprio cliente), `focal` (0–1), `mode` (`crop`), `issues` |
| `scripts/build-portfolio-covers.mjs` | gera `public/images/<slug>/capa-card.jpg` em 16:10 a partir do plano |
| `src/config/portfolio-visual-review.json` | julgamento humano: `coverReview`, `coverDecision`, `coverFocal`, `notes` |
| `reports/portfolio-covers-build.json` | resultado da última geração (dimensões, baixa resolução, falhas) |

O card de `/portfolio` consome a capa gerada e aplica o focal point como
`object-position`. Sem entrada no plano, o card mantém o fallback histórico
(`catalog.image` → social → logo → default).

## Regras

1. A fonte deve estar dentro de `public/images/<slug>/`. Nunca usar asset de
   outro cliente nem imagem genérica.
2. Proporção final 16:10, sem upscale artificial: o recorte respeita a
   resolução nativa do asset.
3. **Proibido publicar capa que contenha telefone, WhatsApp, e-mail ou endereço
   operacional.** Peças gráficas (flyers, tabelas de preço, cartões) foram
   excluídas por esse motivo; a capa deve ser fotografia do trabalho real.
4. Focal point evita cortar rosto, produto ou elemento principal.
5. Baixa resolução real é registrada no relatório e mantém o projeto em
   `NEEDS_REVIEW` até o cliente enviar material melhor.

## Estados de revisão

- `UNREVIEWED` — sem julgamento humano.
- `NEEDS_REVIEW` — capa insuficiente ou bloqueada (ex.: só há arte com contato).
- `APPROVED` — capa dedicada, revisada em 390px e 1440px.
- `REJECTED` — capa reprovada; bloqueia classificação PREMIUM.

## Fluxo

```bash
bun scripts/build-portfolio-covers.mjs [slug...]
node scripts/check-portfolio-visual-quality.mjs
```

Revisão visual e decisão ficam em `/app/portfolio/:slug` (bloco “Revisão de
capa”, com card desktop, card mobile e asset original) e no filtro de capas em
`/app/portfolio`.
