import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getCompanyBySlug, createReview } from "@/lib/marketplace.functions";
import { ORIGIN } from "@/lib/seo";

export const Route = createFileRoute("/empresa/$slug")({
  // SSR: o perfil já vem no HTML, com título e descrição do próprio negócio.
  loader: async ({ params }) => getCompanyBySlug({ data: { slug: params.slug } }),
  head: ({ params, loaderData }) => {
    const url = `${ORIGIN}/empresa/${params.slug}`;
    const c: any = loaderData?.company;
    if (!c) {
      return {
        meta: [
          { title: "Empresa não encontrada | Marketplace 0WEB" },
          { name: "robots", content: "noindex, follow" },
          { property: "og:url", content: url },
        ],
        links: [{ rel: "canonical", href: url }],
      };
    }
    const place = [c.city, c.state].filter(Boolean).join(" — ");
    const title = `${c.trade_name}${place ? ` — ${place}` : ""} | Marketplace 0WEB`;
    const description =
      (c.description ? String(c.description).replace(/\s+/g, " ").slice(0, 155) : "") ||
      `${c.trade_name}${place ? ` em ${place}` : ""}: categorias atendidas, regiões de atuação e avaliações no marketplace 0WEB.`;
    const reviews = loaderData?.reviews ?? [];

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "profile" },
        { property: "og:url", content: url },
        { property: "og:locale", content: "pt_BR" },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        ...(c.logo_url && /^https?:\/\//.test(c.logo_url)
          ? [
              { property: "og:image", content: c.logo_url },
              { name: "twitter:image", content: c.logo_url },
              { name: "twitter:card", content: "summary_large_image" },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": `${url}#business`,
            name: c.trade_name,
            description,
            url,
            ...(c.logo_url ? { image: c.logo_url } : {}),
            ...(c.website ? { sameAs: [c.website] } : {}),
            address: {
              "@type": "PostalAddress",
              ...(c.city ? { addressLocality: c.city } : {}),
              ...(c.state ? { addressRegion: c.state } : {}),
              addressCountry: "BR",
            },
            ...(reviews.length > 0 && Number(c.rating_count) > 0
              ? {
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: Number(c.rating_avg).toFixed(1),
                    reviewCount: Number(c.rating_count),
                  },
                }
              : {}),
          }),
        },
      ],
    };
  },
  component: CompanyPage,
});

function CompanyPage() {
  const data = Route.useLoaderData();
  const submitReview = useServerFn(createReview);
  const [review, setReview] = useState({ rating: 5, comment: "", author_name: "", author_email: "" });
  const [sent, setSent] = useState(false);

  if (!data.company) return <div className="p-12 text-center"><h1 className="text-2xl font-display">Empresa não encontrada</h1><Link to="/servicos/marketplace" className="text-primary mt-4 inline-block">Voltar ao marketplace</Link></div>;

  const c: any = data.company;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-5 py-10">
        <Link to="/servicos/marketplace" className="text-sm text-muted-foreground hover:text-foreground">← Marketplace</Link>
        <header className="flex flex-col md:flex-row gap-6 mt-6 pb-8 border-b border-border">
          {c.logo_url ? <img src={c.logo_url} alt={c.trade_name} className="w-32 h-32 rounded-xl object-cover" /> : <div className="w-32 h-32 rounded-xl bg-muted" />}
          <div className="flex-1">
            <h1 className="text-3xl font-display font-bold">{c.trade_name} {c.verified && <span className="text-primary text-base">✓ Verificada</span>}</h1>
            {c.legal_name && <p className="text-sm text-muted-foreground mt-1">{c.legal_name} {c.cnpj && `· CNPJ ${c.cnpj}`}</p>}
            <p className="text-sm text-muted-foreground mt-2">{[c.city, c.state].filter(Boolean).join(", ")}</p>
            <div className="text-sm mt-2">★ {Number(c.rating_avg).toFixed(1)} ({c.rating_count} avaliações)</div>
            <div className="flex gap-3 mt-4 flex-wrap">
              {c.website && <a href={c.website} target="_blank" rel="noopener" className="px-4 py-2 rounded-lg border border-border text-sm">Site</a>}
            </div>
          </div>
        </header>

        {c.description && <section className="py-8"><h2 className="font-display text-xl mb-2">Sobre</h2><p className="text-muted-foreground whitespace-pre-line">{c.description}</p></section>}

        {c.categories?.length > 0 && (
          <section className="py-4">
            <h2 className="font-display text-xl mb-3">Categorias</h2>
            <div className="flex flex-wrap gap-2">{c.categories.map((s: string) => <Link key={s} to="/categoria/$slug" params={{ slug: s }} className="px-3 py-1 rounded-full bg-muted text-sm hover:bg-primary/10">{s}</Link>)}</div>
          </section>
        )}

        {c.service_regions?.length > 0 && (
          <section className="py-4">
            <h2 className="font-display text-xl mb-3">Áreas atendidas</h2>
            <div className="flex flex-wrap gap-2">{c.service_regions.map((s: string) => <span key={s} className="px-3 py-1 rounded-full bg-muted text-sm">{s}</span>)}</div>
          </section>
        )}

        <section className="py-8 border-t border-border">
          <h2 className="font-display text-xl mb-4">Avaliações</h2>
          {data.reviews?.length === 0 && <p className="text-muted-foreground text-sm mb-6">Ainda sem avaliações aprovadas.</p>}
          <div className="space-y-4 mb-8">
            {data.reviews?.map((r: any) => (
              <div key={r.id} className="rounded-lg border border-border p-4">
                <div className="flex justify-between text-sm"><strong>{r.author_name}</strong><span className="text-muted-foreground">★ {r.rating}</span></div>
                {r.comment && <p className="text-sm mt-2">{r.comment}</p>}
              </div>
            ))}
          </div>
          {sent ? (
            <div className="rounded-lg bg-primary/10 text-primary p-4 text-sm">Obrigado! Sua avaliação está em moderação.</div>
          ) : (
            <form className="rounded-xl border border-border p-5 space-y-3" onSubmit={async (e) => {
              e.preventDefault();
              await submitReview({ data: { ...review, target_type: "company", target_id: c.id, author_email: review.author_email || undefined, comment: review.comment || undefined } });
              setSent(true);
            }}>
              <h3 className="font-medium">Deixe sua avaliação</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <input required minLength={2} maxLength={100} placeholder="Seu nome" className="px-3 py-2 rounded-lg border border-border bg-card" value={review.author_name} onChange={(e) => setReview({ ...review, author_name: e.target.value })} />
                <input type="email" maxLength={255} placeholder="E-mail (opcional)" className="px-3 py-2 rounded-lg border border-border bg-card" value={review.author_email} onChange={(e) => setReview({ ...review, author_email: e.target.value })} />
              </div>
              <select className="px-3 py-2 rounded-lg border border-border bg-card" value={review.rating} onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{"★".repeat(n)} {n}</option>)}
              </select>
              <textarea maxLength={1000} placeholder="Comentário" rows={3} className="w-full px-3 py-2 rounded-lg border border-border bg-card" value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} />
              <button className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-medium">Enviar avaliação</button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
