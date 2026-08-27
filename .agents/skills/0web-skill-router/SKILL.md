---
name: 0web-skill-router
description: Route any 0WEB task (UI, landing page, portfolio client site, dashboard, form, funnel, refactor, SEO) to the right combination of design, accessibility, performance and quality skills before writing code. Use at the start of any non-trivial change in this repository.
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

## Step 2 — Compose the skill stack

| Task class | Stack (in order) |
|---|---|
| New page / landing / redesign | `0web-design-system` → `0web-ui-quality-gates` → visual QA in browser |
| Portfolio client site (`/portfolio/<slug>`) | `docs/PORTFOLIO_NEW_CLIENT_PLAYBOOK.md` → `0web-design-system` (client identity, never 0WEB identity) → `0web-ui-quality-gates` → `bun run validate:portfolio-boundaries` |
| Dashboard / admin panel | `0web-design-system` (density, tables, states) → `0web-ui-quality-gates` (keyboard, empty/loading/error) |
| Form / funnel step | `0web-ui-quality-gates` (labels, errors, touch targets) → funnel rules in `docs/PORTFOLIO_FUNNELS.md` |
| React refactor | composition first (see `0web-design-system` → Component API), then `bun test` + typecheck |
| Motion / animation | `docs/design/MOTION.md` → `prefers-reduced-motion` check |
| Accessibility review | `.design-rules/SKILL.md` + `.design-rules/references/hig/accessibility.md` |
| SEO / content | route `head()` rules in `AGENTS.md`, JSON-LD validators in `package.json` |

Apple HIG (`.design-rules/`) is a **review layer**, never a visual skin. The
0WEB (or the client's) identity always wins.

## Step 3 — Implement

Preserve existing architecture. Do not swap stack, router, package manager or
design tokens to satisfy an external skill.

## Step 4 — Verify with evidence

Never claim "works" without output. Minimum for UI changes:

```bash
bun run validate:portfolio-boundaries   # when /portfolio was touched
bun test
bun run build
```

Plus a real browser pass (render, mobile viewport, console, primary CTA).

## Step 5 — Log

Record in the PR/commit or in `docs/skills/CHANGELOG.md`: task, skills used,
findings, changes, validation, skills rejected and why.

## Conflict precedence

project requirements → security → accessibility → data integrity → business
rules → design system → existing architecture → framework constraints →
performance → UX → specialized skills → aesthetic references.

## Hard rules

- No public contacts (`wa.me`, phone, operational e-mail) in any client bundle.
- No invented metrics, testimonials, awards or counters.
- Bun 1.4.0 + `bun.lock`; never generate `package-lock.json`.
- Never publish directly to `main`.
