# Skill registry — 0WEB

Status: `APPROVED_GLOBAL` · `APPROVED_CONDITIONAL` · `REFERENCE_ONLY` ·
`SECURITY_REVIEW_REQUIRED` · `REDUNDANT` · `QUARANTINED` · `REJECTED` ·
`UNAVAILABLE_UPSTREAM`

Legado (equivalências): `ACTIVE` = `APPROVED_GLOBAL`, `CONDITIONAL` =
`APPROVED_CONDITIONAL`, `REFERENCE` = `REFERENCE_ONLY`.

O catálogo é dinâmico: antes de tarefas substanciais, rode
`.agents/skills/0web-skill-discovery/SKILL.md` para buscar, ranquear e revisar
skills ainda não listadas aqui.

Última revisão: 2026-09-12.

## Locais (fonte de verdade)

| Name | Path | Status | Category | Triggers | Source | License | Security review |
|---|---|---|---|---|---|---|---|
| `0web-skill-router` | `.agents/skills/0web-skill-router` | APPROVED_GLOBAL | orquestração | qualquer tarefa não trivial | autoral 0WEB | interna | N/A |
| `0web-skill-discovery` | `.agents/skills/0web-skill-discovery` | APPROVED_GLOBAL | descoberta | tarefa substancial, nova skill | autoral 0WEB | interna | N/A |
| `0web-landing-experience` | `.agents/skills/0web-landing-experience` | APPROVED_GLOBAL | landing/motion/evidência visual | toda landing, home comercial, redesign material | autoral 0WEB; síntese de fontes revisadas | interna | N/A |
| `0web-portfolio-art-direction` | `.agents/skills/0web-portfolio-art-direction` | APPROVED_GLOBAL | direção criativa/anti-template | nova landing, novo portfolio, redesign material | autoral 0WEB; destila práticas de frontend-design/landing design | interna | N/A |
| `0web-design-system` | `.agents/skills/0web-design-system` | APPROVED_GLOBAL | design-engineering | nova página, redesign, componente | autoral 0WEB | interna | N/A |
| `0web-ui-quality-gates` | `.agents/skills/0web-ui-quality-gates` | APPROVED_GLOBAL | QA/a11y/perf | antes de concluir UI | autoral 0WEB | interna | N/A |
| Apple HIG design review | `.design-rules/` | REFERENCE_ONLY | acessibilidade/interação | revisão de UI, mobile, modais, motion | Apple HIG (adaptado) | referência textual | sem scripts executáveis |

Nenhuma skill local executa scripts, rede ou lê segredos.

## Externas avaliadas

