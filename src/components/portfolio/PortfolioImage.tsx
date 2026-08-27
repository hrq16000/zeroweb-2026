import type { ImgHTMLAttributes } from "react";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "loading"> & {
  src: string;
  alt: string;
  /** Marca a imagem como candidata a LCP: sem lazy e com fetchpriority alto. */
  priority?: boolean;
  /**
   * Larguras disponíveis do mesmo arquivo (ex.: [480, 960, 1440]).
   * Só use quando as variantes `nome-480.webp` existirem de verdade —
   * caso contrário deixe vazio e o navegador usa o arquivo único.
   */
  widths?: number[];
  sizes?: string;
};

function variantSrc(src: string, width: number): string {
  return src.replace(/(\.[a-z0-9]+)(\?.*)?$/i, `-${width}$1$2`);
}

/**
 * Imagem padrão dos projetos `/portfolio/:slug`.
 *
 * Aplica automaticamente lazy loading, decoding assíncrono, prioridade
 * correta para o LCP e `srcset`/`sizes` responsivos quando há variantes.
 * Use sempre este componente em vez de `<img>` cru nesses projetos.
 */
export function PortfolioImage({
  src,
  alt,
  priority = false,
  widths,
  sizes = "(min-width: 1024px) 960px, 100vw",
  ...rest
}: Props) {
  const srcSet =
    widths && widths.length > 0
      ? widths.map((w) => `${variantSrc(src, w)} ${w}w`).join(", ")
      : undefined;

  return (
    <img
      src={src}
      alt={alt}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      {...rest}
    />
  );
}
