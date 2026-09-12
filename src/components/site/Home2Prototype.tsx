import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Brush,
  Megaphone,
  MonitorSmartphone,
  Palette,
  Printer,
  Shirt,
  Sparkles,
} from "lucide-react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioCover } from "@/components/portfolio/PortfolioCover";
import { Footer } from "@/components/site/Footer";
import logoAsset from "@/assets/logo-0web.png.asset.json";
import portfolioCatalog from "@/config/portfolio-catalog.json";
import "./home2-wcria.css";

type CatalogItem = {
  slug: string;
  clientKey?: string;
  title: string;
  segment?: string;
  status?: string;
  live?: boolean;
  image?: string;
  fallbackImage?: string;
};

const publishedProjects = (portfolioCatalog as CatalogItem[]).filter(
  (item) => item.status === "published" && item.live !== false && Boolean(item.slug),
);

const featuredProjects = publishedProjects.slice(0, 6);
const showcaseProjects = featuredProjects.slice(0, 3);
const montageProjects = featuredProjects.slice(0, 4);

const services = [
  {
    icon: Palette,
    title: "Design & identidade de marca",
    description:
      "Identidade visual, direção criativa e aplicações para uma marca reconhecível em todos os pontos de contato.",
    to: "/servicos",
  },
  {
    icon: MonitorSmartphone,
    title: "Sites & landing pages",
    description:
      "Experiências digitais pensadas para explicar valor, gerar confiança e conduzir o visitante até a ação.",
    to: "/servicos/site-express",
  },
  {
    icon: Printer,
    title: "Design gráfico, impressos & papelaria",
    description:
      "Materiais de comunicação para unir presença digital e física sem quebrar a identidade da marca.",
    to: "/servicos",
  },
  {
    icon: Brush,
    title: "Mídias sociais & gestão",
    description:
      "Linha visual, conteúdo e organização de presença para manter consistência e reconhecimento ao longo do tempo.",
    to: "/servicos",
  },
  {
    icon: Megaphone,
    title: "Marketing digital & campanhas de Ads",
    description:
      "Campanhas conectadas à página certa, com estrutura de aquisição, mensuração e conversão.",
    to: "/servicos/trafego-pago",
  },
  {
    icon: Shirt,
    title: "Uniformes & materiais personalizados",
    description:
      "Aplicação da marca em peças físicas, materiais promocionais e itens que prolongam a experiência fora da tela.",
    to: "/servicos",
  },
] as const;

const principles = [
  {
    title: "Sem template perceptível",
    description:
      "A estrutura nasce do negócio, do público, do conteúdo e do objetivo. Identidade não entra só no final para trocar cor e logo.",
  },
  {
    title: "Forma com função",
    description:
      "Motion, profundidade, tipografia e composição precisam ajudar a entender, navegar e agir — não apenas decorar a tela.",
  },
  {
    title: "Do zero ao digital",
    description:
      "Marca, página, aquisição e conversão podem trabalhar como uma única experiência, sem virar um amontoado de serviços desconectados.",
  },
  {
    title: "Projeto vivo",
    description:
      "Cada entrega pode evoluir com conteúdo, SEO, campanhas, mensuração e novas necessidades sem perder a direção visual original.",
  },
] as const;

const editorialLinks = [
  {
    label: "Sites",
    title: "O que uma página precisa resolver antes de pensar em efeitos",
    to: "/blog/sites",
  },
  {
    label: "SEO",
    title: "Estrutura, conteúdo e descoberta trabalhando juntos",
    to: "/blog/seo",
  },
  {
    label: "Aquisição",
    title: "Quando tráfego pago precisa conversar com a landing page",
    to: "/blog/trafego-pago",
  },
] as const;

const heroMotion = ["home2-enter-1", "home2-enter-2", "home2-enter-3", "home2-enter-4"] as const;

