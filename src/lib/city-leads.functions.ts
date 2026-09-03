import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { CAPITAIS } from "@/lib/capitais";

/**
 * Atendimento por cidade: agrupa os leads captados pelas páginas por capital
 * (e demais formulários) na região correspondente, para a equipe abrir a
 * conversa de WhatsApp lead a lead.
 *
 * Só admin/super_admin acessa e todo acesso fica em `audit_logs`.
 */
export type CityLead = {
  id: string;
  nome: string;
  telefone: string;
  cidade: string;
  cidadeSlug: string;
  origem: string;
  contato_realizado: boolean;
  created_at: string;
};

export type CityBucket = { slug: string; nome: string; uf: string; leads: number; contatados: number };

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: roles } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
  const allowed = (roles ?? []).some((r) => r.role === "admin" || r.role === "super_admin");
  if (!allowed) throw new Error("forbidden");
  return supabaseAdmin;
}

const BY_DDD = new Map(CAPITAIS.map((c) => [c.ddd, c]));
const BY_SLUG = new Map(CAPITAIS.map((c) => [c.slug, c]));

function resolveCity(source: string | null, payload: unknown, phone: string | null) {
  const p = (payload ?? {}) as Record<string, unknown>;
  const cityLabel = typeof p["city"] === "string" ? (p["city"] as string) : "";
  const fromLabel = CAPITAIS.find((c) => cityLabel.toLowerCase().startsWith(c.name.toLowerCase()));
  if (fromLabel) return fromLabel;

  const src = String(source ?? "");
  const match = /institucional-([a-z-]+)/.exec(src);
  if (match?.[1] && BY_SLUG.has(match[1])) return BY_SLUG.get(match[1])!;

  const digits = String(phone ?? "").replace(/\D/g, "");
  const local = digits.startsWith("55") ? digits.slice(2) : digits;
  const ddd = local.slice(0, 2);
  return BY_DDD.get(ddd) ?? null;
}

export const listCityLeads = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { cidade?: string; days?: number } = {}) => ({
    cidade: typeof data?.cidade === "string" && data.cidade !== "all" ? data.cidade.slice(0, 40) : undefined,
    days: Math.min(Math.max(Number(data?.days) || 90, 1), 365),
  }))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await assertAdmin(context.userId);
    const since = new Date(Date.now() - data.days * 86400000).toISOString();

    const [subs, dyn] = await Promise.all([
      supabaseAdmin
        .from("lead_submissions")
        .select("id, created_at, name, phone, source, payload_json")
        .not("phone", "is", null)
        .neq("phone", "")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(500),
      supabaseAdmin
        .from("dynamic_form_leads")
        .select("id, created_at, contact_name, contact_phone, metadata_json, answers_json")
        .not("contact_phone", "is", null)
        .neq("contact_phone", "")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(500),
    ]);

    type Raw = { id: string; created_at: string; nome: string; telefone: string; origem: string; payload: unknown };
    const raw: Raw[] = [
      ...((subs.data ?? []) as any[]).map((r) => ({
        id: r.id as string,
        created_at: r.created_at as string,
        nome: (r.name as string | null)?.trim() || `Lead ${String(r.id).slice(0, 6)}`,
        telefone: String(r.phone),
        origem: String(r.source ?? "site"),
        payload: r.payload_json,
      })),
      ...((dyn.data ?? []) as any[]).map((r) => ({
        id: r.id as string,
        created_at: r.created_at as string,
        nome: (r.contact_name as string | null)?.trim() || `Lead ${String(r.id).slice(0, 6)}`,
        telefone: String(r.contact_phone),
        origem: "funil",
        payload: r.answers_json ?? r.metadata_json,
      })),
    ];

    const ids = raw.map((r) => r.id);
    const contatados = new Set<string>();
    if (ids.length) {
      const { data: tokens } = await supabaseAdmin
        .from("whatsapp_redirect_tokens")
        .select("lead_id, used_at, use_count")
        .in("lead_id", ids);
      for (const t of tokens ?? []) {
        if (t.lead_id && (t.used_at || (t.use_count ?? 0) > 0)) contatados.add(t.lead_id);
      }
    }

    const buckets = new Map<string, CityBucket>();
    let leads: CityLead[] = raw.map((r) => {
      const city = resolveCity(r.origem, r.payload, r.telefone);
      const slug = city?.slug ?? "outras";
      const bucket =
        buckets.get(slug) ??
        ({ slug, nome: city?.name ?? "Outras regiões", uf: city?.uf ?? "—", leads: 0, contatados: 0 } as CityBucket);
      bucket.leads += 1;
      if (contatados.has(r.id)) bucket.contatados += 1;
      buckets.set(slug, bucket);
      return {
        id: r.id,
        nome: r.nome,
        telefone: r.telefone,
        cidade: city ? `${city.name}/${city.uf}` : "Outras regiões",
        cidadeSlug: slug,
        origem: r.origem,
        contato_realizado: contatados.has(r.id),
        created_at: r.created_at,
      };
    });

    if (data.cidade) leads = leads.filter((l) => l.cidadeSlug === data.cidade);
    leads = leads.sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 300);

    await supabaseAdmin.from("audit_logs").insert({
      actor_id: context.userId,
      action: "sensitive.read",
      entity: "lead_submissions",
      entity_id: null,
      meta: { view: "app/atendimento", rows: leads.length } as never,
    });

    return {
      leads,
      cidades: Array.from(buckets.values()).sort((a, b) => b.leads - a.leads),
    };
  });
