/**
 * 0WEB Motion System — primitives oficiais.
 *
 * Contrato (docs/GLOBAL_WEB_EXPERIENCE_STANDARD.md):
 * - conteúdo SEMPRE existe no DOM e é visível sem JS (SSR-safe);
 * - o estado "escondido" só é aplicado após a montagem no cliente;
 * - `prefers-reduced-motion: reduce` desativa deslocamento/parallax;
 * - anima apenas `transform` e `opacity`;
 * - nenhuma dependência nova: IntersectionObserver + CSS.
 */
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export type MotionIntensity = "SUBTLE" | "BALANCED" | "EXPRESSIVE" | "IMMERSIVE";

type IntensityTuning = { distance: number; duration: number; stagger: number; scale: number };

const TUNING: Record<MotionIntensity, IntensityTuning> = {
  SUBTLE: { distance: 8, duration: 320, stagger: 50, scale: 1 },
  BALANCED: { distance: 16, duration: 420, stagger: 70, scale: 1.01 },
  EXPRESSIVE: { distance: 26, duration: 520, stagger: 90, scale: 1.03 },
  IMMERSIVE: { distance: 38, duration: 620, stagger: 110, scale: 1.05 },
};

const IntensityContext = createContext<MotionIntensity>("BALANCED");

/** Define a intensidade do bloco. Cada projeto escolhe a sua. */
export function MotionScope({
  intensity = "BALANCED",
  children,
}: {
  intensity?: MotionIntensity;
  children: ReactNode;
}) {
  return <IntensityContext.Provider value={intensity}>{children}</IntensityContext.Provider>;
}

export function useMotionIntensity(): MotionIntensity {
  return useContext(IntensityContext);
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** Observa a entrada na viewport uma única vez. */
export function useInViewOnce<T extends HTMLElement>(rootMargin = "0px 0px -12% 0px") {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        }
      },
      { rootMargin, threshold: 0.05 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [rootMargin]);
  return { ref, seen };
}

type RevealVariant = "fade" | "up" | "down" | "left" | "right" | "scale" | "mask";

