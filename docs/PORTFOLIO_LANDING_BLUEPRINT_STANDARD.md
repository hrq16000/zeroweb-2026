# Diretriz estrutural para novas landing pages `/portfolio/:slug`

Status: normativo · Escopo: criação e evolução de qualquer página em
`/portfolio/<slug>` · Complementa: `PORTFOLIO_CLIENT_STANDARD.md`,
`PORTFOLIO_CREATIVE_DIRECTION_STANDARD.md`, `PORTFOLIO_CAPABILITY_PALETTE.md`,
`PORTFOLIO_FUNNEL_CONTEXT_STANDARD.md`, `GLOBAL_WEB_EXPERIENCE_STANDARD.md`.

> **Precedência (2026):** para projetos novos, o Blueprint é contrato de
> **conteúdo e capacidades**, não renderer visual obrigatório. A composição
> visual é autoral por projeto e regida por
> `docs/PORTFOLIO_UNIQUE_COMPOSITION_STANDARD.md`, que prevalece em qualquer
> conflito de layout, hero, ordem de seções ou ritmo.

## 1. Objetivo

Cada `/portfolio/<slug>` é uma landing page completa e independente de uma
empresa, profissional, produto ou serviço, hospedada dentro da galeria
`/portfolio`. O objetivo nunca é produzir páginas visualmente iguais trocando
logo, cor e texto.

Cada projeto deve ter identidade, hierarquia, conteúdo, composição, imagens,
motion, CTA, funil, características de segmento e SEO próprios, e ser percebido
como um site autêntico.

> **Padronizar a inteligência da página, não clonar a aparência.**

## 2. Blueprint paramétrico

Toda página nasce de um vocabulário estrutural comum (Site Blueprint Schema).
O projeto entra com parâmetros — empresa, segmento, oferta, localização,
serviços, produtos, público, identidade, diferenciais, imagens, objetivo de
conversão, tipo de funil, provas disponíveis, dados institucionais — e a partir
disso são decididas as seções pertinentes, a sequência comercial e a variante
visual.

Nem todos os projetos terão as mesmas seções. Todos serão construídos a partir
do mesmo vocabulário governado.

## 3. Princípio narrativo

A página responde progressivamente: quem é · o que oferece · por que importa ·
quais soluções existem · por que escolher esta empresa · para quem/quais
situações serve · qual a evidência real · como contratar · quais objeções
responder · qual a próxima ação.

Lógica comercial de referência:

```text
IDENTIDADE → NECESSIDADE → OFERTA → ARGUMENTAÇÃO → APLICAÇÃO →
AUTORIDADE → EVIDÊNCIA → CONVERSÃO → OBJEÇÕES → AÇÃO
```

A implementação visual, a ordem exata, os componentes e a narrativa são
definidos por projeto.

## 4. Biblioteca estrutural

### 4.1 Header
Logo, âncoras, serviços/produtos, Sobre, FAQ, Contato, CTA destacado, menu
mobile, fixação quando adequado. O menu reflete as seções que existem naquela
página — nunca um menu hardcoded igual em todos os projetos.

### 4.2 Hero
Comunica empresa, oferta principal, benefício, posicionamento, localização
(quando relevante) e CTA. Parâmetros: eyebrow, headline, subheadline, descrição,
CTA primário/secundário, imagem, vídeo, composição ilustrativa, benefícios
rápidos, background, layout, motion.

Variantes previstas: texto+imagem, centralizado, fullscreen, editorial,
industrial, vídeo, assimétrico, produto em destaque, fotografia dominante,
tipográfico, split screen. O Hero não repete a mesma composição entre projetos.

### 4.3 Trust bar
`trustItems[]` — atendimento local, orçamento, fabricação própria, garantia,
atendimento residencial/empresarial, entrega, suporte, experiência, pagamento,
cobertura regional. Somente afirmações sustentadas por dados reais.

### 4.4 Sobre / Autoridade
Não é o bloco genérico "Quem somos": explica por que aquela empresa consegue
resolver o problema. Campos: `company.story`, `company.expertise`,
`company.operation`, `company.infrastructure`, `company.credentials[]`.

