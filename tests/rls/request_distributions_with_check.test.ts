/**
 * Regressão de segurança — request_distributions.
 *
 * Finding: MISSING_RLS_PROTECTION / request_distributions_update_missing_with_check
 *
 * BEFORE: a policy de UPDATE "dist target update" tinha apenas USING (posse do
 * alvo atual). Um prestador/empresa dono da linha conseguia reatribuir
 * target_id/target_type para um alvo de terceiros, porque os novos valores não
 * eram validados.
 *
 * AFTER: a policy exige WITH CHECK espelhando a checagem de posse contra os
 * novos valores da linha, bloqueando a reatribuição.
 *
 * Este teste é estático (não exige credenciais): garante que a última definição
 * da policy nas migrations mantenha USING e WITH CHECK equivalentes.
 */
import { describe, expect, it } from "bun:test";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const MIGRATIONS_DIR = join(process.cwd(), "supabase", "migrations");
const POLICY = "dist target update";

function lastPolicyDefinition(): string {
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  let last: string | null = null;
  for (const file of files) {
    const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf8");
    const matches = sql.match(
      new RegExp(`CREATE POLICY\\s+"${POLICY}"[\\s\\S]*?;`, "gi"),
    );
    if (matches?.length) last = matches[matches.length - 1]!;
  }
  if (!last) throw new Error(`policy "${POLICY}" não encontrada nas migrations`);
  return last;
}

function ownershipChecks(clause: string) {
  return {
    provider: /target_type\s*=\s*'provider'[\s\S]*?providers\s+p[\s\S]*?p\.id\s*=\s*target_id[\s\S]*?p\.user_id\s*=\s*auth\.uid\(\)/i.test(
      clause,
    ),
    company: /target_type\s*=\s*'company'[\s\S]*?companies\s+c[\s\S]*?c\.id\s*=\s*target_id[\s\S]*?c\.user_id\s*=\s*auth\.uid\(\)/i.test(
      clause,
    ),
  };
}

describe("RLS request_distributions — reatribuição de alvo", () => {
  const definition = lastPolicyDefinition();
  const usingClause = definition.slice(
    definition.toUpperCase().indexOf("USING"),
    definition.toUpperCase().indexOf("WITH CHECK") === -1
      ? definition.length
      : definition.toUpperCase().indexOf("WITH CHECK"),
  );
  const withCheckIndex = definition.toUpperCase().indexOf("WITH CHECK");
  const withCheckClause = withCheckIndex === -1 ? "" : definition.slice(withCheckIndex);

  it("mantém a checagem de posse do alvo atual (USING)", () => {
    const checks = ownershipChecks(usingClause);
    expect(checks.provider).toBe(true);
    expect(checks.company).toBe(true);
  });

  it("bloqueia reatribuição para alvo de terceiros (WITH CHECK obrigatório)", () => {
    expect(withCheckIndex).toBeGreaterThan(-1);
    const checks = ownershipChecks(withCheckClause);
    expect(checks.provider).toBe(true);
    expect(checks.company).toBe(true);
  });
});
