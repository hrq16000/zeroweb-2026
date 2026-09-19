/**
 * Carrinho híbrido (Onda 2 da loja).
 * - Persistência: localStorage ("0web_cart").
 * - Eventos: "0web:cart-changed" (atualização) e "0web:cart-open" (abrir drawer).
 * - Sem dependência de login. A migração para uma tabela `cart_items`
 *   acontece na Onda 3 (checkout + login Google), quando os itens do
 *   localStorage são "drenados" para o usuário autenticado.
 *
 * Regra híbrida: ao chegar no 2º item distinto, disparamos um toast/CTA
 * de login (não-bloqueante) através do callback `onLoginNudge`.
 */
const KEY = "0web_cart";

export type CartItem = {
  slug: string;
  name: string;
  category?: string;
  /** Variação comercial dentro do mesmo serviço (plano/pacote). */
  variantId?: string | null;
  variantLabel?: string | null;
  price?: number | null;
  pricePeriod?: string | null;
  imageUrl?: string | null;
  qty: number;
  addedAt: number;
};

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function readCart(): CartItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((i) => i && typeof i.slug === "string") : [];
  } catch {
    return [];
  }
}

export function cartItemKey(item: Pick<CartItem, "slug" | "variantId">) {
  return item.variantId ? `${item.slug}::${item.variantId}` : item.slug;
}

function writeCart(items: CartItem[]) {
  if (!isBrowser()) return;
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("0web:cart-changed"));
}

export function cartCount(items?: CartItem[]) {
  const list = items ?? readCart();
  return list.reduce((s, i) => s + (i.qty || 1), 0);
}

export function distinctCount(items?: CartItem[]) {
  return (items ?? readCart()).length;
}

export type AddOptions = { onLoginNudge?: (distinctAfter: number) => void };
export type NewCartItem = Omit<CartItem, "qty" | "addedAt">;

/**
 * Regra pura do carrinho de serviços:
 * - repetir o mesmo item atualiza o snapshot;
 * - escolher outra variante do mesmo serviço substitui a anterior;
 * - serviços diferentes convivem no mesmo pedido;
 * - quantidade permanece sempre 1.
 */
export function upsertCartItem(
  current: CartItem[],
  item: NewCartItem,
  addedAt = Date.now(),
): CartItem[] {
  const list = current.map((i) => ({ ...i }));
  const key = cartItemKey(item);
  const exactIndex = list.findIndex((i) => cartItemKey(i) === key);

  if (exactIndex >= 0) {
    list[exactIndex] = { ...list[exactIndex], ...item, qty: 1 };
    return list;
  }

  if (item.variantId) {
    const sameServiceIndex = list.findIndex((i) => i.slug === item.slug);
    if (sameServiceIndex >= 0) {
      const previous = list[sameServiceIndex];
      list[sameServiceIndex] = { ...item, qty: 1, addedAt: previous.addedAt };
      return list;
    }
  }

  return [...list, { ...item, qty: 1, addedAt }];
}

export function addToCart(item: NewCartItem, opts: AddOptions = {}) {
  const list = upsertCartItem(readCart(), item);
  writeCart(list);
  const distinct = list.length;
  // Híbrido: a partir do 2º item distinto, sugere login Google.
  if (distinct >= 2) opts.onLoginNudge?.(distinct);
  return list;
}

export function removeFromCart(key: string) {
  writeCart(readCart().filter((i) => cartItemKey(i) !== key));
}

export function setQty(key: string, qty: number) {
  // Compatibilidade defensiva com chamadas antigas. Serviços permanecem
  // unitários; qty <= 0 remove o item.
  if (qty <= 0) {
    removeFromCart(key);
    return;
  }
  writeCart(readCart().map((i) => (cartItemKey(i) === key ? { ...i, qty: 1 } : i)));
}

export function clearCart() {
  writeCart([]);
}

export function openCart() {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent("0web:cart-open"));
}

export function cartTotal(items?: CartItem[]) {
  return (items ?? readCart()).reduce((sum, i) => {
    const p = typeof i.price === "number" ? i.price : 0;
    return sum + p * (i.qty || 1);
  }, 0);
}

export function formatBRL(v: number | null | undefined) {
  if (v == null) return "—";
  if (v === 0) return "Sob consulta";
  return `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;
}
