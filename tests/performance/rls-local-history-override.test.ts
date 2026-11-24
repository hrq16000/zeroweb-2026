import { createHash } from "node:crypto";
import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

test("six historical funnel seeds remain immutable and only the disposable replay normalizes their tuple shapes", () => {
  const runner = readFileSync("scripts/rls/run-local-history-replay.sh", "utf8");
  const types = readFileSync("src/integrations/supabase/types.ts", "utf8");
  const fixtures = [
    ["supabase/migrations/20260828083427_seed_eletrovale_eletromecanica_funnel.sql", "74d3d57450d1847f647fac1890a0ab8f6a4845c1"],
    ["supabase/migrations/20260828084333_seed_eletro_solucoes_eficazes_funnel.sql", "af7cf865a09ef6211666858ec2fc8f96239a7479"],
    ["supabase/migrations/20260828085118_seed_eisenfer_tubos_acos_funnel.sql", "d0984eb849b3393239858b30b8d0f558f99c1698"],
    ["supabase/migrations/20260828085941_seed_mary_diarista_funnel.sql", "b9abb73004e59d4e4dc5a5a8b738823888ebd48c"],
    ["supabase/migrations/20260828090817_seed_acai_total_araucaria_funnel.sql", "ff6b8425b67cc09e8f1f4f8f5995d4cbff242ee6"],
    ["supabase/migrations/20260828091600_seed_jkl_marcenaria_funnel.sql", "e8d13f96ded1a49d1ec801f9241fbcbc3b9819ee"],
  ] as const;
  for (const [path, expectedBlob] of fixtures) {
    const bytes = readFileSync(path);
    const blobHeader = Buffer.from(\`blob \${bytes.length}\\0\`);
    const actualBlob = createHash("sha1").update(Buffer.concat([blobHeader, bytes])).digest("hex");
    expect(actualBlob).toBe(expectedBlob);
    expect(runner).toContain(path);
    expect(runner).toContain(expectedBlob);
  }
  expect(runner).toContain("def normalize_dynamic_form_question_seed");
  expect(runner).toContain("BLOCKED_LOCAL_OVERRIDE_ROW_ARITY_PROFILE");
  expect(runner).toContain("normalized_7");
  expect(runner).toContain("normalized_8");
  expect(types).toContain("placeholder: string | null");
  expect(types).toContain("hint: string | null");
});

