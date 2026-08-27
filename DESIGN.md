# Direção de design do 0WEB

Este arquivo documenta a aplicação da skill `frontend-design` da Anthropic no portal e nas páginas derivadas de `/portfolio`.

## Regra de trabalho

Antes de criar uma página, definir: público, objetivo único, direção estética, paleta de 4–6 cores, pares tipográficos, estrutura e uma assinatura visual. A implementação deve preservar a identidade própria de cada cliente; não usar um template visual universal.

## Aplicação no `/portfolio`

- O catálogo usa busca, filtros por segmento e ordenação que favorece projetos mais recentes.
- Cada página de cliente tem direção visual própria, mas mantém padrões compartilhados de navegação, funil, popup, acessibilidade e SEO.
- O hero deve apresentar a proposta central do negócio, não apenas um slogan genérico.
- Componentes de processo usam numeração somente quando a ordem realmente representa uma etapa.
- Animações devem explicar estado, interação ou hierarquia; evitar efeitos decorativos em excesso.
- Toda interação precisa de foco visível, contraste adequado, suporte a teclado e alternativa para `prefers-reduced-motion`.
- Imagens de cliente devem ser reais e verificáveis. Não usar imagens geradas por IA quando o briefing exigir material autêntico.

## Referências complementares

As referências de `DESIGN.md`, Mobbin, Figma, shadcn, Motion.dev, GSAP e Transitions.dev foram avaliadas como camadas opcionais. Só devem ser adicionadas quando houver compatibilidade técnica e benefício claro para a experiência; não são dependências obrigatórias do portal.

## Registro de uso

- `frontend-design`: instalado de `anthropics/skills/skills/frontend-design` e adotado como critério de direção visual.
- `sites-building`: construção e revisão das páginas web existentes.
- `sites-hosting`: publicação somente após build verificável e configuração de hospedagem.
- `ui-craft`: instalado a partir de `educlopez/ui-craft`, com passes de descoberta, tokens, craft, critique, responsive, motion, polish, a11y e finalize disponíveis para as superfícies do portal.
- `apple-design`: referências Apple HIG registradas em `.design-rules/`; aplicada como auditoria multiplataforma de acessibilidade, contraste, foco, navegação, modais, responsividade e estados. APIs e padrões exclusivos de iOS não são impostos ao site.

## Auditoria de skills comunitárias (2026-08-27)

- `K-Dense-AI/scientific-agent-skills/skills/ui-ux-design`: não encontrado no repositório atual; não instalar uma referência inexistente.
- `ui-ux-agent-skill-system`: potencialmente amplo e orientado a adaptadores/MCP; manter como opção futura, sem adicionar dependências ao portal agora.
- `ui-craft`: compatível e instalado; é a principal camada operacional para UI/UX do portal React/Tailwind.
- `open-design-skill` e `tasteful-ui-skill`: referências úteis para direção visual, mas sobrepõem `frontend-design`/`ui-craft`; não foram instaladas para evitar regras concorrentes.
- `apple-design-skill`, `figma-ai-bridge`, `agent-ready` e `figma-context-mcp-skill`: específicos de Apple/Figma ou fluxo MCP; não são necessários para as páginas web atuais.
- `ux-discovery-interviewer` e `uxui-principles-agent-skills`: podem apoiar pesquisa/auditoria, mas não substituem a implementação visual e ficam fora do escopo automático do portal.

Última revisão: 2026-08-27.
