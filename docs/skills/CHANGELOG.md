# Skill changelog / usage log

## 2026-08-27 — Fundação skills-first

**Task:** criar infraestrutura canônica de skills, registry, roteamento,
segurança e design docs para o ecossistema 0WEB.

**Skills considered:** frontend-design, ui-craft, apple-design-skill,
tasteful-ui, open-design, uxui-principles, ux-discovery, vercel agent-skills,
ui-ux-agent-skill-system, Figma MCP skills, K-Dense ui-ux-design.

**Skills used:** princípios de `frontend-design` (direção estética explícita,
anti-AI-slop), `ui-craft` (tokens, responsivo, motion, a11y, polish),
Apple HIG local (`.design-rules/`) para hierarquia, foco, estados e touch
targets, Vercel `composition-patterns`/`react-best-practices` para as regras de
API de componente e performance.

**Skills rejected:** downloads externos e ZIPs não auditados (risco de execução
de código de terceiros); `K-Dense ui-ux-design` (upstream indisponível);
Figma MCP (sem sessão desktop ativa neste ambiente).

**Changes:** `.agents/skills/{0web-skill-router,0web-design-system,0web-ui-quality-gates}`,
`docs/skills/*`, `docs/design/*`, seção de roteamento no `AGENTS.md`.

**Validation:** ver seção de execução no PR (typecheck, `bun test`,
`bun run validate:portfolio-boundaries`).

**Template para próximas tarefas**

```text
TASK:
SKILLS CONSIDERED:
SKILLS USED / WHY:
FINDINGS (CRITICAL/HIGH/MEDIUM/LOW):
CHANGES:
VALIDATION (comandos + saída real):
SKILLS REJECTED / REASON:
```

## Automação e validação de /portfolio

- Skills: `0web-skill-router`, `0web-design-system`, `0web-ui-quality-gates`.
- Entregas: gerador `scaffold:portfolio`, validador estrutural
  `validate:portfolio-scaffold` (no prebuild), E2E de pop-up, regressão visual,
  auditoria axe-core, budgets Lighthouse ampliados, painel de performance dos
  portfólios e página viva do design system.
- Validação: `bun test` (183 pass), `validate:portfolio-boundaries`,
  `validate:portfolio-meta`, `validate:portfolio-scaffold`, typecheck e build.
