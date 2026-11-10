import { useState } from "react";

type Dish = "frango" | "costela";
const dishes = {
  frango: {
    label: "Supercombo de frango",
    caption: "Frango recheado com aipim, porção de maionese, batatas assadas e refrigerante de 2 litros.",
    price: "R$ 59,99",
    number: "01",
    note: "Composição e preço informados no panfleto; validade não confirmada.",
  },
  costela: {
    label: "Costela na brasa",
    caption: "Costela assada. O folheto anuncia porção de maionese grátis na compra de 1 kg.",
    price: "R$ 69,99",
    number: "02",
    note: "Preço, unidade/peso e condição promocional ainda precisam de confirmação.",
  },
} as const;

function FirePlateIllustration() {
  return (
    <svg aria-hidden="true" className="w-full max-w-[560px]" viewBox="0 0 620 470" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="310" cy="386" rx="257" ry="50" fill="#24150E" opacity=".23" />
      <ellipse cx="310" cy="311" rx="266" ry="103" fill="#6B3B23" stroke="#2A1811" strokeWidth="8" />
      <ellipse cx="310" cy="304" rx="241" ry="84" fill="#BA8051" stroke="#E3AF73" strokeWidth="6" />
      <ellipse cx="310" cy="301" rx="211" ry="65" fill="#F8D6A0" />
      <g transform="translate(110 132) rotate(-12 190 130)">
        <path d="M36 132C65 72 155 48 266 71C348 88 388 154 358 201C321 246 200 246 96 212C44 194 20 164 36 132Z" fill="#7D2C19" stroke="#3D160F" strokeWidth="13"/>
        <path d="M50 136C90 81 169 68 269 89C328 102 368 146 344 185C306 219 208 222 111 192C67 178 42 157 50 136Z" fill="#C85427"/>
        <path d="M60 135C113 96 184 91 270 104" stroke="#F6AA53" strokeWidth="18" strokeLinecap="round"/>
        <path d="M79 172C143 200 260 210 325 172" stroke="#EC8F3A" strokeWidth="16" strokeLinecap="round"/>
        <g stroke="#442015" strokeWidth="9" strokeLinecap="round">
          <path d="M95 101L70 174"/><path d="M142 87L114 191"/><path d="M190 83L170 203"/><path d="M244 95L230 207"/><path d="M285 112L289 199"/>
        </g>
        <path d="M118 125C160 117 222 125 255 141" stroke="#FAD18D" strokeWidth="9" strokeLinecap="round" opacity=".8"/>
      </g>
      <g fill="#6A7734"><ellipse cx="146" cy="330" rx="39" ry="12" transform="rotate(35 146 330)"/><ellipse cx="441" cy="349" rx="34" ry="9" transform="rotate(-34 441 349)"/></g>
      <g fill="#E5BA70" stroke="#9D6E33" strokeWidth="5"><ellipse cx="139" cy="256" rx="35" ry="25" transform="rotate(-20 139 256)"/><ellipse cx="474" cy="266" rx="34" ry="25" transform="rotate(15 474 266)"/><ellipse cx="433" cy="224" rx="32" ry="22" transform="rotate(-15 433 224)"/></g>
      <g stroke="#FFF0D4" strokeWidth="4" strokeLinecap="round" opacity=".85"><path d="M208 98C187 61 226 45 215 18"/><path d="M288 105C272 67 307 52 297 20"/><path d="M364 117C346 82 385 60 376 27"/></g>
      <g fill="#7C8A41"><path d="M291 245C313 216 344 219 356 206C344 237 322 241 291 245Z"/><path d="M304 247C326 258 347 252 367 263C341 271 319 260 304 247Z"/></g>
      <path d="M298 258L377 217" stroke="#516536" strokeWidth="5" strokeLinecap="round"/>
    </svg>
  );
}

