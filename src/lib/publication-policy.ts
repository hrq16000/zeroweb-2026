import { z } from "zod";

export const PUBLICATION_TARGET = {
  repository: "hrq16000/zeroweb-2026",
  branch: "main",
  teamId: "team_m7IZ2zkytSEOtp2bTsQy0R0A",
  projectId: "prj_IiJJUu2Rr4vV20tWJ6WaZ7nlr6xv",
  projectName: "zeroweb-2026",
  teamName: "msolus",
} as const;

export const commitShaSchema = z.string().regex(/^[a-f0-9]{40}$/);
export type ConnectionStatus = {
  state: "connected" | "unconfigured" | "error";
  httpStatus: number | null;
  code: string;
  message: string;
};
export type PublicationCommit = { sha: string; subject: string; date: string | null; url: string };
export type PublicationDeployment = {
  id: string;
  state: string;
  target: string;
  sha: string | null;
  created: number;
};
export type PublicationOverview = {
  checkedAt: string;
  github: ConnectionStatus;
  vercel: ConnectionStatus;
  deploymentsStatus: ConnectionStatus;
  commits: PublicationCommit[];
  deployments: PublicationDeployment[];
};

export function parsePublicationCommits(value: unknown): PublicationCommit[] {
  const rows = z.array(z.object({
    sha: commitShaSchema,
    commit: z.object({ message: z.string(), committer: z.object({ date: z.string().nullable() }).nullable() }),
  })).parse(value);
  return rows.map(row => ({
    sha: row.sha,
    subject: row.commit.message.split("\n")[0]?.slice(0, 180) ?? "",
    date: row.commit.committer?.date ?? null,
    url: `https://github.com/${PUBLICATION_TARGET.repository}/commit/${row.sha}`,
  }));
}

export function parsePublicationProject(value: unknown) {
  return z.object({
    id: z.literal(PUBLICATION_TARGET.projectId),
    name: z.literal(PUBLICATION_TARGET.projectName),
    accountId: z.literal(PUBLICATION_TARGET.teamId),
  }).parse(value);
}

export function parsePublicationDeployments(value: unknown): PublicationDeployment[] {
  const rows = z.object({ deployments: z.array(z.object({
    uid: z.string(), state: z.string(), target: z.string().nullable().optional(), created: z.number(),
    meta: z.object({ githubCommitSha: commitShaSchema.optional() }).optional(),
  })) }).parse(value);
  return rows.deployments.map(row => ({
    id: row.uid, state: row.state, target: row.target ?? "preview",
    sha: row.meta?.githubCommitSha ?? null, created: row.created,
  }));
}

export type PublicationCheck = { name: string; state: string; conclusion: string | null };
export function parsePublicationChecks(value: unknown): PublicationCheck[] {
  const result = z.object({ check_runs: z.array(z.object({
    name: z.string(), status: z.string(), conclusion: z.string().nullable(),
  })) }).parse(value);
  return result.check_runs.map(row => ({ name: row.name, state: row.status, conclusion: row.conclusion }));
}

export function checkSummary(checks: PublicationCheck[]): "unknown" | "pending" | "failed" | "passed" {
  if (!checks.length || checks.every(check => check.conclusion === "skipped" || check.conclusion === "neutral")) return "unknown";
  if (checks.some(check => check.state === "completed" && check.conclusion !== "success" && check.conclusion !== "skipped" && check.conclusion !== "neutral")) return "failed";
  if (checks.some(check => check.state !== "completed")) return "pending";
  return "passed";
}

export function latestReadyProduction(deployments: PublicationDeployment[]) {
  return deployments.filter(row => row.state === "READY" && row.target === "production")
    .sort((a, b) => b.created - a.created)[0] ?? null;
}