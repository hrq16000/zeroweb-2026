import { motion } from "motion/react";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import { trackConversion, trackEvent } from "@/lib/analytics";
import { useWaFunnel } from "@/components/site/WaFunnelModal";
import heroDashboard from "@/assets/hero-dashboard.webp";

const stats = [
  { label: "Projetos", value: "+500" },
  { label: "Anos de experiência", value: "+20" },
  { label: "Aprovação", value: "95%" },
  { label: "Suporte", value: "Nacional" },
];

// Título e CTA unificados: uma única promessa, um único caminho (funil).
const HERO_COPY = {
  headline: "Site profissional que traz clientes",
  accent: "a partir de R$ 99,99/mês.",
  sub: "Criação de site, automações e marketing digital em um só time. Você fala com um especialista e recebe o orçamento com escopo e prazo antes de fechar.",
} as const;

const PRIMARY_CTA_LABEL = "Pedir meu orçamento";

export function Hero() {
  const copy = HERO_COPY;
  const primaryCtaLabel = PRIMARY_CTA_LABEL;
  const { open: openFunnel } = useWaFunnel();
  const sectionViewedRef = useRef(false);

  // Evento único quando a seção logo abaixo do hero entra na viewport.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const target =
      document.getElementById("servicos-destaque") ||
      document.getElementById("problemas") ||
      document.querySelector("main section:nth-of-type(2)");
    if (!target) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !sectionViewedRef.current) {
            sectionViewedRef.current = true;
            trackEvent("section_view", {
              section: target.id || "next_after_hero",
              location: "post_hero",
              route: window.location.pathname,
            });
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.35 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  const handlePrimaryCtaClick = () => {
    const route = typeof window !== "undefined" ? window.location.pathname : "ssr";
    trackConversion("contact_cta_click", { location: "hero" });
    trackEvent("cta_click", {
      label: "pedir_orcamento",
      cta_text: primaryCtaLabel,
      location: "hero",
      route,
    });
    openFunnel("hero");
  };


  return (
    <section id="inicio" className="relative pt-28 lg:pt-32 pb-24 bg-hero overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-60 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-foreground mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
            Tecnologia que gera crescimento
          </motion.div>

          <motion.h1
            
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight"
          >
            {copy.headline} <span className="text-gradient">{copy.accent}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-lg text-muted-foreground max-w-2xl"
          >
            {copy.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 flex flex-col items-start gap-3"
          >
            <button
              type="button"
              onClick={handlePrimaryCtaClick}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground font-semibold px-7 py-4 shadow-glow-primary hover:opacity-95 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background min-h-12"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>{primaryCtaLabel}</span>
              <ArrowRight
                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                aria-hidden="true"
              />
            </button>
            <p className="text-sm text-muted-foreground">
              Planos a partir de R$ 99,99/mês, com entrega em até 72 horas após a confirmação do
              pagamento. Escopo e valor confirmados no orçamento, sem compromisso.
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                <div className="text-2xl lg:text-3xl font-bold font-display tabular-nums tracking-tight">{s.value}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative">
            <div className="absolute -inset-8 bg-gradient-primary opacity-25 blur-3xl rounded-full pointer-events-none" />
            <picture>
              <img
                src={heroDashboard}
                alt="Dashboard 0WEB mostrando crescimento de tráfego orgânico e leads qualificados"
                width={1280}
                height={960}
                fetchPriority="high"
                decoding="async"
                sizes="(min-width: 1024px) 480px, 100vw"
                className="relative w-full h-auto rounded-3xl shadow-elegant border border-border/40"
              />
            </picture>
            <div className="absolute -bottom-4 -left-4 sm:-left-6 glass rounded-2xl px-4 py-3 shadow-elegant hidden sm:flex items-center gap-3">
              <span className="grid place-items-center w-9 h-9 rounded-full bg-emerald-500/15 text-emerald-600 font-bold" aria-hidden="true">↑</span>
              <div>
                <p className="text-xs text-muted-foreground">Tráfego orgânico</p>
                <p className="text-lg font-bold font-display">+312%</p>
              </div>
            </div>
            <div className="absolute -top-3 -right-3 sm:-right-6 glass rounded-2xl px-4 py-3 shadow-elegant hidden sm:block">
              <p className="text-xs text-muted-foreground">Leads/mês</p>
              <p className="text-lg font-bold font-display text-gradient">2.8k</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
