import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCcw, Save, Trash2 } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PainelGate } from "@/components/site/PainelGate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  listPopupConfigs,
  upsertPopupConfig,
  deletePopupConfig,
  type PopupConfigAdminRow,
} from "@/lib/popup-config-admin.functions";

export const Route = createFileRoute("/painel-popup")({
  head: () => ({
    meta: [
      { title: "Painel · Configuração do pop-up · 0WEB" },
      {
        name: "description",
        content:
          "Configure textos, funil, regras de exibição e limites de alerta do pop-up de captação por projeto, sem alterar código.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => (
    <PainelGate>
      <PopupConfigPanel />
    </PainelGate>
  ),
  ssr: false,
});

type Draft = {
  slug: string;
  enabled: boolean;
  kicker: string;
  title: string;
  description: string;
  highlight: string;
  cta_label: string;
  dismiss_label: string;
  funnel_slug: string;
  bullets: string;
  timerMs: string;
  scrollPct: string;
  startsAt: string;
  endsAt: string;
  minImpressions: string;
  minCtr: string;
  minConversionRate: string;
};

const emptyDraft: Draft = {
  slug: "",
  enabled: true,
  kicker: "",
  title: "",
  description: "",
  highlight: "",
  cta_label: "",
  dismiss_label: "",
  funnel_slug: "",
  bullets: "",
  timerMs: "",
  scrollPct: "",
  startsAt: "",
  endsAt: "",
  minImpressions: "",
  minCtr: "",
  minConversionRate: "",
};

function toDraft(row: PopupConfigAdminRow): Draft {
  const r = row.rules ?? {};
  const t = row.alert_thresholds ?? {};
  return {
    slug: row.slug,
    enabled: row.enabled,
    kicker: row.kicker ?? "",
    title: row.title ?? "",
    description: row.description ?? "",
    highlight: row.highlight ?? "",
    cta_label: row.cta_label ?? "",
    dismiss_label: row.dismiss_label ?? "",
    funnel_slug: row.funnel_slug ?? "",
    bullets: (row.bullets ?? []).join("\n"),
    timerMs: r.timerMs?.toString() ?? "",
    scrollPct: r.scrollPct?.toString() ?? "",
    startsAt: r.startsAt ?? "",
    endsAt: r.endsAt ?? "",
    minImpressions: t.minImpressions?.toString() ?? "",
    minCtr: t.minCtr?.toString() ?? "",
    minConversionRate: t.minConversionRate?.toString() ?? "",
  };
}

const num = (v: string) => (v.trim() === "" ? undefined : Number(v));
const str = (v: string) => (v.trim() === "" ? null : v.trim());

function PopupConfigPanel() {
  const load = useServerFn(listPopupConfigs);
  const save = useServerFn(upsertPopupConfig);
  const remove = useServerFn(deletePopupConfig);

  const [rows, setRows] = useState<PopupConfigAdminRow[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await load({ data: undefined }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao carregar configurações");
    } finally {
      setLoading(false);
    }
  }, [load]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  async function onSave() {
    setSaving(true);
    try {
      await save({
        data: {
          slug: draft.slug.trim(),
          enabled: draft.enabled,
          kicker: str(draft.kicker),
          title: str(draft.title),
          description: str(draft.description),
          highlight: str(draft.highlight),
          cta_label: str(draft.cta_label),
          dismiss_label: str(draft.dismiss_label),
          funnel_slug: str(draft.funnel_slug),
          bullets: draft.bullets
            .split("\n")
            .map((b) => b.trim())
            .filter(Boolean),
          rules: {
            timerMs: num(draft.timerMs),
            scrollPct: num(draft.scrollPct),
            startsAt: str(draft.startsAt),
            endsAt: str(draft.endsAt),
          },
          alert_thresholds: {
            minImpressions: num(draft.minImpressions),
            minCtr: num(draft.minCtr),
            minConversionRate: num(draft.minConversionRate),
          },
        },
      });
      toast.success(`Configuração de “${draft.slug}” salva`);
      setDraft(emptyDraft);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(slug: string) {
    try {
      await remove({ data: { slug } });
      toast.success(`Configuração de “${slug}” removida`);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao remover");
    }
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Configuração do pop-up por projeto</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Sobrescreve o padrão versionado para um slug de portfólio. Todas as alterações ficam
          registradas em log de auditoria. Não inclua contatos operacionais nos textos.
        </p>

        <div className="mt-6 flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => void refresh()} disabled={loading}>
            <RefreshCcw className="mr-2 h-4 w-4" aria-hidden="true" />
            Recarregar
          </Button>
          {error && <span className="text-sm text-destructive">{error}</span>}
        </div>

        <section className="mt-8 grid gap-4 rounded-lg border border-border p-4 md:grid-cols-2">
          <div className="md:col-span-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Novo / editar</h2>
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={draft.enabled} onCheckedChange={(v) => set("enabled", v)} />
              Ativo
            </label>
          </div>

          <div>
            <Label htmlFor="slug">Slug do projeto</Label>
            <Input id="slug" value={draft.slug} onChange={(e) => set("slug", e.target.value)} placeholder="rm-fretes" />
          </div>
          <div>
            <Label htmlFor="funnel">Slug do funil</Label>
            <Input id="funnel" value={draft.funnel_slug} onChange={(e) => set("funnel_slug", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="kicker">Kicker</Label>
            <Input id="kicker" value={draft.kicker} onChange={(e) => set("kicker", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="highlight">Destaque</Label>
            <Input id="highlight" value={draft.highlight} onChange={(e) => set("highlight", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" value={draft.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="desc">Descrição</Label>
            <Textarea id="desc" value={draft.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="bullets">Bullets (um por linha)</Label>
            <Textarea id="bullets" value={draft.bullets} onChange={(e) => set("bullets", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="cta">Texto do CTA</Label>
            <Input id="cta" value={draft.cta_label} onChange={(e) => set("cta_label", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="dismiss">Texto de dispensa</Label>
            <Input id="dismiss" value={draft.dismiss_label} onChange={(e) => set("dismiss_label", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="timer">Timer (ms)</Label>
            <Input id="timer" inputMode="numeric" value={draft.timerMs} onChange={(e) => set("timerMs", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="scroll">Scroll (0–1)</Label>
            <Input id="scroll" inputMode="decimal" value={draft.scrollPct} onChange={(e) => set("scrollPct", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="starts">Início (ISO)</Label>
            <Input id="starts" value={draft.startsAt} onChange={(e) => set("startsAt", e.target.value)} placeholder="2026-01-01T00:00:00Z" />
          </div>
          <div>
            <Label htmlFor="ends">Fim (ISO)</Label>
            <Input id="ends" value={draft.endsAt} onChange={(e) => set("endsAt", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="minimp">Alerta: mínimo de impressões</Label>
            <Input id="minimp" inputMode="numeric" value={draft.minImpressions} onChange={(e) => set("minImpressions", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="minctr">Alerta: CTR mínimo (0–1)</Label>
            <Input id="minctr" inputMode="decimal" value={draft.minCtr} onChange={(e) => set("minCtr", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="mincv">Alerta: conversão mínima (0–1)</Label>
            <Input id="mincv" inputMode="decimal" value={draft.minConversionRate} onChange={(e) => set("minConversionRate", e.target.value)} />
          </div>

          <div className="md:col-span-2">
            <Button onClick={() => void onSave()} disabled={saving || draft.slug.trim().length < 2}>
              <Save className="mr-2 h-4 w-4" aria-hidden="true" />
              {saving ? "Salvando…" : "Salvar configuração"}
            </Button>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-sm font-semibold">Configurações existentes</h2>
          {loading ? (
            <p className="mt-3 text-sm text-muted-foreground">Carregando…</p>
          ) : rows.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Nenhum override — todos os projetos usam o padrão versionado.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-border rounded-lg border border-border">
              {rows.map((r) => (
                <li key={r.slug} className="flex flex-wrap items-center gap-3 p-3 text-sm">
                  <span className="font-medium">{r.slug}</span>
                  <span className="text-muted-foreground">{r.enabled ? "ativo" : "inativo"}</span>
                  <span className="ml-auto flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setDraft(toDraft(r))}>
                      Editar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => void onDelete(r.slug)}>
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Remover {r.slug}</span>
                    </Button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
