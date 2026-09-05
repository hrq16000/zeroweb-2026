# Auditoria de experiência — Onda 0

Data: 2026-09-05 · Escopo: inspeção + documentação + fundação. Nenhum redesign
aplicado nesta rodada.

## 1. Arquitetura atual de motion

| Camada | Estado |
|---|---|
| `main { animation: page-reveal }` em `src/styles.css` | existe, global |
| `section-reveal` via `animation-timeline: view()` | existe, mas só para 9 temas de portfólio |
| Bloco `@media (prefers-reduced-motion: reduce)` global | existe e é correto |
| Tokens de easing/duração dedicados | **não existem** (cubic-bezier hardcoded) |
| Camada de primitives reutilizáveis | **não existia** — criada nesta rodada |
| View Transitions API | **não usada** |
| IntersectionObserver | usado apenas em `useNearFooter` e componentes soltos |

## 2. Dependências relevantes já instaladas

`motion` (Framer Motion v11+), `tw-animate-css`, `embla-carousel-react`,
`lucide-react`, `sharp`, `playwright`, `axe-core`, `@lhci/cli`.

Conclusão: **nenhuma dependência nova é necessária**. `motion` já está no
bundle e é usado em ~20 rotas institucionais; as primitives criadas são
CSS + IntersectionObserver, sem custo adicional de JS.

Classificação das capacidades avaliadas:

- **ADOPT:** IntersectionObserver, CSS transitions/clip-path, scroll-driven
  animations com fallback, `motion` para casos que exijam orquestração.
- **EVALUATE:** View Transitions API (catálogo → projeto), Web Animations API.
- **NOT_NEEDED:** GSAP, Lenis, Locomotive, Three.js.
- **CONFLICTS_WITH_STACK:** libs que exigem DOM no import (quebram SSR do Worker).

## 3. Estado das 67 páginas de projeto

| Nível | Qtde |
|---|---|
| PREMIUM | 4 |
| BASELINE | 31 |
| STATIC | 32 |

Fonte: `reports/experience-standard.json`.

- **Já atendem parcialmente:** Santos Montador, Marido de Aluguel, DYZ Promo,
  Salão da Márcia, Studio de Cílios, Vila da Capivara.
- **Excessivamente estáticas:** 32 páginas sem qualquer transição, hover ou
  reveal — incluindo brechós, marmitarias, confeitarias e assistências.
- **Motion problemático:** nenhum. Zero animação de propriedade de layout,
  zero loop infinito sem guarda de reduced motion.

## 4. Reduced motion, performance e mobile

- Reduced motion: coberto globalmente pelo CSS e agora também nas primitives.
- Performance: budgets já existiam em `src/config/portfolio-performance.json`
  (LCP 2500ms, CLS 0.1, INP 200ms). `animationJS` fica sem número até medir
  baseline — não inventamos budget.
- Mobile: QA de viewport (390/768/1440) já roda via Playwright; passa a
  incluir verificação de motion nas ondas seguintes.

## 5. Fundação entregue

| Artefato | Papel |
|---|---|
| `src/components/motion/index.tsx` | primitives oficiais, SSR-safe |
| `src/config/experience-capabilities.json` | capacidades, budgets, schemas |
| `src/config/portfolio-motion-profiles.json` | perfis por segmento + overrides + decisões |
| `docs/GLOBAL_WEB_EXPERIENCE_STANDARD.md` | norma portátil para outros domínios |
| `docs/PORTFOLIO_IMMERSIVE_EXPERIENCE_STANDARD.md` | aplicação em `/portfolio/:slug` |
| `scripts/check-experience-standard.mjs` | gate report-only + `--enforce` |
| Seção resumida em `AGENTS.md` | regra permanente do repositório |

## 6. Estratégias

- **Managed:** o wizard ganha a etapa *Experiência* (intensidade, preset,
  assinatura) na próxima onda; o perfil resolve por `overrides > segmento`.
- **Custom:** componentes seguem autorais; obedecem ao standard e registram
  decisão em `decisions[clientKey]`.
- **Capas:** as 10 bloqueadas passam a ter saída legítima via
  `BRAND_COMPOSITION` / `ABSTRACT_BRAND_ART`, sempre comparadas com nearest
  matches.

## 7. Rollout recomendado

1. Onda 1 — 4 projetos `STATIC` de maior tráfego, com perfis distintos.
2. Onda 2 — lotes de 4 até esgotar `STATIC`.
3. Onda 3 — refinamento dos `BASELINE` que ganham com isso.
4. Onda 4 — View Transitions catálogo → projeto e etapa do wizard.

Projetos autorais já aprovados não voltam à mesa. Sem codemod.

## 8. Gates executados

`check:experience-standard` (0 bloqueantes, 32 warnings informativos),
typecheck, `bun test`.
