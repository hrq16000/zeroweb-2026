# Creative brief — Pinturas Nunes

Contrato: v2 · Slug: `pinturas-nunes` · Client key: `pinturas-nunes`

- businessTruth: Pinturas Nunes, responsável Gabriel Nunes, oferece pintura residencial e predial, grafiato, texturas, pintura decorativa, lavagem e pintura de telhados e calhas, grades, portões e serviços em cadeirinhas e balancinhos.
- audience: Pessoas responsáveis por casas, prédios e áreas externas que precisam compreender o escopo antes de solicitar orçamento.
- singleGoal: Organizar um pedido de orçamento para o serviço de pintura certo pelo canal privado do cliente.
- brandPersonality: técnico, seguro, direto, caprichado e acolhedor.
- visualMetaphor: uma superfície ganha acabamento em camadas — base clara, faixa azul-profunda e traço dourado de rolo de pintura.
- layoutTopology: caderno de acabamento vertical; a página alterna uma abertura ampla, trilha de serviços por material e uma faixa final de solicitação, sem repetir o grid comercial dos prestadores já publicados.
- heroArchetype: composição de marca e material oficial; tipografia monumental à esquerda e o cartaz fornecido tratado como referência documental à direita.
- navigationArchetype: régua superior compacta com âncoras de escopo, processo e contato.
- sectionRhythm: abertura arejada → fita técnica densa → relato de escopo em blocos horizontais → faixa de conversão de alto contraste.
- typePairing: `Arial Black`/system sans para títulos firmes; `Arial`/system sans para leitura direta e compatível com a marca recebida.
- colorRoles: azul-noite `#071C41` para confiança e estrutura; dourado `#D88A00` para ação e acabamento; marfim `#F7F4EC` como parede/base; branco para áreas de leitura.
- imageStrategy: `material-original.png` é o cartaz de divulgação fornecido pelo cliente e é exibido como material original, sem ser apresentado como foto de obra. A imagem social e peças do kit são composições de marca, claramente identificadas como conceito quando aplicável.
- iconStrategy: ícones lineares de ferramentas e acabamentos, acompanhados por rótulos de serviço; sem fotos genéricas de equipes ou obras.
- motionGrammar: faixas de pigmento e linhas de régua entram por máscara curta; a sequência reduz-se a opacidade quando `prefers-reduced-motion` está ativo.
- interactionSignature: uma régua de acabamento horizontal revela os serviços por tipo de superfície, sem depender de carrossel.
- conversionNarrative: o visitante identifica a superfície ou serviço → descreve necessidade e contexto → recebe encaminhamento pelo funil do próprio cliente.
- proofStrategy: somente serviços e responsável informados no cartaz enviado. Não publicar números, avaliações, prazo, garantia, preço ou cobertura geográfica não confirmados.
- nearestPortfolioRisks: Ton & Cor, JC Revestimentos e Raphael Construções usam o mesmo macrosegmento. O risco é parecer apenas uma página azul com cards de reforma.
- antiTemplateDecisions: não usar hero split convencional, fotos de obra fictícias, blocos de depoimento ou FAQ inventada; o conteúdo é organizado por acabamento/superfície e a assinatura visual é a régua de pintura, não uma grade genérica.

## Dados e material recebidos

- Cartaz promocional fornecido nesta solicitação: `public/images/pinturas-nunes/material-original.png`.
- Marca e texto apresentados: **Pinturas Nunes** · “Transformando ambientes, realizando sonhos.”
- Responsável informado: Gabriel Nunes.
- Contato informado pelo cliente: destinado exclusivamente ao secret server-side `PORTFOLIO_WHATSAPP_PINTURAS_NUNES`; não entra no bundle público.
- Localidade e área de atendimento não foram informadas. A página não deve inferi-las.

## Skills selecionadas

- `0web-skill-router`: classificação `portfolio-client-site`, `funnel`, `content/SEO`, `motion`, `accessibility-fix`, `performance` e `docs`.
- `0web-skill-discovery`: pilha selecionada sem dependências novas; direção, CRO por funil, design system local, SEO factual, acessibilidade e QA cobrem o problema. Skills externas de template foram rejeitadas por impor estrutura visual.
- `0web-portfolio-art-direction`: DNA próprio de acabamento por camadas e comparação explícita com portfolios próximos.
- `0web-design-system`: tokens locais, contraste, tipografia e ritmo específicos da marca.
- `0web-ui-quality-gates`: estados do CTA, mobile, teclado, reduced motion, privacidade e build.

## Skills rejeitadas e motivo

- Geradores de landing page e templates de construção: redundantes e tenderiam a repetir hero, cards e prova social sem evidência.
- Imagens geradas de obras/equipe: rejeitadas para não representar execução, profissionais ou resultados sem material factual.

## Validação final

- [ ] identidade escopada ao cliente
- [ ] override de motion próprio
- [ ] hero/composição distintos dos portfolios mais próximos
- [ ] imagens classificadas corretamente
- [ ] funil individual funcional
- [ ] secret server-side configurado quando houver contato oficial
- [ ] mobile/desktop/teclado/reduced-motion
- [ ] originality + a11y + performance + privacy + build
