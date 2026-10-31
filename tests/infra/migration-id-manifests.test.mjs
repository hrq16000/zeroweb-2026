import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { REQUIRED, parseManifest, compareManifests } from "../../scripts/compare-migration-id-manifests.mjs";

const empty = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
const fixture = () => ({ tables: REQUIRED.map((table, i) => ({
  table, count: i === 1 ? 2393 : 0,
  sha256_of_sorted_ids_only: i === 1 ? "a".repeat(64) : empty,
})) });

describe("Paridade offline de IDs da migração 0WEB", () => {
  it("aceita manifestos idênticos mesmo com nomes de campo do SQL", () => {
    const source = fixture();
    const restored = source.tables.map(x => ({ table_key: x.table, row_count: String(x.count), id_set_sha256: x.sha256_of_sorted_ids_only }));
    const result = compareManifests(source, restored);
    assert.equal(result.ok, true);
    assert.equal(result.matchingTables, REQUIRED.length);
  });
  it("reprova perda de leads, sem imprimir os hashes", () => {
    const source = fixture(), dest = fixture();
    dest.tables[1].count--;
    const r = compareManifests(source, dest);
    assert.equal(r.ok, false);
    assert.deepEqual(r.rows.filter(x=>x.status==="DIFF").map(x=>x.table), ["public.dynamic_form_leads"]);
    assert.equal(JSON.stringify(r).includes("a".repeat(64)), false);
  });
  it("reprova troca de IDs mesmo com contagem igual", () => {
    const source = fixture(), dest = fixture();
    dest.tables[1].sha256_of_sorted_ids_only = "b".repeat(64);
    const r = compareManifests(source, dest);
    assert.equal(r.ok, false);
    assert.equal(r.rows[1].countMatches, true);
    assert.equal(r.rows[1].idsMatch, false);
  });
  it("reprova manifesto incompleto, duplicado ou hash inválido", () => {
    const x = fixture();
    assert.throws(() => parseManifest({ tables: x.tables.slice(1) }), /obrigatória/);
    assert.throws(() => parseManifest({ tables: [...x.tables, x.tables[0]] }), /duplicada/);
    x.tables[1].sha256_of_sorted_ids_only = "INVALID";
    assert.throws(() => parseManifest(x), /SHA-256/);
  });
});
