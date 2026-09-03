/**
 * Adaptador do WhatsApp Business (Cloud API da Meta).
 *
 * Enquanto as credenciais não estiverem configuradas, o adaptador opera em
 * modo `simulated`: a fila, os logs e os limites funcionam normalmente, mas
 * nenhuma mensagem sai. Basta preencher os segredos para o envio ficar real,
 * sem alterar código de tela.
 *
 * Segredos esperados (server-only):
 * - WHATSAPP_TOKEN               token permanente da Meta
 * - WHATSAPP_PHONE_NUMBER_ID     ID do número do WhatsApp Business
 * - WHATSAPP_TEMPLATE_NAME       (opcional) template aprovado para 1ª mensagem
 * - WHATSAPP_TEMPLATE_LANG       (opcional) idioma do template, padrão pt_BR
 */
export type WhatsAppSendResult = {
  ok: boolean;
  mode: "cloud_api" | "simulated";
  providerMessageId?: string;
  error?: string;
};

export function whatsappBusinessConfig() {
  const token = process.env["WHATSAPP_TOKEN"];
  const phoneNumberId = process.env["WHATSAPP_PHONE_NUMBER_ID"];
  return {
    configured: Boolean(token && phoneNumberId),
    token,
    phoneNumberId,
    templateName: process.env["WHATSAPP_TEMPLATE_NAME"] ?? null,
    templateLang: process.env["WHATSAPP_TEMPLATE_LANG"] ?? "pt_BR",
  };
}

/** Normaliza para E.164 brasileiro (55 + DDD + número). Retorna null se inválido. */
export function toE164BR(raw: string): string | null {
  const digits = String(raw ?? "").replace(/\D/g, "");
  const local = digits.startsWith("55") ? digits.slice(2) : digits;
  if (local.length < 10 || local.length > 11) return null;
  return `55${local}`;
}

export async function sendWhatsAppBusinessMessage(
  phoneE164: string,
  message: string,
): Promise<WhatsAppSendResult> {
  const cfg = whatsappBusinessConfig();
  if (!cfg.configured) {
    return { ok: true, mode: "simulated" };
  }

  const body = cfg.templateName
    ? {
        messaging_product: "whatsapp",
        to: phoneE164,
        type: "template",
        template: {
          name: cfg.templateName,
          language: { code: cfg.templateLang },
          components: [{ type: "body", parameters: [{ type: "text", text: message.slice(0, 900) }] }],
        },
      }
    : {
        messaging_product: "whatsapp",
        to: phoneE164,
        type: "text",
        text: { preview_url: false, body: message.slice(0, 900) },
      };

  try {
    const res = await fetch(`https://graph.facebook.com/v20.0/${cfg.phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    if (!res.ok) {
      return {
        ok: false,
        mode: "cloud_api",
        error: String(json?.error?.message ?? `HTTP ${res.status}`).slice(0, 300),
      };
    }
    return { ok: true, mode: "cloud_api", providerMessageId: json?.messages?.[0]?.id };
  } catch (error) {
    return {
      ok: false,
      mode: "cloud_api",
      error: error instanceof Error ? error.message.slice(0, 300) : "falha de rede",
    };
  }
}
