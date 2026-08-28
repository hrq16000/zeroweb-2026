import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowRight, CheckCircle2, MessageCircle, Sparkles, X } from "lucide-react";
import { trackConversion, trackEvent, trackWhatsAppClick } from "@/lib/analytics";
import { persistWaFunnelConversion, persistWaFunnelOpen, persistWaFunnelStep } from "@/lib/persistence";
import { submitPortfolioQuiz } from "@/lib/dynamic-funnel.functions";
import type { PortfolioClientKey } from "@/lib/portfolio-client-keys";
import { formatLocation, getGeoForLead } from "@/lib/geo-location";

type Theme = "pink" | "gold" | "navy";
type Answers = { service: string; experience: string; period: string; timing: string; note: string };

export type PortfolioQuizConfig = {
  services?: string[];
  experienceOptions?: string[];
  periodOptions?: string[];
  timingOptions?: string[];
  stepTitles?: Partial<Record<"service" | "experience" | "period" | "timing" | "note", string>>;
  stepSubtitles?: Partial<Record<"service" | "experience" | "period" | "timing" | "note", string>>;
  notePlaceholder?: string;
  /** Ajusta a copy de propostas para prestadores de serviço; o padrão legado é campanha. */
  proposalKind?: "campaign" | "service";
};

type Props = {
  clientKey: PortfolioClientKey;
  studioName: string;
  theme: Theme;
  service?: string;
  recipientName: string;
  mode?: "booking" | "proposal";
  quizConfig?: PortfolioQuizConfig;
  className?: string;
  ariaLabel?: string;
  onOpen?: () => void;
  orderContext?: {
    order_items?: string;
    order_total?: string;
    fulfillment?: string;
    customer_note?: string;
  };
  children: ReactNode;
};

const SERVICES = [
  "Cílios — Volume Egípcio ou Brasileiro",
  "Alongamento de unhas",
  "Sobrancelhas e henna",
  "Spa dos pés / autocuidado",
  "Quero uma orientação para escolher",
];
const PROPOSAL_SERVICES = [
  "Panfletagem e mão a mão",
  "Semáforo e cancela",
  "Bandeiras e faixas",
  "Entrega de brindes",
  "Ação personalizada",
];
const PROPOSAL_EXPERIENCE = [
  "É uma campanha nova",
  "Quero reforçar uma campanha existente",
  "Estou abrindo uma unidade ou fazendo inauguração",
  "Ainda estou definindo a melhor estratégia",
];
const PROPOSAL_PERIODS = ["Dias úteis", "Fim de semana", "Horário de pico", "Ainda preciso de orientação"];
const PROPOSAL_TIMINGS = ["Nos próximos 7 dias", "Ainda neste mês", "No próximo mês", "Estou planejando com antecedência"];
const EXPERIENCE = [
  "É minha primeira aplicação",
  "Quero fazer manutenção",
  "Já faço, mas quero trocar de profissional",
  "Quero tirar algumas dúvidas antes",
];
const PERIODS = ["Manhã", "Tarde", "Noite", "Tenho flexibilidade"];
const TIMINGS = ["Hoje ou amanhã", "Ainda nesta semana", "Na próxima semana", "Quero a primeira vaga disponível"];

