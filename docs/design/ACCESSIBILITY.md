# Acessibilidade

Meta: WCAG 2.2 AA onde aplicável. Acessibilidade é requisito funcional, não
acabamento.

## Obrigatório

- HTML semântico (`header`, `nav`, `main`, `section`, `footer`), um `h1` por
  rota, hierarquia de headings sem saltos.
- Navegação completa por teclado; foco visível (`focus-visible:ring`), ordem
  lógica, sem armadilhas fora de diálogos.
- Diálogos/popups: focus trap, ESC, `role="dialog"`/`aria-modal`, título
  associado, retorno de foco ao gatilho.
- Formulários: `label` associado, mensagens de erro programaticamente ligadas,
  erro identificado em texto (não só cor).
- Contraste: texto ≥ 4.5:1; elementos de interface e foco ≥ 3:1.
- Imagens com `alt` significativo; decorativas com `alt=""`.
- Alvos de toque ≥ 44×44px com espaçamento.
- Zoom até 200% sem perda de conteúdo; sem overflow horizontal.
- `prefers-reduced-motion` respeitado.

## Revisão

Usar `.design-rules/references/hig/accessibility.md` como camada adicional de
crítica. Classificar achados em CRITICAL / HIGH / MEDIUM / LOW e corrigir
CRITICAL e HIGH antes de concluir a tarefa.
