import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { addToCart, getCartSessionKey, openCart, type CartItem } from "@/lib/cart";

type Props = {
  item: Omit<CartItem, "qty" | "addedAt">;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
  className?: string;
};

/**
 * Botão de compra rápida.
 * O carrinho é local e não exige login. Autenticação só aparece quando o
 * visitante escolhe pagamento online ou quer acompanhar pedidos no painel.
 */
export function AddToCartButton({ item, variant = "outline", size = "lg", className }: Props) {
  const [added, setAdded] = useState(false);

  function handleClick() {
    addToCart(item);
    const cartSession = getCartSessionKey();
    // CRO tracking — uma única persistência via trackEvent.
    void import("@/lib/analytics").then(({ trackEvent }) =>
      trackEvent("add_to_cart", {
        cart_session: cartSession,
        service_slug: item.slug,
        slug: item.slug,
        variant_id: item.variantId ?? null,
        price: item.price ?? 0,
        category: item.category ?? "",
      }),
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    toast.success(`${item.name} adicionado`, {
      description: "Clique no carrinho para finalizar.",
      action: { label: "Ver carrinho", onClick: () => openCart() },
      duration: 3500,
    });
  }


  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={className}
      aria-label={`Adicionar ${item.name} ao carrinho`}
    >
      {added ? <Check className="w-4 h-4 mr-2" /> : <ShoppingBag className="w-4 h-4 mr-2" />}
      {added ? "Adicionado" : "Adicionar ao carrinho"}
    </Button>
  );
}