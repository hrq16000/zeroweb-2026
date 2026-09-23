---
name: 0web-portfolio-art-direction
description: Creative-direction and anti-template skill for every new or materially redesigned 0WEB landing page and /portfolio client site. Use before choosing sections, typography, layout, imagery or motion.
---

# 0WEB Portfolio Art Direction

Purpose: make every client site recognizable as **that client**, not as another
0WEB template. Shared engineering is desirable; shared visual composition is not.

## Core rule

**Standardize mechanics, never creativity.**

Before code, create a compact creative brief for the client. If the brief could
be pasted into another client with only the company name changed, it is not good
enough.

## 1. Ground the direction in the business

Define all of these before implementation:

- real offer and primary audience;
- single primary conversion goal;
- brand personality in 3–5 precise adjectives;
- a visual metaphor derived from the business, product, craft, place or material;
- one dominant composition idea;
- one signature interaction/motion idea;
- image strategy based on official assets or clearly non-factual branded art;
- what must make this page visibly different from the nearest portfolio sites.

Do not start from `hero + 3 cards + testimonials + FAQ + CTA` and recolor it.
Choose the information architecture after the business and traffic intent are clear.

## 2. Creative DNA — mandatory fields

Every new client brief must record:

```text
businessTruth:
audience:
singleGoal:
brandPersonality:
visualMetaphor:
layoutTopology:
heroArchetype:
navigationArchetype:
sectionRhythm:
typePairing:
colorRoles:
imageStrategy:
iconStrategy:
motionGrammar:
interactionSignature:
conversionNarrative:
proofStrategy:
nearestPortfolioRisks:
antiTemplateDecisions:
resourceEffortLedger:
```

`layoutTopology`, `heroArchetype`, `typePairing`, `imageStrategy` and
`motionGrammar` must be deliberate client decisions, not segment defaults.

Possible topologies are prompts, **not templates**: editorial split, cinematic
full-bleed, asymmetric collage, technical blueprint, catalog mosaic, timeline,
service-path, magazine grid, immersive scroll story, local/map-led, product
shelf, before/after narrative, monolithic typography, or a new topology invented
for the client.

## 2.1 Decision intelligence — mandatory before layout

For every new landing, pair the Creative DNA with the additive
`LandingDecisionProfileV2` from
`docs/PORTFOLIO_LANDING_RESEARCH_INTELLIGENCE_STANDARD.md`.

At minimum decide: traffic intent/source, offer type, decision complexity/risk,
visitor uncertainties, decision support, value demonstration, form strategy,
transparency, locality/coverage need, source continuity, cross-channel
continuity, post-conversion plan and measurement.

This layer answers **what the visitor still needs to decide**. Art direction then
answers **how that decision becomes a unique experience**. Never choose a
reference brand's section order as a template.

## 3. Skill stack — use breadth without creating a Frankenstein UI

For new commercial pages, compose expertise across these layers:

1. **Creative direction** — Anthropic `frontend-design` principles + this skill.
2. **Landing/CRO** — one specialist chosen for the actual traffic/offer.
3. **UX/UI** — hierarchy, responsive behavior, touch, states, accessibility.
4. **Frontend engineering** — React 19, TanStack Start, TypeScript, Tailwind v4.
5. **Motion** — project motion primitives / `motion/react`; motion serves the metaphor.
6. **Content/SEO** — semantic HTML, intent-led copy, unique metadata/JSON-LD.
7. **Performance** — image sizing, lazy loading, code splitting, Core Web Vitals.
8. **QA** — keyboard, reduced motion, mobile, browser, console, funnel, privacy.

More skills are useful only when they add a **different competency**. Reject
three skills that all prescribe the same landing-page skeleton.

## 4. Client-scoped design system

A portfolio client may and often should have its own scoped CSS variables for:

- palette / semantic color roles;
- display and body typefaces;
- radius / border language;
- spacing rhythm;
- shadow/elevation language;
- image crop/treatment;
- decorative motifs.

Do not force Space Grotesk/Inter or the 0WEB palette onto client sites. Platform
primitives can be shared, but the rendered identity belongs to the client.

