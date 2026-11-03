import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { SERVICES } from "@/lib/services-data";

// Cache por instância: evita uma chamada de IA a cada visita do mesmo produto.
const cache = new Map<string, { slugs: string[]; at: number }>();
const TTL_MS = 6 * 60 * 60 * 1000;

/**
 * Recomenda produtos relacionados do catálogo com a Lovable AI.
 * Só devolve slugs existentes no catálogo; em qualquer falha retorna `null`
 * e a página mantém a recomendação padrão por categoria.
 */
export const getAiRecommendations = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }): Promise<{ slugs: string[] } | null> => {
    const me = SERVICES[data.slug];
    if (!me) return null;
    const hit = cache.get(data.slug);
    if (hit && Date.now() - hit.at < TTL_MS) return { slugs: hit.slugs };

    const catalog = Object.values(SERVICES)
      .filter((s) => s.slug !== data.slug)
      .map((s) => `${s.slug} | ${s.name} | ${s.category} | ${s.description.slice(0, 140)}`)
      .join("\n");

    try {
      const { generateResponse } = await import("@lovable.dev/ai-gateway");
      const res = await generateResponse({
        model: "openai/gpt-6-astra",
        instructions:
          "Você recomenda serviços complementares de uma loja de marketing digital. Responda somente com JSON {\"slugs\": [...]} contendo de 4 a 6 slugs do catálogo, do mais ao menos relevante para quem está vendo o produto atual. Use apenas slugs presentes no catálogo.",
        input: `Produto atual: ${me.slug} | ${me.name} | ${me.category} | ${me.description}\n\nCatálogo:\n${catalog}`,
      });
      const r = res as unknown as { output_text?: string; output?: { content?: { type?: string; text?: string }[] }[] };
      const text =
        r.output_text ??
        (r.output ?? []).flatMap((o) => o.content ?? []).filter((c) => c.type === "output_text").map((c) => c.text ?? "").join("");
      const match = text.match(/\{[\s\S]*\}/);
      const parsed = match ? (JSON.parse(match[0]) as { slugs?: unknown }) : null;
      const slugs = Array.isArray(parsed?.slugs)
        ? [...new Set(parsed!.slugs.filter((s): s is string => typeof s === "string" && s !== data.slug && s in SERVICES))].slice(0, 6)
        : [];
      if (slugs.length < 3) return null;
      cache.set(data.slug, { slugs, at: Date.now() });
      return { slugs };
    } catch (e) {
      console.error("[ai-recommendations] falha", e instanceof Error ? e.message : e);
      return null;
    }
  });
