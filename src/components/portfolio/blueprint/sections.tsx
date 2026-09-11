/**
 * Biblioteca de seções do Portfolio Blueprint (FASE 1).
 *
 * Cada tipo tem variantes com **composição** diferente — não apenas conteúdo
 * diferente. Nenhuma regra específica de projeto vive aqui: tudo vem do
 * Blueprint do cliente.
 */
import type { ReactNode } from "react";
import { MotionReveal } from "@/components/motion";
import { ManagedText } from "@/components/portfolio/ManagedText";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { cn } from "@/lib/utils";
import type {
  AuthoritySection,
  BlueprintCtaRenderer,
  BlueprintImage,
  BlueprintSection,
  BlueprintSectionMotion,
  CtaSection,
  FaqSection,
  HeroSection,
  LocationSection,
  OffersSection,
  ProofSection,
  TrustSection,
  UseCasesSection,
} from "@/lib/portfolio-blueprint";

export type SectionContext = {
  renderCta: BlueprintCtaRenderer;
  maxWidth: string;
  motion?: BlueprintSectionMotion;
};

function Reveal({
  ctx,
  delay = 0,
  as,
  className,
  children,
}: {
  ctx: SectionContext;
  delay?: number;
  as?: "div" | "h1" | "h2" | "h3" | "p" | "li" | "article" | "figure";
  className?: string;
  children: ReactNode;
}) {
  return (
    <MotionReveal
      as={as ?? "div"}
      variant={ctx.motion?.reveal ?? "up"}
      intensity={ctx.motion?.intensity}
      delay={delay}
      className={className}
    >
      {children}
    </MotionReveal>
  );
}

function step(ctx: SectionContext, index: number) {
  return index * (ctx.motion?.stagger ?? 70);
}

function Img({ image, className }: { image: BlueprintImage; className?: string }) {
  return (
    <PortfolioImage
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      priority={image.priority}
      managedField={image.managedField}
      className={className}
    />
  );
}

function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("text-xs font-black uppercase tracking-[.28em] text-primary", className)}>
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ hero */

