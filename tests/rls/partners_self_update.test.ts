import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";

/**
 * Regressão: um parceiro nunca pode aprovar a própria conta.
 * Defesa em profundidade — policy com coluna travada + trigger.
 */
const dir = "supabase/migrations";
const all = readdirSync(dir)
  .filter((f) => f.endsWith(".sql"))
  .map((f) => readFileSync(`${dir}/${f}`, "utf8"))
  .join("\n");

describe("segurança: parceiros", () => {
  it("a policy de update do próprio cadastro trava status/aprovação", () => {
    expect(all).toContain("partners_self_update_is_safe");
    expect(all).toContain("partners_self_update_safe_columns");
    expect(all).toMatch(/p\.status IS NOT DISTINCT FROM _status/);
    expect(all).toMatch(/p\.approved_by IS NOT DISTINCT FROM _approved_by/);
  });

  it("a policy antiga permissiva foi removida", () => {
    expect(all).toContain('DROP POLICY IF EXISTS "partners_self_update"');
  });

  it("o trigger de guarda continua existindo", () => {
    expect(all).toContain("partners_guard_privileged_columns");
  });

  it("a função de verificação não é executável por visitantes anônimos", () => {
    expect(all).toMatch(/REVOKE ALL ON FUNCTION public\.partners_self_update_is_safe[\s\S]*anon/);
  });
});
