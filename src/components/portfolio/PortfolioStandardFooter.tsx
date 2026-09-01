import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import type { SurfaceVariant } from "@/lib/portfolio-global-config";

type Props = {
  siteName: string;
  variant: SurfaceVariant;
  showYear: boolean;
  hostCredit: boolean;
};

/**
 * Rodapé canônico aplicado a todo projeto `/portfolio/:slug`.
 * É neutro de identidade: nome do cliente + crédito discreto da 0WEB.
 * O shell garante que ele seja a última seção de conteúdo da página.
 */
export function PortfolioStandardFooter({ siteName, variant, showYear, hostCredit }: Props) {
  const dark = variant === "dark";
  return (
    <footer
      data-portfolio-canonical-footer
      className={
        "border-t px-5 py-6 text-xs " +
        (dark ? "border-white/10 bg-[#0b0b0f] text-slate-300" : "border-slate-200 bg-slate-50 text-slate-600")
      }
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
        <p>
          {showYear ? `© ${new Date().getFullYear()} · ` : ""}
          <strong className={dark ? "text-white" : "text-slate-800"}>{siteName}</strong>
        </p>
        {hostCredit ? (
          <PortfolioHostCredit
            className={dark ? "text-slate-400" : "text-slate-500"}
            linkClassName={
              "font-semibold underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 " +
              (dark ? "text-white hover:text-slate-200" : "text-slate-700 hover:text-slate-900")
            }
          />
        ) : null}
      </div>
    </footer>
  );
}
