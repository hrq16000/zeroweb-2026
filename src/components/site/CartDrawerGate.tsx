import { lazy, Suspense, useCallback, useEffect, useState } from "react";

const CartDrawer = lazy(() =>
  import("@/components/site/CartDrawer").then(({ CartDrawer }) => ({ default: CartDrawer })),
);

/**
 * Carrega a interface do carrinho somente após intenção comercial.
 * O primeiro cart-changed também monta o drawer fechado para que o snapshot
 * cart_update seja persistido mesmo quando o visitante não abre o carrinho.
 */
export function CartDrawerGate() {
  const [mounted, setMounted] = useState(false);
  const [pendingOpen, setPendingOpen] = useState(false);

  const onOpen = useCallback(() => {
    setPendingOpen(true);
    setMounted(true);
  }, []);
  const onCartIntent = useCallback(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    window.addEventListener("0web:cart-open", onOpen);
    window.addEventListener("0web:cart-changed", onCartIntent);
    window.addEventListener("storage", onCartIntent);
    return () => {
      window.removeEventListener("0web:cart-open", onOpen);
      window.removeEventListener("0web:cart-changed", onCartIntent);
      window.removeEventListener("storage", onCartIntent);
    };
  }, [onOpen, onCartIntent]);

  const onReady = useCallback(() => {
    if (!pendingOpen) return;
    setPendingOpen(false);
    window.dispatchEvent(new Event("0web:cart-open"));
  }, [pendingOpen]);

  return mounted ? (
    <Suspense fallback={null}>
      <CartDrawer onReady={onReady} />
    </Suspense>
  ) : null;
}
