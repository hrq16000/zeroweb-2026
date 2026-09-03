// Quiz de diagnóstico rápido — segmenta o lead em 3 perfis e grava em /app/leads.
// Sem contatos públicos: o retorno é feito pelo time via os dados enviados.
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Sparkles, X } from "lucide-react";
import { trackConversion, trackEvent } from "@/lib/analytics";
import { trackQuiz } from "@/lib/quiz-pixel";
import { persistLead } from "@/lib/persistence";

/** Identificador do quiz no pixel próprio (tela /app/leads). */
const QUIZ_KEY = "diagnostico-institucional";


export type QuizSegmentKey = "landing-rapida" | "site-institucional-funil" | "plataforma-personalizada";

export interface QuizSegment {
  key: QuizSegmentKey;
  title: string;
  summary: string;
  fit: string[];
  ctaLabel: string;
}

export const QUIZ_SEGMENTS: Record<QuizSegmentKey, QuizSegment> = {
  "landing-rapida": {
    key: "landing-rapida",
    title: "Landing rápida",
    summary:
      "Uma página única focada em uma oferta, publicada em poucos dias, com CTA direto e medição de conversão desde o primeiro clique.",
    fit: ["Prazo curto", "Objetivo único", "Investimento inicial menor"],
    ctaLabel: "Receber checklist e estimativa",
  },
  "site-institucional-funil": {
    key: "site-institucional-funil",
    title: "Site institucional com funil",
    summary:
      "Estrutura completa de páginas (institucional, serviços, provas e contato) com funil de captura, rastreamento de leads e base de SEO.",
    fit: ["Precisa gerar leads recorrentes", "Vários serviços", "Quer ranquear no Google"],
    ctaLabel: "Solicitar proposta do site institucional",
  },
  "plataforma-personalizada": {
    key: "plataforma-personalizada",
    title: "Plataforma personalizada",
    summary:
      "Projeto sob medida com integrações (ERP, CRM, pagamentos, áreas logadas) e escopo definido a partir de um diagnóstico técnico.",
    fit: ["Integrações obrigatórias", "Regras de negócio próprias", "Escopo maior"],
    ctaLabel: "Agendar diagnóstico técnico",
  },
};

type Answers = {
  business: string;
  goal: string;
  budget: string;
  deadline: string;
  integrations: string;
  traffic: string;
};

const QUESTIONS: {
  key: keyof Answers;
  label: string;
  hint?: string;
  options: { value: string; label: string }[];
}[] = [
  {
    key: "business",
    label: "Qual é o tipo do seu negócio?",
    options: [
      { value: "servicos-local", label: "Serviços locais (atendo uma região)" },
      { value: "b2b", label: "B2B / indústria / atacado" },
      { value: "profissional", label: "Profissional liberal ou consultoria" },
      { value: "comercio", label: "Comércio / loja" },
    ],
  },
  {
    key: "goal",
    label: "Qual o objetivo principal do site?",
    options: [
      { value: "leads", label: "Gerar contatos e orçamentos" },
      { value: "credibilidade", label: "Credibilidade e apresentação da empresa" },
      { value: "campanha", label: "Sustentar uma campanha específica" },
      { value: "operacao", label: "Suportar uma operação (área logada, catálogo, pedidos)" },
    ],
  },
  {
    key: "budget",
    label: "Qual a faixa de investimento aproximada?",
    hint: "Serve apenas para calibrar o escopo. Nada é cobrado neste diagnóstico.",
    options: [
      { value: "ate-2k", label: "Até R$ 2.000" },
      { value: "2k-6k", label: "Entre R$ 2.000 e R$ 6.000" },
      { value: "6k-15k", label: "Entre R$ 6.000 e R$ 15.000" },
      { value: "acima-15k", label: "Acima de R$ 15.000" },
      { value: "nao-sei", label: "Ainda não sei" },
    ],
  },
  {
    key: "deadline",
    label: "Qual o prazo desejado para estar no ar?",
    options: [
      { value: "ate-15d", label: "Até 15 dias" },
      { value: "30-45d", label: "Entre 30 e 45 dias" },
      { value: "flexivel", label: "Flexível — prefiro escopo bem feito" },
    ],
  },
  {
    key: "integrations",
    label: "Precisa de integrações com outros sistemas?",
    options: [
      { value: "nenhuma", label: "Nenhuma por enquanto" },
      { value: "basicas", label: "Básicas (WhatsApp, e-mail, agenda, analytics)" },
      { value: "avancadas", label: "Avançadas (ERP, CRM, pagamentos, login de clientes)" },
    ],
  },
  {
    key: "traffic",
    label: "Qual o nível atual de tráfego/divulgação?",
    options: [
      { value: "nenhum", label: "Praticamente nenhum" },
      { value: "organico", label: "Alguma busca orgânica / indicações" },
      { value: "pago", label: "Já invisto em anúncios pagos" },
    ],
  },
];

