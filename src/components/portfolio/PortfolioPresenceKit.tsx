import portfolioCatalog from "@/config/portfolio-catalog.json";

type CatalogItem = {
  slug: string;
  title: string;
  city: string;
  state: string;
  segment: string;
  tags: string[];
  summary?: string;
};

const catalog = portfolioCatalog as CatalogItem[];

const palettes: Record<string, { surface: string; ink: string; accent: string; soft: string }> = {
  beleza: { surface: "#fef1f7", ink: "#4d1938", accent: "#c82f75", soft: "#f7c4db" },
  saude: { surface: "#effbfa", ink: "#123e4a", accent: "#178c91", soft: "#bfe8e5" },
  juridico: { surface: "#f8f4eb", ink: "#302614", accent: "#98702c", soft: "#e9d8aa" },
  restaurantes: { surface: "#fff4ec", ink: "#542516", accent: "#c5502e", soft: "#f6c9b8" },
  construcao: { surface: "#f5f2ec", ink: "#302d26", accent: "#8b642c", soft: "#e1d2b2" },
  agencias: { surface: "#edf5ff", ink: "#142b4c", accent: "#2769c7", soft: "#bdd8ff" },
  comercios: { surface: "#fff5ec", ink: "#4a2816", accent: "#c75a25", soft: "#f4cfb8" },
  servicos: { surface: "#f2f7fb", ink: "#18354f", accent: "#226b98", soft: "#c7dceb" },
};

/**
 * Contrato de presença calculado a partir da fonte canônica do portfólio.
 * O conteúdo sempre nasce do próprio slug, nome, segmento, cidade e serviços;
 * jamais importa termos de outro cliente.
 */
export function getPortfolioPresenceKit(slug: string) {
  const item = catalog.find((entry) => entry.slug === slug);
  if (!item) return undefined;
  const services = item.tags.slice(0, 3).map((tag) => tag.replace(/-/g, " "));
  return {
    brandBrief: { name: item.title, segment: item.segment, city: `${item.city} — ${item.state}`, services },
    printMockup: {
      kind: "business-card-and-digital-flyer",
      status: "concept" as const,
      source: "/images/portfolio-kit/stationery-base.png",
      alt: `Base visual de papelaria para o conceito de ${item.title}`,
    },
    disclosure: "Conceito de presença e papelaria — amostra digital para avaliação; não representa material impresso aprovado.",
  };
}

export function PortfolioPresenceKit({ slug }: { slug: string }) {
  const kit = getPortfolioPresenceKit(slug);
  if (!kit) return null;
  const palette = palettes[kit.brandBrief.segment] ?? palettes.servicos;
  const serviceLine = kit.brandBrief.services.map((service) => service.replace(/\b\w/g, (letter) => letter.toUpperCase())).join(" · ");

  return <section aria-labelledby={`presence-kit-${slug}`} className="border-t border-black/5 px-5 py-16 lg:px-8" style={{ backgroundColor: palette.surface, color: palette.ink }}>
    <div className="mx-auto max-w-6xl">
      <p className="text-xs font-bold uppercase tracking-[.22em]" style={{ color: palette.accent }}>Conceito de presença e papelaria</p>
      <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><h2 id={`presence-kit-${slug}`} className="font-display text-3xl font-black sm:text-4xl">A marca também pode ganhar vida fora da tela.</h2><p className="mt-3 max-w-2xl text-base leading-7 opacity-80">Amostra visual baseada nos serviços de {kit.brandBrief.name}, para demonstrar como cartão e panfleto digital podem apoiar a divulgação local.</p></div><span className="rounded-full border px-4 py-2 text-xs font-bold" style={{ borderColor: palette.accent, color: palette.accent }}>Amostra conceitual</span></div>
      <div className="mt-10 grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
        <figure className="relative flex min-h-64 flex-col justify-between overflow-hidden rounded-[1.75rem] p-8 text-white shadow-xl" style={{ backgroundColor: palette.accent }}><img src={kit.printMockup.source} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-15 mix-blend-screen" /><div className="relative"><p className="text-xs font-bold uppercase tracking-[.2em] text-white/75">Cartão de visitas · conceito</p><h3 className="mt-7 max-w-sm font-display text-4xl font-black leading-none">{kit.brandBrief.name}</h3><p className="mt-4 text-sm leading-6 text-white/85">{serviceLine || "Atendimento especializado"}</p></div><figcaption className="relative text-sm font-semibold text-white/80">{kit.brandBrief.city}</figcaption></figure>
        <figure className="relative overflow-hidden rounded-[1.75rem] border-2 border-dashed bg-white p-8 shadow-sm" style={{ borderColor: palette.soft }}><img src={kit.printMockup.source} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-10" /><div className="absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-80" style={{ backgroundColor: palette.soft }} /><div className="relative"><p className="text-xs font-bold uppercase tracking-[.2em]" style={{ color: palette.accent }}>Panfleto digital · conceito</p><h3 className="mt-8 max-w-xl font-display text-4xl font-black leading-tight">Conheça {kit.brandBrief.name}.</h3><p className="mt-4 max-w-xl text-base leading-7 opacity-80">{serviceLine ? `Soluções em ${serviceLine}.` : "Uma presença feita para explicar serviços e iniciar uma conversa."}</p><div className="mt-8 inline-flex rounded-full px-4 py-2 text-sm font-bold" style={{ backgroundColor: palette.surface, color: palette.accent }}>Ver a presença digital</div></div><figcaption className="sr-only">Panfleto digital conceitual de {kit.brandBrief.name}</figcaption></figure>
      </div>
      <p className="mt-6 max-w-3xl text-xs leading-5 opacity-70">{kit.disclosure}</p>
    </div>
  </section>;
}
