/**
 * ECSPT-inspired OPTIONAL reference parameters for individual 0WEB portfolio pages.
 *
 * DOC: docs/PORTFOLIO_ECSPT_ADDITIVE_REFERENCE_STANDARD.md
 * This file defines inert design vocabulary; it does not activate effects,
 * inject styles, establish a template, or alter existing motion profiles.
 * Each /portfolio/:slug must make an explicit Creative Composition Brief decision.
 * Brand colors, copy, evidence, layout, motion signatures and funnel remain local.
 *
 * These are candidate values supplied in the additive reference brief,
 * NOT measured or verified as the ECSPT site's production implementation.
 */
export const portfolioEcsptOptionalParams = {
  enabled: false,
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.8,
    hero: 1.2,
  },
  easing: {
    easeOut: [0.16, 1, 0.3, 1],
    easeInOut: [0.65, 0, 0.35, 1],
    spring: { type: 'spring', stiffness: 300, damping: 30 },
  },
  delay: {
    none: 0,
    short: 0.1,
    medium: 0.3,
    long: 0.6,
  },
  stagger: {
    tight: 0.05,
    normal: 0.1,
    loose: 0.2,
  },
  distance: {
    sm: 12,
    md: 24,
    lg: 48,
    xl: 80,
  },
  scale: {
    subtle: 1.02,
    normal: 1.05,
    bold: 1.1,
  },
  layoutCandidates: {
    maxWidthPx: [1280, 1440],
    gridColumnsDesktop: 12,
    gridColumnsMobile: 4,
    gapPx: [16, 24, 32],
    sectionGapCss: 'clamp(4rem, 8vw, 8rem)',
    innerSectionGapCss: 'clamp(2rem, 4vw, 4rem)',
  },
  surfaceCandidates: {
    primary: '#0F172A',
    action: '#2563EB',
    accents: ['#0EA5E9', '#10B981'],
    neutrals: ['#FFFFFF', '#F8FAFC'],
    cardRadiusPx: 12,
    progressHeightPx: [2, 3],
  },
  scrollCandidates: {
    parallaxFactor: [0.1, 0.3],
    parallaxDistancePx: [24, 48],
    localHeaderScrolledThresholdPx: 50,
  },
  /** Opt-in decisions only; false deliberately preserves all current pages. */
  capabilities: {
    entrance: false,
    fadeIn: false,
    scaleIn: false,
    staggeredChildren: false,
    parallax: false,
    readingProgress: false,
    localHeaderScroll: false,
    cardHover: false,
    ctaMicrointeraction: false,
    linkUnderline: false,
    routeTransitions: false,
    loadingSkeleton: false,
    logoMarquee: false,
    verifiedCounters: false,
    statusIndicators: false,
  },
} as const;
