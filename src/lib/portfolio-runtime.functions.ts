import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  sanitizePortfolioRuntimeRow,
  type PortfolioRuntimeOverrides,
  type PortfolioRuntimeRow,
} from "@/lib/portfolio-runtime";

/**
 * Leitura pública (sem sessão) dos overrides administráveis de um projeto.
 *
 * Só devolve campos já sanitizados por `sanitizePortfolioRuntimeRow`: nada de
 * destinatário de funil, telefone, e-mail ou coluna interna. Qualquer falha
 * devolve `null` para o SSR nunca quebrar a página do cliente.
 */
export const getPortfolioRuntimeOverrides = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z
      .object({ slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9][a-z0-9-]*$/) })
      .parse(data),
  )
  .handler(async ({ data }): Promise<PortfolioRuntimeOverrides | null> => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: row, error } = await supabaseAdmin
        .from("portfolio_client_settings")
        .select(
          [
            "slug",
            "client_key",
            "display_name",
            "seo_title",
            "seo_description",
            "seo_keywords",
            "canonical_url",
            "logo_url",
            "hero_image_url",
            "hero_headline",
            "hero_subheadline",
            "social_image_url",
            "social_version",
            "cta_label",
            "share_copy",
            "gallery",
            "brand_colors",
            "lifecycle_status",
            "published",
            "archived_at",
            "content_version",
          ].join(","),
        )
        .eq("slug", data.slug)
        .maybeSingle();
      if (error || !row) return null;
      return sanitizePortfolioRuntimeRow(data.slug, row as unknown as PortfolioRuntimeRow);
    } catch {
      return null;
    }
  });
