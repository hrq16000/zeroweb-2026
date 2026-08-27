---
name: 0web-design-system
description: Design direction, semantic tokens, typography, layout rhythm, component API rules and anti-AI-slop criteria for 0WEB interfaces and isolated /portfolio client sites. Use when creating or redesigning any page, section or component.
---

# 0WEB Design System

Source of truth for tokens: `src/styles.css` (`@theme` + `:root` + client
themes). Never hardcode colors — no `text-white`, `bg-black`, `bg-[#...]`.
Use semantic utilities: `bg-background`, `text-foreground`, `bg-card`,
`text-muted-foreground`, `bg-primary`, `border-border`, `ring-ring`.

## Direction before code

Before implementing, state in one paragraph: audience, the single goal of the
page, aesthetic direction, 4–6 color roles, type pairing, structure and one
signature element that makes the page recognizable.

If the direction cannot be stated, the page is not ready to be built.

## Typography

- Display: `--font-display` (Space Grotesk). Body: `--font-sans` (Inter).
- One `h1` per route. Heading levels never skip.
- Body measure 60–75ch. Mobile body ≥ 16px to avoid iOS zoom.
- Type scale is intentional: hero, section title, subtitle, body, caption.
  Do not invent one-off sizes when a step already exists.

## Layout and rhythm

- Spacing uses the Tailwind scale; keep a consistent vertical rhythm per
  section (e.g. `py-16 md:py-24`).
- Radius comes from `--radius` derivatives (`rounded-lg`, `rounded-2xl`).
- Shadows: `--shadow-soft` / `--shadow-glow` only when they express elevation.

## Component API rules

- Compose instead of growing props. No boolean explosion (`isPrimary`,
  `isLarge`, `isCompact` → one `variant` + one `size` via `cva`).
- Extract when a component exceeds ~200 lines or mixes fetching, layout and
  business rules.
- Shared shell/behaviour lives in a shared component; identity (copy, colors,
  imagery) stays with the page or client.

## Anti-AI-slop checklist

Reject a design that shows any of these without a deliberate reason:

- generic 3-card grid as the only structure;
- purple/indigo gradient on white;
- gratuitous glassmorphism or decorative blur;
- shadows with no elevation meaning;
- interchangeable hero → cards → logos → pricing → FAQ → CTA template;
- default Inter-only typography with no hierarchy contrast;
- stock-feeling illustrations replacing real client photography.

Ask: is it better, more coherent, more distinctive, and does it serve the
business goal — or is it just different?

## Portfolio isolation

Inside `/portfolio/<slug>` the client's identity is sovereign. Never import
0WEB `Header`, `Footer`, navigation, palette or copy. Read
`docs/PORTFOLIO_CLIENT_STANDARD.md` and `docs/PORTFOLIO_NEW_CLIENT_PLAYBOOK.md`
first, then run `bun run validate:portfolio-boundaries`.

## Conversion

Every commercial page answers, visually, in under 3 seconds: what it is, for
whom, why trust it, what to do next. The primary action must be the strongest
element in the hierarchy; secondary actions must be visibly secondary.
