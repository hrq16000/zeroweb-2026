# 0WEB — Repertório ECSPT para novas landing pages /portfolio/:slug (aditivo)

Status: **REFERÊNCIA COMPLEMENTAR / NÃO CANÔNICA / OPT-IN**  
Origem: https://ecspt.com.br/ (consulta de conteúdo público em 2026-10-11)  
Escopo: pesquisa, creative brief e eventual implantação **unitária** em novos projetos `/portfolio/:slug`.  
Implementação desta rodada: **documentação e parâmetros inertes**; nenhum portfólio, funil, rota, template ou estilo existente é alterado.

## 0. Ordem de precedência e regra SOME

Esta referência não substitui nem enfraquece:
- `AGENTS.md`, `docs/0WEB_EXECUTION_CONTRACT.md` e `docs/0WEB_UNIVERSAL_ADDITIVE_GROWTH_CONSTITUTION.md`;
- `docs/PORTFOLIO_UNIQUE_COMPOSITION_STANDARD.md`, `docs/PORTFOLIO_ZERO_GENERIC_STANDARD.md`, `docs/PORTFOLIO_REFERENCE_COMPOSITION_GOVERNANCE_STANDARD.md` e `docs/PORTFOLIO_CREATIVE_DIRECTION_STANDARD.md`;
- `docs/PORTFOLIO_LANDING_MOTION_ADDENDUM.md`, `docs/EXPERIENCE_DESIGN_MAX_STANDARD.md`, `docs/PORTFOLIO_TECH_STACK_PARAMETRIZATION.md` e `docs/LAYOUT_ENGINEERING_STANDARD.md`;
- `docs/PORTFOLIO_INDIVIDUAL_SITE_SEO_STANDARD.md`, `docs/PORTFOLIO_UNIVERSAL_SEO_STANDARD.md`, `docs/PORTFOLIO_FUNNELS.md`, regras de plataforma/funil, brand integrity e gates existentes.

**Absorver a gramática e os recursos, nunca copiar a silhueta ou a jornada.** Cada cliente continua sendo um mini-site autoral; infraestrutura e primitivas podem ser reutilizadas, geometria, sequência de seções, marcas, identidade, provas, linguagem, funil e motion signature não. Nenhuma ativação automática ou migração do legado.

## 1. Fatos observados versus parâmetros sugeridos

### OBSERVADO na página pública da ECSPT (estrutura/conteúdo)

- Hero com proposta de valor, apoio explicativo, ações de **solicitar atendimento** e **cadastrar profissional**.
- Indicadores categóricos de operação/capacidade; elementos de estado como chamado, evidência e conclusão.
- Matriz enumerada de serviços/capacidades (atendimento, infraestrutura, checklist, projetos, parceiros).
- Processo enumerado de quatro momentos: demanda → mobilização → execução → evidência.
- Agrupamentos de alcance/região/contextos em tags; chamada para parceiros; formulário de demanda.
- Navegação por âncoras/áreas e rodapé de contato.

Fonte primária: https://ecspt.com.br/. São observações de **conteúdo/DOM**, não uma certificação de implementação de animações, cálculos ou performance.

### PROPOSTO para o repertório 0WEB (não verificado como ECSPT)

As cores hexadecimais, famílias tipográficas, espaçamentos, grids 12/4, hero split, glassmorphism, `whileInView`, scroll progress, parallax, sticky header, marquee, contadores, skeletons e tempos de animação encaminhados pelo responsável são **opções de projeto**, NÃO fatos confirmados no código/visual em execução da ECSPT. Registrar `motionObserved: NOT_VERIFIED` até inspeção visual/runtime adequada.

**Não copiar:** textos, nomes, números, logos, formulários, cobertura "nacional", "técnico disponível", métricas ou promessas operacionais; não atribuir aos clientes provas da ECSPT. Ausência de evidência permanece ausência de evidência.

## 2. Inventário de capabilities — avaliação opt-in

