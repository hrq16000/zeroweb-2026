import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/lib/portfolio-destination-requests.functions.ts", "utf8");

describe("privacidade do histórico de solicitações", () => {
  test("mascara e-mail e telefone antes de persistir e antes de retornar legado", () => {
    expect(source).toContain("[e-mail oculto]");
    expect(source).toMatch(/sent_note:\s*maskContactText\(data\.sent_note/);
    expect(source).toMatch(/response_note:\s*maskContactText\(data\.response_note/);
    expect(source).toMatch(/sent_note:\s*maskContactText\(row\.sent_note\)/);
    expect(source).toMatch(/response_note:\s*maskContactText\(row\.response_note\)/);
  });
});