function Home2Header() {
  return (
    <header className="home2-header">
      <div className="home2-header-inner">
        <Link
          to="/$service"
          params={{ service: "home2" }}
          aria-label="0WEB Home2"
          className="inline-flex items-center"
        >
          <img src={logoAsset.url} alt="0WEB" width={920} height={250} className="home2-logo" />
        </Link>

        <nav className="home2-nav" aria-label="Navegação da Home2">
          <Link to="/servicos">Soluções</Link>
          <Link to="/portfolio">Portfólio</Link>
          <Link to="/blog">Conteúdo</Link>
          <Link to="/contato" className="home2-nav-cta">
            Fale conosco <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Home2Prototype() {
  const loopedClientNames = [...featuredProjects, ...featuredProjects];

  return (
    <div className="home2-page">
      <Home2Header />

      <main>
        <section className="home2-hero" aria-labelledby="home2-title">
          <div className="home2-orbit home2-orbit-a" aria-hidden="true" />
          <div className="home2-orbit home2-orbit-b" aria-hidden="true" />
          <div className="home2-orbit home2-orbit-c" aria-hidden="true" />

          <div className="home2-hero-content">
            <p className={`home2-kicker ${heroMotion[0]}`}>
              <Sparkles size={14} aria-hidden="true" /> 0WEB · do zero ao digital
            </p>

            <h1 id="home2-title" className={heroMotion[1]}>
              Soluções <strong>criativas e estratégicas</strong>
              <span className="home2-emphasis">para fazer sua marca avançar.</span>
            </h1>

            <p className={`home2-hero-subtitle ${heroMotion[2]}`}>
              Design, sites, presença digital, campanhas e materiais físicos organizados para construir uma marca mais clara, útil e preparada para converter.
            </p>

            <div className={`home2-proofline ${heroMotion[2]}`}>
              <span className="home2-proofdot" aria-hidden="true" />
              <span>{publishedProjects.length} projetos publicados no catálogo atual da 0WEB</span>
            </div>

            <div className={`home2-hero-actions ${heroMotion[3]}`}>
              <Link to="/servicos" className="home2-btn-secondary">
                Nossas soluções <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <FunnelCTAButton
                intent={{ purpose: "commercial", source: "home2_hero", pagePath: "/home2", placement: "hero" }}
                label="Começar um projeto"
                location="home2_hero"
                showArrow={false}
                className="home2-btn-primary"
              />
            </div>
          </div>
        </section>

        <div className="home2-slogan-strip" aria-label="Posicionamento 0WEB">
          <strong>Criamos. Recriamos. Atualizamos. Conectamos o físico ao digital.</strong>
        </div>

        <section className="home2-strategy" aria-labelledby="home2-strategy-title">
          <div className="home2-shell home2-strategy-grid">
            <div className="home2-device-stage home2-reveal" aria-label="Seleção visual de projetos 0WEB">
              {montageProjects[0] && (
                <div className="home2-device-card home2-device-card-a">
                  <PortfolioCover
                    clientKey={montageProjects[0].clientKey}
                    slug={montageProjects[0].slug}
                    title={montageProjects[0].title}
                    image={montageProjects[0].image}
                    fallbackImage={montageProjects[0].fallbackImage}
                    className="h-full w-full object-cover"
                    sizes="(max-width: 720px) 42vw, 220px"
                  />
                </div>
              )}

              {montageProjects[1] && (
                <div className="home2-device-card home2-device-card-b">
                  <PortfolioCover
                    clientKey={montageProjects[1].clientKey}
                    slug={montageProjects[1].slug}
                    title={montageProjects[1].title}
                    image={montageProjects[1].image}
                    fallbackImage={montageProjects[1].fallbackImage}
                    className="h-full w-full object-cover"
                    sizes="(max-width: 720px) 42vw, 220px"
                  />
                </div>
              )}

              {montageProjects[2] && (
                <div className="home2-device-card home2-device-card-c">
                  <PortfolioCover
                    clientKey={montageProjects[2].clientKey}
                    slug={montageProjects[2].slug}
                    title={montageProjects[2].title}
                    image={montageProjects[2].image}
                    fallbackImage={montageProjects[2].fallbackImage}
                    className="h-full w-full object-cover"
                    sizes="(max-width: 720px) 36vw, 180px"
                  />
                </div>
              )}

              {montageProjects[3] && (
                <div className="home2-device-phone">
                  <PortfolioCover
                    clientKey={montageProjects[3].clientKey}
                    slug={montageProjects[3].slug}
                    title={montageProjects[3].title}
                    image={montageProjects[3].image}
                    fallbackImage={montageProjects[3].fallbackImage}
                    className="h-full w-full object-cover"
                    sizes="(max-width: 720px) 38vw, 190px"
                    priority
                  />
                </div>
              )}
            </div>

            <div className="home2-strategy-copy home2-reveal">
              <p className="home2-eyebrow">Estratégia visual + tecnologia</p>
              <h2 id="home2-strategy-title">
                Design é mais do que estética. <strong>É direção.</strong>
              </h2>
              <p>
                Uma empresa pode ter um ótimo serviço e ainda assim parecer comum. A 0WEB trabalha a apresentação, a experiência e o caminho de conversão para transformar presença em percepção de valor — sem encaixar todos os clientes no mesmo molde.
              </p>
              <Link to="/sobre" className="home2-inline-link">
                Conheça a 0WEB <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="home2-solutions-intro" aria-labelledby="home2-solutions-title">
          <div className="home2-solutions-heading home2-reveal">
            <p className="home2-eyebrow">Soluções</p>
            <h2 id="home2-solutions-title">
              <strong>Amamos</strong> construir o que a sua marca precisa.
            </h2>
            <p>
              Do primeiro conceito à campanha que leva pessoas para a página certa: cada disciplina entra onde faz sentido para o projeto.
            </p>
          </div>
        </section>

        <section className="home2-services" aria-label="Serviços da 0WEB">
          <div className="home2-shell home2-service-grid">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article key={service.title} className="home2-service-card home2-reveal">
                  <div>
                    <div className="home2-service-icon" aria-hidden="true">
                      <Icon size={27} strokeWidth={1.8} />
                    </div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                  <Link to={service.to} className="home2-service-link">
                    + Acessar <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className="home2-experience" aria-labelledby="home2-experience-title">
          <div className="home2-shell home2-experience-grid">
            <div className="home2-experience-copy home2-reveal">
              <p className="home2-eyebrow" style={{ color: "var(--h2-cyan)" }}>Experiência que se transforma em presença</p>
              <h2 id="home2-experience-title">
                Não vendemos páginas iguais. <strong>Construímos sistemas de presença.</strong>
              </h2>
              <p>
                O catálogo atual mostra negócios de segmentos diferentes, com conteúdo, identidade, funil e composição próprios. A tecnologia é compartilhável; a experiência do cliente não precisa parecer compartilhada.
              </p>
            </div>

            <div className="home2-proof-grid home2-reveal" aria-label="Pilares verificáveis da entrega 0WEB">
              <div className="home2-proof-card">
                <strong>{publishedProjects.length}</strong>
                <span>projetos publicados no catálogo atual</span>
              </div>
              <div className="home2-proof-card">
                <strong>SEO</strong>
                <span>estrutura, rotas e descoberta integradas</span>
              </div>
              <div className="home2-proof-card">
                <strong>Funil</strong>
                <span>cada projeto conduz para uma ação compatível</span>
              </div>
              <div className="home2-proof-card">
                <strong>Mobile</strong>
                <span>experiência responsiva como requisito, não extra</span>
              </div>
            </div>
          </div>
        </section>

        <div className="home2-client-strip" aria-label="Projetos publicados">
          <div className="home2-client-track">
            {loopedClientNames.map((item, index) => (
              <span key={`${item.slug}-${index}`} className="home2-client-name">
                {item.title}
              </span>
            ))}
          </div>
        </div>

        <section className="home2-projects" aria-labelledby="home2-projects-title">
          <div className="home2-projects-heading home2-reveal">
            <p className="home2-eyebrow">Projetos entregues</p>
            <h2 id="home2-projects-title">
              Uma seleção de projetos <strong>que você pode abrir agora.</strong>
            </h2>
            <p>Projetos reais publicados no ecossistema 0WEB.</p>
          </div>

          <div className="home2-project-gallery">
            {showcaseProjects.map((project) => (
              <Link
                key={project.slug}
                to="/portfolio/$slug"
                params={{ slug: project.slug }}
                className="home2-project-tile"
                aria-label={`Abrir projeto ${project.title}`}
              >
                <PortfolioCover
                  clientKey={project.clientKey}
                  slug={project.slug}
                  title={project.title}
                  image={project.image}
                  fallbackImage={project.fallbackImage}
                  className="h-full w-full object-cover"
                  width={900}
                  height={760}
                  sizes="(max-width: 720px) 100vw, (max-width: 980px) 50vw, 33vw"
                />
                <span className="home2-project-label">
                  <span>{project.title}</span>
                  <span><ArrowUpRight size={18} aria-hidden="true" /></span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="home2-anti-template" aria-labelledby="home2-anti-template-title">
          <div className="home2-shell home2-anti-grid">
            <div className="home2-reveal">
              <p className="home2-eyebrow">Originalidade como regra</p>
              <h2 id="home2-anti-template-title" className="home2-anti-title">
                Cada projeto precisa <strong>parecer de quem ele é.</strong>
              </h2>
            </div>

            <div className="home2-principles">
              {principles.map((principle) => (
                <article key={principle.title} className="home2-principle home2-reveal">
                  <strong>{principle.title}</strong>
                  <p>{principle.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="home2-editorial" aria-labelledby="home2-editorial-title">
          <div className="home2-editorial-heading home2-reveal">
            <p className="home2-eyebrow" style={{ color: "var(--h2-cyan)" }}>Conteúdo 0WEB</p>
            <h2 id="home2-editorial-title">
              Ideias para decidir melhor <strong>antes de investir.</strong>
            </h2>
            <p>Conteúdo ligado às decisões que impactam presença, descoberta e conversão.</p>
          </div>

          <div className="home2-editorial-row">
            {editorialLinks.map((article) => (
              <Link key={article.title} to={article.to} className="home2-editorial-card home2-reveal">
                <small>{article.label}</small>
                <strong>{article.title}</strong>
                <span>Ler conteúdo <ArrowRight size={15} aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="home2-final-cta" aria-label="Começar projeto com a 0WEB">
          <div className="home2-shell home2-final-grid">
            <h2 className="home2-reveal">
              Sua empresa não precisa de mais um template. <strong>Precisa de direção.</strong>
            </h2>

            <div className="home2-final-action home2-reveal">
              <FunnelCTAButton
                intent={{ purpose: "commercial", source: "home2_final", pagePath: "/home2", placement: "footer" }}
                label="Solicitar orçamento"
                location="home2_final"
                showArrow={false}
                className="home2-btn-primary"
              />
              <Link to="/portfolio" className="home2-btn-secondary">
                Ver portfólio <Boxes size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
