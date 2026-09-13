# Skill registry — 0WEB

Status: `APPROVED_GLOBAL` · `APPROVED_CONDITIONAL` · `REFERENCE_ONLY` ·
`SECURITY_REVIEW_REQUIRED` · `REDUNDANT` · `QUARANTINED` · `REJECTED` ·
`UNAVAILABLE_UPSTREAM`

Legado (equivalências): `ACTIVE` = `APPROVED_GLOBAL`, `CONDITIONAL` =
`APPROVED_CONDITIONAL`, `REFERENCE` = `REFERENCE_ONLY`.

O catálogo é dinâmico: antes de tarefas substanciais, rode
`.agents/skills/0web-skill-discovery/SKILL.md` e consulte
`src/config/skill-marketplace-catalog.json` + `docs/SKILL_MARKETPLACE_DISCOVERY_STANDARD.md`.

Última revisão: 2026-09-13.

## Locais (fonte de verdade)

| Name | Path | Status | Category | Triggers | Source | License | Security review |
|---|---|---|---|---|---|---|---|
| `0web-skill-router` | `.agents/skills/0web-skill-router` | APPROVED_GLOBAL | orquestração | qualquer tarefa não trivial | autoral 0WEB | interna | N/A |
| `0web-skill-discovery` | `.agents/skills/0web-skill-discovery` | APPROVED_GLOBAL | descoberta | tarefa substancial, nova skill | autoral 0WEB | interna | N/A |
| `0web-experience-design-max` | `.agents/skills/0web-experience-design-max` | APPROVED_GLOBAL | experience design / UI UX / motion / layout | toda UI material, landing, portfolio, redesign | autoral 0WEB com princípios revisados de fontes externas | interna | sem scripts externos |
| `lobehub-skills-search-engine` | `.agents/skills/lobehub-skills-search-engine` | APPROVED_GLOBAL | discovery adapter | novo projeto, manutenção material, skill ausente | instrução fornecida pelo responsável, sanitizada para 0WEB | interna/adaptada | sem execução automática |
| `0web-portfolio-art-direction` | `.agents/skills/0web-portfolio-art-direction` | APPROVED_GLOBAL | direção criativa/anti-template | nova landing, novo portfolio, redesign material | autoral 0WEB; destila práticas de frontend-design/landing design | interna | N/A |
| `0web-design-system` | `.agents/skills/0web-design-system` | APPROVED_GLOBAL | design-engineering | nova página, redesign, componente | autoral 0WEB | interna | N/A |
| `0web-ui-quality-gates` | `.agents/skills/0web-ui-quality-gates` | APPROVED_GLOBAL | QA/a11y/perf | antes de concluir UI | autoral 0WEB | interna | N/A |
| Apple HIG design review | `.design-rules/` | REFERENCE_ONLY | acessibilidade/interação | revisão de UI, mobile, modais, motion | Apple HIG (adaptado) | referência textual | sem scripts executáveis |

Nenhuma skill local executa scripts externos, rede ou lê segredos.

## Externas avaliadas

