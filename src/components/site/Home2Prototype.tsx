import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Brush,
  Menu,
  Megaphone,
  MonitorSmartphone,
  Palette,
  Printer,
  Shirt,
  Sparkles,
  X,
} from "lucide-react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioCover } from "@/components/portfolio/PortfolioCover";
import logoAsset from "@/assets/logo-0web.png.asset.json";
import portfolioCatalog from "@/config/portfolio-catalog.json";
import { initHome2Motion } from "./home2-motion";
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

const featuredProjects = publishedProjects.slice(0, 8);
const showcaseProjects = featuredProjects.slice(0, 3);
const montageProjects = featuredProjects.slice(0, 4);
const proofProjects = featuredProjects.slice(0, 5);

const services = [
  {
    icon: Palette,
    title: "Design de marca",
    description:
      "Identidade visual, direção criativa e aplicações para uma marca reconhecível em todos os pontos de contato.",
    to: "/servicos",
  },
  {
    icon: MonitorSmartphone,
    title: "Sites e landing pages",
    description:
      "Experiências digitais autorais, rápidas e pensadas para explicar valor e conduzir o visitante até a ação.",
    to: "/servicos/site-express",
  },
  {
    icon: Printer,
    title: "Design gráfico e web",
    description:
      "Artes, materiais de campanha, comunicação visual e peças digitais com linguagem consistente.",
    to: "/servicos",
  },
  {
    icon: Printer,
    title: "Impressos e papelaria",
    description:
      "Materiais físicos, papelaria personalizada e aplicações que mantêm a marca coerente fora da tela.",
    to: "/servicos",
  },
  {
    icon: Brush,
    title: "Mídias sociais",
    description:
      "Linha visual, conteúdo e organização da presença social para construir reconhecimento e continuidade.",
    to: "/servicos",
  },
  {
    icon: Megaphone,
    title: "Marketing digital e Ads",
    description:
      "Campanhas conectadas à página certa, com aquisição, mensuração e conversão trabalhando juntas.",
    to: "/servicos/trafego-pago",
  },
] as const;

const principles = [
  {
    title: "Estrutura própria",
    description:
      "A página nasce do negócio, do conteúdo e da jornada. Não de um template que recebe uma nova cor.",
  },
  {
    title: "Motion com função",
    description:
      "Movimento conduz o olhar, cria profundidade e explica hierarquia sem disputar atenção com a mensagem.",
  },
  {
    title: "Do físico ao digital",
    description:
      "Marca, site, campanhas, impressos e materiais personalizados podem funcionar como uma única presença.",
  },
] as const;

const editorialLinks = [
  {
    label: "Sites",
    title: "O que uma página precisa resolver antes de pensar em efeitos",
    to: "/blog/sites",
    tone: "blue",
  },
  {
    label: "SEO",
    title: "Estrutura, conteúdo e descoberta trabalhando juntos",
    to: "/blog/seo",
    tone: "cyan",
  },
  {
    label: "Aquisição",
    title: "Quando tráfego pago precisa conversar com a landing page",
    to: "/blog/trafego-pago",
    tone: "violet",
  },
] as const;

