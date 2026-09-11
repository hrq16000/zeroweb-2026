/**
 * Acesso persistente ao funil individual do projeto.
 *
 * Adendo de autonomia §10–§13:
 * - o destino é sempre o funil do slug (`renderCta`), nunca telefone/WhatsApp;
 * - o rótulo é contextual (definido pelo Blueprint, não genérico);
 * - no mobile respeita safe-area, não cobre conteúdo permanentemente e
 *   só aparece depois da primeira dobra (sem CLS: é `fixed`).
 */
import { useFloatingConversionVisibility } from "@/hooks/useFloatingConversionVisibility";
import type { BlueprintCtaRenderer } from "@/lib/portfolio-blueprint";

export function BlueprintFloatingCta({
  renderCta,
  label,
  hint,
}: {
  renderCta: BlueprintCtaRenderer;
  label: string;
  hint?: string;
}) {
  // Ciclo único do contrato global: aparece após a dobra, some no rodapé —
  // nunca cobre cidade, créditos ou avisos legais.
  const visible = useFloatingConversionVisibility();

  return (
    <div
      aria-hidden={!visible}
      // `inert` remove foco, clique e leitura por AT enquanto o CTA está oculto.
      inert={!visible}
      data-blueprint-floating-cta={visible ? "visible" : "hidden"}
      data-motion="floatingConversion"
      data-motion-state={visible ? "played" : "idle"}
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 transition-all duration-300 motion-reduce:transition-none ${
        visible ? "visible translate-y-0 opacity-100" : "invisible translate-y-4 opacity-0"
      }`}
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
    >
      <div
        className={`flex w-full max-w-md items-center gap-3 rounded-full border border-border bg-card/95 p-1.5 pl-4 shadow-lg backdrop-blur sm:w-auto ${
          visible ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {hint ? (
          <span className="hidden text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground sm:block">
            {hint}
          </span>
        ) : null}
        {renderCta({
          placement: "floating",
          children: label,
          className:
            "inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-primary px-6 text-sm font-black uppercase tracking-[.08em] text-primary-foreground transition-transform duration-200 hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100",
        })}
      </div>
    </div>
  );
}
