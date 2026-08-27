# Governança de skills para o 0WEB

## Funil universal

O popup **“Quero meu site”** continua sendo o único funil universal da 0WEB dentro de `/portfolio`. Todos os projetos publicados devem usar funil individual, com intenção e `companySlug` próprios. A hospedagem na 0WEB não transforma o atendimento do cliente em atendimento comercial da 0WEB.

## Skills adotadas globalmente

As skills são referências de execução e revisão; não substituem conteúdo real, testes ou validação humana.

| Skill / referência | Uso no 0WEB |
|---|---|
| `frontend-design` (Anthropic) | Direção visual antes do código: propósito, estética, tipografia, composição e diferencial por cliente. |
| Apple Design Skill | Revisão de hierarquia, acessibilidade, touch targets, estados, movimento e consistência em experiências mobile-first. |
| `ui-craft` / adapt / animate / polish | Tokens, responsividade, motion intencional, microinterações e acabamento final. |
| Vercel React Best Practices | Revisão de performance e arquitetura React quando houver alteração relevante de componentes. |
| Snyk UI/UX skill references | Auditoria de acessibilidade, segurança de dependências e revisão de skills de terceiros antes de adoção. |
| Figma/MCP e DESIGN.md | Referência visual verificável quando houver arquivo de design aprovado. |

## Regra obrigatória para todos os projetos

Esta documentação é normativa para todos os projetos atuais e futuros do
portal e de `/portfolio/`. O `AGENTS.md` da raiz reforça a regra para qualquer
agente ou pessoa que altere o repositório. Exceções precisam ser justificadas
no próprio projeto e não podem remover os requisitos de segurança, acessibilidade
ou separação de funis.

## Processo obrigatório para novos projetos

1. Definir objetivo, público, identidade, conteúdo real e CTA do cliente.
2. Escolher uma direção visual específica; evitar layout genérico de IA.
3. Aplicar tokens, tipografia, responsividade mobile-first e estados de carregamento/erro.
4. Configurar o funil individual (`companySlug`, intenção e variável privada de destino).
5. Revisar acessibilidade, performance, SEO, imagens reais e comportamento em viewport móvel.
6. Executar validações do repositório antes de publicar.

## Skills recebidas em ZIP

Os arquivos `seo-content-writer.zip`, `landing-page-scaffold.zip`, `whatsapp-integration.zip`, `ad-creative.zip`, `design-system-builder.zip` e `kimi-find-skills.zip` foram tratados como referências externas. Não são executados automaticamente: qualquer instalação futura deve passar por inspeção de `SKILL.md`, scripts e dependências, pois skills de terceiros podem conter instruções ou código inseguro.

## Referências consultadas

- [PUNKMETRICS — Skills de design para Claude Code](https://punkmetrics.com/skills-de-design-para-claude-code/)
- [Snyk — Top Claude Skills for UI/UX Engineers](https://snyk.io/pt-BR/articles/top-claude-skills-ui-ux-engineers/)
- [Kimi — UI/UX design skills for agents](https://www.kimi.ai/pt-br/resources/ui-ux-design-skills-for-agents)
- [Anthropic — frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design)

As referências destacam direção visual intencional, sistemas de design, acessibilidade, performance e revisão de segurança. No 0WEB, essas práticas são aplicadas conforme compatibilidade com React/TanStack, sem copiar código ou instalar dependências sem auditoria.
