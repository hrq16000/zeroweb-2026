// Leitura server-only das páginas locais (SEO regional).
// Usada pelo sitemap e pelas funções públicas de leitura.

export type LocalPagePublicationState = {
  slug: string;
  published: boolean;
};

export type LocalPageRow = {
  slug: string;
  city: string;
  uf: string;
  state: string;
  region: string;
  ddd: string;
  meta_title: string | null;
  meta_description: string | null;
  intro: string | null;
  body: string | null;
  published: boolean;
  updated_at: string;
};

/** Lê apenas páginas publicadas. Falha de leitura preserva o conteúdo do código. */
export async function listPublishedLocalPages(): Promise<LocalPageRow[]> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("local_pages")
      .select("slug,city,uf,state,region,ddd,meta_title,meta_description,intro,body,published,updated_at")
      .eq("published", true)
      .limit(500);
    if (error) throw new Error(error.message);
    return (data ?? []) as LocalPageRow[];
  } catch (error) {
    console.warn("[local-pages] leitura indisponível; usando conteúdo do código", error);
    return [];
  }
}


/** Estado explícito de publicação das páginas locais. Falha preserva o template como publicado. */
export async function listLocalPagePublicationStates(): Promise<LocalPagePublicationState[]> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("local_pages")
      .select("slug,published")
      .limit(500);
    if (error) throw new Error(error.message);
    return (data ?? []).map((row: any) => ({
      slug: String(row.slug),
      published: Boolean(row.published),
    }));
  } catch (error) {
    console.warn("[local-pages] estados de publicação indisponíveis; usando template", error);
    return [];
  }
}

export function localPageIsPublished(
  slug: string,
  states: readonly LocalPagePublicationState[] = [],
) {
  const override = states.find((item) => item.slug === slug);
  return override ? override.published : true;
}