### 4.5 Ofertas
`offers[]` com nome, categoria, badge, imagem, ícone, descrição, benefícios,
aplicações, características, preço (quando existir), CTA, destaque, link e
prioridade.

Variantes: cards, lista editorial, tabs, slider, comparação, catálogo, masonry,
scroll horizontal, cards expansíveis, feature sections alternadas, showcase
individual. Não reduzir tudo ao mesmo grid de três cartões.

### 4.6 Comparativo / quebra de objeção
`comparison` — tradicional × proposto, básico × completo, antes × depois,
problema × solução, categorias, planos, tecnologias, modalidades. Serve à
decisão, não ao preenchimento.

### 4.7 Diferenciais
`differentials[]`, tipicamente 3 a 6 pontos relevantes, com ícone, número,
título, explicação, evidência, imagem e animação. Evitar grades genéricas.

### 4.8 Aplicações / para quem é
`useCases[]` — residencial, comercial, empresarial, industrial, condomínios,
escritórios, perfis e tipos de problema. Cada item pode ter imagem, título,
descrição, CTA e página relacionada.

### 4.9 Complementares
`complementaryOffers[]` para amplitude e cross-sell, sempre apoiando a oferta
principal.

### 4.10 Galeria
`gallery[]` só quando existir material real: obras, trabalhos, produtos,
instalações, resultados, antes/depois, bastidores, equipe, infraestrutura. Cada
mídia com imagem, alt, legenda, categoria, descrição, focal point e relação com
o serviço. Nunca preencher com imagem incompatível com o cliente.

### 4.11 Provas e evidências
`proof.type`: testimonials, cases, projects, reviews, certificates, clients,
gallery, numbers, credentials.

**Regra obrigatória:** nunca fabricar avaliações, estrelas, número de clientes,
depoimentos, certificações, anos de experiência, projetos, parceiros ou
estatísticas. Sem prova real, mudar a estratégia da seção ou não exibi-la.

### 4.12 CTA intermediário
Páginas longas não dependem só de Hero e Footer. Inserir conversão após
argumentos fortes (ofertas, comparativo, diferenciais, galeria), sempre com o
objetivo daquele projeto.

### 4.13 FAQ
`faq[]` com pergunta, resposta e categoria opcional, respondendo dúvidas reais
de contratação/produto/serviço. Sem perguntas artificiais.

### 4.14 Funil
Cada slug tem objetivo próprio (`funnelType`: orçamento, pedido, agendamento,
contato, diagnóstico, reserva, solicitação) e coleta apenas o necessário para
aquele negócio. Exemplos de trilhas distintas:

```text
Nome → necessidade → serviço → cidade → detalhes → continuar
Produto → quantidade → medida → cidade → prazo → orçamento
Serviço → equipamento → problema → modalidade → localização → agendamento
```

Componente reutilizável; narrativa e campos jamais genéricos. O contrato do slug
vive em `src/config/portfolio-funnel-context.json` (ver
`PORTFOLIO_FUNNEL_CONTEXT_STANDARD.md`).

### 4.15 WhatsApp
A mensagem transporta contexto: projeto, serviço, escolha, localização, dados do
funil, origem e identificador de analytics. Proibido "Olá, gostaria de saber
mais". O número permanece server-only, resolvido por `clientKey`.

### 4.16 Contato
Formulário, WhatsApp, telefone, endereço, mapa, horário, e-mail, região, redes —
somente o que existe de fato. Mapa só quando o local importa; formulário só
quando o WhatsApp não basta.

### 4.17 Footer
Logo, descrição, navegação, contato, redes, privacidade, termos, dados
empresariais, copyright — refletindo o conteúdo daquele projeto.

## 5. Parametrização básica

- **Identidade:** `brand.name`, `brand.logo`, `brand.segment`,
  `brand.positioning`, `brand.primaryColor`, `brand.secondaryColor`,
  `brand.fonts`, `brand.visualStyle`, `brand.toneOfVoice`.
- **Negócio:** `business.type`, `business.primaryOffer`,
  `business.secondaryOffers`, `business.location`, `business.serviceArea`,
  `business.targetAudience`, `business.mainDifferential`.
