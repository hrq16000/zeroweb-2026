import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { addToCart, getCartSessionKey, openCart, formatBRL } from "@/lib/cart";

export type ServicePurchaseBase = {
  slug: string;
  name: string;
  category?: string;
  variantId?: string | null;
  variantLabel?: string | null;
  price: number; // price > 0 (caller already filtered)
  pricePeriod?: string | null;
  imageUrl?: string | null;
};

/**
 * Painel de compra simplificado para serviços digitais.
 *
 * Serviços são unitários e não têm multiplicação de quantidade.
 * Variantes só existem quando representam opções comerciais reais do mesmo
 * serviço (plano/pacote), identificadas por variantId.
 */
export function ServicePurchasePanel({ item }: { item: ServicePurchaseBase }) {
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart({
      slug: item.slug,
      name: item.name,
      category: item.category,
      variantId: item.variantId ?? null,
      variantLabel: item.variantLabel ?? null,
      price: item.price,
      pricePeriod: item.pricePeriod ?? null,
      imageUrl: item.imageUrl ?? null,
    });
    const cartSession = getCartSessionKey();
    void import("@/lib/analytics").then(({ trackEvent }) =>
      trackEvent("add_to_cart", {
        cart_session: cartSession,
        service_slug: item.slug,
        slug: item.slug,
        variant_id: item.variantId ?? null,
        unit_price: item.price,
        total: item.price,
      }),
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
    toast.success(item.name, {
      description: `${formatBRL(item.price)}${item.pricePeriod ? `/${item.pricePeriod}` : ""} adicionado ao carrinho.`,
      action: { label: "Ver carrinho", onClick: () => openCart() },
      duration: 3800,
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-left max-w-xl mx-auto space-y-5">
      <div>
        <h3 className="font-semibold text-lg">Contratar este serviço</h3>
        <p className="text-sm text-muted-foreground">
          {item.variantLabel ? `${item.variantLabel} · ` : ""}1 contratação por serviço, sem multiplicação de quantidade.
        </p>
      </div>

      <div className="flex items-baseline justify-between pt-1">
        <span className="text-sm text-muted-foreground">Valor</span>
        <span className="text-2xl font-bold tabular-nums">
          {formatBRL(item.price)}
          {item.pricePeriod ? (
            <span className="text-sm font-medium text-muted-foreground">/{item.pricePeriod}</span>
          ) : null}
        </span>
      </div>

      {item.pricePeriod ? (
        <p className="text-xs text-muted-foreground">
          Plano recorrente: a periodicidade e a ativação são confirmadas no checkout assistido.
        </p>
      ) : null}

      <Button size="lg" className="w-full" onClick={handleAdd} aria-label={`Adicionar ${item.name} ao carrinho`}>
        {added ? <Check className="w-4 h-4 mr-2" /> : <ShoppingBag className="w-4 h-4 mr-2" />}
        {added ? "Adicionado" : "Adicionar ao carrinho"}
      </Button>
    </div>
  );
}