---
name: 0web-portfolio-autonomous-pipeline
description: Orchestrate the 0WEB autonomous portfolio pipeline from minimal name + location intake through evidence-first research, factual content composition, media/identity work, funnel, QA and readiness without fabricating claims.
---

# 0WEB Portfolio Autonomous Pipeline

Use this skill whenever a project starts from **name + location**, when
`source_snapshot.autonomous_*` is changed, or when the autonomous pipeline is extended.

## Canonical files

- `src/lib/portfolio-autonomous-research.server.ts` — R1 research.
- `src/lib/portfolio-autonomous-evidence.ts` — promoção conservadora de evidência estruturada.
- `src/lib/portfolio-autonomous-content.ts` — R2 evidence-only composition.
- `src/lib/portfolio-managed.functions.ts` — persistence and lifecycle entry.
- `tests/portfolio/autonomous-intake-research.test.ts` — contract tests.
- `docs/PORTFOLIO_ENTITY_ENRICHMENT_STANDARD.md` — evidence/provenance.
- `docs/PORTFOLIO_PROJECT_AUTONOMY_ADDENDUM.md` — autonomy/readiness rules.
- `docs/PORTFOLIO_LANDING_RESEARCH_INTELLIGENCE_STANDARD.md` — repertório de CRO/arquitetura de decisão derivado de 34 LPs + revalidação pública.
- `docs/PORTFOLIO_PROJECT_LIFECYCLE.md` — master lifecycle.

## 1. Start from the real repository state

Read `origin/main` and the current implementation before planning. Never restart a completed research pass because a handoff is stale. Preserve existing `source_snapshot` evidence and destination isolation.

## 2. R1 — research, never invention

Input is only `name + location`. R1 records entity resolution, locality, facts, web/social footprint, media candidates, review evidence, provider calls/errors and missing fields.

Treat `VERIFIED`, `RESOLVED`, `FOUND`, `UNRESOLVED`, `CONFLICT` and `PROVIDER_BLOCKED` as distinct states. Provider failure is not “business not found”; public phone is not presumed WhatsApp.

### Structured service evidence

The first automatic factual promotion layer is deliberately narrow:

- entity resolution confidence must be at least 70;
- only structured keys explicitly named `service(s)`, `serviço(s)`,
  `specialty/specialties` or `especialidade(s)` are eligible;
- accepted structured sources are resolved Google place fields and Knowledge
  Graph fields already captured by R1;
- free-text description, snippet, category and generic segment knowledge never
  become services;
- boolean service options such as delivery/dine-in are not converted into
  service names;
- duplicate labels are normalized and capped before entering `facts[]`.

When no eligible field exists, `verified_services` remains missing.

## 3. R2 — compose only from evidence

R2 may create briefing, hero, about copy, CTA, SEO, discovery metadata, schema draft, process steps and FAQ from verified context.

It must not invent services/products, differentiators, prices/offers, availability, ratings/reviews, years in business, certifications, team size, results or unsupported contact/location data.

Only explicit `service` / `service:*` or `differential` / `differential:*` facts with sufficient confidence may be promoted into those public lists.

### Landing intent + decision profile before layout

Before creative composition, classify `funnelStage`, audience, primary job,
primary conversion, decision risk, evidence need, content depth, form friction,
proof modes, hero strategy and post-conversion behavior according to
`PORTFOLIO_LANDING_RESEARCH_INTELLIGENCE_STANDARD.md`.

Then persist/derive the additive `LandingDecisionProfileV2`: traffic
intent/source, offer type, risk dimensions, unresolved decision questions,
decision aids, value-demonstration mode, form purpose/progressive profiling,
transparency plan, location/coverage requirement, source continuity,
cross-channel continuity, post-conversion and measurement.

R2 may propose these parameters from evidence, but must leave unsupported values
unknown/not-applicable instead of filling them from segment stereotypes.

Use the reference corpus to **add decision intelligence, never to clone layouts**.
Pick a narrative arc because it resolves the visitor's decision (local service,
consultive quote, B2B software, event/course, rich material, franchise, catalog
or sensitive educational flow). Section order remains project-specific.

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


### R3 — decision velocity and continuity

For every new landing, extend the V2 decision profile with the additive R3 layer
from `docs/research/LANDING-PAGE-OFFICIAL-SITE-SWEEP-R3-2026-09-21.md`:
`pageMode`, `decisionVelocity`, `informationScent`, `selfSegmentation`,
`contextCarryover`, `commitmentLadder`, `claimEvidenceGraph`,
`riskAdjustedPersuasion`, `actionStateModel`, `humanEscalationPolicy`,
`responseExpectationContract`, `freshnessPolicy`,
`navigationLeakagePolicy`, `mobileDecisionBudget` and
`experimentReadiness`.

R3 is **SOME/additive**. It never replaces V1/V2 evidence, lifecycle, creative
originality, funnel isolation or premium gates. Unsupported fields remain
unknown/NA. Persist known source/offer/item/plan/unit context instead of asking
for it again when the architecture can carry it forward.


## 9. Resource utilization duty

For every new autonomous project, enforce
`docs/PORTFOLIO_RESOURCE_UTILIZATION_STANDARD.md`. After R1/R2/R3, actively
attempt the relevant resources that can improve the result: official sources,
real media, brand assets, useful skills, decision aids, local context, safe
interaction, SEO/entity data, accessibility, performance, funnel continuity,
measurement and runtime QA.

Do not stop at the first functional implementation when a relevant resource is
available and would materially improve the page. Record important unused
resources as `REJECTED`, `ATTEMPTED_BLOCKED` or `NOT_APPLICABLE` with a reason.
Do not add decorative or heavy capabilities merely to satisfy this rule.
