/**
 * PortfolioBlueprintRenderer — motor compartilhado, composição individual.
 *
 * Responsabilidade única: receber um Blueprint, ordenar as seções, ignorar as
 * desativadas, resolver `type` + `variant` e renderizar. Nenhuma regra de
 * projeto específico vive aqui, e nenhuma ordem de seções é fixa.
 */
import { Fragment } from "react";
import { MotionScope } from "@/components/motion";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { BlueprintFloatingCta } from "./BlueprintFloatingCta";
import { renderBlueprintSection, type SectionContext } from "./sections";
import type { PortfolioBlueprint } from "@/lib/portfolio-blueprint";
import { cn } from "@/lib/utils";

export function PortfolioBlueprintRenderer({ blueprint }: { blueprint: PortfolioBlueprint }) {
  const { identity, layout, sections } = blueprint;
  const maxWidth = layout.maxWidth ?? "max-w-6xl";

  const ctx: SectionContext = {
    renderCta: blueprint.renderCta,
    maxWidth,
    motion: undefined,
  };

  const ordered = sections
    .filter((section) => section.enabled !== false)
    .slice()
    .sort((a, b) => a.order - b.order);

  return (
    <MotionScope intensity={layout.motionIntensity ?? "BALANCED"}>
      <div
        className="min-h-dvh bg-background text-foreground"
        style={blueprint.theme}
        data-blueprint={blueprint.slug}
      >
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 px-5 backdrop-blur md:px-10">
          <div className={cn("mx-auto flex min-h-20 items-center justify-between gap-4", maxWidth)}>
            <a href="#inicio" aria-label={`${identity.name} — início`} className="shrink-0">
              {identity.logo ? (
                <PortfolioImage
                  src={identity.logo.src}
                  alt={identity.logo.alt}
                  width={identity.logo.width}
                  height={identity.logo.height}
                  managedField={identity.logo.managedField}
                  className="h-11 w-auto object-contain"
                />
              ) : (
                <span className="text-lg font-black uppercase tracking-tight">{identity.name}</span>
              )}
            </a>
            {identity.nav?.length ? (
              <nav
                aria-label="Navegação principal"
                className="hidden items-center gap-7 text-xs font-bold uppercase tracking-[.14em] md:flex"
              >
                {identity.nav.map((link) => (
                  <a key={link.href} href={link.href} className="hover:text-primary">
                    {link.label}
                  </a>
                ))}
              </nav>
            ) : null}
            {layout.headerCtaLabel
              ? blueprint.renderCta({
                  placement: "header",
                  children: layout.headerCtaLabel,
                  className:
                    "inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-xs font-black uppercase tracking-[.12em] text-primary-foreground hover:opacity-90",
                })
              : null}
          </div>
        </header>

        <main id="inicio">
          {ordered.map((section) => (
            <Fragment key={`${section.type}-${section.order}`}>
              {section.theme ? (
                <div style={section.theme}>{renderBlueprintSection(section, ctx)}</div>
              ) : (
                renderBlueprintSection(section, ctx)
              )}
            </Fragment>
          ))}
        </main>

        {layout.floatingConversion?.mode === "enabled" ? (
          <BlueprintFloatingCta
            renderCta={blueprint.renderCta}
            label={layout.floatingConversion.label}
            hint={layout.floatingConversion.hint}
          />
        ) : null}

        {blueprint.afterContent}
      </div>
    </MotionScope>
  );
}
