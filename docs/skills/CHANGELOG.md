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

# 2026-08-28 — catálogo canônico, Web Vitals e gates (ciclo 4)

## 2026-08-28 — RJ Serviços de Drywall

- Task: novo site independente em `/portfolio/rj-servicos-drywall`, com identidade, imagens, funil, SEO local e motion próprios.
- Skills: `0web-skill-router`, `0web-skill-discovery`, `0web-design-system`, `0web-ui-quality-gates`, Apple HIG e `imagegen`.
- Findings: contato da arte de referência permaneceu fora do bundle; prova social sem métricas inventadas; imagens otimizadas; `prefers-reduced-motion` respeitado.
- Changes: cliente/catálogo/registry, página exclusiva, tema semântico, SEO local, dois assets próprios, migration e roteamento server-side do WhatsApp.
- Skills externas de landing/CRO rejeitadas por redundância e ausência de auditoria upstream; nenhum template instalado.

- Integrada a branch `codex/portfolio-catalog-cycle4` preservando as alterações existentes.
- Migration `20260828001000_create_portfolio_web_vitals.sql` aplicada (RLS, acesso público revogado, service_role apenas, índices por slug/métrica/data).
- Novo painel `/painel-web-vitals` com p75 de LCP/CLS/INP, amostras e alertas por slug (`src/lib/portfolio-vitals-metrics.functions.ts`, guarda de admin).
- `/portfolio` passou a derivar os cards do catálogo canônico com tipagem explícita; filtros de segmento, tipo, busca e ordenação persistidos na URL.
- `LHCI_TARGET_URL` corrigido para o domínio real de produção; Lighthouse CI cobre todos os slugs registrados e publica relatórios JSON/HTML como artefatos.
- Regressão visual estabilizada (espera por rede ociosa e imagens decodificadas) — 16 capturas em 0,00% de diferença.
- Gates executados: catálogo, boundaries, meta, scaffold, performance, `bun test` (230), `bun run build`, a11y, E2E de popup e de funis, regressão visual.

## 2026-08-28 — correção de CTA superior no funil

- Task: corrigir funis abertos por CTAs no topo que ficavam atrás do cabeçalho/preview em alguns `/portfolio/<slug>`.
- Skills: `0web-skill-router`, `0web-ui-quality-gates`, padrão oficial de clientes e revisão de acessibilidade Radix Dialog.
- Finding: `FunnelModalWrapper` usava o mesmo nível `z-50` do shell de preview; em stacking contexts aninhados o overlay e o painel eram parcialmente encobertos.
- Change: camada parametrizada do modal (`z-[100]`, conteúdo `z-[101]`, fechar `z-[102]`) com comentário de contrato, preservando fallback sem JavaScript e foco/ESC do Dialog.
- Auditoria transversal: removida a duplicação de rodapé nos clientes que já possuem footer editorial e adicionado `PortfolioBackToTop` universal, com alvo de toque de 44px e posição acima do CTA flutuante.

## 2026-08-28 — performance de portfolios (ciclo 1)

- Skills aplicadas: `0web-skill-router`, `0web-ui-quality-gates` e Vercel React Best Practices.
- Auditoria: 8 rotas HTTP 200; HTML SSR entre 30–88 KB; assets raster críticos acima de 1,9 MB identificados; gate de imagens passou.
- Próximo ciclo engatilhado em `docs/PERFORMANCE_PORTFOLIO_AUDIT.md`: conversão WebP/AVIF, budgets LCP/CLS/INP, waterfall de hidratação e QA funcional por slug.

## 2026-08-28 — modal de CTA portalizado

- Finding: CTAs superiores dentro do preview eram renderizados em stacking contexts transformados; o `position: fixed` podia calcular o painel fora da viewport.
- Change: `BeautyBookingQuiz` agora monta o diálogo em `document.body` via portal, mantendo o mesmo funil, foco, fechamento e fallback.
- Validation: reprodução Playwright confirmou bounding box negativo antes da correção; boundaries, diff e hooks de pre-commit passaram após a correção.

## 2026-08-28 — performance parametrizada (ciclo 2 iniciado)

- Criado `src/config/portfolio-performance.json` com budgets de LCP/CLS/INP, limites de bytes, formatos preferidos e política de adiamento de overlays/telemetria.
- Documentação atualizada para que novos clientes herdem os mesmos limites e exceções sejam explícitas por slug.
- Geradas 8 variantes WebP com Sharp; referências públicas atualizadas, com reduções de até 95% e originais preservados.
