/**
 * Analítico do pixel do quiz: sessões, abandono por etapa, respostas mais
 * clicadas e conversão até o WhatsApp. Dados anônimos (sem PII), LGPD-safe.
 */
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { quizPixelStats } from "@/lib/quiz-pixel.functions";

export function QuizPixelPanel() {
  const fetchStats = useServerFn(quizPixelStats);
  const [days, setDays] = useState(30);

  const { data, isLoading } = useQuery({
    queryKey: ["quiz-pixel-stats", days],
    queryFn: () => fetchStats({ data: { days } }),
  });

  const kpis = [
    { label: "Sessões no quiz", value: data?.sessoes ?? 0 },
    { label: "Diagnósticos enviados", value: data?.submissoes ?? 0 },
    { label: "Intenção de WhatsApp", value: data?.intencaoWhatsapp ?? 0 },
    { label: "WhatsApp aberto", value: data?.aberturaWhatsapp ?? 0 },
    { label: "Conversão", value: `${data?.taxaConversao ?? 0}%` },
  ];

  return (
    <section className="mb-6 rounded-2xl border border-border bg-card p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Pixel do quiz</h2>
          <p className="text-xs text-muted-foreground">
            Cliques, abandono por etapa e conversão até o WhatsApp — sem dados pessoais.
          </p>
        </div>
        <label className="text-sm">
          <span className="mr-2 text-muted-foreground">Período</span>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-foreground"
          >
            <option value={7}>7 dias</option>
            <option value={30}>30 dias</option>
            <option value={90}>90 dias</option>
          </select>
        </label>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-lg bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">{k.label}</p>
            <p className="text-xl font-semibold text-foreground">{k.value}</p>
          </div>
        ))}
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Carregando eventos…</p>}

      {!isLoading && (data?.etapas.length ?? 0) === 0 && (
        <p className="text-sm text-muted-foreground">
          Ainda não há eventos do quiz no período selecionado.
        </p>
      )}

      {(data?.etapas.length ?? 0) > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">Abandono por etapa</h3>
            <ul className="space-y-2">
              {data!.etapas.map((e) => (
                <li key={`${e.stepIndex}-${e.stepKey}`}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-foreground">
                      {e.stepIndex + 1}. {e.stepKey || "etapa"}
                    </span>
                    <span className="text-muted-foreground">
                      {e.visualizacoes} views · {e.cliques} cliques · {e.taxaAbandono}% abandono
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-destructive" style={{ width: `${Math.min(e.taxaAbandono, 100)}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">Respostas mais clicadas</h3>
            <ul className="space-y-1 text-sm">
              {data!.respostas.map((r) => (
                <li key={r.label} className="flex justify-between gap-3">
                  <span className="text-foreground">{r.label}</span>
                  <span className="text-muted-foreground">{r.cliques}</span>
                </li>
              ))}
              {data!.respostas.length === 0 && (
                <li className="text-muted-foreground">Sem cliques registrados.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
