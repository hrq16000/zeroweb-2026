import { createHash } from "node:crypto";
import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

test("Eletrovale replay compatibility patch is hash-locked and schema-backed", () => {
  const migration = readFileSync("supabase/migrations/20260828083427_seed_eletrovale_eletromecanica_funnel.sql");
  const runner = readFileSync("scripts/rls/run-local-history-replay.sh", "utf8");
  const types = readFileSync("src/integrations/supabase/types.ts", "utf8");
  expect(createHash("sha256").update(migration).digest("hex")).toBe("87e1e3779ca9be580654cc994f3fbefd2757c7e16b8cbd562346c686ceed73ab");
  expect(runner).toContain('before="(form_id,key,type,label,order_index,required,options_json)"');
  expect(runner).toContain('after="(form_id,key,type,label,placeholder,hint,order_index,required,options_json)"');
  expect(runner).toContain("BLOCKED_LOCAL_OVERRIDE_ROW_CONTEXT_MISMATCH");
  expect(runner.split("overrides.append").length).toBe(2);
  expect(runner).toContain("NULL,NULL,0,false");
  expect(runner).toContain("NULL,NULL,2,true");
  expect(runner).toContain("NULL,7,false");
  expect(types).toContain("placeholder: string | null");
  expect(types).toContain("hint: string | null");
});
