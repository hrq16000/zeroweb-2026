---
name: 0web-portfolio-autonomous-pipeline
description: Orchestrate the 0WEB autonomous portfolio pipeline from minimal name + location intake through evidence-first research, factual content composition, media/identity work, funnel, QA and readiness without fabricating claims.
---

# 0WEB Portfolio Autonomous Pipeline

Use this skill whenever a project starts from **name + location**, when
`source_snapshot.autonomous_*` is changed, or when the autonomous pipeline is extended.

## Canonical files

- `src/lib/portfolio-autonomous-research.server.ts` — R1 research.
- `src/lib/portfolio-autonomous-content.ts` — R2 evidence-only composition.
- `src/lib/portfolio-managed.functions.ts` — persistence and lifecycle entry.
- `tests/portfolio/autonomous-intake-research.test.ts` — contract tests.
- `docs/PORTFOLIO_ENTITY_ENRICHMENT_STANDARD.md` — evidence/provenance.
- `docs/PORTFOLIO_PROJECT_AUTONOMY_ADDENDUM.md` — autonomy/readiness rules.
- `docs/PORTFOLIO_PROJECT_LIFECYCLE.md` — master lifecycle.

## 1. Start from the real repository state

Read `origin/main` and the current implementation before planning. Never restart a completed research pass because a handoff is stale. Preserve existing `source_snapshot` evidence and destination isolation.

## 2. R1 — research, never invention

Input is only `name + location`. R1 records entity resolution, locality, facts, web/social footprint, media candidates, review evidence, provider calls/errors and missing fields.

Treat `VERIFIED`, `RESOLVED`, `FOUND`, `UNRESOLVED`, `CONFLICT` and `PROVIDER_BLOCKED` as distinct states. Provider failure is not “business not found”; public phone is not presumed WhatsApp.

## 3. R2 — compose only from evidence

R2 may create briefing, hero, about copy, CTA, SEO, discovery metadata, schema draft, process steps and FAQ from verified context.

It must not invent services/products, differentiators, prices/offers, availability, ratings/reviews, years in business, certifications, team size, results or unsupported contact/location data.

Only explicit `service` / `service:*` or `differential` / `differential:*` facts with sufficient confidence may be promoted into those public lists.

## 4. Persist layers separately

```text
source_snapshot.autonomous_research  = R1 evidence ledger
source_snapshot.autonomous_content   = R2 content plan
source_snapshot.autonomous_pipeline  = orchestration state
```

Current contract: `autonomous_pipeline.contract = 2`.
R2 states: `content_composed`, `content_partial`, `blocked_identity`, `blocked_provider`.

## 5. Continue autonomously, but stop at real blockers

After R2, continue through identity/media, creative composition, funnel, SEO, cover/OG and QA when evidence and tooling allow it. Human input is for real conflicts, rights uncertainty, critical missing owner facts, material editorial decisions and publication approval.

For visual implementation, route additionally through `0web-experience-design-max`, `0web-portfolio-art-direction`, `0web-design-system` and `0web-ui-quality-gates`.

## 6. Funnel isolation

Every project owns its `clientKey`, intent and form. Never share or infer a recipient from another client. Missing verified WhatsApp means lead-only or explicitly unresolved delivery; never fallback to 0WEB or another portfolio.

## 7. Validation

```bash
bun test tests/portfolio/autonomous-intake-research.test.ts
bun run test:portfolio-ops
bun run build
```

When a real portfolio is produced, also run lifecycle/readiness, funnel, privacy, uniqueness, visual quality and browser/runtime gates required by the master lifecycle.

## 8. Documentation

Every material contract change updates this skill, `PORTFOLIO_PROJECT_AUTONOMY_ADDENDUM.md` when normative behavior changes, and `docs/skills/CHANGELOG.md`.

Do not claim “fully autonomous” while any stage still requires manual evidence promotion or media/composition work. Report the exact stage that is automated.
