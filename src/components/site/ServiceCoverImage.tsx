import { useEffect, useState, type ComponentProps } from "react";
import { ServiceImageFallback } from "@/components/site/ServiceImageFallback";
import { serviceCoverFallback } from "@/lib/service-cover-fallback";

type Props = Omit<ComponentProps<"img">, "src" | "alt" | "onError"> & {
  src?: string | null;
  alt?: string;
  slug: string;
  name: string;
  category?: string | null;
  /** Notifica o pai para atualizar links de ampliação quando uma URL falha. */
  onImageError?: (failedUrl: string) => void;
};

/**
 * Imagens da loja podem vir de URLs assinadas ou de assets gerenciados.
 * Quando uma URL existe mas não carrega no navegador, troca pela capa
 * local empacotada no build; se ambas falharem, renderiza um fallback visual
 * determinístico (nunca o ícone/alt de imagem quebrada).
 */
export function ServiceCoverImage({ src, alt, slug, name, category, className, onImageError, ...imgProps }: Props) {
  const [failedUrls, setFailedUrls] = useState<string[]>([]);

  useEffect(() => {
    setFailedUrls([]);
  }, [src, slug, category]);

  const localCover = serviceCoverFallback(slug, category);
  const candidates = [src, localCover].filter(
    (url, index, urls): url is string => Boolean(url) && urls.indexOf(url) === index,
  );
  const current = candidates.find((url) => !failedUrls.includes(url));

  if (!current) {
    return <ServiceImageFallback slug={slug} name={name} category={category ?? undefined} className={className} />;
  }

  return (
    <img
      {...imgProps}
      src={current}
      alt={alt || `Ilustração do serviço ${name}`}
      className={className}
      onError={() => {
        setFailedUrls((previous) => previous.includes(current) ? previous : [...previous, current]);
        onImageError?.(current);
      }}
    />
  );
}
