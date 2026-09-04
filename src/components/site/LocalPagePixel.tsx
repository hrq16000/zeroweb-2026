/**
 * Pixel das páginas locais (capitais).
 *
 * Reaproveita o pixel anônimo do quiz (`quiz_pixel_events`) — sem cookie,
 * sem PII — para medir por cidade: visualização da página, cliques em CTA e
 * abandono (saída sem nenhum clique de conversão).
 *
 * A chave usada é a mesma do quiz da cidade (`institucional-<slug>`), o que
 * permite cruzar página → quiz → lead sem criar um segundo padrão.
 */
import { useEffect } from "react";
import { trackQuiz } from "@/lib/quiz-pixel";

export const LOCAL_PIXEL_STEPS = {
  pageView: "page_view",
  ctaClick: "cta_click",
  abandon: "page_abandon",
} as const;

/** Marca uma interação de CTA da página local (não é etapa do quiz). */
export function trackLocalCta(quizKey: string, label: string): void {
  if (typeof window !== "undefined") {
    (window as unknown as Record<string, unknown>)["__0web_local_engaged"] = true;
  }
  trackQuiz({
    quizKey,
    eventType: "answer_click",
    stepKey: LOCAL_PIXEL_STEPS.ctaClick,
    stepIndex: 0,
    answerLabel: label.slice(0, 120),
  });
}

/** Componente invisível: dispara page_view na montagem e abandono na saída. */
export function LocalPagePixel({ quizKey }: { quizKey: string }) {
  useEffect(() => {
    (window as unknown as Record<string, unknown>)["__0web_local_engaged"] = false;
    trackQuiz({
      quizKey,
      eventType: "step_view",
      stepKey: LOCAL_PIXEL_STEPS.pageView,
      stepIndex: 0,
    });

    const onLeave = () => {
      const engaged = (window as unknown as Record<string, unknown>)["__0web_local_engaged"];
      if (engaged) return;
      trackQuiz({
        quizKey,
        eventType: "abandon",
        stepKey: LOCAL_PIXEL_STEPS.abandon,
        stepIndex: 0,
      });
    };
    window.addEventListener("pagehide", onLeave);
    return () => window.removeEventListener("pagehide", onLeave);
  }, [quizKey]);

  return null;
}
