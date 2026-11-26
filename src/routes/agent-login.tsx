import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getSupportAgentIdentity } from "@/lib/support-agents.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/agent-login")({
  head: () => ({
    meta: [
      { title: "Acesso de agentes · 0WEB" },
      { name: "description", content: "Login exclusivo de agentes cadastrados." },
      { property: "og:title", content: "Acesso de agentes · 0WEB" },
      { property: "og:description", content: "Entrada das contas de agentes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AgentLogin,
});

function AgentLogin() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const identity = useServerFn(getSupportAgentIdentity);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reset, setReset] = useState(false);

  const signIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        throw new Error("E-mail ou senha inválidos, ou convite ainda não confirmado.");
      }

      try {
        await identity();
      } catch {
        await qc.cancelQueries();
        qc.clear();
        await supabase.auth.signOut();
        throw new Error("Conta sem acesso ativo de agente.");
      }

      await navigate({ to: "/app/agent-profile" });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Não foi possível entrar.");
    } finally {
      setBusy(false);
    }
  };

  const requestReset = async () => {
    setBusy(true);
    setError("");
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset-password",
      });
      if (resetError) setError("Não foi possível solicitar a recuperação.");
      else setReset(true);
    } catch {
      setError("Não foi possível solicitar a recuperação.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground px-5 py-16">
      <div className="max-w-md mx-auto">
        <h1 className="font-display text-3xl font-bold">Acesso de agentes</h1>
        <form className="mt-8 space-y-5" onSubmit={signIn}>
          <label className="block text-sm space-y-2">
            E-mail
            <Input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-h-11"
            />
          </label>
          <label className="block text-sm space-y-2">
            Senha
            <Input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="min-h-11"
            />
          </label>
          {error && <p role="alert" className="text-destructive text-sm">{error}</p>}
          <Button disabled={busy} className="min-h-11 w-full">
            {busy ? "Entrando…" : "Entrar"}
          </Button>
        </form>
        <Button
          variant="link"
          className="min-h-11 mt-3"
          disabled={busy || !email}
          onClick={requestReset}
        >
          Esqueci minha senha
        </Button>
        {reset && (
          <p role="status" className="text-sm text-muted-foreground">
            Se houver uma conta, o link de recuperação será enviado.
          </p>
        )}
        <div className="mt-6">
          <Link to="/auth" className="text-sm text-muted-foreground underline">
            Acesso de clientes
          </Link>
        </div>
      </div>
    </main>
  );
}
