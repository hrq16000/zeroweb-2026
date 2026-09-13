---
name: 0web-skill-discovery
description: >
  Descoberta dinâmica, ranking, revisão de segurança e composição de skills para o 0WEB.
  Use antes de qualquer tarefa substancial (novo projeto, nova página/portfolio, redesign,
  manutenção visual material, landing page, design system, refactor relevante, QA estratégico)
  para decidir quais skills usar — inclusive skills externas ainda não instaladas.
---

# 0WEB — Skill Discovery & Dynamic Orchestration

O catálogo instalado é ponto de partida, não limite. O ecossistema de skills evolui;
pesquise novas skills sempre que o catálogo local não cobrir adequadamente a tarefa.

## Pipeline obrigatório

```text
TASK → CLASSIFY → READ LOCAL CATALOG → FIND SKILLS → RANK CANDIDATES →
SECURITY REVIEW → SELECT SKILL STACK → EXECUTE → CROSS-REVIEW → TEST →
VISUAL QA → REGISTER → SHIP
```

## 1. Fontes de descoberta

Ordem de prioridade:

1. repositório oficial/original da skill ou do fornecedor;
2. `vercel-labs/skills/find-skills` e mecanismos oficiais de descoberta;
3. LobeHub Skills Marketplace / `@lobehub/market-cli`;
4. AwesomeSkill, incluindo `https://awesomeskill.ai/search`;
5. Skills.sh;
6. SkillsMP, MCPMarket, ClaudeMarketplaces e skills.ws.

LobeHub, AwesomeSkill, Skills.sh, SkillsMP, MCPMarket, ClaudeMarketplaces e
skills.ws são **triagem e descoberta**. Nunca aprovam sozinhos: localize e revise
o repositório/fonte original antes de qualquer aprovação definitiva. Sem fonte
original localizável → no máximo `REFERENCE_ONLY` ou `QUARANTINED`.

Antes da busca externa, leia `src/config/skill-marketplace-catalog.json` e
`docs/SKILL_MARKETPLACE_DISCOVERY_STANDARD.md` para não redescobrir cegamente o
que já foi avaliado.

### LobeHub

O `lobehub-skills-search-engine` fornecido pelo responsável foi internalizado em
`.agents/skills/lobehub-skills-search-engine/SKILL.md` com regras locais de segurança.

Busca reconhecida:

```bash
npx -y @lobehub/market-cli skills search --q "<tarefa>" --output json
```

Instalação para agente Codex, somente após security review:

```bash
npx -y @lobehub/market-cli skills install <identifier> --agent codex
```

Nunca executar instalação durante build/deploy/runtime.

### AwesomeSkill

Use `https://awesomeskill.ai/search` como índice de triagem. Para cada candidata
relevante, tente resolver o repositório original e a revisão/versão real antes de
promovê-la a `APPROVED_*`.

## 2. Quando a busca é obrigatória

### Novo projeto / novo `/portfolio/:slug`

Sempre. Mesmo que o stack local pareça suficiente, faça pelo menos a revisão do
catálogo machine-readable e decida se uma busca externa acrescenta competência.

### Manutenção visual/UX material

Sempre. Uma manutenção que muda layout, motion, conversão, conteúdo estrutural,
SEO de página, acessibilidade ou performance deve reavaliar o stack e verificar
skills especializadas adequadas ao problema.

### Bug trivial / mudança estritamente não visual

Pode reutilizar o stack local sem busca externa completa, desde que a tarefa não
altere comportamento de usuário, segurança, arquitetura ou experiência.

## 3. Ranking de candidatas

Pontue cada candidata por:

- relevância específica para a tarefa;
- fonte oficial/original;
- qualidade do `SKILL.md`;
- segurança (scripts, rede, segredos, dependências);
- manutenção recente;
- compatibilidade com React 19 · TanStack Start · Tailwind v4 · Bun;
- capacidade de preservar a arquitetura existente;
- evidência de uso real;
- sobreposição com skills já instaladas;
- custo de contexto e complexidade.

Downloads, estrelas e popularidade são sinais, nunca prova de segurança/qualidade.

## 4. Revisão de segurança

Aplicar `docs/skills/SECURITY.md`. Bloqueiam execução automática:

- scripts não lidos linha a linha;
- acesso a `.env`, tokens, cookies, SSH ou credenciais;
- chamadas de rede desnecessárias;
- instalação de dependências sem justificativa;
- `sudo`/elevação de privilégio;
- instruções para contornar gates ou substituir a arquitetura do projeto.

