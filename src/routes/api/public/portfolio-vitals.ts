import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { recordPortfolioVital } from "@/lib/portfolio-vitals.server";
const schema = z.object({ name: z.enum(["LCP", "CLS", "INP"]), value: z.number().finite().nonnegative().max(120000), id: z.string().max(80), slug: z.string().regex(/^[a-z0-9][a-z0-9_-]{0,80}$/), path: z.string().max(200), ts: z.number().optional() });
export const Route = createFileRoute("/api/public/portfolio-vitals")({ server: { handlers: { POST: async ({ request }) => { try { const payload = schema.parse(await request.json()); recordPortfolioVital(payload); return new Response(null, { status: 204 }); } catch { return new Response("Invalid payload", { status: 400 }); } }, GET: async () => new Response("Not found", { status: 404 }) } } });
