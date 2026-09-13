import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

const requestSchema = z.object({
  projectName: z.string().trim().min(2).max(120),
  purpose: z.enum(["hero", "social", "section", "editorial", "page"]),
  style: z.enum(["editorial", "photographic", "minimal", "bold", "documentary"]),
  brief: z.string().trim().min(20).max(1800),
});

function errorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;
  const record = payload as Record<string, unknown>;
  if (typeof record.message === "string") return record.message;
  const error = record.error;
  if (error && typeof error === "object" && typeof (error as Record<string, unknown>).message === "string") {
    return String((error as Record<string, unknown>).message);
  }
  return fallback;
}

export const Route = createFileRoute("/api/generate-portfolio-image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authorization = request.headers.get("authorization") ?? "";
        if (!authorization.startsWith("Bearer ")) return Response.json({ message: "Sessão necessária." }, { status: 401 });

        const supabaseUrl = process.env["SUPABASE_URL"];
        const publishableKey = process.env["SUPABASE_PUBLISHABLE_KEY"];
        const lovableKey = process.env["LOVABLE_API_KEY"];
        if (!supabaseUrl || !publishableKey || !lovableKey) {
          return Response.json({ message: "Geração de imagens indisponível." }, { status: 503 });
        }

        const token = authorization.slice("Bearer ".length);
        const supabase = createClient<Database>(supabaseUrl, publishableKey, {
          global: { headers: { Authorization: authorization } },
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const { data: userData, error: userError } = await supabase.auth.getUser(token);
        if (userError || !userData.user) return Response.json({ message: "Sessão inválida." }, { status: 401 });

        const [{ data: isAdmin }, { data: isSuper }] = await Promise.all([
          supabase.rpc("has_role", { _user_id: userData.user.id, _role: "admin" }),
          supabase.rpc("is_super_admin", { _uid: userData.user.id }),
        ]);
        if (!isAdmin && !isSuper) return Response.json({ message: "Acesso restrito a administradores." }, { status: 403 });

        let input: z.infer<typeof requestSchema>;
        try {
          input = requestSchema.parse(await request.json());
        } catch {
          return Response.json({ message: "Revise a finalidade, o estilo e o briefing." }, { status: 400 });
        }

        const prompt = [
          `Crie uma imagem ${input.style} para ${input.projectName}.`,
          `Finalidade: ${input.purpose}.`,
          input.brief,
          "A imagem deve ser editorial e ilustrativa, sem texto, logotipos, marcas-d'água, avaliações, números ou alegações de resultados.",
          "Não represente equipe, sede, cliente, obra executada ou produto real como evidência factual.",
        ].join(" ");

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
          method: "POST",
          headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "google/gemini-3-pro-image",
            messages: [{ role: "user", content: prompt }],
            modalities: ["image", "text"],
          }),
        });
        const payload = await upstream.json().catch(() => null) as Record<string, unknown> | null;
        if (!upstream.ok) {
          return Response.json({ message: errorMessage(payload, "Não foi possível gerar a imagem.") }, { status: upstream.status });
        }

        const data = Array.isArray(payload?.data) ? payload.data : [];
        const first = data[0] && typeof data[0] === "object" ? data[0] as Record<string, unknown> : null;
        const base64 = typeof first?.b64_json === "string" ? first.b64_json : null;
        const url = typeof first?.url === "string" ? first.url : null;
        if (!base64 && !url) return Response.json({ message: "A geração terminou sem uma imagem utilizável." }, { status: 502 });

        return Response.json({
          image: base64 ? `data:image/png;base64,${base64}` : url,
          provenance: {
            source: "GENERATED_AI",
            model: "google/gemini-3-pro-image",
            purpose: input.purpose,
            style: input.style,
            projectName: input.projectName,
          },
        }, { headers: { "Cache-Control": "no-store" } });
      },
    },
  },
});