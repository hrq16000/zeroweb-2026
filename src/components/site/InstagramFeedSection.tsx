import { useState } from "react";
import { ExternalLink, Instagram } from "lucide-react";

const INSTAGRAM_USERNAME = "renatabeautystudiio";
const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_USERNAME}/`;
const INSTAGRAM_EMBED_URL = `${INSTAGRAM_URL}embed/`;

type InstagramFeedSectionProps = {
  variant?: "renata" | "editorial";
};

export function InstagramFeedSection({
  variant = "renata",
}: InstagramFeedSectionProps) {
  const editorial = variant === "editorial";
  const [feedLoaded, setFeedLoaded] = useState(false);

  return (
    <section
      aria-labelledby={`instagram-feed-title-${variant}`}
      className={`px-4 py-16 sm:py-20 border-t ${
        editorial
          ? "bg-[#0D0B0B] border-white/10"
          : "bg-[#130810]/80 border-white/10"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mx-auto mb-8 max-w-2xl text-center space-y-3">
          <span
            className={`inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase ${
              editorial ? "text-[#D4AF37]" : "text-pink-400"
            }`}
          >
            <Instagram className="w-4 h-4" aria-hidden="true" />
            Direto do Instagram
          </span>
          <h2
            id={`instagram-feed-title-${variant}`}
            className="text-3xl sm:text-4xl font-serif font-bold text-white"
          >
            Resultados reais e novidades do studio
          </h2>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            Confira de 3 a 6 publicações recentes de @renatabeautystudiio.
            O conteúdo é atualizado automaticamente pelo próprio Instagram.
          </p>
        </div>

        <div
          className={`mx-auto max-w-2xl overflow-hidden rounded-3xl border bg-white shadow-2xl ${
            editorial
              ? "border-[#D4AF37]/30 shadow-[#D4AF37]/10"
              : "border-pink-500/30 shadow-pink-950/40"
          }`}
        >
          {feedLoaded ? (
            <iframe
              id={`instagram-feed-embed-${variant}`}
              src={INSTAGRAM_EMBED_URL}
              title="Publicações recentes do Instagram da Renata Beauty Studio"
              className="block h-[640px] w-full sm:h-[720px]"
              loading="lazy"
              scrolling="no"
              referrerPolicy="strict-origin-when-cross-origin"
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
            />
          ) : (
            <div className="grid h-[640px] place-items-center px-6 text-center text-neutral-900 sm:h-[720px]">
              <div className="max-w-sm">
                <Instagram className={`mx-auto h-8 w-8 ${editorial ? "text-[#D4AF37]" : "text-pink-500"}`} aria-hidden="true" />
                <p className="mt-4 text-sm leading-relaxed">
                  O feed é carregado somente quando você solicitar, sem abrir o Instagram em segundo plano.
                </p>
                <button
                  type="button"
                  onClick={() => setFeedLoaded(true)}
                  className={`mt-5 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold text-white ${editorial ? "bg-[#171315] hover:bg-black" : "bg-pink-600 hover:bg-pink-700"}`}
                >
                  Carregar publicações
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-bold transition-all ${
              editorial
                ? "border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
                : "border-pink-500/40 bg-pink-500/10 text-pink-300 hover:bg-pink-500/20"
            }`}
          >
            <Instagram className="w-4 h-4" aria-hidden="true" />
            Ver perfil completo
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
          <p className="mt-3 text-xs text-gray-300">
            Se o feed não aparecer, o Instagram pode estar bloqueado pelas
            preferências de privacidade do navegador.
          </p>
        </div>
      </div>
    </section>
  );
}
