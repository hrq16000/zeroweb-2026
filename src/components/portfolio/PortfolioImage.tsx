import { useState, type ImgHTMLAttributes } from "react";
import { portfolioImageCandidates } from "@/lib/portfolio-image-recovery";
import { usePortfolioRuntime } from "@/components/portfolio/PortfolioRuntimeContext";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
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
  /**
   * Campo administrável correspondente. Quando o admin salva um override
   * válido para o projeto, ele substitui `src`; caso contrário o valor
   * original do componente continua valendo (nunca renderiza vazio).
   */
  managedField?: "logoUrl" | "heroImageUrl" | "socialImage";
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
  managedField,
  loading,
  onError,
  className,
  style,
  width,
  height,
  srcSet: suppliedSrcSet,
  ...rest
}: Props) {
  const runtime = usePortfolioRuntime();
  const override = managedField ? runtime?.[managedField] : undefined;
  const managedSrc = typeof override === "string" && override.trim() ? override.trim() : src;
  const isManaged = managedSrc !== src;
  const responsiveSrcSet = isManaged ? undefined : suppliedSrcSet ?? (
    widths && widths.length > 0 ? widths.map((w) => `${variantSrc(managedSrc, w)} ${w}w`).join(", ") : undefined
  );
  const candidates = portfolioImageCandidates({ authoredSrc: src, managedSrc, responsiveSrcSet });
  const signature = [src, managedSrc, responsiveSrcSet ?? ""].join("|");
  const [failure, setFailure] = useState({ signature: "", index: 0 });
  // Quando o CMS troca uma imagem, a nova URL sempre recomeça a sequência.
  const activeIndex = failure.signature === signature ? failure.index : 0;
  const candidate = candidates[activeIndex];

  if (!candidate) {
    // Último recurso: superfície acessível e estável, sem ícone de imagem quebrada.
    return (
      <div
        role="img"
        aria-label={`Imagem temporariamente indisponível: ${alt}`}
        data-portfolio-image-fallback="true"
        className={`bg-gradient-to-br from-primary/10 via-muted to-muted/70 ${className ?? ""}`}
        style={{ width, height, ...style }}
      />
    );
  }

  return (
    <img
      {...rest}
      width={width}
      height={height}
      src={candidate.src}
      alt={alt}
      srcSet={candidate.srcSet}
      sizes={candidate.srcSet ? sizes : undefined}
      loading={priority ? "eager" : loading ?? "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={className}
      style={style}
      onError={(event) => {
        onError?.(event);
        setFailure((previous) => ({
          signature,
          index: (previous.signature === signature ? previous.index : 0) + 1,
        }));
      }}
    />
  );
}
