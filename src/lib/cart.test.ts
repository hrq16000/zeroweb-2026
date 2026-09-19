import { describe, expect, test } from "bun:test";
import { cartItemKey, upsertCartItem, type CartItem } from "./cart";

const base = (overrides: Partial<CartItem> = {}): CartItem => ({
  slug: "seo",
  name: "SEO",
  price: 299,
  qty: 1,
  addedAt: 100,
  ...overrides,
});

describe("carrinho de serviços", () => {
  test("repetir o mesmo serviço atualiza sem multiplicar quantidade", () => {
    const next = upsertCartItem(
      [base({ price: 299 })],
      { slug: "seo", name: "SEO atualizado", price: 349 },
      999,
    );
    expect(next).toHaveLength(1);
    expect(next[0].qty).toBe(1);
    expect(next[0].price).toBe(349);
    expect(next[0].addedAt).toBe(100);
  });

  test("trocar plano substitui a variante anterior do mesmo serviço", () => {
    const next = upsertCartItem(
      [base({ slug: "gestao-redes-sociais", variantId: "essencial", variantLabel: "Essencial" })],
      {
        slug: "gestao-redes-sociais",
        variantId: "profissional",
        variantLabel: "Profissional",
        name: "Gestão de Redes Sociais — Profissional",
        price: 349.9,
        pricePeriod: "mês",
      },
      999,
    );
    expect(next).toHaveLength(1);
    expect(next[0].variantId).toBe("profissional");
    expect(next[0].qty).toBe(1);
    expect(next[0].addedAt).toBe(100);
  });

  test("serviços diferentes convivem no mesmo pedido", () => {
    const next = upsertCartItem(
      [base()],
      { slug: "site-express", name: "Site Express", price: 499 },
      200,
    );
    expect(next).toHaveLength(2);
    expect(next.map((i) => i.slug)).toEqual(["seo", "site-express"]);
  });

  test("chave comercial inclui variantId quando existir", () => {
    expect(cartItemKey({ slug: "gmb", variantId: "pro" })).toBe("gmb::pro");
    expect(cartItemKey({ slug: "gmb", variantId: null })).toBe("gmb");
  });
});
