import { expect, test } from "bun:test";
import { buildPortfolioShareMessage } from "./portfolio-share";

test("cria divulgação pronta e canônica para um projeto", () => {
  const message = buildPortfolioShareMessage("ag-electrical-services", "A&G Electrical Services");

  expect(message).toContain("A&G Electrical Services está de site novo!");
  expect(message).toContain("https://0web.com.br/portfolio/ag-electrical-services");
  expect(message).toContain("#SiteProfissional #0WEB");
});
