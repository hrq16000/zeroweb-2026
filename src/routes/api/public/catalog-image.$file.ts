import { createFileRoute } from "@tanstack/react-router";

/**
 * Proxy público e cacheável para as capas do catálogo `/servicos`.
 *
 * URL: /api/public/catalog-image/<file>
 *
 * O bucket `service-images` é privado por política de workspace, então a capa
 * do catálogo é servida por este proxy, sem expor credenciais.
 */

const FILE_RE = /^[a-z0-9][a-z0-9._-]{0,120}\.(webp|jpg|jpeg|png|avif)$/i;

const MIME: Record<string, string> = {
  webp: "image/webp",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  avif: "image/avif",
};

export const Route = createFileRoute("/api/public/catalog-image/$file")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const file = String(params.file || "");
        if (!FILE_RE.test(file)) {
          return new Response("Not found", { status: 404 });
        }

        const ext = file.split(".").pop()!.toLowerCase();
        const contentType = MIME[ext] ?? "application/octet-stream";

        try {
          const { supabaseAdmin } = await import(
            "@/integrations/supabase/client.server"
          );
          const { data, error } = await supabaseAdmin.storage
            .from("service-images")
            .download(`catalog/${file}`);

          if (error || !data) {
            return new Response("Not found", { status: 404 });
          }

          const buf = await data.arrayBuffer();
          const etag = `W/"${buf.byteLength.toString(36)}-catalog-${file}"`;
          if (request.headers.get("if-none-match") === etag) {
            return new Response(null, {
              status: 304,
              headers: {
                ETag: etag,
                "Cache-Control": "public, max-age=31536000, immutable",
              },
            });
          }

          return new Response(buf, {
            status: 200,
            headers: {
              "Content-Type": contentType,
              "Content-Length": String(buf.byteLength),
              "Cache-Control": "public, max-age=31536000, immutable",
              ETag: etag,
              "X-Content-Type-Options": "nosniff",
              "Access-Control-Allow-Origin": "*",
            },
          });
        } catch {
          return new Response("Internal error", { status: 500 });
        }
      },
    },
  },
});