function Hero({ section, ctx }: { section: HeroSection; ctx: SectionContext }) {
  const c = section.content;
  const headline = c.headlineField ? (
    <ManagedText field={c.headlineField} fallback={c.headline} />
  ) : (
    c.headline
  );
  const sub = c.subheadline
    ? c.subheadlineField
      ? <ManagedText field={c.subheadlineField} fallback={c.subheadline} />
      : c.subheadline
    : null;

  if (section.variant === "fullBleed") {
    return (
      <section id={section.id} className="relative isolate min-h-[92svh] overflow-hidden">
        {c.image ? (
          <Img
            image={{ ...c.image, priority: true }}
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
        ) : null}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--background)_45%,transparent)_0%,color-mix(in_oklab,var(--background)_88%,transparent)_48%,var(--background)_100%)]"
        />
        <div className="flex min-h-[92svh] flex-col justify-end px-6 pb-14 pt-28 md:px-12 lg:px-20 lg:pb-20">
          <div className="max-w-[46ch]">
            {c.eyebrow ? <Eyebrow>{c.eyebrow}</Eyebrow> : null}
            <MotionReveal
              as="h1"
              variant="mask"
              intensity="IMMERSIVE"
              className="mt-6 text-[clamp(2.4rem,7.2vw,5.5rem)] font-black uppercase leading-[0.94] tracking-[-0.03em]"
            >
              {headline}
            </MotionReveal>
            {sub ? (
              <Reveal ctx={ctx} delay={120} as="p" className="mt-6 max-w-[52ch] text-base leading-7 text-muted-foreground md:text-lg">
                {sub}
              </Reveal>
            ) : null}
            <div className="mt-9 flex flex-wrap items-center gap-3">
              {c.ctaLabel
                ? ctx.renderCta({
                    placement: "hero",
                    children: c.ctaLabel,
                    className:
                      "inline-flex min-h-13 items-center rounded-full bg-primary px-8 text-sm font-black uppercase tracking-[.12em] text-primary-foreground transition hover:scale-[1.02] hover:opacity-95",
                  })
                : null}
              {c.secondary ? (
                <a
                  href={c.secondary.href}
                  className="inline-flex min-h-13 items-center rounded-full border border-border px-7 text-sm font-bold uppercase tracking-[.12em] transition hover:border-primary hover:text-primary"
                >
                  {c.secondary.label}
                </a>
              ) : null}
            </div>
          </div>
          {c.stats?.length ? (
            <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
              {c.stats.map((stat, i) => (
                <Reveal
                  ctx={ctx}
                  key={stat.label}
                  delay={step(ctx, i)}
                  className="bg-background/80 px-5 py-6 backdrop-blur"
                >
                  <dt className="text-[0.7rem] font-bold uppercase tracking-[.2em] text-muted-foreground">
                    {stat.label}
                  </dt>
                  <dd className="mt-2 text-xl font-black uppercase tracking-tight md:text-2xl">
                    {stat.value}
                  </dd>
                </Reveal>
              ))}
            </dl>
          ) : null}
        </div>
      </section>
    );
  }

  if (section.variant === "editorial") {
    return (
      <section id={section.id} className="px-6 pb-16 pt-24 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          {c.eyebrow ? <Eyebrow>{c.eyebrow}</Eyebrow> : null}
          <MotionReveal
            as="h1"
            variant="up"
            intensity="EXPRESSIVE"
            className="mt-6 max-w-[16ch] text-[clamp(2.6rem,8vw,6.5rem)] font-black uppercase leading-[0.92] tracking-[-0.035em]"
          >
            {headline}
          </MotionReveal>
          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:items-end">
            <div>
              {sub ? <p className="text-base leading-7 text-muted-foreground md:text-lg">{sub}</p> : null}
              <div className="mt-8 flex flex-wrap gap-3">
                {c.ctaLabel
                  ? ctx.renderCta({
                      placement: "hero",
                      children: c.ctaLabel,
                      className:
                        "inline-flex min-h-12 items-center rounded-full bg-primary px-7 text-sm font-black uppercase tracking-[.12em] text-primary-foreground hover:opacity-90",
                    })
                  : null}
                {c.secondary ? (
                  <a href={c.secondary.href} className="inline-flex min-h-12 items-center text-sm font-bold uppercase tracking-[.12em] underline underline-offset-8 hover:text-primary">
                    {c.secondary.label}
                  </a>
                ) : null}
              </div>
            </div>
            {c.image ? (
              <Reveal ctx={ctx} className="overflow-hidden rounded-3xl border border-border">
                <Img image={{ ...c.image, priority: true }} className="h-full w-full object-cover" />
              </Reveal>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  // split
  return (
    <section id={section.id} className="px-5 py-16 md:py-24">
      <div className={cn("mx-auto grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center", ctx.maxWidth)}>
        <div>
          {c.eyebrow ? <Eyebrow>{c.eyebrow}</Eyebrow> : null}
          <MotionReveal as="h1" variant="up" intensity="EXPRESSIVE" className="mt-5 text-4xl font-black uppercase leading-[1.02] tracking-tight md:text-6xl">
            {headline}
          </MotionReveal>
          {sub ? <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">{sub}</p> : null}
          <div className="mt-8 flex flex-wrap gap-3">
            {c.ctaLabel
              ? ctx.renderCta({
                  placement: "hero",
                  children: c.ctaLabel,
                  className:
                    "inline-flex min-h-12 items-center rounded-md bg-primary px-6 font-bold uppercase tracking-wide text-primary-foreground hover:opacity-90",
                })
              : null}
            {c.secondary ? (
              <a href={c.secondary.href} className="inline-flex min-h-12 items-center rounded-md border border-border px-6 font-semibold hover:border-primary hover:text-primary">
                {c.secondary.label}
              </a>
            ) : null}
          </div>
        </div>
        {c.image ? <Img image={{ ...c.image, priority: true }} className="w-full rounded-lg border border-border object-cover shadow-2xl" /> : null}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- trust */

function Trust({ section, ctx }: { section: TrustSection; ctx: SectionContext }) {
  const { items, note } = section.content;

  if (section.variant === "cards") {
    return (
      <section id={section.id} className="px-5 py-14 md:py-20">
        <div className={cn("mx-auto grid gap-5 md:grid-cols-3", ctx.maxWidth)}>
          {items.map(({ title, text, icon: Icon }, i) => (
            <Reveal ctx={ctx} key={title} delay={step(ctx, i)} as="article" className="rounded-2xl border border-border bg-card p-7">
              {Icon ? <Icon className="h-7 w-7 text-primary" /> : null}
              <h3 className="mt-4 text-base font-black uppercase tracking-wide">{title}</h3>
              {text ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p> : null}
            </Reveal>
          ))}
        </div>
        {note ? <p className="mt-6 text-center text-xs uppercase tracking-[.2em] text-muted-foreground">{note}</p> : null}
      </section>
    );
  }

  // bar — faixa full bleed, densa, sem cards
  return (
    <section
      id={section.id}
      className="border-y border-border bg-[color-mix(in_oklab,var(--primary)_12%,var(--background))]"
    >
      <ul className="grid grid-cols-2 divide-x divide-y divide-border md:grid-cols-4 md:divide-y-0">
        {items.map(({ title, text, icon: Icon }, i) => (
          <Reveal
            ctx={ctx}
            key={title}
            delay={step(ctx, i)}
            as="li"
            className="flex min-h-24 flex-col justify-center gap-1 px-5 py-6 md:px-8"
          >
            <span className="flex items-center gap-2 text-sm font-black uppercase tracking-[.1em]">
              {Icon ? <Icon className="h-4 w-4 text-primary" /> : null}
              {title}
            </span>
            {text ? <span className="text-xs leading-5 text-muted-foreground">{text}</span> : null}
          </Reveal>
        ))}
      </ul>
      {note ? (
        <p className="border-t border-border px-5 py-3 text-center text-[0.7rem] uppercase tracking-[.24em] text-muted-foreground">
          {note}
        </p>
      ) : null}
    </section>
  );
}

/* ---------------------------------------------------------------- offers */

function Offers({ section, ctx }: { section: OffersSection; ctx: SectionContext }) {
  const c = section.content;

  if (section.variant === "featured") {
    const [first, ...rest] = c.items;
    return (
      <section id={section.id} className="px-6 py-20 md:px-12 md:py-28 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-[24ch]">
              {c.eyebrow ? <Eyebrow>{c.eyebrow}</Eyebrow> : null}
              <h2 className="mt-4 text-[clamp(1.9rem,4.4vw,3.4rem)] font-black uppercase leading-[0.98] tracking-[-0.02em]">
                {c.title}
              </h2>
            </div>
            {c.intro ? <p className="max-w-[46ch] text-sm leading-7 text-muted-foreground">{c.intro}</p> : null}
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-12">
            {first ? (
              <Reveal ctx={ctx} className="relative isolate overflow-hidden rounded-[2rem] border border-border lg:col-span-7 lg:row-span-2">
                {first.image ? (
                  <Img image={first.image} className="absolute inset-0 -z-10 h-full w-full object-cover opacity-45" />
                ) : null}
                <div className="flex h-full min-h-[22rem] flex-col justify-end bg-[linear-gradient(180deg,transparent_20%,var(--background)_96%)] p-8 md:p-12">
                  {first.icon ? <first.icon className="h-9 w-9 text-primary" /> : null}
                  <h3 className="mt-5 text-2xl font-black uppercase tracking-tight md:text-4xl">{first.title}</h3>
                  <p className="mt-3 max-w-[46ch] text-sm leading-7 text-muted-foreground md:text-base">{first.text}</p>
                </div>
              </Reveal>
            ) : null}

            <ul className="grid gap-px overflow-hidden rounded-[2rem] border border-border bg-border lg:col-span-5">
              {rest.map((item, i) => (
                <Reveal
                  ctx={ctx}
                  key={item.title}
                  delay={step(ctx, i)}
                  as="li"
                  className="group flex items-start gap-4 bg-background px-6 py-5 transition-colors hover:bg-card"
                >
                  <span className="mt-1 font-mono text-xs text-primary">{String(i + 2).padStart(2, "0")}</span>
                  <span>
                    <span className="flex items-center gap-2 text-sm font-black uppercase tracking-wide">
                      {item.icon ? <item.icon className="h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5" /> : null}
                      {item.title}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-muted-foreground">{item.text}</span>
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>

          {c.ctaLabel ? (
            <div className="mt-10">
              {ctx.renderCta({
                placement: "offers",
                children: c.ctaLabel,
                className:
                  "inline-flex min-h-12 items-center rounded-full border border-primary px-7 text-sm font-black uppercase tracking-[.12em] text-primary transition hover:bg-primary hover:text-primary-foreground",
              })}
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  if (section.variant === "alternating") {
    return (
      <section id={section.id} className="border-y border-border">
        {c.eyebrow || c.title ? (
          <div className="px-6 pt-16 md:px-12 lg:px-20">
            <div className="mx-auto max-w-[1400px]">
              {c.eyebrow ? <Eyebrow>{c.eyebrow}</Eyebrow> : null}
              <h2 className="mt-4 max-w-[20ch] text-[clamp(1.8rem,4vw,3rem)] font-black uppercase leading-[1] tracking-[-0.02em]">
                {c.title}
              </h2>
            </div>
          </div>
        ) : null}
        <div className="divide-y divide-border">
          {c.items.map((item, i) => (
            <Reveal
              ctx={ctx}
              key={item.title}
              delay={step(ctx, i)}
              className={cn(
                "grid items-center gap-6 px-6 py-10 md:grid-cols-[auto_1fr_auto] md:px-12 lg:px-20",
                i % 2 === 1 && "bg-card",
              )}
            >
              <span className="font-mono text-sm text-primary md:text-base">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className={cn("md:max-w-[62ch]", i % 2 === 1 && "md:ml-auto md:text-right")}>
                <h3 className="text-xl font-black uppercase tracking-tight md:text-3xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.text}</p>
              </div>
              {item.meta ? (
                <span className="text-xs font-bold uppercase tracking-[.2em] text-muted-foreground">{item.meta}</span>
              ) : (
                <span aria-hidden className="hidden md:block md:w-6" />
              )}
            </Reveal>
          ))}
        </div>
      </section>
    );
  }

  // grid
  return (
    <section id={section.id} className="px-5 py-16 md:py-24">
      <div className={cn("mx-auto", ctx.maxWidth)}>
        {c.eyebrow ? <Eyebrow>{c.eyebrow}</Eyebrow> : null}
        <h2 className="mt-3 text-2xl font-black uppercase tracking-tight md:text-4xl">{c.title}</h2>
        {c.intro ? <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">{c.intro}</p> : null}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.items.map((item, i) => (
            <Reveal ctx={ctx} key={item.title} delay={step(ctx, i)} as="article" className="rounded-lg border border-border bg-card p-6 transition hover:border-primary">
              {item.icon ? <item.icon className="h-8 w-8 text-primary" /> : null}
              <h3 className="mt-5 text-base font-bold uppercase tracking-wide">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- useCases */

function UseCases({ section, ctx }: { section: UseCasesSection; ctx: SectionContext }) {
  const c = section.content;

  if (section.variant === "imageGrid") {
    return (
      <section id={section.id} className="px-6 py-20 md:px-12 md:py-28 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          {c.eyebrow ? <Eyebrow>{c.eyebrow}</Eyebrow> : null}
          <h2 className="mt-4 max-w-[22ch] text-[clamp(1.8rem,4vw,3rem)] font-black uppercase leading-[1] tracking-[-0.02em]">
            {c.title}
          </h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {c.items.map((item, i) => (
              <Reveal ctx={ctx} key={item.title} delay={step(ctx, i)} as="figure" className="overflow-hidden rounded-2xl border border-border bg-card">
                {item.image ? <Img image={item.image} className="h-56 w-full object-cover" /> : null}
                <figcaption className="p-6">
                  <h3 className="text-base font-black uppercase tracking-wide">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // editorial — texto dominante, coluna estreita + aside sticky
  return (
    <section id={section.id} className="px-6 py-20 md:px-12 md:py-28 lg:px-20">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          {c.eyebrow ? <Eyebrow>{c.eyebrow}</Eyebrow> : null}
          <h2 className="mt-4 text-[clamp(1.8rem,4vw,3.2rem)] font-black uppercase leading-[0.98] tracking-[-0.025em]">
            {c.title}
          </h2>
          {c.intro ? <p className="mt-5 max-w-[42ch] text-sm leading-7 text-muted-foreground">{c.intro}</p> : null}
          {c.aside ? (
            <Reveal ctx={ctx} className="mt-8 overflow-hidden rounded-2xl border border-border">
              <Img image={c.aside} className="w-full object-cover" />
            </Reveal>
          ) : null}
        </div>
        <ol className="divide-y divide-border border-y border-border">
          {c.items.map((item, i) => (
            <Reveal ctx={ctx} key={item.title} delay={step(ctx, i)} as="li" className="grid gap-3 py-8 md:grid-cols-[6rem_1fr]">
              <span className="font-mono text-sm text-primary">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight md:text-2xl">{item.title}</h3>
                <p className="mt-2 max-w-[60ch] text-sm leading-7 text-muted-foreground">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- authority */

function Authority({ section, ctx }: { section: AuthoritySection; ctx: SectionContext }) {
  const c = section.content;

  if (section.variant === "media") {
    return (
      <section id={section.id} className="relative isolate overflow-hidden border-y border-border">
        {c.image ? <Img image={c.image} className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25" /> : null}
        <div className="mx-auto max-w-[70ch] px-6 py-24 text-center md:py-32">
          {c.eyebrow ? <Eyebrow>{c.eyebrow}</Eyebrow> : null}
          <h2 className="mt-4 text-[clamp(1.8rem,4.4vw,3.2rem)] font-black uppercase leading-[1] tracking-[-0.02em]">
            {c.title}
          </h2>
          {c.paragraphs.map((p, i) => (
            <Reveal ctx={ctx} key={p} delay={step(ctx, i)} as="p" className="mt-5 text-sm leading-7 text-muted-foreground md:text-base">
              {p}
            </Reveal>
          ))}
          {c.ctaLabel ? (
            <div className="mt-9">
              {ctx.renderCta({
                placement: "authority",
                children: c.ctaLabel,
                className:
                  "inline-flex min-h-12 items-center rounded-full bg-primary px-8 text-sm font-black uppercase tracking-[.12em] text-primary-foreground hover:opacity-90",
              })}
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  // split — imagem sobreposta + cartão deslocado
  return (
    <section id={section.id} className="px-6 py-20 md:px-12 md:py-28 lg:px-20">
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        {c.image ? (
          <Reveal ctx={ctx} className="relative">
            <Img image={c.image} className="w-full rounded-[2rem] border border-border object-cover" />
            <span
              aria-hidden
              className="absolute -bottom-5 -right-4 hidden h-24 w-40 rounded-2xl border border-primary/50 bg-primary/10 backdrop-blur lg:block"
            />
          </Reveal>
        ) : null}
        <div className="lg:-ml-16 lg:rounded-[2rem] lg:border lg:border-border lg:bg-card lg:p-10">
          {c.eyebrow ? <Eyebrow>{c.eyebrow}</Eyebrow> : null}
          <h2 className="mt-4 text-[clamp(1.7rem,3.6vw,2.8rem)] font-black uppercase leading-[1.02] tracking-[-0.02em]">
            {c.title}
          </h2>
          {c.paragraphs.map((p) => (
            <p key={p} className="mt-4 text-sm leading-7 text-muted-foreground">
              {p}
            </p>
          ))}
          {c.points?.length ? (
            <ul className="mt-7 grid gap-4 sm:grid-cols-2">
              {c.points.map((point, i) => (
                <Reveal ctx={ctx} key={point.title} delay={step(ctx, i)} as="li">
                  <span className="flex items-center gap-2 text-sm font-black uppercase tracking-wide">
                    {point.icon ? <point.icon className="h-4 w-4 text-primary" /> : null}
                    {point.title}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-muted-foreground">{point.text}</span>
                </Reveal>
              ))}
            </ul>
          ) : null}
          {c.footnote ? <p className="mt-6 text-xs uppercase tracking-[.16em] text-muted-foreground">{c.footnote}</p> : null}
          {c.ctaLabel ? (
            <div className="mt-8">
              {ctx.renderCta({
                placement: "authority",
                children: c.ctaLabel,
                className:
                  "inline-flex min-h-12 items-center rounded-full border border-primary px-7 text-sm font-black uppercase tracking-[.12em] text-primary transition hover:bg-primary hover:text-primary-foreground",
              })}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- cta */

function Cta({ section, ctx }: { section: CtaSection; ctx: SectionContext }) {
  const c = section.content;

  if (section.variant === "immersive") {
    return (
      <section id={section.id} className="relative isolate overflow-hidden">
        {c.image ? <Img image={c.image} className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20" /> : null}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(120%_100%_at_50%_0%,color-mix(in_oklab,var(--primary)_28%,transparent),transparent_70%)]"
        />
        <div className="mx-auto max-w-[62ch] px-6 py-24 text-center md:py-32">
          {c.eyebrow ? <Eyebrow>{c.eyebrow}</Eyebrow> : null}
          <MotionReveal
            as="h2"
            variant="scale"
            intensity="EXPRESSIVE"
            className="mt-5 text-[clamp(2rem,6vw,4rem)] font-black uppercase leading-[0.96] tracking-[-0.03em]"
          >
            {c.title}
          </MotionReveal>
          {c.text ? <p className="mt-5 text-sm leading-7 text-muted-foreground md:text-base">{c.text}</p> : null}
          <div className="mt-9">
            {ctx.renderCta({
              placement: "cta",
              children: c.ctaLabel,
              className:
                "inline-flex min-h-14 items-center rounded-full bg-primary px-10 text-sm font-black uppercase tracking-[.14em] text-primary-foreground transition hover:scale-[1.02]",
            })}
          </div>
        </div>
      </section>
    );
  }

  // banner
  return (
    <section id={section.id} className="border-y border-border bg-card px-6 py-14 md:px-12">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          {c.eyebrow ? <Eyebrow>{c.eyebrow}</Eyebrow> : null}
          <h2 className="mt-2 text-2xl font-black uppercase tracking-tight md:text-3xl">{c.title}</h2>
          {c.text ? <p className="mt-2 max-w-[56ch] text-sm leading-6 text-muted-foreground">{c.text}</p> : null}
        </div>
        {ctx.renderCta({
          placement: "cta",
          children: c.ctaLabel,
          className:
            "inline-flex min-h-12 shrink-0 items-center rounded-full bg-primary px-8 text-sm font-black uppercase tracking-[.12em] text-primary-foreground hover:opacity-90",
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- faq */

function Faq({ section, ctx }: { section: FaqSection; ctx: SectionContext }) {
  const c = section.content;
  return (
    <section id={section.id} className="px-6 py-20 md:px-12 md:py-28 lg:px-20">
      <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          {c.eyebrow ? <Eyebrow>{c.eyebrow}</Eyebrow> : null}
          <h2 className="mt-4 text-[clamp(1.7rem,3.6vw,2.8rem)] font-black uppercase leading-[1] tracking-[-0.02em]">
            {c.title}
          </h2>
          {c.ctaLabel ? (
            <div className="mt-7">
              {ctx.renderCta({
                placement: "faq",
                children: c.ctaLabel,
                className:
                  "inline-flex min-h-12 items-center rounded-full border border-primary px-7 text-sm font-black uppercase tracking-[.12em] text-primary transition hover:bg-primary hover:text-primary-foreground",
              })}
            </div>
          ) : null}
        </div>
        <div className="divide-y divide-border border-y border-border">
          {c.items.map((item, i) => (
            <Reveal ctx={ctx} key={item.q} delay={step(ctx, i)}>
              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold">
                  {item.q}
                  <span aria-hidden className="text-primary transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-[70ch] text-sm leading-7 text-muted-foreground">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- proof */

function Stars({ rating }: { rating: number }) {
  const full = Math.round(Math.max(0, Math.min(5, rating)));
  return (
    <span className="text-sm tracking-[.2em] text-primary" aria-label={`${rating} de 5`}>
      <span aria-hidden>{"★".repeat(full)}</span>
      <span aria-hidden className="opacity-30">
        {"★".repeat(5 - full)}
      </span>
    </span>
  );
}

function Proof({ section, ctx }: { section: ProofSection; ctx: SectionContext }) {
  const c = section.content;
  return (
    <section id={section.id} className="border-y border-border bg-card px-6 py-20 md:px-12 md:py-28 lg:px-20">
      <div className={cn("mx-auto grid gap-12 lg:grid-cols-[0.85fr_1.15fr]", ctx.maxWidth)}>
        <div>
          {c.eyebrow ? <Eyebrow>{c.eyebrow}</Eyebrow> : null}
          <h2 className="mt-4 text-[clamp(1.7rem,3.6vw,2.8rem)] font-black uppercase leading-[1] tracking-[-0.02em]">
            {c.title}
          </h2>
          {c.intro ? (
            <p className="mt-4 max-w-[52ch] text-sm leading-7 text-muted-foreground">{c.intro}</p>
          ) : null}
          {c.summary ? (
            <Reveal ctx={ctx} className="mt-8 rounded-3xl border border-border bg-background p-7">
              <p className="text-[clamp(2.6rem,6vw,3.6rem)] font-black leading-none">{c.summary.value}</p>
              <div className="mt-2">
                <Stars rating={Number(c.summary.value.replace(",", ".")) || 5} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {c.summary.count}
                {c.summary.label ? ` · ${c.summary.label}` : ""}
              </p>
              {c.summary.sourceHref ? (
                <a
                  href={c.summary.sourceHref}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="mt-4 inline-flex text-xs font-black uppercase tracking-[.14em] text-primary underline underline-offset-4"
                >
                  {c.summary.sourceLabel}
                </a>
              ) : (
                <p className="mt-4 text-xs font-black uppercase tracking-[.14em] text-primary">
                  {c.summary.sourceLabel}
                </p>
              )}
            </Reveal>
          ) : null}
          {c.ctaLabel ? (
            <div className="mt-7">
              {ctx.renderCta({
                placement: "proof",
                children: c.ctaLabel,
                className:
                  "inline-flex min-h-12 items-center rounded-full border border-primary px-7 text-sm font-black uppercase tracking-[.12em] text-primary transition hover:bg-primary hover:text-primary-foreground",
              })}
            </div>
          ) : null}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {c.items.map((item, i) => (
            <Reveal
              ctx={ctx}
              key={`${item.author}-${i}`}
              delay={step(ctx, i)}
              as="figure"
              className="flex h-full flex-col rounded-3xl border border-border bg-background p-6"
            >
              <Stars rating={item.rating} />
              <blockquote className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">
                “{item.text}”
              </blockquote>
              <figcaption className="mt-5 border-t border-border pt-4 text-xs uppercase tracking-[.14em]">
                <span className="font-black">{item.author}</span>
                {item.date ? <span className="text-muted-foreground"> · {item.date}</span> : null}
                {item.sourceHref ? (
                  <a
                    href={item.sourceHref}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="mt-2 block text-primary underline underline-offset-4"
                  >
                    {item.sourceLabel ?? "Ver origem"}
                  </a>
                ) : item.sourceLabel ? (
                  <span className="mt-2 block text-muted-foreground">{item.sourceLabel}</span>
                ) : null}
              </figcaption>
            </Reveal>
          ))}
          <p className="sm:col-span-2 text-xs leading-6 text-muted-foreground">{c.attribution}</p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- location */

function Location({ section, ctx }: { section: LocationSection; ctx: SectionContext }) {
  const c = section.content;
  return (
    <section id={section.id} className="px-6 py-20 md:px-12 md:py-28 lg:px-20">
      <div className={cn("mx-auto grid items-stretch gap-10 lg:grid-cols-2", ctx.maxWidth)}>
        <div>
          {c.eyebrow ? <Eyebrow>{c.eyebrow}</Eyebrow> : null}
          <h2 className="mt-4 text-[clamp(1.7rem,3.6vw,2.8rem)] font-black uppercase leading-[1] tracking-[-0.02em]">
            {c.title}
          </h2>
          {c.intro ? (
            <p className="mt-4 max-w-[54ch] text-sm leading-7 text-muted-foreground">{c.intro}</p>
          ) : null}

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <Reveal ctx={ctx} className="rounded-3xl border border-border bg-card p-6">
              <p className="text-xs font-black uppercase tracking-[.18em] text-primary">Endereço</p>
              <address className="mt-3 not-italic text-sm leading-7 text-muted-foreground">
                {c.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              {c.mapsLink ? (
                <a
                  href={c.mapsLink.href}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="mt-4 inline-flex min-h-11 items-center rounded-full border border-primary px-5 text-xs font-black uppercase tracking-[.14em] text-primary transition hover:bg-primary hover:text-primary-foreground"
                >
                  {c.mapsLink.label}
                </a>
              ) : null}
            </Reveal>

            <Reveal ctx={ctx} delay={step(ctx, 1)} className="rounded-3xl border border-border bg-card p-6">
              <p className="text-xs font-black uppercase tracking-[.18em] text-primary">Horários</p>
              <dl className="mt-3 space-y-2 text-sm text-muted-foreground">
                {c.hours.map((h) => (
                  <div key={h.days} className="flex items-baseline justify-between gap-4">
                    <dt>{h.days}</dt>
                    <dd className="font-bold text-foreground">{h.hours}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            {c.contact?.length ? (
              <Reveal
                ctx={ctx}
                delay={step(ctx, 2)}
                className="rounded-3xl border border-border bg-card p-6 sm:col-span-2"
              >
                <p className="text-xs font-black uppercase tracking-[.18em] text-primary">Contato</p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {c.contact.map((item) => (
                    <li key={item.label}>
                      <span>{item.label}: </span>
                      {item.href ? (
                        <a className="font-bold text-foreground underline underline-offset-4" href={item.href}>
                          {item.value}
                        </a>
                      ) : (
                        <span className="font-bold text-foreground">{item.value}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
          </div>

          {c.note ? <p className="mt-6 text-xs leading-6 text-muted-foreground">{c.note}</p> : null}
          {c.ctaLabel ? (
            <div className="mt-7">
              {ctx.renderCta({
                placement: "location",
                children: c.ctaLabel,
                className:
                  "inline-flex min-h-12 items-center rounded-full bg-primary px-8 text-sm font-black uppercase tracking-[.12em] text-primary-foreground transition hover:opacity-90",
              })}
            </div>
          ) : null}
        </div>

        {c.image ? (
          <Reveal ctx={ctx} delay={step(ctx, 1)} className="overflow-hidden rounded-[2rem] border border-border">
            <Img image={c.image} className="h-full min-h-[320px] w-full object-cover" />
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- registry */

export function renderBlueprintSection(section: BlueprintSection, ctx: SectionContext): ReactNode {
  const scoped: SectionContext = { ...ctx, motion: section.motion ?? ctx.motion };
  switch (section.type) {
    case "hero":
      return <Hero section={section} ctx={scoped} />;
    case "trust":
      return <Trust section={section} ctx={scoped} />;
    case "offers":
      return <Offers section={section} ctx={scoped} />;
    case "useCases":
      return <UseCases section={section} ctx={scoped} />;
    case "authority":
      return <Authority section={section} ctx={scoped} />;
    case "proof":
      return <Proof section={section} ctx={scoped} />;
    case "location":
      return <Location section={section} ctx={scoped} />;
    case "cta":
      return <Cta section={section} ctx={scoped} />;
    case "faq":
      return <Faq section={section} ctx={scoped} />;
    default:
      return null;
  }
}
