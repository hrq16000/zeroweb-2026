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
```

`layoutTopology`, `heroArchetype`, `typePairing`, `imageStrategy` and
`motionGrammar` must be deliberate client decisions, not segment defaults.

Possible topologies are prompts, **not templates**: editorial split, cinematic
full-bleed, asymmetric collage, technical blueprint, catalog mosaic, timeline,
service-path, magazine grid, immersive scroll story, local/map-led, product
shelf, before/after narrative, monolithic typography, or a new topology invented
for the client.

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
