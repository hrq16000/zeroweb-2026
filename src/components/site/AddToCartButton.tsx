import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { addToCart, openCart, type CartItem } from "@/lib/cart";

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
    // CRO tracking — captura intenção de compra por serviço
    void import("@/lib/analytics").then(({ trackEvent }) =>
      trackEvent("add_to_cart", { slug: item.slug, variant_id: item.variantId ?? null, name: item.name, price: item.price ?? 0, category: item.category ?? "" }),
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