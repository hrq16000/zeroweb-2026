/** Institutional editorial view of published catalog records; not a client template. */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, RotateCw } from "lucide-react";
import portfolioCatalog from "@/config/portfolio-catalog.json";
import coverStatus from "@/config/portfolio-cover-status.json";
import {
  HOME_SHOWCASE_SIZE,
  approvedHomeCover,
  homeProjectPage,
  orderHomeProjects,
  type HomeProject,
} from "@/lib/home-project-selection";

const LIVE = orderHomeProjects(portfolioCatalog as HomeProject[]);
const PAGE_COUNT = Math.ceil(LIVE.length / HOME_SHOWCASE_SIZE);

function HomeShowcaseMedia({ item, lead }: { item: HomeProject; lead: boolean }) {
  const cover = approvedHomeCover(item.slug, coverStatus.projects);
  const [failed, setFailed] = useState(false);

  if (cover && !failed) {
    return (
      <img
        src={cover}
        alt={`Capa editorial de ${item.title}`}
        width={640}
        height={360}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="h-full w-full object-contain"
      />
    );
  }

  return (
    <div className="flex h-full w-full flex-col justify-between bg-slate-950 p-4 text-white sm:p-6" aria-hidden="true">
      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-300">Projeto no ar</span>
      <span className={lead ? "max-w-[18ch] font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl" : "font-display text-xl font-bold leading-tight tracking-tight"}>
        {item.title}
      </span>
      <span className="text-xs text-slate-300">Capa editorial em revisão</span>
    </div>
  );
}

export function ProjetosNoAr() {
  const [page, setPage] = useState(0);
  const items = homeProjectPage(LIVE, page);

  if (items.length === 0) return null;

  return (
    <section className="border-y border-border bg-muted/35 py-16 lg:py-24" aria-labelledby="projetos-no-ar-title">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="min-w-0 lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Projetos no ar · portfólio</p>
            <h2 id="projetos-no-ar-title" className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Sites publicados que você pode visitar agora
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Uma amostra dos projetos hospedados pela 0WEB. Compare diferentes identidades e ofertas,
              abra qualquer projeto e navegue pelo site real do cliente.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:col-span-5 lg:justify-end">
            <Link
              to="/portfolio"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity duration-[160ms] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Ver todos os projetos <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            {PAGE_COUNT > 1 ? (
              <button
                type="button"
                onClick={() => setPage((current) => (current + 1) % PAGE_COUNT)}
                aria-controls="home-project-selection"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors duration-[160ms] hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <RotateCw className="size-4" aria-hidden="true" />
                Outra seleção
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-4 text-xs font-semibold text-muted-foreground">
          <span>Seleção editorial</span>
          <span role="status" aria-live="polite" aria-atomic="true" className="tabular-nums">
            Seleção {page + 1} de {PAGE_COUNT}
          </span>
        </div>

        <ul id="home-project-selection" className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const lead = index < 2;
            const location = item.location ?? [item.city, item.state].filter(Boolean).join(" — ");
            return (
              <li key={item.slug} className={lead ? "min-w-0 lg:col-span-2" : "min-w-0"}>
                <Link
                  to="/portfolio/$slug"
                  params={{ slug: item.slug }}
                  className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-[160ms] hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <div className="relative aspect-video w-full overflow-hidden border-b border-border bg-muted">
                    <HomeShowcaseMedia item={item} lead={lead} />
                  </div>
                  <div className={lead ? "flex flex-1 flex-col gap-2 p-5 sm:p-6" : "flex flex-1 flex-col gap-2 p-4"}>
                    <p className="text-xs font-medium leading-normal text-muted-foreground">{location}</p>
                    <h3 className={lead ? "font-display text-2xl font-bold leading-tight" : "font-display text-lg font-bold leading-tight"}>{item.title}</h3>
                    {item.subtitle ? (
                      <p className="text-sm leading-relaxed text-muted-foreground">{item.subtitle}</p>
                    ) : null}
                    <span className="mt-auto flex items-center justify-between gap-2 pt-4 text-sm font-semibold text-primary">
                      Abrir site
                      <ArrowUpRight className="size-5 shrink-0 motion-safe:transition-transform motion-safe:duration-[160ms] motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
