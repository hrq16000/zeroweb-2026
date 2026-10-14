import { useRef, useState } from "react";
import { ServiceCoverImage } from "@/components/site/ServiceCoverImage";
import { serviceCoverFallback } from "@/lib/service-cover-fallback";

export type ProductImage = { url: string; alt?: string };

type Props = {
  images: ProductImage[];
  productName: string;
  slug: string;
  category?: string | null;
};

/**
 * Galeria de produto com fallback real em miniaturas, imagem principal e
 * destino de ampliação. Imagens inválidas nunca abrem links quebrados.
 */
export function ProductGallery({ images, productName, slug, category }: Props) {
  const institutionalCover = serviceCoverFallback(slug, category);
  const catalogImages = images.filter((image) => Boolean(image?.url?.trim()));
  // Um produto sem imagem cadastrada também recebe uma capa institucional.
  const valid = catalogImages.length ? catalogImages : [{ url: institutionalCover, alt: productName }];
  const [active, setActive] = useState(0);
  const [failedUrls, setFailedUrls] = useState<string[]>([]);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const frameRef = useRef<HTMLDivElement | null>(null);
  const current = valid[Math.min(active, valid.length - 1)];
  const fullImageUrl = [current.url, institutionalCover].find(
    (url) => Boolean(url) && !failedUrls.includes(url),
  );

  function handleImageFailure(url: string) {
    setFailedUrls((previous) => previous.includes(url) ? previous : [...previous, url]);
  }

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  }

  const mainImage = (
    <div
      ref={frameRef}
      onMouseEnter={() => setZoom(true)}
      onMouseLeave={() => setZoom(false)}
      onMouseMove={handleMove}
      className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-muted"
    >
      <ServiceCoverImage
        src={current.url}
        slug={slug}
        name={productName}
        category={category}
        alt={current.alt || productName}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        onImageError={handleImageFailure}
        className="w-full h-full object-contain transition-transform duration-200 ease-out"
        style={{
          transform: zoom ? "scale(2)" : "scale(1)",
          transformOrigin: origin,
        }}
      />
    </div>
  );

  return (
    <div className="grid grid-cols-[72px_1fr] gap-3 sm:gap-4">
      <div className="flex flex-col gap-2 max-h-[520px] overflow-y-auto pr-1">
        {valid.map((img, i) => {
          const selected = i === active;
          return (
            <button
              key={`${img.url}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              aria-label={`Ver imagem ${i + 1} de ${valid.length}`}
              aria-pressed={selected}
              className={`w-[72px] h-[72px] rounded-lg overflow-hidden border-2 bg-muted flex-shrink-0 transition ${
                selected ? "border-primary" : "border-border hover:border-primary/50"
              }`}
            >
              <ServiceCoverImage
                src={img.url}
                slug={slug}
                name={productName}
                category={category}
                alt={img.alt || `${productName} — miniatura ${i + 1}`}
                loading="lazy"
                onImageError={handleImageFailure}
                className="w-full h-full object-cover"
              />
            </button>
          );
        })}
      </div>
      {fullImageUrl ? (
        <a
          href={fullImageUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Abrir imagem em tamanho real: ${current.alt || productName}`}
          className="block cursor-zoom-in"
        >
          {mainImage}
        </a>
      ) : mainImage}
    </div>
  );
}
