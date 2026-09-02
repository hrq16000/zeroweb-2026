import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ExternalLink, RefreshCw, Sheet as SheetIcon } from "lucide-react";
import { toast } from "sonner";
import { getCrmSheetStatus, ensureCrmSheet, syncCrmSheet } from "@/lib/crm-sheets.functions";

export const Route = createFileRoute("/_authenticated/app/crm-planilha")({
  component: CrmSheetPage,
});

function CrmSheetPage() {
  const fetchStatus = useServerFn(getCrmSheetStatus);
  const createSheet = useServerFn(ensureCrmSheet);
  const runSync = useServerFn(syncCrmSheet);

  const status = useQuery({ queryKey: ["crm-sheet-status"], queryFn: () => fetchStatus() });

  const create = useMutation({
    mutationFn: () => createSheet(),
    onSuccess: (r) => {
      toast.success(r.created ? "Planilha de CRM criada." : "Planilha já existente reutilizada.");
      void status.refetch();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const sync = useMutation({
    mutationFn: () => runSync({ data: { days: 180 } }),
    onSuccess: (r) =>
      toast.success(
        `${r.leadsEnviados} leads enviados · ${r.atualizadosPelaPlanilha} atualizados a partir da planilha.`,
      ),
    onError: (e: Error) => toast.error(e.message),
  });

  const data = status.data;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <SheetIcon className="w-6 h-6 text-primary" /> CRM na Planilha Google
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Cada lead do portal vira uma linha na planilha da equipe. As colunas <strong>Status</strong>,{" "}
          <strong>Responsável</strong> e <strong>Observação</strong> podem ser editadas na planilha e voltam
          para o portal na próxima sincronização.
        </p>
      </header>

      {status.isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      ) : (
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <p className="text-sm">
            Conexão com o Google:{" "}
            <span className={data?.connected ? "text-primary font-medium" : "text-destructive font-medium"}>
              {data?.connected ? "ativa" : "não configurada"}
            </span>
          </p>

          {data?.sheetUrl ? (
            <a
              href={data.sheetUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ExternalLink className="w-4 h-4" /> Abrir a planilha de CRM
            </a>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma planilha criada ainda.</p>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => create.mutate()}
              disabled={create.isPending || !data?.connected || Boolean(data?.sheetId)}
              className="inline-flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground disabled:opacity-50"
            >
              Criar planilha de CRM
            </button>
            <button
              type="button"
              onClick={() => sync.mutate()}
              disabled={sync.isPending || !data?.sheetId}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${sync.isPending ? "animate-spin" : ""}`} /> Sincronizar agora
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
