import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { MapPin, Save, RotateCcw, Search, ExternalLink, Loader2 } from "lucide-react";
import {
  listLocalPages,
  saveLocalPage,
  resetLocalPage,
  type LocalPageAdminRow,
} from "@/lib/local-pages.functions";

export const Route = createFileRoute("/_authenticated/app/paginas-locais")({
  component: PaginasLocaisPage,
});

function PaginasLocaisPage() {
  const fetchPages = useServerFn(listLocalPages);
  const save = useServerFn(saveLocalPage);
  const reset = useServerFn(resetLocalPage);
  const queryClient = useQueryClient();

  const [busca, setBusca] = useState("");
  const [slug, setSlug] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<LocalPageAdminRow>>({});
  const [salvando, setSalvando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["local-pages"],
    queryFn: () => fetchPages(),
  });

  const pages = data ?? [];
  const filtradas = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return pages;
    return pages.filter((p) => `${p.city} ${p.uf} ${p.slug}`.toLowerCase().includes(q));
  }, [pages, busca]);

  const atual = pages.find((p) => p.slug === slug) ?? null;

  function selecionar(page: LocalPageAdminRow) {
    setSlug(page.slug);
    setDraft({
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
      intro: page.intro,
      body: page.body,
      published: page.published,
    });
    setAviso(null);
  }

  async function salvar() {
    if (!atual) return;
    setSalvando(true);
    setAviso(null);
    try {
      await save({
        data: {
          slug: atual.slug,
          metaTitle: draft.metaTitle ?? "",
          metaDescription: draft.metaDescription ?? "",
          intro: draft.intro ?? "",
          body: draft.body ?? "",
          published: draft.published !== false,
        },
      });
      await queryClient.invalidateQueries({ queryKey: ["local-pages"] });
      setAviso("Página salva. O sitemap passa a refletir a mudança na próxima leitura.");
    } catch (error) {
      setAviso(error instanceof Error ? error.message : "Falha ao salvar.");
    } finally {
      setSalvando(false);
    }
  }

  async function restaurar() {
    if (!atual) return;
    setSalvando(true);
    try {
      await reset({ data: { slug: atual.slug } });
      await queryClient.invalidateQueries({ queryKey: ["local-pages"] });
      setDraft({});
      setAviso("Conteúdo restaurado para o texto padrão do template.");
    } catch (error) {
      setAviso(error instanceof Error ? error.message : "Falha ao restaurar.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Páginas locais</h1>
        <p className="text-sm text-muted-foreground">
          Conteúdo e SEO de cada página <code>/criacao-de-site-institucional/&lt;cidade&gt;</code>. Campos vazios usam o
          texto padrão do template; despublicar remove a URL do sitemap.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-xl border border-border">
          <div className="border-b border-border p-3">
            <label className="flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5">
              <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar cidade"
                aria-label="Buscar cidade"
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>
          </div>
          <ul className="max-h-[65vh] overflow-y-auto">
            {isLoading && <li className="p-3 text-sm text-muted-foreground">Carregando…</li>}
            {filtradas.map((p) => (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => selecionar(p)}
                  className={`flex w-full items-center justify-between gap-2 border-b border-border/60 px-3 py-2.5 text-left text-sm ${
                    p.slug === slug ? "bg-muted/60" : ""
                  }`}
                >
                  <span className="flex items-center gap-2 text-foreground">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                    {p.city} · {p.uf}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {!p.published ? "oculta" : p.isDefault ? "padrão" : "editada"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="rounded-xl border border-border p-5">
          {!atual ? (
            <p className="text-sm text-muted-foreground">Selecione uma cidade para editar o conteúdo e o SEO.</p>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-foreground">
                  {atual.city} · {atual.uf}
                </h2>
                <a
                  href={`/criacao-de-site-institucional/${atual.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary"
                >
                  Ver página <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>

              <label className="block text-sm">
                <span className="text-muted-foreground">Meta title (até 120 caracteres)</span>
                <input
                  value={draft.metaTitle ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, metaTitle: e.target.value }))}
                  maxLength={120}
                  placeholder={`Criação de Site Institucional em ${atual.city} (${atual.uf}) | 0WEB`}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
                />
              </label>

              <label className="block text-sm">
                <span className="text-muted-foreground">Meta description (até 320 caracteres)</span>
                <textarea
                  value={draft.metaDescription ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, metaDescription: e.target.value }))}
                  maxLength={320}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
                />
              </label>

              <label className="block text-sm">
                <span className="text-muted-foreground">Texto de abertura (abaixo do H1)</span>
                <textarea
                  value={draft.intro ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, intro: e.target.value }))}
                  maxLength={1200}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
                />
              </label>

              <label className="block text-sm">
                <span className="text-muted-foreground">
                  Conteúdo regional adicional (parágrafos separados por linha em branco)
                </span>
                <textarea
                  value={draft.body ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
                  maxLength={6000}
                  rows={8}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
                />
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={draft.published !== false}
                  onChange={(e) => setDraft((d) => ({ ...d, published: e.target.checked }))}
                />
                <span className="text-muted-foreground">Publicada (aparece no sitemap)</span>
              </label>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={salvar}
                  disabled={salvando}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                >
                  {salvando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Salvar
                </button>
                <button
                  type="button"
                  onClick={restaurar}
                  disabled={salvando || atual.isDefault}
                  className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium disabled:opacity-60"
                >
                  <RotateCcw className="h-4 w-4" /> Restaurar padrão
                </button>
              </div>

              {aviso && <p className="text-sm text-muted-foreground">{aviso}</p>}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
