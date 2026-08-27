import { useMemo, useState } from "react";
import { ArrowRight, Check, Minus, Plus, ShoppingBag, Truck, Utensils, X } from "lucide-react";
import { FunnelModalWrapper } from "@/components/funnel/FunnelModalWrapper";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const products = [
  {
    id: "classico",
    category: "Hot dogs",
    name: "Hot dog clássico",
    desc: "2 salsichas, maionese, mostarda, ketchup, milho, batata palha e queijo",
    price: 16,
  },
  {
    id: "mineiro",
    category: "Hot dogs",
    name: "Hot dog mineiro",
    desc: "2 salsichas, bacon, maionese, mostarda, ketchup, cheddar ou catupiry, milho, tomate e batata palha",
    price: 20,
  },
  {
    id: "calabresa",
    category: "Hot dogs",
    name: "Hot dog calabresa",
    desc: "2 salsichas, calabresa, maionese, mostarda, ketchup, cheddar ou catupiry, milho, tomate e batata palha",
    price: 20,
  },
  {
    id: "frango",
    category: "Hot dogs",
    name: "Hot dog frango",
    desc: "2 salsichas, frango, maionese, mostarda, ketchup, cheddar ou catupiry, milho, tomate e batata palha",
    price: 20,
  },
  {
    id: "casa",
    category: "Hot dogs",
    name: "Hot dog da casa",
    desc: "2 salsichas, frango, bacon, calabresa, maionese, ketchup, cheddar ou catupiry, milho, tomate, batata palha",
    price: 26,
  },
  ...[
    "Carne",
    "Carne com queijo",
    "Queijo",
    "Frango",
    "Frango com catupiry",
    "Pizza",
    "Vina",
    "Chocolate preto",
  ].map((name, i) => ({
    id: `pastel-${i}`,
    category: "Pastéis",
    name: `Pastel de ${name.toLowerCase()}`,
    desc: "Pastel preparado na hora, massa crocante e recheio caprichado",
    price: i === 7 ? 15 : 14,
  })),
  {
    id: "batata",
    category: "Porções",
    name: "Batata frita 300g",
    desc: "Porção crocante de batata frita",
    price: 16,
  },
  {
    id: "batata-cheddar-bacon",
    category: "Porções",
    name: "Batata frita com bacon e cheddar 300g",
    desc: "Batata frita coberta com bacon e cheddar",
    price: 18,
  },
  { id: "agua", category: "Bebidas", name: "Água", desc: "Água mineral", price: 4 },
  {
    id: "refri-lata",
    category: "Bebidas",
    name: "Refrigerante lata",
    desc: "Coca-Cola, Fanta, Guaraná ou Sprite",
    price: 6,
  },
  {
    id: "refri-600",
    category: "Bebidas",
    name: "Refrigerante 600ml",
    desc: "Coca-Cola, Fanta, Guaraná ou Sprite",
    price: 9,
  },
  {
    id: "refri-2l",
    category: "Bebidas",
    name: "Refrigerante 2 litros",
    desc: "Coca-Cola, Fanta, Guaraná ou Sprite",
    price: 15,
  },
  ...[
    { name: "Combo Mineiro", price: 24 },
    { name: "Combo da Casa", price: 29 },
    { name: "Combo Casal", price: 42 },
    { name: "Combo Família", price: 72 },
    { name: "Combo Premium", price: 75 },
  ].map((c, i) => ({
    id: `combo-${i}`,
    category: "Combos",
    name: c.name,
    desc: "Hot dogs, acompanhamento e refrigerante conforme o combo",
    price: c.price,
  })),
];
const extras = [
  "Sem cebola",
  "Sem milho",
  "Adicionar cheddar",
  "Adicionar bacon",
  "Adicionar catupiry",
];
const categories = ["Todos", ...Array.from(new Set(products.map((p) => p.category)))];
const productsWithImages = products.map((product) => ({
  ...product,
  image:
    product.category === "Hot dogs" || product.category === "Combos"
      ? "/images/paraiso-hot-dog-cover.png"
      : "/images/paraiso-hot-dog-menu.png",
}));

