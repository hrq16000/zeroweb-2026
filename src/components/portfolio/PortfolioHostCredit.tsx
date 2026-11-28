type PortfolioHostCreditProps = {
  className?: string;
  linkClassName?: string;
  locale?: "es-CL";
};

/** Crédito compartilhado da hospedagem, separado da identidade de cada cliente. */
export function PortfolioHostCredit({ className, linkClassName, locale }: PortfolioHostCreditProps) {
  const spanish = locale === "es-CL";
  return (
    <p className={className} data-portfolio-host-credit>
      {spanish ? "Sitio desarrollado por " : "Site desenvolvido por "}
      <a
        href="https://www.0web.com.br"
        className={linkClassName}
        aria-label={spanish ? "Visitar el sitio de 0WEB, desarrolladora de este sitio" : "Acessar o site da 0WEB, desenvolvedora deste site"}
      >
        0WEB
      </a>
    </p>
  );
}
