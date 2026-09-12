import { useEffect, useRef } from "react";
import { Home2Prototype } from "./Home2Prototype";
import "./home2-personality.css";

const CAPABILITIES = [
  "Marca",
  "Sites",
  "Presença local",
  "SEO",
  "Tráfego",
  "Automação",
  "IA",
] as const;

/**
 * Progressive enhancement layer for /home2.
 *
 * Home2Prototype remains the content/source layer created in Lovable. This
 * wrapper adds a distinct institutional art direction without duplicating the
 * page, changing routes, inventing proof, or adding a new animation runtime.
 */
export function Home2PersonalityExperience() {
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const hero = shell.querySelector<HTMLElement>(".home2-hero");
    let scrollFrame = 0;

    const updateScrollProgress = () => {
      scrollFrame = 0;
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      shell.style.setProperty("--home2-page-progress", `${(progress * 100).toFixed(2)}%`);
    };

    const scheduleScrollProgress = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(updateScrollProgress);
    };

    updateScrollProgress();
    window.addEventListener("scroll", scheduleScrollProgress, { passive: true });
    window.addEventListener("resize", scheduleScrollProgress, { passive: true });

    const onPointerMove = (event: PointerEvent) => {
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const x = Math.min(rect.width, Math.max(0, event.clientX - rect.left));
      const y = Math.min(rect.height, Math.max(0, event.clientY - rect.top));
      shell.style.setProperty("--home2-pointer-x", `${x.toFixed(1)}px`);
      shell.style.setProperty("--home2-pointer-y", `${y.toFixed(1)}px`);
    };

    const resetPointer = () => {
      shell.style.setProperty("--home2-pointer-x", "72%");
      shell.style.setProperty("--home2-pointer-y", "34%");
    };

    if (!reducedMotion && finePointer && hero) {
      hero.addEventListener("pointermove", onPointerMove, { passive: true });
      hero.addEventListener("pointerleave", resetPointer);
    }

    const observedSections = Array.from(
      shell.querySelectorAll<HTMLElement>("#sobre, #solucoes, #projetos, #conteudo"),
    );
    let sectionObserver: IntersectionObserver | null = null;

    if (typeof IntersectionObserver !== "undefined" && observedSections.length) {
      sectionObserver = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (visible?.target instanceof HTMLElement) {
            shell.dataset.activeSection = visible.target.id;
          }
        },
        { threshold: [0.18, 0.42, 0.68], rootMargin: "-14% 0px -48% 0px" },
      );
      observedSections.forEach((section) => sectionObserver?.observe(section));
    }

    return () => {
      window.removeEventListener("scroll", scheduleScrollProgress);
      window.removeEventListener("resize", scheduleScrollProgress);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      if (hero) {
        hero.removeEventListener("pointermove", onPointerMove);
        hero.removeEventListener("pointerleave", resetPointer);
      }
      sectionObserver?.disconnect();
    };
  }, []);

  return (
    <div className="home2-personality-shell" ref={shellRef}>
      <div className="home2-page-progress" aria-hidden="true">
        <span />
      </div>

      <div className="home2-capability-rail" aria-hidden="true">
        <span className="home2-capability-label">Sistema 0WEB</span>
        <div className="home2-capability-list">
          {CAPABILITIES.map((capability, index) => (
            <span key={capability}>
              {capability}
              {index < CAPABILITIES.length - 1 ? <i>↗</i> : null}
            </span>
          ))}
        </div>
      </div>

      <div className="home2-scroll-cue" aria-hidden="true">
        <span>Explore</span>
        <i />
      </div>

      <Home2Prototype />
    </div>
  );
}