- **Conversão:** `conversion.type`, `conversion.primaryCTA`,
  `conversion.secondaryCTA`, `conversion.whatsapp`, `conversion.form`,
  `conversion.fields[]`.
- **Conteúdo:** `offers[]`, `differentials[]`, `useCases[]`, `gallery[]`,
  `faq[]`, `proof[]`, `complementaryOffers[]`.
- **Aparência:** `theme`, `layoutVariant`, `sectionVariants`, `visualDensity`,
  `typography`, `motion`, `assets`.
- **SEO:** `seo.title`, `seo.description`, `seo.h1`, `seo.canonical`,
  `seo.ogImage`, `seo.locality`, `seo.serviceAreas[]`, `seo.entities[]`,
  `seo.schema[]`.

## 6. Ordem de seções parametrizável

`Hero → Sobre → Serviços → Diferenciais → Galeria → Contato` **não** é sequência
fixa. Use `sections[]`, cada item com `type`, `enabled`, `order`, `variant`,
`content`, `theme`, `motion`. Tipos previstos: `hero`, `trust`, `offers`,
`comparison`, `useCases`, `authority`, `gallery`, `proof`, `conversion`, `faq`,
`funnel`, `contact`. A ordem final segue a narrativa comercial do negócio.

## 7. Não virar template visual único

Compartilhado: componentes, infraestrutura, schema de dados, utilities,
tracking, SEO engine, funil, bibliotecas, sistema de motion, sistema de imagens,
regras de responsividade.

Variável por projeto: composição, grid, espaçamento, hierarquia, tipografia,
imagens, formato do Hero, cards, fundos, divisores, formas, ícones, tratamento
visual, ordem de seções, interações, motion e narrativa.

Resultado esperado: duas páginas com o mesmo motor sem parecer o mesmo template.

## 8. Identidade autêntica por projeto

Antes de criar ou reformular, levantar segmento, características da marca, logo,
cores, linguagem, fotos, público, ticket, região e objetivo comercial, e derivar
uma direção visual coerente. Indústria pede robustez, tipografia técnica, grids
geométricos; confeitaria pede composição orgânica e fotografia dominante;
assistência técnica pede linguagem tecnológica e microinterações contextuais.
Parametrização não apaga personalidade.

## 9. Motion

Parâmetros: `motion.hero`, `motion.reveal`, `motion.cards`, `motion.hover`,
`motion.sectionTransition`, `motion.parallax`, `motion.navigation`,
`motion.loading`. Recursos: reveal, stagger, scroll-based, parallax leve, hover,
profundidade, máscaras, transições, camadas, SVG animado, efeitos de segmento.

`prefers-reduced-motion` é obrigatório e remove deslocamento, nunca conteúdo.
Motion aumenta percepção de qualidade — não prejudica leitura nem performance.

## 10. Imagens e capas

Sem reutilizar a mesma imagem entre clientes. Toda mídia com relevância
contextual, contraste, resolução, crop, focal point, alt text e formato
otimizado. A capa da galeria representa a identidade da landing. Evitar capas
cortadas, sem relação, dominadas por telefone/endereço, sem contraste ou apenas
promocionais quando não fizer sentido.

## 11. SEO

Por projeto: `<title>` próprio, meta description própria, H1 único, hierarquia
de headings correta, canonical, OG, alt text, conteúdo indexável, links internos
e sitemap. Schemas apenas quando semanticamente adequados: Organization,
LocalBusiness, ProfessionalService, Service, Product, FAQPage, BreadcrumbList.
Nunca structured data com informação inexistente.

## 12. SEO local

Cidade, região, bairros, municípios e área de atendimento podem entrar
semanticamente em conteúdo e metadata quando a atuação geográfica for real. Sem
repetição artificial (keyword stuffing).

## 13. Performance

WebP/AVIF quando adequado, imagens responsivas, `srcset`, lazy loading,
dimensionamento correto, code splitting, carregamento sob demanda, menos JS
desnecessário, prevenção de layout shift, otimização de LCP. Lighthouse é gate
técnico, não objetivo visual — não sacrificar recursos importantes por nota.