| Capability (repertório) | Pergunta de decisão | Tradução possível, não template | Bloqueio |
|---|---|---|---|
| HERO_DUAL_PATH | Há dois públicos/intentos reais? | Conversão principal + jornada distinta, com textos/visuais próprios | Não inventar canal ou CTA; usar funil individual |
| TRUST_INDICATORS | Qual insegurança precisa ser reduzida? | Qualificadores verificáveis, garantia real, diferenciais com fonte | Não alegar certificação, abrangência, disponibilidade ou resultados sem prova |
| NUMBERED_SERVICE_MATRIX | Serviços precisam de comparação/agrupamento? | Lista, editorial, accordion, cards ou outra composição autoral | Número é recurso, não exige grade ou ordem igual |
| PROCESS_TIMELINE | A decisão depende de entender "o que acontece depois"? | Etapas reais, prazos condicionais, evidência de execução | Não simular operações inexistentes |
| COVERAGE_TAGS | Localidade é decisiva e conhecida? | Região, bairros e alcance com evidência de operação | Não extrapolar atendimento nacional/local |
| STATUS_CHIPS | Existe status operacional verdadeiro? | Etapas do processo ou progresso estático com rótulo claro | Nada de status "ao vivo" sem fonte live |
| LEAD_CAPTURE | O projeto exige qualificação de demanda? | Campos e microcopy pertinentes com validação e consentimento | Nunca desviar do mecanismo de lead/funil/contato 0WEB |
| PARTNER_RECRUITMENT | Existe recrutamento oficial? | Caminho separado, legitimado pelo cliente | Não transportar CTA para clientes sem rede |
| CASE_EVIDENCE | Existem fotos, avaliações, logos, cases? | Prova real e datada, com proveniência | Não gerar falsos cases, clientes ou contadores |
| CLOSING_CTA | A página precisa de reforço decisório? | CTA contextual em posição autoral | Não forçar padrão "CTA pré-footer" |
| MOTION_ENHANCEMENT | Movimento ajuda compreensão/feedback? | Seleção consciente da matriz já canônica de motion | Nunca animação só porque referência usa estética tech |

Cada item recebe `USE`, `ADAPT`, `REJECT` na análise de referência; o uso efetivo como recurso recebe `USED`, `REJECTED`, `NOT_APPLICABLE` ou `ATTEMPTED_BLOCKED` no Resource Utilization Gate. `USE` não significa habilitação automática.

## 3. Parâmetros opcionais — design tokens e composição

**Tokens são exemplos, não paleta universal**:
- `referencePalette.primary`: `#0F172A`; `referencePalette.action`: `#2563EB`; `referencePalette.accent`: `#0EA5E9` ou `#10B981`; `referencePalette.surface`: `#FFFFFF` / `#F8FAFC`.
- Fontes candidatas: Inter, Plus Jakarta Sans e Roboto, **sem carregar fonte nova** e sem substituir fonte/tokens do cliente. A decisão real vem do Creative Composition Brief.
- Contêiner de referência: 1280–1440px; grid de referência: 12 trilhas desktop/4 mobile; gaps: 16–32px; espaçamento vertical de seções `clamp(4rem, 8vw, 8rem)` quando fizer sentido.
- Macrocomposições são **alternativas**, nunca defaults: hero editorial central; hero assimétrico com mídia; manifesto; vitrine/grade; percurso; painel de indicadores; seção de contato separada. O split 70/30, 2 ou 3 colunas e o par CTA primário/secundário são possibilidades sob justificativa.
- Acabamentos opt-in: borda 1px, radius 12px, sombra discreta, superfície de contraste, gradiente local, vidro/frosted apenas onde legível; preservar contraste AA e a direção autoral do cliente.
- Não alterar `src/styles.css`, `Header`, `Footer`, `BrandLogo`, tokens institucionais ou globals. Qualquer estilo futuro deve ser local ao cliente ou namespaced `pf-`.

