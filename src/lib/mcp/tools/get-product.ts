import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_product",
  title: "Consultar detalhes de um produto",
  description: "Consulte o preço, escopo e condições publicados de um produto ativo pelo slug.",
  inputSchema: { slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/).describe("Slug retornado por list_products.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }, ctx) => {
    const { data, error } = await supabaseForUser(ctx).from("services")
      .select("slug,name,category,description,price,price_period,delivery_days,conditions")
      .eq("slug", slug).eq("is_active", true).gt("price", 0)
      .or("is_solution.is.null,is_solution.eq.false").abortSignal(ctx.signal).maybeSingle();
    if (error) throw new ToolError("Não foi possível consultar o produto com suas permissões.");
    if (!data) throw new ToolError("Produto ativo não encontrado.");
    const product = { ...data, path: `/servicos/${data.slug}` };
    return { content: [{ type: "text", text: JSON.stringify(product) }], structuredContent: { product } };
  },
});