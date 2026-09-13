# Governança de skills para o 0WEB

## Funil universal

O popup **“Quero meu site”** continua sendo o único funil universal da 0WEB dentro de `/portfolio`. Todos os projetos publicados devem usar funil individual, com intenção e `companySlug` próprios. A hospedagem na 0WEB não transforma o atendimento do cliente em atendimento comercial da 0WEB.

## Política global: máximo de competências relevantes

Toda tarefa substancial deve usar o maior conjunto **relevante e não redundante** de competências necessário para cobrir estratégia, UI/UX, direção criativa, layout engineering, design system, motion, acessibilidade, performance, SEO/conteúdo, segurança/privacidade, conversão, browser QA e quality assurance.

“Máximo de skills” não significa executar indiscriminadamente todos os pacotes encontrados. Skills redundantes, incompatíveis com a stack, inseguras, que exigem dependências desnecessárias ou que empurram templates visuais fixos devem ser rejeitadas e registradas.

Para toda implementação ou revisão visual material, `.agents/skills/0web-experience-design-max/SKILL.md` é obrigatória junto do roteamento normal. Todo novo projeto e toda manutenção visual/UX material também reavaliam o skill stack por `docs/SKILL_MARKETPLACE_DISCOVERY_STANDARD.md`.

## Skills e referências adotadas globalmente

As skills são referências de execução e revisão; não substituem conteúdo real, testes ou validação humana.

| Skill / referência | Uso no 0WEB |
|---|---|
| `0web-experience-design-max` | Orquestra estratégia digital, UX/UI, layout, design system, web engineering, conteúdo/SEO, motion e QA como camada obrigatória. |
| `0web-skill-discovery` + `lobehub-skills-search-engine` | Descoberta contínua, ranking, security review e seleção do stack. |
| `frontend-design` (Anthropic) | Direção visual antes do código: propósito, estética, tipografia, composição e diferencial por cliente. |
| UI/UX Pro Max (`nextlevelbuilder/ui-ux-pro-max-skill`) | Design intelligence para estilos, paletas, tipografia, landing patterns, UX, acessibilidade, motion e stack. Recomendação, nunca template. |
| Dexa Experience Design | Repertório de processo: estratégia, UX/UI, websites, produto, design systems, motion design e Design Ops integrados ao negócio. |
| `web-design-guidelines` (Vercel) | Revisão de UI, acessibilidade, foco, forms, animation, typography, images, performance, navigation e touch. |
| `react-best-practices` (Vercel) | Performance/arquitetura React: waterfalls, bundle, rendering, data fetching e rerenders. |
| `agent-browser` (Vercel) | Browser QA, screenshots, dogfood e scraping quando o ambiente suportar e houver ganho real. |
| `planning-with-files` | Planejamento persistente para tarefas longas; nunca substitui `origin/main` como fonte de verdade. |
| `content-research-writer` / `seo-review` | Pesquisa, profundidade editorial e SEO quando aplicáveis, sempre evidence-first. |
| `remotion-best-practices` | Especialidade de vídeo React quando o projeto realmente usar vídeo/Remotion. |
| `canvas-design` | Criativos estáticos originais para capa/social/cartaz, sem fingir prova documental. |
| `skill-creator` | Criar/refinar skills internas quando uma rotina repetida merece contrato próprio. |
| LobeHub Skills Marketplace | Discovery complementar; candidata precisa passar por revisão de segurança. |
| AwesomeSkill / `https://awesomeskill.ai/search` | Discovery/comparação de skills; resultado de marketplace não substitui fonte original. |
| Apple Design Skill | Revisão de hierarquia, acessibilidade, touch targets, estados, movimento e consistência mobile-first. |
| `ui-craft` / adapt / animate / polish | Tokens, responsividade, motion intencional, microinterações e acabamento final. |
| Figma/MCP e DESIGN.md | Referência visual verificável quando houver arquivo de design aprovado. |

Skills como `brainstorming`, `theme-factory`, `using-superpowers` e `notebooklm` têm restrições específicas registradas em `docs/skills/REGISTRY.md` e `src/config/skill-marketplace-catalog.json`.

## Layout engineering — Flexbox e Grid

`docs/LAYOUT_ENGINEERING_STANDARD.md` é normativo para nova interface e manutenção material de layout.

