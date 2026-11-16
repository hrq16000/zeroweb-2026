import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ImageOff, Upload, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { serviceImagePreviewState } from "@/lib/service-image-preview-state";
import { supabase } from "@/integrations/supabase/client";
import {
  listServicesAdmin,
  getServiceImageUploadUrl,
  upsertService,
  type ServiceRow,
} from "@/lib/services-crud.functions";

export const Route = createFileRoute("/_authenticated/app/servicos-imagens")({
  component: ServiceImagesPage,
});

function ServiceImagesPage() {
  const fnList = useServerFn(listServicesAdmin);
  const fnUpload = useServerFn(getServiceImageUploadUrl);
  const fnUpsert = useServerFn(upsertService);

  const [rows, setRows] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    try {
      const { services } = await fnList();
      setRows(services);
    } catch (e) {
      toast.error("Falha ao carregar serviços", { description: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void reload(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const orphans = rows.filter((r) => !r.image_path);
  const withImage = rows.filter((r) => r.image_path);
  const missingPreviewUrls = withImage.filter((r) => !r.image_url?.trim()).length;

  const handleUpload = async (row: ServiceRow, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Imagem acima de 5 MB");
      return;
    }
    if (!/^image\/(jpeg|png|webp|avif)$/.test(file.type)) {
      toast.error("Formato inválido (use JPG, PNG, WEBP ou AVIF)");
      return;
    }
    setUploadingId(row.id);
    try {
      const { path, token } = await fnUpload({ data: { slug: row.slug, filename: file.name } });
      const { error: upErr } = await supabase.storage
        .from("service-images")
        .uploadToSignedUrl(path, token, file, { upsert: true });
      if (upErr) throw upErr;
      // Persiste image_path no serviço
      await fnUpsert({
        data: {
          id: row.id,
          name: row.name,
          category: row.category,
          title: row.title,
          h1: row.h1,
          description: row.description,
          service_type: row.service_type,
          cta_label: row.cta_label,
          image_path: path,
          // Se OG apontava para a antiga capa, mantenha ambas sincronizadas.
          // Uma imagem social distinta, configurada de propósito, é preservada.
          og_image_path: !row.og_image_path || row.og_image_path === row.image_path
            ? path
            : row.og_image_path,
          og_type: (row.og_type as "website" | "article" | "product") || "website",
          schema_jsonld: row.schema_jsonld ?? [],
          problems: row.problems,
          benefits: row.benefits,
          process: row.process,
          faq: row.faq,
          keywords: row.keywords,
          is_active: row.is_active,
          is_featured: row.is_featured,
          show_in_menu: row.show_in_menu,
          show_in_footer: row.show_in_footer,
          show_in_home_featured: row.show_in_home_featured,
          show_in_sitemap: row.show_in_sitemap,
          funnels: row.funnels ?? {},
          display_order: row.display_order,
        },
      });
      toast.success(`Capa enviada — ${row.name}`);
      void reload();
    } catch (e) {
      toast.error("Falha no upload", { description: (e as Error).message });
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-display">Imagens dos serviços</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Diagnóstico de capas cadastradas e prévias que realmente carregam. Faça upload direto para o bucket
          <code className="text-xs mx-1">service-images</code> — o caminho é gravado em <code className="text-xs">services.image_path</code>.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      ) : (
        <>
          <section className="mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <ImageOff className="w-4 h-4 text-amber-500" />
              Órfãos ({orphans.length})
            </h2>
            {orphans.length === 0 ? (
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Todos os serviços têm um caminho de capa cadastrado. Confira a prévia de cada serviço abaixo.
              </div>
            ) : (
              <div className="space-y-2">
                {orphans.map((row) => (
                  <OrphanRow
                    key={row.id}
                    row={row}
                    uploading={uploadingId === row.id}
                    onUpload={(f) => handleUpload(row, f)}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Com capa ({withImage.length})
            </h2>
            {missingPreviewUrls > 0 && (
              <p role="status" className="mb-3 text-xs text-amber-700 dark:text-amber-300">
                {missingPreviewUrls} serviço(s) têm caminho salvo, mas não receberam URL de prévia.
                Uma URL assinada ausente ou expirada exige reenvio ou revisão da imagem.
              </p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {withImage.map((row) => (
                <ServiceImageAuditCard
                  key={row.id}
                  row={row}
                  uploading={uploadingId === row.id}
                  onUpload={(f) => handleUpload(row, f)}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function OrphanRow({
  row, uploading, onUpload,
}: { row: ServiceRow; uploading: boolean; onUpload: (file: File) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
      <div className="w-16 h-16 rounded-md bg-muted grid place-items-center text-muted-foreground shrink-0">
        <ImageOff className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{row.name}</p>
        <p className="text-xs text-muted-foreground">
          /servicos/{row.slug} · {row.is_active ? "ativo" : "rascunho"} · {row.category}
        </p>
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(f);
          if (ref.current) ref.current.value = "";
        }}
      />
      <Button
        size="sm"
        variant="outline"
        onClick={() => ref.current?.click()}
        disabled={uploading}
      >
        <Upload className="w-3.5 h-3.5 mr-1" />
        {uploading ? "Enviando…" : "Enviar capa"}
      </Button>
    </div>
  );
}

/**
 * A existência de image_path não comprova a integridade da imagem no CMS.
 * A prévia detecta falha real no navegador e oferece reenvio sem alterar
 * a vitrine pública ou rebaixar os gates de publicação.
 */
function ServiceImageAuditCard({
  row,
  uploading,
  onUpload,
}: {
  row: ServiceRow;
  uploading: boolean;
  onUpload: (file: File) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    setLoadFailed(false);
  }, [row.id, row.image_url]);

  const imageStatus = serviceImagePreviewState(row.image_path, row.image_url, loadFailed);
  const previewReady = imageStatus === "ready";

  return (
    <div className="group rounded-lg border border-border overflow-hidden hover:border-primary transition bg-card">
      <Link
        to="/servicos/$slug"
        params={{ slug: row.slug }}
        target="_blank"
        className="block"
        aria-label={`Abrir página do serviço ${row.name}`}
      >
        <div className="aspect-video bg-muted overflow-hidden">
          {previewReady ? (
            <img
              src={row.image_url!}
              alt={row.image_alt ?? row.name}
              className="w-full h-full object-cover group-hover:scale-105 transition"
              loading="lazy"
              onError={() => setLoadFailed(true)}
            />
          ) : (
            <div
              role="img"
              aria-label={`Capa indisponível: ${row.name}`}
              className="flex h-full items-center justify-center text-muted-foreground"
            >
              <ImageOff className="w-6 h-6" aria-hidden="true" />
            </div>
          )}
        </div>
        <div className="p-2">
          <p className="text-xs font-medium truncate">{row.name}</p>
          <p className="text-[10px] text-muted-foreground truncate flex items-center gap-1">
            /servicos/{row.slug} <ExternalLink className="w-2.5 h-2.5" />
          </p>
        </div>
      </Link>
      <div className="px-2 pb-2">
        {!previewReady && (
          <p role="status" className="mb-2 text-xs text-amber-700 dark:text-amber-300">
            {imageStatus === "missing-url" ? "Sem URL de prévia" : "Imagem não carregou"}
          </p>
        )}
        <input
          ref={ref}
          type="file"
          aria-label={`Nova capa para ${row.name}`}
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onUpload(file);
            if (ref.current) ref.current.value = "";
          }}
        />
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          disabled={uploading}
          onClick={() => ref.current?.click()}
        >
          <Upload className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
          {uploading ? "Enviando…" : "Reenviar capa"}
        </Button>
      </div>
    </div>
  );
}
