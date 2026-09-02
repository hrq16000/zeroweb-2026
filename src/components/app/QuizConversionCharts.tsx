import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { quizConversionStats } from "@/lib/phone-leads.functions";

/**
 * Conversão do quiz até o contato real (lead → intenção de contato → WhatsApp
 * aberto), com recorte por segmento e por período. Somente admins recebem os
 * dados; a server function valida o papel.
 */
export function QuizConversionCharts() {
  const fetchStats = useServerFn(quizConversionStats);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["quiz-conversion", from, to],
    queryFn: () => fetchStats({ data: { from: from || undefined, to: to || undefined } }),
  });

  const total = data?.total ?? { leads: 0, intencao: 0, contato: 0 };
  const taxa = total.leads ? Math.round((total.contato / total.leads) * 100) : 0;

  return (
    <section className="rounded-2xl border border-border bg-card p-4 mb-6">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" aria-hidden="true" />
          Conversão do quiz até o contato real
        </h2>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <label className="flex items-center gap-2">
            De
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="text-sm rounded-lg border border-border bg-background px-2 py-1.5"
            />
          </label>
          <label className="flex items-center gap-2">
            Até
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="text-sm rounded-lg border border-border bg-background px-2 py-1.5"
            />
          </label>
        </div>
      </header>

      {error ? (
        <p className="text-xs text-muted-foreground">
          Sem permissão para ver a conversão dos leads ou dados indisponíveis.
        </p>
      ) : isLoading ? (
        <p className="text-xs text-muted-foreground">Carregando…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: "Leads do quiz", value: total.leads },
              { label: "Intenção de contato", value: total.intencao },
              { label: "Contato real", value: total.contato },
              { label: "Taxa de conversão", value: `${taxa}%` },
            ].map((k) => (
              <div key={k.label} className="rounded-xl border border-border bg-background p-3">
                <div className="text-xs text-muted-foreground">{k.label}</div>
                <div className="text-xl font-bold tabular-nums">{k.value}</div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground mb-2">Por segmento</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.porSegmento ?? []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="chave" tick={{ fontSize: 11 }} interval={0} angle={-20} height={50} textAnchor="end" />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="leads" name="Leads" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="intencao" name="Intenção" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="contato" name="Contato real" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground mb-2">Por período</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data?.porPeriodo ?? []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="chave" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="leads" name="Leads" stroke="hsl(var(--muted-foreground))" dot={false} />
                    <Line type="monotone" dataKey="contato" name="Contato real" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {(data?.porSegmento?.length ?? 0) === 0 && (
            <p className="mt-3 text-xs text-muted-foreground">Sem leads no recorte selecionado.</p>
          )}
        </>
      )}
    </section>
  );
}
