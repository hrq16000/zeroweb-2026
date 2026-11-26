import { lazy, Suspense, useCallback, useEffect, useState } from "react";

const CartDrawer = lazy(() =>
  import("@/components/site/CartDrawer").then(({ CartDrawer }) => ({ default: CartDrawer })),
);

/**
 * Loads the cart UI only when a visitor asks to open it. The first open event
 * is replayed after the lazy drawer has installed its listeners, so no click
 * is lost while the chunk downloads.
 */
export function CartDrawerGate() {
  const [mounted, setMounted] = useState(false);
  const [pendingOpen, setPendingOpen] = useState(false);

  const onOpen = useCallback(() => {
    setPendingOpen(true);
    setMounted(true);
  }, []);

  useEffect(() => {
    window.addEventListener("0web:cart-open", onOpen);
    return () => window.removeEventListener("0web:cart-open", onOpen);
  }, [onOpen]);

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
