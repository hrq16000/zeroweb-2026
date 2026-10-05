# Corpus de referência R10 — ECSPT (ecspt.com.br) — 2026-10-05

**Natureza:** camada ADITIVA de repertório para novas landings `/portfolio/:slug`.
Soma-se aos corpora R1–R9 e às normas existentes. Não substitui, não revoga e não
tem precedência sobre nenhuma regra vigente. Em caso de dúvida, vale a regra
existente (isolamento por `clientKey`, funil individual, identidade do cliente,
anti-template, factualidade, motion contract global).

Regra de síntese (inalterada): REFERÊNCIA → MECÂNICA → FUNÇÃO → REINTERPRETAÇÃO
POR CLIENTE. Nada de marca, texto, asset, número ou claim da ECSPT é reutilizado.

## 1. O que a referência é

Landing B2B de serviço técnico em campo. Valor percebido vem de: clareza
operacional, linguagem de "sistema/registro", numeração de capítulos e prova de
processo (evidência), não de métricas.

## 2. Mecânicas extraídas (USE / ADAPT / REJECT)

| # | Mecânica observada | Função | Decisão | Como reinterpretar |
|---|---|---|---|---|
| M1 | Eyebrow técnico acima do H1 ("Field Service Intelligence") | Enquadra categoria em 1 linha | USE | Eyebrow com a categoria real do cliente |
| M2 | H1 em duas frases curtas com ponto final ("Presença técnica. Operação sem atrito.") | Promessa memorável e ritmada | USE | Duas afirmações curtas, factuais, da voz do cliente |
| M3 | CTA duplo com papéis distintos (cliente × parceiro) | Separa públicos | ADAPT | Só quando o cliente tem 2 públicos reais; ambos via funil/rota própria, nunca `mailto:`/`tel:`/link externo de contato |
| M4 | Faixa de 4 indicadores qualitativos sob o hero | Confiança sem números | USE | Somente atributos comprováveis; proibido número sem fonte |
| M5 | Sequência de "status" animada (disponível → em campo → registrado → concluído) | Signature moment narrativo do serviço | ADAPT | Válido só se espelha a jornada real do cliente; respeitar reduced motion (estado final estático) |
| M6 | Rótulos numerados `01 / CATEGORIA` em serviços e etapas | Ordem, leitura de sistema | USE | Numeração + categoria do próprio negócio |
| M7 | Grid de serviços assimétrico (2 destacados com categoria + 3 menores) | Hierarquia sem grid uniforme | USE | Evitar 3 cards iguais; destacar 1–2 serviços principais |
| M8 | Glifos tipográficos minimalistas (⌁ ⌘ ✓ ↗ ◌) no lugar de ícones ilustrativos | Tom técnico, leve | ADAPT | Glifo/ícone coerente com identidade do cliente; `aria-hidden` |
| M9 | Jornada 4 etapas `DEMANDA → MOBILIZAÇÃO → EXECUÇÃO → EVIDÊNCIA` com conector | Explica "como funciona" | USE | Etapas reais do atendimento; linha conectora via pseudo-elemento; `progress-line` |
| M10 | Nuvem de abrangência (regiões + contextos) em pills | Mostra alcance sem mapa pesado | ADAPT | Apenas regiões/bairros/contextos comprovados; nunca inflar área atendida |
| M11 | Bloco de recrutamento de parceiros com QR | Segundo funil | REJECT por padrão | Só se o cliente recruta de fato; sem link externo de formulário de terceiros no bundle |
| M12 | Contato com e-mail/telefone/`mailto:`/`tel:` + formulário próprio | Captação | REJECT (mecanismo) / ADAPT (estrutura) | Usar layout 2 colunas (texto de apoio + funil) com o funil individual do `clientKey`; contato é informação, nunca link direto |
| M13 | Paleta slate escura + azul ação; tipografia sans geométrica | Tom tech | REJECT como padrão | Paleta/tipografia nascem do cliente; tokens escopados, nunca globais |

## 3. Parâmetros técnicos somados (opcionais, sob o contrato global)

Valores abaixo são **faixas de referência**; quando divergirem de
`src/config/global-motion-contract.json`, o contrato global prevalece.

- Entrada de seção: fade-up 12–24px, 0,4–0,5s, easing de saída suave (`[0.16,1,0.3,1]`), uma vez por viewport.
- Stagger de cards/etapas: 0,05–0,1s, limitado (sem esperar >0,5s acumulado).
- Hover de card: elevação ≤4px ou escala ≤1,02 + borda acentuada; 150–200ms.
- Sequência de status (M5): ciclo lento, pausável, sem loop em `prefers-reduced-motion`.
- Conector de jornada (M9): `progress-line` via transform `scaleX/scaleY`, não width.
- Layout: Grid para matriz de serviços/jornada; Flexbox `flex-wrap` para pills; sizing intrínseco (`minmax`, `clamp`).
- Mobile 390px: jornada vira lista vertical com conector vertical; pills quebram linha; zero overflow.

## 4. Matriz de motion (avaliação desta referência)

`fade-up` REQUIRED · `stagger-up` REQUIRED · `progress-line` OPTIONAL (jornada) ·
`header-scroll` OPTIONAL · `scale-in` OPTIONAL · `float` OPTIONAL (status do hero) ·
`marquee`, `parallax`, `clip-reveal`, `image-reveal`, `text-line-reveal`, `blur-in`,
`fade-left/right`, `menu-reveal` — NOT_APPLICABLE na referência (decidir por cliente).

## 5. Quando usar este repertório

Indicado para clientes de serviço técnico/operacional/B2B (manutenção, instalação,
TI, frete, obras, assistência) cuja confiança depende de processo claro e
evidência. Não indicado como base para beleza, gastronomia, varejo afetivo.

## 6. Relação com materiais enviados pelo proprietário

Os três documentos enviados em 2026-10-05 (diretriz aditiva, parametrização
completa e config de motion) foram absorvidos aqui como mecânicas. Pontos que
conflitariam com normas vigentes foram reinterpretados, não descartados do
registro: paleta/tipografia fixas (M13), formulário com contato direto (M12),
grid 3 colunas uniforme (M7), e `tailwind.config.js` (o projeto usa Tailwind v4
em CSS; tokens de cliente ficam no CSS escopado do próprio portfolio).