## 14. Responsividade

Mobile-first, validando ~390 px, ~768 px, desktop e telas largas. No mobile:
texto legível, CTA acessível, menu funcional, imagem sem perder o assunto,
motion sem atrapalhar a navegação e formulário simples.

## 15. Acessibilidade

HTML semântico, contraste adequado, navegação por teclado, labels, estados de
foco, alt text, headings corretos, botões semanticamente corretos, `aria-*`
somente quando necessário e `prefers-reduced-motion`.

## 16. Analytics

Eventos possíveis: visualização, CTA principal, CTA intermediário, WhatsApp,
abertura de funil, avanço de etapa, conclusão, erro, formulário, galeria,
telefone, mapa. Sempre preservar o slug do projeto e a origem disponível (UTM,
campanha, source, referrer, origem interna). Não coletar dado pessoal
desnecessário.

## 17. Componentização

Reutilizar no nível técnico com variantes: `Hero`, `OfferGrid`,
`FeatureSection`, `Comparison`, `TrustBar`, `Gallery`, `FAQ`, `ConversionCTA`,
`LeadFunnel`, `ContactSection`.

Evitar `IndustrialTemplate` / `BeautyTemplate` / `RestaurantTemplate` replicados
sem diferenciação. Preferir primitivas flexíveis + variantes + configuração +
identidade individual.

## 18. Consistência global

Mesmo com identidades distintas, permanecem consistentes: qualidade,
acessibilidade, responsividade, SEO técnico, analytics, funcionamento de CTAs e
funis, performance, governança, tratamento de erros, semântica e segurança.

> **Consistência de engenharia e qualidade. Diversidade de experiência e
> identidade.**

## 19. Proibido

Copiar visualmente um site de referência; clonar outro projeto do portfólio;
trocar apenas logo e cor; repetir a mesma ordem de seções em todos; repetir o
mesmo Hero; usar os mesmos cards em todos; inventar avaliações, depoimentos,
números, certificações, endereço ou anos de atuação; preencher galeria com
imagens sem relação; uniformizar a ponto de apagar a identidade autêntica;
remover recursos existentes só para caber num template.

Referência externa serve para lógica, UX, arquitetura comercial, recursos e
padrões de navegação — nunca para cópia de identidade, textos ou composição
proprietária.

## 20. Filosofia final

```text
Motor compartilhado + blueprint parametrizado
+ conteúdo individual + identidade individual
+ funil individual + experiência visual individual
= landing pages escaláveis sem aparência de template clonado
```

## 21. Adendo obrigatório — contato sempre pelo funil

O contato de um `/portfolio/:slug` acontece **prioritariamente e
obrigatoriamente** pelo funil individual do projeto. Cada projeto tem contexto
próprio (serviço, necessidade, equipamento, produto, modalidade, localização,
prazo, dados específicos) e o visitante não pode ser retirado desse contexto por
um telefone ou WhatsApp clicável genérico.

```text
landing → CTA contextual → funil individual → coleta → continuidade de contato
```

### 21.1 Telefone é informação, não atalho

Telefone público confirmado pode aparecer como informação institucional
(ex.: `Telefone: (41) 99507-2700`). Por padrão, em `/portfolio/:slug`:

- não usar `<a href="tel:...">`;
- não usar o número como CTA principal;
- não criar botão "Ligar", WhatsApp direto, `wa.me` ou qualquer link que
  contorne o funil.

A existência pública do número não altera a arquitetura de conversão.

### 21.2 CTA precisa ter nexo com o negócio

Evitar "Entrar em contato", "Fale conosco", "Chamar no WhatsApp" quando houver
ação contextual possível:

| Segmento | CTA contextual |
|---|---|
| Assistência técnica | Solicitar avaliação · Informar o problema · Agendar atendimento |
| Construção | Solicitar orçamento · Informar a obra |
| Alimentação | Fazer pedido · Consultar cardápio |
| Serviço profissional | Solicitar atendimento · Agendar consulta |

Todo CTA leva ao funil apropriado.

### 21.3 O funil é parte do produto do cliente

