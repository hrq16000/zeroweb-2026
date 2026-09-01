import portfolioAssets from "@/config/portfolio-assets.json";
import portfolioCatalog from "@/config/portfolio-catalog.json";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";

type CatalogItem = {
  slug: string;
  title: string;
  city: string;
  state: string;
  segment: string;
  tags: string[];
  summary?: string;
};

type AssetItem = {
  icon: string;
  socialImage: string;
};

const catalog = portfolioCatalog as CatalogItem[];
const assetsBySlug = portfolioAssets.clients as Record<string, AssetItem>;

const palettes: Record<string, { surface: string; ink: string; accent: string; soft: string }> = {
  beleza: { surface: "#fef1f7", ink: "#4d1938", accent: "#c82f75", soft: "#f7c4db" },
  saude: { surface: "#effbfa", ink: "#123e4a", accent: "#178c91", soft: "#bfe8e5" },
  juridico: { surface: "#f8f4eb", ink: "#302614", accent: "#98702c", soft: "#e9d8aa" },
  restaurantes: { surface: "#fff4ec", ink: "#542516", accent: "#c5502e", soft: "#f6c9b8" },
  construcao: { surface: "#f5f2ec", ink: "#302d26", accent: "#8b642c", soft: "#e1d2b2" },
  agencias: { surface: "#edf5ff", ink: "#142b4c", accent: "#2769c7", soft: "#bdd8ff" },
  comercios: { surface: "#fff5ec", ink: "#4a2816", accent: "#c75a25", soft: "#f4cfb8" },
  servicos: { surface: "#f2f7fb", ink: "#18354f", accent: "#226b98", soft: "#c7dceb" },
  "prestadores-de-servicos": {
    surface: "#f2f7fb",
    ink: "#18354f",
    accent: "#226b98",
    soft: "#c7dceb",
  },
};

function readableTag(tag: string) {
  return tag.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/**
 * Contrato visual do Kit de Presença. O cartão e o panfleto são montados com
 * a logo e a imagem social do próprio slug; não existe imagem-base compartilhada.
 */
export function getPortfolioPresenceKit(slug: string) {
  const item = catalog.find((entry) => entry.slug === slug);
  const assets = assetsBySlug[slug];
  if (!item || !assets?.icon || !assets.socialImage) return undefined;

  const services = item.tags.slice(0, 4).map(readableTag);
  return {
    brandBrief: {
      name: item.title,
      segment: item.segment,
      city: `${item.city} — ${item.state}`,
      services,
    },
    assets: {
      icon: assets.icon,
      socialImage: assets.socialImage,
    },
    printMockup: {
      kind: "business-card-and-digital-flyer",
      status: "published" as const,
      source: assets.socialImage,
      alt: `Panfleto digital de ${item.title}`,
    },
  };
}

export function PortfolioPresenceKit({ slug }: { slug: string }) {
  const kit = getPortfolioPresenceKit(slug);
  if (!kit) return null;

  const palette = palettes[kit.brandBrief.segment] ?? palettes.servicos;
  const serviceLine = kit.brandBrief.services.join(" · ");
  const canonicalUrl = `0web.com.br/portfolio/${slug}`;

  return (
    <section
      aria-labelledby={`presence-kit-${slug}`}
      className="border-t border-black/5 px-5 py-16 lg:px-8"
      style={{ backgroundColor: palette.surface, color: palette.ink }}
    >
      <div className="mx-auto max-w-6xl">
        <p
          className="text-xs font-bold uppercase tracking-[.22em]"
          style={{ color: palette.accent }}
        >
          Kit de presença e papelaria
        </p>
        <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h2
              id={`presence-kit-${slug}`}
              className="font-display text-3xl font-black sm:text-4xl"
            >
              Uma marca completa também se reconhece no papel.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 opacity-80">
              Veja as peças de presença preparadas, construídas com a logo e a imagem social de{" "}
              {kit.brandBrief.name}. O cartão e o panfleto mantêm o mesmo segmento, linguagem e
              região do projeto.
            </p>
          </div>
          <span
            className="rounded-full border px-4 py-2 text-xs font-bold"
            style={{ borderColor: palette.accent, color: palette.accent }}
          >
            Cartão + panfleto
          </span>
        </div>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p
              className="mb-3 text-xs font-bold uppercase tracking-[.18em]"
              style={{ color: palette.accent }}
            >
              Cartão de visitas
            </p>
            <figure
              className="relative mx-auto aspect-[1.72] w-full max-w-[560px] overflow-hidden rounded-[1.5rem] p-6 text-white shadow-2xl sm:p-8"
              style={{
                background: `linear-gradient(135deg, ${palette.ink} 0%, ${palette.accent} 100%)`,
              }}
            >
              <div className="pointer-events-none absolute -right-14 -top-20 h-56 w-56 rounded-full border-[26px] border-white/10" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start gap-4">
                  <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white p-2 shadow-lg sm:h-20 sm:w-20">
                    <PortfolioImage
                      src={kit.assets.icon}
                      alt={`Logo de ${kit.brandBrief.name}`}
                      width={160}
                      height={160}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 pt-1">
                    <h3 className="font-display text-2xl font-black leading-tight sm:text-3xl">
                      {kit.brandBrief.name}
                    </h3>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[.12em] text-white/75">
                      {readableTag(kit.brandBrief.segment)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="max-w-[34rem] text-sm font-semibold leading-6 text-white/90">
                    {serviceLine || "Atendimento especializado"}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/20 pt-4 text-xs font-semibold text-white/75">
                    <span>{kit.brandBrief.city}</span>
                    <span className="truncate">{canonicalUrl}</span>
                  </div>
                </div>
              </div>
              <figcaption className="sr-only">
                Ilustração do cartão de visitas de {kit.brandBrief.name}
              </figcaption>
            </figure>
          </div>

          <div>
            <p
              className="mb-3 text-xs font-bold uppercase tracking-[.18em]"
              style={{ color: palette.accent }}
            >
              Panfleto digital
            </p>
            <figure className="relative mx-auto aspect-[1.91/1] w-full max-w-[760px] overflow-hidden rounded-[1.5rem] bg-black shadow-2xl ring-1 ring-black/10">
              <PortfolioImage
                src={kit.assets.socialImage}
                alt={`Imagem social de ${kit.brandBrief.name}`}
                width={1200}
                height={630}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/10" />
              <div className="relative flex h-full flex-col justify-between p-5 text-white sm:p-7">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-xl bg-white p-1.5 shadow-lg">
                    <PortfolioImage
                      src={kit.assets.icon}
                      alt=""
                      aria-hidden="true"
                      width={120}
                      height={120}
                      className="h-full w-full object-contain"
                    />
                  </span>
                  <p className="text-xs font-black uppercase tracking-[.2em] text-white/90">
                    {kit.brandBrief.name}
                  </p>
                </div>
                <div className="max-w-[34rem]">
                  <h3 className="font-display text-2xl font-black leading-tight sm:text-4xl">
                    Conheça {kit.brandBrief.name}.
                  </h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-white/90">
                    {serviceLine || "Soluções pensadas para você."}
                  </p>
                  <div
                    className="mt-4 inline-flex rounded-full px-4 py-2 text-xs font-black"
                    style={{ backgroundColor: palette.accent, color: "#fff" }}
                  >
                    Ver a presença digital
                  </div>
                </div>
              </div>
              <figcaption className="sr-only">
                Ilustração do panfleto digital de {kit.brandBrief.name}
              </figcaption>
            </figure>
          </div>
        </div>

      </div>
    </section>
  );
}
