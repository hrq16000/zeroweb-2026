import type { CSSProperties, ReactNode } from "react";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { bookingIntent } from "@/lib/portfolio-funnel-context";
import type { ManagedProject } from "@/lib/portfolio-managed";
import type {
  ManagedAuthorialCompositionPlan,
  ManagedCompositionRole,
} from "@/lib/portfolio-managed-composition";

type Props = {
  project: ManagedProject;
  plan: ManagedAuthorialCompositionPlan;
};

function focalStyle(focal: { x: number; y: number }): CSSProperties {
  return { objectPosition: `${focal.x}% ${focal.y}%` };
}

function radiusClass(mode: ManagedAuthorialCompositionPlan["selected"]["radius"]): string {
  if (mode === "sharp") return "rounded-none";
  if (mode === "round") return "rounded-[2rem]";
  return "rounded-xl";
}

function sectionPadding(density: ManagedAuthorialCompositionPlan["selected"]["density"]): string {
  if (density === "compact") return "py-12 md:py-16";
  if (density === "spacious") return "py-24 md:py-32";
  return "py-16 md:py-24";
}

function AuthorialCTA({
  project,
  className,
  children,
}: {
  project: ManagedProject;
  className?: string;
  children?: ReactNode;
}) {
  const quizConfig = {
    services: project.services.map((service) => service.title),
    proposalKind: "service" as const,
  };
  return (
    <PortfolioCTAQuiz
      clientKey={project.clientKey}
      studioName={project.displayName}
      recipientName={project.displayName}
      theme="steel"
      mode={bookingIntent(project.funnelIntent) ? "booking" : "proposal"}
      funnelIntent={project.funnelIntent}
      quizConfig={quizConfig}
      className={
        className ??
        "inline-flex min-h-12 items-center justify-center bg-[var(--managed-accent)] px-6 py-3 text-sm font-black text-white"
      }
    >
      {children ?? project.ctaLabel}
    </PortfolioCTAQuiz>
  );
}

function AuthorialHeader({ project, plan }: Props) {
  const selected = plan.selected;
  const location = [project.city, project.state].filter(Boolean).join(" — ");
  const radius = radiusClass(selected.radius);

  if (selected.headerMode === "rail") {
    return (
      <header className="border-b border-black/10 bg-[var(--managed-primary)] text-white">
        <div className="mx-auto grid max-w-7xl gap-3 px-5 py-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div className="font-black tracking-tight">{project.displayName}</div>
          <div className="text-center text-[11px] font-black uppercase tracking-[.2em] opacity-70">
            {project.segment || "Projeto"}
          </div>
          <div className="text-xs font-semibold opacity-75 md:text-right">{location}</div>
        </div>
      </header>
    );
  }

  if (selected.headerMode === "floating") {
    return (
      <header className="sticky top-3 z-30 mx-auto w-[calc(100%-1.5rem)] max-w-6xl">
        <div className={`flex items-center justify-between gap-4 border border-black/10 bg-white/90 px-4 py-3 shadow-lg backdrop-blur ${radius}`}>
          {project.logoUrl ? (
            <PortfolioImage
              src={project.logoUrl}
              alt={`Logo ${project.displayName}`}
              priority
              className="h-10 w-auto max-w-[170px] object-contain"
            />
          ) : (
            <span className="font-black">{project.displayName}</span>
          )}
          <span className="hidden text-xs font-bold uppercase tracking-[.16em] opacity-60 sm:block">
            {location || project.segment}
          </span>
        </div>
      </header>
    );
  }

  return (
    <header className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-6">
      {project.logoUrl ? (
        <PortfolioImage
          src={project.logoUrl}
          alt={`Logo ${project.displayName}`}
          priority
          className="h-12 w-auto max-w-[190px] object-contain"
        />
      ) : (
        <span className="text-xl font-black">{project.displayName}</span>
      )}
      <span className="text-xs font-bold uppercase tracking-[.16em] opacity-60">
        {location || project.segment}
      </span>
    </header>
  );
}

