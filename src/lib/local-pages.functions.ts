import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { CAPITAIS, getCapital } from "@/lib/capitais";

/**
 * Páginas locais (`/criacao-de-site-institucional/<cidade>`).
 *
 * O conteúdo base vive no código (`src/lib/capitais.ts` + template da rota).
 * A tabela `local_pages` guarda apenas overrides editoriais: meta title,
 * meta description, texto de abertura e um bloco de conteúdo adicional.
 * Assim a página nunca fica vazia se o banco estiver indisponível.
 */
export type LocalPageOverride = {
  slug: string;
  metaTitle: string | null;
  metaDescription: string | null;
  intro: string | null;
  body: string | null;
};

export type LocalPageAdminRow = LocalPageOverride & {
  city: string;
  uf: string;
  published: boolean;
  updatedAt: string | null;
  /** true quando ainda não existe linha no banco (usa só o template). */
  isDefault: boolean;
};

function sanitizeSlug(value: unknown) {
  const slug = String(value ?? "").toLowerCase().replace(/[^a-z-]/g, "").slice(0, 60);
  return getCapital(slug) ? slug : "";
}

function clean(value: unknown, max: number) {
  const text = typeof value === "string" ? value.trim() : "";
  return text ? text.slice(0, max) : null;
}

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: roles } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
  const allowed = (roles ?? []).some((r) => r.role === "admin" || r.role === "super_admin");
  if (!allowed) throw new Error("forbidden");
  return supabaseAdmin;
}

/** Leitura pública (SSR da página local). Retorna null quando não há override. */
export const getLocalPageOverride = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => ({ slug: sanitizeSlug(data?.slug) }))
  .handler(async ({ data }): Promise<LocalPageOverride | null> => {
    if (!data.slug) return null;
    const { listPublishedLocalPages } = await import("@/lib/local-pages.server");
    const rows = await listPublishedLocalPages();
    const row = rows.find((r) => r.slug === data.slug);
    if (!row) return null;
    return {
      slug: row.slug,
      metaTitle: row.meta_title,
      metaDescription: row.meta_description,
      intro: row.intro,
      body: row.body,
    };
  });

/** Lista todas as capitais com o override correspondente (admin). */
export const listLocalPages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<LocalPageAdminRow[]> => {
    const supabaseAdmin = await assertAdmin(context.userId);
    const { data } = await supabaseAdmin
      .from("local_pages")
      .select("slug,meta_title,meta_description,intro,body,published,updated_at")
      .limit(500);
    const overrides = new Map((data ?? []).map((r: any) => [r.slug as string, r]));

    return CAPITAIS.map((capital) => {
      const row = overrides.get(capital.slug);
      return {
        slug: capital.slug,
        city: capital.name,
        uf: capital.uf,
        metaTitle: row?.meta_title ?? null,
        metaDescription: row?.meta_description ?? null,
        intro: row?.intro ?? null,
        body: row?.body ?? null,
        published: row ? Boolean(row.published) : true,
        updatedAt: row?.updated_at ?? null,
        isDefault: !row,
      } satisfies LocalPageAdminRow;
    });
  });

/** Cria/atualiza o override de uma cidade (admin). */
export const saveLocalPage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: {
      slug: string;
      metaTitle?: string;
      metaDescription?: string;
      intro?: string;
      body?: string;
      published?: boolean;
    }) => ({
      slug: sanitizeSlug(data?.slug),
      metaTitle: clean(data?.metaTitle, 120),
      metaDescription: clean(data?.metaDescription, 320),
      intro: clean(data?.intro, 1200),
      body: clean(data?.body, 6000),
      published: data?.published !== false,
    }),
  )
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await assertAdmin(context.userId);
    const capital = getCapital(data.slug);
    if (!capital) throw new Error("cidade inválida");

    const { error } = await supabaseAdmin.from("local_pages").upsert(
      {
        slug: capital.slug,
        city: capital.name,
        uf: capital.uf,
        state: capital.state,
        region: capital.region,
        ddd: capital.ddd,
        meta_title: data.metaTitle,
        meta_description: data.metaDescription,
        intro: data.intro,
        body: data.body,
        published: data.published,
        created_by: context.userId,
      },
      { onConflict: "slug" },
    );
    if (error) throw new Error(error.message);

    await supabaseAdmin.from("audit_logs").insert({
      actor_id: context.userId,
      action: "local_page.save",
      entity: "local_pages",
      entity_id: capital.slug,
    });

    return { ok: true, slug: capital.slug };
  });

/** Remove o override e devolve a cidade ao conteúdo padrão do template. */
export const resetLocalPage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { slug: string }) => ({ slug: sanitizeSlug(data?.slug) }))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await assertAdmin(context.userId);
    if (!data.slug) throw new Error("cidade inválida");
    const { error } = await supabaseAdmin.from("local_pages").delete().eq("slug", data.slug);
    if (error) throw new Error(error.message);
    await supabaseAdmin.from("audit_logs").insert({
      actor_id: context.userId,
      action: "local_page.reset",
      entity: "local_pages",
      entity_id: data.slug,
    });
    return { ok: true };
  });
