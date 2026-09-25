/**
 * Composition planner for Managed /portfolio projects.
 *
 * This is NOT a segment -> template mapper. It composes a project-specific
 * graph from the content/evidence shape plus a stable project seed, generates
 * three materially divergent directions, rejects signature collisions supplied
 * by the persistence layer, and persists the selected graph in source_snapshot.
 *
 * Shared primitives are allowed; the final ordering/topology is project data.
 */

export const MANAGED_COMPOSITION_CONTRACT = 1 as const;

export const MANAGED_COMPOSITION_ROLES = [
  "services",
  "gallery",
  "differentials",
  "steps",
  "about",
  "faq",
  "location",
] as const;
export type ManagedCompositionRole = (typeof MANAGED_COMPOSITION_ROLES)[number];

export const MANAGED_HERO_MODES = [
  "split",
  "poster",
  "stack",
  "center",
  "editorial",
] as const;
export type ManagedHeroMode = (typeof MANAGED_HERO_MODES)[number];

export const MANAGED_HEADER_MODES = ["floating", "inline", "rail"] as const;
export type ManagedHeaderMode = (typeof MANAGED_HEADER_MODES)[number];

export const MANAGED_SERVICE_MODES = ["ledger", "mosaic", "columns", "stack"] as const;
export type ManagedServiceMode = (typeof MANAGED_SERVICE_MODES)[number];

export const MANAGED_GALLERY_MODES = ["masonry", "filmstrip", "editorial"] as const;
export type ManagedGalleryMode = (typeof MANAGED_GALLERY_MODES)[number];

export const MANAGED_STEPS_MODES = ["timeline", "columns", "stack"] as const;
export type ManagedStepsMode = (typeof MANAGED_STEPS_MODES)[number];

export const MANAGED_FAQ_MODES = ["accordion", "columns"] as const;
export type ManagedFaqMode = (typeof MANAGED_FAQ_MODES)[number];

export const MANAGED_CTA_MODES = ["closing-focus", "inline-repeat", "floating"] as const;
export type ManagedCtaMode = (typeof MANAGED_CTA_MODES)[number];

export const MANAGED_DENSITIES = ["compact", "balanced", "spacious"] as const;
export type ManagedDensity = (typeof MANAGED_DENSITIES)[number];

export const MANAGED_RADIUS_MODES = ["sharp", "soft", "round"] as const;
export type ManagedRadiusMode = (typeof MANAGED_RADIUS_MODES)[number];

export const MANAGED_MOBILE_STRATEGIES = [
  "media-first",
  "copy-first",
  "chapter-stack",
] as const;
export type ManagedMobileStrategy = (typeof MANAGED_MOBILE_STRATEGIES)[number];

export type ManagedCompositionFingerprint = {
  heroGeometry: string;
  headerTreatment: string;
  sectionGraph: string;
  contentOrder: string[];
  gridTopology: string;
  mediaDistribution: string;
  backgroundRhythm: string;
  proofPlacement: string;
  ctaDistribution: string;
  navigationPattern: string;
  motionSignature: string;
  closingStructure: string;
  roleGraph: string[];
  mediaCadence: string[];
  interactionLoci: string[];
  decisionAidPlacement: string[];
  densityRhythm: string[];
  mobileCompositionStrategy: string;
};

export type ManagedCompositionDirection = {
  id: string;
  concept: string;
  heroMode: ManagedHeroMode;
  headerMode: ManagedHeaderMode;
  sectionOrder: ManagedCompositionRole[];
  serviceMode: ManagedServiceMode;
  galleryMode: ManagedGalleryMode;
  stepsMode: ManagedStepsMode;
  faqMode: ManagedFaqMode;
  ctaMode: ManagedCtaMode;
  density: ManagedDensity;
  radius: ManagedRadiusMode;
  mobileStrategy: ManagedMobileStrategy;
  mediaDominance: "low" | "balanced" | "high";
  signature: string;
  fingerprint: ManagedCompositionFingerprint;
};

export type ManagedAuthorialCompositionPlan = {
  contract: typeof MANAGED_COMPOSITION_CONTRACT;
  status: "selected";
  basis: string;
  directions: [ManagedCompositionDirection, ManagedCompositionDirection, ManagedCompositionDirection];
  selected: ManagedCompositionDirection;
};

export type ManagedCompositionInput = {
  slug: string;
  displayName: string;
  segment?: string;
  city?: string;
  services?: string[];
  galleryCount?: number;
  hasDifferentials?: boolean;
  hasSteps?: boolean;
  hasAbout?: boolean;
  hasFaq?: boolean;
};

function hash(value: string): number {
  let out = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    out ^= value.charCodeAt(i);
    out = Math.imul(out, 16777619);
  }
  return out >>> 0;
}

function pick<T>(values: readonly T[], seed: number, offset = 0): T {
  return values[(seed + offset) % values.length]!;
}

function rotate<T>(values: readonly T[], amount: number): T[] {
  if (!values.length) return [];
  const offset = ((amount % values.length) + values.length) % values.length;
  return [...values.slice(offset), ...values.slice(0, offset)];
}

