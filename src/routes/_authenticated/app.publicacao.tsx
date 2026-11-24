import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Check, Copy, ExternalLink, GitCommitHorizontal, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getPublicationOverview, getPublicationChecks } from "@/lib/publication-admin.functions";
import { checkSummary, latestReadyProduction, type ConnectionStatus } from "@/lib/publication-policy";

const overviewQuery = queryOptions({
  queryKey: ["admin-publication"], queryFn: () => getPublicationOverview(), staleTime: 30_000, retry: false,
});
export const Route = createFileRoute("/_authenticated/app/publicacao")({
  head: () => ({ meta: [
    { title: "Publicação e conexão Vercel · Painel 0WEB" },
    { name: "description", content: "Seleção de commits da main, verificações do GitHub e estado de leitura do projeto Vercel da 0WEB." },
    { property: "og:title", content: "Publicação · Administração 0WEB" },
    { property: "og:description", content: "Acompanhamento restrito de commits, verificações e publicações Vercel." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex,nofollow" },
  ] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(overviewQuery),
  pendingComponent: () => <div role="status" className="space-y-5"><h1 className="font-display text-3xl font-bold">Publicação</h1><p className="text-muted-foreground">Consultando conexões…</p></div>,
  errorComponent: ({ error, reset }) => <div role="alert" className="max-w-3xl space-y-4"><h1 className="font-display text-3xl font-bold">Publicação</h1><p className="text-destructive">{error instanceof Error ? error.message : "Não foi possível consultar a publicação."}</p><Button variant="outline" className="min-h-11" onClick={reset}><RefreshCw />Tentar novamente</Button></div>,
  component: PublicationPage,
});

const stateLabels: Record<string, string> = { READY: "Pronto", ERROR: "Falhou", BUILDING: "Em processamento", QUEUED: "Na fila", CANCELED: "Cancelado" };
const checkLabels: Record<string, string> = { success: "Aprovado", failure: "Reprovado", skipped: "Pulado", neutral: "Neutro", cancelled: "Cancelado", timed_out: "Tempo excedido", action_required: "Ação necessária" };
const summaryLabels = { unknown: "Não comprovado", pending: "Em andamento", failed: "Há verificações reprovadas", passed: "Verificações consultadas aprovadas" };

function ConnectionRow({ name, status }: { name: string; status: ConnectionStatus }) {
  return <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border py-4 last:border-0">
    <span className="font-medium">{name}</span>
    <div className="min-w-0 text-right text-sm">
      <p className={status.state === "error" ? "text-destructive" : status.state === "connected" ? "text-primary" : "text-muted-foreground"}>{status.message}</p>
      <p className="mt-1 break-all font-mono text-xs text-muted-foreground">{status.httpStatus ? `HTTP ${status.httpStatus} · ` : ""}{status.code}</p>
    </div>
  </div>;
}

function PublicationPage() {
  const { data, isFetching } = useSuspenseQuery(overviewQuery);
  const qc = useQueryClient();
  const [selectedSha, setSelectedSha] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const selected = data.commits.find(commit => commit.sha === selectedSha)
    ?? data.commits.find(commit => commit.sha.startsWith("873a1938")) ?? data.commits[0];
  const checks = useQuery({
    queryKey: ["admin-publication-checks", selected?.sha],
    queryFn: () => selected ? getPublicationChecks({ data: { sha: selected.sha } }) : Promise.resolve(null),
    enabled: Boolean(selected), staleTime: 30_000, retry: false,
  });
  const ready = latestReadyProduction(data.deployments);
  return <div className="max-w-6xl min-w-0 space-y-8">
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Administração · 0WEB</p><h1 className="font-display text-3xl font-bold">Publicação</h1></div>
      <Button variant="outline" className="min-h-11" disabled={isFetching || checks.isFetching} onClick={() => { void qc.invalidateQueries({ queryKey: ["admin-publication"] }); void qc.invalidateQueries({ queryKey: ["admin-publication-checks"] }); }}><RefreshCw className={isFetching ? "animate-spin motion-reduce:animate-none" : ""} />{isFetching ? "Consultando…" : "Atualizar status"}</Button>
    </header>
    <section className="border-y border-border py-5">
      <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="flex items-center gap-2 text-lg font-semibold"><ShieldCheck className="size-5 text-primary" />Conexões</h2><span className="text-xs text-muted-foreground">{new Date(data.checkedAt).toLocaleString("pt-BR")}</span></div>
      <p className="mt-2 text-sm text-muted-foreground">msolus / zeroweb-2026</p>
      <ConnectionRow name="GitHub · main" status={data.github} />
      <ConnectionRow name="Vercel · projeto" status={data.vercel} />
      <ConnectionRow name="Vercel · histórico" status={data.deploymentsStatus} />
    </section>
    <section className="space-y-5">
      <h2 className="flex items-center gap-2 text-lg font-semibold"><GitCommitHorizontal className="size-5 text-primary" />Commit selecionado</h2>
      {data.commits.length ? <>
        <label className="block max-w-3xl space-y-2 text-sm"><span>Versão integrada à main</span>
          <Select value={selected?.sha ?? ""} onValueChange={value => { setSelectedSha(value); setCopyState("idle"); }}>
            <SelectTrigger className="min-h-11" aria-label="Versão integrada à main"><SelectValue /></SelectTrigger>
            <SelectContent>{data.commits.map(commit => <SelectItem key={commit.sha} value={commit.sha} className="min-h-11"><span className="font-mono">{commit.sha.slice(0, 8)}</span> · {commit.subject}</SelectItem>)}</SelectContent>
          </Select>
        </label>
        {selected && <div className="space-y-3">
          <p className="break-words font-medium">{selected.subject}</p>
          <p className="break-all font-mono text-xs text-muted-foreground">{selected.sha}</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="min-h-11" onClick={async () => { try { await navigator.clipboard.writeText(selected.sha); setCopyState("copied"); } catch { setCopyState("error"); } }}>{copyState === "copied" ? <Check /> : <Copy />}{copyState === "copied" ? "SHA copiado" : "Copiar SHA"}</Button>
            <Button variant="outline" asChild className="min-h-11"><a href={selected.url} target="_blank" rel="noopener noreferrer"><ExternalLink />Ver commit no GitHub</a></Button>
            <Button variant="outline" asChild className="min-h-11"><a href="https://vercel.com/msolus/zeroweb-2026/deployments" target="_blank" rel="noopener noreferrer"><ExternalLink />Abrir publicações na Vercel</a></Button>
          </div>
          {copyState === "error" && <p role="alert" className="text-sm text-destructive">Não foi possível copiar o SHA.</p>}
        </div>}
        <div className="space-y-3 border-t border-border pt-5">
          <h3 className="font-semibold">Verificações do commit</h3>
          {checks.isFetching ? <p role="status" className="text-sm text-muted-foreground">Consultando verificações…</p> : checks.error ? <p role="alert" className="text-sm text-destructive">Não foi possível consultar as verificações.</p> : checks.data?.status.state !== "connected" ? <p role="alert" className="text-sm text-destructive">{checks.data?.status.message ?? "Verificações não comprovadas."}</p> : <>
            <p className="text-sm font-medium">{summaryLabels[checkSummary(checks.data.checks)]}</p>
            {checks.data.checks.map((check, i) => <div key={`${check.name}-${i}`} className="flex flex-wrap justify-between gap-2 border-b border-border py-2 text-sm"><span className="min-w-0 break-words">{check.name}</span><span className={check.conclusion === "failure" ? "text-destructive" : "text-muted-foreground"}>{check.conclusion ? checkLabels[check.conclusion] ?? check.conclusion : "Em andamento"}</span></div>)}
          </>}
        </div>
      </> : <p className="text-sm text-muted-foreground">Nenhum commit acessível nesta conexão.</p>}
    </section>
    <section className="space-y-4 border-t border-border pt-6">
      <h2 className="text-lg font-semibold">Publicações na Vercel</h2>
      <p className="text-sm text-muted-foreground">Última produção READY: {ready ? `${ready.sha?.slice(0, 8) ?? "SHA não informado"} · ${new Date(ready.created).toLocaleString("pt-BR")}` : "não comprovada"}</p>
      {data.deployments.length ? <Table><TableHeader><TableRow><TableHead>Estado</TableHead><TableHead>Destino</TableHead><TableHead>Commit</TableHead><TableHead>Data</TableHead></TableRow></TableHeader><TableBody>{data.deployments.map(deployment => <TableRow key={deployment.id}><TableCell>{stateLabels[deployment.state] ?? deployment.state}</TableCell><TableCell>{deployment.target === "production" ? "Produção" : "Prévia"}</TableCell><TableCell className="font-mono">{deployment.sha?.slice(0, 8) ?? "Não informado"}</TableCell><TableCell className="whitespace-nowrap">{new Date(deployment.created).toLocaleString("pt-BR")}</TableCell></TableRow>)}</TableBody></Table> : <p className="text-sm text-muted-foreground">Nenhuma publicação comprovada nesta consulta.</p>}
    </section>
  </div>;
}