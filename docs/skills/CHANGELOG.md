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

## 2026-08-27 — Descoberta dinâmica de skills

**Task:** substituir o catálogo estático por um processo de descoberta, ranking,
revisão de segurança e composição dinâmica de skills.

**Changes:** nova skill `.agents/skills/0web-skill-discovery` (pipeline
TASK→CLASSIFY→FIND→RANK→SECURITY→SELECT→EXECUTE→CROSS-REVIEW→TEST→VISUAL QA→SHIP,
modelo de autoridade por camada, landing page policy evidence-first, regra
anti-redundância, cross-review); `Step 1.5` no `0web-skill-router`; novo vocabulário
de status e fila de auditoria em `docs/skills/REGISTRY.md`.

**Skills rejected:** nenhuma instalada nesta rodada — as 11 candidatas entram como
`SECURITY_REVIEW_REQUIRED`/`REFERENCE_ONLY`/`REDUNDANT` até revisão do repositório original.

**Validation:** `bun test` + typecheck (docs/skills only, sem impacto de runtime).

## Governança de skills + gates do pop-up

- Tarefa: dashboard de skills, relatório evidence-first, testes de pipeline,
  guardrails de landing, scanner de privacidade pré-build, métricas temporais,
  simulação/amostragem, canais de alerta e integração ao CI.
- Skills usadas: `0web-skill-router` (classificação e stack),
  `0web-design-system` (tokens e componentes dos painéis),
  `0web-ui-quality-gates` (estados, foco, alvos ≥44px, evidência),
  `.design-rules` Apple HIG (revisão de hierarquia e leitura).
- Skills rejeitadas: landing-page skills (tarefa não é landing) e todas as de
  status `SECURITY_REVIEW_REQUIRED`/`QUARANTINED` (sem auditoria da origem).
- Validação real: `bun test` 216 pass / 0 fail; `bunx tsgo --noEmit` limpo;
  `bun run build` com todos os gates OK e bundle público sem contatos;
  `bun run scan:source-privacy` OK; `bun run test:e2e:portfolio-popup`
  7 sites OK; verificação visual dos painéis sem erros de console.
- Relatório evidence-first: `docs/skills/evidence/popup-governanca.md`.
# 2026-08-27 — monitoramento e Lighthouse de portfólios

# 2026-08-27 — contrato canônico do catálogo

# 2026-08-27 — catálogo mobile-first (ciclo 3)

- `/portfolio` passou a derivar identidade, segmento e tipo do catálogo canônico.
- Adicionados filtro por tipo, ordenação A–Z, query params e carregamento incremental de cards.
- Mantido o fallback visual legado durante a migração de conteúdo, evitando regressão de imagens/copy.
- Gates de catálogo, boundaries, metadata e performance aprovados.

- Criado `src/config/portfolio-catalog.json` com metadados de descoberta para 10 itens.
- Adicionado `validate:portfolio-catalog` ao prebuild e ao workflow de gates.
- O gate verifica campos obrigatórios, slugs únicos/válidos, tags e cobertura de clientes registrados.
- A migração dos cards da rota para essa fonte única fica planejada para o próximo ciclo, evitando alterar dados históricos sem revisão.

- Skills aplicadas: `0web-skill-router`, `0web-design-system`, `0web-ui-quality-gates` e padrão oficial de clientes.
- Implementado: captura nativa de LCP/CLS/INP por slug, ingestão server-side limitada, Lighthouse CI para todos os slugs registrados e upload de relatórios JSON/HTML.
- Validação: `validate:portfolio-boundaries`, `validate:portfolio-meta` e `validate:portfolio-performance` aprovados. Build local iniciou e regenerou `routeTree.gen.ts`; typecheck completo ficou limitado pelo tempo do ambiente.
- Publicação: depende de `LHCI_TARGET_URL` apontando para o deploy/preview; nenhuma credencial ou deploy foi inventado.
