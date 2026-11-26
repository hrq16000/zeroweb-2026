import type { ReactNode } from "react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import type { CtaRenderOptions } from "@/lib/portfolio-composition";
import { ArrowDown, ArrowUpRight, CircleArrowUpRight, MoveUpRight } from "lucide-react";
import { MotionReveal } from "@/components/motion";
import { PortfolioCompositionRoot } from "@/components/portfolio/composition/PortfolioCompositionRoot";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { infinitoSpaComposition as composition } from "./infinito-spa-composition";

const compositionContract = { sectionGraph: "poster>timeline>editorial>faq>dark-close" } as const;

function CTA({ children, placement = "section", className }: { children: ReactNode; placement?: CtaRenderOptions["placement"]; className: string }) {
  return (
    <FunnelCTAButton clientKey="infinito-spa" companySlug="infinito-spa"
      formSlug="funnel-infinito-spa" location={`infinito-spa_${placement}`}
      className={className} showArrow={false}>{children}</FunnelCTAButton>
  );
}
        <header className="relative z-20 border-b border-[#1e3028]/10 bg-[#f1eee5] px-5 py-4 sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-5">
            <a href="#inicio" aria-label="Infinito Spa, inicio" className="group flex items-center gap-3">
              <PortfolioImage src=¶»§q«^