function rolesFor(input: ManagedCompositionInput): ManagedCompositionRole[] {
  const roles: ManagedCompositionRole[] = [];
  if ((input.services?.length ?? 0) > 0) roles.push("services");
  if ((input.galleryCount ?? 0) > 0) roles.push("gallery");
  if (input.hasDifferentials) roles.push("differentials");
  if (input.hasSteps) roles.push("steps");
  if (input.hasAbout) roles.push("about");
  if (input.hasFaq) roles.push("faq");
  if (input.city) roles.push("location");
  return roles.length ? roles : ["about"];
}

function divergentOrder(
  roles: ManagedCompositionRole[],
  seed: number,
  variant: number,
): ManagedCompositionRole[] {
  if (roles.length <= 2) return variant === 1 ? [...roles].reverse() : rotate(roles, variant);

  if (variant === 0) return rotate(roles, seed % roles.length);
  if (variant === 1) return rotate([...roles].reverse(), (seed >>> 3) % roles.length);

  const even = roles.filter((_, index) => index % 2 === 0);
  const odd = roles.filter((_, index) => index % 2 === 1).reverse();
  const woven = [...even, ...odd];
  return rotate(woven, (seed >>> 5) % roles.length);
}

function mediaCadence(order: ManagedCompositionRole[], dominance: string): string[] {
  return order.map((role, index) => {
    if (role === "gallery") return `${index + 1}:media-dominant`;
    if (role === "services") return `${index + 1}:offer-${dominance}`;
    if (role === "about") return `${index + 1}:editorial-breath`;
    return `${index + 1}:support`;
  });
}

function makeDirection(
  input: ManagedCompositionInput,
  seed: number,
  variant: 0 | 1 | 2,
): ManagedCompositionDirection {
  const roles = rolesFor(input);
  const order = divergentOrder(roles, seed, variant);
  const heroMode = pick(MANAGED_HERO_MODES, seed, variant * 2);
  const headerMode = pick(MANAGED_HEADER_MODES, seed >>> 2, variant);
  const serviceMode = pick(MANAGED_SERVICE_MODES, seed >>> 4, variant * 3);
  const galleryMode = pick(MANAGED_GALLERY_MODES, seed >>> 6, variant);
  const stepsMode = pick(MANAGED_STEPS_MODES, seed >>> 8, variant * 2);
  const faqMode = pick(MANAGED_FAQ_MODES, seed >>> 10, variant);
  const ctaMode = pick(MANAGED_CTA_MODES, seed >>> 12, variant * 2);
  const density = pick(MANAGED_DENSITIES, seed >>> 14, variant);
  const radius = pick(MANAGED_RADIUS_MODES, seed >>> 16, variant * 2);
  const mobileStrategy = pick(MANAGED_MOBILE_STRATEGIES, seed >>> 18, variant);
  const mediaDominance = pick(["low", "balanced", "high"] as const, seed >>> 20, variant * 2);
  const anchor = input.services?.[variant % Math.max(1, input.services.length)] ||
    input.segment ||
    input.city ||
    input.displayName;

  const conceptVerb = ["mapa editorial", "jornada em capítulos", "vitrine narrativa"][variant];
  const concept = `${input.displayName}: ${conceptVerb} guiado por ${anchor}`;

  const signature = [
    heroMode,
    headerMode,
    order.join(">"),
    serviceMode,
    galleryMode,
    stepsMode,
    faqMode,
    ctaMode,
    density,
    radius,
    mobileStrategy,
    mediaDominance,
  ].join("|");

  const fingerprint: ManagedCompositionFingerprint = {
    heroGeometry: heroMode,
    headerTreatment: headerMode,
    sectionGraph: `hero->${order.join("->")}->close`,
    contentOrder: order,
    gridTopology: `${serviceMode}/${galleryMode}/${stepsMode}`,
    mediaDistribution: `${mediaDominance}:${galleryMode}`,
    backgroundRhythm: `${density}:${radius}`,
    proofPlacement: order.includes("differentials") ? `chapter-${order.indexOf("differentials") + 1}` : "integrated",
    ctaDistribution: ctaMode,
    navigationPattern: headerMode,
    motionSignature: "chapter-reveal-static-safe",
    closingStructure: ctaMode === "closing-focus" ? "single-close" : "distributed-close",
    roleGraph: ["hero", ...order, "conversion-close"],
    mediaCadence: mediaCadence(order, mediaDominance),
    interactionLoci: [
      "hero-cta",
      ...(ctaMode === "inline-repeat" ? ["offer-cta"] : []),
      ...(ctaMode === "floating" ? ["floating-cta"] : []),
      ...(order.includes("faq") ? ["faq-disclosure"] : []),
    ],
    decisionAidPlacement: [
      ...(order.includes("services") ? ["services"] : []),
      ...(order.includes("steps") ? ["steps"] : []),
      ...(order.includes("location") ? ["location"] : []),
    ],
    densityRhythm: [density, order.length > 4 ? "long-form" : "short-form"],
    mobileCompositionStrategy: mobileStrategy,
  };

  return {
    id: `direction-${variant + 1}`,
    concept,
    heroMode,
    headerMode,
    sectionOrder: order,
    serviceMode,
    galleryMode,
    stepsMode,
    faqMode,
    ctaMode,
    density,
    radius,
    mobileStrategy,
    mediaDominance,
    signature,
    fingerprint,
  };
}

