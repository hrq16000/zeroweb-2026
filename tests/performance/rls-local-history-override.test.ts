import { createHash } from "node:crypto";
import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

test("historical funnel seeds remain immutable and only disposable replay normalizes their schema shapes", () => {
  const runner = readFileSync("scripts/rls/run-local-history-replay.sh", "utf8");
  const types = readFileSync("src/integrations/supabase/types.ts", "utf8");
  const fixtures = [
    ["supabase/migrations/20260828083427_seed_eletrovale_eletromecanica_funnel.sql", "74d3d57450d1847f647fac1890a0ab8f6a4845c1"],
    ["supabase/migrations/20260828084333_seed_eletro_solucoes_eficazes_funnel.sql", "af7cf865a09ef6211666858ec2fc8f96239a7479"],
    ["supabase/migrations/20260828085118_seed_eisenfer_tubos_acos_funnel.sql", "d0984eb849b3393239858b30b8d0f558f99c1698"],
    ["supabase/migrations/20260828085941_seed_mary_diarista_funnel.sql", "b9abb73004e59d4e4dc5a5a8b738823888ebd48c"],
    ["supabase/migrations/20260828090817_seed_acai_total_araucaria_funnel.sql", "ff6b8425b67cc09e8f1f4f8f5995d4cbff242ee6"],
    ["supabase/migrations/20260828091600_seed_jkl_marcenaria_funnel.sql", "e8d13f96ded1a49d1ec801f9241fbcbc3b9819ee"],
    ["supabase/migrations/20260901194230_seed_ton_e_cor_funnel.sql", "6385195058b66581494c9d2d04a83805a1f88375"],
    ["supabase/migrations/20260901200424_seed_raphael_construcoes_funnel.sql", "fe3f3efe5b7ad707bc2cf960983bdcdd0e5c7804"],
    ["supabase/migrations/20260902004904_seed_jc_revestimentos_funnel.sql", "901be15ede8c1c27d0ece0f1990dc759a850dd5a"],
    ["supabase/migrations/20260906190903_seed_mania_de_limpeza_funnel.sql", "6f582f719f6f4bbd54dcc690dab82389bd5e51fb"],
    ["supabase/migrations/20260906194009_seed_dona_lucy_salgados_funnel.sql", "4123146537ada970b7259888da0953be4548043f"],
  ] as const;
  for (const [path, expectedBlob] of fixtures) {
    const bytes = readFileSync(path);
    const blobHeader = Buffer.from("blob " + bytes.length + "\0");
    const actualBlob = createHash("sha1").update(Buffer.concat([blobHeader, bytes])).digest("hex");
    expect(actualBlob).toBe(expectedBlob);
    expect(runner).toContain(path);
    expect(runner).toContain(expectedBlob);
  }
  expect(runner).toContain("def normalize_dynamic_form_question_seed");
  expect(runner).toContain("legacy_step_order_seed");
  expect(runner).toContain("legacy_dynamic_form_id_seed");
  expect(runner).toContain("BLOCKED_LOCAL_LEGACY_STEP_COLUMN_COUNT");
  expect(runner).toContain("BLOCKED_LOCAL_LEGACY_FORM_COLUMN_COUNT");
  expect(runner).toContain("BLOCKED_LOCAL_OVERRIDE_ROW_ARITY_PROFILE");
  expect(runner).toContain("normalized_7");
  expect(runner).toContain("normalized_8");
  expect(types).toContain("placeholder: string | null");
  expect(types).toContain("hint: string | null");
});

