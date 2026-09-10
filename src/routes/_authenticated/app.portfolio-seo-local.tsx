import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, Save, RotateCcw, ExternalLink, Loader2, MapPin } from "lucide-react";
import {
  listPortfolioPlaceSeo,
  savePortfolioPlaceSeo,
  resetPortfolioPlaceSeo,
  type PortfolioPlaceSeoRow,
} from "@/lib/portfolio-place-seo.functions";

export const Route = createFileRoute("/_authenticated/app/portfolio-seo-local")({
  component: PortfolioSeoLocalPage,
});

type Draft = {
  metaTitle: string;
  metaDescription: string;
  intro: string;
  name: string;
  description: string;
  areaServed: string;
  telephone: string;
  priceRange: string;
  published: boolean;
};

function draftFromRow(row: PortfolioPlaceSeoRow): Draft {
  return {
    metaTitle: row.metaTitle ?? "",
    metaDescription: row.metaDescription ?? "",
    intro: row.intro ?? "",
    name: row.localBusiness?.name ?? "",
    description: row.localBusiness?.description ?? "",
    areaServed: row.localBusiness?.areaServed ?? "",
    telephone: row.localBusiness?.telephone ?? "",
    priceRange: row.localBusiness?.priceRange ?? "",
    published: row.published,
  };
}

