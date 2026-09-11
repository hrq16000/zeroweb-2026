import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  listPortfolioMotionSettings,
  savePortfolioMotionSettings,
  type PortfolioMotionRow,
} from "@/lib/portfolio-motion-admin.functions";
import type { PortfolioMotionSettings } from "@/lib/portfolio-runtime";

/**
 * Ajuste de movimento por landing. Regula o que o projeto já declarou:
 * nunca recria a página nem inventa efeito novo.
 */
export const Route = createFileRoute("/_authenticated/app/portfolio-motion")({
  component: PortfolioMotionAdmin,
});

const INTENSITIES = ["SUBTLE", "BALANCED", "EXPRESSIVE", "IMMERSIVE"] as const;

const DEFAULTS: Required<PortfolioMotionSettings> = {
  intensity: "BALANCED",
  parallaxMax: 24,
  hover: true,
  counters: true,
  speed: 1,
};

function PortfolioMotionAdmin() {
  const queryClient = useQueryClient();
  const list = useServerFn(listPortfolioMotionSettings);
  const save = useServerFn(savePortfolioMotionSettings);

  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState<Required<PortfolioMotionSettings>>(DEFAULTS);

  const query = useQuery({
    queryKey: ["admin", "portfolio-motion"],
    queryFn: () => list({ data: undefined }),
  });

  const rows: PortfolioMotionRow[] = query.data?.rows ?? [];
  const current = rows.find((r) => r.clientKey === selected) ?? null;

  useEffect(() => {
    if (!current) return;
    setDraft({ ...DEFAULTS, ...(current.motion ?? {}) });
  }, [current?.clientKey, current?.motion]);

  const mutation = useMutation({
    mutationFn: (motion: PortfolioMotionSettings | null) =>
      save({ data: { client_key: selected as string, motion } }),
    onSuccess: () => {
      toast.success("Movimento atualizado.");
      void queryClient.invalidateQueries({ queryKey: ["admin", "portfolio-motion"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const set = <K extends keyof Required<PortfolioMotionSettings>>(
    key: K,
    value: Required<PortfolioMotionSettings>[K],
  ) => setDraft((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Movimento das landings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Regule intensidade, profundidade, microinterações e ritmo de cada página. A composição
          de cada cliente continua a mesma; aqui só se limita ou desliga o que já existe.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        <nav aria-label="Projetos" className="space-y-1">
          {query.isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}
          {rows.map((row) => (
            <button
              key={row.clientKey}
              type="button"
              onClick={() => setSelected(row.clientKey)}
              className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm ${
                selected === row.clientKey ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              <span className="truncate">{row.displayName || row.slug || row.clientKey}</span>
              {row.motion ? <span className="text-[10px] uppercase">ajustado</span> : null}
            </button>
          ))}
          {!query.isLoading && rows.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhum projeto configurado ainda.</p>
          )}
        </nav>

        {current ? (
          <section className="space-y-6 rounded-xl border border-border p-5">
            <div>
              <h2 className="text-lg font-semibold">{current.displayName || current.slug}</h2>
              <p className="text-xs text-muted-foreground">/portfolio/{current.slug}</p>
            </div>

            <div className="space-y-2">
              <Label>Intensidade</Label>
              <div className="flex flex-wrap gap-2">
                {INTENSITIES.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => set("intensity", value)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold ${
                      draft.intensity === value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Profundidade máxima do parallax: {draft.parallaxMax}px</Label>
              <Slider
                value={[draft.parallaxMax]}
                min={0}
                max={48}
                step={2}
                onValueChange={([v]) => set("parallaxMax", v ?? 0)}
              />
              <p className="text-xs text-muted-foreground">0 desliga o efeito de profundidade.</p>
            </div>

            <div className="space-y-2">
              <Label>Ritmo das entradas: {draft.speed.toFixed(2)}x</Label>
              <Slider
                value={[draft.speed]}
                min={0.5}
                max={2}
                step={0.05}
                onValueChange={([v]) => set("speed", v ?? 1)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <div>
                <Label htmlFor="hover">Microinterações ao passar o mouse</Label>
                <p className="text-xs text-muted-foreground">Elevação e brilho em cards.</p>
              </div>
              <Switch id="hover" checked={draft.hover} onCheckedChange={(v) => set("hover", v)} />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <div>
                <Label htmlFor="counters">Números contados</Label>
                <p className="text-xs text-muted-foreground">
                  Só afeta números já verificados na página; nenhum valor é criado aqui.
                </p>
              </div>
              <Switch
                id="counters"
                checked={draft.counters}
                onCheckedChange={(v) => set("counters", v)}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => mutation.mutate(draft)} disabled={mutation.isPending}>
                Salvar ajuste
              </Button>
              <Button
                variant="outline"
                onClick={() => mutation.mutate(null)}
                disabled={mutation.isPending || !current.motion}
              >
                Voltar ao movimento original do projeto
              </Button>
            </div>
          </section>
        ) : (
          <section className="rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground">
            Escolha um projeto à esquerda para ajustar o movimento.
          </section>
        )}
      </div>
    </div>
  );
}
