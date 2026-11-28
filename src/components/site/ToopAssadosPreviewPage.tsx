import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";

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
  return (
    <main className="min-h-screen bg-[#211b18] text-[#fff6e8]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <a href="#inicio" className="text-sm font-black uppercase tracking-[0.28em] text-[#f5c27c]">TOOP ASSADOS</a>
        <nav className="hidden items-center gap-7 text-sm text-[#e6d6c4] sm:flex">
          <a href="#sobre" className="transition hover:text-[#f5c27c]">Sobre</a>
          <a href="#localizacao" className="transition hover:text-[#f5c27c]">Localização</a>
        </nav>
        <a href="#localizacao" className="rounded-full border border-[#f5c27c]/60 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#f5c27c] transition hover:bg-[#f5c27c] hover:text-[#211b18]">Ver informações</a>
      </header>

      <section id="inicio" className="relative isolate overflow-hidden border-y border-[#f5c27c]/15">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_30%,rgba(192,94,45,.24),transparent_38%),linear-gradient(120deg,#211b18,#30221b_55%,#1a1715)]" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 md:grid-cols-[1.05fr_.95fr] md:py-24">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.32em] text-[#f5c27c]">Apresentação estática · Xaxim, Curitiba</p>
            <h1 className="max-w-2xl text-5xl font-black leading-[.98] tracking-tight sm:text-6xl">Toop Assados</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#e6d6c4]">Uma página de apresentação baseada no material recebido. Cardápio, preços, horários e disponibilidade não estão confirmados nesta publicação.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#localizacao" className="rounded-full bg-[#f5c27c] px-6 py-3 text-sm font-black text-[#211b18] transition hover:-translate-y-0.5">Ver localização</a>
              <a href="#sobre" className="rounded-full border border-white/25 px-6 py-3 text-sm font-bold text-white transition hover:border-[#f5c27c] hover:text-[#f5c27c]">Sobre a apresentação</a>
            </div>
          </div>
          <figure className="mx-auto w-full max-w-[420px]">
            <div className="rounded-[2rem] border border-[#f5c27c]/20 bg-[#30221b]/80 p-5 shadow-2xl shadow-black/30">
              <FirePlateIllustration />
            </div>
            <figcaption className="mt-4 text-center text-xs leading-5 text-[#c9b7a4]">Ilustração editorial da 0WEB — não é fotografia do estabelecimento</figcaption>
          </figure>
        </div>
      </section>

      <section id="sobre" className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 md:grid-cols-2 md:py-20">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#f5c27c]">Sobre</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Uma presença digital clara, sem promessas não confirmadas</h2>
        </div>
        <div className="space-y-4 text-sm leading-7 text-[#e6d6c4]">
          <p>O nome Toop Assados e a referência à região do Xaxim foram preservados do material recebido. Não há fotografias reais do estabelecimento disponíveis nesta versão do repositório.</p>
          <p>Por isso, não exibimos imagens de terceiros, cardápio, preços, promoções ou simulação de pedidos.</p>
        </div>
      </section>

      <section id="localizacao" className="border-y border-[#f5c27c]/15 bg-[#2a211c]">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 md:grid-cols-[.8fr_1.2fr] md:py-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#f5c27c]">Localização</p>
            <h2 className="mt-4 text-3xl font-black">Referência informada no material</h2>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-[#211b18] p-6">
            <p className="text-lg font-semibold text-white">Rua Omar Raimundo Pichet, 1217 · Xaxim · Curitiba/PR</p>
            <p className="mt-3 text-sm leading-6 text-[#c9b7a4]">Endereço reproduzido do material recebido, ainda sem confirmação independente. Confirme a referência e o funcionamento antes de se deslocar.</p>
            <a href="https://www.google.com/maps/search/?api=1&query=Rua%20Omar%20Raimundo%20Pichet%2C%201217%2C%20Xaxim%2C%20Curitiba%2C%20PR" target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-full border border-[#f5c27c]/60 px-5 py-3 text-sm font-bold text-[#f5c27c] transition hover:bg-[#f5c27c] hover:text-[#211b18]">Pesquisar endereço no mapa</a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="rounded-[1.5rem] border border-[#f5c27c]/20 bg-[#30221b] p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#f5c27c]">Aviso importante</p>
          <h2 className="mt-3 text-2xl font-black">Esta página não recebe pedidos</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#e6d6c4]">Não há formulário, carrinho, envio de pedido ou confirmação de encomenda. Cardápio, valores, horários e canais de atendimento permanecem pendentes de confirmação comercial.</p>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-8 text-center text-xs text-[#a99682]">
        <p>Apresentação demonstrativa · Informações sujeitas a confirmação</p>
        <PortfolioHostCredit />
      </footer>
    </main>
  );
}

export function ToopAssadosLivePage() {
  return <ToopAssadosPreviewPage />;
}
