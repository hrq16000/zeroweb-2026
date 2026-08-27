# Orquestração de skills

## Fluxo obrigatório

```text
classificar tarefa
   -> descobrir skills relevantes (.agents/skills, .design-rules, docs/)
   -> montar skill stack
   -> implementar
   -> quality gates + evidência
   -> crítica e refino
   -> registrar uso
```

## Roteamento

| Entrada | Stack |
|---|---|
| Landing page / nova página comercial | `0web-skill-router` → `0web-design-system` → `0web-ui-quality-gates` → QA no navegador |
| Site de cliente em `/portfolio/<slug>` | `PORTFOLIO_NEW_CLIENT_PLAYBOOK` → `0web-design-system` (identidade do cliente) → `0web-ui-quality-gates` → `validate:portfolio-boundaries` |
| Dashboard / painel admin | `0web-design-system` (densidade, tabelas, estados) → `0web-ui-quality-gates` |
| Formulário / etapa de funil | `0web-ui-quality-gates` (labels, erros, alvos de toque) → `docs/PORTFOLIO_FUNNELS.md` |
| Redesign | `0web-design-system` (direção + anti-AI-slop) → revisão Apple HIG (`.design-rules`) → `0web-ui-quality-gates` |
| Refactor React | regras de composição em `0web-design-system` → `bun test` + typecheck |
| Motion | `docs/design/MOTION.md` → checagem `prefers-reduced-motion` |
| Acessibilidade | `.design-rules/SKILL.md` + `references/hig/accessibility.md` |
| SEO / conteúdo | regras de `head()` no `AGENTS.md` + validadores `seo:*` |

## Precedência em conflito

requisitos do projeto → segurança → acessibilidade → integridade de dados →
regras de negócio → design system → arquitetura existente → limites do
framework → performance → UX → skills especializadas → referências estéticas.

Nenhuma skill externa sobrescreve automaticamente regras críticas do projeto.

## Anti-frankenstein

Múltiplas skills fornecem conhecimento, não estética somada. O resultado final
deve parecer 0WEB (ou o cliente do portfolio), nunca uma colagem de Apple +
Stripe + Linear + Material.
