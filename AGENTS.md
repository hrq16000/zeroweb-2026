# AGENTS.md — router do 0WEB

Este arquivo é um roteador. Antes de qualquer tarefa não trivial, abra
`.agents/skills/0web-skill-router/SKILL.md` e monte o skill stack.

| Preciso de | Leia |
|---|---|
| Roteamento de skills | `.agents/skills/0web-skill-router/SKILL.md` · `docs/skills/ORCHESTRATION.md` |
| Direção visual, tokens, componentes | `.agents/skills/0web-design-system/SKILL.md` · `docs/design/DESIGN_SYSTEM.md` |
| Checklist antes de concluir UI | `.agents/skills/0web-ui-quality-gates/SKILL.md` |
| Acessibilidade / responsivo / motion | `docs/design/ACCESSIBILITY.md` · `docs/design/RESPONSIVE.md` · `docs/design/MOTION.md` |
| Catálogo e segurança de skills | `docs/skills/REGISTRY.md` · `docs/skills/SECURITY.md` |
| Novo cliente em `/portfolio` | `docs/PORTFOLIO_NEW_CLIENT_PLAYBOOK.md` · `docs/PORTFOLIO_CLIENT_STANDARD.md` · `docs/PORTFOLIO_PRESENCE_KIT_STANDARD.md` |
| Conversão, SEO e leitura por IA em `/portfolio` | `docs/PORTFOLIO_CONVERSION_INTELLIGENCE_STANDARD.md` |
| Narrativa e originalidade de conversão em `/portfolio` | `docs/PORTFOLIO_CONVERSION_NARRATIVE_STANDARD.md` |
| Funis | `docs/PORTFOLIO_FUNNELS.md` |

Registre o uso de skills (tarefa, skills, achados, validação) no PR ou em
`docs/skills/CHANGELOG.md`.

# Regra oficial da zona de portfolios


Antes de criar ou alterar qualquer rota em `src/routes/portfolio.*`, leia
`docs/PORTFOLIO_CLIENT_STANDARD.md` e execute `npm run validate:portfolio-boundaries`.

## Skills obrigatórias

Toda implementação nova ou revisão visual em `/portfolio/` deve seguir
`docs/AGENT_SKILLS_GOVERNANCE.md`. No mínimo, aplique a direção do
`frontend-design`, a revisão de acessibilidade/mobile da Apple Design Skill e a
passada de `ui-craft` adequada (tokens, adapt, animate, polish ou audit). A
decisão e o resultado devem ser registrados no PR/commit ou na documentação do
projeto. Não publique uma nova página sem validar funil individual, SEO,
imagens reais, estados de carregamento/erro, `prefers-reduced-motion` e
viewports móveis.

## Princípio obrigatório

Cada `/portfolio/<slug>` é um site independente de um cliente. A 0WEB fornece
somente hospedagem, vitrine, infraestrutura e mecanismos compartilhados. Nunca
reutilize identidade, navegação, conteúdo, contato, SEO, CTA ou linguagem da
0WEB ou de outro cliente dentro desse site.

## Recursos compartilhados

- CTA/funil: compartilhar o mecanismo seguro e parametrizável; perguntas,
  destinatário, serviço, texto e visual pertencem ao cliente.
- Prova social: usar `PortfolioSocialProofPopup`; conteúdo e tema devem ser do
  cliente.
- Captação da 0WEB: manter `PortfolioUpsellPopup` como camada externa da
  hospedagem/vitrine. Ele não pertence à identidade do cliente, mas é obrigatório
  para transformar visitas aos portfolios em oportunidades para a 0WEB.
- Contato: nunca inserir `wa.me`, telefone ou e-mail operacional no bundle.
  Resolver o destinatário no servidor por `clientKey`.
- SEO: cada cliente precisa de título, descrição, canonical, imagem social e
  ícone próprios.
- Assets: cada cliente possui diretório próprio e não herda imagens de outro.

## Proibido

- `Header` ou `Footer` da 0WEB dentro da identidade visual de um cliente.
- Copiar design/layout de outro portfolio como padrão visual.
- Inferir `clientKey` pelo nome visível da empresa.
- Expor contato direto ou dados sensíveis no código público.
