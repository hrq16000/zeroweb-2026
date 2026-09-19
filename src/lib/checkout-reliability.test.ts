import { describe, expect, test } from "bun:test";
import {
  assistedCheckoutProtocol,
  deterministicCheckoutOrderId,
  readAssistedProtocol,
} from "./checkout-reliability";

describe("checkout reliability helpers", () => {
  test("protocolo assistido é estável por sessão", async () => {
    const a = await assistedCheckoutProtocol("cart_session_123");
    const b = await assistedCheckoutProtocol("cart_session_123");
    const c = await assistedCheckoutProtocol("cart_session_456");
    expect(a).toBe(b);
    expect(a).toMatch(/^0W-[A-F0-9]{10}$/);
    expect(c).not.toBe(a);
  });

  test("pedido autenticado recebe UUID determinístico por usuário + sessão", async () => {
    const a = await deterministicCheckoutOrderId("user-a", "cart_session_123");
    const b = await deterministicCheckoutOrderId("user-a", "cart_session_123");
    const otherSession = await deterministicCheckoutOrderId("user-a", "cart_session_456");
    const otherUser = await deterministicCheckoutOrderId("user-b", "cart_session_123");

    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-8[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(otherSession).not.toBe(a);
    expect(otherUser).not.toBe(a);
  });

  test("só reutiliza protocolo público no formato canônico", () => {
    expect(readAssistedProtocol({ protocol: "0W-ABCDEF1234" })).toBe("0W-ABCDEF1234");
    expect(readAssistedProtocol({ protocol: "interno-ou-invalido" })).toBeNull();
    expect(readAssistedProtocol(null)).toBeNull();
  });
});
