import type { PortfolioSeoContextOverride } from "@/lib/portfolio-seo-network";
import {
  relatedPortfolioItemListSchema,
  relatedPortfolioSeoItems,
  resolvePortfolioSeoDescriptor,
  portfolioSemanticContext,
  portfolioEntityGraphSchema,
} from "@/lib/portfolio-seo-network";

type Props = {
  slug: string;
  context?: PortfolioSeoContextOverride;
};

function relationLabel(reason: "city" | "segment" | "affinity" | "state" | "discovery"): string {
  if (reason === "city") return "Mesma cidade";
  if (reason === "segment") return "Mesmo segmento";
  if (reason === "affinity") return "Afinidade de serviços";
  if (reason === "state") return "Mesma região";
  return "Outro projeto publicado";
}

export function PortfolioSeoNetwork({ slug, context }: Props) {
  const current = resolvePortfolioSeoDescriptor(slug, context);
  const related = relatedPortfolioSeoItems(slug, context, 6);
  const semantic = portfolioSemanticContext(slug, context);
  const schema = relatedPortfolioItemListSchema(slug, context, 6);
  const entityGraph = portfolioEntityGraphSchema(slug, context);

  if (!current || related.length < 3) return null;

  const citySpecific = related.filter((item) => item.reason === "city").length >= 2;
  const heading =
    citySpecific && current.city
      ? `Outros projetos publicados em ${current.city}`
      : "Outros projetos relacionados";

  return (
    <section
      data-portfolio-seo-network
      aria-labelledby={`portfolio-related-${slug}`}
      className="border-t border-black/10 bg-neutral-50 px-4 py-12 text-neutral-950"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-black uppercase tracking-[.18em] text-neutral-500">
          Explore também
        </p>
        <h2
          id={`portfolio-related-${slug}`}
          className="mt-3 max-w-3xl text-2xl font-black tracking-tight sm:text-3xl"
        >
          {heading}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base">
          Veja outras presenças digitais publicadas na 0WEB com contexto de mercado, localidade ou
          serviços relacionados.
        </p>

        {semantic && (semantic.label || semantic.topics.length || semantic.placeLinks.length) ? (
          <div className="mt-6 rounded-2xl border border-black/10 bg-white p-4 sm:p-5">
            <p className="text-xs font-black uppercase tracking-[.14em] text-neutral-500">
              Contexto do projeto
            </p>
            {semantic.label ? (
              <p className="mt-2 text-sm font-semibold text-neutral-800">{semantic.label}</p>
            ) : null}
            {semantic.topics.length ? (
              <ul aria-label="Temas deste projeto" className="mt-3 flex flex-wrap gap-2">
                {semantic.topics.map((topic) => (
                  <li key={topic} className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
                    {topic}
                  </li>
                ))}
              </ul>
            ) : null}
            {semantic.placeLinks.length ? (
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {semantic.placeLinks.map((link) => (
                  <a key={link.href} href={link.href} className="font-bold underline decoration-black/20 underline-offset-4 hover:decoration-black">
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        <nav aria-label="Projetos relacionados" className="mt-7">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug}>
                <a
                  href={`/portfolio/${item.slug}`}
                  className="block h-full rounded-2xl border border-black/10 bg-white p-4 transition hover:-translate-y-0.5 hover:border-black/20 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  <span className="text-[11px] font-black uppercase tracking-[.14em] text-neutral-500">
                    {relationLabel(item.reason)}
                  </span>
                  <span className="mt-2 block text-base font-black leading-tight">{item.title}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-neutral-600">
                    {item.subtitle || item.summary}
                  </span>
                  {(item.city || item.state) && (
                    <span className="mt-3 block text-xs font-semibold text-neutral-500">
                      {[item.city, item.state].filter(Boolean).join(" — ")}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {entityGraph ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(entityGraph).replace(/</g, "\\u003c"),
            }}
          />
        ) : null}

        {schema ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
            }}
          />
        ) : null}
      </div>
    </section>
  );
}
