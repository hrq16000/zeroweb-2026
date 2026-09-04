import { createFileRoute } from "@tanstack/react-router";

/**
 * Serve assets enviados pelo admin do portfólio.
 *
 * O bucket é privado: nada é exposto sem passar por aqui. Só entregamos
 * imagens (content-type verificado no upload) e nunca listamos o bucket.
 */
export const Route = createFileRoute("/api/public/portfolio-asset/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const objectPath = String((params as Record<string, string>)._splat ?? "");
        if (!objectPath || objectPath.includes("..") || !/^[A-Za-z0-9/_.-]+$/.test(objectPath)) {
          return new Response("Not found", { status: 404 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage
          .from("portfolio-admin")
          .download(objectPath);
        if (error || !data) return new Response("Not found", { status: 404 });

        const type = data.type && data.type.startsWith("image/") ? data.type : "image/webp";
        return new Response(await data.arrayBuffer(), {
          headers: {
            "content-type": type,
            "cache-control": "public, max-age=3600, s-maxage=86400",
            "x-content-type-options": "nosniff",
          },
        });
      },
    },
  },
});
