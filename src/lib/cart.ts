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

export function addToCart(item: Omit<CartItem, "qty" | "addedAt">, opts: AddOptions = {}) {
  const list = readCart();
  const key = cartItemKey(item);
  const existing = list.find((i) => cartItemKey(i) === key);
  if (existing) {
    // /servicos vende serviços, não unidades físicas. Repetir o clique atualiza
    // o snapshot do produto sem multiplicar preço/quantidade.
    Object.assign(existing, item, { qty: 1 });
  } else {
    // Planos diferentes do MESMO serviço são alternativas, não itens cumulativos:
    // escolher outra variante substitui a anterior e preserva 1 item por serviço.
    const sameServiceIndex = item.variantId ? list.findIndex((i) => i.slug === item.slug) : -1;
    if (sameServiceIndex >= 0) {
      const previous = list[sameServiceIndex];
      list[sameServiceIndex] = { ...item, qty: 1, addedAt: previous.addedAt };
    } else {
      list.push({ ...item, qty: 1, addedAt: Date.now() });
    }
  }
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