| Skill / repo | Status | Decisão |
|---|---|---|
| `anthropics/skills → frontend-design` | APPROVED_GLOBAL (princípios) | Fonte oficial e forte em direção visual distinta, tipografia, cor, composição, motion e rejeição de estética genérica. Usar como referência de decisão; não copiar uma estética pronta. |
| `vercel-labs/skills → find-skills` | APPROVED_GLOBAL (descoberta) | Mecanismo oficial para procurar skills; descoberta não significa instalação automática. |
| `vercel-labs/agent-skills` (`web-design-guidelines`, `react-best-practices`, `composition-patterns`) | APPROVED_CONDITIONAL | Bom complemento de engenharia/performance; preservar React 19 + TanStack + Tailwind v4 e revisar conflitos. |
| `2389-research/landing-page-design` | APPROVED_CONDITIONAL | Útil em CRO e checklist de distinção visual; usar a lógica de conversão sem transformar o portfolio em um template fixo. A própria referência prevê social proof intencional e não faked. |
| `amplitude/builder-skills → launch-landing-page` | APPROVED_CONDITIONAL | Boa para lançamentos/produtos; não é padrão para prestadores locais ou páginas institucionais. |
| `jezweb/claude-skills → plugins/frontend/skills/landing-page` | REFERENCE_ONLY | Bom para checklist de brief, responsividade, semântica e metadata; implementação single-file/Tailwind CDN e estrutura padrão não são compatíveis com a arquitetura 0WEB. Extrair princípios, nunca importar o template. |
| `bear2u/my-skills → landing-page-guide-v2` | APPROVED_CONDITIONAL | Forte em direção estética, tipografia dramática, motion, sticky header, mídia com profundidade e anti-AI-slop. O framework de 11 elementos não é obrigatório e conflito com evidence-first deve ser resolvido a favor da 0WEB. |
| `skills-101/superpowers → landing-page-design` | SECURITY_REVIEW_REQUIRED | Traz regras de CRO, mas depende de CLI externo/rede (`belt`/inference). Não instalar nem executar globalmente sem revisão; princípios isolados podem ser referência. |
| `GOODMAN-PRO/prism` | REFERENCE_ONLY | Forte em imersão, 3D e motion, porém assume GSAP/Three/R3F e se declara fonte única. Conflita com stack/budgets globais; usar somente ideias e apenas em projeto que justifique 3D pesado. |
| `educlopez/ui-craft` | REFERENCE_ONLY | Bom sistema de craft/polish com lentes específicas e skill de motion. Seus princípios de decisão, anti-slop, motion intencional e review visual estão refletidos nas skills locais; não importar CLI automaticamente. |
| `dickwu/apple-design-skill` | REFERENCE_ONLY | Já coberto por `.design-rules/` local. Apple HIG é review de qualidade, não skin visual. |
| `DonkeyKing01/tasteful-ui-skill`, `sugarforever/open-design-skill` | APPROVED_CONDITIONAL | Exploração estética complementar; rejeitar quando apenas repetir o design system local. |
| `uxuiprinciples/agent-skills` | APPROVED_CONDITIONAL | Critérios de auditoria podem complementar quality gates. |
| `JacobLinCool/ux-discovery-interviewer-skill` | APPROVED_CONDITIONAL | Usar quando o problema de produto/usuário não estiver claro. |
| `sergekostenchuk/ui-ux-agent-skill-system` | APPROVED_CONDITIONAL | Sistema vendor-neutral com orquestrador, especialistas, adapters e gates; útil como referência de decomposição/cross-review. Não importar runtime/adapters sem necessidade e revisão. |
| Figma (`Figma_AI_Bridge`, `agent-ready`, `Figma-Context-MCP-Skill`) | APPROVED_CONDITIONAL | Usar quando houver design/arquivo verificável e integração disponível. |
| `K-Dense-AI/scientific-agent-skills → skills/ui-ux-design` | UNAVAILABLE_UPSTREAM | Caminho solicitado novamente verificado em 2026-09-12 e não está presente no diretório upstream; não fingir instalação. |
| ZIPs recebidos (`seo-content-writer`, `landing-page-scaffold`, `whatsapp-integration`, `ad-creative`, `design-system-builder`, `kimi-find-skills`) | QUARANTINED | Não auditados linha a linha; não executar. |

## Fontes editoriais / descoberta — não são skills instaladas

Estas fontes podem ampliar repertório e descoberta, mas não substituem o SKILL.md original nem revisão de segurança:

- Skills.sh / `vercel-labs/skills/find-skills`;
- artigos de UI/UX skills do Kimi;
- listas/editoriais como PunkMetrics, Snyk, SkillsMP, MCPMarket, skills.ws, ClaudeMarketplaces e TasteSkill;
- posts/artigos de curadoria como ponto de descoberta.

Regra: localizar sempre o repositório/fonte original antes de aprovar uma skill.

## Regra de composição

O objetivo é **máximo de competências úteis**, não máximo de skills carregadas.
Para landing/portfolio, a composição preferida cobre:

```text
creative direction
+ frontend craft
+ landing/CRO
+ motion
+ UX/HIG
+ accessibility
+ performance
+ visual/browser QA
```

Skills que repetem o mesmo `hero + features + testimonials + FAQ` são redundantes e devem ser rejeitadas.

Para landing/home comercial, `0web-landing-experience` torna obrigatória a avaliação da motion matrix global,
mídia real quando disponível e evidência runtime `BEFORE → DURING → AFTER` para signature moments.

## Regra de instalação

Nenhuma nova dependência externa deve ser instalada só para satisfazer uma
skill. Instalação futura exige `SECURITY.md`, revisão de scripts/dependências,
fonte original e commit SHA. Princípios seguros podem ser incorporados às
skills autorais sem executar código de terceiros.
