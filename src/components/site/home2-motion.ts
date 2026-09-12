export type Home2MotionEffect =
  | "fade-up"
  | "fade-left"
  | "fade-right"
  | "blur-in"
  | "scale-in"
  | "image-reveal"
  | "clip-reveal"
  | "stagger-up";

export type Home2MotionRule = {
  id: string;
  selector: string;
  effect: Home2MotionEffect;
  trigger: "load" | "scroll";
  duration?: number;
  delay?: number;
  stagger?: number;
  threshold?: number;
};

/**
 * Home2 has its own motion grammar. This intentionally does not reuse the
 * portfolio motion profile: the institutional home needs a cinematic hero,
 * editorial reveals, image masks and a different scroll rhythm.
 */
export const home2MotionMatrix: Home2MotionRule[] = [
  {
    id: "hero-copy",
    selector: ".home2-hero [data-home2-load]",
    effect: "stagger-up",
    trigger: "load",
    duration: 820,
    delay: 120,
    stagger: 105,
  },
  {
    id: "strategy-media",
    selector: ".home2-strategy [data-home2-motion='media']",
    effect: "scale-in",
    trigger: "scroll",
    duration: 900,
    threshold: 0.2,
  },
  {
    id: "strategy-copy",
    selector: ".home2-strategy [data-home2-motion='copy']",
    effect: "fade-left",
    trigger: "scroll",
    duration: 780,
    threshold: 0.22,
  },
  {
    id: "section-headings",
    selector: "[data-home2-motion='heading']",
    effect: "fade-up",
    trigger: "scroll",
    duration: 760,
    threshold: 0.16,
  },
  {
    id: "services",
    selector: ".home2-service-card",
    effect: "stagger-up",
    trigger: "scroll",
    duration: 720,
    stagger: 85,
    threshold: 0.12,
  },
  {
    id: "experience-copy",
    selector: "[data-home2-motion='experience-copy']",
    effect: "fade-right",
    trigger: "scroll",
    duration: 820,
    threshold: 0.2,
  },
  {
    id: "experience-proof",
    selector: ".home2-proof-card",
    effect: "stagger-up",
    trigger: "scroll",
    duration: 680,
    stagger: 90,
    threshold: 0.12,
  },
  {
    id: "projects",
    selector: ".home2-project-media",
    effect: "clip-reveal",
    trigger: "scroll",
    duration: 900,
    stagger: 80,
    threshold: 0.1,
  },
  {
    id: "editorial",
    selector: "[data-home2-editorial-reveal]",
    effect: "image-reveal",
    trigger: "scroll",
    duration: 840,
    stagger: 110,
    threshold: 0.1,
  },
  {
    id: "principles",
    selector: ".home2-principle",
    effect: "stagger-up",
    trigger: "scroll",
    duration: 720,
    stagger: 95,
    threshold: 0.12,
  },
  {
    id: "final-cta",
    selector: ".home2-final-grid",
    effect: "scale-in",
    trigger: "scroll",
    duration: 860,
    threshold: 0.2,
  },
];

const effectClass: Record<Home2MotionEffect, string> = {
  "fade-up": "home2-motion-fade-up",
  "fade-left": "home2-motion-fade-left",
  "fade-right": "home2-motion-fade-right",
  "blur-in": "home2-motion-blur-in",
  "scale-in": "home2-motion-scale-in",
  "image-reveal": "home2-motion-image-reveal",
  "clip-reveal": "home2-motion-clip-reveal",
  "stagger-up": "home2-motion-fade-up",
};

export function initHome2Motion(root: HTMLElement) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cleanups: Array<() => void> = [];
  const header = root.querySelector<HTMLElement>(".home2-header");
  const onHeaderScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 28);
  onHeaderScroll();
  window.addEventListener("scroll", onHeaderScroll, { passive: true });
  cleanups.push(() => window.removeEventListener("scroll", onHeaderScroll));

  if (reducedMotion) {
    root.classList.add("home2-reduced-motion");
    root.querySelectorAll<HTMLElement>("[data-home2-load], [data-home2-motion], .home2-service-card, .home2-proof-card, .home2-project-tile, .home2-principle, .home2-editorial-image, .home2-final-grid")
      .forEach((node) => node.classList.add("is-visible"));
    return () => {
      root.classList.remove("home2-reduced-motion");
      cleanups.forEach((cleanup) => cleanup());
    };
  }

  root.classList.add("home2-motion-ready");
  const failOpenTimer = window.setTimeout(() => {
    root.querySelectorAll<HTMLElement>(".home2-motion").forEach((node) => node.classList.add("is-visible"));
  }, 2400);
  cleanups.push(() => window.clearTimeout(failOpenTimer));

  home2MotionMatrix.forEach((rule) => {
    const nodes = Array.from(root.querySelectorAll<HTMLElement>(rule.selector));
    if (!nodes.length) return;

    nodes.forEach((node, index) => {
      node.classList.add("home2-motion", effectClass[rule.effect]);
      node.style.setProperty("--home2-motion-duration", `${rule.duration ?? 760}ms`);
      node.style.setProperty(
        "--home2-motion-delay",
        `${(rule.delay ?? 0) + (rule.stagger ?? 0) * index}ms`,
      );
    });

    if (rule.trigger === "load") {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => nodes.forEach((node) => node.classList.add("is-visible")));
      });
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: rule.threshold ?? 0.14, rootMargin: "0px 0px -4% 0px" },
    );

    nodes.forEach((node) => observer.observe(node));
    cleanups.push(() => observer.disconnect());
  });

  const parallaxNodes = Array.from(root.querySelectorAll<HTMLElement>("[data-home2-parallax]"));
  if (parallaxNodes.length) {
    let frame = 0;
    let geometry = parallaxNodes.map((node) => ({
      node,
      center: node.offsetTop + node.offsetHeight * 0.5,
      amount: Number(node.dataset.home2Parallax ?? 18),
    }));
    const measureParallax = () => {
      geometry = parallaxNodes.map((node) => ({
        node,
        center: node.offsetTop + node.offsetHeight * 0.5,
        amount: Number(node.dataset.home2Parallax ?? 18),
      }));
    };
    const updateParallax = () => {
      frame = 0;
      const viewportCenter = window.scrollY + window.innerHeight * 0.5;
      geometry.forEach(({ node, center, amount }) => {
        const elementCenter = center;
        const progress = (elementCenter - viewportCenter) / Math.max(window.innerHeight, 1);
        const mobile = window.matchMedia("(max-width: 840px)").matches;
        const offset = mobile ? 0 : Math.max(-amount, Math.min(amount, -progress * amount * 1.8));
        node.style.setProperty("--home2-parallax-y", `${offset.toFixed(2)}px`);
      });
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateParallax);
    };
    const onResize = () => {
      measureParallax();
      onScroll();
    };
    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    cleanups.push(() => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (frame) window.cancelAnimationFrame(frame);
    });
  }

  return () => {
    root.classList.remove("home2-motion-ready");
    cleanups.forEach((cleanup) => cleanup());
  };
}