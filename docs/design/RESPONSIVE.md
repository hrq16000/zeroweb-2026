# Responsividade

Mobile-first. Media query existir não significa página responsiva.

## Viewports de validação

360 (small mobile) · 393 (mobile) · 430 (large mobile) · 768 (tablet) ·
1024 (notebook) · 1440 (desktop) · 1920 (large desktop).

## Checklist

- Sem overflow horizontal em nenhum viewport.
- Medida de leitura confortável; corpo ≥ 16px no mobile.
- Imagens com proporção responsiva (`aspect-[16/10]`, `aspect-[4/3]`) e
  `object-position` adequado — não altura fixa com `object-cover` cortando
  rostos ou o topo do assunto.
- CTA principal alcançável sem scroll infinito e nunca coberto por elementos
  flutuantes ou popups.
- Navegação, modais, drawers, tabelas e cards utilizáveis no toque.
- Considerar teclado virtual e safe areas quando houver campos fixos.
- Popups do portfolio não bloqueiam a leitura no mobile.
