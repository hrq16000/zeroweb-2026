# AGENTS.md — router do 0WEB

Este arquivo é um roteador. Antes de qualquer tarefa não trivial, abra
`.agents/skills/0web-skill-router/SKILL.md` e monte o skill stack.

| Preciso de | Leia |
|---|---|
| Roteamento de skills | `.agents/skills/0web-skill-router/SKILL.md` · `docs/skills/ORCHESTRATION.md` |
| Direção criativa anti-template | `.agents/skills/0web-portfolio-art-direction/SKILL.md` · `docs/PORTFOLIO_CREATIVE_DIRECTION_STANDARD.md` |
| Repertório de componentes, layout, motion, integrações e QA | `docs/PORTFOLIO_CAPABILITY_PALETTE.md` |
| Direção visual, tokens, componentes | `.agents/skills/0web-design-system/SKILL.md` · `docs/design/DESIGN_SYSTEM.md` |
| Checklist antes de concluir UI | `.agents/skills/0web-ui-quality-gates/SKILL.md` |
| Acessibilidade / responsivo / motion | `docs/design/ACCESSIBILITY.md` · `docs/design/RESPONSIVE.md` · `docs/design/MOTION.md` |
| Catálogo e segurança de skills | `docs/skills/REGISTRY.md` · `docs/skills/SECURITY.md` |
| Novo cliente em `/portfolio` | `docs/PORTFOLIO_NEW_CLIENT_PLAYBOOK.md` · `docs/PORTFOLIO_CLIENT_STANDARD.md` · `docs/PORTFOLIO_PRESENCE_KIT_STANDARD.md` |
| Conversão, SEO e leitura por IA em `/portfolio` | `docs/PORTFOLIO_CONVERSION_INTELLIGENCE_STANDARD.md` |
| Narrativa e originalidade de conversão em `/portfolio` | `docs/PORTFOLIO_CONVERSION_NARRATIVE_STANDARD.md` |
| Funis | `docs/PORTFOLIO_FUNNELS.md` |
| Baseline congelado, política de regressão e manutenção do `/portfolio` | `docs/reports/PORTFOLIO-EXPERIENCE-FINAL-2026-09-05.md` §11 MAINTENANCE MODE |
| Stack técnica, motion, performance e briefing de novos projetos | `docs/PORTFOLIO_TECH_STACK_PARAMETRIZATION.md` |
| Contrato obrigatório de execução, SEO/LLM e publicação Git | `docs/0WEB_EXECUTION_CONTRACT.md` · `docs/BRAND_ASSET_POLICY.md` |

Registre o uso de skills (tarefa, skills, achados, validação) no PR ou em
`docs/skills/CHANGELOG.md`.

Para toda tarefa, leia também `docs/0WEB_EXECUTION_CONTRACT.md`. Toda alteração
concluída deve ser publicada no repositório oficial e integrada em `main` por PR;
não deixar trabalho pendente em cópias locais ou hospedagens externas.

# Regra oficial da zona de portfolios

Antes de criar ou alterar qualquer rota em `src/routes/portfolio.*`, leia
`docs/PORTFOLIO_CLIENT_STANDARD.md`, `docs/PORTFOLIO_CREATIVE_DIRECTION_STANDARD.md`,
`docs/PORTFOLIO_CAPABILITY_PALETTE.md` e execute `bun run validate:portfolio-boundaries`.

## Skills obrigatórias

Toda implementação nova ou revisão visual material em `/portfolio/` deve seguir
`docs/AGENT_SKILLS_GOVERNANCE.md`. No mínimo:

1. executar `0web-skill-discovery` para selecionar competências complementares;
2. aplicar `0web-portfolio-art-direction` antes de escolher layout/seções;
3. selecionar do `PORTFOLIO_CAPABILITY_PALETTE` somente capacidades que resolvam
   problemas reais da marca/jornada — o arquivo é repertório, nunca template;
4. usar uma especialidade de landing/CRO adequada ao objetivo real, sem herdar
   estrutura fixa;
5. aplicar `0web-design-system` como engenharia visual com identidade local do cliente;
6. revisar acessibilidade/mobile, motion, performance e quality gates.