function materiallyDivergent(directions: ManagedCompositionDirection[]): boolean {
  if (new Set(directions.map((item) => item.signature)).size !== directions.length) return false;
  const heroCount = new Set(directions.map((item) => item.heroMode)).size;
  const orderCount = new Set(directions.map((item) => item.sectionOrder.join(">"))).size;
  const offerCount = new Set(directions.map((item) => item.serviceMode)).size;
  return heroCount >= 2 && orderCount >= 2 && offerCount >= 2;
}

export function buildManagedAuthorialCompositionPlan(
  input: ManagedCompositionInput,
  usedSignatures: readonly string[] = [],
): ManagedAuthorialCompositionPlan {
  const used = new Set(usedSignatures);
  const basis = [
    input.slug,
    input.displayName,
    input.segment ?? "",
    input.city ?? "",
    ...(input.services ?? []),
    String(input.galleryCount ?? 0),
    input.hasDifferentials ? "diff" : "",
    input.hasSteps ? "steps" : "",
    input.hasAbout ? "about" : "",
    input.hasFaq ? "faq" : "",
  ].join("|");

  for (let salt = 0; salt < 24; salt += 1) {
    const seed = hash(`${basis}|salt:${salt}`);
    const directions = [
      makeDirection(input, seed, 0),
      makeDirection(input, seed ^ 0x9e3779b9, 1),
      makeDirection(input, seed ^ 0x85ebca6b, 2),
    ] as [ManagedCompositionDirection, ManagedCompositionDirection, ManagedCompositionDirection];

    if (!materiallyDivergent(directions)) continue;

    const preferredIndex = seed % directions.length;
    const ranked = rotate(directions, preferredIndex);
    const selected = ranked.find((item) => !used.has(item.signature));
    if (!selected) continue;

    return {
      contract: MANAGED_COMPOSITION_CONTRACT,
      status: "selected",
      basis,
      directions,
      selected,
    };
  }

  throw new Error("Não foi possível gerar composição Managed sem colisão estrutural.");
}

function isEnumValue<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === "string" && (values as readonly string[]).includes(value);
}

function isRoleArray(value: unknown): value is ManagedCompositionRole[] {
  return Array.isArray(value) &&
    value.length > 0 &&
    value.every((role) => isEnumValue(MANAGED_COMPOSITION_ROLES, role)) &&
    new Set(value).size === value.length;
}

function isDirection(value: unknown): value is ManagedCompositionDirection {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const raw = value as Record<string, unknown>;
  return (
    typeof raw.id === "string" &&
    typeof raw.concept === "string" &&
    isEnumValue(MANAGED_HERO_MODES, raw.heroMode) &&
    isEnumValue(MANAGED_HEADER_MODES, raw.headerMode) &&
    isRoleArray(raw.sectionOrder) &&
    isEnumValue(MANAGED_SERVICE_MODES, raw.serviceMode) &&
    isEnumValue(MANAGED_GALLERY_MODES, raw.galleryMode) &&
    isEnumValue(MANAGED_STEPS_MODES, raw.stepsMode) &&
    isEnumValue(MANAGED_FAQ_MODES, raw.faqMode) &&
    isEnumValue(MANAGED_CTA_MODES, raw.ctaMode) &&
    isEnumValue(MANAGED_DENSITIES, raw.density) &&
    isEnumValue(MANAGED_RADIUS_MODES, raw.radius) &&
    isEnumValue(MANAGED_MOBILE_STRATEGIES, raw.mobileStrategy) &&
    ["low", "balanced", "high"].includes(String(raw.mediaDominance ?? "")) &&
    typeof raw.signature === "string" &&
    raw.signature.length > 10 &&
    Boolean(raw.fingerprint && typeof raw.fingerprint === "object")
  );
}

export function sanitizeManagedAuthorialCompositionPlan(
  value: unknown,
): ManagedAuthorialCompositionPlan | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const raw = value as Record<string, unknown>;
  if (raw.contract !== MANAGED_COMPOSITION_CONTRACT || raw.status !== "selected") return null;
  if (typeof raw.basis !== "string" || !Array.isArray(raw.directions) || raw.directions.length !== 3) {
    return null;
  }
  if (!raw.directions.every(isDirection) || !isDirection(raw.selected)) return null;
  const signatures = raw.directions.map((item) => item.signature);
  if (new Set(signatures).size !== 3 || !signatures.includes(raw.selected.signature)) return null;
  if (!materiallyDivergent(raw.directions)) return null;
  return raw as ManagedAuthorialCompositionPlan;
}

export function managedCompositionSignature(value: unknown): string | null {
  return sanitizeManagedAuthorialCompositionPlan(value)?.selected.signature ?? null;
}
