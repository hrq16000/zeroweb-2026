/**
 * "Projetos no ar" — vitrine dinâmica de 6 sites publicados em /portfolio/<slug>.
 *
 * A seleção é aleatória a cada carregamento. Para não quebrar a hidratação do
 * SSR, o servidor e o primeiro render do cliente usam sempre os 6 primeiros
 * itens do catálogo; o embaralhamento acontece depois da montagem.
 */
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink } from "lucide-react";
import portfolioCatalog from "@/config/portfolio-catalog.json";

type CatalogItem = {
  slug: string;
  title: string;
  subtitle?: string;
  segment?: string;
  location?: string;
  city?: string;
  state?: string;
  status?: string;
  live?: boolean;
  image?: string;
  fallbackImage?: string;
};

const LIVE = (portfolioCatalog as CatalogItem[]).filter(
  (item) => item.status === "published" && item.live !== false && Boolean(item.slug),
);

const COUNT = 6;

function shuffle<T>(list: readonly T[]): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function ProjetosNoAr() {
  const [items, setItems] = useState<CatalogItem[]>(() => LIVE.slice(0, COUNT));

  useEffect(() => {
    setItems(shuffle(LIVE).slice(0, COUNT));
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-muted/20" aria-labelledby="projetos-no-ar-title">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Projetos no ar</p>
            <h2 id="projetos-no-ar-title" className="mt-2 text-3xl lg:text-4xl font-display font-bold">
              Sites publicados que você pode visitar agora
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              Uma amostra rotativa dos projetos hospedados pela 0WEB. A cada visita a lista muda —
              abra qualquer um e navegue no site real do cliente.
            </p>
          </div>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Ver todos os projetos <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.slug}>
              <Link
                to="/portfolio/$slug"
                params={{ slug: item.slug }}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={`Prévia do site ${item.title}`}
                    loading="lazy"
                    decoding="async"
                    width={640}
                    height={360}
                    className="h-40 w-full object-cover"
                  />
                ) : null}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-semibold">{item.title}</h3>
                  {item.subtitle ? (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.subtitle}</p>
                  ) : null}
                  <p className="mt-auto pt-4 text-xs text-muted-foreground">
                    {item.location ?? [item.city, item.state].filter(Boolean).join(" — ")}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Abrir site <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
