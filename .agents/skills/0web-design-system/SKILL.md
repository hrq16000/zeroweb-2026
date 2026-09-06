---
name: 0web-design-system
description: Design engineering, semantic tokens, typography, layout rhythm, component API rules and anti-AI-slop criteria for 0WEB interfaces and isolated /portfolio client sites. Use after creative direction is defined.
---

# 0WEB Design System

This skill is a **design-engineering layer**, not a universal visual skin.
For `/portfolio/<slug>`, read `.agents/skills/0web-portfolio-art-direction/SKILL.md`
and the client's creative brief first.

## Platform vs client identity

### 0WEB platform pages

Source of truth for tokens: `src/styles.css` (`@theme` + `:root`). Prefer semantic
utilities such as `bg-background`, `text-foreground`, `bg-card`,
`text-muted-foreground`, `bg-primary`, `border-border`, `ring-ring`.

### Portfolio client sites

The client's identity is sovereign. Reuse platform primitives and engineering,
but create **client-scoped semantic variables/tokens** when the brand requires
another palette, type pairing, radius, spacing rhythm, image treatment or
surface language.

Do not force the 0WEB palette or typography onto a client. Hard-coded random
colors are still discouraged, but a deliberate local token such as
`--client-accent`, `--client-ink`, `--client-paper` is valid and preferred over
pretending every client shares the same global theme.

## Direction before code

For normal 0WEB UI, state audience, goal, aesthetic direction, color roles,
type pairing, structure and signature element.

For a new or materially redesigned portfolio/landing, the full creative brief
in `docs/PORTFOLIO_CREATIVE_DIRECTION_STANDARD.md` is mandatory. If the brief
could fit another client by changing only the name, do not build yet.

## Typography

### 0WEB platform

- Display: `--font-display` (Space Grotesk). Body: `--font-sans` (Inter).

### Portfolio client

- Choose a brand-appropriate type pairing. Space Grotesk/Inter are **fallbacks,
  not defaults** for client identity.
- Use licensed/allowed fonts with performant loading and sensible fallbacks.
- One `h1` per route. Heading levels never skip.
- Body measure is normally 60–75ch; deliberate editorial exceptions are allowed.
- Mobile body text must remain readable and form fields should avoid iOS zoom.

## Layout and rhythm

Use the Tailwind scale and CSS custom properties, but do not impose one vertical
rhythm, radius or max-width across all clients. The creative brief decides
whether the project is dense, editorial, cinematic, technical, catalog-like,
asymmetric, modular or something else.

Shared values are engineering conveniences, not visual requirements.

## Component API rules

- Compose instead of growing props. Avoid boolean explosion.
- Extract when a component mixes fetching, layout and business rules or becomes
  difficult to reason about.
- Shared behavior belongs in shared primitives; client identity, layout topology,
  copy, palette, typography, imagery and signature motion stay local.
- A shared primitive must not silently impose a hero/card/section composition.

## Anti-AI-slop checklist

Reject a design that shows any of these without a deliberate reason:

- generic 3-card grid as the dominant structure;
- purple/indigo gradient on white by habit;
- gratuitous glassmorphism or decorative blur;
- shadows with no elevation meaning;
- interchangeable `hero → cards → logos → pricing → FAQ → CTA` template;
- same hero topology, same section order and same motion grammar as nearby
  portfolio clients;
- default Inter-only typography when the brand calls for another voice;
- stock-feeling imagery replacing official client material;
- a redesign whose only meaningful differences are logo, color and copy.

Ask: is it better, more coherent, more distinctive, and grounded in this
client's business — or merely a recolored template?

## Portfolio isolation

Inside `/portfolio/<slug>` never import 0WEB `Header`, `Footer`, navigation,
palette or copy. Read:

- `docs/PORTFOLIO_CLIENT_STANDARD.md`
- `docs/PORTFOLIO_NEW_CLIENT_PLAYBOOK.md`
- `docs/PORTFOLIO_CREATIVE_DIRECTION_STANDARD.md`

Then run `bun run validate:portfolio-boundaries`.

## Conversion

Every commercial page should communicate what it is, for whom, why it deserves
attention and what to do next quickly. The strongest conversion pattern depends
on traffic and offer; a fixed landing-page section count is not a requirement.

Primary action must be visually clear. Proof must be evidence-based; if no
verified testimonial/rating exists, use legitimate proof such as process,
materials, scope, official imagery, guarantees or methodology instead of
fabricating social proof.
