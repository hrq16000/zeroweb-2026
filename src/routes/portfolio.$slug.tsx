import { lazy, Suspense } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { PrototypeSite, VERTICALS } from "./sites.$vertical";
import { absUrl } from "@/lib/seo";
import { findPortfolioPrototype } from "@/lib/portfolio-site-registry";
import { breadcrumbNode, graph, organizationNode, serviceNode } from "@/lib/portfolio-seo";
import { MARIDO_ALUGUEL_FAQ } from "@/components/site/marido-de-aluguel-faq";
import { PortfolioStandardShell } from "@/components/portfolio/PortfolioStandardShell";
import { resolvePortfolioAssets } from "@/lib/portfolio-assets";

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
  import("@/components/site/RjServicosDrywallPage").then((m) => ({ default: m.RjServicosDrywallPage })),
);
const ConfeitariaChyrleyPage = lazy(() =>
  import("@/components/site/ConfeitariaChyrleyPage").then((m) => ({ default: m.ConfeitariaChyrleyPage })),
);
const MpFestasEventosPage = lazy(() =>
  import("@/components/site/MpFestasEventosPage").then((m) => ({ default: m.MpFestasEventosPage })),
);
const StudioDeCiliosPage = lazy(() =>
  import("@/components/site/StudioDeCiliosPage").then((m) => ({ default: m.StudioDeCiliosPage })),
);
const RefrigeracaoMaresiaPage = lazy(() =>
  import("@/components/site/RefrigeracaoMaresiaPage").then((m) => ({ default: m.RefrigeracaoMaresiaPage })),
);
const AgElectricalServicesPage = lazy(() =>
  import("@/components/site/AgElectricalServicesPage").then((m) => ({ default: m.AgElectricalServicesPage })),
);
const VilaDaCapivaraPage = lazy(() =>
  import("@/components/site/VilaDaCapivaraPage").then((m) => ({ default: m.VilaDaCapivaraPage })),
);
const LkAlvenariaPage = lazy(() =>
  import("@/components/site/LkAlvenariaPage").then((m) => ({ default: m.LkAlvenariaPage })),
);
const LucasArrumaMaquinaLavarPage = lazy(() =>
  import("@/components/site/LucasArrumaMaquinaLavarPage").then((m) => ({ default: m.LucasArrumaMaquinaLavarPage })),
);
const PauloMestreDeObrasPage = lazy(() =>
  import("@/components/site/PauloMestreDeObrasPage").then((m) => ({ default: m.PauloMestreDeObrasPage })),
);
const EcommerceOnPage = lazy(() =>
  import("@/components/site/EcommerceOnPage").then((m) => ({ default: m.EcommerceOnPage })),
);
const NoBrilhoHigienizacaoPage = lazy(() =>
  import("@/components/site/NoBrilhoHigienizacaoPage").then((m) => ({ default: m.NoBrilhoHigienizacaoPage })),
);
const SalaoDaMarciaPage = lazy(() =>
  import("@/components/site/SalaoDaMarciaPage").then((m) => ({ default: m.SalaoDaMarciaPage })),
);
const EspacoCihLuhPage = lazy(() =>
  import("@/components/site/EspacoCihLuhPage").then((m) => ({ default: m.EspacoCihLuhPage })),
);
const DiegoMontadorMoveisPage = lazy(() =>
  import("@/components/site/DiegoMontadorMoveisPage").then((m) => ({ default: m.DiegoMontadorMoveisPage })),
);
const AguiaSulSinalizacaoPage = lazy(() =>
  import("@/components/site/AguiaSulSinalizacaoPage").then((m) => ({ default: m.AguiaSulSinalizacaoPage })),
);
const EletrovaleEletromecanicaPage = lazy(() =>
  import("@/components/site/EletrovaleEletromecanicaPage").then((m) => ({ default: m.EletrovaleEletromecanicaPage })),
);
const EletroSolucoesEficazesPage = lazy(() =>
  import("@/components/site/EletroSolucoesEficazesPage").then((m) => ({ default: m.EletroSolucoesEficazesPage })),
);
const EisenferTubosAcosPage = lazy(() =>
  import("@/components/site/EisenferTubosAcosPage").then((m) => ({ default: m.EisenferTubosAcosPage })),
);
const MaryDiaristaPage = lazy(() =>
  import("@/components/site/MaryDiaristaPage").then((m) => ({ default: m.MaryDiaristaPage })),
);
const AcaiTotalAraucariaPage = lazy(() =>
  import("@/components/site/AcaiTotalAraucariaPage").then((m) => ({ default: m.AcaiTotalAraucariaPage })),
);
const JklMarcenariaPage = lazy(() =>
  import("@/components/site/JklMarcenariaPage").then((m) => ({ default: m.JklMarcenariaPage })),
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
    const title = prototype?.siteName ?? loaderData?.vertical?.name ?? "Demonstração de site";
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
    const description = isRjDrywall
      ? "Instalação, manutenção e reparos em drywall em Curitiba e Região Metropolitana. Paredes, forros, sancas, nichos e acabamento fino."
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
          : (loaderData?.vertical?.subheadline ?? "Demonstração de site criado pela 0WEB.");
    const url = absUrl(`/portfolio/${loaderData?.slug ?? ""}`);
    const assetConfig = loaderData?.slug ? resolvePortfolioAssets(loaderData.slug) : undefined;
    const socialImage = absUrl(
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
                : "/images/mestre-dos-servicos-logo.jpg",
    );
    const icon = absUrl(assetConfig?.icon ?? (loaderData?.slug === "rm-fretes" ? "/images/rm-fretes/anuncio-oficial.png" : socialImage));
    const vertical = loaderData?.vertical;
    const isMarido = loaderData?.slug === "marido-de-aluguel";
    return {
      meta: [
        { title: `${title} · Portfólio 0WEB` },
        { name: "description", content: description },
        { name: "robots", content: "index,follow,max-image-preview:large" },
        {
          name: "keywords",
          content: isRjDrywall
            ? "drywall Curitiba, instalação de drywall, parede de drywall, forro de gesso, sanca, reparo drywall, gesso acartonado"
            : isMarido
            ? "marido de aluguel, marido de aluguel Curitiba, reparos residenciais, manutenção residencial"
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
              : (vertical?.keywords ?? "site profissional, criação de sites, SEO local"),
        },
        { property: "og:title", content: `${title} · Portfólio 0WEB` },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: title },
        { property: "og:image", content: socialImage },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "icon", href: icon },
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
                  name: `${title} · Portfólio 0WEB`,
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
        {slug === "marido-de-aluguel" ? (
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
        ) : (
          <PrototypeSite vertical={vertical} />
        )}
      </Suspense>
    </PortfolioStandardShell>
  );
}
