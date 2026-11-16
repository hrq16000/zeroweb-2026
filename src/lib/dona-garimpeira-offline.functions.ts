import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const requestSchema = z.object({
  interest: z.enum(["comprar", "vender", "doar"]),
  name: z.string().trim().min(2).max(90),
  phone: z.string().regex(/^(?:55)?[1-9][0-9]9?[0-9]{8}$/),
  details: z.string().max(800),
  consent: z.literal(true),
});

const interestLabels = {
  comprar: "Comprar ou consultar uma peça",
  vender: "Vender roupas",
  doar: "Doar roupas",
} as const;

/**
 * Modo sem banco: valida os dados e prepara exclusivamente o WhatsApp da
 * Dona Garimpeira. Sem INSERT, tracker, tabela, Supabase ou fallback 0WEB.
 * O armazenamento local ocorre no navegador antes desta chamada.
 */
export const getDonaGarimpeiraOfflineRedirect = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => requestSchema.parse(raw))
  .handler(async ({ data }) => {
    const [
      { resolveVersionedPortfolioWhatsApp },
      { assembleWaMeUrl },
    ] = await Promise.all([
      import("@/lib/portfolio-whatsapp-registry.server"),
      import("@/lib/whatsapp-redirect.server"),
    ]);
    const digits = resolveVersionedPortfolioWhatsApp("dona-garimpeira-brecho");
    if (!digits) throw new Error("Contato da Dona Garimpeira indisponível.");

    const message = [
      "Olá, Dona Garimpeira! Vim pelo portfólio da 0WEB.",
      `*Assunto:* ${interestLabels[data.interest]}`,
      `*Nome:* ${data.name}`,
      `*Meu WhatsApp:* ${data.phone}`,
      data.details ? `*Detalhes:* ${data.details}` : "",
      "Gostaria de conversar sobre esse atendimento.",
    ].filter(Boolean).join("\n");
    return { url: assembleWaMeUrl(digits, message) };
  });