## 4. Tokens de motion reutilizáveis — referência de valores

A configuração **inerte** para eventual uso futuro está em
`src/config/portfolio-ecspt-additive-reference.config.ts`. Ela não injeta CSS, não executa runtime e não importa nenhuma lib.

| Família | Valores sugeridos |
|---|---|
| `duration` (segundos) | `fast: 0.2`, `normal: 0.4`, `slow: 0.8`, `hero: 1.2` |
| `easing` | `easeOut: [0.16,1,0.3,1]`, `easeInOut: [0.65,0,0.35,1]`, `spring: {type:'spring',stiffness:300,damping:30}` |
| `delay` (segundos) | `none:0`, `short:0.1`, `medium:0.3`, `long:0.6` |
| `stagger` (segundos) | `tight:0.05`, `normal:0.1`, `loose:0.2` |
| `distance` (px) | `sm:12`, `md:24`, `lg:48`, `xl:80` |
| `scale` | `subtle:1.02`, `normal:1.05`, `bold:1.1` |
| `parallax` | fator `0.1–0.3` e deslocamento limitado `24–48px` se aprovado |
| `progress` | `2–3px` somente para conteúdos cuja leitura ganhe sentido com progresso |
| `headerScrolledThreshold` | `50px`, **somente** em cabeçalho local de cliente existente e aprovado |

Mapear para a matriz canônica já existente: `fade-up`, `scale-in`, `stagger-up`, `parallax`, `header-scroll`, `progress-line`, `marquee` e `counter`. A ausência de código de ativação é deliberada.

### Comportamentos propostos (não impostos)

- Reveal de seção: `opacity 0→1`, `translateY 24→0px`, `duration.normal`, `easeOut`; **somente** com proteção de SSR/hidratação e fallback estático visível.
- Card: `scale .96→1` ao revelar; hover pode ter `translateY(-4px)` **ou** escala discreta, não empilhar transforms que disputam a mesma propriedade.
- Grid: stagger de 0.1s se a hierarquia/quantidade justificarem. Motion signature própria do projeto tem precedência.
- Botões: foco visível e feedback 0.2s; hover `translateY(-2px)` ou escala `1.02`, respeitando a linguagem local.
- Scroll/progresso/sticky: opt-in, sem listeners globais desnecessários; preferir APIs e primitives já existentes. Header institucional congelado **não é alvo**.
- Transição entre páginas: **não** introduzir `AnimatePresence`/remount/opacity que afete roteamento, SEO, hidratação, foco ou funil. Precisa de rodada própria e teste.
- Skeleton: só quando existir espera real; nunca esconder conteúdo SSR já disponível.
- Marquee: não obrigatório, pausável e com versão estática; só logos/marcas autorizados.
- Counter: somente número factual documentado, nunca inventar `+500`, `99%` ou disponibilidade.
- Indicador pulsante: apenas status verdadeiro; se não houver dado ao vivo, rotular estado como etapa demonstrativa estática.

## 5. Contratos de implementação futura — sem conflitos

