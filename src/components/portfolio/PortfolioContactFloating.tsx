import { MessageCircle } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import type { PortfolioClientKey } from "@/lib/portfolio-client-keys";
import type { ContactMode, ContactTheme, FloatingPosition } from "@/lib/portfolio-global-config";

type Props = {
  clientKey: PortfolioClientKey;
  studioName: string;
  recipientName: string;
  theme: ContactTheme;
  mode: ContactMode;
  label: string;
  position: FloatingPosition;
};

const POSITION: Record<FloatingPosition, string> = {
  "bottom-right": "bottom-5 right-4",
  "bottom-left": "bottom-5 left-4",
};

const THEME: Record<ContactTheme, string> = {
  pink: "bg-pink-600 text-white hover:bg-pink-500 focus-visible:ring-pink-300",
  gold: "bg-[#8a6b16] text-white hover:bg-[#a4811c] focus-visible:ring-[#D4AF37]",
  navy: "bg-[#0b2a6b] text-white hover:bg-[#123a90] focus-visible:ring-[#f7c948]",
};

/**
 * Botão flutuante universal de contato dos projetos `/portfolio/:slug`.
 * Abre o funil do próprio cliente (modal) — nunca expõe telefone, e-mail
 * ou link de mensageiro no bundle público.
 */
export function PortfolioContactFloating({
  clientKey,
  studioName,
  recipientName,
  theme,
  mode,
  label,
  position,
}: Props) {
  return (
    <PortfolioCTAQuiz
      clientKey={clientKey}
      studioName={studioName}
      recipientName={recipientName}
      theme={theme}
      mode={mode}
      ariaLabel={label}
      className={`fixed z-40 inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold shadow-lg transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${POSITION[position]} ${THEME[theme]}`}
    >
      <MessageCircle className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">Contato</span>
    </PortfolioCTAQuiz>
  );
}
