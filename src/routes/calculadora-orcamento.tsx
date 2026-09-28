import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calculator, Check, ArrowRight, TrendingUp, Shield, Zap, MessageCircle, Sparkles, Info } from "lucide-react";
import { ORIGIN } from "@/lib/seo";
import { trackConversion, trackEvent } from "@/lib/analytics";
import { useWaFunnel } from "@/components/site/WaFunnelModal";

export const Route = createFileRoute("/calculadora-orcamento")({
  head: () => ({
    meta: [
      { title: "Estimador de Escopo e Investimento Digital | 0WEB" },
      {
        name: "description",
        content:
          "Estime uma faixa orientativa de planejamento para SEO, mídia, social, sites e operação digital a partir de serviço, porte e objetivo. Não substitui proposta comercial.",
      },
      { property: "og:title", content: "Estimador de Escopo e Investimento Digital | 0WEB" },
      {
        property: "og:description",
        content:
          "Ferramenta orientativa para estimar faixa de planejamento digital e entender os fatores que alteram o escopo antes de solicitar uma proposta.",
      },
      { property: "og:url", content: `${ORIGIN}/calculadora-orcamento` },
      { property: "og:type", content: "website" },
      { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1" },
    ],
    links: [{ rel: "canonical", href: `${ORIGIN}/calculadora-orcamento` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": `${ORIGIN}/calculadora-orcamento#webpage`,
              url: `${ORIGIN}/calculadora-orcamento`,
              name: "Estimador de Escopo e Investimento Digital",
              description: "Ferramenta orientativa para estimar uma faixa de planejamento a partir de serviço, porte e objetivo.",
              inLanguage: "pt-BR",
              isPartOf: { "@id": `${ORIGIN}/#website` },
            },
            {
              "@type": "FAQPage",
              "@id": `${ORIGIN}/calculadora-orcamento#faq`,
              mainEntity: [
                {
                  "@type": "Question",
                  name: "A faixa calculada é uma proposta comercial?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Não. É uma referência orientativa baseada em parâmetros internos de serviço, porte e objetivo. Escopo, integrações, mídia, conteúdo e condições reais podem alterar a proposta.",
                  },
                },
                {
                  "@type": "Question",
                  name: "A calculadora garante retorno ou resultado?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Não. A ferramenta não prevê ROI, vendas, leads ou posição no Google. Ela apenas organiza uma faixa de planejamento para iniciar a conversa.",
                  },
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: CalculadoraPage,
});

// =====================================================================
// Modelo orientativo de planejamento.
// As faixas abaixo são parâmetros internos da ferramenta, não tabela oficial,
// proposta comercial nem comparação de preço com o mercado.
// =====================================================================
type ServiceKey = "seo" | "ads" | "social" | "site" | "full";
type SizeKey = "mei" | "pequena" | "media" | "grande";
type GoalKey = "leads" | "vendas" | "marca" | "local";

const SERVICES: Record<ServiceKey, { label: string; base: [number, number]; desc: string }> = {
  seo: { label: "SEO Orgânico", base: [1800, 4500], desc: "Diagnóstico, conteúdo, técnica e autoridade conforme escopo" },
  ads: { label: "Google & Meta Ads", base: [2500, 8000], desc: "Gestão e estrutura de mídia conforme canais e verba" },
  social: { label: "Gestão de Redes Sociais", base: [1500, 4000], desc: "Conteúdo, design e comunidade" },
  site: { label: "Criação de Site / Landing", base: [3500, 18000], desc: "Projeto web conforme páginas, conteúdo, integrações e complexidade" },
  full: { label: "Operação Integrada", base: [6000, 22000], desc: "Combinação de SEO, mídia, social e web conforme escopo" },
};

const SIZE_MULT: Record<SizeKey, { label: string; mult: number }> = {
  mei: { label: "MEI / Autônomo", mult: 0.7 },
  pequena: { label: "Pequena empresa (até 20 colab.)", mult: 1.0 },
  media: { label: "Média empresa (20–100 colab.)", mult: 1.6 },
  grande: { label: "Grande empresa (100+ colab.)", mult: 2.4 },
};

const GOALS: Record<GoalKey, { label: string; bonus: number; kpi: string }> = {
  leads: { label: "Gerar mais leads qualificados", bonus: 1.0, kpi: "Custo por Lead (CPL)" },
  vendas: { label: "Aumentar vendas / faturamento", bonus: 1.15, kpi: "ROAS (retorno sobre o investimento)" },
  marca: { label: "Fortalecer marca e autoridade", bonus: 0.9, kpi: "Alcance qualificado e share of voice" },
  local: { label: "Atrair clientes da minha região", bonus: 0.85, kpi: "Ligações, rotas e visitas locais" },
};

function fmtBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

function CalculadoraPage() {
  const { open } = useWaFunnel();
  const [service, setService] = useState<ServiceKey | "">("");
  const [size, setSize] = useState<SizeKey | "">("");
  const [goal, setGoal] = useState<GoalKey | "">("");
  const [step, setStep] = useState<"form" | "result">("form");

  const result = useMemo(() => {
    if (!service || !size || !goal) return null;
    const [lo, hi] = SERVICES[service].base;
    const m = SIZE_MULT[size].mult * GOALS[goal].bonus;
    const min = Math.round((lo * m) / 100) * 100;
    const max = Math.round((hi * m) / 100) * 100;
    return {
      min,
      max,
      multiplier: m,
      service: SERVICES[service],
      size: SIZE_MULT[size],
      goal: GOALS[goal],
    };
  }, [service, size, goal]);

  const canSubmit = !!service && !!size && !!goal;

  function handleCalcular() {
    if (!canSubmit) return;
    trackEvent("calculator_submit", { service, size, goal });
    setStep("result");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleWhats() {
    if (!result) return;
    trackConversion("contact_cta_click", { location: "calculator_result", value: result.max, service: result.service.label });
    open("calculator_result");
  }

  return (
    <main className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5 pointer-events-none" />
        <div className="relative mx-auto max-w-6xl px-5 lg:px-8 py-16 lg:py-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <Calculator className="w-3.5 h-3.5" /> Calculadora gratuita · 30 segundos
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight">
            Qual faixa de planejamento <span className="text-gradient">faz sentido explorar</span> no digital?
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground">
            Use serviço, porte e objetivo para gerar uma faixa orientativa de planejamento. O cálculo usa parâmetros internos
            da ferramenta e serve para organizar a conversa — não substitui diagnóstico, proposta ou validação do escopo real.
          </p>

          <ul className="mt-8 grid sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left">
            {[
              { Icon: TrendingUp, t: "Modelo transparente", d: "Serviço × porte × objetivo formam a faixa orientativa" },
              { Icon: Shield, t: "Sem cadastro obrigatório", d: "Resultado na hora, sem captura de e-mail" },
              { Icon: Zap, t: "Planejamento, não promessa", d: "A faixa não garante ROI, leads, vendas ou ranking" },
            ].map(({ Icon, t, d }) => (
              <li key={t} className="flex gap-3 rounded-2xl border border-border bg-card/60 backdrop-blur p-4">
                <Icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">{t}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CALCULADORA */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <AnimatePresence mode="wait">
            {step === "form" ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-xl"
              >
                <Field
                  label="1. Qual serviço você precisa?"
                  options={Object.entries(SERVICES).map(([k, v]) => ({
                    value: k,
                    label: v.label,
                    hint: v.desc,
                  }))}
                  value={service}
                  onChange={(v) => setService(v as ServiceKey)}
                />
                <Field
                  label="2. Qual o porte da sua empresa?"
                  options={Object.entries(SIZE_MULT).map(([k, v]) => ({ value: k, label: v.label }))}
                  value={size}
                  onChange={(v) => setSize(v as SizeKey)}
                />
                <Field
                  label="3. Qual o seu principal objetivo?"
                  options={Object.entries(GOALS).map(([k, v]) => ({ value: k, label: v.label }))}
                  value={goal}
                  onChange={(v) => setGoal(v as GoalKey)}
                />

                <button
                  type="button"
                  disabled={!canSubmit}
                  onClick={handleCalcular}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground font-semibold px-6 py-4 disabled:opacity-50 hover:bg-primary/90 transition"
                >
                  Calcular meu plano <ArrowRight className="w-4 h-4" />
                </button>
                <p className="mt-3 text-xs text-center text-muted-foreground">
                  100% gratuito · sem cadastro · resultado imediato
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {result && (
                  <>
                    <div className="rounded-3xl bg-foreground text-background p-8 sm:p-10 relative overflow-hidden">
                      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/30 blur-3xl" />
                      <p className="relative inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
                        <Sparkles className="w-3.5 h-3.5" /> Sua estimativa orientativa
                      </p>
                      <h2 className="relative mt-4 text-2xl sm:text-3xl font-display font-bold">
                        {result.service.label} · {result.size.label}
                      </h2>
                      <p className="relative mt-1 text-background/70">Objetivo: {result.goal.label}</p>

                      <div className="relative mt-8 grid sm:grid-cols-2 gap-4">
                        <div className="rounded-2xl bg-background/5 border border-background/10 p-5">
                          <p className="text-xs uppercase tracking-wider text-background/60">Faixa orientativa</p>
                          <p className="mt-2 text-3xl sm:text-4xl font-display font-bold text-accent">
                            {fmtBRL(result.min)}
                            <span className="text-lg text-background/60"> a </span>
                            {fmtBRL(result.max)}
                          </p>
                          <p className="text-xs text-background/60 mt-1">/mês · sem fidelidade abusiva</p>
                        </div>
                        <div className="rounded-2xl bg-background/5 border border-background/10 p-5">
                          <p className="text-xs uppercase tracking-wider text-background/60">Como ler o resultado</p>
                          <p className="mt-2 text-sm leading-6 text-background/80">
                            É uma referência de planejamento gerada pela ferramenta. Não inclui automaticamente mídia,
                            licenças, integrações, produção externa ou outros itens que dependam do escopo.
                          </p>
                        </div>
                      </div>

                      <div className="relative mt-8 grid sm:grid-cols-2 gap-3 text-sm">
                        <Bullet>
                          Métrica de referência: <strong>{result.goal.kpi}</strong>
                        </Bullet>
                        <Bullet>O porte modifica a complexidade usada no cálculo orientativo</Bullet>
                        <Bullet>O objetivo aplica um fator diferente sobre a faixa-base do serviço</Bullet>
                        <Bullet>A proposta final depende do escopo validado no atendimento</Bullet>
                      </div>

                      <button
                        type="button"
                        onClick={handleWhats}
                        className="relative mt-8 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-accent text-foreground font-semibold px-7 py-4 hover:brightness-110 transition"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Levar estimativa para o atendimento
                      </button>
                    </div>

                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => setStep("form")}
                        className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                      >
                        ← Refazer cálculo com outros parâmetros
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="py-16 border-t border-border bg-muted/30" aria-labelledby="metodologia-calculadora">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="max-w-3xl">
            <h2 id="metodologia-calculadora" className="text-3xl sm:text-4xl font-display font-bold">
              Como a estimativa é calculada
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Cada serviço possui uma faixa-base interna da ferramenta. O porte aplica um fator de complexidade e o objetivo
              aplica outro fator de planejamento. O resultado é arredondado para uma faixa simples e não consulta preço de concorrente.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-border bg-card p-6">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-semibold">1. Serviço</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">SEO, mídia, social, projeto web e operação integrada partem de faixas de referência diferentes.</p>
            </article>
            <article className="rounded-2xl border border-border bg-card p-6">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-semibold">2. Porte</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">O porte funciona como aproximação de complexidade operacional; ele não determina sozinho o preço de um projeto.</p>
            </article>
            <article className="rounded-2xl border border-border bg-card p-6">
              <Zap className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-semibold">3. Objetivo</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Leads, vendas, marca e presença local mudam a prioridade e o tipo de medição sugerido.</p>
            </article>
          </div>

          <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold">O que a ferramenta não calcula</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Não prevê retorno financeiro, posição no Google, volume de leads, tempo de implantação nem preço de outras empresas.
                  Também não substitui uma proposta baseada em páginas, integrações, conteúdo, mídia, acessos e condições reais.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-display font-bold">Perguntas sobre a estimativa</h2>
            <div className="mt-5 divide-y divide-border rounded-2xl border border-border bg-card">
              <details className="p-5">
                <summary className="cursor-pointer font-semibold">A faixa calculada é uma proposta comercial?</summary>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">Não. Ela é uma referência interna de planejamento para organizar o primeiro contato.</p>
              </details>
              <details className="p-5">
                <summary className="cursor-pointer font-semibold">A calculadora garante retorno ou resultado?</summary>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">Não. ROI, vendas, leads e ranking dependem de variáveis que a ferramenta não consegue prever.</p>
              </details>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string; hint?: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-8">
      <p className="font-semibold mb-3">{label}</p>
      <div className="grid sm:grid-cols-2 gap-2">
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              className={`text-left rounded-xl border p-4 transition ${
                active
                  ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                  : "border-border bg-background hover:border-primary/40"
              }`}
            >
              <div className="flex items-start gap-2">
                <div
                  className={`mt-0.5 w-4 h-4 rounded-full border-2 ${
                    active ? "border-primary bg-primary" : "border-muted-foreground/40"
                  }`}
                />
                <div>
                  <p className="font-medium text-sm leading-tight">{o.label}</p>
                  {o.hint && <p className="text-xs text-muted-foreground mt-1">{o.hint}</p>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-background/90">
      <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  );
}
