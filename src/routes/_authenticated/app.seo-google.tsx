import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  RefreshCw,
  Search,
  Send,
  Stethoscope,
} from "lucide-react";
import {
  gscDiagnose,
  gscInspectPending,
  gscMonthlyReport,
  gscPerformanceReport,
  gscSelectProperty,
  gscSitemaps,
  gscStatus,
  gscSubmitSitemaps,
  gscSyncPerformance,
  indexNowPing,
  listSeoAlerts,
  notifySeoAlerts,
  resolveSeoAlert,
} from "@/lib/gsc.functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/app/seo-google")({
  head: () => ({
    meta: [
      { title: "Search Console & indexação · 0WEB" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: SeoGooglePanel,
});

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

function SeoGooglePanel() {
  const qc = useQueryClient();
  const status = useServerFn(gscStatus);
  const select = useServerFn(gscSelectProperty);
  const diagnose = useServerFn(gscDiagnose);
  const perf = useServerFn(gscPerformanceReport);
  const syncPerf = useServerFn(gscSyncPerformance);
  const sitemaps = useServerFn(gscSitemaps);
  const submitSitemaps = useServerFn(gscSubmitSitemaps);
  const inspect = useServerFn(gscInspectPending);
  const monthly = useServerFn(gscMonthlyReport);
  const alerts = useServerFn(listSeoAlerts);
  const notify = useServerFn(notifySeoAlerts);
  const resolve = useServerFn(resolveSeoAlert);
  const indexnow = useServerFn(indexNowPing);

  const [days, setDays] = useState(28);
  const month = new Date().toISOString().slice(0, 7);

  const statusQ = useQuery({ queryKey: ["gsc-status"], queryFn: () => status() });
  const diagQ = useQuery({ queryKey: ["gsc-diag"], queryFn: () => diagnose() });
  const perfQ = useQuery({ queryKey: ["gsc-perf", days], queryFn: () => perf({ data: { days } }) });
  const smQ = useQuery({ queryKey: ["gsc-sitemaps"], queryFn: () => sitemaps() });
  const alertQ = useQuery({
    queryKey: ["seo-alerts"],
    queryFn: () => alerts({ data: { onlyOpen: true } }),
  });
  const monthQ = useQuery({
    queryKey: ["seo-monthly", month],
    queryFn: () => monthly({ data: { month } }),
  });

  const refetchAll = () => qc.invalidateQueries();

  const syncMut = useMutation({ mutationFn: () => syncPerf({ data: { days } }), onSuccess: refetchAll });
  const submitMut = useMutation({ mutationFn: () => submitSitemaps(), onSuccess: refetchAll });
  const inspectMut = useMutation({ mutationFn: () => inspect({ data: { limit: 10 } }), onSuccess: refetchAll });
  const notifyMut = useMutation({ mutationFn: () => notify(), onSuccess: refetchAll });
  const indexnowMut = useMutation({ mutationFn: () => indexnow({ data: {} }), onSuccess: refetchAll });
  const selectMut = useMutation({
    mutationFn: (siteUrl: string) => select({ data: { siteUrl } }),
    onSuccess: refetchAll,
  });

  const byType = useMemo(() => {
    const rows = (perfQ.data?.rows ?? []) as any[];
    const m: Record<string, { clicks: number; impressions: number; pos: number[] }> = {};
    for (const r of rows) {
      m[r.page_type] ??= { clicks: 0, impressions: 0, pos: [] };
      m[r.page_type].clicks += r.clicks;
      m[r.page_type].impressions += r.impressions;
      if (r.position) m[r.page_type].pos.push(Number(r.position));
    }
    return Object.entries(m)
      .map(([k, v]) => ({
        page_type: k,
        clicks: v.clicks,
        impressions: v.impressions,
        ctr: v.impressions ? (v.clicks / v.impressions) * 100 : 0,
        position: v.pos.length ? v.pos.reduce((a, b) => a + b, 0) / v.pos.length : 0,
      }))
      .sort((a, b) => b.impressions - a.impressions);
  }, [perfQ.data]);

  const topPages = useMemo(() => {
    const rows = (perfQ.data?.rows ?? []) as any[];
    const m: Record<string, { clicks: number; impressions: number; pos: number[] }> = {};
    for (const r of rows) {
      m[r.page] ??= { clicks: 0, impressions: 0, pos: [] };
      m[r.page].clicks += r.clicks;
      m[r.page].impressions += r.impressions;
      if (r.position) m[r.page].pos.push(Number(r.position));
    }
    return Object.entries(m)
      .map(([page, v]) => ({
        page,
        clicks: v.clicks,
        impressions: v.impressions,
        ctr: v.impressions ? (v.clicks / v.impressions) * 100 : 0,
        position: v.pos.length ? v.pos.reduce((a, b) => a + b, 0) / v.pos.length : 0,
      }))
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 40);
  }, [perfQ.data]);

  const property = statusQ.data?.property as any;
  const alertRows = (alertQ.data?.alerts ?? []) as any[];

  return (
    <div className="p-6 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Search Console & indexação</h1>
          <p className="text-sm text-muted-foreground">
            Cobertura, performance por tipo de página, sitemaps, IndexNow e alertas.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => syncMut.mutate()} disabled={syncMut.isPending}>
            <RefreshCw className={`mr-2 h-4 w-4 ${syncMut.isPending ? "animate-spin" : ""}`} />
            Sincronizar métricas
          </Button>
          <Button size="sm" variant="outline" onClick={() => submitMut.mutate()} disabled={submitMut.isPending}>
            <Send className="mr-2 h-4 w-4" /> Enviar sitemaps
          </Button>
          <Button size="sm" variant="outline" onClick={() => inspectMut.mutate()} disabled={inspectMut.isPending}>
            <Search className="mr-2 h-4 w-4" /> Inspecionar pendentes
          </Button>
          <Button size="sm" variant="outline" onClick={() => indexnowMut.mutate()} disabled={indexnowMut.isPending}>
            IndexNow (Bing)
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Stethoscope className="h-4 w-4" /> Diagnóstico
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>{diagQ.data?.conclusion ?? "Carregando..."}</p>
          {property?.status === "selection_required" && (
            <div className="space-y-2">
              <p className="text-muted-foreground">
                Várias propriedades cobrem o site. Escolha qual usar:
              </p>
              <div className="flex flex-wrap gap-2">
                {property.candidates.map((c: string) => (
                  <Button key={c} size="sm" variant="secondary" onClick={() => selectMut.mutate(c)}>
                    {c}
                  </Button>
                ))}
              </div>
            </div>
          )}
          {property?.status === "selected" && (
            <p className="text-muted-foreground">Propriedade: {property.siteUrl}</p>
          )}
          {diagQ.data?.totals && (
            <div className="grid gap-3 sm:grid-cols-4">
              <Stat label="URLs monitoradas" value={diagQ.data.totals.watched} />
              <Stat label="Indexadas" value={diagQ.data.totals.indexed} />
              <Stat label="Não indexadas" value={diagQ.data.totals.notIndexed} />
              <Stat label="Impressões (30d)" value={diagQ.data.totals.impressions} />
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="performance">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="sitemaps">Sitemaps</TabsTrigger>
          <TabsTrigger value="alertas">Alertas ({alertRows.length})</TabsTrigger>
          <TabsTrigger value="mensal">Relatório mensal</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            {[7, 28, 90].map((d) => (
              <Button key={d} size="sm" variant={days === d ? "default" : "outline"} onClick={() => setDays(d)}>
                {d} dias
              </Button>
            ))}
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-4 w-4" /> Por tipo de página
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr>
                    <th className="py-2">Tipo</th>
                    <th>Cliques</th>
                    <th>Impressões</th>
                    <th>CTR</th>
                    <th>Posição</th>
                  </tr>
                </thead>
                <tbody>
                  {byType.map((r) => (
                    <tr key={r.page_type} className="border-t">
                      <td className="py-2">{r.page_type}</td>
                      <td>{r.clicks}</td>
                      <td>{r.impressions}</td>
                      <td>{r.ctr.toFixed(2)}%</td>
                      <td>{r.position.toFixed(1)}</td>
                    </tr>
                  ))}
                  {byType.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-muted-foreground">
                        Sem dados sincronizados ainda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Páginas com mais impressões</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr>
                    <th className="py-2">Página</th>
                    <th>Cliques</th>
                    <th>Impressões</th>
                    <th>CTR</th>
                    <th>Posição</th>
                  </tr>
                </thead>
                <tbody>
                  {topPages.map((r) => (
                    <tr key={r.page} className="border-t">
                      <td className="max-w-[420px] truncate py-2">{r.page}</td>
                      <td>{r.clicks}</td>
                      <td>{r.impressions}</td>
                      <td>{r.ctr.toFixed(2)}%</td>
                      <td>{r.position.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sitemaps" className="pt-4">
          <Card>
            <CardContent className="overflow-x-auto pt-6">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr>
                    <th className="py-2">Sitemap</th>
                    <th>Último download</th>
                    <th>Erros</th>
                    <th>Avisos</th>
                  </tr>
                </thead>
                <tbody>
                  {((smQ.data as any)?.sitemaps ?? []).map((s: any) => (
                    <tr key={s.sitemap} className="border-t">
                      <td className="max-w-[420px] truncate py-2">{s.sitemap}</td>
                      <td>{s.lastDownloaded ? new Date(s.lastDownloaded).toLocaleDateString("pt-BR") : "—"}</td>
                      <td>
                        {s.errors > 0 ? (
                          <Badge variant="destructive">{s.errors}</Badge>
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        )}
                      </td>
                      <td>{s.warnings}</td>
                    </tr>
                  ))}
                  {((smQ.data as any)?.sitemaps ?? []).length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-4 text-muted-foreground">
                        Nenhum sitemap lido — clique em “Enviar sitemaps”.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alertas" className="space-y-3 pt-4">
          <Button size="sm" variant="outline" onClick={() => notifyMut.mutate()} disabled={notifyMut.isPending}>
            Notificar pendentes
          </Button>
          {alertRows.map((a) => (
            <Card key={a.id}>
              <CardContent className="flex items-start justify-between gap-4 pt-6 text-sm">
                <div className="space-y-1">
                  <p className="flex items-center gap-2 font-medium">
                    <AlertTriangle
                      className={`h-4 w-4 ${a.severity === "critical" ? "text-destructive" : "text-amber-500"}`}
                    />
                    {a.title}
                  </p>
                  {a.url && <p className="text-muted-foreground break-all">{a.url}</p>}
                  {a.probable_cause && <p>Motivo provável: {a.probable_cause}</p>}
                  {a.suggested_fix && <p className="text-muted-foreground">Correção: {a.suggested_fix}</p>}
                </div>
                <Button size="sm" variant="ghost" onClick={() => resolve({ data: { id: a.id } }).then(refetchAll)}>
                  Resolver
                </Button>
              </CardContent>
            </Card>
          ))}
          {alertRows.length === 0 && <p className="text-sm text-muted-foreground">Nenhum alerta aberto.</p>}
        </TabsContent>

        <TabsContent value="mensal" className="space-y-4 pt-4">
          {monthQ.data && (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                <Stat label="URLs no sitemap" value={monthQ.data.sitemapVsIndexed.total} />
                <Stat label="Indexadas" value={monthQ.data.sitemapVsIndexed.indexed} />
                <Stat label="Não indexadas" value={monthQ.data.sitemapVsIndexed.notIndexed} />
              </div>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Recomendações priorizadas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {monthQ.data.recommendations.map((r) => (
                    <div key={r.title}>
                      <p className="font-medium">
                        {r.priority}. {r.title}
                      </p>
                      <p className="text-muted-foreground">{r.detail}</p>
                    </div>
                  ))}
                  {monthQ.data.recommendations.length === 0 && (
                    <p className="text-muted-foreground">Sem recomendações críticas neste mês.</p>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
