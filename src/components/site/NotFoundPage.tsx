import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Bot, Globe, Megaphone, Search } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { logNotFound } from "@/lib/route-404.functions";

const NOT_FOUND_SERVICES: Array<{ slug: string; name: string; desc: string; Icon: typeof Globe }> = [
  { slug: "criacao-de-sites", name: "Criação de Sites", desc: "Sites profissionais, rápidos e prontos para converter.", Icon: Globe },
  { slug: "seo", name: "SEO", desc: "Primeiras posições no Google com tráfego orgânico recorrente.", Icon: Search },
  { slug: "trafego-pago", name: "Tráfego Pago", desc: "Campanhas Google e Meta Ads com CPA otimizado.", Icon: Megaphone },
  { slug: "automacao-com-ia", name: "Automação com IA", desc: "Atendimento e qualificação de leads no WhatsApp.", Icon: Bot },
];

export function NotFoundPage() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const path = window.location.pathname + window.location.search;
      const key = `404-logged:${path}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
      void logNotFound({
        data: {
          path: window.location.pathname,
          referrer: document.referrer || null,
          userAgent: navigator.userAgent || null,
        },
      }).catch(() => {});
    } catch {
      /* noop */
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-1 pt-32 lg:pt-40 pb-20">
        <div className="mx-auto max-w-5xl px-5 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Erro 404</p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold font-display">
            Página não encontrada
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Mas você pode encontrar o que precisa aqui:
          </p>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {NOT_FOUND_SERVICES.map((s) => (
              <Link
                key={s.slug}
                to="/servicos/$slug"
                params={{ slug: s.slug }}
                className="group rounded-2xl border border-border bg-card p-5 hover:border-primary hover:shadow-elegant transition"
              >
                <span className="grid place-items-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
                  <s.Icon className="w-5 h-5" />
                </span>
                <h2 className="mt-4 font-semibold">{s.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{s.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Ver serviço <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground font-semibold px-6 py-3 shadow-glow-primary"
            >
              Ir para o início
            </Link>
            <Link
              to="/servicos"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-semibold hover:bg-muted transition"
            >
              Ver Serviços
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
