import { createHash } from "node:crypto";
import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

test("Eletrovale replay compatibility patch is hash-locked and schema-backed", () => {
  const migration = readFileSync("supabase/migrations/20260828083427_seed_eletrovale_eletromecanica_funnel.sql");
  const runner = readFileSync("scripts/rls/run-local-history-replay.sh", "utf8");
  const types = readFileSync("src/integrations/supabase/types.ts", "utf8");
  expect(createHash("sha256").update(migration).digest("hex")).toBe("c6719327b862ed6573c8e07ecd876a27bb182865c93185c68d4f0d3d625ca3af");
  expect(runner).toContain('before="(form_id,key,type,label,order_index,required,options_json)"');
  expect(runner).toContain('after="(form_id,key,type,label,placeholder,hint,order_index,required,options_json)"');
  expect(types).toContain("placeholder: string | null");
  expect(types).toContain("hint: string | null");
});
