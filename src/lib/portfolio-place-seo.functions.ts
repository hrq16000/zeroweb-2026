import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  portfolioPlaceHubs,
  findPortfolioPlaceHub,
  type PortfolioPlaceHub,
} from "@/lib/portfolio-places";

/**
 * SEO editorial das páginas regionais do portfólio (`/portfolio-em/<local>`).
 *
 * O conteúdo padrão continua sendo derivado do catálogo versionado. A tabela
 * `portfolio_place_seo` guarda apenas overrides: meta title, meta description,
 * texto de abertura e os campos do schema LocalBusiness. Se o banco estiver
 * indisponível, a página segue funcionando com o conteúdo do código.
 */
export type PortfolioPlaceLocalBusiness = {
  name: string | null;
  description: string | null;
  areaServed: string | null;
  telephone: string | null;
  priceRange: string | null;
};

export type PortfolioPlaceSeoOverride = {
  slug: string;
  metaTitle: string | null;
  metaDescription: string | null;
  intro: string | null;
  localBusiness: PortfolioPlaceLocalBusiness | null;
};

export type PortfolioPlaceSeoRow = PortfolioPlaceSeoOverride & {
  label: string;
  kind: "city" | "neighborhood";
  city: string;
  state: string;
  projects: number;
  published: boolean;
  updatedAt: string | null;
  isDefault: boolean;
};

function sanitizeSlug(value: unknown) {
  const slug = String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 80);
  return findPortfolioPlaceHub(slug) ? slug : "";
}

function clean(value: unknown, max: number) {
  const text = typeof value === "string" ? value.trim() : "";
  return text ? text.slice(0, max) : null;
}

function normalizeLocalBusiness(value: unknown): PortfolioPlaceLocalBusiness | null {
  const raw = (value ?? {}) as Record<string, unknown>;
  const next: PortfolioPlaceLocalBusiness = {
    name: clean(raw.name, 120),
    description: clean(raw.description, 400),
    areaServed: clean(raw.areaServed, 160),
    telephone: clean(raw.telephone, 40),
    priceRange: clean(raw.priceRange, 20),
  };
  return Object.values(next).some(Boolean) ? next : null;
}

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: roles } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
  const allowed = (roles ?? []).some((r) => r.role === "admin" || r.role === "super_admin");
  if (!allowed) throw new Error("forbidden");
  return supabaseAdmin;
}

function toOverride(row: any): PortfolioPlaceSeoOverride {
  return {
    slug: row.slug,
    metaTitle: row.meta_title ?? null,
    metaDescription: row.meta_description ?? null,
    intro: row.intro ?? null,
    localBusiness: normalizeLocalBusiness(row.local_business),
  };
}

/** Leitura pública usada no SSR da página regional. Nunca lança. */
export const getPortfolioPlaceSeo = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => ({ slug: sanitizeSlug(data?.slug) }))
  .handler(async ({ data }): Promise<PortfolioPlaceSeoOverride | null> => {
    if (!data.slug) return null;
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: row, error } = await supabaseAdmin
        .from("portfolio_place_seo")
        .select("slug,meta_title,meta_description,intro,local_business,published")
        .eq("slug", data.slug)
        .eq("published", true)
        .maybeSingle();
      if (error || !row) return null;
      return toOverride(row);
    } catch (error) {
      console.warn("[portfolio-place-seo] leitura indisponível; usando conteúdo do código", error);
      return null;
    }
  });

/** Lista todos os hubs regionais com o override correspondente (admin). */
export const listPortfolioPlaceSeo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PortfolioPlaceSeoRow[]> => {
    const supabaseAdmin = await assertAdmin(context.userId);
    const { data } = await supabaseAdmin
      .from("portfolio_place_seo")
      .select("slug,meta_title,meta_description,intro,local_business,published,updated_at")
      .limit(1000);
    const overrides = new Map((data ?? []).map((r: any) => [r.slug as string, r]));

    return portfolioPlaceHubs().map((hub: PortfolioPlaceHub) => {
      const row = overrides.get(hub.slug);
      return {
        slug: hub.slug,
        label: hub.label,
        kind: hub.kind,
        city: hub.city,
        state: hub.state,
        projects: hub.projects.length,
        metaTitle: row?.meta_title ?? null,
        metaDescription: row?.meta_description ?? null,
        intro: row?.intro ?? null,
        localBusiness: row ? normalizeLocalBusiness(row.local_business) : null,
        published: row ? Boolean(row.published) : true,
        updatedAt: row?.updated_at ?? null,
        isDefault: !row,
      } satisfies PortfolioPlaceSeoRow;
    });
  });

/** Cria/atualiza o override de um hub regional (admin). */
export const savePortfolioPlaceSeo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: {
      slug: string;
      metaTitle?: string;
      metaDescription?: string;
      intro?: string;
      localBusiness?: Partial<PortfolioPlaceLocalBusiness>;
      published?: boolean;
    }) => ({
      slug: sanitizeSlug(data?.slug),
      metaTitle: clean(data?.metaTitle, 120),
      metaDescription: clean(data?.metaDescription, 320),
      intro: clean(data?.intro, 1200),
      localBusiness: normalizeLocalBusiness(data?.localBusiness),
      published: data?.published !== false,
    }),
  )
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await assertAdmin(context.userId);
    if (!data.slug) throw new Error("local inválido");

    const { error } = await supabaseAdmin.from("portfolio_place_seo").upsert(
      {
        slug: data.slug,
        meta_title: data.metaTitle,
        meta_description: data.metaDescription,
        intro: data.intro,
        local_business: data.localBusiness,
        published: data.published,
        created_by: context.userId,
      },
      { onConflict: "slug" },
    );
    if (error) throw new Error(error.message);

    await supabaseAdmin.from("audit_logs").insert({
      actor_id: context.userId,
      action: "portfolio_place_seo.save",
      entity: "portfolio_place_seo",
      entity_id: data.slug,
    });

    return { ok: true, slug: data.slug };
  });

/** Remove o override e devolve o local ao conteúdo padrão do catálogo. */
export const resetPortfolioPlaceSeo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { slug: string }) => ({ slug: sanitizeSlug(data?.slug) }))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await assertAdmin(context.userId);
    if (!data.slug) throw new Error("local inválido");
    const { error } = await supabaseAdmin.from("portfolio_place_seo").delete().eq("slug", data.slug);
    if (error) throw new Error(error.message);
    await supabaseAdmin.from("audit_logs").insert({
      actor_id: context.userId,
      action: "portfolio_place_seo.reset",
      entity: "portfolio_place_seo",
      entity_id: data.slug,
    });
    return { ok: true };
  });
