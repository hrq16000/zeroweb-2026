/**
 * Leitura da auditoria de qualidade visual do /portfolio.
 *
 * Fonte: src/config/portfolio-visual-quality.json, gerado por
 * `bun run check:portfolio-visual-quality` (contrato em
 * scripts/portfolio-visual-quality.mjs). Somente leitura no app.
 */
import report from "@/config/portfolio-visual-quality.json";

export type VisualClass = "PREMIUM" | "STANDARD" | "NEEDS_UPGRADE";
export type Severity = "P0" | "P1" | "P2" | "P3";
export type OriginalityState = "PASS" | "WARNING" | "FAIL" | "UNREVIEWED";
export type CoverReview = "APPROVED" | "NEEDS_REVIEW" | "REJECTED" | "UNREVIEWED";

export type VisualIssue = {
  code: string;
  severity: Severity;
  group: string;
  label: string;
  detail: string | null;
};

export type VisualProject = {
  slug: string;
  businessName: string;
  segment: string;
  componentType: string;
  preset: string | null;
  technical: string;
  visual: VisualClass;
  score: number;
  groupScores: Record<string, number>;
  originalityStatus: OriginalityState;
  originalityScore: number | null;
  originalityNearest: string | null;
  contentSimilarity: { slug: string; score: number } | null;
  charm: "HIGH" | "MEDIUM" | "LOW";
  coverReview: CoverReview;
  visuallyReviewed: boolean;
  priority: number;
  severities: Record<Severity, number>;
  assets: {
    logo: { path: string; width?: number | null; height?: number | null } | null;
    cover: { path: string; width?: number | null; height?: number | null } | null;
    social: { path: string; width?: number | null; height?: number | null } | null;
    galleryCount: number;
  };
  runtime: Record<string, number | string | null> | null;
  issues: VisualIssue[];
};

const data = report as unknown as {
  generatedAt: string;
  runtimeGeneratedAt: string | null;
  thresholds: { PREMIUM: number; STANDARD: number };
  weights: Record<string, number>;
  summary: {
    total: number;
    visuallyReviewed: number;
    technical: Record<string, number>;
    visual: Record<VisualClass, number>;
    originality: Record<OriginalityState, number>;
    issues: Record<Severity, number>;
    averageScore: number;
  };
  projects: VisualProject[];
  crossAssets: { hash: string; slugs: string[]; classification: string; usage: { path: string; slug: string; roles: string[] }[] }[];
  contentPairs: { a: string; b: string; score: number }[];
};

export const visualQuality = data;

const bySlug = new Map(data.projects.map((p) => [p.slug, p]));

export function getVisualQuality(slug: string): VisualProject | null {
  return bySlug.get(slug) ?? null;
}

export const VISUAL_BADGE_STYLE: Record<VisualClass, string> = {
  PREMIUM: "bg-primary/15 text-primary",
  STANDARD: "bg-muted text-foreground",
  NEEDS_UPGRADE: "bg-destructive/10 text-destructive",
};

export const SEVERITY_STYLE: Record<Severity, string> = {
  P0: "bg-destructive/15 text-destructive",
  P1: "bg-destructive/10 text-destructive",
  P2: "bg-muted text-foreground",
  P3: "bg-muted/60 text-muted-foreground",
};