## 5. Images

Priority order:

1. official client logo/brand files;
2. official client photography/product/work images;
3. licensed or generated **brand-supporting** imagery that is not presented as
   documentary proof of the client's team, location, completed work or customers;
4. abstract/typographic/illustrative brand compositions.

Generated imagery must not invent factual evidence. Never fabricate a facade,
team, completed project, customer or before/after result and present it as real.

## 6. Social proof

Published commercial pages may show testimonials, ratings, awards, counts or
results only when evidence exists. For prototypes/demos, illustrative proof is
allowed only when visibly labeled `Exemplo`, `Demonstração` or equivalent so it
cannot be mistaken for a real customer statement.

Do not silently turn fabricated copy into real-looking reviews.

## 7. Motion and interaction

Every new portfolio client needs a per-client motion override; segment defaults
are fallback for legacy pages only.

Use up to three signature moments when justified. Prefer transform, opacity and
clip-path. `prefers-reduced-motion` is mandatory. A signature moment should
express the client's metaphor, not merely add fade-up animation everywhere.

Examples: blueprint lines drawing for engineering, layered material reveals for
construction, ingredient/packaging motion for food, editorial crop transitions
for fashion, diagnostic scan behavior for technical service.

## 8. Anti-template cross-review

Before ship, compare against the nearest portfolio sites and answer:

- Is the hero composition materially different?
- Is the section order/narrative materially different?
- Is the typography materially different when the brand allows it?
- Is the image treatment materially different?
- Is the motion grammar materially different?
- Is there at least one unmistakable signature element?

If the page is distinctive only because of color or copy, redesign it.

## 9. Engineering constraints

Keep the canonical stack: React 19 + TanStack Start + TypeScript + Tailwind v4 +
Vite/Bun. Do not add Sass, Bootstrap, GSAP, Three.js, AOS or another framework
merely because an external skill prefers it. Heavy libraries require a concrete
client need, security review and performance justification.

Keep all contact server-side. Use the client's `clientKey`, own funnel and the
canonical secret `PORTFOLIO_WHATSAPP_<CLIENT_KEY>`.

## 10. Definition of done

A page is not done until it has:

- a completed creative brief;
- client-scoped identity;
- unique composition/narrative;
- per-client motion override;
- official or safely classified imagery;
- working individual funnel/WhatsApp routing;
- semantic HTML + SEO;
- mobile/keyboard/reduced-motion validation;
- originality comparison and visual QA;
- performance/privacy/build gates green.


## 2.2 Decision intelligence R3 — before composition

After V2 and before choosing hero geometry, section graph or motion, evaluate the
R3 extension in
`docs/research/LANDING-PAGE-OFFICIAL-SITE-SWEEP-R3-2026-09-21.md`.
The creative direction must explicitly account for decision velocity,
information scent, legitimate self-segmentation, context carryover,
claim→evidence placement, risk-adjusted persuasion, freshness, navigation
leakage and the mobile decision budget.

Do not translate these fields into a fixed layout. They describe **what the
experience must solve**, while art direction remains project-specific. A
selector, comparison, simulator, preview or short fast path is only selected
when it removes a real decision barrier.


## 2.3 Resource effort — mandatory

Before final composition, apply
`docs/PORTFOLIO_RESOURCE_UTILIZATION_STANDARD.md`. Art direction must prove that
relevant media, research, interaction, decision aids and experience capabilities
were considered rather than defaulting to the cheapest composition.

Record material choices as `USED`, `REJECTED`, `ATTEMPTED_BLOCKED` or
`NOT_APPLICABLE`. The art director's job is not to activate everything; it is to
make sure useful resources are not ignored and irrelevant ones do not pollute the
experience.

## 11. External reference decomposition — mandatory when a URL is supplied

A reference site is a **research specimen**, never a layout source file. The job
is to extract the design logic that makes it effective, then translate that logic
through the client's own truth, media, offer and brand.

Before JSX, inspect the reference home plus relevant internal routes when they
exist and produce these four matrices:

### A. Experience-role matrix

For every meaningful chapter or interaction record:

