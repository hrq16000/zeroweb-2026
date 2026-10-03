import process from "node:process";

import { extractOpenAIText, type OpenAIResponseLike } from "@/lib/openai-gateway.helpers";

export type OpenAIReasoningEffort = "none" | "low" | "medium" | "high";
export type OpenAIServiceTier = "auto" | "default" | "flex";

export type GenerateOpenAITextInput = {
  input: string;
  instructions: string;
  maxOutputTokens?: number;
  reasoningEffort?: OpenAIReasoningEffort;
  /**
   * Use "flex" only for background/non-urgent work. Interactive requests
   * stay on "auto" to avoid turning occasional Flex unavailability into UX errors.
   */
  serviceTier?: OpenAIServiceTier;
};

export type GenerateOpenAITextResult = {
  text: string;
  model: string;
  responseId: string | null;
  usage: {
    inputTokens: number | null;
    outputTokens: number | null;
    totalTokens: number | null;
  };
};

type OpenAIResponsePayload = OpenAIResponseLike & {
  id?: string;
  model?: string;
  error?: {
    type?: string;
    code?: string;
    message?: string;
  };
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
  };
};

export class OpenAIGatewayError extends Error {
  constructor(
    public readonly code:
      | "not_configured"
      | "invalid_input"
      | "provider_error"
      | "empty_response"
      | "timeout",
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "OpenAIGatewayError";
  }
}

export function getOpenAIGatewayStatus() {
  const configured = Boolean(process.env.OPENAI_API_KEY?.trim());
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-6-luna";
  return {
    configured,
    model,
    provider: "openai" as const,
  };
}

function clampMaxOutputTokens(value: number | undefined): number {
  // Economy-first default: most UI answers should fit comfortably in ~400 tokens.
  // Callers must opt in explicitly to longer output and can never exceed 2k here.
  if (!Number.isFinite(value)) return 400;
  return Math.max(64, Math.min(2_000, Math.floor(value as number)));
}

export async function generateOpenAIText(
  request: GenerateOpenAITextInput,
): Promise<GenerateOpenAITextResult> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new OpenAIGatewayError("not_configured", "OpenAI não configurada neste ambiente.");
  }

  const input = request.input.trim();
  const instructions = request.instructions.trim();
  if (!input || input.length > 12_000 || !instructions || instructions.length > 8_000) {
    throw new OpenAIGatewayError("invalid_input", "Entrada da IA fora dos limites permitidos.");
  }

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-6-luna";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  let response: Response;
  try {
    response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        instructions,
        input,
        reasoning: { effort: request.reasoningEffort ?? "none" },
        max_output_tokens: clampMaxOutputTokens(request.maxOutputTokens),
        service_tier: request.serviceTier ?? "auto",
        store: false,
      }),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new OpenAIGatewayError("timeout", "A OpenAI demorou mais do que o limite permitido.");
    }
    throw new OpenAIGatewayError("provider_error", "Falha de comunicação com a OpenAI.");
  } finally {
    clearTimeout(timeout);
  }

  let payload: OpenAIResponsePayload = {};
  try {
    payload = (await response.json()) as OpenAIResponsePayload;
  } catch {
    // Keep a sanitized generic provider error below.
  }

  if (!response.ok) {
    console.warn("[openai-gateway] provider_error", {
      status: response.status,
      type: payload.error?.type ?? null,
      code: payload.error?.code ?? null,
    });
    throw new OpenAIGatewayError(
      "provider_error",
      "A OpenAI recusou a solicitação.",
      response.status,
    );
  }

  const text = extractOpenAIText(payload);
  if (!text) {
    throw new OpenAIGatewayError("empty_response", "A OpenAI não retornou texto utilizável.");
  }

  return {
    text,
    model: payload.model?.trim() || model,
    responseId: typeof payload.id === "string" ? payload.id : null,
    usage: {
      inputTokens: Number.isFinite(payload.usage?.input_tokens)
        ? Number(payload.usage?.input_tokens)
        : null,
      outputTokens: Number.isFinite(payload.usage?.output_tokens)
        ? Number(payload.usage?.output_tokens)
        : null,
      totalTokens: Number.isFinite(payload.usage?.total_tokens)
        ? Number(payload.usage?.total_tokens)
        : null,
    },
  };
}