function whatsappMessage(studioName: string, answers: Answers, recipientName: string, mode: Props["mode"], proposalKind: PortfolioQuizConfig["proposalKind"] = "service", pageUrl = "", location = "") {
  const isProposal = mode === "proposal";
  const isServiceProposal = isProposal && proposalKind === "service";
  const lines = [
    isProposal ? "*PEDIDO DE PROPOSTA*" : "*PEDIDO DE AGENDAMENTO*",
    "",
    `Olá, ${recipientName}! Tudo bem?`,
    "",
    `Vim pela página da *${studioName}* e quero conversar sobre ${isServiceProposal ? "um serviço" : isProposal ? "uma campanha" : "um atendimento"}.`,
    ...(pageUrl ? [`🔗 URL completa: ${pageUrl}`] : []),
    "✨ A página é linda, parabéns! Encontrei exatamente o que procurava.",
    ...(location ? [`📍 Sou de ${location}.`] : []),
    isProposal ? `Deixei ${isServiceProposal ? "os detalhes" : "o briefing"} abaixo para facilitar a proposta:` : "Deixei as preferências abaixo para facilitar o agendamento:",
    "",
    isProposal ? "*BRIEFING DA CAMPANHA*" : "*PREFERÊNCIAS DO ATENDIMENTO*",
    (isProposal ? `• *${isServiceProposal ? "Serviço" : "Formato da ação"}:* ` : "• *Procedimento:* ") + (answers.service || "Quero orientação para escolher"),
    (isProposal ? "• *Objetivo/momento:* " : "• *Momento:* ") + (answers.experience || (isProposal ? "Quero conversar sobre o objetivo" : "Quero conversar antes de decidir")),
    (isProposal ? "• *Janela da ação:* " : "• *Melhor período:* ") + (answers.period || (isProposal ? "Ainda preciso de orientação" : "Tenho flexibilidade")),
    (isProposal ? `• *${isServiceProposal ? "Prazo do serviço" : "Prazo da campanha"}:* ` : "• *Quando gostaria:* ") + (answers.timing || (isProposal ? "Estou planejando com antecedência" : "Quero a primeira vaga disponível")),
  ];

  if (answers.note.trim()) lines.push("", "*OBSERVAÇÃO*", answers.note.trim());

  lines.push(
    "",
    "*PRÓXIMO PASSO*",
    isProposal ? "Pode me orientar sobre equipe, locais, quantidade de promotores e investimento estimado, por favor?" : "Pode me enviar as próximas vagas disponíveis e confirmar o tempo estimado do atendimento, por favor?",
    "",
    "Aguardo seu retorno.",
  );
  return lines.join("\n");
}

/** Adia efeitos não visuais para depois da pintura, mantendo o clique instantâneo. */
function queueTelemetry(task: () => void) {
  if (typeof window === "undefined") return;
  const idle = (window as unknown as { requestIdleCallback?: (cb: () => void) => number })
    .requestIdleCallback;
  if (idle) idle(task);
  else window.setTimeout(task, 0);
}

const THEMES: Record<Theme, { accent: string; accentText: string; optionClass: string; primaryClass: string; panel: string; titleClass: string }> = {
  pink: {
    accent: "#f472b6",
    accentText: "text-pink-300",
    optionClass: "border-pink-400/35 bg-pink-500/10 hover:border-pink-300/80 hover:bg-pink-500/20",
    primaryClass: "bg-pink-500 text-white hover:bg-pink-400",
    panel: "bg-[#160d13]",
    titleClass: "font-serif",
  },
  gold: {
    accent: "#D4AF37",
    accentText: "text-[#D4AF37]",
    optionClass: "border-[#D4AF37]/35 bg-[#D4AF37]/10 hover:border-[#D4AF37]/80 hover:bg-[#D4AF37]/20",
    primaryClass: "bg-[#D4AF37] text-black hover:bg-[#ecd080]",
    panel: "bg-[#0C0A0B]",
    titleClass: "font-serif",
  },
  navy: {
    accent: "#f7c948",
    accentText: "text-[#f7c948]",
    optionClass: "border-[#f7c948]/35 bg-[#f7c948]/10 hover:border-[#f7c948]/80 hover:bg-[#f7c948]/20",
    primaryClass: "bg-[#f7c948] text-[#10295d] hover:bg-[#ffe08a]",
    panel: "bg-[#071b49]",
    titleClass: "font-sans",
  },
};