O funil é a ponte `interesse → necessidade → lead contextualizado`. Componentes
genéricos não podem injetar automaticamente links diretos de telefone/WhatsApp
que destruam esse fluxo.

### 21.4 CONTACT_FUNNEL_GATE

```text
[ ] CTA principal aponta para o funil correto
[ ] CTAs intermediários preservam o contexto do projeto
[ ] telefone não possui link `tel:` por padrão
[ ] WhatsApp direto não bypassa o funil
[ ] mensagem final contém contexto coletado
[ ] nenhum componente genérico criou contato paralelo
```

## 22. Adendo obrigatório — evidência não é material de design

Imagem enviada pelo proprietário para comprovar identidade, informação ou
contexto **não vira automaticamente** mídia principal da landing. Foto de placa,
banner, panfleto, cartão, fachada, tela ou anúncio costuma ser ótima evidência e
péssima mídia editorial.

### 22.1 Finalidade obrigatória do asset

```text
EVIDENCE_ONLY · BRAND_REFERENCE · REAL_BUSINESS_MEDIA · EDITORIAL_MEDIA
COVER_MEDIA · OG_MEDIA · GENERATED_CONTEXTUAL_MEDIA
```

Uma foto usada para extrair logo, cores e serviços é `BRAND_REFERENCE`; isso não
a torna `EDITORIAL_MEDIA`.

### 22.2 Prioridade visual

```text
1. foto real de alta qualidade diretamente relacionada
2. foto pública real corretamente atribuída
3. asset oficial da marca em boa qualidade
4. mídia editorial produzida especificamente para a página
5. mídia contextual licenciada
6. composição gráfica própria
7. material de referência de baixa qualidade
```

Material de referência só aparece quando tiver valor documental real e não
houver alternativa melhor. Quando surgirem alternativas melhores (fotos reais do
Google, do estabelecimento, equipamentos, bancada, identidade limpa, mídia
editorial própria), a foto de referência sai da apresentação principal.

### 22.3 "Real" não é sinônimo de "bom"

Avaliar qualidade, enquadramento, resolução, ruído, perspectiva, legibilidade,
função narrativa, impacto e adequação ao layout. Foto real ruim pode ser
preservada como evidência, mas sai do Hero e dos grandes blocos visuais.

### 22.4 Avaliação editorial de encantamento

Ter Hero, cards, texto, imagens e testes verdes não conclui o Blueprint. É
preciso responder: *a página transmite um site profissional, rico, autêntico e
criado especificamente para aquele negócio?* Avaliar impacto visual, riqueza de
mídia, ritmo, composição, hierarquia, profundidade, identidade, variedade,
motion, coerência e percepção premium.

### 22.5 MEDIA_PURPOSE_GATE

```text
[ ] nenhuma imagem de referência fraca domina a página sem justificativa
[ ] fotos reais de melhor qualidade foram priorizadas
[ ] crops repetidos não simulam variedade
[ ] mídia gerada está corretamente classificada
[ ] capa representa o segmento
[ ] Hero utiliza o melhor asset disponível
[ ] material de placa/banner não está sendo usado apenas porque foi fornecido primeiro
```

### 22.6 Filosofia

- Contato: exibir informação não é abrir atalho que bypassa o funil.
- Mídia: existir como evidência não é merecer destaque visual.
- Qualidade: usar o melhor material disponível — real, público, editorial ou
  gerado — sem confundir evidência com decoração.

---

## 23. Adendo de experiência (normativo para projetos novos)

`docs/PORTFOLIO_LANDING_EXPERIENCE_ADDENDUM.md` adiciona — sem substituir nada
deste documento — `experience.visualRhythm`, arquétipos de Hero,
`experience.signatureMoments[]`, `capabilities`, `results`,
`businessInfrastructure`, oferta com profundidade, `mediaNarrative`,
`motionNarrative`, `qualityProfile`, CTA não-botão e as dimensões
`CONTENT_DEPTH · VISUAL_RHYTHM · MEDIA_NARRATIVE · SECTION_VARIETY ·
SIGNATURE_MOMENTS · PROOF_DENSITY · CONVERSION_CONTINUITY` do quality gate.
