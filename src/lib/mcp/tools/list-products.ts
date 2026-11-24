import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_products",
  title: "Consultar produtos da 0WEB",
  description: "Consulte produtos ativos com preço publicado; não compra nem altera produtos.",
  inputSchema: { limit: z.number().int().min(1).max(50).default(20).describe("Quantidade máxima de produtos, entre 1 e 50.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    const db = supabaseForUser(ctx);
    const { data, error } = await db.from("services")
      .select("slug,name,category,description,price,price_period")
      .eq("is_active", true).gt("price", 0)
      .or("is_solution.is.null,is_solution.eq.false")
      .order("display_order").limit(limit).abortSignal(ctx.signal);
    if (error) throw new ToolError("Não foi possível consultar os produtos com suas permissões.");
    const products = (data ?? []).map(p => ({ ...p, path: `/servicos/${p.slug}` }));
    return { content: [{ type: "text", text: JSON.stringify(products) }], structuredContent: { products } };
  },
});