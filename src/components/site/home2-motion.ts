export type Home2MotionEffect =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "slide-up"
  | "slide-left"
  | "slide-right"
  | "blur-in"
  | "scale-in"
  | "image-reveal"
  | "clip-reveal"
  | "card-reveal"
  | "pop"
  | "count"
  | "stagger-up";

export type Home2ReduceMotionFallback = "instant" | "fade";

export type Home2MotionRule = {
  id: string;
  selector: string;
  effect: Home2MotionEffect;
  trigger: "load" | "scroll";
  duration?: number;
  delay?: number;
  easing?: string;
  stagger?: number;
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
  reduceMotionFallback?: Home2ReduceMotionFallback;
  params?: {
    start?: number;
    end?: number;
    prefix?: string;
    suffix?: string;
  };
};

/**
 * Home2 motion is deliberately data-driven. The matrix exposes timing, trigger,
 * easing, stagger, viewport margin, repeat policy and reduced-motion behavior so
 * the page can evolve without scattering animation values through components.
 */
export const home2MotionMatrix: Home2MotionRule[] = [
  {
    id: "header",
    selector: ".home2-header",
    effect: "fade-down",
    trigger: "load",
    duration: 440,
    easing: "cubic-bezier(.2,.9,.2,1)",
    once: true,
    reduceMotionFallback: "instant",
  },
  {
    id: "hero-kicker",
    selector: ".home2-hero .home2-kicker",
    effect: "fade-up",
    trigger: "load",
    duration: 520,
    delay: 70,
    easing: "cubic-bezier(.2,.9,.2,1)",
    once: true,
  },
  {
    id: "hero-lines",
    selector: ".home2-hero-line",
    effect: "slide-up",
    trigger: "load",
    duration: 760,
    delay: 130,
    stagger: 90,
    easing: "cubic-bezier(.16,1,.3,1)",
    once: true,
  },
  {
    id: "hero-subtitle",
    selector: ".home2-hero-subtitle",
    effect: "fade-up",
    trigger: "load",
    duration: 620,
    delay: 390,
    once: true,
  },
  {
    id: "hero-proof",
    selector: ".home2-proofline",
    effect: "fade-up",
    trigger: "load",
    duration: 600,
    delay: 470,
    once: true,
  },
  {
    id: "hero-actions",
    selector: ".home2-hero-actions > *",
    effect: "pop",
    trigger: "load",
    duration: 460,
    delay: 560,
    stagger: 90,
    easing: "cubic-bezier(.2,.9,.2,1.08)",
    once: true,
  },
  {
    id: "strategy-media",
    selector: ".home2-strategy [data-home2-motion='media']",
    effect: "scale-in",
    trigger: "scroll",
    duration: 900,
    easing: "cubic-bezier(.2,.9,.2,1)",
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.16,
    once: true,
  },
  {
    id: "strategy-copy",
    selector: ".home2-strategy [data-home2-motion='copy']",
    effect: "slide-left",
    trigger: "scroll",
    duration: 780,
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.18,
    once: true,
  },
  {
    id: "section-headings",
    selector: "[data-home2-motion='heading']",
    effect: "fade-up",
    trigger: "scroll",
    duration: 760,
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.14,
    once: true,
  },
  {
    id: "services",
    selector: ".home2-service-card",
    effect: "card-reveal",
    trigger: "scroll",
    duration: 700,
    stagger: 85,
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.1,
    once: true,
  },
  {
    id: "service-icons",
    selector: ".home2-service-icon",
    effect: "scale-in",
    trigger: "scroll",
    duration: 460,
    stagger: 70,
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.1,
    once: true,
  },
  {
    id: "process-intro",
    selector: ".home2-process-intro",
    effect: "fade-right",
    trigger: "scroll",
    duration: 780,
    rootMargin: "0px 0px -12% 0px",
    threshold: 0.16,
    once: true,
  },
  {
    id: "process-steps-odd",
    selector: ".home2-process-step:nth-child(odd)",
    effect: "slide-right",
    trigger: "scroll",
    duration: 680,
    stagger: 90,
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.1,
    once: true,
  },
  {
    id: "process-steps-even",
    selector: ".home2-process-step:nth-child(even)",
    effect: "slide-left",
    trigger: "scroll",
    duration: 680,
    stagger: 90,
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.1,
    once: true,
  },
  {
    id: "experience-copy",
    selector: "[data-home2-motion='experience-copy']",
    effect: "fade-right",
    trigger: "scroll",
    duration: 820,
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.16,
    once: true,
  },
  {
    id: "experience-proof",
    selector: ".home2-proof-card",
    effect: "card-reveal",
    trigger: "scroll",
    duration: 660,
    stagger: 90,
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.1,
    once: true,
  },
  {
    id: "verified-project-count",
    selector: "[data-home2-count]",
    effect: "count",
    trigger: "scroll",
    duration: 1150,
    delay: 100,
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.14,
    once: true,
    params: { start: 0 },
    reduceMotionFallback: "instant",
  },
  {
    id: "projects",
    selector: ".home2-project-tile",
    effect: "scale-in",
    trigger: "scroll",
    duration: 720,
    stagger: 100,
    rootMargin: "0px 0px -6% 0px",
    threshold: 0.08,
    once: true,
  },
  {
    id: "principles",
    selector: ".home2-principle",
    effect: "fade-up",
    trigger: "scroll",
    duration: 680,
    stagger: 90,
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.1,
    once: true,
  },
  {
    id: "editorial",
    selector: "[data-home2-editorial-reveal]",
    effect: "image-reveal",
    trigger: "scroll",
    duration: 840,
    stagger: 110,
    rootMargin: "0px 0px -6% 0px",
    threshold: 0.08,
    once: true,
  },
  {
    id: "cta-strip",
    selector: "[data-home2-cta-strip]",
    effect: "pop",
    trigger: "scroll",
    duration: 760,
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.16,
    once: true,
  },
  {
    id: "final-cta",
    selector: ".home2-final-grid",
    effect: "scale-in",
    trigger: "scroll",
    duration: 860,
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.16,
    once: true,
  },
];

