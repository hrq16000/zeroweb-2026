import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles } from "lucide-react";
import { type NavService } from "@/lib/services-nav.functions";
import { ServiceCoverImage } from "@/components/site/ServiceCoverImage";
import { servicesNavQuery } from "@/lib/services-nav-query";

type Props = {
  title?: string;
  subtitle?: string;
  /** Quantos serviços exibir (default 4). */
  limit?: number;
};

/**
 * Vitrine compacta de serviços em destaque para a home.
 * 100% gerenciada pelo painel administrativo via flag show_in_home_featured
 * e ordem display_order. Sem itens marcados, a seção não renderiza nada
 * (a Home não exibe duplicatas do catálogo).
 *
 * A query é pré-carregada no loader da rota, então SSR e cliente renderizam
 * o mesmo HTML.
 */
export function FeaturedServices({
  title = "Serviços em destaque",
  subtitle = "Selecionados pelo nosso time. Catálogo completo na página de Serviços.",
  limit = 4,
}: Props) {
  const { data } = useQuery(servicesNavQuery);
  const items = (data?.homeFeatured ?? [])
    .filter((service) => typeof service.price === "number" && service.price > 0 && Boolean(service.imageUrl))
    .slice(0, limit);
  if (items.length === 0) return null;


  return (
    <section className="py-20" id="servicos-destaque">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary inline-flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> Destaques
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold">{title}</h2>
            <p className="mt-3 text-muted-foreground">{subtitle}</p>
          </div>
          <Link
            to="/servicos"
            className="inline-flex items-center gap-2 min-h-11 text-sm font-semibold text-primary hover:underline"
          >
            Ver Serviços <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((s: NavService) => (
            <Link
              key={s.slug}
              to="/servicos/$slug"
              params={{ slug: s.slug }}
              className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-[160ms] hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="aspect-video overflow-hidden bg-muted">
                <ServiceCoverImage
                  src={s.imageUrl}
                  slug={s.slug}
                  name={s.name}
                  category={s.category}
                  alt={s.imageAlt || `Ilustração do serviço ${s.name}`}
                  width={1280}
                  height={720}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="text-[10px] uppercase tracking-wider text-primary font-bold">
                  {s.category}
                </p>
                <h3 className="mt-1 font-semibold text-base">{s.name}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                  {s.description}
                </p>
                {typeof s.price === "number" && s.price > 0 ? (
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    A partir de{" "}
                    <span className="text-primary">
                      {s.price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: s.price % 1 === 0 ? 0 : 2,
                      })}
                      {s.pricePeriod ? `/${s.pricePeriod}` : ""}
                    </span>
                  </p>
                ) : null}
                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-semibold text-primary">
                  Ver detalhes <ArrowRight className="size-3 motion-safe:transition-transform motion-safe:duration-[160ms] motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
