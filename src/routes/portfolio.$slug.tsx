import { lazy, Suspense } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { PrototypeSite, VERTICALS } from "./sites.$vertical";
import { absUrl } from "@/lib/seo";
import { findPortfolioPrototype } from "@/lib/portfolio-site-registry";
import { breadcrumbNode, graph, organizationNode, serviceNode } from "@/lib/portfolio-seo";
import { MARIDO_ALUGUEL_FAQ } from "@/components/site/marido-de-aluguel-faq";
import { PortfolioStandardShell } from "@/components/portfolio/PortfolioStandardShell";
import { resolvePortfolioAssets, withSocialVersion } from "@/lib/portfolio-assets";

// Code splitting por cliente: cada site de `/portfolio/:slug` vira um chunk
// próprio, então o visitante baixa apenas o projeto que abriu. O SSR continua
// renderizando o conteúdo (React resolve o lazy no stream), preservando SEO.
const MaridoDeAluguelPage = lazy(() =>
  import("@/components/site/MaridoDeAluguelPage").then((m) => ({ default: m.MaridoDeAluguelPage })),
);
const EmporioLelecutePage = lazy(() =>
  import("@/components/site/EmporioLelecutePage").then((m) => ({ default: m.EmporioLelecutePage })),
);
const ParaisoHotDogPage = lazy(() =>
  import("@/components/site/ParaisoHotDogPage").then((m) => ({ default: m.ParaisoHotDogPage })),
);
const RMFretesPage = lazy(() =>
  import("@/components/site/RMFretesPage").then((m) => ({ default: m.RMFretesPage })),
);
const RjServicosDrywallPage = lazy(() =>
  import("@/components/site/RjServicosDrywallPage").then((m) => ({
    default: m.RjServicosDrywallPage,
  })),
);
const ConfeitariaChyrleyPage = lazy(() =>
  import("@/components/site/ConfeitariaChyrleyPage").then((m) => ({
    default: m.ConfeitariaChyrleyPage,
  })),
);
const MpFestasEventosPage = lazy(() =>
  import("@/components/site/MpFestasEventosPage").then((m) => ({ default: m.MpFestasEventosPage })),
);
const StudioDeCiliosPage = lazy(() =>
  import("@/components/site/StudioDeCiliosPage").then((m) => ({ default: m.StudioDeCiliosPage })),
);
const RefrigeracaoMaresiaPage = lazy(() =>
  import("@/components/site/RefrigeracaoMaresiaPage").then((m) => ({
    default: m.RefrigeracaoMaresiaPage,
  })),
);
const AgElectricalServicesPage = lazy(() =>
  import("@/components/site/AgElectricalServicesPage").then((m) => ({
    default: m.AgElectricalServicesPage,
  })),
);
const VilaDaCapivaraPage = lazy(() =>
  import("@/components/site/VilaDaCapivaraPage").then((m) => ({ default: m.VilaDaCapivaraPage })),
);
const LkAlvenariaPage = lazy(() =>
  import("@/components/site/LkAlvenariaPage").then((m) => ({ default: m.LkAlvenariaPage })),
);
const LucasArrumaMaquinaLavarPage = lazy(() =>
  import("@/components/site/LucasArrumaMaquinaLavarPage").then((m) => ({
    default: m.LucasArrumaMaquinaLavarPage,
  })),
);
const PauloMestreDeObrasPage = lazy(() =>
  import("@/components/site/PauloMestreDeObrasPage").then((m) => ({
    default: m.PauloMestreDeObrasPage,
  })),
);
const EcommerceOnPage = lazy(() =>
  import("@/components/site/EcommerceOnPage").then((m) => ({ default: m.EcommerceOnPage })),
);
const NoBrilhoHigienizacaoPage = lazy(() =>
  import("@/components/site/NoBrilhoHigienizacaoPage").then((m) => ({
    default: m.NoBrilhoHigienizacaoPage,
  })),
);
const SalaoDaMarciaPage = lazy(() =>
  import("@/components/site/SalaoDaMarciaPage").then((m) => ({ default: m.SalaoDaMarciaPage })),
);
const EspacoCihLuhPage = lazy(() =>
  import("@/components/site/EspacoCihLuhPage").then((m) => ({ default: m.EspacoCihLuhPage })),
);
const DiegoMontadorMoveisPage = lazy(() =>
  import("@/components/site/DiegoMontadorMoveisPage").then((m) => ({
    default: m.DiegoMontadorMoveisPage,
  })),
);
const AguiaSulSinalizacaoPage = lazy(() =>
  import("@/components/site/AguiaSulSinalizacaoPage").then((m) => ({
    default: m.AguiaSulSinalizacaoPage,
  })),
);
const EletrovaleEletromecanicaPage = lazy(() =>
  import("@/components/site/EletrovaleEletromecanicaPage").then((m) => ({
    default: m.EletrovaleEletromecanicaPage,
  })),
);
const EletroSolucoesEficazesPage = lazy(() =>
  import("@/components/site/EletroSolucoesEficazesPage").then((m) => ({
    default: m.EletroSolucoesEficazesPage,
  })),
);
const EisenferTubosAcosPage = lazy(() =>
  import("@/components/site/EisenferTubosAcosPage").then((m) => ({
    default: m.EisenferTubosAcosPage,
  })),
);
const MaryDiaristaPage = lazy(() =>
  import("@/components/site/MaryDiaristaPage").then((m) => ({ default: m.MaryDiaristaPage })),
);
const AcaiTotalAraucariaPage = lazy(() =>
  import("@/components/site/AcaiTotalAraucariaPage").then((m) => ({
    default: m.AcaiTotalAraucariaPage,
  })),
);
const JklMarcenariaPage = lazy(() =>
  import("@/components/site/JklMarcenariaPage").then((m) => ({ default: m.JklMarcenariaPage })),
);
const SantosMontadorDeMoveisPage = lazy(() =>
  import("@/components/site/SantosMontadorDeMoveisPage").then((m) => ({
    default: m.SantosMontadorDeMoveisPage,
  })),
);
const SosPresentesCosmeticosPage = lazy(() =>
  import("@/components/site/SosPresentesCosmeticosPage").then((m) => ({
    default: m.SosPresentesCosmeticosPage,
  })),
);
const MarmitariaDomDiegoPage = lazy(() =>
  import("@/components/site/MarmitariaDomDiegoPage").then((m) => ({
    default: m.MarmitariaDomDiegoPage,
  })),
);
const BetoPasteisPage = lazy(() =>
  import("@/components/site/BetoPasteisPage").then((m) => ({ default: m.BetoPasteisPage })),
);
const WoodhouseHamburgueresPage = lazy(() =>
  import("@/components/site/WoodhouseHamburgueresPage").then((m) => ({
    default: m.WoodhouseHamburgueresPage,
  })),
);
const DlaraPizzariaPage = lazy(() =>
  import("@/components/site/DlaraPizzariaPage").then((m) => ({ default: m.DlaraPizzariaPage })),
);
const ToquinhoDeGenteBrechoPage = lazy(() =>
  import("@/components/site/ToquinhoDeGenteBrechoPage").then((m) => ({
    default: m.ToquinhoDeGenteBrechoPage,
  })),
);
const ReuseHouseBrechoPage = lazy(() =>
  import("@/components/site/ReuseHouseBrechoPage").then((m) => ({
    default: m.ReuseHouseBrechoPage,
  })),
);
const BrechoSaoFranciscoPage = lazy(() =>
  import("@/components/site/BrechoSaoFranciscoPage").then((m) => ({
    default: m.BrechoSaoFranciscoPage,
  })),
);
const AngelMixBrechoPage = lazy(() =>
  import("@/components/site/AngelMixBrechoPage").then((m) => ({ default: m.AngelMixBrechoPage })),
);
const LolipaArteEmFestasPage = lazy(() =>
  import("@/components/site/LolipaArteEmFestasPage").then((m) => ({
    default: m.LolipaArteEmFestasPage,
  })),
);
const ConfeitariaSaborDaRealezaPage = lazy(() =>
  import("@/components/site/ConfeitariaSaborDaRealezaPage").then((m) => ({
    default: m.ConfeitariaSaborDaRealezaPage,
  })),
);
const PremiumEnvelopamentosPage = lazy(() =>
  import("@/components/site/PremiumEnvelopamentosPage").then((m) => ({
    default: m.PremiumEnvelopamentosPage,
  })),
);
const MiroTechPage = lazy(() =>
  import("@/components/site/MiroTechPage").then((m) => ({ default: m.MiroTechPage })),
);
const GalileuLocacaoBrinquedosPage = lazy(() =>
  import("@/components/site/GalileuLocacaoBrinquedosPage").then((m) => ({
    default: m.GalileuLocacaoBrinquedosPage,
  })),
);
const LjCleaningPage = lazy(() =>
  import("@/components/site/LjCleaningPage").then((m) => ({ default: m.LjCleaningPage })),
);
const ManuPasteisPage = lazy(() =>
  import("@/components/site/ManuPasteisPage").then((m) => ({ default: m.ManuPasteisPage })),
);
const LizMoraesNailDesignerPage = lazy(() =>
  import("@/components/site/LizMoraesNailDesignerPage").then((m) => ({
    default: m.LizMoraesNailDesignerPage,
  })),
);
const AssistenciaMicroondasSantosPage = lazy(() =>
  import("@/components/site/AssistenciaMicroondasSantosPage").then((m) => ({
    default: m.AssistenciaMicroondasSantosPage,
  })),
);
const ArtesanatosDarLeiaOliveiraPage = lazy(() =>
  import("@/components/site/ArtesanatosDarLeiaOliveiraPage").then((m) => ({
    default: m.ArtesanatosDarLeiaOliveiraPage,
  })),
);
const ThaysCamillaPage = lazy(() =>
  import("@/components/site/ThaysCamillaPage").then((m) => ({ default: m.ThaysCamillaPage })),
);
const FernandaAmaralDrywallPage = lazy(() =>
  import("@/components/site/FernandaAmaralDrywallPage").then((m) => ({
    default: m.FernandaAmaralDrywallPage,
  })),
);
const DeniseGomesPsicologaPage = lazy(() =>
  import("@/components/site/DeniseGomesPsicologaPage").then((m) => ({
    default: m.DeniseGomesPsicologaPage,
  })),
);
const TonECorPage = lazy(() =>
  import("@/components/site/TonECorPage").then((m) => ({ default: m.TonECorPage })),
);
const RaphaelConstrucoesPage = lazy(() =>
  import("@/components/site/RaphaelConstrucoesPage").then((m) => ({
    default: m.RaphaelConstrucoesPage,
  })),
);
const JcRevestimentosPage = lazy(() =>
  import("@/components/site/JcRevestimentosPage").then((m) => ({ default: m.JcRevestimentosPage })),
);
const HbkIluminacaoLedPage = lazy(() =>
  import("@/components/site/HbkIluminacaoLedPage").then((m) => ({ default: m.HbkIluminacaoLedPage })),
);
const HeloaGasPage = lazy(() =>
  import("@/components/site/HeloaGasPage").then((m) => ({ default: m.HeloaGasPage })),
);

