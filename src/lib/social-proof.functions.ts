import { createServerFn } from "@tanstack/react-start";

export type SocialProofItem = {
  id: string;
  name: string;
  action: string;
  time: string;
};

function anonymizeName(raw: string | null): string {
  if (!raw) return "Cliente";
  const parts = raw.trim().split(/\s+/).filter(Boolean);
  const first = parts[0] ?? "";
  if (first.length < 2) return "Cliente";
  const lastInitial =
    parts.length > 1 ? parts[parts.length - 1].charAt(0).toUpperCase() : "";
  return lastInitial ? `${first} ${lastInitial}.` : first;
}

function timeAgo(date: Date): string {
  const diff = Math.max(0, Date.now() - date.getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora há pouco";
  if (mins < 60) return `há ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  return `há ${days}d`;
}

function actionForLead(args: {
  source: string | null;
  offerSlug: string | null;
  serviceName: string | null;
}): string {
  const { source, offerSlug, serviceName } = args;
  if (serviceName) return `solicitou proposta de ${serviceName}`;
  if (offerSlug) return `demonstrou interesse em ${offerSlug.replace(/-/g, " ")}`;
  if (source === "whatsapp") return "iniciou atendimento";
  if (source === "form") return "enviou um diagnóstico";
  if (source === "chatbot") return "interagiu com o assistente";
  return "enviou uma solicitação";
}

/**
 * Prova social factual:
 * - somente eventos persistidos em lead_submissions;
 * - nome apenas quando fornecido pelo próprio visitante, sempre anonimizado;
 * - nenhuma cidade é inferida: lead_submissions não possui cidade canônica;
 * - serviços ativos não são convertidos artificialmente em "contratações";
 * - sem dados reais, retorna lista vazia e a UI não renderiza notificação.
 */
export const getSocialProofFeed = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ items: SocialProofItem[] }> => {
    let supabaseAdmin;
    try {
      ({ supabaseAdmin } = await import("@/integrations/supabase/client.server"));
      void supabaseAdmin.from("services");
    } catch {
      return { items: [] };
    }

    const [leadsRes, servicesRes] = await Promise.all([
      supabaseAdmin
        .from("lead_submissions")
        .select("id, name, source, offer_slug, created_at")
        .order("created_at", { ascending: false })
        .limit(30),
      supabaseAdmin
        .from("services")
        .select("slug, name")
        .eq("is_active", true)
        .limit(100),
    ]);

    const slugToName = new Map<string, string>(
      (servicesRes.data ?? []).map((service) => [service.slug, service.name]),
    );

    const items: SocialProofItem[] = (leadsRes.data ?? []).map((lead) => ({
      id: lead.id,
      name: anonymizeName(lead.name),
      action: actionForLead({
        source: lead.source,
        offerSlug: lead.offer_slug,
        serviceName: lead.offer_slug ? slugToName.get(lead.offer_slug) ?? null : null,
      }),
      time: timeAgo(new Date(lead.created_at)),
    }));

    return { items };
  },
);