const effectClass: Record<Exclude<Home2MotionEffect, "count">, string> = {
  "fade-up": "home2-motion-fade-up",
  "fade-down": "home2-motion-fade-down",
  "fade-left": "home2-motion-fade-left",
  "fade-right": "home2-motion-fade-right",
  "slide-up": "home2-motion-slide-up",
  "slide-left": "home2-motion-slide-left",
  "slide-right": "home2-motion-slide-right",
  "blur-in": "home2-motion-blur-in",
  "scale-in": "home2-motion-scale-in",
  "image-reveal": "home2-motion-image-reveal",
  "clip-reveal": "home2-motion-clip-reveal",
  "card-reveal": "home2-motion-card-reveal",
  pop: "home2-motion-pop",
  "stagger-up": "home2-motion-slide-up",
};

function setCountFinal(node: HTMLElement, rule: Home2MotionRule) {
  const rawEnd = node.dataset.home2CountEnd ?? String(rule.params?.end ?? node.textContent ?? "0");
  const end = Number(rawEnd);
  if (!Number.isFinite(end)) return;
  const prefix = rule.params?.prefix ?? "";
  const suffix = rule.params?.suffix ?? "";
  node.textContent = `${prefix}${Math.round(end).toLocaleString("pt-BR")}${suffix}`;
}

function animateCount(node: HTMLElement, rule: Home2MotionRule, cleanups: Array<() => void>) {
  const rawEnd = node.dataset.home2CountEnd ?? String(rule.params?.end ?? node.textContent ?? "0");
  const end = Number(rawEnd);
  const start = Number(node.dataset.home2CountStart ?? rule.params?.start ?? 0);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return;

  const prefix = rule.params?.prefix ?? "";
  const suffix = rule.params?.suffix ?? "";
  const duration = Math.max(1, rule.duration ?? 1000);
  let frame = 0;
  let startedAt = 0;

  const tick = (now: number) => {
    if (!startedAt) startedAt = now;
    const linear = Math.min(1, (now - startedAt) / duration);
    const eased = 1 - Math.pow(1 - linear, 3);
    const value = Math.round(start + (end - start) * eased);
    node.textContent = `${prefix}${value.toLocaleString("pt-BR")}${suffix}`;
    if (linear < 1) frame = window.requestAnimationFrame(tick);
  };

  frame = window.requestAnimationFrame(tick);
  cleanups.push(() => {
    if (frame) window.cancelAnimationFrame(frame);
  });
}

