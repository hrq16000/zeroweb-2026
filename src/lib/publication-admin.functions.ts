import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { commitShaSchema } from "./publication-policy";

export const getPublicationOverview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { requireAdmin } = await import("./admin-access.server");
    await requireAdmin(context.supabase, context.userId);
    const { loadPublicationOverview } = await import("./publication-admin.server");
    return loadPublicationOverview({
      lovableKey: process.env["LOVABLE_API_KEY"] ?? "",
      githubKey: process.env["GITHUB_API_KEY"] ?? "",
      vercelKey: process.env["UDC_VERCEL_API_API_KEY"] ?? "",
    });
  });

export const getPublicationChecks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ sha: commitShaSchema }).parse(input))
  .handler(async ({ context, data }) => {
    const { requireAdmin } = await import("./admin-access.server");
    await requireAdmin(context.supabase, context.userId);
    const { loadPublicationChecks } = await import("./publication-admin.server");
    return loadPublicationChecks({
      lovableKey: process.env["LOVABLE_API_KEY"] ?? "",
      githubKey: process.env["GITHUB_API_KEY"] ?? "",
      vercelKey: process.env["UDC_VERCEL_API_API_KEY"] ?? "",
    }, data.sha);
  });