export function ParaisoHotDogPage() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [custom, setCustom] = useState<Record<string, string[]>>({});
  const [delivery, setDelivery] = useState<"retirada" | "entrega">("retirada");
  const [note, setNote] = useState("");
  const [funnelOpen, setFunnelOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState("Todos");
  const total = useMemo(
    () => productsWithImages.reduce((sum, p) => sum + (cart[p.id] ?? 0) * p.price, 0),
    [cart],
  );
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const visibleProducts =
    category === "Todos"
      ? productsWithImages
      : productsWithImages.filter((p) => p.category === category);
  const toggleExtra = (id: string, extra: string) =>
    setCustom((v) => ({
      ...v,
      [id]: (v[id] ?? []).includes(extra)
        ? (v[id] ?? []).filter((x) => x !== extra)
        : [...(v[id] ?? []), extra],
    }));
  return (
    <main className="portfolio-theme-paraiso min-h-screen bg-[#fff8e8] text-[#24170d]">
      <section className="relative overflow-hidden bg-[#17130f] px-5 py-12 text-white sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_.8fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.22em] text-[#f5bd21]">
              São José dos Pinhais · aberto das 18h30 às 23h
            </p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[.95] tracking-tight sm:text-7xl">
              Seu hot dog caprichado começa aqui.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#ffe9a5]">
              Monte do seu jeito, escolha retirar ou receber em casa e envie o pedido pronto pelo
              WhatsApp.
            </p>
            <a
              href="#cardapio"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#f5bd21] px-6 py-3.5 font-bold text-black transition hover:-translate-y-1"
            >
              Montar meu pedido <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="group mx-auto block w-full max-w-md text-left"
            aria-label="Abrir cardápio completo em tela cheia"
          >
            <img
              src="/images/paraiso-hot-dog-menu.png"
              alt="Cardápio real do Paraíso do Hot Dog — toque para ampliar"
              className="mx-auto max-h-[520px] w-full rounded-3xl border-4 border-[#f5bd21] object-cover shadow-2xl transition group-hover:scale-[1.01]"
            />
            <span className="mt-3 block text-center text-xs font-bold text-[#ffe9a5]">
              Toque para ampliar o cardápio completo
            </span>
          </button>
        </div>
      </section>
      <section
        id="cardapio"
        className="mx-auto grid max-w-6xl gap-8 px-5 py-14 lg:grid-cols-[1.2fr_.8fr]"
      >
        <div>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-[#b46b00]">
                Cardápio online completo
              </p>
              <h2 className="mt-2 text-4xl font-black">Escolha seus favoritos</h2>
            </div>
            <span className="hidden items-center gap-2 text-sm font-semibold text-[#b46b00] sm:flex">
              <Utensils className="h-4 w-4" /> feito na hora
            </span>
          </div>
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${category === item ? "bg-[#17130f] text-white" : "bg-white text-[#765c42] ring-1 ring-[#eed9a7]"}`}
              >
                {item}
                {item !== "Todos" && (
                  <span className="ml-1 opacity-60">
                    ({products.filter((p) => p.category === item).length})
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {visibleProducts.map((p) => (
              <article
                key={p.id}
                className="overflow-hidden rounded-3xl border border-[#eed9a7] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={p.image}
                  alt={`${p.name} do Paraíso do Hot Dog`}
                  className="h-36 w-full object-cover"
                  loading="lazy"
                />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#b46b00]">
                        {p.category}
                      </p>
                      <h3 className="text-xl font-bold">{p.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#765c42]">{p.desc}</p>
                    </div>
                    <span className="whitespace-nowrap text-lg font-black text-[#b46b00]">
                      R$ {p.price},00
                    </span>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        aria-label={`Diminuir ${p.name}`}
                        onClick={() =>
                          setCart((v) => ({ ...v, [p.id]: Math.max(0, (v[p.id] ?? 0) - 1) }))
                        }
                        className="grid h-10 w-10 place-items-center rounded-full border border-[#e4c981] hover:bg-[#fff2c6]"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-6 text-center font-bold">{cart[p.id] ?? 0}</span>
                      <button
                        aria-label={`Adicionar ${p.name}`}
                        onClick={() => setCart((v) => ({ ...v, [p.id]: (v[p.id] ?? 0) + 1 }))}
                        className="grid h-10 w-10 place-items-center rounded-full bg-[#f5bd21] text-black hover:bg-[#ffd34f]"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    {(cart[p.id] ?? 0) > 0 && (
                      <div className="flex flex-wrap justify-end gap-1">
                        {extras.slice(0, 3).map((e) => (
                          <button
                            key={e}
                            onClick={() => toggleExtra(p.id, e)}
                            className={`rounded-full px-2 py-1 text-[10px] font-semibold ${custom[p.id]?.includes(e) ? "bg-[#17130f] text-white" : "bg-[#fff2c6] text-[#765c42]"}`}
                          >
                            {custom[p.id]?.includes(e) && <Check className="mr-1 inline h-3 w-3" />}
                            {e}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <aside className="h-fit rounded-3xl bg-[#17130f] p-6 text-white shadow-xl lg:sticky lg:top-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black">Seu pedido</h2>
            <ShoppingBag className="h-6 w-6 text-[#f5bd21]" />
          </div>
          {count === 0 ? (
            <p className="py-12 text-center text-sm text-[#c9b99e]">
              Seu carrinho está vazio.
              <br />
              Escolha um item para começar.
            </p>
          ) : (
            <div className="mt-6 space-y-3">
              {products
                .filter((p) => cart[p.id])
                .map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between gap-3 border-b border-white/10 pb-3 text-sm"
                  >
                    <span>
                      {cart[p.id]}× {p.name}
                    </span>
                    <strong>R$ {(cart[p.id] * p.price).toFixed(2).replace(".", ",")}</strong>
                  </div>
                ))}
              <div className="pt-2 text-right text-2xl font-black text-[#f5bd21]">
                R$ {total.toFixed(2).replace(".", ",")}
              </div>
            </div>
          )}
          <div className="mt-6 grid grid-cols-2 gap-2">
            <button
              onClick={() => setDelivery("retirada")}
              className={`rounded-2xl border p-3 text-left text-xs ${delivery === "retirada" ? "border-[#f5bd21] bg-[#f5bd21]/15" : "border-white/15"}`}
            >
              <Utensils className="mb-2 h-4 w-4 text-[#f5bd21]" />
              Vou retirar
            </button>
            <button
              onClick={() => setDelivery("entrega")}
              className={`rounded-2xl border p-3 text-left text-xs ${delivery === "entrega" ? "border-[#f5bd21] bg-[#f5bd21]/15" : "border-white/15"}`}
            >
              <Truck className="mb-2 h-4 w-4 text-[#f5bd21]" />
              Quero entrega
            </button>
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Observação do pedido (opcional)"
            className="mt-4 min-h-20 w-full resize-none rounded-2xl border border-white/15 bg-white/5 p-3 text-sm text-white placeholder:text-[#c9b99e] outline-none focus:border-[#f5bd21]"
          />
          <button
            disabled={!count}
            onClick={() => setFunnelOpen(true)}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#f5bd21] px-5 py-3.5 font-black text-black transition hover:bg-[#ffd34f] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continuar pedido <ArrowRight className="h-4 w-4" />
          </button>
          <p className="mt-3 text-center text-xs text-[#c9b99e]">
            Av. Rui Barbosa · São José dos Pinhais
          </p>
        </aside>
      </section>
      <section className="bg-[#f5bd21] px-5 py-12 text-center">
        <p className="text-sm font-bold uppercase tracking-[.2em]">
          Boa noite! O Paraíso já está atendendo.
        </p>
        <h2 className="mt-3 text-3xl font-black">Quentinho, saboroso e caprichado.</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm">
          Hot dog, pastel, porções e bebidas para matar a fome de verdade.
        </p>
      </section>
      <footer className="bg-[#17130f] px-5 py-8 text-center text-sm text-[#c9b99e]">
        Paraíso do Hot Dog · Av. Rui Barbosa · São José dos Pinhais, PR
      </footer>
      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Cardápio ampliado"
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-3 sm:p-8"
        >
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white text-black shadow-xl"
            aria-label="Fechar cardápio ampliado"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src="/images/paraiso-hot-dog-menu.png"
            alt="Cardápio completo do Paraíso do Hot Dog"
            className="max-h-[94vh] max-w-full rounded-xl object-contain shadow-2xl"
          />
        </div>
      )}
      <FunnelModalWrapper
        open={funnelOpen}
        onClose={() => setFunnelOpen(false)}
        funnelSlug="funnel-order-support"
        intent={{
          purpose: "order-support",
          source: "portfolio-paraiso-do-hot-dog",
          pagePath: "/portfolio/paraiso-do-hot-dog",
          placement: "section",
          companySlug: "paraiso-do-hot-dog",
        }}
        context={{
          order_total: String(total),
          order_items: products
            .filter((p) => cart[p.id])
            .map(
              (p) =>
                `${cart[p.id]}x ${p.name}${custom[p.id]?.length ? ` (${custom[p.id].join(", ")})` : ""}`,
            )
            .join(", "),
          fulfillment: delivery,
          customer_note: note.slice(0, 280),
        }}
      />
      <PortfolioUpsellPopup pageName="portfolio-paraiso-do-hot-dog" />
    </main>
  );
}
