// Índice enxuto para a busca compartilhada de /servicos/*.
// Não carrega conteúdo completo nem assina imagens/galerias: a busca precisa
// apenas de texto suficiente para encontrar e encaminhar o visitante.
import { createServerFn } from "@tanstack/react-start";
import { SERVICES, type ServiceData } from "@/lib/services-data";
import { getSupabasePublicServer } from "@/lib/supabase-public.server";

export type ServiceSearchItem = {
  slug: string;
  name: string;
  category: string;
  description: string;
  keywords: string[];
};

type SearchRow = ServiceSearchItem & {
  display_order: number;
};

const RETIRED_SERVICE_SLUGS = new Set(["site-24h"]);

function asKeywords(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (!item || typeof item !== "object") return "";
      const record = item as Record<string, unknown>;
      return String(record.title ?? record.label ?? record.text ?? "").trim();
    })
    .filter(Boolean);
}

function fallbackSearchItem(service: ServiceData): ServiceSearchItem {
  return {
    slug: service.slug,
    name: service.name,
    category: service.category,
    description: service.description,
    keywords: service.keywords,
  };
}

function staticFallback(): ServiceSearchItem[] {
  return Object.values(SERVICES)
    .filter((service) => !RETIRED_SERVICE_SLUGS.has(service.slug))
    .map(fallbackSearchItem);
}

export const listServicesSearch = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const supabase = getSupabasePublicServer();
    if (!supabase) throw new Error("supabase public client indisponível");

    const { data, error } = await supabase
      .from("services")
      .select("slug,name,category,description,keywords,display_order")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) throw error;

    const rows = (data ?? []) as unknown as SearchRow[];
    const services: ServiceSearchItem[] = rows.map((row) => ({
      slug: row.slug,
      name: row.name,
      category: row.category,
      description: row.description ?? "",
      keywords: asKeywords(row.keywords),
    }));

    // Mantém o mesmo fallback editorial do catálogo completo, sem carregar
    // mídia, FAQ, processo, schema ou outros campos pesados.
    const seen = new Set(services.map((service) => service.slug));
    for (const service of staticFallback()) {
      if (!seen.has(service.slug)) services.push(service);
    }

    return { services };
  } catch (error) {
    console.error("[listServicesSearch] fallback to file", error);
    return { services: staticFallback() };
  }
});
