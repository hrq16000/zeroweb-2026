import type { CSSProperties } from "react";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import type { ManagedProject } from "@/lib/portfolio-managed";

/**
 * Renderizador oficial dos projetos criados pelo painel (Managed).
 *
 * Não é um template único: as composições (`preset`) mudam hierarquia,
 * enquadramento e ritmo. Identidade (cores, imagens, textos, serviços) vem
 * inteiramente dos dados do cliente — nunca da 0WEB. A casca comercial
 * (compartilhar, funil, rodapé, pop-up) é responsabilidade do
 * `PortfolioStandardShell`, que envolve este componente.
 */
type Props = { project: ManagedProject };

const PRESET_HERO: Record<
  ManagedProject["preset"],
  { grid: string; heroHeight: string; titleSize: string; frame: string }
> = {
  editorial: {
    grid: "lg:grid-cols-[1.05fr_.95fr]",
    heroHeight: "h-[320px] sm:h-[420px] lg:h-[520px]",
    titleSize: "text-4xl sm:text-5xl lg:text-6xl",
    frame: "rounded-3xl",
  },
  impact: {
    grid: "lg:grid-cols-1",
    heroHeight: "h-[380px] sm:h-[520px] lg:h-[620px]",
    titleSize: "text-5xl sm:text-6xl lg:text-7xl",
    frame: "rounded-none",
  },
  minimal: {
    grid: "lg:grid-cols-[.9fr_1.1fr]",
    heroHeight: "h-[280px] sm:h-[360px] lg:h-[440px]",
    titleSize: "text-3xl sm:text-4xl lg:text-5xl",
    frame: "rounded-xl",
  },
  immersive: {
    grid: "lg:grid-cols-1",
    heroHeight: "h-[420px] sm:h-[560px] lg:h-[680px]",
    titleSize: "text-4xl sm:text-6xl lg:text-7xl",
    frame: "rounded-[2.5rem]",
  },
  service_focused: {
    grid: "lg:grid-cols-[1fr_1fr]",
    heroHeight: "h-[300px] sm:h-[400px] lg:h-[460px]",
    titleSize: "text-3xl sm:text-5xl",
    frame: "rounded-2xl",
  },
};

function focalStyle(focal: { x: number; y: number }): CSSProperties {
  return { objectPosition: `${focal.x}% ${focal.y}%` };
}

