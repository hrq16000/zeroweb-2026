import { expect, test } from "bun:test";
import portfolioCatalog from "@/config/portfolio-catalog.json";
import portfolioShareCopy from "@/config/portfolio-share-copy.json";
import {
  buildPortfolioShareMessage,
  isValidPortfolioShareMessage,
  normalizePortfolioShareMessage,
} from "./portfolio-share";

test("cria divulgação pronta e canônica para um projeto", () => {
  const message = buildPortfolioShareMessage("ag-electrical-services", "A&G Electrical Services");

  expect(message).toContain("A&G Electrical Services está de site novo!");
  expect(message).toContain("https://0web.com.br/portfolio/ag-electrical-services");
  expect(message.trimEnd().endsWith("#0WEB")).toBe(true);
});

test("todas as copies canônicas do catálogo têm estrutura válida", () => {
  for (const item of portfolioCatalog) {
    const copy = portfolioShareCopy[item.slug as keyof typeof portfolioShareCopy];
    expect(typeof copy, `${item.slug}: copy ausente`).toBe("string");
    expect(
      isValidPortfolioShareMessage(item.slug, String(copy)),
      `${item.slug}: copy fora do padrão`,
    ).toBe(true);
  }
});

test("normaliza barras-n literais antes de copiar", () => {
  const raw =
    "📱 Marca está de site novo!\\n\\nConheça produtos e serviços organizados em uma nova página.\\n\\n🌐 Confira:\\nhttps://0web.com.br/portfolio/marca\\n\\n📲 Fale com a equipe.\\n\\n#Marca #0WEB";
  const normalized = normalizePortfolioShareMessage(raw);

  expect(normalized).not.toContain("\\n");
  expect(normalized).toContain("\n\n");
  expect(isValidPortfolioShareMessage("marca", normalized)).toBe(true);
});

test("override de runtime inválido cai para a copy canônica", () => {
  const message = buildPortfolioShareMessage(
    "autoescola-aptos",
    "Autoescola APTOS",
    "Autoescola APTOS em São José dos Pinhais — agora com carro e moto automáticos.",
  );

  expect(message).toContain("https://0web.com.br/portfolio/autoescola-aptos");
  expect(message.trimEnd().endsWith("#0WEB")).toBe(true);
});


test("copy canônica vence override válido divergente de projeto catalogado", () => {
  const runtimeCopy = `🏗️ Paulo Mestre de Obras ganhou uma divulgação alternativa válida.

Serviços de obra e manutenção apresentados em uma página própria.

🌐 Conheça:
https://0web.com.br/portfolio/paulo-mestre-de-obras

#PauloMestreDeObras #ConstrucaoCivil #0WEB`;
  const message = buildPortfolioShareMessage(
    "paulo-mestre-de-obras",
    "Paulo Mestre de Obras",
    runtimeCopy,
  );
  const canonical =
    portfolioShareCopy["paulo-mestre-de-obras" as keyof typeof portfolioShareCopy];

  expect(message).toBe(normalizePortfolioShareMessage(String(canonical)));
  expect(message).not.toBe(normalizePortfolioShareMessage(runtimeCopy));
});