`role | visitorQuestion | decisionJob | priority | evidence | conversionEffect`

Roles may include orientation, offer discovery, quick conversion, product
browsing, risk reduction, decision support, proof, locality, process,
education and post-action continuity. A role is **not a section name** and may
be merged into another region.

### B. Composition matrix

For each selected role record:

`spatialTreatment | mediaTreatment | textMediaRatio | density | containment |
overlap/layering | interaction | mobileTranslation`

This forces the agent to reason about silhouette and geometry instead of
defaulting to centered container + repeated cards.

### C. Rhythm/media matrix

Map the page as a sequence of perceptual states, for example:

`AIRY/DENSE | MEDIA_DOMINANT/TEXT_DOMINANT/BALANCED |
STATIC/INTERACTIVE | FULL_BLEED/CONTAINED/OVERLAPPED |
QUIET/CONTRASTED`

The final project must derive its own cadence. Do not reproduce the reference's
exact order or proportions.

### D. Anti-copy matrix

Separate:

- **transferable principle** — e.g. move a decision aid near the uncertainty it
  resolves; use real workshop/store imagery as credibility evidence;
- **project-specific translation** — how that principle fits this client;
- **do not copy** — exact section order, distinctive composition, assets, copy,
  brand devices, proprietary interaction, measurements or visual identity.

When the user supplied a reference and no decomposition was produced,
`REFERENCE_DECOMPOSITION_MISSING` is a blocker.

### FFIX audit — 2026-09-22

### Multi-source reference corpus — R1 2026-09-23

FFIX is no longer the only reference example. Before using an external site,
consult:

- `docs/research/PORTFOLIO_REFERENCE_CORPUS_R1_2026-09-23.md`
- `src/config/portfolio-reference-pattern-library.json`

Select references by **decision mode**, not by segment name. Combine
complementary grammars where useful: diagnostic-led, physical-proof-led,
multi-location, founder-led, productized-service, profession-risk-led,
product-demo-led, specialist-single-job or multi-offer ecosystem.

Every extracted signal is `USE`, `ADAPT` or `REJECT`.

Do not treat visually impressive but factually weak elements as inspiration:
unverified metrics/reviews, fake urgency, stale prices, zero-state counters and
generic testimonials belong in `REJECT`.

For animation research, separate interaction from motion. A crawl can verify
forms/tabs/selectors/carousels and state changes; it cannot verify timing/easing
or scroll choreography. Without visual evidence, set
`motionObserved=NOT_VERIFIED` and record only a project-specific
`derivedMotionCandidate`.



Public reference: `https://ffix.com.br/`. This audit is an example of
**principle extraction**, not a template.

| Observed route/job | Public structural pattern | Principle absorbed |
|---|---|---|
| Multi-offer home | trust-led opening → early quote/configuration → service discovery → real workshop media → secondary inventory → benefits/process → brands/locality → diagnostic/status utilities → reviews/store/location → education/FAQ | mix commercial, editorial, physical-proof and utility chapters instead of repeating one component family |
| Device/service route | concise offer/trust → quote capture → problem-specific explanation → service taxonomy → process/local feasibility → CTA/FAQ | make the first explanatory chapter specific to the decision, not a reusable “about/services” filler |
| Used-device inventory | availability/gallery first → request/search → assurance → inspection/process → risk reduction → sell/trade path → CTA | product-led intent needs browsing and availability mechanics, not a service-page skeleton |
| High-risk repair (TV) | repair content plus a “repair or replace?” decision aid near the uncertainty | place decision support where doubt occurs rather than reserving every objection for FAQ |
| Offer-defining guarantee (screen protection) | differentiating guarantee receives early visual/commercial weight | allow the strongest real differentiator to reorder the page instead of forcing the standard section sequence |

Media lessons from the same reference: real workshop imagery appears where craft
and credibility need proof; product imagery dominates inventory; store imagery
supports locality; CTA imagery is used selectively near a closing decision.
Images therefore have **narrative jobs** and do not all live inside the same
card/grid treatment.

The 0WEB translation must preserve this adaptive logic while producing a
different client-specific composition, silhouette, media cadence and journey.

