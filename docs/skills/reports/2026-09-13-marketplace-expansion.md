# 2026-09-13 — expansão de skills, marketplaces e layout engineering

## Escopo

Pedido do responsável: ampliar globalmente a inteligência aplicada a novos projetos, `/portfolio/:slug` e manutenções materiais; incorporar LobeHub/AwesomeSkill como discovery; tornar skills destacadas utilizáveis conforme relevância; e registrar Flexbox como fundamento explícito de layout responsivo.

## Fontes inspecionadas

- SKILL.md do `lobehub-skills-search-engine` fornecido pelo responsável;
- `nextlevelbuilder/ui-ux-pro-max-skill` já pinado no registry;
- repositórios/fonte oficial da Vercel para `find-skills`, `agent-browser`, `web-design-guidelines` e `react-best-practices`;
- AwesomeSkill como índice de candidatas;
- fontes originais localizadas para `brainstorming`/Superpowers e exemplos de `planning-with-files`.

## Mudanças

- criado `docs/SKILL_MARKETPLACE_DISCOVERY_STANDARD.md`;
- criado `src/config/skill-marketplace-catalog.json`;
- criado adapter local `.agents/skills/lobehub-skills-search-engine/SKILL.md`;
- criado `docs/LAYOUT_ENGINEERING_STANDARD.md`;
- `0web-skill-discovery`, `0web-experience-design-max`, `0web-skill-router` e `AGENTS.md` passaram a exigir reavaliação de skills em novos projetos e manutenção material;
- Flexbox/Grid/intrinsic sizing/responsive flow entraram como matriz machine-readable;
- gate `check:experience-skill-policy` passou a validar marketplace catalog, LobeHub adapter, Flexbox/layout matrix e as 17 candidatas destacadas;
- registry expandido com status e restrições por skill.

## Decisões de segurança

- marketplace é discovery, não autoridade;
- nenhum installer externo entra no build/runtime;
- skill com scripts/rede/segredos exige inspeção antes de execução;
- `using-superpowers` ficou `REDUNDANT` porque compete com o router canônico;
- `brainstorming` ficou `REFERENCE_ONLY`: explorar alternativas é útil, mas a exigência de aprovação humana antes de toda implementação conflita com a autorização contínua do responsável;
- `theme-factory` ficou `REFERENCE_ONLY` para não transformar portfolios em skins/presets;
- `agent-browser`, `planning-with-files`, content/SEO/video/canvas skills ficaram condicionais ao contexto.

## Flexbox

Adotado como primitive canônica para problemas unidimensionais. O padrão registra main axis, cross axis, `flex-direction`, `justify-content`, `align-items`, `flex-wrap`, `gap`, grow/shrink/basis, `min-width:0`, sizing intrínseco e preservação da ordem semântica. Grid continua preferido para macrocomposição bidimensional.

## Regra final

Novo projeto e manutenção material devem **explorar o máximo de competências, selecionar o máximo relevante e não redundante, e executar somente o que passar em segurança, compatibilidade, acessibilidade, performance, factualidade e identidade do cliente**.
