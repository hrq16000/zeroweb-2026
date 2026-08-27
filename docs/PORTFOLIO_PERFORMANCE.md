# Performance padrão dos projetos `/portfolio/:slug`

Status: **obrigatório**. Complementa `docs/PORTFOLIO_GLOBAL_STANDARDS.md` e
`docs/PORTFOLIO_NEW_CLIENT_PLAYBOOK.md`.

Todo projeto novo já nasce com estas otimizações — nada aqui deve ser refeito
manualmente por cliente.

## 1. Imagens

Use sempre `PortfolioImage` (`src/components/portfolio/PortfolioImage.tsx`) no
lugar de `<img>` cru:

```tsx
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";

// Imagem principal (LCP): no máximo UMA por página
<PortfolioImage src="/images/<slug>/capa.webp" alt="..." priority width={1200} height={800} />

// Demais imagens: lazy + decoding assíncrono automáticos
<PortfolioImage
  src="/images/<slug>/servico.webp"
  alt="..."
  widths={[480, 960, 1440]}          // só se as variantes existirem de fato
  sizes="(min-width: 1024px) 480px, 100vw"
  width={960}
  height={640}
/>
```

Regras:

- `loading` e `decoding` sempre explícitos (o componente cuida disso).
- No máximo **uma** imagem `priority`/`eager` por projeto.
- `width`/`height` (ou proporção via CSS) sempre presentes para evitar CLS.
- Prefira `.webp`/`.avif`; guarde tudo em `public/images/<slug>/`.
- `srcset` só quando as variantes `nome-480.webp`, `nome-960.webp` existirem.

## 2. Code splitting e lazy mount

Seções pesadas (galerias, mapas, carrosséis, blocos animados) devem ser
carregadas sob demanda com `React.lazy` + `LazySection`:

```tsx
import { lazy } from "react";
import { LazySection } from "@/components/portfolio/LazySection";

const Galeria = lazy(() => import("./GaleriaCliente"));

<LazySection minHeight={320} fallback={<div className="h-80 animate-pulse rounded-2xl bg-muted" />}>
  <Galeria />
</LazySection>;
```

`LazySection` usa IntersectionObserver com `rootMargin` de antecipação e
reserva altura mínima (sem layout shift). Sem JS ele renderiza o fallback,
então nunca coloque conteúdo indexável crítico dentro dele.

Bibliotecas grandes (`motion/react`, players, mapas) só podem ser importadas
dentro de módulos carregados por `lazy()` — nunca no topo do componente raiz do
cliente.

## 3. Renderização

- Memoize listas e handlers passados a componentes filhos (`useMemo`/`useCallback`).
- Telemetria e persistência de CTA ficam fora do caminho crítico do clique
  (`requestIdleCallback`), como já ocorre no funil.
- Evite estado global que rerrenderize a página inteira em scroll/mouse move.

## 4. Cache e CDN

Já configurado globalmente em `public/_headers`: assets versionados e
`.webp`/`.avif` com cache imutável de 1 ano, imagens rasterizadas com 30 dias e
HTML sempre revalidado. Regras equivalentes no Cloudflare estão em
`docs/runbook-cdn-gbp.md`. Não sobrescreva por cliente.

## 5. Portões automáticos

```bash
bun run validate:portfolio-performance   # roda no prebuild
bun run test:visual
bun run audit:a11y
bunx lhci autorun --config=.lighthouserc.cjs
```

O validador falha quando: uma `<img>` crua não declara `loading`/`decoding`, ou
quando há mais de uma imagem marcada como LCP no mesmo projeto.

## 6. Como medir e corrigir regressões

1. Lighthouse (mobile, throttling padrão) na rota do cliente; alvo: LCP < 2,5 s,
   CLS < 0,1, TBT < 200 ms.
2. Aba Network: nenhum asset acima de ~300 KB sem justificativa; conferir se as
   imagens fora da dobra só baixam ao rolar.
3. Aba Coverage: JS não usado acima de 40 % indica seção que deveria estar em
   `LazySection`.
4. Regressão confirmada → mover a seção para `lazy()`, converter imagem para
   `.webp` e reexecutar os portões acima antes do PR.