export const Route = createFileRoute("/portfolio/$slug")({
  loader: ({ params }) => {
    const site = findPortfolioPrototype(params.slug);
    const verticalSlug = site?.vertical;
    const vertical = verticalSlug ? VERTICALS[verticalSlug] : undefined;
    if (!vertical) throw notFound();
    return { vertical, slug: params.slug };
  },
  head: ({ loaderData }) => {
    const prototype = loaderData?.slug ? findPortfolioPrototype(loaderData.slug) : undefined;
    const title =
      prototype?.siteName ?? loaderData?.vertical?.name ?? "Projeto de presença digital";
    const isHotDog = loaderData?.slug === "paraiso-do-hot-dog";
    const isRjDrywall = loaderData?.slug === "rj-servicos-drywall";
    const isChyrley = loaderData?.slug === "confeitaria-chyrley";
    const isMpFestas = loaderData?.slug === "mp-festas-eventos";
    const isStudioCilios = loaderData?.slug === "studio-de-cilios";
    const isMaresia = loaderData?.slug === "refrigeracao-maresia";
    const isAgElectrical = loaderData?.slug === "ag-electrical-services";
    const isVilaCapivara = loaderData?.slug === "vila-da-capivara";
    const isLkAlvenaria = loaderData?.slug === "lk-alvenaria";
    const isLucasArruma = loaderData?.slug === "lucas-arruma-maquina-lavar";
    const isPauloMestre = loaderData?.slug === "paulo-mestre-de-obras";
    const isEcommerceOn = loaderData?.slug === "ecommerce-on";
    const isNoBrilho = loaderData?.slug === "no-brilho-higienizacao";
    const isSalaoMarcia = loaderData?.slug === "salao-da-marcia";
    const isCihLuh = loaderData?.slug === "espaco-cih-luh";
    const isDiego = loaderData?.slug === "diego-montador-moveis";
    const isAguia = loaderData?.slug === "aguia-sul-sinalizacao";
    const isEletrovale = loaderData?.slug === "eletrovale-eletromecanica";
    const isEletroSolucoes = loaderData?.slug === "eletro-solucoes-eficazes";
    const isEisenfer = loaderData?.slug === "eisenfer-tubos-acos";
    const isMary = loaderData?.slug === "mary-diarista";
    const isAcai = loaderData?.slug === "acai-total-araucaria";
    const isJkl = loaderData?.slug === "jkl-marcenaria";
    const isSantos = loaderData?.slug === "santos-montador-de-moveis";
    const isSosPresentes = loaderData?.slug === "sos-presentes-cosmeticos";
    const isLolipa = loaderData?.slug === "lolipa-arte-em-festas";
    const isRealeza = loaderData?.slug === "confeitaria-sabor-da-realeza";
    const isPremium = loaderData?.slug === "premium-envelopamentos";
    const isMiro = loaderData?.slug === "miro-tech";
    const isGalileu = loaderData?.slug === "galileu-locacao-brinquedos";
    const isLjCleaning = loaderData?.slug === "lj-cleaning";
    const isManuPasteis = loaderData?.slug === "manu-pasteis";
    const isLizMoraes = loaderData?.slug === "liz-moraes-nail-designer";
    const isAssistenciaMicroondas = loaderData?.slug === "assistencia-microondas-santos";
    const isArtesanatosDarleia = loaderData?.slug === "artesanatos-darleia-oliveira";
    const isThaysCamilla = loaderData?.slug === "thays-camilla";
    const isFernandaAmaral = loaderData?.slug === "fernanda-amaral-drywall";
    const isDeniseGomes = loaderData?.slug === "denise-gomes-psicologa";
    const isTonECor = loaderData?.slug === "ton-e-cor";
    const isRaphaelConstrucoes = loaderData?.slug === "raphael-construcoes";
    const isJcRevestimentos = loaderData?.slug === "jc-revestimentos";
    const isHbkIluminacaoLed = loaderData?.slug === "hbk-iluminacao-led";
    const description = isHbkIluminacaoLed
      ? "HBK Iluminação LED Atacadão: produtos LED, orientação técnica e condições especiais para construção e reforma."
      : isJcRevestimentos
      ? "JC Revestimentos em Uberaba, Curitiba: textura projetada, grafiato, textura lisa, massa corrida, massa acrílica e massa niveladora."
      : isRaphaelConstrucoes
      ? "Raphael Construções: construção, engenharia, impermeabilização, reformas, instalações, demolição, pintura e acabamentos em Curitiba, região e litoral."
      : isTonECor
      ? "Ton & Cor: pintura em geral, pequenos serviços de alvenaria e hidráulica, limpeza de telhado e reparos em geral na região do Paraná."
      : isDeniseGomes
        ? "Denise Gomes, psicóloga CRP 08/22352 em São José dos Pinhais: atendimento e avaliação psicológica para adultos, ansiedade, burnout e relacionamentos."
        : isManuPasteis
          ? "Manu Pastéis: cardápio online de pastéis bem recheados e quentinhos, com horários e formas de pagamento para pedidos."
          : isLizMoraes
            ? "Liz Moraes Nail Designer no Centro de São José dos Pinhais: manicure, pedicure, spa dos pés, esmaltação em gel e alongamento molde F1 com agendamento pelo WhatsApp."
            : isAssistenciaMicroondas
              ? "Assistência Técnica Microondas Santos em São José dos Pinhais: conserto a domicílio, restauração contra ferrugem e venda de modelos revisados de micro-ondas."
              : isArtesanatosDarleia
                ? "Artesanatos Darléia Oliveira: coadores de café 100% algodão, reutilizáveis e feitos à mão para um café mais puro e acolhedor."
                : isThaysCamilla
                  ? "Thays Camilla: canecas e azulejos personalizados para presentear com carinho, incluindo kit promocional com azulejo 15x15 cm."
                  : isFernandaAmaral
                    ? "Fernanda & Amaral Serviços: instalação de drywall, pinturas, reformas, móveis e madeira, corte de grama e pequenos fretes na região do Paraná."
                    : isLjCleaning
                      ? "L&J Cleaning: higienização de sofás, limpeza automotiva, colchões, tapetes, carpetes e outros itens."
                      : isGalileu
                        ? "Galileu Locação de Brinquedos em São José dos Pinhais: tobogã inflável, cama elástica, piscina de bolinhas e atrações para festas e eventos."
                        : isMiro
                          ? "MIRO TECH em São José dos Pinhais: manutenção especializada de TVs, computadores, micro-ondas e recuperação de dados de HD."
                          : isPremium
                            ? "Premium Envelopamentos em Curitiba e região: plotagem de móveis, envelopamento de geladeiras e soluções de comunicação visual."
                            : isRealeza
                              ? "Confeitaria Sabor da Realeza em Uberaba: bolos, doces, salgados e encomendas para festas e eventos."
                              : isLolipa
                                ? "Lolipa Arte em Festas Decor em Curitiba: decorações personalizadas para aniversários, batizados, chás e comemorações especiais, com criação sob medida e opção pegue e monte."
                                : isSosPresentes
                                  ? "SOS Presentes & Cosméticos em São José dos Pinhais: cestas à pronta entrega, cosméticos, acessórios e canecas personalizadas para presentear."
                                  : isRjDrywall
                                    ? "Instalação, manutenção e reparos em drywall em Curitiba e Região Metropolitana. Paredes, forros, sancas, nichos e acabamento fino."
                                    : isHotDog
                                      ? "Cardápio online do Paraíso do Hot Dog em São José dos Pinhais, com lanches, adicionais, retirada, entrega e pedido direto pelo atendimento."
                                      : loaderData?.slug === "emporio-lelecute"
                                        ? "Lembrancinhas artesanais personalizadas, sabonetes, velas e presentes do Empório LeleCute em São José dos Pinhais."
                                        : isChyrley
                                          ? "Bolos, kits festa, salgados, docinhos e Copo da Felicidade feitos por Chyrley em Rio Bonito, Paraná. Encomende para sua comemoração."
                                          : isMpFestas
                                            ? "Decoração de festas em Araucária e região: Festa na Mesa, decoração clássica e premium para aniversários, casamentos e eventos especiais."
                                            : isStudioCilios
                                              ? "Extensão de cílios com efeito personalizado: Mega Brasileiro, Mega Egípcio, Mega Fox Eyes e Fio a Fio com agendamento online."
                                              : isMaresia
                                                ? "Manutenção e conserto de geladeiras e freezers em Curitiba e Região Metropolitana. Recarga de gás, motor, sensor e manutenção preventiva ou corretiva."
                                                : isAgElectrical
                                                  ? "Elétrica geral, infraestrutura para redes, cabeamento UTP, CFTV e organização de racks em Curitiba e Região Metropolitana."
                                                  : isVilaCapivara
                                                    ? "Bolos personalizados, brigadeiros gourmet, salgados e kits festa completos para aniversários e eventos em Campo Comprido, Curitiba."
                                                    : isLkAlvenaria
                                                      ? "Construção, fundação, alvenaria, concretagem, revestimentos, drywall, calçadas e reformas com contrato e garantia."
                                                      : isLucasArruma
                                                        ? "Conserto e manutenção de máquinas de lavar com diagnóstico e atendimento com garantia."
                                                        : isPauloMestre
                                                          ? "Serviços de pedreiro, azulejista e construção civil para fundação, alvenaria, revestimentos e reformas."
                                                          : isEcommerceOn
                                                            ? "Agência digital para SEO, e-commerce, redes sociais, tráfego pago, conteúdo, automação e estratégia de comunicação."
                                                            : isNoBrilho
                                                              ? "Higienização profissional de sofás, colchões, cadeiras, poltronas, tapetes e bancos automotivos em São José dos Pinhais."
                                                              : isSalaoMarcia
                                                                ? "Salão da Marcia em Cidade Jardim, São José dos Pinhais: depilação com cera, progressiva, cortes, hidratação, mechas, pé e mão."
                                                                : isCihLuh
                                                                  ? "Espaço CIH & LUH, o casal das unhas: alongamento em gel, reconstruções, pedicure e cuidados podológicos."
                                                                  : isDiego
                                                                    ? "Montagem e desmontagem de móveis, consertos, adaptações e instalações residenciais no Sítio Cercado, Curitiba."
                                                                    : isAguia
                                                                      ? "Pintura e sinalização horizontal para estacionamentos, condomínios, comércios e indústrias em Curitiba e região."
                                                                      : isEletrovale
                                                                        ? "Manutenção e rebobinamento de bombas, motores, motoredutores e motofreios com excelência técnica."
                                                                        : isEletroSolucoes
                                                                          ? "Instalações elétricas, manutenção, iluminação e automação residencial, predial e industrial em Pinhais e região."
                                                                          : isEisenfer
                                                                            ? "Tubos, perfis, chapas e telhas metálicas para obras residenciais, comerciais e industriais em São José dos Pinhais."
                                                                            : isMary
                                                                              ? "Mary Diarista oferece diárias, limpeza pós-obra e organização em Curitiba, com agenda semanal, quinzenal e esporádica."
                                                                              : isAcai
                                                                                ? "Açaí Total Araucária: copões e litrões de açaí com frutas, cremes e complementos, com entrega em casa."
                                                                                : isJkl
                                                                                  ? "JKL Marcenaria em Curitiba: móveis planejados sob medida em MDF para cozinhas, dormitórios, nichos e banheiros."
                                                                                  : isSantos
                                                                                    ? "Montagem e desmontagem de móveis, pintura interna, reparos elétricos, limpeza de caixa d'água e instalação de cortinas em Curitiba, Colombo e Alphaville."
                                                                                    : (loaderData
                                                                                        ?.vertical
                                                                                        ?.subheadline ??
                                                                                      "Projeto de presença digital criado pela 0WEB.");
    const url = absUrl(`/portfolio/${loaderData?.slug ?? ""}`);
    const assetConfig = loaderData?.slug ? resolvePortfolioAssets(loaderData.slug) : undefined;
    const socialImage = withSocialVersion(
      absUrl(
        assetConfig?.socialImage
          ? assetConfig.socialImage
          : loaderData?.slug === "rm-fretes"
            ? "/images/rm-fretes/anuncio-oficial.png"
            : isRjDrywall
              ? "/images/rj-servicos-drywall/acabamento-sala.webp"
              : loaderData?.slug === "emporio-lelecute"
                ? "/images/emporio-lelecute-og.webp"
                : loaderData?.slug === "paraiso-do-hot-dog"
                  ? "/images/paraiso-hot-dog-cover.webp"
                  : isChyrley
                    ? "/images/confeitaria-chyrley/capa.webp"
                    : isMpFestas
                      ? "/images/mp-festas-eventos/capa.webp"
                      : isStudioCilios
                        ? "/images/studio-de-cilios/portfolio-1.webp"
                        : isMaresia
                          ? "/images/refrigeracao-maresia/capa.webp"
                          : isAgElectrical
                            ? "/images/ag-electrical-services/intro.webp"
                            : isVilaCapivara
                              ? "/images/vila-da-capivara/capa.webp"
                              : isLkAlvenaria
                                ? "/images/lk-alvenaria/portfolio.webp"
                                : isLucasArruma
                                  ? "/images/lucas-arruma-maquina-lavar/capa.webp"
                                  : isPauloMestre
                                    ? "/images/paulo-mestre-de-obras/capa.webp"
                                    : isEcommerceOn
                                      ? "/images/ecommerce-on/servicos.webp"
                                      : isNoBrilho
                                        ? "/images/no-brilho-higienizacao/capa.webp"
                                        : isSalaoMarcia
                                          ? "/images/salao-da-marcia/depilacao.webp"
                                          : isCihLuh
                                            ? "/images/espaco-cih-luh/promocao.webp"
                                            : isDiego
                                              ? "/images/diego-montador-moveis/capa.webp"
                                              : isAguia
                                                ? "/images/aguia-sul-sinalizacao/logo.webp"
                                                : isEletrovale
                                                  ? "/images/eletrovale-eletromecanica/equipamentos.webp"
                                                  : isEletroSolucoes
                                                    ? "/images/eletro-solucoes-eficazes/servicos.webp"
                                                    : isEisenfer
                                                      ? "/images/eisenfer-tubos-acos/telhas.webp"
                                                      : isMary
                                                        ? "/images/mary-diarista/servicos.webp"
                                                        : isAcai
                                                          ? "/images/acai-total-araucaria/acai.webp"
                                                          : isJkl
                                                            ? "/images/jkl-marcenaria/cozinha.webp"
                                                            : isSantos
                                                              ? "/images/santos-montador-de-moveis/hero.webp"
                                                              : "/images/mestre-dos-servicos-logo.jpg",
      ),
      loaderData?.slug,
    );
    const socialImageType = socialImage.includes(".png") ? "image/png" : "image/jpeg";
    const icon = absUrl(
      assetConfig?.icon ??
        (loaderData?.slug === "rm-fretes" ? "/images/rm-fretes/anuncio-oficial.png" : socialImage),
    );
    const vertical = loaderData?.vertical;
    const isMarido = loaderData?.slug === "marido-de-aluguel";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index,follow,max-image-preview:large" },
        {
          name: "keywords",
          content: isRjDrywall
            ? "drywall Curitiba, instalação de drywall, parede de drywall, forro de gesso, sanca, reparo drywall, gesso acartonado"
            : isMarido
              ? "marido de aluguel, marido de aluguel Curitiba, reparos residenciais, manutenção residencial"
              : isManuPasteis
                ? "Manu Pastéis, pastel recheado, pastel quentinho, cardápio online, delivery, São José dos Pinhais"
                : isLizMoraes
                  ? "Liz Moraes Nail Designer, manicure, pedicure, esmaltação em gel, alongamento molde F1, Centro, São José dos Pinhais"
                  : isAssistenciaMicroondas
                    ? "Assistência Técnica Microondas Santos, conserto de micro-ondas, restauração contra ferrugem, micro-ondas revisado, conserto a domicílio, São José dos Pinhais"
                    : isArtesanatosDarleia
                      ? "Artesanatos Darléia Oliveira, coador de café 100% algodão, filtro reutilizável, artesanato feito à mão, café artesanal"
                      : isThaysCamilla
                        ? "Thays Camilla, caneca personalizada, azulejo personalizado 15x15, presentes artesanais, kit caneca e azulejo"
                        : isFernandaAmaral
                          ? "Fernanda e Amaral, instalação de drywall, pinturas, reformas, móveis e madeira, corte de grama, pequenos fretes, serviços residenciais, Paraná"
                          : isLjCleaning
                            ? "L&J Cleaning, higienização de sofás, limpeza automotiva, colchões, tapetes, carpetes e puffs"
                            : isGalileu
                              ? "Galileu Locação de Brinquedos São José dos Pinhais, tobogã inflável, cama elástica, piscina de bolinhas, festas e eventos"
                              : isMiro
                                ? "MIRO TECH São José dos Pinhais, assistência técnica TV, computador, micro-ondas, recuperação de dados de HD"
                                : isPremium
                                  ? "Premium Envelopamentos Curitiba, plotagem de móveis, envelopamento de geladeiras, adesivos, banners e comunicação visual"
                                  : isRealeza
                                    ? "Confeitaria Sabor da Realeza Uberaba, bolos, doces, salgados, encomendas para festas e eventos"
                                    : isLolipa
                                      ? "Lolipa Arte em Festas Decor Curitiba, decoração de festas, decoração personalizada, aniversários, batizados, chás, pegue e monte, mimos para festas"
                                      : isHotDog
                                        ? "hot dog São José dos Pinhais, cachorro-quente, lanche, cardápio online, entrega de hot dog, Paraíso do Hot Dog"
                                        : isChyrley
                                          ? "confeitaria Rio Bonito, bolo personalizado, kit festa, salgados para festa, Copo da Felicidade, doces artesanais"
                                          : isMpFestas
                                            ? "decoração de festas Araucária, Festa na Mesa, decoração clássica, decoração premium, festas infantis, eventos"
                                            : isStudioCilios
                                              ? "extensão de cílios, fio a fio, Mega Brasileiro, Mega Egípcio, Fox Eyes, agendamento de cílios"
                                              : isMaresia
                                                ? "refrigeração Curitiba, conserto de geladeira, manutenção de freezer, recarga de gás, troca de motor, troca de sensor"
                                                : isAgElectrical
                                                  ? "elétrica Curitiba, infraestrutura de redes, cabeamento UTP, CFTV, organização de rack, Laserway"
                                                  : isVilaCapivara
                                                    ? "Vila da Capivara Curitiba, kit festa, bolo personalizado, brigadeiro gourmet, salgados, Campo Comprido"
                                                    : isLkAlvenaria
                                                      ? "alvenaria Curitiba, fundação, baldrame, muro de arrimo, concretagem, reformas, drywall, forro PVC"
                                                      : isLucasArruma
                                                        ? "conserto máquina de lavar, manutenção máquina de lavar, assistência máquina de lavar, lavadora não liga, máquina não centrifuga"
                                                        : isPauloMestre
                                                          ? "pedreiro Curitiba, mestre de obras, azulejista, alvenaria, pisos e revestimentos, reformas residenciais"
                                                          : isEcommerceOn
                                                            ? "agência digital Curitiba, SEO, e-commerce, tráfego pago, gestão de redes sociais, marketing digital, automação"
                                                            : isNoBrilho
                                                              ? "higienização de estofados São José dos Pinhais, limpeza de sofá, higienização de colchão, limpeza a domicílio"
                                                              : isSalaoMarcia
                                                                ? "Salão da Marcia São José dos Pinhais, depilação com cera, progressiva, corte, hidratação, mechas, pé e mão"
                                                                : isCihLuh
                                                                  ? "Espaço CIH LUH Manaus, alongamento em gel, unhas, pedicure, podologia, reconstrução de unhas"
                                                                  : isDiego
                                                                    ? "montador de móveis Curitiba, montagem de móveis Sítio Cercado, marido de aluguel Curitiba, conserto de móveis, instalação de TV, instalação de persianas"
                                                                    : isAguia
                                                                      ? "sinalização horizontal Curitiba, pintura de estacionamento, demarcação de vagas, faixas de pedestres, pintura industrial, Águia Sul"
                                                                      : isEletrovale
                                                                        ? "Eletrovale Eletromecânica Curitiba, rebobinamento de motores, manutenção de bombas, motoredutores, motofreios, manutenção industrial"
                                                                        : isEletroSolucoes
                                                                          ? "Eletro Soluções Eficazes Pinhais, instalações elétricas, iluminação, automação residencial, predial e industrial, manutenção elétrica"
                                                                          : isEisenfer
                                                                            ? "Eisenfer Tubos e Aços São José dos Pinhais, tubos de aço, perfis, chapas, telhas metálicas, telha sanduíche"
                                                                            : isMary
                                                                              ? "Mary Diarista Curitiba, limpeza residencial, diária, pós-obra, pós-mudança, personal organizer, diarista quinta-feira"
                                                                              : isAcai
                                                                                ? "Açaí Total Araucária, açaí delivery, copão de açaí, litrão, frutas, cremes, cardápio digital"
                                                                                : isJkl
                                                                                  ? "JKL Marcenaria Curitiba, móveis planejados MDF, cozinha sob medida, guarda-roupa planejado, nichos, marcenaria Curitiba"
                                                                                  : isSantos
                                                                                    ? "montador de móveis Curitiba, montagem de móveis Colombo, desmontagem de móveis, pintura interna, reparos elétricos, limpeza de caixa d'água, instalação de cortinas, Alphaville Curitiba"
                                                                                    : isAssistenciaMicroondas
                                                                                      ? "Assistência Técnica Microondas Santos, conserto de micro-ondas, restauração contra ferrugem, venda de micro-ondas revisados, atendimento a domicílio, São José dos Pinhais"
                                                                                      : (vertical?.keywords ??
                                                                                        "site profissional, criação de sites, SEO local"),
        },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: title },
        { property: "og:image", content: socialImage },
        { property: "og:image:secure_url", content: socialImage },
        { property: "og:image:type", content: socialImageType },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: title },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: socialImage },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "icon", href: icon },
        { rel: "apple-touch-icon", href: icon },
      ],
      scripts: vertical
        ? [
            {
              type: "application/ld+json",
              children: graph([
                organizationNode(),
                {
                  "@type": "WebPage",
                  "@id": url,
                  url,
                  name: title,
                  description,
                  inLanguage: "pt-BR",
                  isPartOf: { "@id": "https://0web.com.br/portfolio" },
                },
                {
                  ...serviceNode({
                    slug: vertical.slug,
                    name: vertical.name,
                    keyword: vertical.keywords,
                    intent: vertical.hero,
                    services: vertical.services.map((service) => service.to),
                    hubs: [],
                    showcases: [],
                    deliverables: vertical.services.map((service) => service.title),
                  }),
                  "@id": `${url}#service`,
                  url,
                },
                ...(isMarido
                  ? [
                      {
                        "@type": "FAQPage",
                        "@id": `${url}#faq`,
                        mainEntity: MARIDO_ALUGUEL_FAQ.map((faq) => ({
                          "@type": "Question",
                          name: faq.q,
                          acceptedAnswer: { "@type": "Answer", text: faq.a },
                        })),
                      },
                    ]
                  : []),
                breadcrumbNode([
                  { name: "Início", path: "/" },
                  { name: "Portfólio", path: "/portfolio" },
                  { name: title, path: `/portfolio/${loaderData?.slug ?? ""}` },
                ]),
              ]),
            },
          ]
        : undefined,
    };
  },
  component: PortfolioPrototypePage,
});

