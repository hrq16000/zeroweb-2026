import { useEffect, useRef } from "react";
import { PortfolioCover } from "@/components/portfolio/PortfolioCover";
import portfolioCatalog from "@/config/portfolio-catalog.json";
import { Home2Prototype } from "./Home2Prototype";
import "./home2-personality.css";
import "./home2-matrix-enhancements.css";
import "./home2-prime-polish.css";
import "./home2-prime-runtime.css";

type CatalogItem = {
  slug: string;
  clientKey?: string;
  title: string;
  status?: string;
  live?: boolean;
  image?: string;
  fallbackImage?: string;
};

const CAPABILITIES = [
  "Marca",
  "Sites",
  "Presença local",
  "SEO",
  "Tráfego",
  "Automação",
  "IA",
] as const;

const HERO_PROJECTS = (portfolioCatalog as CatalogItem[])
  .filter((item) => item.status === "published" && item.live !== false && Boolean(item.slug))
  .slice(0, 3);

/**
 * Progressive enhancement layer for /home2.
 *
 * Home2Prototype remains the content/source layer. This wrapper adds a distinct
 * institutional art direction, real-project media and interaction depth without
 * duplicating the route, inventing proof, or adding a second animation runtime.
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
      const normalizedX = x / Math.max(rect.width, 1) - 0.5;
      const normalizedY = y / Math.max(rect.height, 1) - 0.5;

      shell.style.setProperty("--home2-pointer-x", `${x.toFixed(1)}px`);
      shell.style.setProperty("--home2-pointer-y", `${y.toFixed(1)}px`);
      shell.style.setProperty("--home2-prime-x", `${(normalizedX * 16).toFixed(2)}px`);
      shell.style.setProperty("--home2-prime-y", `${(normalizedY * 12).toFixed(2)}px`);
    };

    const resetPointer = () => {
      shell.style.setProperty("--home2-pointer-x", "72%");
      shell.style.setProperty("--home2-pointer-y", "34%");
      shell.style.setProperty("--home2-prime-x", "0px");
      shell.style.setProperty("--home2-prime-y", "0px");
    };

    if (!reducedMotion && finePointer && hero) {
      hero.addEventListener("pointermove", onPointerMove, { passive: true });
      hero.addEventListener("pointerleave", resetPointer);
    }

    const observedSections = Array.from(
      shell.querySelectorAll<HTMLElement>("#sobre, #solucoes, #processo, #projetos, #conteudo"),
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

      {HERO_PROJECTS.length > 0 ? (
        <div className="home2-prime-hero-showcase" aria-hidden="true">
          <span className="home2-prime-orbit" />
          {HERO_PROJECTS.map((project, index) => (
            <span
              key={project.slug}
              className={`home2-prime-project home2-prime-project--${String.fromCharCode(97 + index)}`}
            >
              <PortfolioCover
                clientKey={project.clientKey}
                slug={project.slug}
                title={project.title}
                image={project.image}
                fallbackImage={project.fallbackImage}
                className="h-full w-full object-cover"
                width={520}
                height={680}
                sizes="(max-width: 840px) 58vw, 24vw"
                priority={index === 0}
              />
            </span>
          ))}
          <span className="home2-prime-signal home2-prime-signal--a">Sites autorais</span>
          <span className="home2-prime-signal home2-prime-signal--b">SEO + descoberta</span>
          <span className="home2-prime-signal home2-prime-signal--c">Motion + conversão</span>
        </div>
      ) : null}

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