export function BeautyBookingQuiz({
  clientKey,
  studioName,
  theme,
  service,
  recipientName,
  mode = "booking",
  quizConfig,
  className,
  ariaLabel,
  onOpen,
  orderContext,
  children,
}: Props) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ service: service ?? "", experience: "", period: "", timing: "", note: "" });
  const [redirecting, setRedirecting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [previewLocation, setPreviewLocation] = useState("");
  const submitPortfolio = useServerFn(submitPortfolioQuiz);
  const dialogRef = useRef<HTMLDivElement>(null);
  const look = THEMES[theme];
  const { accent, accentText, optionClass, primaryClass, panel, titleClass } = look;
  const isProposal = mode === "proposal";
  const isServiceProposal = isProposal && quizConfig?.proposalKind !== "campaign";
  const serviceOptions = quizConfig?.services ?? (isServiceProposal ? SERVICES : isProposal ? PROPOSAL_SERVICES : SERVICES);
  const experienceOptions = quizConfig?.experienceOptions ?? (isServiceProposal ? EXPERIENCE : isProposal ? PROPOSAL_EXPERIENCE : EXPERIENCE);
  const periodOptions = quizConfig?.periodOptions ?? (isServiceProposal ? PERIODS : isProposal ? PROPOSAL_PERIODS : PERIODS);
  const timingOptions = quizConfig?.timingOptions ?? (isServiceProposal ? TIMINGS : isProposal ? PROPOSAL_TIMINGS : TIMINGS);
  const services = Array.from(new Set(service ? [service, ...serviceOptions] : serviceOptions));

  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const funnelContext = { location: "portfolio_cta_quiz", studio_name: studioName, recipient_name: recipientName, page_type: "portfolio_client", client_key: clientKey };

  const start = () => {
    onOpen?.();
    setAnswers({ service: service ?? "", experience: "", period: "", timing: "", note: "" });
    setStep(0);
    void getGeoForLead().then((geo) => setPreviewLocation(formatLocation(geo)));
    setOpen(true);
    // Telemetria fora do caminho crítico: o modal abre no mesmo frame do clique.
    queueTelemetry(() => {
      trackConversion("wa_funnel_open", funnelContext);
      void persistWaFunnelOpen(5);
    });
  };

  const choose = (field: keyof Omit<Answers, "note">, value: string) => {
    const next = { ...answers, [field]: value };
    const stepIndex = step + 1;
    setAnswers(next);
    setStep((current) => current + 1);
    queueTelemetry(() => {
      trackEvent("wa_funnel_step", { ...funnelContext, step_id: field, step_index: stepIndex });
      void persistWaFunnelStep(stepIndex, next);
    });
  };

  const showMessage = () => {
    const nextStep = 5;
    trackEvent("wa_funnel_step", { ...funnelContext, step_id: "note", step_index: nextStep });
    void persistWaFunnelStep(nextStep, answers);
    setStep(nextStep);
  };

  const completeInWhatsApp = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (redirecting) return;
    const conversion = { ...funnelContext, steps: 5, service: answers.service || "orientacao" };
    trackConversion("wa_funnel_complete", conversion);
    trackWhatsAppClick("portfolio_cta_quiz_complete", conversion);
    void persistWaFunnelConversion({ ...answers, studio: studioName, source: "portfolio_client" });
    setRedirecting(true);
    setSubmitError(null);
    try {
      const result = await submitPortfolio({ data: {
        clientKey,
        studioName,
        recipientName,
        mode: mode ?? "booking",
        answers,
        pageUrl: window.location.href,
        orderContext,
      }});
      window.location.assign(result.redirectPath);
    } catch {
      setRedirecting(false);
      setSubmitError("Não foi possível abrir o atendimento agora. Tente novamente em instantes.");
    }
  };

  const question = step === 0
    ? { label: "1 de 5", title: quizConfig?.stepTitles?.service ?? (isProposal ? "Qual ação você quer planejar?" : "Qual atendimento você quer agendar?"), subtitle: quizConfig?.stepSubtitles?.service ?? (isProposal ? `Assim ${recipientName} já entende o formato ideal para sua campanha.` : "Assim já preparamos a melhor orientação para você."), field: "service" as const, options: services }
    : step === 1
      ? { label: "2 de 5", title: quizConfig?.stepTitles?.experience ?? (isProposal ? "Qual é o objetivo principal da ação?" : "Você já conhece esse procedimento?"), subtitle: quizConfig?.stepSubtitles?.experience ?? (isProposal ? "Essa resposta ajuda a montar uma equipe alinhada ao que você precisa divulgar." : "Isso ajuda a profissional a entender o seu momento."), field: "experience" as const, options: experienceOptions }
      : step === 2
        ? { label: "3 de 5", title: quizConfig?.stepTitles?.period ?? (isProposal ? "Quando a ação deve acontecer?" : "Qual período costuma ser melhor para você?"), subtitle: quizConfig?.stepSubtitles?.period ?? (isProposal ? `Assim ${recipientName} consegue pensar em escala e pontos de maior movimento.` : "Vamos tentar encontrar a vaga mais confortável."), field: "period" as const, options: periodOptions }
        : step === 3
          ? { label: "4 de 5", title: quizConfig?.stepTitles?.timing ?? (isProposal ? "Qual é o prazo da campanha?" : "Quando você gostaria de vir?"), subtitle: quizConfig?.stepSubtitles?.timing ?? (isProposal ? "Uma previsão de prazo deixa a proposta muito mais precisa." : "Escolha a opção mais próxima da sua necessidade."), field: "timing" as const, options: timingOptions }
          : null;
  return (
    <>
      <button type="button" onClick={start} className={className} aria-label={ariaLabel}>
        {children}
      </button>

      {open && typeof document !== "undefined" ? createPortal((
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 p-3 backdrop-blur-sm sm:items-center sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="portfolio-cta-quiz-title" tabIndex={-1} className={"w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/15 text-white shadow-2xl outline-none " + panel}>
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-7">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ backgroundColor: accent + "22", color: accent }}>
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className={"text-xs font-bold uppercase tracking-[0.18em] " + accentText}>{mode === "proposal" ? "Proposta inteligente" : "Agendamento inteligente"}</p>
                  <p className="text-sm text-gray-300">Leva menos de um minuto</p>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 text-gray-400 transition hover:bg-white/10 hover:text-white" aria-label="Fechar mini questionário">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="px-5 py-6 sm:px-7 sm:py-8">
              {step < 4 && question ? (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <p className={"text-xs font-bold uppercase tracking-[0.2em] " + accentText}>{question.label}</p>
                    <h2 id="portfolio-cta-quiz-title" className={"text-2xl font-bold " + titleClass}>{question.title}</h2>
                    <p className="text-sm leading-relaxed text-gray-400">{question.subtitle}</p>
                  </div>
                  <div className="grid gap-2.5">
                    {question.options.map((option) => (
                      <button key={option} type="button" onClick={() => choose(question.field, option)} className={"w-full rounded-2xl border px-4 py-3.5 text-left text-sm font-semibold transition " + optionClass}>
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ) : step === 4 ? (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <p className={"text-xs font-bold uppercase tracking-[0.2em] " + accentText}>5 de 5</p>
                    <h2 id="portfolio-cta-quiz-title" className={"text-2xl font-bold " + titleClass}>{quizConfig?.stepTitles?.note ?? "Quer acrescentar algum detalhe?"}</h2>
                    <p className="text-sm leading-relaxed text-gray-400">{quizConfig?.stepSubtitles?.note ?? (isProposal ? "É opcional. Conte sobre região, quantidade, material ou alguma necessidade especial." : "É opcional. Você pode contar se tem preferência de estilo, horário ou alguma dúvida.")}</p>
                  </div>
                  <textarea value={answers.note} onChange={(event) => setAnswers((current) => ({ ...current, note: event.target.value.slice(0, 280) }))} maxLength={280} rows={4} placeholder={quizConfig?.notePlaceholder ?? (isProposal ? "Ex.: ação em dois bairros, com entrega de brindes e previsão para o próximo mês." : "Ex.: gosto de um efeito mais natural e consigo depois das 18h.")} className="w-full resize-none rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-white/40" />
                  <button type="button" onClick={showMessage} className={"inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold transition " + primaryClass}>
                    Ver minha mensagem pronta <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <span className={"inline-flex h-11 w-11 items-center justify-center rounded-2xl " + optionClass + " " + accentText}><CheckCircle2 className="h-6 w-6" aria-hidden="true" /></span>
                    <h2 id="portfolio-cta-quiz-title" className={"text-2xl font-bold " + titleClass}>Prontinho — sua mensagem está personalizada</h2>
                    <p className="text-sm leading-relaxed text-gray-400">{recipientName} receberá seus dados organizados e já poderá preparar o próximo passo.</p>
                  </div>
                  <div className="max-h-40 overflow-auto rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-relaxed whitespace-pre-wrap text-gray-300">
                    {whatsappMessage(
                      studioName,
                      answers,
                      recipientName,
                      mode,
                      quizConfig?.proposalKind,
                      typeof window !== "undefined" ? window.location.href : "",
                      previewLocation,
                    )}
                  </div>
                  <button type="button" onClick={completeInWhatsApp} disabled={redirecting} className={"inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold transition disabled:cursor-wait disabled:opacity-70 " + primaryClass}>
                    <MessageCircle className="h-5 w-5" aria-hidden="true" />
                    {redirecting ? "Preparando seu atendimento…" : mode === "proposal" ? `Continuar pedido para ${recipientName}` : "Continuar meu pedido"}
                  </button>
                  {submitError && <p className="text-center text-xs text-red-300" role="alert">{submitError}</p>}
                  <button type="button" onClick={() => setStep(4)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold text-gray-400 transition hover:text-white">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Ajustar observação
                  </button>
                </div>
              )}
            </div>
            <div className="h-1 bg-white/10" aria-hidden="true"><div className="h-full transition-all duration-300" style={{ width: Math.min(step + 1, 5) / 5 * 100 + "%", backgroundColor: accent }} /></div>
          </div>
        </div>
      ), document.body) : null}
    </>
  );
}

/** Nome recomendado para novos sites; o alias antigo permanece por compatibilidade. */
export const PortfolioCTAQuiz = BeautyBookingQuiz;
