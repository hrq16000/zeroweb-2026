# Creative Composition Brief — Toop Assados (proposta não oficial)

**Status:** research + preview interativo em branch de proposta; não é landing pública nem funil operacional. Rota temporária: `/portfolio-preview/toop-assados`, apenas DEV/Vercel preview.
**Data da pesquisa:** 2026-11-07. **Proveniência principal:** quatro fotografias do mesmo panfleto impresso enviadas ao projeto. **Slug reservado (proposto):** `toop-assados`. **Região declarada no material:** Xaxim, Curitiba/PR.

## Verdade da empresa e limites de evidência

- businessTruth: o material anuncia a marca escrita **Toop Assados**, costela assada na brasa e um combo envolvendo frango recheado com aipim e acompanhamentos. A identidade jurídica, titularidade, horários, delivery e preços atuais não foram confirmados. Não confundir com **Top Assados e Cia**, encontrado em Tietê/SP.
- audience: pessoas que procuram almoço de fim de semana e assados prontos na região do Xaxim; público inferido do cardápio, não dado de audiência medido.
- singleGoal: tornar a escolha do assado e a solicitação de encomenda claras em uma experiência comercial local, após validação com a empresa.
- brandPersonality: forno, sabor e conveniência; direta, calorosa, sem apelo genérico ao luxo.
- visualMetaphor: **caderno da brasa** — etiquetas de açougue e um menu editorial de pedidos, não a parede de chamas do panfleto.
- layoutTopology: hero tipográfico em painel vertical de cardápio + fotografia ilustrativa identificada; depois duas faixas editoriais intercaladas de produtos, montagem da encomenda e localização.
- heroArchetype: tipografia ampla à esquerda, cartão visual “da brasa para a mesa” com especificações verificadas, sem falsas fotos do estabelecimento.
- navigationArchetype: sumário horizontal de três âncoras (assados, como pedir, onde fica); sem menu genérico de agência.
- sectionRhythm: nome + promessa factual → escolha costela/frango → composição do pedido → localização → dúvidas e confirmação de oferta → CTA final do funil.
- typePairing: serif editorial de impacto + grotesca legível, ambas escopadas à identidade do projeto.
- colorRoles: carvão profundo / creme de papel / cobre da brasa / oliva de temperos; vermelho somente como acento, não incêndio decorativo.
- imageStrategy: somente imagens autorizadas do negócio ou composições geradas classificadas **ilustrativas**; nunca sugerir que fotografia gerada é a comida real. Não replicar a foto comercial do panfleto sem esclarecer seus direitos.
- iconStrategy: rótulos discretos de peso, acompanha, endereço e modo de retirada; evitar ícones sem função.
- motionGrammar: transição leve entre etapas de escolha, revelação editorial de rótulos e mudança sutil de foco; obedecer reduced-motion.
- interactionSignature: comparador dos dois itens anunciados, conduzindo para funil de encomenda **sem** compra/pagamento fictício.
- conversionNarrative: fome/almoço → descobrir o que acompanha → confirmar disponibilidade e valor → solicitar encomenda → confirmação humana.
- proofStrategy: fatos do folheto **com data/validade não verificadas**; sem nota Google, depoimentos, horários, estoque ou “melhor da região” como afirmações da 0WEB.
- nearestPortfolioRisks: não reproduzir a linguagem noturna/rodoviária de Your Brutus Burguer, nem blocos de catálogo genéricos de outras landings gastronômicas.
- antiTemplateDecisions: composição gráfica tipo menu de açougue, faixas assimétricas de papel, hierarquia por prato e **sem** sequência hero + 3 cards + testemunhos.
- experienceEnginePrimary: decisão rápida sobre duas opções reais anunciadas.
- experienceEngineCounterpoint: painel de procedência e dúvidas, em vez de avaliações inventadas.
- experienceEngineEvidence: panfleto entregue + disponibilidade pública de busca não conclusiva.
- experienceEngineRejected: loja/delivery transacional, avaliações, atendimento 24h, mapa de GPS, número de porções e posts sociais não verificados.

## Três direções avaliadas

1. **Churrascaria luxo / fundo preto e brasas** — rejeitada: reproduz o material atual e pode induzir experiência premium não demonstrada.
2. **Aplicativo de delivery / grade de pratos** — rejeitada: sugere estoque, pagamento e operação digital não confirmados.
3. **Caderno da Brasa / menu editorial** — escolhida: deixa nítido o produto e o caminho de conversão, com identidade diferente de outros portfólios.

## Decision profile V2 (pré-implementação)

