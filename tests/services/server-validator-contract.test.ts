import { describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { resolve } from "path";

const publicFns = readFileSync(
  resolve(__dirname, "../../src/lib/services-public.functions.ts"),
  "utf8",
);
const crudFns = readFileSync(
  resolve(__dirname, "../../src/lib/services-crud.functions.ts"),
  "utf8",
);

describe("Serviços — TanStack server validators", () => {
  test("domínio de serviços não usa inputValidator depreciado", () => {
    expect(publicFns).not.toContain(".inputValidator(");
    expect(crudFns).not.toContain(".inputValidator(");
  });

  test("validators continuam declarados nos server functions", () => {
    expect((publicFns.match(/\.validator\(/g) ?? []).length).toBeGreaterThanOrEqual(1);
    expect((crudFns.match(/\.validator\(/g) ?? []).length).toBeGreaterThanOrEqual(4);
  });
});
