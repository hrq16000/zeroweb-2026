import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

type CheckoutSearch = {
  payment?: "cancelled";
  order_id?: string;
};

const ORDER_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const Route = createFileRoute("/checkout")({
  validateSearch: (raw: Record<string, unknown>): CheckoutSearch => ({
    payment: raw.payment === "cancelled" ? "cancelled" : undefined,
    order_id:
      typeof raw.order_id === "string" && ORDER_ID_RE.test(raw.order_id)
        ? raw.order_id
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Finalizar pedido · 0WEB" },
      { name: "description", content: "Conclua seu pedido na 0WEB: pague online quando disponível ou finalize com atendimento assistido." },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: "Finalizar pedido · 0WEB" },
      { property: "og:description", content: "Conclua seu pedido na 0WEB com pagamento seguro ou atendimento humano." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.0web.com.br/checkout" },
      { property: "og:site_name", content: "0WEB" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:image", content: "https://www.0web.com.br/og-default.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Finalizar pedido · 0WEB" },
      { name: "twitter:description", content: "Conclua seu pedido na 0WEB com pagamento seguro ou atendimento humano." },
      { name: "twitter:image", content: "https://www.0web.com.br/og-default.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://www.0web.com.br/checkout" }],
  }),
  component: lazyRouteComponent(() => import("@/components/route-pages/CheckoutPage"), "CheckoutPage"),
  ssr: false,
});