export function PortfolioManagedView({ project }: Props) {
  const preset = PRESET_HERO[project.preset] ?? PRESET_HERO.editorial;
  const brand = project.brandColors;
  const style = {
    "--managed-primary": brand.primary ?? "#0f172a",
    "--managed-accent": brand.accent ?? brand.primary ?? "#f97316",
    "--managed-surface": brand.surface ?? "#ffffff",
    "--managed-ink": brand.ink ?? "#0b1220",
  } as CSSProperties;

  const overlay = project.preset === "impact" || project.preset === "immersive";
  const location = [project.city, project.state].filter(Boolean).join(" — ");

  return (
    <main
      data-managed-preset={project.preset}
      style={style}
      className="min-h-dvh bg-[var(--managed-surface)] text-[var(--managed-ink)]"
    >
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5">
        <div className="flex items-center gap-3">
          {project.logoUrl ? (
            <PortfolioImage
              src={project.logoUrl}
              alt={`Logo ${project.displayName}`}
              priority
              className="h-12 w-auto max-w-[180px] object-contain"
            />
          ) : (
            <span className="text-lg font-black tracking-tight">{project.displayName}</span>
          )}
        </div>
        {location ? (
          <p className="text-xs font-semibold uppercase tracking-[.18em] opacity-70">{location}</p>
        ) : null}
      </header>

      <section className={`mx-auto grid max-w-6xl gap-8 px-4 pb-12 ${preset.grid}`}>
        <div className={overlay ? "relative" : "order-2 lg:order-1 flex flex-col justify-center"}>
          {overlay && project.heroImageUrl ? (
            <div className={`relative overflow-hidden ${preset.frame} ${preset.heroHeight}`}>
              <PortfolioImage
                src={project.heroImageUrl}
                alt={project.heroHeadline}
                priority
                style={focalStyle(project.heroFocal)}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 text-white">
                <h1 className={`font-display font-black leading-[1.05] ${preset.titleSize}`}>
                  {project.heroHeadline}
                </h1>
                {project.heroSubheadline ? (
                  <p className="mt-3 max-w-2xl text-base sm:text-lg opacity-90">
                    {project.heroSubheadline}
                  </p>
                ) : null}
              </div>
            </div>
          ) : (
            <>
              <h1 className={`font-display font-black leading-[1.05] ${preset.titleSize}`}>
                {project.heroHeadline}
              </h1>
              {project.heroSubheadline ? (
                <p className="mt-4 max-w-xl text-base sm:text-lg opacity-80">
                  {project.heroSubheadline}
                </p>
              ) : null}
              {project.summary ? (
                <p className="mt-4 max-w-xl text-sm opacity-70">{project.summary}</p>
              ) : null}
              <p className="mt-6 inline-flex w-fit rounded-full bg-[var(--managed-accent)] px-5 py-3 text-sm font-bold text-white">
                {project.ctaLabel}
              </p>
            </>
          )}
        </div>

        {!overlay && project.heroImageUrl ? (
          <div className={`order-1 lg:order-2 overflow-hidden ${preset.frame} ${preset.heroHeight}`}>
            <PortfolioImage
              src={project.heroImageUrl}
              alt={project.heroHeadline}
              priority
              style={focalStyle(project.heroFocal)}
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}
      </section>

      {project.services.length ? (
        <section className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="font-display text-2xl font-black sm:text-3xl">Serviços e produtos</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.services.map((service) => (
              <li
                key={service.title}
                className="rounded-2xl border border-black/10 bg-white/70 p-5 shadow-sm"
              >
                <h3 className="text-base font-bold text-[var(--managed-primary)]">
                  {service.title}
                </h3>
                {service.description ? (
                  <p className="mt-2 text-sm opacity-75">{service.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {project.content.differentials.length ? (
        <section className="bg-[var(--managed-primary)] px-4 py-10 text-white">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-2xl font-black sm:text-3xl">Por que escolher</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {project.content.differentials.map((item) => (
                <li key={item} className="rounded-xl bg-white/10 px-4 py-3 text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {project.gallery.length ? (
        <section className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="font-display text-2xl font-black sm:text-3xl">Galeria</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.gallery.map((item) => (
              <figure key={item.url} className="overflow-hidden rounded-2xl">
                <PortfolioImage
                  src={item.url}
                  alt={item.alt || project.displayName}
                  style={focalStyle(item.focal)}
                  className="h-56 w-full object-cover"
                />
                {item.alt ? (
                  <figcaption className="px-1 pt-2 text-xs opacity-70">{item.alt}</figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {project.content.steps.length ? (
        <section className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="font-display text-2xl font-black sm:text-3xl">Como funciona</h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-3">
            {project.content.steps.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-black/10 p-5">
                <span className="text-xs font-black text-[var(--managed-accent)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1 text-base font-bold">{step.title}</h3>
                <p className="mt-2 text-sm opacity-75">{step.description}</p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {project.content.about ? (
        <section className="mx-auto max-w-3xl px-4 py-10">
          <h2 className="font-display text-2xl font-black sm:text-3xl">
            Sobre a {project.displayName}
          </h2>
          <p className="mt-4 whitespace-pre-line text-base leading-relaxed opacity-80">
            {project.content.about}
          </p>
        </section>
      ) : null}

      {project.content.faq.length ? (
        <section className="mx-auto max-w-3xl px-4 pb-14">
          <h2 className="font-display text-2xl font-black sm:text-3xl">Perguntas frequentes</h2>
          <div className="mt-5 space-y-3">
            {project.content.faq.map((item) => (
              <details key={item.q} className="rounded-xl border border-black/10 p-4">
                <summary className="cursor-pointer text-sm font-bold">{item.q}</summary>
                <p className="mt-2 text-sm opacity-75">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
