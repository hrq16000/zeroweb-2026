/**
 * <Picture> — emits AVIF + WebP + original JPG/PNG fallback.
 *
 * Pairs with scripts/optimize-blog-images.mjs which generates the
 * sibling .webp/.avif files at build time. The JPG/PNG fallback is
 * kept because Google Discover prefers traditional formats for the
 * og:image surface.
 *
 * Usage:
 *   import hero from "@/assets/blog-hero.jpg";
 *   <Picture src={hero} alt="..." width={1280} height={720} priority />
 */
import { type ImgHTMLAttributes } from "react";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "loading" | "src"> & {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Mark as LCP candidate. Disables lazy loading + adds fetchpriority="high". */
  priority?: boolean;
  /** Override the default sizes attribute. */
  sizes?: string;
  className?: string;
};

function variant(src: string, ext: "webp" | "avif"): string {
  return src.replace(/\.(jpe?g|png)(\?.*)?$/i, `.${ext}$2`);
}

/**
 * Só emitimos <source> quando o build realmente gera as variantes:
 * scripts/optimize-blog-images.mjs cobre apenas `blog-*` e `og-*`
 * servidos do próprio domínio. Qualquer outro caminho (CDN externo,
 * asset arbitrário) cai no <img> puro para não gerar 404.
 */
function hasModernVariants(src: string): boolean {
  if (/^https?:\/\//i.test(src)) return false;
  return /(^|\/)(blog|og)-[^/]*\.(jpe?g|png)(\?.*)?$/i.test(src);
}

export function Picture({
  src,
  alt,
  width,
  height,
  priority = false,
  sizes = "(min-width: 1024px) 960px, 100vw",
  className,
  ...rest
}: Props) {
  const modern = hasModernVariants(src);
  const avif = variant(src, "avif");
  const webp = variant(src, "webp");
  return (
    <picture>
      {modern && <source type="image/avif" srcSet={avif} sizes={sizes} />}
      {modern && <source type="image/webp" srcSet={webp} sizes={sizes} />}

      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={className}
        {...rest}
      />
    </picture>
  );
}