- **Flexbox**: problemas unidimensionais de alinhamento/distribuição/wrap; main axis e cross axis precisam estar corretos.
- **Grid**: macrocomposição bidimensional.
- **Intrinsic sizing**: `min-width:0`, `minmax`, `clamp`, `max-width`, `aspect-ratio` e limites de conteúdo antes de larguras fixas arbitrárias.
- `flex-wrap`, `gap`, DOM/focus order e comportamento 390/768/1440 devem ser avaliados.
- Primitive compartilhada não autoriza composição visual compartilhada.

## Matriz global de motion

Toda landing/home comercial e todo `/portfolio/:slug` com mudança visual relevante deve avaliar e classificar como `REQUIRED`, `OPTIONAL` ou `NOT_APPLICABLE`:

`fade-up` · `fade-left/right` · `blur-in` · `scale-in` · `stagger-up` · `image-reveal` · `clip-reveal` · `parallax` · `marquee` · `float` · `header-scroll` · `menu-reveal` · `text-line-reveal` · `progress-line`.

Além disso, avaliar microinterações, preloader/skeleton, form feedback, accordion transition, 3D/Lottie/SVG/video quando houver benefício real. A referência normativa completa é `docs/EXPERIENCE_DESIGN_MAX_STANDARD.md`.

## Regra obrigatória para todos os projetos

Esta documentação é normativa para todos os projetos atuais e futuros do portal e de `/portfolio/`. O `AGENTS.md` da raiz reforça a regra para qualquer agente ou pessoa que altere o repositório. Exceções precisam ser justificadas no próprio projeto e não podem remover requisitos de segurança, acessibilidade, identidade, privacidade, factualidade ou separação de funis.

## Processo obrigatório para novos projetos

1. Definir objetivo, público, identidade, conteúdo real e CTA do cliente.
2. Executar discovery local + fontes originais + LobeHub/AwesomeSkill quando aplicável e selecionar stack complementar.
3. Aplicar `0web-experience-design-max`.
4. Escolher direção visual específica; evitar layout genérico de IA.
5. Definir Flexbox/Grid/intrinsic strategy e comportamento responsivo.
6. Aplicar tokens, tipografia e estados de loading/error.
7. Definir motion grammar própria, avaliar a matriz global e documentar reduced motion/mobile.
8. Configurar o funil individual (`companySlug`, intenção e variável privada de destino).
9. Revisar acessibilidade, performance, SEO, imagens reais e comportamento em viewport móvel.
10. Executar validações do repositório antes de publicar.

## Processo obrigatório para manutenção material

Mudança material de layout, motion, UX, conversão, SEO estrutural ou conteúdo principal reexecuta discovery, seleciona/rejeita skills de forma explícita, preserva decisões aprovadas e fecha com browser/runtime QA. Não reaplicar automaticamente o mesmo stack só porque foi usado na página anterior.

## Marketplaces e instalação

LobeHub, AwesomeSkill, Skills.sh, SkillsMP e similares são **fontes de descoberta**. A instalação de uma skill não significa aprovação automática.

A CLI do LobeHub pode ser usada em ambiente de agente, após revisão:

```bash
npx -y @lobehub/market-cli skills search --q "<tarefa>" --output json
npx -y @lobehub/market-cli skills install <skill-identifier> --agent codex
```

Nunca executar marketplace installer durante build/deploy da aplicação. Nunca permitir que uma skill leia segredos, modifique o sistema operacional, introduza `sudo`, instale dependências globais ou envie dados privados sem revisão e necessidade explícitas.

## Skills recebidas em ZIP

Os arquivos `seo-content-writer.zip`, `landing-page-scaffold.zip`, `whatsapp-integration.zip`, `ad-creative.zip`, `design-system-builder.zip` e `kimi-find-skills.zip` foram tratados como referências externas. Não são executados automaticamente: qualquer instalação futura deve passar por inspeção de `SKILL.md`, scripts e dependências.

## Referências consultadas

- [Dexa — Experience Design](https://www.dexa.ag/pt-br/servicos/experience-design)
- [UI/UX Pro Max](https://uupm.cc)
- [UI/UX Pro Max — repositório original](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- [AwesomeSkill Search](https://awesomeskill.ai/search)
- [LobeHub Skills](https://lobehub.com/pt-BR/skills)
- [Anthropic — frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design)
- [Vercel — agent-skills](https://github.com/vercel-labs/agent-skills)
- [Vercel — agent-browser](https://github.com/vercel-labs/agent-browser)

No 0WEB, essas práticas são aplicadas conforme compatibilidade com React/TanStack, identidade específica de cada cliente e limites do repositório, sem copiar código, layout, marca ou conteúdo de terceiros.
