# Adoção seletiva de TasteSkill, Transitions.dev, React Bits e RiseClub — 0WEB

Data: 2026-11-17. Status: DIRETRIZ; não significa instalação ou release.

## Objetivo e precedência

Absorver princípios úteis para os projetos independentes da 0WEB sem importar a aparência, a propriedade intelectual ou o funil de terceiros. Este documento é subordinado a `AGENTS.md`, `docs/0WEB_EXECUTION_CONTRACT.md`, `docs/PORTFOLIO_REFERENCE_COMPOSITION_GOVERNANCE_STANDARD.md`, `docs/EXPERIENCE_DESIGN_MAX_STANDARD.md` e às skills locais obrigatórias.

| Origem | Classificação | Uso permitido | Não fazer |
| --- | --- | --- | --- |
| https://www.tasteskill.dev/ | ADAPTAR | Crítica de tipografia, ritmo visual, composição exclusiva, hierarquia e revisão em navegador | Executar instaladores externos sem revisão ou impor o mesmo layout a clientes |
| https://transitions.dev/ | ADAPTAR | Tokens CSS e microinterações selecionadas para estados reais, com reduced-motion | Substituir o motion system existente em massa, criar animação em tudo, presumir licença Pro |
| https://reactbits.dev/ | USO CONDICIONAL | Componentes isolados gratuitos quando resolvam uma tarefa real de UI; revisar licença MIT + Commons Clause e transitivas | Instalar biblioteca inteira, incluir recursos Pro não licenciados, causar hidratação ruim ou carregar JS pesado no LCP |
| https://riseclub.tech/ | REFERÊNCIA CONCEITUAL | Ideias de navegação por trilhas, comunidade, aprendizagem e notícias com curadoria autoral | Reproduzir marca, interface, curso, textos, notícias, imagens, base de membros ou mecanismos proprietários |

## Por superfície

- Institucional 0WEB: aplicar ao sistema de identidade institucional sem alterar logo, fontes, Header, Footer ou manifests congelados.
- Cada `/portfolio/:slug`: primeiro brief e provas da entidade; gramática de referência classificada USE / ADAPT / REJECT; composição, mídia, CTA e motion próprios, nunca aparência compartilhada.
- Admin e formulários: priorizar densidade legível, feedback de estado, foco, teclado, erros, carregamento e touch targets; efeitos apenas se aumentarem clareza.
- Conteúdo e comunidade: editoria original, fonte rastreável e navegação por assunto; não simular números de membros ou prova social.
- Projeto sem React: React Bits é NÃO APLICÁVEL; estudar só princípios de UX.

## Gate de adoção por micro-PR

1. Declarar pergunta do usuário e benefício mensurável; selecionar a menor capacidade útil.
2. Registrar origem, licença, custo, dependências, peso estimado, riscos de SSR/hidratação e fallback sem JavaScript.
3. Reusar primitives locais; preferir CSS e API nativa a novas libs.
4. Respeitar `prefers-reduced-motion`: retirar deslocamento, nunca esconder conteúdo. Garantir foco visível, Escape, contraste e alvos de toque.
5. Examinar 390/768/1440, LCP/CLS e semântica/SEO da área alterada; rodar somente os gates aplicáveis existentes, sem afrouxar thresholds.
6. Registrar no PR o que foi USE, ADAPT, REJECT ou NOT_APPLICABLE e motivo; CI verde antes de merge. Release controlada e separada do commit de pesquisa.

## Resultado desta rodada

DOCUMENTADO: critérios e roteamento acima. NÃO INSTALADO: pacotes, skills executáveis, CLI, API paga ou conteúdo de terceiros. NÃO PUBLICADO: mudança visual de runtime.