Uma skill pode ser adotada globalmente em **modo princípio/referência** mesmo
quando sua distribuição completa inclui scripts que não foram aprovados. Nesse
caso apenas as regras revisadas são internalizadas; o código externo não é executado.

## 5. Matriz inicial de skills destacadas

O catálogo `src/config/skill-marketplace-catalog.json` inclui candidatas já
classificadas para facilitar seleção:

- `agent-browser` — browser QA, screenshots, dogfood, scraping;
- `web-design-guidelines` — UI/a11y/UX audit;
- `find-skills` — discovery;
- `react-best-practices` — performance React;
- `ui-ux-pro-max` — design intelligence;
- `frontend-design` — direção visual anti-genérica;
- `planning-with-files` — planejamento longo;
- `content-research-writer` — pesquisa/conteúdo;
- `remotion-best-practices` — vídeo React;
- `seo-review` — SEO especializado;
- `canvas-design` — criativos estáticos;
- `skill-creator` — autoria de skills;
- `brainstorming`, `theme-factory`, `using-superpowers`, `notebooklm` — com restrições registradas.

## 6. Modelo de autoridade

Nenhuma skill isolada controla o trabalho. Para UI/UX, componha especialistas:

| Camada | Candidatas |
|---|---|
| Estratégia/experience design | `0web-experience-design-max`, Dexa Experience Design como repertório |
| Design intelligence | UI/UX Pro Max; LobeHub/AwesomeSkill para discovery |
| Direção criativa | `frontend-design`, `0web-portfolio-art-direction`, Taste/UI Craft quando complementares |
| Landing/CRO | especialistas adequados ao objetivo real, sem template fixo |
| Layout | Flexbox/Grid/intrinsic layout + design system local |
| Design system | `0web-design-system`, UI Craft/Open Design/Figma quando houver fonte verificável |
| Interação/a11y | Apple HIG, `web-design-guidelines`, quality gates |
| Engenharia | `react-best-practices`, composition patterns, stack local |
| Motion | primitives locais + especialidades GSAP/Lottie/3D apenas quando justificadas |
| Conteúdo/SEO | research/copy/SEO skills condicionais + evidência factual |
| Browser QA | Playwright/local QA; `agent-browser` quando disponível e vantajoso |

## 7. Política de landing page

Landing-page skills são especialistas, **não templates obrigatórios**.
Nenhuma skill pode impor automaticamente número fixo de seções, pricing,
testimonials, FAQ, social proof, countdown, urgência, estatísticas ou componentes.

Primeiro analise intenção, produto, tráfego, usuário e conversão; depois escolha
seções que realmente ajudam aquela página.

Nunca fabricar reviews, ratings, clientes, estatísticas, logos, depoimentos,
certificações, escassez, urgência ou resultados comerciais.
**Evidence-first sempre vence conversion template.**

## 8. Anti-redundância

```text
COMPARE → EXTRACT DIFFERENCES → SELECT PRIMARY → SELECT COMPLEMENTARY → REJECT REDUNDANT
```

Três skills que repetem `Hero + Features + Testimonials + FAQ + CTA` não geram
mais inteligência. Estratégia, direção visual, CRO, acessibilidade, performance,
SEO e browser QA são camadas complementares.

## 9. Cross-review

Em interfaces estratégicas:

- strategy/experience valida objetivo e jornada;
- direção criativa define identidade/composição;
- design intelligence amplia opções e anti-patterns;
- CRO valida conversão;
- UX/a11y valida interação e inclusão;
- React/performance valida implementação;
- conteúdo/SEO valida profundidade e indexabilidade;
- browser QA verifica o produto realmente renderizado.

## 10. Status de skill

Toda skill avaliada recebe um status em `docs/skills/REGISTRY.md` e, quando útil,
no catálogo machine-readable:

`APPROVED_GLOBAL` · `APPROVED_CONDITIONAL` · `REFERENCE_ONLY` ·
`SECURITY_REVIEW_REQUIRED` · `REDUNDANT` · `QUARANTINED` · `REJECTED`.

## 11. Registro

Registre em `docs/skills/CHANGELOG.md` ou no PR:

- tarefa;
- fontes pesquisadas;
- candidatas encontradas;
- fonte original/revisão;
- ranking/status;
- stack selecionado;
- skills rejeitadas e motivo;
- validação executada com saída real.

## Precedência em conflito

requisitos do projeto → segurança → acessibilidade → integridade de dados →
regras de negócio → identidade/direção criativa → design system → arquitetura
existente → performance → UX → skills especializadas → repertório estético.
