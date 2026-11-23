import { useEffect, useRef } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  sourceSlug: string;
  formUrl: string;
};

/**
 * Captação institucional da 0WEB via formulário hospedado e verificado.
 * Não compartilha dados com o cliente do portfólio e não exige Supabase.
 * Opt-in por slug, sem alterar os fluxos legados dos demais portfólios.
 */
export function PortfolioHostedHostFormDialog({ open, onClose, sourceSlug, formUrl }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const priorFocus = useRef<HTMLElement | null>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    priorFocus.current = document.activeElement as HTMLElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = () => Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>('button, iframe, a[href]') ?? []
    );
    focusables()[0]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = focusables();
      if (!nodes.length) return;
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey, true);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", onKey, true);
      priorFocus.current?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#172035]/80 p-3 backdrop-blur-sm"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="host-jotform-title"
        data-testid="portfolio-host-jotform-dialog"
        data-source-portfolio={sourceSlug}
        className="flex h-[min(92dvh,840px)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">Solicitação comercial · 0WEB</p>
            <h2 id="host-jotform-title" className="mt-1 text-xl font-bold">Quero meu site profissional</h2>
            <p className="mt-1 text-sm text-slate-600">Atendimento da 0WEB; não é um contato com o estabelecimento apresentado.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar solicitação"
            className="shrink-0 rounded-full bg-slate-100 p-3 text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            <X size={20} aria-hidden="true" />
          </button>
        </header>
        <iframe
          data-funnel-provider="jotform"
          data-funnel-owner="0web"
          title="Solicitação de site profissional à 0WEB"
          src={formUrl}
          className="min-h-0 w-full flex-1 border-0"
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <footer className="border-t border-slate-200 px-5 py-3 text-center text-xs leading-5 text-slate-600">
          <p>Seus dados ficam no formulário da 0WEB. Nenhuma solicitação é enviada ao estabelecimento.</p>
          <p className="mt-2">Formulário não carregou?{" "}
            <a className="font-semibold text-slate-900 underline underline-offset-2"
              href={formUrl} target="_blank" rel="noopener noreferrer">Abrir em nova aba</a>.
          </p>
        </footer>
      </div>
    </div>
  );
}
