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
`content/SEO` · `motion` · `accessibility-fix` · `performance` · `bugfix`
`backend/RLS` · `docs`

## Step 1.5 — Discover skills dynamically

The installed catalog is a starting point, not a ceiling. For substantial work,
run `0web-skill-discovery`: FIND SKILLS → RANK → SECURITY REVIEW → SELECT STACK.
Prefer official/original sources. Use breadth of expertise, not a pile of
redundant skills or incompatible dependencies.

## Step 2 — Compose the skill stack

| Task class | Stack (in order) |
|---|---|
| New commercial page / landing | `0web-skill-discovery` → `0web-portfolio-art-direction` → one appropriate landing/CRO specialist → `0web-design-system` → `0web-ui-quality-gates` → browser QA |
| Portfolio client site (`/portfolio/<slug>`) | `docs/PORTFOLIO_NEW_CLIENT_PLAYBOOK.md` → `0web-skill-discovery` → `0web-portfolio-art-direction` → one appropriate landing/CRO specialist → `0web-design-system` (client-scoped identity) → motion/a11y/performance specialists as needed → `0web-ui-quality-gates` → originality + funnel + browser QA |
| Material redesign | `0web-skill-discovery` → `0web-portfolio-art-direction` → `0web-design-system` → Apple HIG review → `0web-ui-quality-gates` |
| Dashboard / admin panel | `0web-design-system` (density, tables, states) → `0web-ui-quality-gates` (keyboard, empty/loading/error) |
| Form / funnel step | `0web-ui-quality-gates` (labels, errors, touch targets) → funnel rules in `docs/PORTFOLIO_FUNNELS.md` |
| React refactor | composition first (see `0web-design-system` → Component API), then `bun test` + typecheck |
| Motion / animation | `docs/design/MOTION.md` → per-client motion grammar when portfolio → `prefers-reduced-motion` check |
| Accessibility review | `.design-rules/SKILL.md` + `.design-rules/references/hig/accessibility.md` |
| SEO / content | route `head()` rules in `AGENTS.md`, JSON-LD validators in `package.json` |

Apple HIG is a review layer, never a visual skin. A landing/CRO skill is an
expert, never a section template. The 0WEB or client identity always wins.

## Step 2.5 — Anti-template requirement

For every new portfolio client and material redesign, record the creative DNA
from `docs/PORTFOLIO_CREATIVE_DIRECTION_STANDARD.md` **before** JSX layout work.

At minimum compare against the nearest portfolio sites on:

- hero composition;
- section order/narrative;
- typography;
- image treatment;
- motion grammar;
- signature interaction.

If the design differs mostly by color/logo/copy, do not implement it yet.

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

## Step 5 — Log

Record in the PR/commit or in `docs/skills/CHANGELOG.md`: task, skills used,
creative direction, findings, changes, validation, skills rejected and why.

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