function Hero({ project, plan }: Props) {
  const selected = plan.selected;
  const radius = radiusClass(selected.radius);
  const cta = <AuthorialCTA project={project} />;
  const image = project.heroImageUrl ? (
    <PortfolioImage
      src={project.heroImageUrl}
      alt={project.heroHeadline}
      priority
      style={focalStyle(project.heroFocal)}
      className="h-full w-full object-cover"
    />
  ) : null;

  if (selected.heroMode === "poster") {
    return (
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-4 md:px-6">
        <div className={`relative min-h-[560px] overflow-hidden bg-[var(--managed-primary)] text-white md:min-h-[700px] ${radius}`}>
          {image ? <div className="absolute inset-0">{image}</div> : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 p-7 sm:p-10 md:p-14">
            <p className="text-xs font-black uppercase tracking-[.2em] opacity-75">{project.segment}</p>
            <h1 className="mt-4 max-w-[11ch] text-5xl font-black leading-[.94] sm:text-6xl md:text-8xl">
              {project.heroHeadline}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              {project.heroSubheadline || project.summary}
            </p>
            <div className="mt-8">{cta}</div>
          </div>
        </div>
      </section>
    );
  }

  if (selected.heroMode === "center") {
    return (
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-10 text-center md:pt-16">
        <p className="text-xs font-black uppercase tracking-[.2em] text-[var(--managed-accent)]">
          {project.segment}
        </p>
        <h1 className="mx-auto mt-5 max-w-[14ch] text-5xl font-black leading-[.96] sm:text-6xl md:text-7xl">
          {project.heroHeadline}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed opacity-70">
          {project.heroSubheadline || project.summary}
        </p>
        <div className="mt-7 flex justify-center">{cta}</div>
        {image ? (
          <div className={`mt-12 h-[360px] overflow-hidden sm:h-[480px] md:h-[620px] ${radius}`}>
            {image}
          </div>
        ) : null}
      </section>
    );
  }

  if (selected.heroMode === "stack") {
    return (
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-6">
        {image ? (
          <div className={`h-[420px] overflow-hidden md:h-[620px] ${radius}`}>{image}</div>
        ) : null}
        <div className="relative z-10 -mt-16 ml-auto max-w-4xl border border-black/10 bg-[var(--managed-surface)] p-7 shadow-xl sm:p-10 md:-mt-24 md:p-14">
          <p className="text-xs font-black uppercase tracking-[.18em] text-[var(--managed-accent)]">
            {project.segment}
          </p>
          <h1 className="mt-4 text-4xl font-black leading-[.96] sm:text-6xl md:text-7xl">
            {project.heroHeadline}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed opacity-70">
            {project.heroSubheadline || project.summary}
          </p>
          <div className="mt-7">{cta}</div>
        </div>
      </section>
    );
  }

  if (selected.heroMode === "editorial") {
    return (
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-12 md:items-end md:py-16">
        <div className="md:col-span-7">
          <p className="text-xs font-black uppercase tracking-[.22em] text-[var(--managed-accent)]">
            {project.segment}
          </p>
          <h1 className="mt-5 max-w-[10ch] text-6xl font-black leading-[.88] sm:text-7xl md:text-8xl">
            {project.heroHeadline}
          </h1>
          <div className="mt-8 flex flex-col gap-5 border-t border-black/15 pt-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-xl text-base leading-relaxed opacity-70">
              {project.heroSubheadline || project.summary}
            </p>
            {cta}
          </div>
        </div>
        {image ? (
          <div className={`h-[440px] overflow-hidden md:col-span-5 md:h-[650px] ${radius}`}>
            {image}
          </div>
        ) : null}
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[.9fr_1.1fr] md:items-center md:py-20">
      <div>
        <p className="text-xs font-black uppercase tracking-[.18em] text-[var(--managed-accent)]">
          {project.segment}
        </p>
        <h1 className="mt-5 text-5xl font-black leading-[.95] sm:text-6xl md:text-7xl">
          {project.heroHeadline}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed opacity-70">
          {project.heroSubheadline || project.summary}
        </p>
        <div className="mt-8">{cta}</div>
      </div>
      {image ? <div className={`h-[500px] overflow-hidden md:h-[650px] ${radius}`}>{image}</div> : null}
    </section>
  );
}

function Services({ project, plan }: Props) {
  if (!project.services.length) return null;
  const selected = plan.selected;
  const radius = radiusClass(selected.radius);
  const padding = sectionPadding(selected.density);

  if (selected.serviceMode === "ledger") {
    return (
      <section className={`mx-auto max-w-7xl px-5 ${padding}`}>
        <div className="grid gap-10 lg:grid-cols-[.35fr_.65fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-[var(--managed-accent)]">Oferta</p>
            <h2 className="mt-4 text-4xl font-black">Serviços e produtos</h2>
          </div>
          <div className="border-t border-black/15">
            {project.services.map((service, index) => (
              <article key={service.title} className="grid gap-4 border-b border-black/15 py-6 sm:grid-cols-[4rem_1fr]">
                <span className="text-sm font-black text-[var(--managed-accent)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-xl font-black">{service.title}</h3>
                  {service.description ? <p className="mt-2 opacity-70">{service.description}</p> : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (selected.serviceMode === "stack") {
    return (
      <section className={`bg-[var(--managed-primary)] px-5 text-white ${padding}`}>
        <div className="mx-auto max-w-5xl">
          <h2 className="text-4xl font-black md:text-5xl">O que você encontra aqui</h2>
          <div className="mt-9 space-y-4">
            {project.services.map((service, index) => (
              <article key={service.title} className={`border border-white/15 p-6 md:p-8 ${radius}`}>
                <div className="flex gap-5">
                  <span className="text-sm font-black text-white/45">{index + 1}</span>
                  <div>
                    <h3 className="text-2xl font-black">{service.title}</h3>
                    {service.description ? <p className="mt-2 max-w-2xl text-white/70">{service.description}</p> : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (selected.serviceMode === "columns") {
    return (
      <section className={`mx-auto max-w-7xl px-5 ${padding}`}>
        <div className="flex items-end justify-between gap-6 border-b border-black/15 pb-6">
          <h2 className="text-4xl font-black md:text-5xl">Serviços e produtos</h2>
          <span className="hidden text-xs font-black uppercase tracking-[.2em] opacity-50 sm:block">
            {project.services.length} frentes
          </span>
        </div>
        <div className="mt-8 columns-1 gap-5 md:columns-2 lg:columns-3">
          {project.services.map((service) => (
            <article key={service.title} className={`mb-5 break-inside-avoid border border-black/10 p-6 ${radius}`}>
              <h3 className="text-xl font-black">{service.title}</h3>
              {service.description ? <p className="mt-3 leading-relaxed opacity-70">{service.description}</p> : null}
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={`mx-auto max-w-7xl px-5 ${padding}`}>
      <h2 className="max-w-2xl text-4xl font-black md:text-5xl">Serviços e produtos</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
        {project.services.map((service, index) => (
          <article
            key={service.title}
            className={`border border-black/10 p-6 ${radius} ${index % 3 === 0 ? "lg:col-span-7" : "lg:col-span-5"}`}
          >
            <span className="text-xs font-black uppercase tracking-[.16em] text-[var(--managed-accent)]">
              0{index + 1}
            </span>
            <h3 className="mt-6 text-2xl font-black">{service.title}</h3>
            {service.description ? <p className="mt-3 max-w-xl leading-relaxed opacity-70">{service.description}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function Gallery({ project, plan }: Props) {
  if (!project.gallery.length) return null;
  const selected = plan.selected;
  const radius = radiusClass(selected.radius);
  const padding = sectionPadding(selected.density);

  if (selected.galleryMode === "filmstrip") {
    return (
      <section className={`overflow-hidden ${padding}`}>
        <div className="mx-auto max-w-7xl px-5">
          <h2 className="text-4xl font-black">Galeria</h2>
        </div>
        <div className="mt-8 flex gap-4 overflow-x-auto px-5 pb-4">
          {project.gallery.map((item, index) => (
            <figure key={item.url} className={`w-[78vw] max-w-xl shrink-0 overflow-hidden ${radius}`}>
              <PortfolioImage
                src={item.url}
                alt={item.alt || `${project.displayName} — imagem ${index + 1}`}
                style={focalStyle(item.focal)}
                className="h-[360px] w-full object-cover md:h-[500px]"
              />
            </figure>
          ))}
        </div>
      </section>
    );
  }

  if (selected.galleryMode === "masonry") {
    return (
      <section className={`mx-auto max-w-7xl px-5 ${padding}`}>
        <h2 className="text-4xl font-black">Galeria</h2>
        <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {project.gallery.map((item, index) => (
            <figure key={item.url} className={`mb-4 break-inside-avoid overflow-hidden ${radius}`}>
              <PortfolioImage
                src={item.url}
                alt={item.alt || `${project.displayName} — imagem ${index + 1}`}
                style={focalStyle(item.focal)}
                className={`w-full object-cover ${index % 3 === 0 ? "h-[420px]" : "h-[280px]"}`}
              />
            </figure>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={`mx-auto max-w-7xl px-5 ${padding}`}>
      <div className="grid gap-8 md:grid-cols-[.35fr_.65fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[.18em] text-[var(--managed-accent)]">Visual</p>
          <h2 className="mt-4 text-4xl font-black">Galeria</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {project.gallery.map((item, index) => (
            <figure key={item.url} className={`overflow-hidden ${radius} ${index === 0 ? "sm:col-span-2" : ""}`}>
              <PortfolioImage
                src={item.url}
                alt={item.alt || `${project.displayName} — imagem ${index + 1}`}
                style={focalStyle(item.focal)}
                className={`w-full object-cover ${index === 0 ? "h-[420px]" : "h-64"}`}
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Differentials({ project, plan }: Props) {
  if (!project.content.differentials.length) return null;
  const radius = radiusClass(plan.selected.radius);
  return (
    <section className={`bg-[var(--managed-primary)] px-5 text-white ${sectionPadding(plan.selected.density)}`}>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-black uppercase tracking-[.18em] text-white/50">Diferenciais</p>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {project.content.differentials.map((item, index) => (
            <div key={item} className={`border border-white/15 p-5 ${radius}`}>
              <span className="text-xs font-black text-white/40">0{index + 1}</span>
              <p className="mt-8 text-lg font-black leading-snug">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Steps({ project, plan }: Props) {
  if (!project.content.steps.length) return null;
  const mode = plan.selected.stepsMode;
  const padding = sectionPadding(plan.selected.density);

  if (mode === "timeline") {
    return (
      <section className={`mx-auto max-w-6xl px-5 ${padding}`}>
        <h2 className="text-4xl font-black">Como funciona</h2>
        <ol className="mt-9 border-l border-black/20 pl-7">
          {project.content.steps.map((step, index) => (
            <li key={step.title} className="relative pb-10 last:pb-0">
              <span className="absolute -left-[2.18rem] top-0 grid h-8 w-8 place-items-center rounded-full bg-[var(--managed-accent)] text-xs font-black text-white">
                {index + 1}
              </span>
              <h3 className="text-xl font-black">{step.title}</h3>
              <p className="mt-2 max-w-2xl opacity-70">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  if (mode === "stack") {
    return (
      <section className={`mx-auto max-w-5xl px-5 ${padding}`}>
        <h2 className="text-4xl font-black">Como funciona</h2>
        <div className="mt-8 divide-y divide-black/15 border-y border-black/15">
          {project.content.steps.map((step, index) => (
            <article key={step.title} className="grid gap-3 py-7 sm:grid-cols-[5rem_1fr]">
              <span className="text-sm font-black text-[var(--managed-accent)]">PASSO {index + 1}</span>
              <div><h3 className="text-2xl font-black">{step.title}</h3><p className="mt-2 opacity-70">{step.description}</p></div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={`mx-auto max-w-7xl px-5 ${padding}`}>
      <h2 className="text-4xl font-black">Como funciona</h2>
      <ol className="mt-8 grid gap-5 md:grid-cols-3">
        {project.content.steps.map((step, index) => (
          <li key={step.title} className="border-t-2 border-black pt-6">
            <span className="text-xs font-black text-[var(--managed-accent)]">0{index + 1}</span>
            <h3 className="mt-8 text-xl font-black">{step.title}</h3>
            <p className="mt-3 opacity-70">{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function About({ project, plan }: Props) {
  if (!project.content.about) return null;
  const padding = sectionPadding(plan.selected.density);
  return (
    <section className={`mx-auto max-w-7xl px-5 ${padding}`}>
      <div className="grid gap-8 border-y border-black/15 py-10 md:grid-cols-[.3fr_.7fr]">
        <p className="text-xs font-black uppercase tracking-[.18em] text-[var(--managed-accent)]">
          Sobre
        </p>
        <div>
          <h2 className="text-3xl font-black md:text-5xl">{project.displayName}</h2>
          <p className="mt-5 max-w-3xl whitespace-pre-line text-lg leading-relaxed opacity-75">
            {project.content.about}
          </p>
        </div>
      </div>
    </section>
  );
}

function Faq({ project, plan }: Props) {
  if (!project.content.faq.length) return null;
  const padding = sectionPadding(plan.selected.density);

  if (plan.selected.faqMode === "columns") {
    return (
      <section className={`mx-auto max-w-7xl px-5 ${padding}`}>
        <h2 className="text-4xl font-black">Perguntas frequentes</h2>
        <div className="mt-8 grid gap-x-10 md:grid-cols-2">
          {project.content.faq.map((item) => (
            <article key={item.q} className="border-t border-black/15 py-6">
              <h3 className="font-black">{item.q}</h3>
              <p className="mt-3 leading-relaxed opacity-70">{item.a}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={`mx-auto max-w-4xl px-5 ${padding}`}>
      <h2 className="text-4xl font-black">Perguntas frequentes</h2>
      <div className="mt-8 divide-y divide-black/15 border-y border-black/15">
        {project.content.faq.map((item) => (
          <details key={item.q} className="py-5">
            <summary className="cursor-pointer text-lg font-black">{item.q}</summary>
            <p className="max-w-2xl pt-4 leading-relaxed opacity-70">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Location({ project, plan }: Props) {
  const location = [project.city, project.state].filter(Boolean).join(" — ");
  if (!location) return null;
  return (
    <section className={`px-5 ${sectionPadding(plan.selected.density)}`}>
      <div className="mx-auto max-w-7xl border-t border-black/15 pt-8">
        <p className="text-xs font-black uppercase tracking-[.18em] text-[var(--managed-accent)]">Localidade</p>
        <p className="mt-4 text-3xl font-black md:text-5xl">{location}</p>
      </div>
    </section>
  );
}

function roleNode(role: ManagedCompositionRole, props: Props): ReactNode {
  switch (role) {
    case "services":
      return <Services key={role} {...props} />;
    case "gallery":
      return <Gallery key={role} {...props} />;
    case "differentials":
      return <Differentials key={role} {...props} />;
    case "steps":
      return <Steps key={role} {...props} />;
    case "about":
      return <About key={role} {...props} />;
    case "faq":
      return <Faq key={role} {...props} />;
    case "location":
      return <Location key={role} {...props} />;
  }
}

export function PortfolioManagedAuthorialView({ project, plan }: Props) {
  const brand = project.brandColors;
  const style = {
    "--managed-primary": brand.primary ?? "#111827",
    "--managed-accent": brand.accent ?? brand.primary ?? "#ea580c",
    "--managed-surface": brand.surface ?? "#ffffff",
    "--managed-ink": brand.ink ?? "#111827",
  } as CSSProperties;
  const selected = plan.selected;
  const radius = radiusClass(selected.radius);

  return (
    <main
      data-managed-authorial="true"
      data-composition-contract={plan.contract}
      data-composition-signature={selected.signature}
      data-composition-direction={selected.id}
      style={style}
      className="min-h-dvh bg-[var(--managed-surface)] text-[var(--managed-ink)]"
    >
      <AuthorialHeader project={project} plan={plan} />
      <Hero project={project} plan={plan} />
      {selected.sectionOrder.map((role) => roleNode(role, { project, plan }))}

      <section className={`mx-auto max-w-7xl px-5 ${sectionPadding(selected.density)}`}>
        <div className={`bg-[var(--managed-primary)] p-7 text-white sm:p-10 md:p-14 ${radius}`}>
          <p className="text-xs font-black uppercase tracking-[.18em] text-white/50">Próximo passo</p>
          <div className="mt-5 grid gap-7 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <h2 className="max-w-[14ch] text-4xl font-black leading-tight md:text-6xl">
                {project.ctaLabel}
              </h2>
              <p className="mt-4 max-w-xl text-white/70">
                Envie o contexto pelo funil do projeto para registrar a solicitação e seguir ao atendimento.
              </p>
            </div>
            <AuthorialCTA
              project={project}
              className="inline-flex min-h-12 items-center justify-center bg-[var(--managed-accent)] px-6 py-3 text-sm font-black text-white"
            />
          </div>
        </div>
      </section>

      {selected.ctaMode === "floating" ? (
        <div className="fixed bottom-4 right-4 z-40 hidden md:block">
          <AuthorialCTA
            project={project}
            className={`inline-flex min-h-12 items-center justify-center bg-[var(--managed-accent)] px-5 py-3 text-sm font-black text-white shadow-xl ${radius}`}
          />
        </div>
      ) : null}

      <footer className="border-t border-black/10 px-5 py-7">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs opacity-60 sm:flex-row sm:items-center sm:justify-between">
          <span>{project.displayName}</span>
          <span>{project.city ? `${project.city}${project.state ? ` — ${project.state}` : ""}` : project.segment}</span>
        </div>
      </footer>
    </main>
  );
}
