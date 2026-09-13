import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertCircle, FolderKanban, LoaderCircle } from "lucide-react";
import { listMyProjects, PROJECT_STATUSES_LIST } from "@/lib/clientarea.functions";
import { listPortfolioAdminProjects } from "@/lib/portfolio-admin.functions";

export const Route = createFileRoute("/_authenticated/app/projects")({
  head: () => ({
    meta: [
      { title: "Projetos · 0WEB Painel" },
      { name: "description", content: "Projetos de clientes e landings do portfólio administradas pela 0WEB." },
      { property: "og:title", content: "Projetos · 0WEB Painel" },
      { property: "og:description", content: "Projetos de clientes e landings do portfólio administradas pela 0WEB." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ProjectsPage,
});

const LABEL: Record<string, string> = {
  recebido: "Recebido",
  planejamento: "Planejamento",
  producao: "Produção",
  revisao: "Revisão",
  publicacao: "Publicação",
  concluido: "Concluído",
};

function ProjectsPage() {
  const loadAccountProjects = useServerFn(listMyProjects);
  const loadPortfolioProjects = useServerFn(listPortfolioAdminProjects);
  const [rows, setRows] = useState<any[]>([]);
  const [portfolioRows, setPortfolioRows] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const accountResult = await loadAccountProjects();
      setRows(accountResult.rows as any[]);
      setIsAdmin(accountResult.isAdmin);
      if (accountResult.isAdmin) {
        const portfolioResult = await loadPortfolioProjects();
        setPortfolioRows(portfolioResult.projects as any[]);
      } else {
        setPortfolioRows([]);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível carregar os projetos.");
    } finally {
      setLoading(false);
    }
  }, [loadAccountProjects, loadPortfolioProjects]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-bold font-display">Projetos</h1>
      <p className="mt-1 text-sm text-muted-foreground">Acompanhe o andamento de cada projeto.</p>

      {loading && (
        <div className="mt-6 flex min-h-40 items-center justify-center gap-2 rounded-md border border-border text-sm text-muted-foreground">
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> Carregando projetos…
        </div>
      )}

      {error && !loading && (
        <div className="mt-6 rounded-md border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive" role="alert">
          <div className="flex items-center gap-2 font-semibold"><AlertCircle className="h-4 w-4" aria-hidden="true" /> Falha ao carregar</div>
          <p className="mt-2">{error}</p>
          <button type="button" onClick={() => void load()} className="mt-4 min-h-11 rounded-md border border-destructive/30 px-4 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !error && <div className="mt-6 space-y-3">
        {rows.map((p) => {
          const stepIdx = PROJECT_STATUSES_LIST.indexOf(p.status as never);
          const pct = ((Math.max(0, stepIdx) + 1) / PROJECT_STATUSES_LIST.length) * 100;
          return (
            <Link
              key={p.id}
              to="/app/projects/$id"
              params={{ id: p.id }}
              className="block rounded-xl border border-border bg-card p-5 hover:border-primary transition"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium">{p.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description || "Sem descrição"}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">{LABEL[p.status] || p.status}</span>
              </div>
              <div className="mt-4 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                <span>Resp.: {p.owner || "—"}</span>
                <span>Previsão: {p.due_date ? new Date(p.due_date).toLocaleDateString("pt-BR") : "—"}</span>
              </div>
            </Link>
          );
        })}
        {rows.length === 0 && (
          <div className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {isAdmin
              ? "Nenhum projeto de cliente foi cadastrado nesta área. As landings do portfólio aparecem abaixo."
              : "Nenhum projeto associado à sua conta."}
          </div>
        )}
      </div>}

      {!loading && !error && isAdmin && (
        <section className="mt-10" aria-labelledby="portfolio-projects-title">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="portfolio-projects-title" className="font-display text-2xl font-bold">Landings do portfólio</h2>
              <p className="mt-1 text-sm text-muted-foreground">{portfolioRows.length} projetos disponíveis para administração individual.</p>
            </div>
            <Link to="/app/portfolio" className="min-h-11 rounded-md border border-border px-4 py-2.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              Abrir visão completa
            </Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {portfolioRows.map((project) => (
              <Link
                key={project.slug}
                to={project.projectKind === "managed" ? "/app/portfolio/novo" : "/app/portfolio/$slug"}
                params={project.projectKind === "managed" ? undefined : { slug: project.slug }}
                search={project.projectKind === "managed" ? { slug: project.slug } : undefined}
                className="group min-h-32 rounded-md border border-border bg-card p-4 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-start justify-between gap-3">
                  <FolderKanban className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span className={project.published ? "text-xs font-semibold text-primary" : "text-xs text-muted-foreground"}>
                    {project.published ? "Publicado" : "Rascunho"}
                  </span>
                </div>
                <h3 className="mt-5 font-semibold group-hover:text-primary">{project.displayName}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{[project.city, project.state].filter(Boolean).join(" · ") || project.segment || project.slug}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