type RevealProps = {
  as?: ElementType;
  variant?: RevealVariant;
  delay?: number;
  intensity?: MotionIntensity;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

function hiddenTransform(variant: RevealVariant, d: number, scale: number): string {
  switch (variant) {
    case "up":
      return `translate3d(0, ${d}px, 0)`;
    case "down":
      return `translate3d(0, -${d}px, 0)`;
    case "left":
      return `translate3d(${d}px, 0, 0)`;
    case "right":
      return `translate3d(-${d}px, 0, 0)`;
    case "scale":
      return `scale(${2 - scale})`;
    default:
      return "none";
  }
}

/**
 * MotionReveal — entrada de conteúdo ao aproximar da viewport.
 * Sem JS ou com reduced motion, o conteúdo aparece imediatamente.
 */
export function MotionReveal({
  as: Tag = "div",
  variant = "up",
  delay = 0,
  intensity,
  className,
  style,
  children,
}: RevealProps) {
  const scopeIntensity = useMotionIntensity();
  const tune = TUNING[intensity ?? scopeIntensity];
  const reduced = usePrefersReducedMotion();
  const [armed, setArmed] = useState(false);
  const { ref, seen } = useInViewOnce<HTMLDivElement>();

  useEffect(() => {
    setArmed(true);
  }, []);

  const active = !armed || seen || reduced;
  const useMask = variant === "mask" && !reduced;

  return (
    <Tag
      ref={ref}
      className={cn(useMask && "overflow-hidden", className)}
      style={{
        opacity: active ? 1 : 0,
        transform: active || reduced ? "none" : hiddenTransform(variant, tune.distance, tune.scale),
        clipPath: useMask ? (active ? "inset(0 0 0 0)" : "inset(0 0 100% 0)") : undefined,
        transition: reduced
          ? "opacity 160ms linear"
          : `opacity ${tune.duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform ${tune.duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, clip-path ${tune.duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: active ? undefined : "transform, opacity",
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

/** MotionStagger — sequência de filhos com atraso incremental. */
export function MotionStagger({
  as: Tag = "div",
  variant = "up",
  intensity,
  step,
  startDelay = 0,
  className,
  children,
}: {
  as?: ElementType;
  variant?: RevealVariant;
  intensity?: MotionIntensity;
  step?: number;
  startDelay?: number;
  className?: string;
  children: ReactNode[];
}) {
  const scopeIntensity = useMotionIntensity();
  const tune = TUNING[intensity ?? scopeIntensity];
  const gap = step ?? tune.stagger;
  return (
    <Tag className={className}>
      {children.map((child, i) => (
        <MotionReveal key={i} variant={variant} intensity={intensity} delay={startDelay + i * gap}>
          {child}
        </MotionReveal>
      ))}
    </Tag>
  );
}

/** MotionTextReveal — palavras entrando em sequência, texto sempre legível. */
export function MotionTextReveal({
  text,
  as: Tag = "span",
  intensity,
  className,
}: {
  text: string;
  as?: ElementType;
  intensity?: MotionIntensity;
  className?: string;
}) {
  const scopeIntensity = useMotionIntensity();
  const tune = TUNING[intensity ?? scopeIntensity];
  const reduced = usePrefersReducedMotion();
  const words = text.split(" ");
  if (reduced) return <Tag className={className}>{text}</Tag>;
  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <MotionReveal
          key={`${word}-${i}`}
          as="span"
          variant="up"
          intensity={intensity}
          delay={i * Math.round(tune.stagger * 0.5)}
          className="inline-block"
          style={{ marginRight: "0.28em" }}
        >
          {word}
        </MotionReveal>
      ))}
    </Tag>
  );
}

/** MotionImageReveal — revelação por máscara com leve zoom de acomodação. */
export function MotionImageReveal({
  intensity,
  className,
  direction = "up",
  children,
}: {
  intensity?: MotionIntensity;
  className?: string;
  direction?: "up" | "left";
  children: ReactNode;
}) {
  const scopeIntensity = useMotionIntensity();
  const tune = TUNING[intensity ?? scopeIntensity];
  const reduced = usePrefersReducedMotion();
  const [armed, setArmed] = useState(false);
  const { ref, seen } = useInViewOnce<HTMLDivElement>();
  useEffect(() => setArmed(true), []);
  const active = !armed || seen || reduced;
  const hidden = direction === "left" ? "inset(0 100% 0 0)" : "inset(0 0 100% 0)";
  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <div
        style={{
          clipPath: reduced ? undefined : active ? "inset(0 0 0 0)" : hidden,
          transform: active || reduced ? "scale(1)" : `scale(${tune.scale})`,
          transition: reduced
            ? "none"
            : `clip-path ${tune.duration + 120}ms cubic-bezier(0.22,1,0.36,1), transform ${tune.duration + 240}ms cubic-bezier(0.22,1,0.36,1)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** MotionCounter — números que contam ao entrar na viewport. */
export function MotionCounter({
  value,
  suffix = "",
  prefix = "",
  durationMs = 900,
  className,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  durationMs?: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const { ref, seen } = useInViewOnce<HTMLSpanElement>();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!seen || reduced) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs);
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, reduced, value, durationMs]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Adendo de motion (docs/PORTFOLIO_LANDING_MOTION_ADDENDUM.md)        */
/* Primitives genéricas, opt-in. Nada aqui é específico de um cliente. */
/* ------------------------------------------------------------------ */

/** true quando a viewport é de desktop — motion pesado não desce para mobile (§12). */
export function useDesktopViewport(minWidth = 768): boolean {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
    setIsDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [minWidth]);
  return isDesktop;
}

/**
 * useScrollProgress — progresso (0..1) da travessia do elemento pela viewport.
 * Retorna 1 sem JS, com reduced motion ou antes da montagem: nenhum conteúdo
 * pode depender da conclusão do scroll.
 */
export function useScrollProgress<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T | null>(null);
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    if (!enabled || reduced) {
      setProgress(1);
      return;
    }
    const node = ref.current;
    if (!node) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = rect.height + vh * 0.6;
      const travelled = vh * 0.85 - rect.top;
      setProgress(Math.min(1, Math.max(0, travelled / Math.max(1, total))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [enabled, reduced]);

  return { ref, progress };
}

/**
 * MotionParallax — deslocamento sutil ligado ao scroll (só `transform`).
 * Desligado com `prefers-reduced-motion` e em viewport móvel (§12/§13).
 */
export function MotionParallax({
  speed = 24,
  className,
  desktopOnly = true,
  children,
}: {
  /** Amplitude máxima do deslocamento vertical, em px. */
  speed?: number;
  className?: string;
  desktopOnly?: boolean;
  children: ReactNode;
}) {
  const reduced = usePrefersReducedMotion();
  const isDesktop = useDesktopViewport();
  const enabled = !reduced && (!desktopOnly || isDesktop);
  const { ref, progress } = useScrollProgress<HTMLDivElement>(enabled);
  const offset = enabled ? (0.5 - progress) * 2 * speed : 0;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: enabled ? `translate3d(0, ${offset.toFixed(2)}px, 0)` : undefined,
        willChange: enabled ? "transform" : undefined,
      }}
    >
      {children}
    </div>
  );
}
