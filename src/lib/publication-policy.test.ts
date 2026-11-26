import { describe, expect, test } from "bun:test";
import { PUBLICATION_TARGET, parsePublicationProject, parsePublicationCommits, checkSummary, latestReadyProduction } from "./publication-policy";
import { loadPublicationOverview } from "./publication-admin.server";
import { requireAdmin } from "./admin-access.server";

describe("publicação isolada da 0WEB", () => {
  test("confirma somente o projeto e a equipe autorizados", () => {
    expect(parsePublicationProject({ id: PUBLICATION_TARGET.projectId, name: "zeroweb-2026", accountId: PUBLICATION_TARGET.teamId }).id).toBe("prj_IiJJUu2Rr4vV20tWJ6WaZ7nlr6xv");
    expect(() => parsePublicationProject({ id: PUBLICATION_TARGET.projectId, name: "zeroweb-2026", accountId: "team_other" })).toThrow();
  });
  test("não interpreta jobs ausentes ou somente pulados como aprovação", () => {
    expect(checkSummary([])).toBe("unknown");
    expect(checkSummary([{ name: "Lighthouse", state: "completed", conclusion: "skipped" }])).toBe("unknown");
    expect(checkSummary([{ name: "build", state: "completed", conclusion: "failure" }])).toBe("failed");
    expect(checkSummary([{ name: "build", state: "in_progress", conclusion: null }])).toBe("pending");
    expect(checkSummary([{ name: "build", state: "completed", conclusion: "success" }])).toBe("passed");
  });
  test("READY de preview não é produção e não inventa SHA ausente", () => {
    expect(latestReadyProduction([{ id: "preview", state: "READY", target: "preview", sha: "a".repeat(40), created: 2 }])).toBeNull();
    expect(latestReadyProduction([{ id: "production", state: "READY", target: "production", sha: null, created: 1 }])?.sha).toBeNull();
  });
  test("retorna apenas dados de commits, sem e-mails ou conteúdo completo", () => {
    const [row] = parsePublicationCommits([{ sha: "a".repeat(40), commit: { message: "Primeira linha\nDetalhes privados", committer: { date: null, email: "synthetic@example.invalid" } }, token: "synthetic-private" }]);
    expect(row?.subject).toBe("Primeira linha");
    expect(JSON.stringify(row)).not.toContain("synthetic-private");
    expect(JSON.stringify(row)).not.toContain("synthetic@example.invalid");
  });
  test("erro Vercel não oculta commits e não dispara nenhuma escrita", async () => {
    const methods: string[] = [];
    const request = (async (input: string | URL | Request, init?: RequestInit) => {
      methods.push(init?.method ?? "GET");
      if (String(input).includes("/github/")) return Response.json([{ sha: "a".repeat(40), commit: { message: "Commit real", committer: { date: null } } }]);
      return Response.json({ error: { code: "team_unauthorized", message: "Not authorized" } }, { status: 403 });
    }) as typeof fetch;
    const result = await loadPublicationOverview({ lovableKey: "test-only", githubKey: "test-only", vercelKey: "test-only" }, request);
    expect(result.vercel.state).toBe("error");
    expect(result.vercel.httpStatus).toBe(403);
    expect(result.commits).toHaveLength(1);
    expect(methods).toEqual(["GET", "GET"]);
    expect(JSON.stringify(result)).not.toContain("test-only");
  });
  test("recusa usuário e colaborador, permite somente administradores", async () => {
    const client = (role: string) => ({ from: () => ({ select: () => ({ eq: async () => ({ data: [{ role }], error: null }) }) }) }) as unknown as Parameters<typeof requireAdmin>[0];
    await expect(requireAdmin(client("user"), "synthetic-user")).rejects.toThrow();
    await expect(requireAdmin(client("collaborator"), "synthetic-user")).rejects.toThrow();
    await expect(requireAdmin(client("admin"), "synthetic-user")).resolves.toBeUndefined();
    await expect(requireAdmin(client("super_admin"), "synthetic-user")).resolves.toBeUndefined();
  });
});