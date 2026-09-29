import { describe, expect, test } from "bun:test";

import { extractOpenAIText } from "@/lib/openai-gateway.helpers";

describe("extractOpenAIText", () => {
  test("prefere output_text quando disponível", () => {
    expect(extractOpenAIText({ output_text: " resposta pronta " })).toBe("resposta pronta");
  });

  test("extrai blocos output_text da resposta", () => {
    expect(
      extractOpenAIText({
        output: [
          {
            type: "message",
            content: [
              { type: "output_text", text: "Primeiro" },
              { type: "output_text", text: "Segundo" },
            ],
          },
        ],
      }),
    ).toBe("Primeiro\nSegundo");
  });

  test("ignora conteúdo sem texto", () => {
    expect(
      extractOpenAIText({
        output: [{ type: "message", content: [{ type: "refusal" }] }],
      }),
    ).toBe("");
  });
});
