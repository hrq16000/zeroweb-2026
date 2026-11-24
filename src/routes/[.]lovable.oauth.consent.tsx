import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type Details = {
  client?: { name?: string; client_name?: string };
  redirect_uri?: string;
  scope?: string;
  scopes?: string[];
  redirect_url?: string;
  redirect_to?: string;
};
type OAuthResult = { data: Details | null; error: { message: string } | null };
// The provider's beta API is still invoked through the normal auth SDK.
const oauth = () => (supabase.auth as unknown as { oauth: {
  getAuthorizationDetails: (id: string) => Promise<OAuthResult>;
  approveAuthorization: (id: string) => Promise<OAuthResult>;
  denyAuthorization: (id: string) => Promise<OAuthResult>;
} }).oauth;

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({ authorization_id: typeof s['authorization_id'] === "string" ? s['authorization_id'] : "" }),
  head: () => ({ meta: [
    { title: "Conectar um agente · 0WEB Growth Engine" },
    { name: "description", content: "Revise e autorize o acesso de um agente ao catálogo da 0WEB com sua conta." },
    { property: "og:title", content: "Conectar um agente à 0WEB" },
    { property: "og:description", content: "Decida quais conexões podem usar sua conta da 0WEB." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex,nofollow" },
  ] }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Solicitação de conexão ausente. Inicie novamente pelo seu agente.");
    const { data, error } = await supabase.auth.getSession();
    if (error) throw new Error("Não foi possível verificar sua conta. Tente novamente.");
    if (!data.session) throw redirect({ to: "/auth", search: { next: location.pathname + location.searchStr + location.hash } });
  },
  loader: async ({ location }) => {
    const id = new URLSearchParams(location.searchStr).get("authorization_id");
    if (!id) throw new Error("Solicitação de conexão ausente.");
    const { data, error } = await oauth().getAuthorizationDetails(id);
    if (error || !data) throw new Error("Esta solicitação expirou, é inválida ou está indisponível. Inicie novamente pelo agente.");
    const target = data.redirect_url ?? data.redirect_to;
    if (target && !data.client) throw redirect({ href: target });
    const { data: account, error: accountError } = await supabase.auth.getUser();
    if (accountError || !account.user) throw new Error("Sua sessão expirou. Entre novamente.");
    return { details: data, email: account.user.email ?? "Conta conectada" };
  },
  pendingComponent: () => <main className="min-h-screen grid place-items-center bg-background text-foreground"><p role="status">Verificando conexão…</p></main>,
  errorComponent: ({ error, reset }) => <main className="min-h-screen grid place-items-center bg-background text-foreground p-6"><div className="max-w-lg space-y-4"><h1 className="text-2xl font-bold">Conexão não disponível</h1><p role="alert">{error instanceof Error ? error.message : "Conexão indisponível. Inicie novamente pelo agente."}</p><Button variant="outline" onClick={reset}>Tentar novamente</Button></div></main>,
  component: Consent,
});

function Consent() {
  const { details, email } = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const name = details.client?.name ?? details.client?.client_name ?? "Este agente";
  const scopes = details.scopes ?? (details.scope ?? "").split(/\s+/).filter(Boolean);
  async function decide(approve: boolean) {
    if (busy) return;
    setBusy(true); setError(null);
    try {
      const result = approve ? await oauth().approveAuthorization(authorization_id) : await oauth().denyAuthorization(authorization_id);
      if (result.error) throw new Error(approve ? "Não foi possível aprovar. Tente novamente." : "Não foi possível cancelar. Tente novamente.");
      const target = result.data?.redirect_url ?? result.data?.redirect_to;
      if (!target) throw new Error("A conexão não retornou um destino. Inicie novamente pelo agente.");
      window.location.assign(target);
    } catch (e) { setError(e instanceof Error ? e.message : "Conexão indisponível."); setBusy(false); }
  }
  return <main className="min-h-screen grid place-items-center bg-background text-foreground p-6">
    <div className="w-full max-w-lg space-y-6">
      <p className="font-semibold text-primary">0WEB Growth Engine</p>
      <h1 className="text-2xl font-bold break-words">Conectar {name} à 0WEB</h1>
      <p className="text-sm text-muted-foreground break-words">Conta: {email}</p>
      <p>{name} poderá consultar produtos, preços e condições publicados da 0WEB como você.</p>
      {details.redirect_uri && <p className="text-sm break-all">Destino do agente: {details.redirect_uri}</p>}
      <ul className="space-y-2 text-sm">{scopes.map(scope => <li key={scope}>{scope === "email" ? "Compartilhar seu e-mail" : scope === "profile" ? "Compartilhar seu perfil básico" : scope === "openid" ? "Identificar sua conta" : `Permissão adicional solicitada: ${scope}`}</li>)}</ul>
      <p className="text-sm text-muted-foreground">As permissões da sua conta continuam valendo. Esta conexão não acessa leads nem realiza compras, envios ou publicações.</p>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <div className="flex flex-wrap gap-3"><Button disabled={busy} onClick={() => void decide(true)}>Permitir conexão</Button><Button variant="outline" disabled={busy} onClick={() => void decide(false)}>Cancelar conexão</Button></div>
    </div>
  </main>;
}