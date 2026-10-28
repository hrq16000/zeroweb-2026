import { useState } from "react";

type InstagramEmbedOnDemandProps = {
  embedUrl: string;
  profileUrl: string;
  title: string;
  heightClassName?: string;
};

/**
 * Instagram is a third-party embed that sets cookies during initial page load.
 * Render an accessible, same-size placeholder until the visitor explicitly
 * asks to load the official content; never proxy or impersonate Instagram.
 */
export function InstagramEmbedOnDemand({
  embedUrl,
  profileUrl,
  title,
  heightClassName = "h-[620px]",
}: InstagramEmbedOnDemandProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  if (isLoaded) {
    return (
      <iframe
        src={embedUrl}
        title={title}
        className={`${heightClassName} w-full`}
        loading="eager"
        scrolling="no"
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
      />
    );
  }

  return (
    <div className={`${heightClassName} flex w-full flex-col items-center justify-center gap-5 bg-[#fffaf4] px-6 text-center text-[#3d2921]`}>
      <p className="max-w-sm text-base font-semibold">
        Veja as publicações oficiais do Empório LeleCute
      </p>
      <p className="max-w-sm text-sm leading-relaxed">
        O conteúdo é hospedado pelo Instagram e só será carregado aqui quando você solicitar.
      </p>
      <button
        type="button"
        onClick={() => setIsLoaded(true)}
        className="min-h-11 rounded-full bg-[#3d2921] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#614034] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a55d4f]"
      >
        Carregar publicações do Instagram
      </button>
      <a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold underline underline-offset-4"
      >
        Ou acessar o Instagram oficial
      </a>
    </div>
  );
}