Não publique uma nova página sem creative brief v2, funil individual, SEO,
imagens classificadas corretamente, estados, `prefers-reduced-motion`, viewport
móvel, originality review e contato server-side quando houver número oficial.

## Princípio obrigatório

Cada `/portfolio/<slug>` é um site independente de um cliente. A 0WEB fornece
somente hospedagem, vitrine, infraestrutura e mecanismos compartilhados.

**Padronizar a engenharia, nunca a criatividade.**

Nunca reutilize identidade, navegação, composição visual, conteúdo, contato,
SEO, CTA ou linguagem de outro cliente como padrão. Reutilizar primitives de
engenharia é permitido; reutilizar o mesmo hero/section-order/motion e apenas
recolorir não é.

## Recursos compartilhados

- CTA/funil: compartilhar mecanismo seguro; perguntas, destinatário, serviço,
  texto e visual pertencem ao cliente.
- Prova social: conteúdo deve ser verificável. Em demo/protótipo, conteúdo
  ilustrativo precisa estar claramente rotulado como exemplo/demonstração.
- Captação 0WEB: `PortfolioUpsellPopup` é camada externa obrigatória da plataforma.
- Contato: nunca inserir `wa.me`, telefone ou e-mail operacional no bundle.
  Resolver por `clientKey`; novos clientes usam secret
  `PORTFOLIO_WHATSAPP_<CLIENT_KEY_NORMALIZADO>`.
- SEO: título, descrição, canonical, social image e ícone próprios.
- Assets: diretório próprio; mídia gerada pode apoiar a marca, mas não fingir
  equipe, sede, cliente, obra executada ou resultado real.
- Tipografia/paleta: podem e devem ser escopadas ao cliente quando a identidade
  pedir; Space Grotesk/Inter e tokens 0WEB não são skin obrigatória do portfolio.

## Proibido

- `Header` ou `Footer` da 0WEB dentro da identidade visual de um cliente.
- Copiar design/layout de outro portfolio como padrão visual.
- Publicar um scaffold v2 com `CREATIVE_BRIEF_REQUIRED`.
- Usar apenas default de motion por segmento em novo portfolio v2 publicado.
- Inferir `clientKey` pelo nome visível da empresa.
- Expor contato direto ou dados sensíveis no código público.
- Apresentar avaliações, depoimentos, ratings, prêmios, números ou resultados
  fabricados como se fossem reais.

---

# Norma global de experiência (resumo)

Completo: `docs/GLOBAL_WEB_EXPERIENCE_STANDARD.md` ·
`docs/PORTFOLIO_IMMERSIVE_EXPERIENCE_STANDARD.md` ·
máquina: `src/config/experience-capabilities.json` e
`src/config/portfolio-motion-profiles.json`.

- Toda página cumpre engineering, brand, motion, interaction, content,
  conversion, SEO, accessibility, performance, originality e privacy.
- Motion usa primitives de `src/components/motion` / `motion/react` conforme o
  padrão local; conteúdo sempre existe sem JS.
- `prefers-reduced-motion` remove deslocamento, nunca conteúdo.
- Intensidade: `SUBTLE | BALANCED | EXPRESSIVE | IMMERSIVE`. Motion budget usual:
  máx. 3 signature moments, 1 parallax, 1 stagger por viewport, 1 loop.
- Novo portfolio v2 declara override próprio de motion e creative brief; defaults
  por segmento ficam como fallback legado.
- Hierarquia técnica: CSS → API nativa → motion system → lib leve → lib pesada
  só com justificativa. Skill não justifica dependência.
- Capas: `PHOTO_DERIVED | BRAND_COMPOSITION | ABSTRACT_BRAND_ART`; nunca inventar
  evidência factual.
- Gate: `bun run check:experience-standard` e `:enforce`.
- Rollout em ondas. Não redesenhar projetos autorais aprovados sem gatilho real.
- Projeto novo só nasce válido com direção criativa, identidade, motion, funil,
  SEO, imagens e assinatura próprias, além dos gates técnicos.
