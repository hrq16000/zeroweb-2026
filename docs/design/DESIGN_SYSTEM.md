# Design System 0WEB

Fonte de verdade dos tokens: `src/styles.css`. Componentes base: shadcn/ui em
`src/components/ui`. Este documento descreve as regras; não duplica valores.

## Tokens

- **Cor:** apenas tokens semânticos (`background`, `foreground`, `surface`,
  `card`, `primary`, `secondary`, `accent`, `muted`, `destructive`, `border`,
  `input`, `ring`). Proibido `text-white`, `bg-black`, `bg-[#hex]`.
- **Tipografia:** `--font-display` (Space Grotesk) para títulos,
  `--font-sans` (Inter) para texto.
- **Raio:** derivados de `--radius`.
- **Sombra:** `--shadow-soft`, `--shadow-glow` — só com significado de elevação.
- **Temas de cliente:** cada `/portfolio/<slug>` sobrescreve tokens no seu
  próprio escopo; não altera os tokens globais.

## Hierarquia

Cada tela tem uma ação primária. Título > subtítulo > corpo > apoio. Contraste
de peso e tamanho, não de cor aleatória.

## Componentes

- Variantes via `cva` (`variant`, `size`), não via booleanos acumulados.
- Composição e compound components acima de props gigantes.
- Estados visuais completos: hover, focus-visible, active, disabled, loading.

## Grid e containers

Container central com padding responsivo; seções com ritmo vertical
consistente (`py-16 md:py-24`). Evitar grids de 3 cards como estrutura padrão.

## Anti-AI-slop

Ver `.agents/skills/0web-design-system/SKILL.md` → checklist. Uma interface só
está pronta quando é coerente, distintiva e melhora o objetivo de negócio.
