# Orquestração de skills

## Fluxo obrigatório

```text
classificar tarefa
   -> descobrir skills relevantes (.agents/skills, .design-rules, docs/ + upstream)
   -> definir direção criativa quando houver UI comercial
   -> aplicar 0web-landing-experience em landing/home comercial
   -> selecionar capacidades da PORTFOLIO_CAPABILITY_PALETTE quando aplicável
   -> montar skill stack complementar
   -> implementar
   -> quality gates + evidência visual/runtime
   -> crítica cruzada e refino
   -> registrar uso
```

## Roteamento

| Entrada | Stack |
|---|---|
| Landing page / nova página comercial | `0web-skill-router` → `0web-skill-discovery` → `0web-portfolio-art-direction` → `0web-landing-experience` → 1 especialista landing/CRO → `0web-design-system` → Apple HIG/UX review → `0web-ui-quality-gates` → QA no navegador |
| Site de cliente em `/portfolio/<slug>` | `PORTFOLIO_NEW_CLIENT_PLAYBOOK` → `0web-skill-discovery` → `0web-portfolio-art-direction` → `0web-landing-experience` → `PORTFOLIO_CAPABILITY_PALETTE` → 1 especialista landing/CRO → `0web-design-system` (identidade escopada do cliente) → motion/a11y/perf conforme necessidade → `0web-ui-quality-gates` → originality/funnel/browser QA |
| Dashboard / painel admin | `0web-design-system` (densidade, tabelas, estados) → `0web-ui-quality-gates` |
| Formulário / etapa de funil | `0web-ui-quality-gates` (labels, erros, alvos de toque) → `docs/PORTFOLIO_FUNNELS.md` |
| Redesign material | `0web-portfolio-art-direction` → `0web-landing-experience` → `PORTFOLIO_CAPABILITY_PALETTE` quando aplicável → `0web-design-system` → revisão Apple HIG (`.design-rules`) → `0web-ui-quality-gates` |
| Refactor React | regras de composição em `0web-design-system` → `bun test` + typecheck |
| Motion | `docs/design/MOTION.md` → `docs/LANDING_PAGE_MOTION_EVIDENCE_STANDARD.md` para landing/home → palette de motion → gramática de motion do cliente → checagem `prefers-reduced-motion` |
| Acessibilidade | `.design-rules/SKILL.md` + `references/hig/accessibility.md` |
| SEO / conteúdo | regras de `head()` no `AGENTS.md` + validadores `seo:*` |

## Máximo de competências, mínimo de redundância

Uma boa stack cobre competências diferentes: direção criativa, conversão,
UX/a11y, engenharia React, motion, SEO, performance e QA. Não empilhe três
skills que prescrevem a mesma estrutura de landing page.

Quando uma skill externa exigir framework, CLI, rede, segredo ou dependência
incompatível, extraia apenas princípios seguros ou marque-a como condicional.

## Landing experience: padrão global

`.agents/skills/0web-landing-experience/SKILL.md` e
`docs/LANDING_PAGE_MOTION_EVIDENCE_STANDARD.md` são obrigatórios para toda landing/home comercial.

A página deve:

- avaliar a motion matrix global e aplicar o máximo pertinente;
- evitar `fade-up` uniforme como única gramática;
- usar mídia real quando disponível;
- tratar motion como fail-open;
- provar visualmente áreas críticas, inclusive cases/projetos com imagens visíveis;
- medir `BEFORE → DURING → AFTER` em signature moments;
- validar reduced-motion sem perda de conteúdo.

## Capability palette: repertório, nunca checklist

`docs/PORTFOLIO_CAPABILITY_PALETTE.md` registra recursos que o agente **pode** usar:
topologias de layout, headers, heroes, galerias, carrosséis, tabs, accordions,
lightbox, timelines, filtros, sticky narratives, parallax, marquee, SVG/Lottie,
integrações, analytics, local SEO, performance, consentimento, segurança e QA.

A seleção acontece depois da direção de arte. Para cada capacidade escolhida,
registrar: por que resolve um problema real, por que combina com a marca, custo,
fallback e efeito na originalidade. Não ativar recursos indiscriminadamente.

Para motion em landing/home, a diferença é importante: a motion matrix global deve ser **avaliada inteira**.
Cada capability fica `APPLIED`, `N/A_JUSTIFIED` ou `REJECTED_PERFORMANCE`; isso força exploração
sem obrigar efeitos inadequados.

## Precedência em conflito

requisitos do projeto → segurança → acessibilidade → integridade de dados →
regras de negócio → identidade/direção criativa do cliente → design system de
engenharia → arquitetura existente → limites do framework → performance → UX →
skills especializadas → referências estéticas.

Nenhuma skill externa sobrescreve automaticamente regras críticas do projeto.

## Anti-frankenstein

Múltiplas skills fornecem conhecimento, não estética somada. O resultado final
deve parecer 0WEB (em páginas da plataforma) ou **somente o cliente** em
`/portfolio/<slug>`, nunca uma colagem de Apple + Stripe + Linear + Material.

## Anti-template

Para portfolio/landing novo, leia `docs/PORTFOLIO_CREATIVE_DIRECTION_STANDARD.md`,
`docs/LANDING_PAGE_MOTION_EVIDENCE_STANDARD.md` e, quando aplicável,
`docs/PORTFOLIO_CAPABILITY_PALETTE.md`. A direção precisa definir topologia,
hero, tipografia, imagem, motion e assinatura interativa antes de codificar.

Recolorir o mesmo esqueleto não atende o padrão. Também não atende ligar todos os efeitos
sem intenção: capacidade máxima pertinente + direção autoral é a regra.