function PortfolioPrototypePage() {
  const { vertical, slug } = Route.useLoaderData();
  return (
    <PortfolioStandardShell slug={slug} includePlatformFooter={false}>
      <Suspense fallback={<div className="min-h-dvh" aria-busy="true" />}>
        {slug === "sos-presentes-cosmeticos" ? (
          <SosPresentesCosmeticosPage />
        ) : slug === "lolipa-arte-em-festas" ? (
          <LolipaArteEmFestasPage />
        ) : slug === "confeitaria-sabor-da-realeza" ? (
          <ConfeitariaSaborDaRealezaPage />
        ) : slug === "premium-envelopamentos" ? (
          <PremiumEnvelopamentosPage />
        ) : slug === "miro-tech" ? (
          <MiroTechPage />
        ) : slug === "galileu-locacao-brinquedos" ? (
          <GalileuLocacaoBrinquedosPage />
        ) : slug === "lj-cleaning" ? (
          <LjCleaningPage />
        ) : slug === "manu-pasteis" ? (
          <ManuPasteisPage />
        ) : slug === "liz-moraes-nail-designer" ? (
          <LizMoraesNailDesignerPage />
        ) : slug === "assistencia-microondas-santos" ? (
          <AssistenciaMicroondasSantosPage />
        ) : slug === "artesanatos-darleia-oliveira" ? (
          <ArtesanatosDarLeiaOliveiraPage />
        ) : slug === "thays-camilla" ? (
          <ThaysCamillaPage />
        ) : slug === "fernanda-amaral-drywall" ? (
          <FernandaAmaralDrywallPage />
        ) : slug === "denise-gomes-psicologa" ? (
          <DeniseGomesPsicologaPage />
        ) : slug === "ton-e-cor" ? (
          <TonECorPage />
        ) : slug === "raphael-construcoes" ? (
          <RaphaelConstrucoesPage />
        ) : slug === "jc-revestimentos" ? (
          <JcRevestimentosPage />
        ) : slug === "hbk-iluminacao-led" ? (
          <HbkIluminacaoLedPage />
        ) : slug === "marmitaria-dom-diego" ? (
          <MarmitariaDomDiegoPage />
        ) : slug === "beto-pasteis" ? (
          <BetoPasteisPage />
        ) : slug === "woodhouse-hamburgueres" ? (
          <WoodhouseHamburgueresPage />
        ) : slug === "dlara-pizzaria" ? (
          <DlaraPizzariaPage />
        ) : slug === "toquinho-de-gente-brecho" ? (
          <ToquinhoDeGenteBrechoPage />
        ) : slug === "reuse-house-brecho" ? (
          <ReuseHouseBrechoPage />
        ) : slug === "brecho-sao-francisco" ? (
          <BrechoSaoFranciscoPage />
        ) : slug === "angel-mix-brecho" ? (
          <AngelMixBrechoPage />
        ) : slug === "marido-de-aluguel" ? (
          <MaridoDeAluguelPage />
        ) : slug === "emporio-lelecute" ? (
          <EmporioLelecutePage />
        ) : slug === "paraiso-do-hot-dog" ? (
          <ParaisoHotDogPage />
        ) : slug === "rm-fretes" ? (
          <RMFretesPage />
        ) : slug === "rj-servicos-drywall" ? (
          <RjServicosDrywallPage />
        ) : slug === "confeitaria-chyrley" ? (
          <ConfeitariaChyrleyPage />
        ) : slug === "mp-festas-eventos" ? (
          <MpFestasEventosPage />
        ) : slug === "studio-de-cilios" ? (
          <StudioDeCiliosPage />
        ) : slug === "refrigeracao-maresia" ? (
          <RefrigeracaoMaresiaPage />
        ) : slug === "ag-electrical-services" ? (
          <AgElectricalServicesPage />
        ) : slug === "vila-da-capivara" ? (
          <VilaDaCapivaraPage />
        ) : slug === "lk-alvenaria" ? (
          <LkAlvenariaPage />
        ) : slug === "lucas-arruma-maquina-lavar" ? (
          <LucasArrumaMaquinaLavarPage />
        ) : slug === "paulo-mestre-de-obras" ? (
          <PauloMestreDeObrasPage />
        ) : slug === "ecommerce-on" ? (
          <EcommerceOnPage />
        ) : slug === "no-brilho-higienizacao" ? (
          <NoBrilhoHigienizacaoPage />
        ) : slug === "salao-da-marcia" ? (
          <SalaoDaMarciaPage />
        ) : slug === "espaco-cih-luh" ? (
          <EspacoCihLuhPage />
        ) : slug === "diego-montador-moveis" ? (
          <DiegoMontadorMoveisPage />
        ) : slug === "aguia-sul-sinalizacao" ? (
          <AguiaSulSinalizacaoPage />
        ) : slug === "eletrovale-eletromecanica" ? (
          <EletrovaleEletromecanicaPage />
        ) : slug === "eletro-solucoes-eficazes" ? (
          <EletroSolucoesEficazesPage />
        ) : slug === "eisenfer-tubos-acos" ? (
          <EisenferTubosAcosPage />
        ) : slug === "mary-diarista" ? (
          <MaryDiaristaPage />
        ) : slug === "acai-total-araucaria" ? (
          <AcaiTotalAraucariaPage />
        ) : slug === "jkl-marcenaria" ? (
          <JklMarcenariaPage />
        ) : slug === "santos-montador-de-moveis" ? (
          <SantosMontadorDeMoveisPage />
        ) : (
          <PrototypeSite vertical={vertical} />
        )}
      </Suspense>
    </PortfolioStandardShell>
  );
}
