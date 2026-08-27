type PortfolioHostCreditProps = {
  className?: string;
  linkClassName?: string;
};

/** Crédito compartilhado da hospedagem, separado da identidade de cada cliente. */
export function PortfolioHostCredit({ className, linkClassName }: PortfolioHostCreditProps) {
  return (
    <p className={className}>
      Site desenvolvido por{" "}
      <a
        href="https://0web.com.br"
        className={linkClassName}
        aria-label="Acessar o site da 0WEB, desenvolvedora deste site"
      >
        0WEB
      </a>
    </p>
  );
}
