export type OpenAIResponseLike = {
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
  output_text?: string;
};

export function extractOpenAIText(payload: OpenAIResponseLike): string {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const parts: string[] = [];
  for (const item of payload.output ?? []) {
    if (item?.type !== "message") continue;
    for (const content of item.content ?? []) {
      if (content?.type === "output_text" && typeof content.text === "string") {
        const text = content.text.trim();
        if (text) parts.push(text);
      }
    }
  }
  return parts.join("\n").trim();
}
