import portfolioCatalog from "@/config/portfolio-catalog.json";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { resolvePortfolioClientKey } from "@/lib/portfolio-global-config";
import { resolvePortfolioFunnelContext } from "@/lib/portfolio-funnel-context";

type Item = {
  slug: string;
  title: string;
  city: string;
  state: string;
  tags: string[];
  summary?: string;
  subtitle?: string;
};
const catalog = portfolioCatalog as Item[];

export function PortfolioConversionNarrative({ slug }: { slug: string }) {
  const item = catalog.find((entry) => entry.slug === slug);
  const clientKey = resolvePortfolioClientKey(slug);
  if (!item || !clientKey) return null;
  const services = item.tags.slice(0, 4).map((tag) => tag.replace(/-/g, " "));
  const description =
    item.summary ?? item.subtitle ?? `Conheça os serviços de ${item.title} em ${item.city}.`;
  // Estrutura padronizada, mensagem e ação próprias de cada negócio.
  const funnel = resolvePortfolioFunnelContext(slug);
  const narrative = {
    title: funnel.nextStepTitle,
    step: funnel.nextStepBody,
    cta: funnel.primaryCtaLabel,
    theme: funnel.theme,
  };
  return (
    <section
      aria-labelledby={`about-${slug}`}
      className="border-t border-border bg-card px-5 py-16 lg:px-8"
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">
            Sobre o projeto
          </p>
          <h2 id={`about-${slug}`} className="mt-3 font-display text-3xl font-bold text-foreground">
            {narrative.title}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{description}</p>
          <p className="mt-4 text-sm font-semibold text-foreground">
            Atendimento em {item.city} — {item.state}.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-6">
          <h3 className="font-display text-xl font-bold text-foreground">Como começar</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{narrative.step}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {services.map((service) => (
              <li
                key={service}
                className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-foreground"
              >
                {service}
              </li>
            ))}
          </ul>
          <PortfolioCTAQuiz
            clientKey={clientKey}
            studioName={item.title}
            recipientName={item.title}
            theme={narrative.theme}
            mode={funnel.quizMode}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg border border-current px-5 py-3 text-sm font-bold text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {narrative.cta}
          </PortfolioCTAQuiz>
        </div>
      </div>
    </section>
  );
}
