import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CreditCard, ShieldCheck, LogIn, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { readCart, cartTotal, formatBRL, clearCart, type CartItem } from "@/lib/cart";
import { createOrder, markOrderAssistedHandoff } from "@/lib/orders.functions";
import { createStripeCheckoutSession } from "@/lib/stripe-checkout.functions";
import { getPaymentSettings, type PaymentSettings } from "@/lib/payment-settings.functions";
import { submitPublicLead } from "@/lib/lead-intake.functions";
import { useServerFn } from "@tanstack/react-start";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BrandLogo } from "@/components/site/BrandLogo";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Finalizar pedido · 0WEB" },
      { name: "description", content: "Conclua seu pedido na 0WEB: pague online quando disponível ou finalize com atendimento assistido." },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: "Finalizar pedido · 0WEB" },
      { property: "og:description", content: "Conclua seu pedido na 0WEB com pagamento seguro ou atendimento humano." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://0web.com.br/checkout" },
      { property: "og:site_name", content: "0WEB" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:image", content: "https://0web.com.br/og-default.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Finalizar pedido · 0WEB" },
      { name: "twitter:description", content: "Conclua seu pedido na 0WEB com pagamento seguro ou atendimento humano." },
      { name: "twitter:image", content: "https://0web.com.br/og-default.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://0web.com.br/checkout" }],
  }),
  component: CheckoutPage,
  ssr: false,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const fetchSettings = useServerFn(getPaymentSettings);
  const [items, setItems] = useState<CartItem[]>([]);
  const [session, setSession] = useState<{ email?: string; name?: string } | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [submitting, setSubmitting] = useState<"none" | "stripe" | "assisted">("none");
  const [notes, setNotes] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [settings, setSettings] = useState<PaymentSettings>({
    stripeEnabled: false,
  });
  const total = useMemo(() => cartTotal(items), [items]);
  const hasUnpriced = items.some((i) => !i.price);
  const hasRecurring = items.some((i) => Boolean(i.pricePeriod));

  useEffect(() => {
    setItems(readCart());
    const onChange = () => setItems(readCart());
    window.addEventListener("0web:cart-changed", onChange);
    return () => window.removeEventListener("0web:cart-changed", onChange);
  }, []);

  useEffect(() => {
    void fetchSettings().then(setSettings).catch(() => {});
  }, [fetchSettings]);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setSession({
          email: data.user.email ?? undefined,
          name: (data.user.user_metadata?.full_name as string | undefined) ?? undefined,
        });
        if (data.user.user_metadata?.full_name) setName(data.user.user_metadata.full_name as string);
      }
      setAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s?.user) {
        setSession({
          email: s.user.email ?? undefined,
          name: (s.user.user_metadata?.full_name as string | undefined) ?? undefined,
        });
      } else {
        setSession(null);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleGoogle() {
    setAuthBusy(true);
    const r = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/checkout",
    });
    if (r.error) {
      toast.error("Não foi possível entrar com Google", { description: r.error.message });
      setAuthBusy(false);
    }
  }

  function validateAssistedContact() {
    const cleanName = name.trim();
    const phoneDigits = phone.replace(/\D/g, "");
    if (cleanName.length < 2) {
      toast.error("Informe seu nome", { description: "Precisamos saber com quem falar para continuar o atendimento." });
      return false;
    }
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      toast.error("Informe um WhatsApp válido", { description: "Use DDD + número para conseguirmos retornar sobre o pedido." });
      return false;
    }
    return true;
  }

  async function handleAssistedCheckout() {
    if (items.length === 0) return;
    if (!validateAssistedContact()) return;
    setSubmitting("assisted");
    try {
      // Visitante anônimo: registra a intenção como lead público rate-limited,
      // com snapshot do carrinho. Não exige OAuth para pedir atendimento.
      if (!session) {
        const result = await submitPublicLead({
          data: {
            name: name.trim(),
            phone: phone.replace(/\D/g, ""),
            source: "checkout_assisted",
            landing_page: "/checkout",
            offer_slug: items.length === 1 ? items[0].slug : "carrinho-0web",
            audience_tag: "checkout_assisted",
            payload_json: {
              checkout_mode: "assisted_guest",
              total,
              has_recurring: hasRecurring,
              notes: notes.trim() || null,
              items: items.map(({ slug, name, category, variantId, variantLabel, price, pricePeriod, qty }) => ({
                slug,
                name,
                category: category ?? null,
                variant_id: variantId ?? null,
                variant_label: variantLabel ?? null,
                price: price ?? null,
                price_period: pricePeriod ?? null,
                qty: 1,
              })),
            },
          },
        });
        if (!result.ok) {
          const message =
            result.reason === "rate_limited"
              ? "Muitas tentativas em pouco tempo. Aguarde alguns minutos."
              : "Não conseguimos registrar seu pedido agora.";
          throw new Error(message);
        }
        void import("@/lib/analytics").then(({ trackConversion }) =>
          trackConversion("checkout_assisted_guest", { lead_id: result.leadId, total, items: items.length, location: "checkout" }),
        );
        void import("@/lib/persistence").then(({ persistEvent }) =>
          persistEvent("checkout_assisted_guest", { lead_id: result.leadId, total, items: items.length }),
        );
        clearCart();
        toast.success("Pedido registrado", { description: "Recebemos seus dados e o resumo do carrinho." });
        navigate({ to: "/obrigado", search: { source: "checkout-assisted", lead: result.leadId } });
        return;
      }

      // Cliente autenticado preserva o fluxo completo de pedido na área do cliente.
      const { order } = await createOrder({
        data: {
          items: items.map(({ slug, name, category, variantId, variantLabel, price, pricePeriod, imageUrl, qty }) => ({
            slug, name, category,
            variantId: variantId ?? null,
            variantLabel: variantLabel ?? null,
            price: price ?? null, pricePeriod: pricePeriod ?? null,
            imageUrl: imageUrl ?? null, qty: 1,
          })),
          notes: notes || undefined,
          customerName: name || undefined,
          customerPhone: phone || undefined,
        },
      });
      await markOrderAssistedHandoff({ data: { orderId: order.id } });
      void import("@/lib/analytics").then(({ trackConversion }) =>
        trackConversion("checkout_assisted_handoff", { order_id: order.id, total, items: items.length, location: "checkout" }),
      );
      void import("@/lib/persistence").then(({ persistEvent }) =>
        persistEvent("checkout_assisted_handoff", { order_id: order.id, total, items: items.length }),
      );
      clearCart();
      toast.success("Pedido registrado", { description: "Nossa equipe continuará pelo fluxo de atendimento." });
      navigate({ to: "/obrigado", search: { source: "checkout-assisted", order: order.id } });
    } catch (e) {
      toast.error("Não foi possível registrar o pedido", { description: (e as Error).message });
    } finally {
      setSubmitting("none");
    }
  }

  async function handlePayNow() {
    if (!session) return handleGoogle();
    if (items.length === 0) return;
    // Produtos recorrentes ainda passam pelo atendimento assistido: o checkout
    // Stripe atual é one-time e não deve cobrar uma mensalidade como compra única.
    if (hasRecurring) {
      toast("Plano recorrente", {
        description: "Seu pedido será registrado para ativação assistida e cobrança recorrente correta.",
        duration: 4000,
      });
      return handleAssistedCheckout();
    }
    // Stripe desativado no admin → cai para atendimento assistido, salvando o pedido.
    if (!settings.stripeEnabled) {
      toast("Pagamento online ainda não está ativo", {
        description: "Seu pedido será salvo e seguirá pelo atendimento assistido, sem perder os itens selecionados.",
        duration: 4000,
      });
      return handleAssistedCheckout();
    }
    setSubmitting("stripe");
    try {
      const { order } = await createOrder({
        data: {
          items: items.map(({ slug, name, category, variantId, variantLabel, price, pricePeriod, imageUrl, qty }) => ({
            slug, name, category,
            variantId: variantId ?? null,
            variantLabel: variantLabel ?? null,
            price: price ?? null, pricePeriod: pricePeriod ?? null,
            imageUrl: imageUrl ?? null, qty,
          })),
          notes: notes || undefined,
          customerName: name || undefined,
          customerPhone: phone || undefined,
        },
      });
      void import("@/lib/analytics").then(({ trackConversion }) =>
        trackConversion("checkout_stripe_start", { order_id: order.id, total, items: items.length, location: "checkout" }),
      );
      void import("@/lib/persistence").then(({ persistEvent }) =>
        persistEvent("checkout_stripe_start", { order_id: order.id, total, items: items.length }),
      );
      const res = await createStripeCheckoutSession({
        data: {
          orderId: order.id,
          successUrl: `${window.location.origin}/obrigado?source=checkout-stripe&order=${order.id}`,
          cancelUrl: `${window.location.origin}/checkout`,
        },
      });
      if (!res.enabled || !res.url) {
        toast("Stripe ainda não está conectado", {
          description: "Vamos finalizar pelo atendimento assistido.",
          action: { label: "Atendimento", onClick: () => void handleAssistedCheckout() },
          duration: 6000,
        });
        return;
      }
      clearCart();
      window.location.href = res.url;
    } catch (e) {
      toast.error("Não foi possível iniciar o pagamento", { description: (e as Error).message });
    } finally {
      setSubmitting("none");
    }
  }


  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-4xl px-5 py-10 sm:py-16">
        <button
          onClick={() => navigate({ to: "/servicos" })}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar à loja
        </button>

        <div className="flex items-center gap-3 mb-8">
          <BrandLogo size={40} alt="" priority />
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">Finalizar pedido</h1>
            <p className="text-sm text-muted-foreground">Confirme os itens e finalize com pagamento online ou atendimento assistido.</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <p className="text-muted-foreground">Seu carrinho está vazio.</p>
            <Button className="mt-4" onClick={() => navigate({ to: "/servicos" })}>Ver serviços</Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-8">
            <section className="space-y-6">
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <header className="px-5 py-3 border-b border-border bg-muted/40 text-sm font-semibold">
                  Resumo do pedido ({items.length} {items.length === 1 ? "item" : "itens"})
                </header>
                <ul className="divide-y divide-border">
                  {items.map((i) => (
                    <li key={`${i.slug}::${i.variantId ?? "base"}`} className="px-5 py-4 flex items-center gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold truncate">{i.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {i.category ?? ""}{i.variantLabel ? ` · ${i.variantLabel}` : ""}
                        </p>
                      </div>
                      <span className="tabular-nums text-sm font-semibold">
                        {typeof i.price === "number" && i.price > 0 ? formatBRL(i.price * i.qty) : "Sob consulta"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                <h2 className="font-display font-bold text-lg">Suas informações</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="ck-name">Nome</Label>
                    <Input id="ck-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Como podemos te chamar?" autoComplete="name" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ck-phone">WhatsApp</Label>
                    <Input id="ck-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(41) 99999-9999" inputMode="tel" autoComplete="tel" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ck-notes">Observações (opcional)</Label>
                  <Textarea id="ck-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Conte qualquer detalhe importante do seu projeto." rows={3} />
                </div>
              </div>
            </section>

            <aside className="lg:sticky lg:top-24 self-start space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-elegant">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-2xl font-bold tabular-nums">{formatBRL(total)}</span>
                </div>
                {hasUnpriced && (
                  <p className="text-[11px] text-muted-foreground">* Itens "sob consulta" são orçados durante o atendimento.</p>
                )}
                {hasRecurring && (
                  <p className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-[11px] text-muted-foreground">
                    Este pedido contém plano recorrente. O valor exibido corresponde ao ciclo informado e a ativação será confirmada pelo atendimento assistido.
                  </p>
                )}

                {authReady && !session && (
                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 text-xs text-foreground">
                    O atendimento assistido não exige cadastro. Login Google é necessário apenas para pagamento online e acompanhamento no painel.
                  </div>
                )}

                <div className="grid gap-2">
                  {settings.stripeEnabled && !hasRecurring && (
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={session ? handlePayNow : handleGoogle}
                      disabled={submitting !== "none" || authBusy}
                    >
                      {session ? <CreditCard className="w-4 h-4 mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
                      {authBusy ? "Conectando…" : session ? "Pagar agora" : "Entrar com Google para pagar"}
                    </Button>
                  )}
                  <Button
                    size="lg"
                    variant={settings.stripeEnabled && !hasRecurring ? "outline" : "default"}
                    className="w-full"
                    onClick={handleAssistedCheckout}
                    disabled={submitting !== "none"}
                  >
                    {submitting === "assisted" ? "Registrando…" : "Finalizar com atendimento"}
                  </Button>
                </div>

                <div className="pt-3 border-t border-border flex items-start gap-2 text-[11px] text-muted-foreground">
                  <ShieldCheck className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>Seus dados ficam protegidos. Não compartilhamos com terceiros.</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
