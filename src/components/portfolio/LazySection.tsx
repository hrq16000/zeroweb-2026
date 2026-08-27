import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Placeholder enquanto a seção ainda não entrou (ou está carregando). */
  fallback?: ReactNode;
  /** Antecipação do carregamento em relação à viewport. */
  rootMargin?: string;
  /** Altura mínima reservada para evitar layout shift. */
  minHeight?: number;
  className?: string;
};

/**
 * Monta o conteúdo apenas quando a seção se aproxima da viewport.
 *
 * Combine com `React.lazy(() => import("./SecaoPesada"))` para que o chunk
 * do componente só seja baixado quando o usuário realmente chegar nele.
 * Sem JS/IntersectionObserver (SSR e crawlers) o conteúdo é renderizado
 * normalmente, preservando SEO.
 */
export function LazySection({
  children,
  fallback = null,
  rootMargin = "320px",
  minHeight = 160,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, visible]);

  return (
    <div ref={ref} className={className} style={visible ? undefined : { minHeight }}>
      {visible ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}
    </div>
  );
}
