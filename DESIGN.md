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

Última revisão: 2026-08-27.
