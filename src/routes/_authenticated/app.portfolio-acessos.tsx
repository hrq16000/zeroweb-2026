import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, KeyRound, Loader2, Search, ShieldCheck, UserRoundCog } from "lucide-react";
import portfolioCatalog from "@/config/portfolio-catalog.json";
import { adminListUsers } from "@/lib/users-admin.functions";
import { setPortfolioProjectMembership } from "@/lib/portfolio-managed.functions";

export const Route = createFileRoute("/_authenticated/app/portfolio-acessos")({
  component: PortfolioAccessAdmin,
});

type UserRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  display_name: string | null;
  company: string | null;
  user_ref: string | null;
  roles: string[];
};

type CatalogRow = {
  slug: string;
  clientKey?: string;
  title: string;
  city?: string;
  state?: string;
  status?: string;
};

const projects = (portfolioCatalog as CatalogRow[])
  .map((project) => ({
    slug: project.slug,
    clientKey: project.clientKey || project.slug,
    title: project.title,
    city: project.city || "",
    state: project.state || "",
    status: project.status || "",
  }))
  .sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));

function PortfolioAccessAdmin() {
  const listUsers = useServerFn(adminListUsers);
  const setMembership = useServerFn(setPortfolioProjectMembership);

  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [projectQuery, setProjectQuery] = useState("");
  const [userId, setUserId] = useState("");
  const [clientKey, setClientKey] = useState("");
  const [role, setRole] = useState<"owner" | "editor" | "viewer">("owner");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    listUsers({ data: { q: "", role: "all", page: 1, pageSize: 100 } })
      .then((result) => {
        if (active) setUsers(result.users as UserRow[]);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Não foi possível carregar os usuários.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [listUsers]);

  const visibleUsers = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("pt-BR");
    if (!q) return users;
    return users.filter((user) =>
      [user.full_name, user.display_name, user.email, user.company, user.user_ref]
        .filter(Boolean)
        .some((value) => String(value).toLocaleLowerCase("pt-BR").includes(q)),
    );
  }, [query, users]);

  const visibleProjects = useMemo(() => {
    const q = projectQuery.trim().toLocaleLowerCase("pt-BR");
    if (!q) return projects;
    return projects.filter((project) =>
      [project.title, project.slug, project.clientKey, project.city, project.state]
        .filter(Boolean)
        .some((value) => String(value).toLocaleLowerCase("pt-BR").includes(q)),
    );
  }, [projectQuery]);

  const selectedUser = users.find((user) => user.id === userId);
  const selectedProject = projects.find((project) => project.clientKey === clientKey);

  const grant = async () => {
    if (!userId || !clientKey) {
      setError("Escolha um usuário e um projeto antes de conceder acesso.");
      return;
    }
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await setMembership({ data: { userId, clientKey, role, grant: true } });
      setMessage(
        `${selectedUser?.full_name || selectedUser?.display_name || selectedUser?.email || "Usuário"} recebeu acesso ${role} somente ao projeto ${selectedProject?.title || clientKey}.`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao conceder acesso.");
    } finally {
      setSaving(false);
    }
  };

  const revoke = async () => {
    if (!userId || !clientKey) {
      setError("Escolha um usuário e um projeto antes de revogar acesso.");
      return;
    }
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await setMembership({ data: { userId, clientKey, role, grant: false } });
      setMessage(`Acesso ao projeto ${selectedProject?.title || clientKey} revogado para o usuário selecionado.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao revogar acesso.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-[0.18em]">Acesso por projeto</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold">Quem pode editar cada site</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            O super admin concede acesso por <code>client_key</code>. Um cliente sem papel global não herda nenhum outro
            projeto: owner/editor pode trabalhar somente nos projetos explicitamente atribuídos.
          </p>
        </div>
        <Link to="/app/portfolio" className="rounded-md border border-border px-4 py-2 text-sm font-semibold">
          Voltar ao portfólio
        </Link>
      </header>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <UserRoundCog className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="font-display text-xl font-semibold">1. Usuário autorizado</h2>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nome, e-mail, empresa ou USR…"
              className="min-h-11 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm"
            />
          </div>
          {loading ? (
            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Carregando usuários…
            </p>
          ) : (
            <select
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              className="mt-4 min-h-12 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecione um usuário</option>
              {visibleUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.full_name || user.display_name || user.email || user.user_ref || user.id} {user.email ? `· ${user.email}` : ""}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="font-display text-xl font-semibold">2. Projeto</h2>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              value={projectQuery}
              onChange={(event) => setProjectQuery(event.target.value)}
              placeholder="Buscar projeto, slug, cidade…"
              className="min-h-11 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm"
            />
          </div>
          <select
            value={clientKey}
            onChange={(event) => setClientKey(event.target.value)}
            className="mt-4 min-h-12 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Selecione um projeto</option>
            {visibleProjects.map((project) => (
              <option key={project.clientKey} value={project.clientKey}>
                {project.title} · /portfolio/{project.slug} {project.city ? `· ${project.city}/${project.state}` : ""}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-display text-xl font-semibold">3. Permissão</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            ["owner", "Proprietário", "Cria e edita o projeto atribuído; não ganha acesso global."],
            ["editor", "Editor", "Edita conteúdo e ativos do projeto atribuído."],
            ["viewer", "Visualizador", "Somente leitura e preview; sem gravação."],
          ].map(([value, label, help]) => (
            <label key={value} className={`cursor-pointer rounded-xl border p-4 ${role === value ? "border-primary bg-primary/5" : "border-border"}`}>
              <input
                type="radio"
                name="role"
                value={value}
                checked={role === value}
                onChange={() => setRole(value as typeof role)}
                className="sr-only"
              />
              <span className="font-semibold">{label}</span>
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">{help}</span>
            </label>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void grant()}
            disabled={saving || !userId || !clientKey}
            className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
            Conceder acesso
          </button>
          <button
            type="button"
            onClick={() => void revoke()}
            disabled={saving || !userId || !clientKey}
            className="min-h-11 rounded-md border border-destructive/40 px-5 text-sm font-semibold text-destructive disabled:opacity-50"
          >
            Revogar acesso
          </button>
        </div>

        {message ? <p className="mt-4 rounded-md border border-emerald-300/40 bg-emerald-500/10 p-3 text-sm">{message}</p> : null}
        {error ? <p role="alert" className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">{error}</p> : null}
      </section>

      <aside className="rounded-2xl border border-border bg-muted/30 p-5 text-sm leading-6 text-muted-foreground">
        <strong className="text-foreground">Regra de segurança:</strong> esta tela não transforma cliente em admin. A
        autorização é gravada por projeto, validada novamente no servidor e preparada para RLS. Publicação e
        arquivamento continuam sob aprovação administrativa até cobrança e domínio próprio entrarem no fluxo automático.
      </aside>
    </main>
  );
}
