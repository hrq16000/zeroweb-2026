import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { absUrl } from "@/lib/seo";

const TITLE = "Design System 0WEB · Tokens, componentes e guidelines";
const DESC =
  "Referência viva do design system da 0WEB: tokens semânticos de cor, tipografia, espaçamento, componentes reutilizáveis e regras de uso.";
const URL = absUrl("/design-system");

export const Route = createFileRoute("/design-system")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "noindex,follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: DesignSystemPage,
});

const COLOR_TOKENS = [
  ["background / foreground", "bg-background text-foreground"],
  ["card / card-foreground", "bg-card text-card-foreground"],
  ["primary / primary-foreground", "bg-primary text-primary-foreground"],
  ["secondary / secondary-foreground", "bg-secondary text-secondary-foreground"],
  ["muted / muted-foreground", "bg-muted text-muted-foreground"],
  ["accent / accent-foreground", "bg-accent text-accent-foreground"],
  ["destructive / destructive-foreground", "bg-destructive text-destructive-foreground"],
];

const SPACING = ["py-4", "py-8", "py-12", "py-16", "py-24"];

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border py-12">
      <h2 className="font-display text-xl font-bold md:text-2xl">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function DesignSystemPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Documentação interna</p>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight md:text-5xl">Design System 0WEB</h1>
        <p className="mt-4 max-w-[65ch] text-muted-foreground">
          Fonte de verdade dos tokens: <code className="rounded bg-muted px-1">src/styles.css</code>. Esta página
          documenta o uso; valores nunca são duplicados em componentes. Cor sempre por token semântico — nada de
          <code className="mx-1 rounded bg-muted px-1">text-white</code>,
          <code className="mx-1 rounded bg-muted px-1">bg-black</code> ou hex arbitrário.
        </p>

        <Section id="cor" title="Cor">
          <div className="grid gap-3 sm:grid-cols-2">
            {COLOR_TOKENS.map(([label, className]) => (
              <div key={label} className={`rounded-lg border border-border p-4 ${className}`}>
                <p className="text-sm font-semibold">{label}</p>
                <p className="mt-1 text-xs opacity-80">{className}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="tipografia" title="Tipografia">
          <div className="space-y-3">
            <p className="font-display text-4xl font-bold">Display · Space Grotesk (--font-display)</p>
            <p className="text-base">Corpo · Inter (--font-sans), medida de 60–75ch, mínimo 16px no mobile.</p>
            <p className="text-sm text-muted-foreground">Apoio · text-sm text-muted-foreground</p>
            <p className="text-xs uppercase tracking-widest text-primary">Caption / eyebrow</p>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Um <code className="rounded bg-muted px-1">h1</code> por rota; níveis de heading nunca pulam.
          </p>
        </Section>

        <Section id="espacamento" title="Espaçamento e raio">
          <div className="space-y-2">
            {SPACING.map((cls) => (
              <div key={cls} className="rounded-md bg-muted/50 px-3 text-xs text-muted-foreground">
                <div className={cls}>{cls}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {["rounded-md", "rounded-lg", "rounded-2xl", "rounded-full"].map((r) => (
              <div key={r} className={`border border-border bg-card px-4 py-3 text-sm ${r}`}>
                {r}
              </div>
            ))}
          </div>
        </Section>

        <Section id="componentes" title="Componentes">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Button</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button>Primário</Button>
                <Button variant="secondary">Secundário</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destrutivo</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Badge e Input</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge>Padrão</Badge>
                  <Badge variant="secondary">Secundário</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
                <Input aria-label="Exemplo de campo" placeholder="Campo com label acessível" />
              </CardContent>
            </Card>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Variantes via <code className="rounded bg-muted px-1">cva</code> (<code>variant</code> + <code>size</code>),
            nunca por acúmulo de booleanos. Estados obrigatórios: hover, focus-visible, active, disabled, loading.
          </p>
        </Section>

        <Section id="guidelines" title="Guidelines de uso">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Toda tela tem uma única ação primária, visualmente dominante.</li>
            <li>• Alvo de toque mínimo 44×44px; foco sempre visível.</li>
            <li>• Contraste de texto ≥ 4,5:1 e de UI ≥ 3:1.</li>
            <li>• Animar apenas transform/opacity e respeitar prefers-reduced-motion.</li>
            <li>• Em /portfolio/&lt;slug&gt; a identidade do cliente é soberana: nada de Header, Footer, paleta ou copy da 0WEB.</li>
            <li>• Nenhum contato operacional (wa.me, telefone, e-mail) no bundle público.</li>
            <li>• Sem métricas, depoimentos ou selos sem fonte auditável.</li>
          </ul>
        </Section>

        <Section id="portoes" title="Portões antes de publicar">
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 text-xs">
{`bun test
bun run validate:portfolio-boundaries
bun run validate:portfolio-meta
bun run validate:portfolio-scaffold
bun run test:e2e:portfolio-popup
bun run audit:a11y
bun run test:visual
bun run build`}
          </pre>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
