---
name: 0web-skill-router
description: Route any 0WEB task (UI, landing page, portfolio client site, dashboard, form, funnel, refactor, SEO) to the right combination of creative direction, design, accessibility, performance and quality skills before writing code.
---

# 0WEB Skill Router

Canonical entry point for agent work in this repository. Run this before
implementing anything that touches UI, content, routes or the funnel.

## Step 1 — Classify the task

Pick every label that applies:

`landing-page` · `portfolio-client-site` · `institutional-page` · `dashboard`
`form` · `checkout/cart` · `funnel` · `component-refactor` · `design-system`
`content/SEO` · `motion` · `layout-engineering` · `accessibility-fix` · `performance` · `bugfix`
`backend/RLS` · `docs`

## Step 1.5 — Discover skills dynamically

The installed catalog is a starting point, not a ceiling. For substantial work,
run `0web-skill-discovery`: FIND SKILLS → RANK → SECURITY REVIEW → SELECT STACK.
Prefer official/original sources. Use breadth of expertise, not a pile of
redundant skills or incompatible dependencies.

For every new project/new `/portfolio/:slug` and every material UI/UX maintenance,
read `src/config/skill-marketplace-catalog.json` and
`docs/SKILL_MARKETPLACE_DISCOVERY_STANDARD.md`. Search LobeHub and
`https://awesomeskill.ai/search` when fresh complementary expertise may exist.

For any material UI task, `0web-experience-design-max` is mandatory after
discovery. It forces coverage of strategy, UX/UI, layout engineering, design
system, web engineering, content/SEO, motion and QA before visual implementation.

## Step 2 — Compose the skill stack

| Task class | Stack (in order) |
|---|---|
| New commercial page / landing | `0web-skill-discovery` → marketplace/original-source discovery → `0web-experience-design-max` → `0web-portfolio-art-direction` → `0web-landing-experience` → one appropriate landing/CRO specialist → `0web-design-system` → layout engineering → Apple HIG / UX review → motion/a11y/performance specialists as needed → `0web-ui-quality-gates` → browser QA with runtime visual evidence |
| Portfolio client site (`/portfolio/<slug>`) | `docs/PORTFOLIO_NEW_CLIENT_PLAYBOOK.md` → `0web-skill-discovery` → marketplace/original-source discovery → `0web-experience-design-max` → `0web-portfolio-art-direction` → `0web-landing-experience` → one appropriate landing/CRO specialist → `0web-design-system` (client-scoped identity) → Flexbox/Grid/intrinsic layout review → motion/a11y/performance specialists as needed → `0web-ui-quality-gates` → originality + funnel + browser QA |
| Material redesign / material maintenance | `0web-skill-discovery` → marketplace/original-source discovery → `0web-experience-design-max` → `0web-portfolio-art-direction` → `0web-landing-experience` → `0web-design-system` → layout engineering → Apple HIG review → `0web-ui-quality-gates` |
| Dashboard / admin panel | `0web-skill-discovery` → `0web-experience-design-max` → `0web-design-system` (density, tables, states) → layout engineering → `0web-ui-quality-gates` (keyboard, empty/loading/error) |
| Form / funnel step | `0web-experience-design-max` → `0web-ui-quality-gates` (labels, errors, touch targets) → funnel rules in `docs/PORTFOLIO_FUNNELS.md` |
| React refactor | `react-best-practices` when relevant → composition first (see `0web-design-system` → Component API), then `bun test` + typecheck |
| Motion / animation | `0web-experience-design-max` → `docs/design/MOTION.md` → `docs/EXPERIENCE_DESIGN_MAX_STANDARD.md` → `docs/LANDING_PAGE_MOTION_EVIDENCE_STANDARD.md` when landing/home → per-client motion grammar when portfolio → `prefers-reduced-motion` check |
| Layout engineering | `docs/LAYOUT_ENGINEERING_STANDARD.md` → Flexbox/Grid/intrinsic sizing choice → 390/768/1440 QA → overflow/focus/semantic-order review |
| Accessibility review | `.design-rules/SKILL.md` + `.design-rules/references/hig/accessibility.md` + `web-design-guidelines` when useful |
| SEO / content | route `head()` rules in `AGENTS.md`, JSON-LD validators in `package.json`, research/SEO skill only when it adds non-redundant value |

Apple HIG is a review layer, never a visual skin. A landing/CRO skill is an
expert, never a section template. The 0WEB or client identity always wins.

## Step 2.4 — Maximum relevant skills