export function computeSegment(a: Answers): QuizSegmentKey {
  if (a.integrations === "avancadas" || a.goal === "operacao" || a.budget === "acima-15k") {
    return "plataforma-personalizada";
  }
  if (a.goal === "campanha" || (a.deadline === "ate-15d" && a.budget === "ate-2k")) {
    return "landing-rapida";
  }
  return "site-institucional-funil";
}

const EMPTY: Answers = { business: "", goal: "", budget: "", deadline: "", integrations: "", traffic: "" };

export function InstitutionalDiagnosticQuiz({
  source = "criacao-site-institucional",
  quizKey,
  city,
  onClose,
}: {
  source?: string;
  /** Chave do pixel — permite medir cada capital separadamente. */
  quizKey?: string;
  /** Cidade de origem do visitante (ex.: "Curitiba/PR"), gravada no lead. */
  city?: string;
  onClose?: () => void;
}) {
  const qk = quizKey?.slice(0, 64) || QUIZ_KEY;
  const baseId = useId();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [contact, setContact] = useState({ name: "", company: "", email: "", whatsapp: "" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<QuizSegmentKey | null>(null);
  const [error, setError] = useState<string | null>(null);

  const total = QUESTIONS.length + 1; // perguntas + etapa de contato
  const progress = Math.round(((done ? total : index) / total) * 100);
  const segment = useMemo(() => computeSegment(answers), [answers]);

  // Pixel próprio: view do quiz, view de cada etapa e abandono ao sair sem enviar.
  const enviado = useRef(false);
  useEffect(() => {
    trackQuiz({ quizKey: qk, eventType: "quiz_view" });
    return () => {
      if (!enviado.current) {
        trackQuiz({ quizKey: qk, eventType: "abandon", stepIndex: indexRef.current, stepKey: stepKeyRef.current });
      }
    };
  }, []);

  const indexRef = useRef(0);
  const stepKeyRef = useRef<string>(QUESTIONS[0]?.key ?? "contato");
  useEffect(() => {
    indexRef.current = index;
    stepKeyRef.current = (QUESTIONS[index]?.key as string) ?? "contato";
    if (!done) {
      trackQuiz({ quizKey: qk, eventType: "step_view", stepIndex: index, stepKey: stepKeyRef.current });
    }
  }, [index, done]);

  const pick = (key: keyof Answers, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    trackEvent("quiz_step", { source, step: key, value });
    trackQuiz({ quizKey: qk, eventType: "answer_click", stepIndex: index, stepKey: String(key), answerLabel: value });
    trackQuiz({ quizKey: qk, eventType: "step_complete", stepIndex: index, stepKey: String(key) });
    setIndex((i) => Math.min(i + 1, QUESTIONS.length));
  };

  const submit = async () => {
    setError(null);
    if (!contact.name.trim() || !contact.email.trim() || !contact.whatsapp.trim()) {
      setError("Preencha nome, e-mail e WhatsApp para receber o resultado.");
      return;
    }
    setSending(true);
    try {
      await persistLead({
        name: contact.name.trim(),
        email: contact.email.trim(),
        phone: contact.whatsapp.trim(),
        company: contact.company.trim() || undefined,
        source: `quiz:${source}`,
        offer_slug: "criacao-de-site-institucional",
        audience_tag: segment,
        payload: { segment, answers, quiz: qk, city: city ?? null } as never,
      });
      // Despacho para o CRM (planilha da equipe) + notificação interna.
      // Best-effort: falha aqui não pode impedir a confirmação ao visitante.
      try {
        const { dispatchCrmLead } = await import("@/lib/crm-intake.functions");
        void dispatchCrmLead({
          data: {
            phone: contact.whatsapp.trim(),
            email: contact.email.trim(),
            source: `quiz:${source}`,
          },
        }).catch(() => { /* noop */ });
      } catch { /* noop */ }

      trackConversion("quiz_complete", { source, segment });
      enviado.current = true;
      trackQuiz({ quizKey: qk, eventType: "submit", stepIndex: QUESTIONS.length, stepKey: "contato", answerLabel: segment });
      setDone(segment);
    } catch {
      setError("Não foi possível enviar agora. Tente novamente em instantes.");
    } finally {
      setSending(false);
    }
  };


  if (done) {
    const s = QUIZ_SEGMENTS[done];
    return (
      <div className="p-6 lg:p-8" role="status" aria-live="polite">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <CheckCircle2 className="w-4 h-4" /> Diagnóstico enviado
        </p>
        <h2 className="mt-3 text-2xl font-bold font-display">
          Perfil recomendado: <span className="text-gradient">{s.title}</span>
        </h2>
        <p className="mt-3 text-muted-foreground">{s.summary}</p>
        <ul className="mt-4 space-y-2 text-sm">
          {s.fit.map((f) => (
            <li key={f} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" aria-hidden="true" /> {f}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted-foreground">
          Recebemos suas respostas. Nossa equipe responde pelo contato informado com a estimativa e os próximos passos.
        </p>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="mt-6 rounded-full border border-border px-5 py-2.5 text-sm font-semibold"
          >
            Fechar
          </button>
        )}
      </div>
    );
  }

  const q = QUESTIONS[index];

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> Diagnóstico gratuito
          </p>
          <h2 className="mt-2 text-xl lg:text-2xl font-bold font-display">
            6 perguntas rápidas para indicar o formato certo
          </h2>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Fechar diagnóstico" className="p-2 rounded-full hover:bg-muted">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="mt-5">
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label="Progresso do diagnóstico"
          className="h-2 rounded-full bg-muted overflow-hidden"
        >
          <div className="h-full bg-gradient-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Etapa {Math.min(index + 1, total)} de {total}
        </p>
      </div>

      {q ? (
        <fieldset className="mt-6">
          <legend className="text-base font-semibold">{q.label}</legend>
          {q.hint && <p className="mt-1 text-xs text-muted-foreground">{q.hint}</p>}
          <div className="mt-4 grid gap-2">
            {q.options.map((o) => {
              const checked = answers[q.key] === o.value;
              return (
                <label
                  key={o.value}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm cursor-pointer transition ${
                    checked ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`${baseId}-${q.key}`}
                    value={o.value}
                    checked={checked}
                    onChange={() => pick(q.key, o.value)}
                    className="w-4 h-4 accent-primary"
                  />
                  <span>{o.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : (
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          {[
            { name: "name", label: "Nome", type: "text", full: false },
            { name: "company", label: "Empresa (opcional)", type: "text", full: false },
            { name: "email", label: "E-mail", type: "email", full: false },
            { name: "whatsapp", label: "WhatsApp", type: "tel", full: false },
          ].map((f) => (
            <div key={f.name} className={f.full ? "sm:col-span-2" : ""}>
              <label htmlFor={`${baseId}-${f.name}`} className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {f.label}
              </label>
              <input
                id={`${baseId}-${f.name}`}
                type={f.type}
                value={(contact as Record<string, string>)[f.name]}
                onChange={(e) => setContact({ ...contact, [f.name]: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          ))}
          <p className="sm:col-span-2 text-xs text-muted-foreground">
            Usamos seus dados apenas para responder este diagnóstico, conforme nossa política de privacidade.
          </p>
          {error && (
            <p className="sm:col-span-2 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={submit}
              disabled={sending}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground font-semibold px-6 py-3.5 shadow-glow-primary disabled:opacity-60"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {sending ? "Enviando…" : "Ver meu resultado"}
            </button>
          </div>
        </div>
      )}

      {index > 0 && (
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
      )}
    </div>
  );
}

/** Overlay acessível com o mesmo quiz. */
export function InstitutionalDiagnosticQuizModal({
  open,
  onClose,
  source,
  quizKey,
  city,
}: {
  open: boolean;
  onClose: () => void;
  source?: string;
  quizKey?: string;
  city?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <button aria-label="Fechar" onClick={onClose} className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Diagnóstico gratuito"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card shadow-elegant"
      >
        <InstitutionalDiagnosticQuiz source={source} quizKey={quizKey} city={city} onClose={onClose} />
      </div>
    </div>
  );
}