function PortfolioSeoLocalPage() {
  const fetchRows = useServerFn(listPortfolioPlaceSeo);
  const save = useServerFn(savePortfolioPlaceSeo);
  const reset = useServerFn(resetPortfolioPlaceSeo);
  const queryClient = useQueryClient();

  const [busca, setBusca] = useState("");
  const [slug, setSlug] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["portfolio-place-seo"],
    queryFn: () => fetchRows(),
  });

  const rows = data ?? [];
  const filtradas = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => `${r.label} ${r.city} ${r.state} ${r.slug}`.toLowerCase().includes(q));
  }, [rows, busca]);

  const atual = rows.find((r) => r.slug === slug) ?? null;

  function selecionar(row: PortfolioPlaceSeoRow) {
    setSlug(row.slug);
    setDraft(draftFromRow(row));
    setAviso(null);
  }

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function salvar() {
    if (!atual || !draft) return;
    setSalvando(true);
    setAviso(null);
    try {
      await save({
        data: {
          slug: atual.slug,
          metaTitle: draft.metaTitle,
          metaDescription: draft.metaDescription,
          intro: draft.intro,
          localBusiness: {
            name: draft.name,
            description: draft.description,
            areaServed: draft.areaServed,
            telephone: draft.telephone,
            priceRange: draft.priceRange,
          },
          published: draft.published,
        },
      });
      await queryClient.invalidateQueries({ queryKey: ["portfolio-place-seo"] });
      setAviso("Salvo. A página pública passa a usar este conteúdo na próxima carga.");
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
      await queryClient.invalidateQueries({ queryKey: ["portfolio-place-seo"] });
      setDraft(null);
      setSlug(null);
      setAviso("Conteúdo restaurado para o padrão gerado pelo catálogo.");
    } catch (error) {
      setAviso(error instanceof Error ? error.message : "Falha ao restaurar.");
    } finally {
      setSalvando(false);
    }
  }

  const inputClass =
    "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary";

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">SEO por cidade e bairro</h1>
        <p className="text-sm text-muted-foreground">
          Título, descrição, texto de abertura e dados de negócio local de cada página{" "}
          <code>/portfolio-em/&lt;local&gt;</code>. Campos vazios usam o conteúdo gerado pelo
          catálogo. Preencha apenas informação verificável.
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
                placeholder="Buscar cidade ou bairro"
                aria-label="Buscar cidade ou bairro"
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>
          </div>
          <ul className="max-h-[65vh] overflow-y-auto">
            {isLoading && <li className="p-3 text-sm text-muted-foreground">Carregando…</li>}
            {!isLoading && filtradas.length === 0 && (
              <li className="p-3 text-sm text-muted-foreground">Nenhum local encontrado.</li>
            )}
            {filtradas.map((row) => (
              <li key={row.slug}>
                <button
                  type="button"
                  onClick={() => selecionar(row)}
                  className={`flex w-full items-center justify-between gap-2 border-b border-border px-3 py-2 text-left text-sm ${
                    row.slug === slug ? "bg-muted text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {row.label}
                  </span>
                  <span className="text-xs">
                    {row.projects} · {row.isDefault ? "padrão" : row.published ? "editado" : "off"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="rounded-xl border border-border p-4">
          {!atual || !draft ? (
            <p className="text-sm text-muted-foreground">
              Selecione uma cidade ou bairro para editar os metadados públicos.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{atual.label}</h2>
                  <p className="text-xs text-muted-foreground">
                    {atual.kind === "city" ? "Cidade" : "Bairro"} · {atual.projects} projeto(s)
                    {atual.updatedAt ? ` · atualizado em ${new Date(atual.updatedAt).toLocaleString("pt-BR")}` : ""}
                  </p>
                </div>
                <a
                  href={`/portfolio-em/${atual.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  Abrir página <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1 block text-muted-foreground">Meta title (até 120)</span>
                  <input
                    className={inputClass}
                    value={draft.metaTitle}
                    maxLength={120}
                    onChange={(e) => set("metaTitle", e.target.value)}
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-muted-foreground">Área atendida (schema)</span>
                  <input
                    className={inputClass}
                    value={draft.areaServed}
                    maxLength={160}
                    onChange={(e) => set("areaServed", e.target.value)}
                  />
                </label>
              </div>

              <label className="block text-sm">
                <span className="mb-1 block text-muted-foreground">Meta description (até 320)</span>
                <textarea
                  className={`${inputClass} min-h-20`}
                  value={draft.metaDescription}
                  maxLength={320}
                  onChange={(e) => set("metaDescription", e.target.value)}
                />
              </label>

              <label className="block text-sm">
                <span className="mb-1 block text-muted-foreground">
                  Texto de abertura da página (conteúdo real da região)
                </span>
                <textarea
                  className={`${inputClass} min-h-32`}
                  value={draft.intro}
                  maxLength={1200}
                  onChange={(e) => set("intro", e.target.value)}
                />
              </label>

              <fieldset className="rounded-lg border border-border p-3">
                <legend className="px-1 text-sm font-medium text-foreground">Schema LocalBusiness</legend>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-sm">
                    <span className="mb-1 block text-muted-foreground">Nome</span>
                    <input
                      className={inputClass}
                      value={draft.name}
                      maxLength={120}
                      onChange={(e) => set("name", e.target.value)}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-muted-foreground">Faixa de preço</span>
                    <input
                      className={inputClass}
                      value={draft.priceRange}
                      maxLength={20}
                      placeholder="$$"
                      onChange={(e) => set("priceRange", e.target.value)}
                    />
                  </label>
                  <label className="block text-sm md:col-span-2">
                    <span className="mb-1 block text-muted-foreground">Descrição</span>
                    <textarea
                      className={`${inputClass} min-h-20`}
                      value={draft.description}
                      maxLength={400}
                      onChange={(e) => set("description", e.target.value)}
                    />
                  </label>
                  <label className="block text-sm md:col-span-2">
                    <span className="mb-1 block text-muted-foreground">
                      Telefone público (opcional — só se for oficial e divulgável)
                    </span>
                    <input
                      className={inputClass}
                      value={draft.telephone}
                      maxLength={40}
                      onChange={(e) => set("telephone", e.target.value)}
                    />
                  </label>
                </div>
              </fieldset>

              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={draft.published}
                  onChange={(e) => set("published", e.target.checked)}
                />
                Usar este conteúdo na página pública
              </label>

              {aviso && <p className="text-sm text-foreground">{aviso}</p>}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={salvar}
                  disabled={salvando}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
                >
                  {salvando ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Save className="h-4 w-4" aria-hidden="true" />
                  )}
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={restaurar}
                  disabled={salvando || atual.isDefault}
                  className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm disabled:opacity-60"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Restaurar padrão
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
