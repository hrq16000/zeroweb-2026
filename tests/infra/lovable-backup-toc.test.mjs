import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { inspectToc, REQUIRED_PUBLIC_TABLES } from "../../scripts/inspect-lovable-backup-toc.mjs";

const line = (id, kind, schema, name) =>
  `${id}; 1259 ${16000 + id} ${kind} ${schema} ${name} postgres`;
const toc = () => {
  let id = 1;
  const rows = ["; PostgreSQL database dump", ...["public", "auth", "storage"].map(s => line(id++, "SCHEMA", "-", s))];
  for (const name of REQUIRED_PUBLIC_TABLES) {
    rows.push(line(id++, "TABLE", "public", name));
    rows.push(line(id++, "TABLE DATA", "public", name));
  }
  for (const [schema, name] of [["auth","users"],["storage","buckets"],["storage","objects"]]) {
    rows.push(line(id++, "TABLE", schema, name));
    rows.push(line(id++, "TABLE DATA", schema, name));
  }
  rows.push(line(id++, "FUNCTION", "public", "check_and_record_rate_limit(text)"));
  rows.push(line(id++, "POLICY", "public", "projects"));
  return rows;
};

describe("Auditoria offline do índice PostgreSQL Lovable", () => {
  it("encontra todas as tabelas exigidas sem ler registros", () => {
    const report = inspectToc(toc().join("\n"));
    assert.equal(report.ok, true);
    assert.equal(report.tableCount, 12);
    assert.equal(report.tableDataEntries, 12);
    assert.deepEqual(report.missingManagedTables, []);
    assert.deepEqual(report.missingDataEntries, []);
    assert.equal(report.countByType.FUNCTION, 1);
  });
  it("bloqueia archive incompleto sem aceitar ausência de dados auth", () => {
    const rows = toc().filter(x=> !x.includes("TABLE DATA auth users") && !x.includes("TABLE public lead_submissions"));
    const report = inspectToc(rows.join("\n"));
    assert.equal(report.ok, false);
    assert.deepEqual(report.missingManagedDataEntries, ["auth.users"]);
    assert.deepEqual(report.missingPublicTables, ["lead_submissions"]);
  });
  it("não aceita texto vazio ou relatório inválido como backup", () => {
    assert.equal(inspectToc("not a backup").ok, false);
    assert.equal(inspectToc("; comment").ok, false);
  });
});
