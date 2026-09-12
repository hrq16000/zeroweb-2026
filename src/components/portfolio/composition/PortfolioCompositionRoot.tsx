/**
 * PortfolioCompositionRoot — infraestrutura, nunca composição.
 *
 * docs/PORTFOLIO_UNIQUE_COMPOSITION_STANDARD.md §3 e §6.
 *
 * O que esta raiz faz: escopo de motion, tema do cliente, marcadores de
 * auditoria/QA e camada institucional. O que ela NÃO faz e nunca fará:
 * header, navegação, hero, grid, seções, ordem, CTA posicionado ou
 * encerramento. Tudo isso é JSX autoral de cada projeto.
 */
import type { ReactNode } from "react";
import { MotionScope } from "@/components/motion";
import { usePortfolioRuntime } from "@/components/portfolio/PortfolioRuntimeContext";
import type { PortfolioComposition } from "@/lib/portfolio-composition";

export function PortfolioCompositionRoot({
  composition,
  children,
}: {
  composition: PortfolioComposition;
  children: ReactNode;
}) {
  const runtime = usePortfolioRuntime();
  const intensity = runtime?.motion?.intensity ?? composition.motionIntensity ?? "BALANCED";

  return (
    <MotionScope intensity={intensity}>
      <div
        className="min-h-dvh bg-background text-foreground"
        style={composition.theme}
        data-portfolio-composition={composition.slug}
        data-composition-hero={composition.brief.compositionFingerprint.heroGeometry}
        data-composition-header={composition.brief.compositionFingerprint.headerTreatment}
        data-composition-graph={composition.brief.compositionFingerprint.sectionGraph}
        data-motion="scope"
        data-motion-intensity={intensity}
      >
        {children}
        {composition.afterContent}
      </div>
    </MotionScope>
  );
}