| Skill / repo | Status | Decisão |
|---|---|---|
| `nextlevelbuilder/ui-ux-pro-max-skill@7f69fed6a2717900085f1bc3b263721f8ba025e2` | APPROVED_GLOBAL (princípios/design intelligence) | MIT. Forte em a11y, touch, performance, layout, tipografia, motion, forms e stack guidance. O repositório amplo contém scripts/subprocessos e integrações; princípios revisados foram internalizados, distribuição completa não roda automaticamente. |
| Dexa Experience Design | APPROVED_GLOBAL (processo/repertório) | Estratégia digital, UX/UI, websites, produto, design system, motion e Design Ops como disciplina integrada. Não copiar layout, marca ou assets. |
| LobeHub Skills Marketplace / `@lobehub/market-cli` | APPROVED_GLOBAL (discovery) | A instrução anexada pelo responsável foi revisada. Search/install são mecanismos de setup do agente. `skills search` é permitido em ambiente apropriado; `skills install` exige revisão prévia e nunca roda em build/runtime. |
| AwesomeSkill / `https://awesomeskill.ai/search` | APPROVED_GLOBAL (discovery) | Fonte obrigatória de triagem complementar para novo projeto e manutenção material. Resultado de marketplace não equivale a aprovação; resolver fonte original sempre que possível. |
| `anthropics/skills → frontend-design` | APPROVED_GLOBAL (princípios) | Direção visual distinta, tipografia e composição específica ao briefing; usar como referência de decisão, nunca como estética copiada. |
| `vercel-labs/skills → find-skills` | APPROVED_GLOBAL | Discovery oficial do ecossistema de agent skills. |
| `vercel-labs/agent-skills → web-design-guidelines` | APPROVED_GLOBAL | Fonte oficial Vercel para revisão de UI, acessibilidade, foco, forms, animation, typography, images, performance, navigation e touch. Pode complementar quality gates locais. |
| `vercel-labs/agent-skills → react-best-practices` | APPROVED_GLOBAL | Fonte oficial Vercel Engineering para waterfalls, bundle, SSR/client data, rerender e rendering performance. Aplicar somente o que é compatível com React 19 + TanStack Start do projeto. |
| `vercel-labs/agent-browser` | APPROVED_CONDITIONAL | Browser automation/QA/dogfood/screenshot/scraping. Usar quando o agente/ambiente suportar a CLI e quando acrescentar evidência sobre Playwright/browser QA já disponível. Não instalar no runtime do portal. |
| `planning-with-files` | APPROVED_CONDITIONAL | Útil em tarefas longas, pesquisa e refactors multi-etapa. Arquivos de planejamento são memória operacional auxiliar e nunca substituem `origin/main` como fonte de verdade. |
| `openakita/openakita → content-research-writer` | APPROVED_CONDITIONAL | Pesquisa, estrutura e profundidade editorial. Toda afirmação comercial/local continua evidence-first e precisa de fonte verificável. |
| `remotion-dev/skills → remotion-best-practices` | APPROVED_CONDITIONAL | Especialidade para vídeo criado em React/Remotion; não carregar em landing comum sem uso real de vídeo. |
| `leonardomso/33-js-concepts → seo-review` | REFERENCE_ONLY | A skill original é focada em páginas de conceitos JavaScript. Aproveitar heurísticas gerais de on-page SEO/snippets/internal linking somente quando compatíveis; gates SEO 0WEB continuam canônicos. |
| `anthropics/skills → canvas-design` | APPROVED_CONDITIONAL | Criativos estáticos/originais para social, capa, cartaz ou brand composition. Não usar como prova documental de cliente. |
| `anthropics/skills → skill-creator` | APPROVED_CONDITIONAL | Útil para criar/refinar skills internas. Scripts auxiliares precisam de revisão antes de execução. |
| `obra/superpowers → brainstorming` | REFERENCE_ONLY | Exploração de 2–3 abordagens é útil. A regra upstream de pedir aprovação antes de toda implementação conflita com a autorização contínua do projeto e não é adotada globalmente. |
| `anthropics/skills → theme-factory` | REFERENCE_ONLY | Ideação de temas pode inspirar. Presets prontos não podem virar skin compartilhada entre portfolios; anti-template prevalece. |
| `obra/superpowers → using-superpowers` | REDUNDANT | Redunda/conflita com `0web-skill-router` e `0web-skill-discovery`; não recebe autoridade global sobre o repositório. |
| `PleasePrompto/notebooklm-skill → notebooklm` | SECURITY_REVIEW_REQUIRED | AwesomeSkill sinaliza risco médio por acesso a `.env` e operações destrutivas no pacote. Exige autenticação Google/browser e não faz parte do fluxo padrão de portfolio. Usar somente após revisão específica e autorização. |
| `op7418/NanoBanana-PPT-Skills → nanobanana-ppt` | QUARANTINED | AwesomeSkill sinaliza risco crítico/0: `sudo`, persistência em `.zshrc/.bashrc`, acesso a `.env`/API keys e exposição de secrets. Além disso é uma skill de PPT, não de runtime web. Não instalar no 0WEB; somente reavaliar em tarefa de apresentação isolada. |
| `2389-research/landing-page-design` | APPROVED_CONDITIONAL | Útil em CRO e distinção visual; usar lógica de conversão sem template fixo e sem prova social fabricada. |
| `amplitude/builder-skills → launch-landing-page` | APPROVED_CONDITIONAL | Boa para lançamentos/produtos; não é padrão para prestadores locais ou páginas institucionais. |
| `skills-101/superpowers → landing-page-design` | SECURITY_REVIEW_REQUIRED | Regras de CRO úteis, mas depende de CLI externo/rede; princípios isolados podem ser referência. |
| `GOODMAN-PRO/prism` | REFERENCE_ONLY | Imersão/3D/motion; assume GSAP/Three/R3F. Usar ideias apenas em projeto que justifique 3D pesado. |
| `educlopez/ui-craft` | REFERENCE_ONLY | Passes de tokens/craft/a11y/motion refletidos nas skills locais. |
| `dickwu/apple-design-skill` | REFERENCE_ONLY | Já coberto por `.design-rules/` local. |
| `DonkeyKing01/tasteful-ui-skill`, `sugarforever/open-design-skill` | APPROVED_CONDITIONAL | Exploração estética complementar; rejeitar quando repetir design system local. |
| `uxuiprinciples/agent-skills` | APPROVED_CONDITIONAL | Critérios de auditoria complementares. |
| `JacobLinCool/ux-discovery-interviewer-skill` | APPROVED_CONDITIONAL | Usar quando problema de produto/usuário estiver realmente indefinido. |
| `sergekostenchuk/ui-ux-agent-skill-system` | APPROVED_CONDITIONAL | Amplo/orientado a MCP; sem dependências automáticas. |
| Figma (`Figma_AI_Bridge`, `agent-ready`, `Figma-Context-MCP-Skill`) | APPROVED_CONDITIONAL | Usar quando houver design/arquivo verificável e integração disponível. |
| `K-Dense-AI/scientific-agent-skills → skills/ui-ux-design` | UNAVAILABLE_UPSTREAM | Caminho não localizado; não instalar referência inexistente. |
| ZIPs recebidos (`seo-content-writer`, `landing-page-scaffold`, `whatsapp-integration`, `ad-creative`, `design-system-builder`, `kimi-find-skills`) | QUARANTINED | Não auditados linha a linha; não executar. |

## Regra de composição

O objetivo é **máximo de competências úteis**, não máximo de skills carregadas.
Para landing/portfolio, a composição preferida cobre: estratégia/experience design +
direção criativa + CRO + UX/a11y + layout engineering + React/performance + motion +
SEO/conteúdo + browser QA + privacidade/segurança + QA. Skills redundantes são rejeitadas.

## Regra de instalação

Nenhuma dependência externa deve ser instalada só para satisfazer uma skill.
Instalação exige `SECURITY.md`, revisão de scripts/dependências, fonte original e
commit/version quando disponível. Princípios seguros podem ser internalizados sem executar código de terceiros.

Marketplaces e CLIs de skills são ferramentas de preparação do agente, não dependências
de produção e não devem participar de `prebuild`, `build` ou runtime do portal.
