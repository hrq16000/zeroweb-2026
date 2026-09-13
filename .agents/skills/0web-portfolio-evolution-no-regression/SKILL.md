---
name: 0web-portfolio-evolution-no-regression
description: Execution discipline for evolving /portfolio without regressions, template drift, duplicated audits or unnecessary Lovable spend.
---

# 0WEB Portfolio Evolution — No Regression

Before changing `/portfolio`, read `docs/PORTFOLIO_EVOLUTION_NO_REGRESSION.md` and `docs/PORTFOLIO_AUTONOMOUS_FACTORY_STANDARD.md`.

## Mandatory behavior

- Inspect current Git + database + runtime before acting; do not trust stale reports as current state.
- Continue from the latest verified state; never restart completed audits without a concrete reason.
- Prefer root-cause fixes over per-slug cosmetic patches.
- Prefer GitHub/Vercel/database/web workflows over paid Lovable turns when equivalent.
- Never equate build success with visual quality.
- Never mark NOT_TESTED as PASS.
- Preserve routes, funil safety, privacy, SEO, accessibility, performance and client isolation.
- For destination recovery, use real entity evidence and the canonical confirmation flow; never invent digits or use the 0WEB institutional number.
- For new/redesigned pages, generate at least three structurally divergent creative directions and reject high similarity before implementation.
- Shared infrastructure may be standardized; visible page composition must not be standardized.
- For authorial/composition projects, do not inject a generic visual narrative after the client's own composition.
- Asset completion means hero + catalog cover + social/OG + preview are explicitly resolved or explicitly pending.
- Client self-service must be enforced server-side and by RLS using project membership, never only by hidden UI.

## Definition of done

A change is done only after: baseline captured → isolated change → focused tests → regression checks → deployment → runtime validation → state/report updated.

If the same correction would need to be repeated manually for many slugs, stop and fix the platform mechanism instead.
