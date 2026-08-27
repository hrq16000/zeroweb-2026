---
name: 0web-ui-quality-gates
description: Mandatory pre-ship checklist and verification commands for 0WEB interfaces — states, accessibility, responsiveness, motion, performance and browser evidence. Use before declaring any UI task complete.
---

# 0WEB UI Quality Gates

A UI task is complete only when every applicable box has real evidence.

## 1. States

Every async or interactive surface handles: initial · loading/skeleton ·
empty · success · warning · error · disabled · submitting.

No blank screen, no frozen button, no layout jump, no silent failure.
Skip skeletons where they make the experience worse than instant content.

## 2. Accessibility (WCAG AA target)

- [ ] Semantic HTML; one `h1`; no skipped heading levels
- [ ] Keyboard reachable; visible focus (`focus-visible:ring`)
- [ ] Dialogs: focus trap, ESC, `aria-modal`, labelled title, focus restore
- [ ] Form controls have labels; errors are programmatically associated
- [ ] Text contrast ≥ 4.5:1, UI contrast ≥ 3:1
- [ ] Meaningful `alt`; decorative images `alt=""`
- [ ] Touch targets ≥ 44×44px
- [ ] `prefers-reduced-motion` respected

Reference: `.design-rules/references/hig/accessibility.md`.

## 3. Responsive

Check 360, 393, 430, 768, 1024, 1440, 1920 px:

- [ ] no horizontal overflow
- [ ] readable measure and legible type
- [ ] images crop without cutting faces/subjects (`object-top`, aspect ratios,
      not fixed heights)
- [ ] sticky/floating elements do not cover the primary CTA
- [ ] modals, drawers and tables usable on mobile

## 4. Motion

Animate `transform`/`opacity`. Motion must express causality, continuity,
hierarchy or feedback — never decoration. No artificial delay.

## 5. Performance

- [ ] no large dependency added for a small detail
- [ ] images sized/lazy where below the fold
- [ ] no new hydration mismatch (`bun run validate:ssr-payload`)
- [ ] no request waterfall introduced in loaders
- [ ] avoid unnecessary client components / re-renders

## 6. Privacy and content

- [ ] no `wa.me`, phone or operational e-mail in the client bundle or JSON-LD
- [ ] no invented metrics, reviews, awards or live counters
- [ ] route-level `head()` with unique title/description/OG

## 7. Commands (run, paste real output)

```bash
bun run validate:portfolio-boundaries   # /portfolio changes
bun run validate:portfolio-meta
bun test
bun run build                           # runs privacy + SEO postbuild validators
bun run test:e2e:portfolio-funnels      # funnel changes
```

## 8. Browser evidence

Open the page, wait for render, test mobile viewport, exercise the primary
CTA, read the console. Code reading alone is not verification.
