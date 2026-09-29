import { createFileRoute } from "@tanstack/react-router";

import { getOpenAIGatewayStatus } from "@/lib/openai-gateway.server";

export const Route = createFileRoute("/api/public/ai-status")({
  server: {
    handlers: {
      GET: async () => {
        const status = getOpenAIGatewayStatus();
        return Response.json(
          {
            ready: status.configured,
            provider: status.provider,
            model: status.model,
          },
          {
            status: status.configured ? 200 : 503,
            headers: {
              "Cache-Control": "no-store",
              "X-Robots-Tag": "noindex, nofollow",
            },
          },
        );
      },
    },
  },
});
