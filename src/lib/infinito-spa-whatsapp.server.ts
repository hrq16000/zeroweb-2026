import { resolveVersionedPortfolioWhatsApp } from "@/lib/portfolio-whatsapp-registry.server";
import { sanitizeInfinitoSpaMessage } from "@/lib/infinito-spa-whatsapp";

export function handleInfinitoSpaWhatsAppRedirect(request: Request): Response {
  const unavailable = () =>
    new Response("El contacto de Infinito Spa no está disponible temporalmente.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  try {
    const phone = resolveVersionedPortfolioWhatsApp("infinito-spa");
    if (!phone || !/^\d{8,15}$/.test(phone)) return unavailable();
    const raw =
      new URL(request.url).searchParams.get("message") ??
      "Hola, Roze. Quisiera consultar sobre los servicios de Infinito Spa y conocer la disponibilidad.";
    const target = new URL(`https://wa.me/${phone}`);
    target.searchParams.set("text", sanitizeInfinitoSpaMessage(raw));
    return new Response(null, {
      status: 302,
      headers: {
        Location: target.toString(),
        "Cache-Control": "no-store, max-age=0",
        "Referrer-Policy": "no-referrer",
      },
    });
  } catch {
    return unavailable();
  }
}