export function initHome2Motion(root: HTMLElement) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cleanups: Array<() => void> = [];
  const timeouts: number[] = [];
  const header = root.querySelector<HTMLElement>(".home2-header");
  const onHeaderScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 60);
  onHeaderScroll();
  window.addEventListener("scroll", onHeaderScroll, { passive: true });
  cleanups.push(() => window.removeEventListener("scroll", onHeaderScroll));

  const revealNode = (node: HTMLElement, rule: Home2MotionRule) => {
    const index = Number(node.dataset.home2MotionIndex ?? 0);
    const delay = (rule.delay ?? 0) + (rule.stagger ?? 0) * index;

    if (rule.effect === "count") {
      if (reducedMotion) {
        setCountFinal(node, rule);
        return;
      }
      const timeout = window.setTimeout(() => animateCount(node, rule, cleanups), delay);
      timeouts.push(timeout);
      return;
    }

    if (node.classList.contains("home2-project-tile")) node.classList.add("is-revealed");
    node.classList.add("is-visible");
  };

  home2MotionMatrix.forEach((rule) => {
    const nodes = Array.from(root.querySelectorAll<HTMLElement>(rule.selector));
    if (!nodes.length) return;

    nodes.forEach((node, index) => {
      node.dataset.home2MotionIndex = String(index);
      if (rule.effect !== "count") {
        node.classList.add("home2-motion", effectClass[rule.effect]);
      }
      node.style.setProperty("--home2-motion-duration", `${rule.duration ?? 760}ms`);
      node.style.setProperty(
        "--home2-motion-delay",
        `${(rule.delay ?? 0) + (rule.stagger ?? 0) * index}ms`,
      );
      node.style.setProperty("--home2-motion-easing", rule.easing ?? "cubic-bezier(.2,.9,.2,1)");
    });
  });

  if (reducedMotion) {
    root.classList.add("home2-reduced-motion");
    home2MotionMatrix.forEach((rule) => {
      root.querySelectorAll<HTMLElement>(rule.selector).forEach((node) => {
        if (rule.effect === "count") setCountFinal(node, rule);
        else revealNode(node, rule);
      });
    });
    return () => {
      root.classList.remove("home2-reduced-motion");
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
      cleanups.forEach((cleanup) => cleanup());
    };
  }

  root.classList.add("home2-motion-ready");
  const failOpenTimer = window.setTimeout(() => {
    root.querySelectorAll<HTMLElement>(".home2-motion").forEach((node) => {
      node.classList.add("is-visible");
      if (node.classList.contains("home2-project-tile")) node.classList.add("is-revealed");
    });
  }, 1800);
  timeouts.push(failOpenTimer);

  const alreadyPastFold = (node: HTMLElement) =>
    node.getBoundingClientRect().top < window.innerHeight * 0.96;

  home2MotionMatrix.forEach((rule) => {
    const nodes = Array.from(root.querySelectorAll<HTMLElement>(rule.selector));
    if (!nodes.length) return;

    if (rule.trigger === "load") {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => nodes.forEach((node) => revealNode(node, rule)));
      });
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      nodes.forEach((node) => revealNode(node, rule));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const node = entry.target as HTMLElement;
          revealNode(node, rule);
          if (rule.once !== false) observer.unobserve(node);
        });
      },
      {
        threshold: rule.threshold ?? 0.14,
        rootMargin: rule.rootMargin ?? "0px 0px -4% 0px",
      },
    );

    nodes.forEach((node) => {
      if (alreadyPastFold(node)) revealNode(node, rule);
      else observer.observe(node);
    });

    cleanups.push(() => observer.disconnect());
  });

  let sweepFrame = 0;
  const sweep = () => {
    sweepFrame = 0;
    root.querySelectorAll<HTMLElement>(".home2-motion:not(.is-visible)").forEach((node) => {
      if (alreadyPastFold(node)) {
        node.classList.add("is-visible");
        if (node.classList.contains("home2-project-tile")) node.classList.add("is-revealed");
      }
    });
  };
  const onSweepScroll = () => {
    if (sweepFrame) return;
    sweepFrame = window.requestAnimationFrame(sweep);
  };
  window.addEventListener("scroll", onSweepScroll, { passive: true });
  cleanups.push(() => {
    window.removeEventListener("scroll", onSweepScroll);
    if (sweepFrame) window.cancelAnimationFrame(sweepFrame);
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
        const progress = (center - viewportCenter) / Math.max(window.innerHeight, 1);
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
    timeouts.forEach((timeout) => window.clearTimeout(timeout));
    cleanups.forEach((cleanup) => cleanup());
  };
}