export function ToopAssadosPreviewPage() {
  const [dish, setDish] = useState<Dish>("frango");
  const [quantity, setQuantity] = useState(1);
  const [showSummary, setShowSummary] = useState(false);
  const chosen = dishes[dish];

  function selectDish(next: Dish) {
    setDish(next);
    setShowSummary(false);
  }

  return (
    <div className="min-h-screen bg-[#F5EBDD] text-[#2E221B]" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{`
        .toop-headline { font-family: Georgia, 'Times New Roman', serif; letter-spacing: -.055em; }
        .toop-grain { background-image: radial-gradient(#683C2517 1px, transparent 1px); background-size: 11px 11px; }
        .toop-marquee { letter-spacing: .2em; }
        @media (prefers-reduced-motion: no-preference) {
          .toop-card { transition: transform 180ms ease, border-color 180ms ease; }
          .toop-card:hover { transform: translateY(-3px); }
        }
      `}</style>
      <div className="bg-[#302117] px-4 py-3 text-center text-xs font-semibold tracking-wide text-[#FFE5C2]" role="note">
        CONCEITO NÃO OFICIAL DA 0WEB · Prévia visual · Não recebe pedidos ou dados pessoais
      </div>

      <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-6 sm:px-8">
        <a href="#inicio" className="flex items-center gap-3 text-[#6D331F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
          <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-current text-lg font-black" aria-hidden="true">T</span>
          <span className="text-xl font-black tracking-[-.04em]">TOOP <span className="font-normal">ASSADOS</span></span>
        </a>
        <nav aria-label="Navegação da proposta" className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold">
          <a href="#assados" className="hover:underline">Assados</a>
          <a href="#simulacao" className="hover:underline">Como pedir</a>
          <a href="#localizacao" className="hover:underline">Localização</a>
        </nav>
      </header>

      <main id="inicio">
        <section className="toop-grain overflow-hidden border-y-2 border-[#6D331F]/20 bg-[#EACDA6]">
          <div className="mx-auto grid max-w-6xl items-center gap-6 px-5 pb-12 pt-11 sm:px-8 lg:grid-cols-[.92fr_1.08fr] lg:py-16">
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#7B4028] px-4 py-2 text-xs font-black uppercase tracking-[.14em]">
                <span className="h-2 w-2 rounded-full bg-[#A73D21]" /> Xaxim · Curitiba
              </div>
              <h1 className="toop-headline max-w-[580px] text-[clamp(3.6rem,7vw,7.3rem)] font-black leading-[.9]">
                Da brasa <em className="text-[#A54526]">para a sua</em> mesa.
              </h1>
              <p className="mt-7 max-w-lg text-lg leading-relaxed">
                Uma proposta de página para descobrir os assados, conferir os acompanhamentos e organizar sua intenção de encomenda.
              </p>
              <a href="#assados" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#342219] px-8 py-3 font-bold text-[#FFF4E3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
                Conhecer os assados <span aria-hidden="true" className="ml-3">↓</span>
              </a>
            </div>
            <div className="relative mx-auto w-full max-w-[630px]">
              <div className="relative aspect-[1.12] overflow-hidden rounded-[42%_42%_12%_12%] border-[10px] border-[#633421] bg-[radial-gradient(circle_at_65%_24%,#C86531_0%,#6A321D_42%,#2A1C17_95%)] shadow-[0_20px_60px_#4B281F55]">
                <FirePlateIllustration />
                <p className="absolute bottom-4 left-4 rounded-md bg-[#FFF3E1]/95 px-3 py-2 text-xs font-semibold text-[#533323]">
                  Ilustração conceitual · não é foto dos produtos
                </p>
              </div>
              <div className="absolute -right-2 top-5 grid h-20 w-20 rotate-12 place-items-center rounded-full bg-[#F7D77B] text-center text-xs font-black uppercase leading-tight text-[#523020] shadow-lg sm:h-28 sm:w-28 sm:text-sm">
                Especial
                <br />da brasa
              </div>
            </div>
          </div>
        </section>

        <section id="assados" className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="toop-marquee text-xs font-black uppercase text-[#A04D2F]">Cardápio em destaque</p>
              <h2 className="toop-headline mt-3 text-5xl font-bold leading-none sm:text-6xl">O que vai à mesa?</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[#665648]">
              Valores encontrados em um panfleto sem data. Não representam ofertas atuais confirmadas.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {(Object.entries(dishes) as [Dish, (typeof dishes)[Dish]][]).map(([id, item]) => (
              <article key={id} className={`toop-card flex flex-col justify-between rounded-[1.6rem] border-2 p-7 sm:p-9 ${dish === id ? "border-[#A54526] bg-[#FFF8ED]" : "border-[#D5BDA5] bg-[#EFE1CE]"}`}>
                <div>
                  <div className="mb-7 flex items-center justify-between">
                    <span className="text-sm font-bold tracking-[.16em] text-[#9A593B]">PRATO {item.number}</span>
                    <span className="rounded-full bg-[#48291B] px-4 py-1 text-xs font-bold text-[#FFF1D9]">FOLHETO</span>
                  </div>
                  <h3 className="toop-headline max-w-sm text-4xl font-bold leading-[1.02] sm:text-5xl">{item.label}</h3>
                  <p className="mt-5 min-h-20 text-base leading-relaxed">{item.caption}</p>
                  <p className="mt-5 text-xs leading-relaxed text-[#745E4D]">{item.note}</p>
                </div>
                <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-[#6D331F]/20 pt-6">
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-widest text-[#80644F]">Anunciado no folheto</span>
                    <strong className="toop-headline text-4xl font-bold text-[#9B4227]">{item.price}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => { selectDish(id); document.getElementById("simulacao")?.scrollIntoView({ behavior: "auto" }); }}
                    aria-label={`Simular interesse em ${item.label}`}
                    className="min-h-12 rounded-full bg-[#332018] px-6 py-3 text-sm font-bold text-[#FFF8ED] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    Simular escolha
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="simulacao" className="bg-[#302117] px-5 py-16 text-[#FFF1DB] sm:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <p className="toop-marquee text-xs font-bold uppercase text-[#F7BA75]">Experiência de encomenda</p>
              <h2 className="toop-headline mt-4 text-5xl font-bold leading-none sm:text-6xl">Escolha sem complicar.</h2>
              <p className="mt-6 max-w-lg leading-relaxed text-[#E0C6AA]">
                Na versão contratada, o visitante poderá informar o assado, quantidade e preferência de retirada. O estabelecimento confirmará preço, disponibilidade e horário.
              </p>
              <p className="mt-5 text-sm text-[#D8BBA0]">Esta simulação não solicita nome, telefone ou endereço, não armazena dados e não envia pedidos.</p>
            </div>
            <div className="rounded-[1.6rem] bg-[#F9EDDB] p-6 text-[#302117] sm:p-9">
              <h3 className="text-lg font-black">Simulador de escolha <span className="ml-2 text-xs font-normal text-[#775C48]">sem envio</span></h3>
              <fieldset className="mt-6">
                <legend className="mb-3 text-sm font-bold">Qual assado você escolheria?</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(Object.entries(dishes) as [Dish, (typeof dishes)[Dish]][]).map(([id, item]) => (
                    <label key={id} className={`flex min-h-16 cursor-pointer items-center gap-3 rounded-xl border-2 p-3 text-sm font-bold ${dish === id ? "border-[#A54526] bg-white" : "border-[#D4BEA8]"}`}>
                      <input type="radio" name="toop-dish" checked={dish === id} onChange={() => selectDish(id)} className="h-5 w-5 accent-[#A54526]" />
                      {item.label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <label htmlFor="toop-quantity" className="text-sm font-bold">Quantidade de itens</label>
                <select
                  id="toop-quantity"
                  value={quantity}
                  onChange={(event) => { setQuantity(Number(event.target.value)); setShowSummary(false); }}
                  className="min-h-12 rounded-xl border-2 border-[#B7987B] bg-white px-4 text-base"
                >
                  {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
              </div>
              <button type="button" onClick={() => setShowSummary(true)} className="mt-6 min-h-12 w-full rounded-full bg-[#9E452A] px-5 py-3 font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
                Visualizar resumo demonstrativo
              </button>
              {showSummary && (
                <div className="mt-5 rounded-2xl border-2 border-[#C5A686] bg-white p-5" role="status" aria-live="polite">
                  <p className="font-black">Sua seleção de exemplo</p>
                  <p className="mt-2">{quantity} × {chosen.label}</p>
                  <p className="mt-2 text-sm text-[#705742]">O valor anunciado no folheto não foi validado e não é aplicado nesta simulação.</p>
                  <p className="mt-3 text-sm font-bold">Nenhum pedido foi realizado.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="localizacao" className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-[1fr_.8fr] md:items-center">
          <div>
            <p className="toop-marquee text-xs font-black uppercase text-[#A04D2F]">Um negócio do Xaxim</p>
            <h2 className="toop-headline mt-3 text-5xl font-bold leading-none sm:text-6xl">Perto da sua mesa.</h2>
            <p className="mt-6 max-w-xl leading-relaxed">
              O panfleto indica atendimento na Rua Omar Raimundo Pichet, 1217, bairro Xaxim, Curitiba/PR. O endereço e sua grafia cadastral ainda precisam ser confirmados pelo estabelecimento.
            </p>
          </div>
          <aside className="rounded-[1.6rem] border-2 border-[#A77A58] bg-[#E8D0AC] p-7">
            <p className="text-xs font-black uppercase tracking-widest text-[#865036]">Antes de encomendar</p>
            <ul className="mt-5 space-y-4 text-sm leading-relaxed">
              <li>✓ Confirme o preço vigente e a composição do combo.</li>
              <li>✓ Consulte a disponibilidade e o horário de retirada.</li>
              <li>✓ Verifique se existe serviço de entrega.</li>
            </ul>
            <p className="mt-7 border-t border-[#A77A58] pt-5 text-xs text-[#664F40]">
              Prévia criada de forma independente pela 0WEB para apresentação comercial. Não é um canal oficial da Toop Assados.
            </p>
          </aside>
        </section>
      </main>
      <footer className="bg-[#261811] px-5 py-7 text-center text-xs leading-relaxed text-[#EACDA6]">
        Estudo de presença digital · 0WEB · Sem pedidos, pagamentos, avaliações ou atendimento operacional nesta prévia.
      </footer>
    </div>
  );
}
