/**
 * Capa de projeto do portfólio com fallback garantido.
 *
 * Ordem de resolução: imagem do catálogo → imagem social do cliente → ícone do
 * cliente → capa gerada (gradiente determinístico + iniciais). Assim nenhum
 * card do portfólio aparece vazio, mesmo antes do upload da foto oficial.
 */
import { useState } from "react";
import { resolvePortfolioCoverCandidates } from "@/lib/portfolio-assets";

type Props = {
  clientKey?: string;
  slug: string;
  title: string;
  image?: string;
  fallbackImage?: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
};

const GRADIENTS: Array<[string, string]> = [
  ["from-primary/30", "to-primary/5"],
  ["from-emerald-500/30", "to-emerald-500/5"],
  ["from-violet-500/30", "to-violet-500/5"],
  ["from-amber-500/30", "to-amber-500/5"],
  ["from-rose-500/30", "to-rose-500/5"],
  ["from-sky-500/30", "to-sky-500/5"],
  ["from-fuchsia-500/30", "to-fuchsia-500/5"],
  ["from-teal-500/30", "to-teal-500/5"],
];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function initialsOf(title: string): string {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "0W";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function PortfolioCover({
  clientKey,
  slug,
  title,
  image,
  fallbackImage,
  className,
  width = 640,
  height = 360,
  sizes,
  priority = false,
}: Props) {
  const candidates = resolvePortfolioCoverCandidates({
    clientKey: clientKey ?? slug,
    image,
    fallbackImage,
  });
  const [index, setIndex] = useState(0);
  const src = candidates[index];

  if (!src) {
    const [from, to] = GRADIENTS[hashStr(slug || title) % GRADIENTS.length];
    return (
      <div
        aria-hidden="true"
        className={`relative overflow-hidden bg-gradient-to-br ${from} ${to} ${className ?? ""}`}
      >
        <div className="absolute inset-0 grid place-items-center">
          <span className="font-display font-black text-3xl tracking-tight text-foreground/70">
            {initialsOf(title)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`Prévia do site ${title}`}
      width={width}
      height={height}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setIndex((i) => i + 1)}
      className={className}
    />
  );
}
