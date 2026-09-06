# Skill registry — 0WEB

Status: `APPROVED_GLOBAL` · `APPROVED_CONDITIONAL` · `REFERENCE_ONLY` ·
`SECURITY_REVIEW_REQUIRED` · `REDUNDANT` · `QUARANTINED` · `REJECTED` ·
`UNAVAILABLE_UPSTREAM`

Legado (equivalências): `ACTIVE` = `APPROVED_GLOBAL`, `CONDITIONAL` =
`APPROVED_CONDITIONAL`, `REFERENCE` = `REFERENCE_ONLY`.

O catálogo é dinâmico: antes de tarefas substanciais, rode
`.agents/skills/0web-skill-discovery/SKILL.md` para buscar, ranquear e revisar
skills ainda não listadas aqui.

Última revisão: 2026-09-06.

## Locais (fonte de verdade)

| Name | Path | Status | Category | Triggers | Source | License | Security review |
|---|---|---|---|---|---|---|---|
| `0web-skill-router` | `.agents/skills/0web-skill-router` | APPROVED_GLOBAL | orquestração | qualquer tarefa não trivial | autoral 0WEB | interna | N/A |
| `0web-skill-discovery` | `.agents/skills/0web-skill-discovery` | APPROVED_GLOBAL | descoberta | tarefa substancial, nova skill | autoral 0WEB | interna | N/A |
| `0web-portfolio-art-direction` | `.agents/skills/0web-portfolio-art-direction` | APPROVED_GLOBAL | direção criativa/anti-template | nova landing, novo portfolio, redesign material | autoral 0WEB; destila práticas de frontend-design/landing design | interna | N/A |
| `0web-design-system` | `.agents/skills/0web-design-system` | APPROVED_GLOBAL | design-engineering | nova página, redesign, componente | autoral 0WEB | interna | N/A |
| `0web-ui-quality-gates` | `.agents/skills/0web-ui-quality-gates` | APPROVED_GLOBAL | QA/a11y/perf | antes de concluir UI | autoral 0WEB | interna | N/A |
| Apple HIG design review | `.design-rules/` | REFERENCE_ONLY | acessibilidade/interação | revisão de UI, mobile, modais, motion | Apple HIG (adaptado) | referência textual | sem scripts executáveis |

Nenhuma skill local executa scripts, rede ou lê segredos.

## Externas avaliadas

| Skill / repo | Status | Decisão |
|---|---|---|
| `anthropics/claude-plugins-official → frontend-design` | APPROVED_GLOBAL (princípios) | Fonte oficial e forte em direção visual distinta, tipografia e composição específica ao briefing. Usar como referência de decisão; não copiar uma estética pronta. |
| `vercel-labs/skills → find-skills` | APPROVED_GLOBAL (descoberta) | Mecanismo oficial para procurar skills; descoberta não significa instalação automática. |
| `vercel-labs/agent-skills` (`web-design-guidelines`, `react-best-practices`, `composition-patterns`) | APPROVED_CONDITIONAL | Bom complemento de engenharia/performance; preservar React 19 + TanStack + Tailwind v4 e revisar conflitos. |
| `2389-research/landing-page-design` | APPROVED_CONDITIONAL | Útil em CRO e checklist de distinção visual; usar a lógica de conversão sem transformar o portfolio em um template fixo. A própria referência prevê social proof intencional e não faked. |
| `amplitude/builder-skills → launch-landing-page` | APPROVED_CONDITIONAL | Boa para lançamentos/produtos; não é padrão para prestadores locais ou páginas institucionais. |
| `skills-101/superpowers → landing-page-design` | SECURITY_REVIEW_REQUIRED | Traz regras de CRO, mas depende de CLI externo/rede (`belt`/inference). Não instalar nem executar globalmente sem revisão; princípios isolados podem ser referência. |
| `GOODMAN-PRO/prism` | REFERENCE_ONLY | Forte em imersão, 3D e motion, porém assume GSAP/Three/R3F e se declara fonte única. Conflita com stack/budgets globais; usar somente ideias e apenas em projeto que justifique 3D pesado. |
| `educlopez/ui-craft` | REFERENCE_ONLY | Passes de tokens/craft/a11y/motion refletidos nas skills locais. |
| `dickwu/apple-design-skill` | REFERENCE_ONLY | Já coberto por `.design-rules/` local. |
| `DonkeyKing01/tasteful-ui-skill`, `sugarforever/open-design-skill` | APPROVED_CONDITIONAL | Exploração estética complementar; rejeitar quando apenas repetir o design system local. |
| `uxuiprinciples/agent-skills` | APPROVED_CONDITIONAL | Critérios de auditoria podem complementar quality gates. |
| `JacobLinCool/ux-discovery-interviewer-skill` | APPROVED_CONDITIONAL | Usar quando o problema de produto/usuário não estiver claro. |
| `sergekostenchuk/ui-ux-agent-skill-system` | APPROVED_CONDITIONAL | Amplo e orientado a MCP/adaptadores; sem dependências automáticas. |
| Figma (`Figma_AI_Bridge`, `agent-ready`, `Figma-Context-MCP-Skill`) | APPROVED_CONDITIONAL | Usar quando houver design/arquivo verificável e integração disponível. |
| `K-Dense-AI/scientific-agent-skills → skills/ui-ux-design` | UNAVAILABLE_UPSTREAM | Caminho não localizado; não instalar referência inexistente. |
| ZIPs recebidos (`seo-content-writer`, `landing-page-scaffold`, `whatsapp-integration`, `ad-creative`, `design-system-builder`, `kimi-find-skills`) | QUARANTINED | Não auditados linha a linha; não executar. |

## Regra de composição

O objetivo é **máximo de competências úteis**, não máximo de skills carregadas.
Para landing/portfolio, a composição preferida cobre: direção criativa + CRO +
UX/a11y + React/performance + motion + SEO + QA. Skills que repetem o mesmo
`hero + features + testimonials + FAQ` são redundantes e devem ser rejeitadas.

## Regra de instalação

Nenhuma nova dependência externa deve ser instalada só para satisfazer uma
skill. Instalação futura exige `SECURITY.md`, revisão de scripts/dependências,
fonte original e commit SHA. Princípios seguros podem ser incorporados às
skills autorais sem executar código de terceiros.