1. **Por opt-in por `client_key`/projeto:** a simples presença do arquivo de configuração não ativa nada globalmente; decidir no Creative Composition Brief qual recurso usar e por quê. Sem fallback com identidade de outra marca.
2. **Stack local:** React 19, TypeScript, TanStack Start, Tailwind v4, `motion/react` e primitives existentes. `framer-motion` em prompts externos é pseudocódigo, **não motivo para instalar segunda biblioteca**.
3. **Prefixo único:** `pf-` para novas utilidades CSS, `data-pf-*` para hooks locais; evitar `.scrolled` global, `[data-parallax]` global, `:root`, `body`, `html` e overrides de Tailwind/globals.
4. **Acessibilidade:** `prefers-reduced-motion: reduce` deve fornecer conteúdo totalmente visível e utilizável, sem loops, parallax ou deslocamentos; não esconder textos até scroll. Teclado, contraste AA, focus visible, tamanhos de toque e semântica.
5. **Performance:** hero/LCP usa preload/prioridade/eager conforme necessidade, **não** `loading=lazy` indiscriminado; mídias abaixo da dobra usam lazy/async, dimensões e formato responsivo. `will-change` somente enquanto estritamente necessário.
6. **SEO:** manter title, description, OG, canonical self, indexação conforme elegibilidade, schema adequado, sitemap, conteúdo rastreável e acessível sem JS para informação principal.
7. **Funil:** qualquer CTA/contato/formulário usa a jornada individual `CTA → funil → lead salvo → token → redirect server-side` conforme código/contrato vigente. Não introduzir `wa.me`, `tel:`, `mailto:` operacional nem endpoints externos duplicados.
8. **Verdade:** provas, preços, prazo, atendimento local, depoimentos, parceiro, presença nacional, números, status e mídia exigem fonte e frescor; diferenças entre demo e operação real são explícitas.
9. **Isolamento:** não aplicar tokens de uma landing à galeria `/portfolio` nem à loja `/servicos`; nenhum CSS público ou entidade de outro cliente pode vazar.
10. **Regressão:** validar só a página-alvo e as superfícies protegidas pertinentes, com checks de build, visual nas 3 viewports, console, reduced-motion, CTA/lead, SEO, hidratação e gates canônicos. Não editar baselines/hash em massa.

## 6. Matrizes para um projeto novo (preencher apenas se selecionar a referência)

```text
REFERENCE = ECSPT (capability grammar; no silhouette)
ROLE_MATRIX: papel | pergunta visitante | evidência do cliente | efeito na decisão
COMPOSITION_MATRIX: geometria autoral | mídia real | densidade | mobile | interação
RHYTHM_MEDIA_MATRIX: momentos | contraste | peso de mídia | prova | respiro
ANTI_COPY_MATRIX: conceito transferível | tradução para a marca | elemento proibido de copiar
MOTION_DECISION: capability canônica | REQUIRED/OPTIONAL/NOT_APPLICABLE | motivo | fallback reduce
CAPABILITY_DECISION: item ECSPT | USE/ADAPT/REJECT | fonte verdadeira | implementação
TRUTH_FRESHNESS: alegação | fonte | data | owner | atualização/retirada quando vencer
GATES: originalidade | visual | SEO | a11y | performance | CTA/funil | brand integrity
```

Não há ordem fixa de seções. O cliente pode ter **zero** ou **várias** das capabilities acima. A medição de valor vem de identidade, utilidade, conversão e confiança reais, não de contabilizar efeitos.

## 7. Aceite desta rodada e próximos passos

- [x] Referência externa classificada em fatos observados e propostas não verificadas.
- [x] Parâmetros complementares definidos com escopo/namespacing e sem imposto de layout.
- [x] Restrições de originalidade, SEO, truth/freshness, CTA e marca preservadas.
- [x] Valores em arquivo de configuração isolado e **não importado** pelo runtime.
- [ ] Uma implementação real só deve ser iniciada numa **micro-rodada por cliente**, com validação própria e aprovação conforme governança.
- [ ] Não há afirmação nesta rodada de preview, testes e publicação Vercel/Lovable de páginas.

**Skill stack/documentação consultada:** `0web-skill-router`, `PORTFOLIO_REFERENCE_COMPOSITION_GOVERNANCE_STANDARD`, `PORTFOLIO_UNIQUE_COMPOSITION_STANDARD`, `PORTFOLIO_LANDING_MOTION_ADDENDUM`, `PORTFOLIO_TECH_STACK_PARAMETRIZATION`, `PORTFOLIO_ZERO_GENERIC_STANDARD`, `0WEB_UNIVERSAL_ADDITIVE_GROWTH_CONSTITUTION`, `PORTFOLIO_INDIVIDUAL_SITE_SEO_STANDARD`. Uso: extração textual, seleção USE/ADAPT/REJECT e registro em PR; não foi feita implementação visual.