function Home2Header({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (value: boolean) => void }) {
  return (
    <header className="home2-header">
      <div className="home2-header-inner">
        <Link
          to="/$service"
          params={{ service: "home2" }}
          aria-label="0WEB Home2"
          className="home2-brand"
          onClick={() => setMenuOpen(false)}
        >
          <img src={logoAsset.url} alt="0WEB" width={920} height={250} className="home2-logo" />
        </Link>

        <nav className="home2-nav" aria-label="Navegação da Home2">
          <a href="#sobre">Sobre</a>
          <a href="#solucoes">Soluções</a>
          <a href="#projetos">Portfólio</a>
          <a href="#conteudo">Conteúdo</a>
          <Link to="/contato" className="home2-nav-cta">
            Fale conosco <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </nav>

        <button
          type="button"
          className="home2-menu-toggle"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>

      <div className={`home2-mobile-nav ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <a href="#sobre" onClick={() => setMenuOpen(false)}>Sobre</a>
        <a href="#solucoes" onClick={() => setMenuOpen(false)}>Soluções</a>
        <a href="#projetos" onClick={() => setMenuOpen(false)}>Portfólio</a>
        <a href="#conteudo" onClick={() => setMenuOpen(false)}>Conteúdo</a>
        <Link to="/contato" onClick={() => setMenuOpen(false)}>Fale conosco</Link>
      </div>
    </header>
  );
}

export function Home2Prototype() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const loopedClientNames = [...featuredProjects, ...featuredProjects];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    return initHome2Motion(root);
  }, []);

  return (
    <div className="home2-page" ref={rootRef}>
      <Home2Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main>
        <section className="home2-hero" aria-labelledby="home2-title">
          <div className="home2-ribbon home2-ribbon-a" data-home2-parallax="14" aria-hidden="true" />
          <div className="home2-ribbon home2-ribbon-b" data-home2-parallax="22" aria-hidden="true" />
          <div className="home2-ribbon home2-ribbon-c" data-home2-parallax="-18" aria-hidden="true" />
          <div className="home2-ribbon-glow" aria-hidden="true" />

          <div className="home2-hero-content">
            <p className="home2-kicker" data-home2-load>
              <Sparkles size={14} aria-hidden="true" /> 0WEB · do zero ao digital
            </p>

            <h1 id="home2-title" data-home2-load>
              Soluções <strong>criativas e estratégicas</strong> para sua empresa
            </h1>

            <p className="home2-hero-subtitle" data-home2-load>
              Design, tecnologia e marketing conectados para transformar presença em percepção de valor, descoberta e conversão.
            </p>

            <div className="home2-proofline" data-home2-load>
              <span className="home2-proof-copy">
                <strong>Projetos publicados</strong>
                <span>no catálogo atual da 0WEB</span>
              </span>
              <span className="home2-proof-avatars" aria-hidden="true">
                {proofProjects.map((project) => (
                  <span className="home2-proof-avatar" key={project.slug}>
                    <PortfolioCover
                      clientKey={project.clientKey}
                      slug={project.slug}
                      title={project.title}
                      image={project.image}
                      fallbackImage={project.fallbackImage}
                      className="h-full w-full object-cover"
                      width={80}
                      height={80}
                      sizes="36px"
                    />
                  </span>
                ))}
              </span>
            </div>

            <div className="home2-hero-actions" data-home2-load>
              <a href="#sobre" className="home2-btn-secondary">
                Saiba mais <ArrowRight size={15} aria-hidden="true" />
              </a>
              <a href="#solucoes" className="home2-btn-primary">
                Nossas soluções <ArrowRight size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <div className="home2-slogan-strip" aria-label="Posicionamento 0WEB">
          <strong>Criamos. Recriamos. Atualizamos.</strong>
        </div>

        <section id="sobre" className="home2-strategy" aria-labelledby="home2-strategy-title">
          <div className="home2-shell home2-strategy-grid">
            <div className="home2-device-stage" data-home2-motion="media" aria-label="Seleção visual de projetos 0WEB">
              {montageProjects[0] && (
                <div className="home2-device-card home2-device-card-a" data-home2-parallax="10">
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
                <div className="home2-device-card home2-device-card-b" data-home2-parallax="-8">
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
                <div className="home2-device-card home2-device-card-c" data-home2-parallax="6">
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
                <div className="home2-device-phone" data-home2-parallax="-12">
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

            <div className="home2-strategy-copy" data-home2-motion="copy">
              <h2 id="home2-strategy-title">
                Design é mais do que estética. <strong>É estratégia.</strong>
              </h2>
              <p>
                Não basta ter um bom produto ou serviço. Para conquistar espaço, a empresa precisa transmitir confiança, se diferenciar e conduzir a próxima ação com clareza. A 0WEB une direção visual, tecnologia e conversão para transformar presença em oportunidade.
              </p>
              <Link to="/sobre" className="home2-inline-link">
                Saiba mais sobre a 0WEB <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section id="solucoes" className="home2-solutions-intro" aria-labelledby="home2-solutions-title">
          <div className="home2-solutions-heading" data-home2-motion="heading">
            <p className="home2-eyebrow">Soluções</p>
            <h2 id="home2-solutions-title">
              <strong>Amamos</strong> o que fazemos
            </h2>
            <p>
              Experiências criativas construídas com estratégia, propósito e tecnologia — do primeiro conceito à presença completa da marca.
            </p>
          </div>
        </section>

        <section className="home2-services" aria-label="Serviços da 0WEB">
          <div className="home2-shell home2-service-grid">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article key={service.title} className="home2-service-card">
                  <div className="home2-service-icon" aria-hidden="true">
                    <Icon size={30} strokeWidth={1.7} />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <Link to={service.to} className="home2-service-link">
                    + Acessar <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className="home2-experience" aria-labelledby="home2-experience-title">
          <div className="home2-shell home2-experience-grid">
            <div className="home2-experience-copy">
              <h2 id="home2-experience-title">
                <strong>Experiência</strong> que se transforma em presença
              </h2>
              <p>
                A tecnologia pode ser compartilhada. A experiência percebida não precisa ser. Cada projeto precisa sustentar sua própria marca, mensagem, ritmo e forma de converter.
              </p>
            </div>

            <div className="home2-proof-grid" aria-label="Pilares verificáveis da entrega 0WEB">
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
                <span>ação compatível com cada projeto</span>
              </div>
              <div className="home2-proof-card">
                <strong>Mobile</strong>
                <span>responsividade tratada como requisito</span>
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

        <section id="projetos" className="home2-projects" aria-labelledby="home2-projects-title">
          <div className="home2-projects-heading" data-home2-motion="heading">
            <h2 id="home2-projects-title"><strong>Projetos</strong> entregues</h2>
            <p>Uma seleção de trabalhos publicados no portfólio 0WEB.</p>
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
                  sizes="(max-width: 720px) 100vw, 33vw"
                />
                <span className="home2-project-overlay" aria-hidden="true" />
                <span className="home2-project-label">
                  <span>{project.title}</span>
                  <ArrowUpRight size={20} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="home2-principles-section" aria-labelledby="home2-principles-title">
          <div className="home2-shell home2-principles-layout">
            <div data-home2-motion="heading">
              <h2 id="home2-principles-title">Projetos com <strong>identidade própria.</strong></h2>
              <p>O que precisa permanecer igual é a qualidade. A forma de chegar lá não.</p>
            </div>

            <div className="home2-principles">
              {principles.map((principle) => (
                <article key={principle.title} className="home2-principle">
                  <span className="home2-principle-mark">✦</span>
                  <p>{principle.description}</p>
                  <strong>{principle.title}</strong>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="conteudo" className="home2-editorial" aria-labelledby="home2-editorial-title">
          <div className="home2-editorial-top">
            <h2 id="home2-editorial-title">Conteúdo <strong>0WEB</strong></h2>
            <p>Ideias sobre presença digital, descoberta e conversão.</p>
          </div>

          <div className="home2-editorial-row">
            {editorialLinks.map((article) => (
              <Link
                key={article.title}
                to={article.to}
                className={`home2-editorial-card home2-editorial-${article.tone}`}
              >
                <span className="home2-editorial-art" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <small>{article.label}</small>
                <strong>{article.title}</strong>
                <span className="home2-editorial-link">Ler conteúdo <ArrowRight size={15} aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="home2-newsletter-band" aria-labelledby="home2-newsletter-title">
          <div className="home2-shell home2-newsletter-grid">
            <div data-home2-motion="heading">
              <h2 id="home2-newsletter-title">Do zero ao digital.</h2>
              <p>Explore serviços, projetos e conteúdos para decidir o próximo passo da sua presença.</p>
            </div>
            <div className="home2-newsletter-actions">
              <Link to="/blog" className="home2-btn-secondary">Explorar conteúdo</Link>
              <FunnelCTAButton
                intent={{ purpose: "commercial", source: "home2_final", pagePath: "/home2", placement: "footer" }}
                label="Solicitar orçamento"
                location="home2_final"
                showArrow={false}
                className="home2-btn-primary"
              />
            </div>
          </div>
        </section>

        <section className="home2-final-cta" aria-label="Começar projeto com a 0WEB">
          <div className="home2-shell home2-final-grid">
            <p>0WEB</p>
            <h2>
              Sua empresa não precisa de mais um template. <strong>Precisa de direção.</strong>
            </h2>
            <Link to="/portfolio" className="home2-final-link">
              Ver portfólio <Boxes size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="home2-footer">
        <div className="home2-shell home2-footer-grid">
          <div className="home2-footer-brand">
            <img src={logoAsset.url} alt="0WEB" width={920} height={250} />
            <span>do zero ao digital</span>
          </div>
          <nav aria-label="Rodapé Home2">
            <Link to="/">Inicial</Link>
            <Link to="/sobre">Sobre</Link>
            <Link to="/servicos">Soluções</Link>
            <Link to="/portfolio">Portfólio</Link>
            <Link to="/blog">Conteúdo</Link>
            <Link to="/contato">Fale conosco</Link>
          </nav>
          <a href="https://instagram.com/0webbr" rel="noreferrer" target="_blank" className="home2-social">@0webbr</a>
        </div>
      </footer>
    </div>
  );
}