- trafficIntent: busca local por assados/costela/frango em Curitiba e acesso via QR code.
- trafficSource: panfleto físico e busca orgânica potencial; canais efetivos não confirmados.
- offerType: anúncio de dois itens/ofertas; **validade comercial desconhecida**.
- decisionComplexity: baixa a média; escolher prato, acompanhamentos, modo de recebimento e horário.
- decisionRiskDimensions: preço desatualizado, falta de disponibilidade, composição incorreta do combo, entrega não oferecida.
- uncertainties: preço válido, dia/horário, peso da costela, adicionais, retirada ou entrega, endereço e telefone.
- decisionSupport: lista transparente dos itens, “oferta sujeita à confirmação”, campo de dúvida e resumo antes do envio.
- valueDemonstration: praticidade de selecionar um assado sem precisar ler um panfleto pequeno.
- formStrategy: funil proprietário em etapas curtas; persistência server-side antes de redirecionar ao WhatsApp mediante configuração segura do cliente.
- transparencyPlan: preço histórico explicitamente marcado; não prometer que é preço atual.
- locationRequirement: bairro Xaxim e endereço do panfleto; padronização da grafia sujeita a validação.
- sourceContinuity: mensagem do funil leva referência de item, ingredientes informados pelo cliente, retirada/entrega a confirmar.
- crossChannelContinuity: QR-code e busca orgânica apontam à landing própria; não afirmar existência de redes oficiais.
- postConversionPlan: confirmação pela equipe do restaurante, não automatizar confirmação de pedido/pagamento.
- measurementPlan: evento de clique no CTA, início do funil e lead persistido, sem dados pessoais em analytics.

## V3 — checklist de decisão

- pageMode: página comercial de captação (não storefront transacional).
- decisionVelocity / mobileDecisionBudget: itens e CTA legíveis antes de rolagem longa no celular.
- informationScent: cada item possui composição e condição de preço explícitas.
- selfSegmentation: escolha “combo de frango” vs. “costela”.
- contextCarryover: item selecionado pré-preenche a etapa inicial do funil.
- commitmentLadder: explorar → selecionar → informar preferência → consentir → enviar.
- claimEvidence: todo atributo rastreado ao panfleto ou identificado como conceito.
- freshness: carimbo de validação e expiração das ofertas; não publicar promoção sem confirmação.
- navigationLeakage: links externos secundários à intenção de pedido.
- experimentReadiness: monitorar abandono sem misturar clientes.

## Requisitos técnicos da futura implementação

- Rota final prevista: `/portfolio/toop-assados`, com SEO individual, canonical, OG, JSON-LD factual, sitemap e indexação **apenas quando publicado e validado**.
- Em eventual preview: caminho isolado DEV/preview, sem indexação; não permitir demo incompleta em produção.
- clientKey específico; `FunnelCTAButton` e funil próprio, lead salvo no servidor e destino WhatsApp configurado exclusivamente no backend, após validação do titular. Sem `wa.me`, `tel:` ou telefone no bundle.
- `PortfolioHostCredit`, `PortfolioUpsellPopup` e CTA flutuante conforme plataforma, sem clonar identidade da agência dentro da página.
- Mídia: hero conceitual com sinalização de ilustração; solicitar foto real de costela, frango e fachada para versão final.
- Layout responsivo 390/768/1440, contraste acessível, reduz movimento, testes e gates de portfólio.
- Caso o projeto evolua para **delivery transacional**, iniciar playbook específico; o funil de contato não é checkout nem pedido confirmado.

## Resource effort ledger e skills

| Recurso | Estado | Evidência / motivo |
|---|---|---|
| Material do usuário | USED | Quatro fotos do mesmo panfleto; marca, bairro, propostas de pratos e endereço a confirmar |
| Pesquisa pública (nome, telefone, redes) | USED | 2026-11-07: resultados não conclusivos para esta empresa no Xaxim; sem perfil oficial resolvido |
| Google Business Profile/Maps | ATTEMPTED_BLOCKED | Busca sem correspondência segura, não significa inexistência |
| Instagram e Facebook | ATTEMPTED_BLOCKED | Sem handle oficial verificável; últimas seis postagens não aplicáveis até resolução |
| Mídia oficial e direitos | ATTEMPTED_BLOCKED | Sem fotos de autoria/uso confirmados |
| Proposta de arte | USED | Versão conceitual produzida na conversa; não pressupõe autorização de publicação |
| 0web-skill-router + AGENTS + lifecycle | USED | Consulta à fonte oficial no repositório |
| 0web-experience-design-max / direção de arte | USED (planejamento) | Concepção, arquitetura de decisão, responsividade e originalidade previstas; prévia implementada; validação de CI/browser pendente |
| Skills externas / REA / Firecrawl | NOT_APPLICABLE | Não há ganho proporcional nem autorização para executar dependências externas nesta micro-rodada de documentação |
| UI quality / testes / funil/SEO | NOT_APPLICABLE AINDA | Entrarão na implementação; nenhuma página foi alterada nesta etapa |

## Publicação e pendências honestas

**Bloqueios para página pública operacional:** confirmar nome e identidade do titular, preço/validade, endereço normalizado, número/destino de encomenda, horário, fotografia autorizada e funil funcional. Ausência de perfil social não bloqueia, desde que pesquisa registrada. Sem prova de publicação final, indexação ou conclusão do projeto nesta etapa. Preview demonstrativo existe somente em branch para revisão.
