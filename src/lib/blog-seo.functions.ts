/**
 * Ajustes de SEO por artigo do blog (`blog_seo_overrides`).
 *
 * O corpo do artigo continua versionado em `src/lib/blog-data.ts` — é conteúdo
 * editorial, revisado por PR. O que a tela /app/seo edita são as camadas que
 * precisam de iteração rápida contra dados do Search Console: título, meta
 * description e schema JSON-LD adicional. A leitura é pública (as páginas do
 * blog precisam dela no SSR); a escrita exige papel admin/super_admin.
 */
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getSupabasePublicServer } from "@/lib/supabase-public.server";
import { getPost } from "@/lib/blog-data";

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
export type JsonObject = { [key: string]: JsonValue };

export type BlogSeoOverride = {
  slug: string;
  title: string | null;
  description: string | null;
  schemaExtra: JsonObject | null;
  updatedAt: string | null;
};

const TITLE_MIN = 10;
const TITLE_MAX = 120;
const DESC_MIN = 50;
const DESC_MAX = 320;

/** Normaliza a linha do banco, descartando schema com formato inesperado. */
function toOverride(row: {
  slug: string;
  title: string | null;
  description: string | null;
  schema_extra: unknown;
  updated_at: string | null;
}): BlogSeoOverride {
  const schema =
    row.schema_extra && typeof row.schema_extra === "object" && !Array.isArray(row.schema_extra)
      ? (row.schema_extra as JsonObject)
      : null;
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    schemaExtra: schema,
    updatedAt: row.updated_at,
  };
}

/** Leitura pública usada pelas rotas do blog e pelo painel. */
export const listBlogSeoOverrides = createServerFn({ method: "GET" }).handler(
  async (): Promise<BlogSeoOverride[]> => {
    const supabase = getSupabasePublicServer();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("blog_seo_overrides")
      .select("slug,title,description,schema_extra,updated_at");
    if (error) {
      console.error("[blog-seo] falha ao ler overrides:", error.message);
      return [];
    }
    return (data ?? []).map(toOverride);
  },
);

/** Leitura de um único artigo — usada no loader de /blog/$slug. */
export const getBlogSeoOverride = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => {
    const slug = (data as { slug?: unknown })?.slug;
    if (typeof slug !== "string" || !/^[a-z0-9-]{1,120}$/.test(slug)) {
      throw new Error("Slug inválido");
    }
    return { slug };
  })
  .handler(async ({ data }): Promise<BlogSeoOverride | null> => {
    const supabase = getSupabasePublicServer();
    if (!supabase) return null;
    const { data: row, error } = await supabase
      .from("blog_seo_overrides")
      .select("slug,title,description,schema_extra,updated_at")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error || !row) return null;
    return toOverride(row);
  });

type SavePayload = {
  slug: string;
  title: string | null;
  description: string | null;
  schemaExtra: JsonObject | null;
};

/**
 * Valida a entrada antes de gravar. As mesmas regras existem como CHECK no
 * banco; aqui elas devolvem mensagem legível em vez de erro de constraint.
 */
function validate(input: unknown): SavePayload {
  const raw = input as Record<string, unknown> | undefined;
  const slug = raw?.["slug"];
  if (typeof slug !== "string" || !getPost(slug)) {
    throw new Error("Artigo inexistente no cluster.");
  }

  const trim = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const title = trim(raw?.["title"]);
  const description = trim(raw?.["description"]);

  if (title && (title.length < TITLE_MIN || title.length > TITLE_MAX)) {
    throw new Error(`Title deve ter entre ${TITLE_MIN} e ${TITLE_MAX} caracteres.`);
  }
  if (description && (description.length < DESC_MIN || description.length > DESC_MAX)) {
    throw new Error(`Description deve ter entre ${DESC_MIN} e ${DESC_MAX} caracteres.`);
  }

  let schemaExtra: JsonObject | null = null;
  const schemaRaw = raw?.["schemaExtra"];
  if (typeof schemaRaw === "string" && schemaRaw.trim()) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(schemaRaw);
    } catch {
      throw new Error("Schema não é um JSON válido.");
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Schema precisa ser um objeto JSON-LD.");
    }
    const obj = parsed as JsonObject;
    if (obj["@context"] !== "https://schema.org") {
      throw new Error('Schema precisa declarar "@context": "https://schema.org".');
    }
    if (typeof obj["@type"] !== "string" || !obj["@type"]) {
      throw new Error('Schema precisa declarar um "@type" textual.');
    }
    schemaExtra = obj;
  }

  return {
    slug,
    title: title || null,
    description: description || null,
    schemaExtra,
  };
}

/** Grava (upsert) o ajuste. Somente admin/super_admin. */
export const saveBlogSeoOverride = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(validate)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: roles, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    if (roleError) throw new Error("Não foi possível validar suas permissões.");
    const allowed = (roles ?? []).some((r) => r.role === "admin" || r.role === "super_admin");
    if (!allowed) throw new Error("Apenas administradores podem editar o SEO dos artigos.");

    const isEmpty = !data.title && !data.description && !data.schemaExtra;
    if (isEmpty) {
      const { error } = await supabase.from("blog_seo_overrides").delete().eq("slug", data.slug);
      if (error) throw new Error(`Falha ao limpar o ajuste: ${error.message}`);
      return { ok: true as const, cleared: true as const };
    }

    const { error } = await supabase.from("blog_seo_overrides").upsert(
      {
        slug: data.slug,
        title: data.title,
        description: data.description,
        schema_extra: data.schemaExtra,
        updated_by: userId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" },
    );
    if (error) throw new Error(`Falha ao salvar: ${error.message}`);
    return { ok: true as const, cleared: false as const };
  });