For visual/commercial work, maximize **coverage of expertise**, not the raw
number of loaded skills. The selected stack should cover every relevant concern:
strategy, art direction, UI/UX, layout engineering, CRO, design system, motion,
accessibility, performance/React, SEO/content, browser QA, privacy/security and QA.

A skill may be omitted only when it is genuinely `NOT_APPLICABLE`, redundant or
fails security/compatibility review. Record the reason in the PR/changelog.
External marketplaces (LobeHub, AwesomeSkill and similar) are discovery sources,
not permission to execute unreviewed scripts.

## Step 2.5 — Anti-template requirement

For every new portfolio client, landing page and material redesign, record the creative DNA
from `docs/PORTFOLIO_CREATIVE_DIRECTION_STANDARD.md` **before** JSX layout work.

At minimum compare against the nearest pages/sites on:

- hero composition;
- section order/narrative;
- typography;
- image treatment;
- motion grammar;
- signature interaction;
- navigation/header behavior;
- CTA persistence;
- closing/footer composition.

If the design differs mostly by color/logo/copy, do not implement it yet.

## Step 2.6 — Landing experience requirement

Toda landing/home comercial deve aplicar `.agents/skills/0web-landing-experience/SKILL.md`,
`.agents/skills/0web-experience-design-max/SKILL.md`,
`docs/EXPERIENCE_DESIGN_MAX_STANDARD.md`, `docs/LAYOUT_ENGINEERING_STANDARD.md` e
`docs/LANDING_PAGE_MOTION_EVIDENCE_STANDARD.md`.

Isso inclui:

- avaliar a motion matrix global (`fade-up`, `fade-left/right`, `blur-in`, `scale-in`, `stagger-up`, `image-reveal`, `clip-reveal`, `parallax`, `marquee`, `float`, `header-scroll`, `menu-reveal`, `text-line-reveal`, `progress-line`), classificando cada item como `REQUIRED`, `OPTIONAL` ou `NOT_APPLICABLE`;
- avaliar Flexbox, Grid, intrinsic sizing e responsive flow como capabilities explícitas;
- aplicar o máximo pertinente sem transformar motion em decoração obrigatória;
- evitar uma única animação repetida em todas as seções;
- tratar motion como fail-open;
- usar mídia real quando existir;
- exigir evidência visual em runtime e estados `BEFORE → DURING → AFTER` para signature moments;
- validar 390, 768, 1440 e reduced-motion;
- reutilizar CTA/funil canônico do domínio em vez de duplicar mecanismo de contato.

Referências externas e visuais são repertório, não template. Dexa Experience Design,
UI/UX Pro Max, LobeHub/AwesomeSkill, WCRIA, Doğukan Tavlacı, Suprema Mídia,
Apple HIG e skills de frontend/UI podem orientar estratégia, ritmo, craft e
interação, mas nunca autorizam copiar marca, assets, números, depoimentos ou claims.

## Step 3 — Implement

Preserve the canonical stack. Do not swap router, framework, package manager or
security architecture to satisfy an external skill.

For portfolio clients, platform primitives may be shared while visual tokens,
composition and art direction remain client-scoped.

## Step 4 — Verify with evidence

Never claim "works" without output. Minimum for UI changes:

```bash
bun run validate:portfolio-boundaries   # when /portfolio was touched
bun test
bun run build
```

For new portfolio clients also verify `validate:portfolio-scaffold`,
`check:portfolio-originality`, primary funnel/WhatsApp routing, mobile viewport,
keyboard, console and reduced motion.

Para landing/home comercial, além dos gates técnicos, registre evidência visual do hero,
bloco narrativo principal, serviços, prova/experiência, projetos/cases com imagens visíveis,
conteúdo/editorial com mídia real quando disponível, CTA persistente e footer/encerramento.

## Step 5 — Log

Record in the PR/commit or in `docs/skills/CHANGELOG.md`: task, discovery sources,
skills considered/used/rejected, creative direction, layout strategy, findings,
changes and validation.

## Conflict precedence

project requirements → security → accessibility → data integrity → business
rules → client identity/creative direction → design system engineering →
existing architecture → framework constraints → performance → UX → specialized
skills → aesthetic references.

## Hard rules

- No public contacts (`wa.me`, phone, operational e-mail) in any client bundle.
- No fabricated testimonials, ratings, awards, metrics, logos or commercial
  results presented as real. Demo content must be visibly labeled as demo/example.
- Bun 1.4.0 + `bun.lock`; never generate `package-lock.json`.
- Never publish directly to `main`.
