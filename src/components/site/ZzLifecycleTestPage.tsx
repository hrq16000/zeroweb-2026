import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";

/**
 * WORKBENCH de ZZ Lifecycle Test (/portfolio/zz-lifecycle-test).
 *
 * NÃO PUBLICAR enquanto data-portfolio-scaffold="CREATIVE_BRIEF_REQUIRED" existir.
 * Antes do layout, preencher docs/portfolio/briefs/zz-lifecycle-test.md e seguir
 * docs/PORTFOLIO_CREATIVE_DIRECTION_STANDARD.md.
 */
export function ZzLifecycleTestPage() {
  return (
    <div
      data-client-slug="zz-lifecycle-test"
      data-portfolio-scaffold="CREATIVE_BRIEF_REQUIRED"
      className="min-h-dvh bg-background text-foreground"
    >
      <main>
        <section aria-labelledby="zz-lifecycle-test-workbench-title" className="mx-auto max-w-3xl px-4 py-20 md:py-28">
          <p className="text-sm font-medium text-muted-foreground">Direção criativa pendente</p>
          <h1 id="zz-lifecycle-test-workbench-title" className="mt-3 text-3xl font-semibold md:text-5xl">
            ZZ Lifecycle Test
          </h1>
          <p className="mt-5 max-w-[65ch] text-muted-foreground">
            Este componente é somente a base técnica. Substitua esta composição por uma direção autoral do cliente antes de publicar.
          </p>
          <div className="mt-8 transition-opacity">
            <FunnelCTAButton
              clientKey="zz-lifecycle-test"
              companySlug="zz-lifecycle-test"
              formSlug="funnel-zz-lifecycle-test"
              location="zz-lifecycle-test_workbench"
            >
              Iniciar contato
            </FunnelCTAButton>
          </div>
        </section>
      </main>
      <PortfolioHostCredit />
    </div>
  );
}
