import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { cartItemKey, cartTotal, getCartSessionKey, readCart, type CartItem } from "@/lib/cart";
import { saveCartFunnelStep } from "@/lib/cart-funnel.functions";
import { getVisitorId } from "@/lib/visitor";

const CartDrawer = lazy(() =>
  import("./CartDrawer").then(({ CartDrawer }) => ({ default: CartDrawer })),
);

function persistCartUpdate(items: CartItem[]) {
  if (!items.length) return;
  try {
    const total = cartTotal(items);
    void saveCartFunnelStep({
      data: {
        sessionKey: getCartSessionKey(),
        visitorId: getVisitorId(),
        step: "cart_update" as any,
        cart: items.map((i) => ({
          slug: i.slug,
          name: i.name,
          variantId: i.variantId ?? null,
          variantLabel: i.variantLabel ?? null,
          qty: 1,
          price: i.price ?? null,
          pricePeriod: i.pricePeriod ?? null,
          category: i.category ?? null,
        })),
        totalAmount: total || null,
      },
    } as any).catch(() => {});
  } catch {
    /* noop */
  }
}

export function CartDrawerGate() {
  const [mounted, setMounted] = useState(false);
  const lastSnapshot = useRef("");
  const syncCart = useCallback(() => {
    const items = readCart();
    const signature = JSON.stringify(items.map((i) => [cartItemKey(i), i.price ?? null, i.pricePeriod ?? null]));
    if (signature === lastSnapshot.current) return;
    lastSnapshot.current = signature;
    persistCartUpdate(items);
  }, []);

  useEffect(() => {
    syncCart();
    window.addEventListener("0web:cart-changed", syncCart);
    window.addEventListener("storage", syncCart);
    return () => {
      window.removeEventListener("0web:cart-changed", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, [syncCart]);

  useEffect(() => {
    const open = () => setMounted(true);
    window.addEventListener("0web:cart-open", open);
    return () => window.removeEventListener("0web:cart-open", open);
  }, []);

  if (!mounted) return null;
  return (
    <Suspense fallback={null}>
      <CartDrawer />
    </Suspense>
  );
}
