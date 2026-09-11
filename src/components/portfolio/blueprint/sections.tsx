/**
 * Biblioteca de seções do Portfolio Blueprint (FASE 1).
 *
 * Cada tipo tem variantes com **composição** diferente — não apenas conteúdo
 * diferente. Nenhuma regra específica de projeto vive aqui: tudo vem do
 * Blueprint do cliente.
 */
import type { ReactNode } from "react";
import {
  MotionCounter,
  MotionParallax,
  MotionReveal,
  useScrollProgress,
} from "@/components/motion";
import { ManagedText } from "@/components/portfolio/ManagedText";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { cn } from "@/lib/utils";
import type {
  AuthoritySection,
  BlueprintCtaRenderer,
  BlueprintImage,
  BlueprintSection,
  BlueprintSectionMotion,
  CapabilitiesSection,
  CtaSection,
  FaqSection,
  HeroSection,
  LocationSection,
  OffersSection,
  ProcessSection,
  ProofSection,
  SignalsSection,
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

/**
 * Microinteração de hover declarada pelo Blueprint (adendo de motion §2).
 * Só `transform`/`opacity`/cor; ausência = comportamento estático anterior.
 */
function hoverClass(ctx: SectionContext): string | undefined {
  switch (ctx.motion?.hover) {
    case "lift":
      return "transition duration-300 ease-out will-change-transform hover:-translate-y-1 hover:border-primary/60 focus-within:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none";
    case "glow":
      return "transition duration-300 ease-out hover:border-primary/70 hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_45%,transparent)] motion-reduce:transition-none";
    default:
      return undefined;
  }
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
                    {typeof stat.countTo === "number" && ctx.motion?.counters !== false ? (
                      <MotionCounter
                        value={stat.countTo}
                        prefix={stat.countPrefix ?? ""}
                        suffix={stat.countSuffix ?? ""}
                      />
                    ) : (
                      stat.value
                    )}
                  </dd>
                </Reveal>
              ))}
            </dl>
          ) : null}
        </div>
      </section>
    );
  }

  /**
   * `asymmetric` — mídia dominante à direita, painel de texto deslocado que
   * atravessa a imagem, régua de sinais colada à base. Registro tipográfico
   * em caixa mista e serifa técnica; nada de faixa central de banner.
   */
  if (section.variant === "asymmetric") {
    return (
      <section id={section.id} className="relative overflow-hidden pb-0 pt-24 md:pt-28">
        <div className="mx-auto grid max-w-[1500px] items-end gap-10 px-6 md:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-0 lg:px-12">
          <div className="relative z-10 lg:pb-24 lg:pr-10">
            {c.eyebrow ? (
              <p className="flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[.34em] text-primary">
                <span aria-hidden className="h-px w-10 bg-primary" />
                {c.eyebrow}
              </p>
            ) : null}
            <MotionReveal
              as="h1"
              variant="up"
              intensity="EXPRESSIVE"
              className="mt-7 max-w-[15ch] text-[clamp(2.5rem,5.4vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.035em]"
            >
              {headline}
            </MotionReveal>
            {sub ? (
              <Reveal
                ctx={ctx}
                delay={110}
                as="p"
                className="mt-6 max-w-[48ch] border-l-2 border-primary/60 pl-5 text-base leading-8 text-muted-foreground"
              >
                {sub}
              </Reveal>
            ) : null}
            {c.highlights?.length ? (
              <ul className="mt-7 flex flex-wrap gap-2">
                {c.highlights.map((item, i) => (
                  <Reveal
                    ctx={ctx}
                    key={item}
                    delay={step(ctx, i)}
                    as="li"
                    className="rounded-sm border border-border px-3 py-1.5 text-xs font-medium tracking-wide text-muted-foreground"
                  >
                    {item}
                  </Reveal>
                ))}
              </ul>
            ) : null}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              {c.ctaLabel
                ? ctx.renderCta({
                    placement: "hero",
                    children: c.ctaLabel,
                    className:
                      "inline-flex min-h-13 items-center rounded-sm bg-primary px-8 text-sm font-bold uppercase tracking-[.14em] text-primary-foreground transition hover:translate-y-[-2px]",
                  })
                : null}
              {c.secondary ? (
                <a
                  href={c.secondary.href}
                  className="text-sm font-semibold underline decoration-primary/50 underline-offset-8 hover:text-primary"
                >
                  {c.secondary.label}
                </a>
              ) : null}
            </div>
          </div>

          {c.image ? (
            <Reveal
              ctx={ctx}
              delay={80}
              className="relative -mx-6 overflow-hidden md:-mx-10 lg:mx-0 lg:-ml-16"
            >
              <MotionParallax speed={ctx.motion?.parallax ?? 0} className="h-[52vh] lg:h-[76vh]">
                <Img
                  image={{ ...c.image, priority: true }}
                  className="h-[52vh] w-full scale-[1.06] object-cover lg:h-[76vh]"
                />
              </MotionParallax>
              <span
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(90deg,var(--background)_0%,transparent_38%),linear-gradient(0deg,var(--background)_2%,transparent_35%)]"
              />
            </Reveal>
          ) : null}
        </div>

        {c.stats?.length ? (
          <div className="mx-auto max-w-[1500px] px-6 md:px-10 lg:px-12">
            <dl className="grid grid-cols-2 border-t border-border md:grid-cols-4">
              {c.stats.map((stat, i) => (
                <Reveal
                  ctx={ctx}
                  key={stat.label}
                  delay={step(ctx, i)}
                  className="border-b border-border px-1 py-6 md:border-b-0 md:border-r md:px-6 md:last:border-r-0 md:first:pl-0"
                >
                  <dd className="text-2xl font-semibold tracking-tight md:text-3xl">
                    {typeof stat.countTo === "number" && ctx.motion?.counters !== false ? (
                      <MotionCounter
                        value={stat.countTo}
                        prefix={stat.countPrefix ?? ""}
                        suffix={stat.countSuffix ?? ""}
                      />
                    ) : (
                      stat.value
                    )}
                  </dd>
                  <dt className="mt-1 text-xs uppercase tracking-[.18em] text-muted-foreground">
                    {stat.label}
                  </dt>
                </Reveal>
              ))}
            </dl>
          </div>
        ) : null}
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

  /**
   * `list` — oferta como índice editorial numerado (linhas largas, sem grade
   * de cards). Boa quando o valor está na descrição e não em ícones.
   */
  if (section.variant === "list") {
    return (
      <section id={section.id} className="px-6 py-20 md:px-10 md:py-28 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <div>
              {c.eyebrow ? <Eyebrow>{c.eyebrow}</Eyebrow> : null}
              <h2 className="mt-4 max-w-[16ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
                {c.title}
              </h2>
            </div>
            {c.intro ? (
              <p className="max-w-[60ch] self-end text-sm leading-8 text-muted-foreground md:text-base">
                {c.intro}
              </p>
            ) : null}
          </div>

          <ul className="mt-14 border-t border-border">
            {c.items.map((item, i) => (
              <Reveal
                ctx={ctx}
                key={item.title}
                delay={step(ctx, i)}
                as="li"
                className={cn(
                  "group grid gap-3 border-b border-border py-7 md:grid-cols-[5rem_minmax(0,22ch)_minmax(0,1fr)] md:items-baseline md:gap-8",
                  hoverClass(ctx),
                )}
              >
                <span className="font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex items-center gap-3 text-lg font-semibold tracking-tight md:text-xl">
                  {item.icon ? <item.icon className="h-5 w-5 shrink-0 text-primary" /> : null}
                  {item.title}
                </span>
                <span className="block text-sm leading-7 text-muted-foreground">
                  {item.text}
                  {item.meta ? (
                    <span className="mt-2 block text-xs uppercase tracking-[.16em] text-primary/80">
                      {item.meta}
                    </span>
                  ) : null}
                </span>
              </Reveal>
            ))}
          </ul>

          {c.ctaLabel ? (
            <div className="mt-10">
              {ctx.renderCta({
                placement: "offers",
                children: c.ctaLabel,
                className:
                  "inline-flex min-h-12 items-center rounded-sm bg-primary px-8 text-sm font-bold uppercase tracking-[.14em] text-primary-foreground transition hover:translate-y-[-2px]",
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
              <Reveal
                ctx={ctx}
                key={item.title}
                delay={step(ctx, i)}
                as="figure"
                className={cn("group overflow-hidden rounded-2xl border border-border bg-card", hoverClass(ctx))}
              >
                {item.image ? (
                  <Img
                    image={item.image}
                    className="h-56 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
                  />
                ) : null}
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

  /**
   * `panel` — bloco de conversão assimétrico: mídia real de um lado, painel
   * de decisão do outro. Continua chamando o funil individual do projeto.
   */
  if (section.variant === "panel") {
    return (
      <section id={section.id} className="border-y border-border">
        <div className="mx-auto grid max-w-[1500px] items-stretch lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
          {c.image ? (
            <div className="relative min-h-[240px] overflow-hidden lg:min-h-[420px]">
              <Img image={c.image} className="absolute inset-0 h-full w-full object-cover" />
              <span
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--background)_35%,transparent),color-mix(in_oklab,var(--background)_82%,transparent))] lg:bg-[linear-gradient(90deg,color-mix(in_oklab,var(--background)_30%,transparent),var(--background))]"
              />
            </div>
          ) : null}
          <div className="flex flex-col justify-center px-6 py-16 md:px-12 md:py-20">
            {c.eyebrow ? <Eyebrow>{c.eyebrow}</Eyebrow> : null}
            <MotionReveal
              as="h2"
              variant="up"
              intensity="EXPRESSIVE"
              className="mt-4 max-w-[18ch] text-[clamp(1.9rem,4vw,3.1rem)] font-semibold leading-[1.04] tracking-[-0.03em]"
            >
              {c.title}
            </MotionReveal>
            {c.text ? (
              <p className="mt-5 max-w-[52ch] text-sm leading-8 text-muted-foreground md:text-base">
                {c.text}
              </p>
            ) : null}
            <div className="mt-8">
              {ctx.renderCta({
                placement: "cta",
                children: c.ctaLabel,
                className:
                  "inline-flex min-h-14 items-center rounded-sm bg-primary px-9 text-sm font-bold uppercase tracking-[.14em] text-primary-foreground transition hover:translate-y-[-2px]",
              })}
            </div>
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
              className={cn(
                "flex h-full flex-col rounded-3xl border border-border bg-background p-6",
                hoverClass(ctx),
              )}
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

/* --------------------------------------------------------------- signals */

/** Faixa curta de sinais verificados (adendo §4). Conteúdo 100% do projeto. */
function Signals({ section, ctx }: { section: SignalsSection; ctx: SectionContext }) {
  const c = section.content;
  return (
    <section id={section.id} className="border-y border-border bg-card/60">
      <div className="mx-auto max-w-[1500px] px-6 py-8 md:px-12">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {c.items.map((item, i) => (
            <Reveal
              ctx={ctx}
              key={item.label}
              delay={step(ctx, i)}
              as="li"
              className="flex items-start gap-3"
            >
              {item.icon ? <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> : null}
              <span>
                <span className="block text-base font-semibold tracking-tight">
                  {typeof item.countTo === "number" ? (
                    <MotionCounter
                      value={item.countTo}
                      prefix={item.countPrefix ?? ""}
                      suffix={item.countSuffix ?? ""}
                    />
                  ) : (
                    item.value
                  )}
                </span>
                <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                  {item.label}
                </span>
              </span>
            </Reveal>
          ))}
        </ul>
        {c.attribution ? (
          <p className="mt-5 text-[0.7rem] leading-5 text-muted-foreground">{c.attribution}</p>
        ) : null}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- capabilities */

/** Autoridade operacional (adendo §5): o que a operação comporta, com fato. */
function Capabilities({ section, ctx }: { section: CapabilitiesSection; ctx: SectionContext }) {
  const c = section.content;
  return (
    <section id={section.id} className="relative isolate overflow-hidden px-6 py-20 md:px-12 md:py-24">
      {c.image ? (
        <>
          <Img image={c.image} className="absolute inset-0 -z-10 h-full w-full object-cover" />
          {/*
           * A imagem é textura de fundo, não conteúdo: o texto por cima precisa
           * manter contraste AA. O véu é praticamente opaco na faixa do título
           * e do intro e abre um pouco só no rodapé da seção.
           */}
          <span
            aria-hidden
            className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--background)_98%,transparent)_0%,color-mix(in_oklab,var(--background)_96%,transparent)_55%,color-mix(in_oklab,var(--background)_92%,transparent)_100%)]"
          />
        </>
      ) : null}
      <div className="mx-auto max-w-[1400px]">
        {c.eyebrow ? <Eyebrow>{c.eyebrow}</Eyebrow> : null}
        {/* leading folgado + pb: descendentes (p, g, q) não podem ser cortadas. */}
        <h2 className="mt-4 max-w-[20ch] text-balance pb-1 text-[clamp(1.7rem,3.4vw,2.6rem)] font-semibold leading-[1.18] tracking-[-0.02em]">
          {c.title}
        </h2>
        {c.intro ? (
          <p className="mt-4 max-w-[64ch] text-sm leading-8 text-foreground/80">{c.intro}</p>
        ) : null}
        <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-3">
          {c.groups.map((group, i) => (
            <Reveal
              ctx={ctx}
              key={group.title}
              delay={step(ctx, i)}
              className="bg-background/95 p-6 backdrop-blur-sm"
            >
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-primary">
                {group.icon ? <group.icon className="h-4 w-4" /> : null}
                {group.title}
              </p>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-primary/70" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
        {c.note ? <p className="mt-6 text-xs leading-6 text-muted-foreground">{c.note}</p> : null}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- process */

/** Processo em linha do tempo vertical (adendo §9), não quatro cards iguais. */
function Process({ section, ctx }: { section: ProcessSection; ctx: SectionContext }) {
  const c = section.content;
  /**
   * Signature motion opcional (adendo de motion §5): a linha do tempo se
   * preenche conforme o scroll avança. Sem JS ou com reduced motion o traço
   * já nasce completo e nenhum passo depende da animação para ser lido.
   */
  const showProgress = ctx.motion?.scrollProgress === true;
  const { ref: progressRef, progress } = useScrollProgress<HTMLOListElement>(showProgress);
  return (
    <section id={section.id} className="px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          {c.eyebrow ? <Eyebrow>{c.eyebrow}</Eyebrow> : null}
          <h2 className="mt-4 max-w-[14ch] text-[clamp(1.8rem,3.6vw,2.8rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
            {c.title}
          </h2>
          {c.intro ? (
            <p className="mt-4 max-w-[46ch] text-sm leading-8 text-muted-foreground">{c.intro}</p>
          ) : null}
          {c.ctaLabel ? (
            <div className="mt-8">
              {ctx.renderCta({
                placement: "inline",
                children: c.ctaLabel,
                className:
                  "inline-flex min-h-12 items-center rounded-sm border border-primary px-7 text-sm font-bold uppercase tracking-[.14em] text-primary transition hover:bg-primary hover:text-primary-foreground",
              })}
            </div>
          ) : null}
        </div>

        <ol ref={showProgress ? progressRef : undefined} className="relative border-l border-border pl-8">
          {showProgress ? (
            <span
              aria-hidden
              className="absolute -left-px top-0 w-px origin-top bg-primary"
              style={{
                height: "100%",
                transform: `scaleY(${progress.toFixed(3)})`,
                transition: "transform 220ms linear",
              }}
            />
          ) : null}
          {c.steps.map((item, i) => (
            <Reveal
              ctx={ctx}
              key={item.title}
              delay={step(ctx, i)}
              as="li"
              className="relative pb-10 last:pb-0"
            >
              <span
                aria-hidden
                className="absolute -left-[2.15rem] top-1 flex h-6 w-6 items-center justify-center rounded-full border border-primary bg-background font-mono text-[0.65rem] text-primary"
              >
                {i + 1}
              </span>
              <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
              {item.meta ? (
                <p className="mt-1 text-xs uppercase tracking-[.16em] text-primary/80">{item.meta}</p>
              ) : null}
              <p className="mt-2 max-w-[56ch] text-sm leading-7 text-muted-foreground">{item.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
      {c.note ? (
        <p className="mx-auto mt-8 max-w-[1400px] text-xs leading-6 text-muted-foreground">{c.note}</p>
      ) : null}
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
    case "signals":
      return <Signals section={section} ctx={scoped} />;
    case "capabilities":
      return <Capabilities section={section} ctx={scoped} />;
    case "process":
      return <Process section={section} ctx={scoped} />;
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
