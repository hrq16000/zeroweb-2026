# 0WEB — DELIVERY FUNCTIONAL SYSTEM STANDARD

**Status:** CANONICAL_REQUIREMENTS / IMPLEMENTATION_PENDING  
**Versão:** 0.1 · **Data:** 2026-11-01  
**Escopo:** novos projetos de delivery em `/portfolio/:slug`, suas lojas operacionais, domínios próprios e eventuais aplicações SaaS de restaurantes.  
**Não altera:** a loja `/servicos` da 0WEB, os projetos legados, sua identidade visual, dados, DNS, funis existentes ou o motor administrativo institucional.

## 0. Decisão de produto

**Delivery não é uma landing page de restaurante com formulário de interesse, nem um carrinho decorativo.** Quando o cliente contrata loja de delivery funcional, a 0WEB deve entregar um sistema transacional ponta a ponta:

`cardápio real → escolha de variantes/adicionais → carrinho persistente → identificação e modalidade → cálculo autoritativo → pagamento conforme configuração → criação durável e confirmação do pedido → painel da operação → preparo/retirada/entrega → histórico/auditoria`.

A página de apresentação da marca pode existir no mesmo domínio; não substitui a loja nem a operação. WhatsApp pode notificar ou servir de canal auxiliar, **após registrar o pedido**, nunca ser a única fonte de verdade do comércio eletrônico. Nunca afirmar "pedido recebido" sem persistência confirmada no servidor.

**Regra:** módulos de presença digital podem ser compartilhados; infraestrutura e domínio lógico do comércio podem ser compartilhados entre clientes com isolamento rigoroso; a identidade e a composição visual da loja e da landing devem ser próprias de cada estabelecimento. Não copiar layouts, marcas, textos, imagens, código ou fluxos proprietários de terceiros.

## 1. Referência principal — PDV Slim / Juma Pizzaria

Referências fornecidas pelo responsável:
- Loja pública: https://pdvslim.com.br/loja/jumapizzaria
- Oferta comercial do sistema: https://pdvslim.com.br/
- Autenticação da plataforma: https://pdvslim.com.br/auth

**Regra de evidência.** Em 2026-11-01 a página pública de Juma respondeu pelo navegador de busca, mas o HTML acessível à inspeção textual não expôs os controles dinâmicos, o cardápio, regras de seleção ou checkout. Portanto **não foram verificados** visualmente o montador de pizza, os estados do carrinho, as taxas, os pagamentos ou a conclusão de pedido dessa loja específica. Todos esses itens abaixo são **requisitos-alvo da 0WEB**, e não afirmações de que Juma os implemente da mesma maneira. A inspeção interativa posterior deve registrar captura de telas e evidência por etapa, sem realizar compra real não autorizada.

A apresentação pública do PDV Slim **declara** gestão integrada de pedidos, mesas/balcão/delivery, tela de cozinha (KDS), caixa, estoque, relatórios, permissões, aprovação/auditoria, multi-loja e PWA. São capacidades anunciadas pela referência, **não verificadas no ambiente autenticado**. Não assumir equivalência técnica nem copiar interface.

### Matriz de tradução (USE / ADAPT / REJECT)

| Princípio de produto | Tradução independente 0WEB | Não copiar |
|---|---|---|
| Loja pública com URL própria | Storefront real por `storeId` e slug, eventualmente domínio próprio | Marca, silhouette, conteúdo, assets |
| Jornada de pedido curta | Navegação mobile-first com carrinho acessível e feedback imediato | Ordem exata de telas da Juma |
| Comercialização de sistema | Oferta 0WEB separada da loja do cliente; nunca publicidade intrusiva no checkout | Marca e promessa comercial PDV Slim |
| Login de operador | Backoffice 0WEB com papéis e autorização por estabelecimento | Telas / credenciais / fluxos proprietários |
| Operação integrada | Pedidos duráveis com fila, histórico e estados auditáveis | Arquitetura privada não observável |

## 2. Superfícies separadas — nenhuma pode substituir outra

1. **Institucional/comercial 0WEB:** mostrar, vender e explicar a capacidade de delivery como produto e captar leads próprios da 0WEB.
2. **Loja de cada estabelecimento:** cardápio, configuração, carrinho, checkout, status, histórico do cliente; identidade e disponibilidade pertencem ao lojista.
3. **Operação autenticada do estabelecimento:** pedidos, cozinha, gestão do cardápio, horários, regiões, pagamentos, operadores e relatórios, de acordo com os módulos contratados.
4. **Landing/portfólio do cliente (quando existente):** entidade SEO e identidade próprias, com link direto para a loja, sem confundir "falar com a equipe" com "finalizar pedido".

O checkout de venda de comida **não** reutiliza automaticamente o funil institucional `/servicos` nem um formulário genérico `PortfolioCTAQuiz`. A compra possui contrato transacional próprio; o funil de captação da 0WEB continua isolado.

## 3. Contrato P0 — storefront mobile funcional

- Visualização rápida, verdadeira e acessível do nome, logo, status aberto/fechado, horários, área de entrega, regras, taxas e mínimo do pedido; dados variáveis carregam da loja real.
- Categorias, busca, disponibilidade e preço atualizados; produto esgotado não pode ser comprado.
- Cards de produtos com foto verdadeira quando houver, nome, descrição útil, composição, possíveis alérgenos quando informados, preço-base e promoções válidas.
- Configurador por produto: tamanhos, sabores, quantidades, bordas, ponto/preparo, adicionais opcionais ou obrigatórios, limites mínimo/máximo, exclusões, observações; **não apresentar configurações que o estabelecimento não oferece**.
- Pizza meio a meio/múltiplos sabores só quando habilitada; regra de preço configurável por loja (maior sabor, média ponderada, soma por fração ou preço fixo), com cálculo no servidor. Não inventar regra de preço.
- Combos e opções de bebida/porções usam o mesmo motor de personalização e estoque.
- Carrinho com itens distinguíveis pela configuração, alterar quantidades/remover/editar, cálculo instantâneo no cliente como *prévia*, persistência recuperável, total de itens e CTA fixo que não cubra conteúdo.
- Checkout por entrega, retirada e consumo local **somente se suportados pela operação**, com nome/contato, endereço válido ou unidade, referência, observações, CEP/área atendida, taxa, tempo estimado quando confirmado, resumo e pagamento.
- Troco para dinheiro, quando habilitado, com validação; Pix/cartão somente quando integração disponível e conciliável; jamais declarar pago sem confirmação verificável.
- Avisos de indisponibilidade/fora do horário e caminho explícito para agendar, se a loja oferecer; bloqueio real de pedidos impossíveis.
- Confirmação do pedido com número/token não enumerável, status e resumo, após gravação durável; recarregar ou tocar duas vezes não duplica pedidos.
- Status visíveis: recebimento, aceite, preparo, pronto, saída, entregue/concluído, cancelamento quando permitido. O nome e a sequência exibidos devem refletir os estados realmente implantados.
- Sem dependência de login obrigatório para navegar; cadastro de cliente, se existir, não pode bloquear compra sem justificativa de negócio.
- Mobile-first 320–430px; compatibilidade tablet/desktop, foco/teclado, labels, erros acionáveis, alvos >=44px, contraste, `prefers-reduced-motion`, carregamento perceptível, imagens otimizadas e carrinho resiliente a navegação e refresh.

## 4. Regras P0 — integridade de preço e pedido

O servidor é a fonte de verdade para preço, frete, imposto se aplicável, descontos, horário, configuração e estoque/disponibilidade. O cliente envia IDs, opções e quantidades, **não totais autoritativos**.

Fluxo canônico:
1. `GET catalog` por loja com versões/preços/disponibilidade.
2. `POST quote` valida variantes, itens, endereço, cobertura, horário, oferta e devolve detalhamento e prazo de validade do orçamento.
3. `POST orders` recebe `quoteId` + `idempotencyKey`, recalcula e grava atomica e duravelmente pedido e itens em snapshot comercial.
4. `POST/redirect payment` cria tentativa vinculada àquele pedido com provedor configurado; `payment_state` independente do `order_state`.
5. Webhook de provedor é autenticado, idempotente e transiciona status após conciliação; não confiar em parâmetros retornados pelo navegador como pagamento aprovado.
6. Operação recebe evento persistido para fila, KDS ou notificações; falha no envio exige retry com deduplicação e alerta, sem apagar o pedido.

**Falhas obrigatórias cobertas:** duplo toque, refresh/retry, expiração do quote, mudança de preço/estoque após seleção, pagamento abandonado/repetido/negado, falha de rede, indisponibilidade do gateway, taxa de entrega alterada, CEP fora da cobertura, estabelecimento fechado, reembolso/cancelamento e repetição de webhook.

Números monetários devem usar centavos inteiros ou decimal exato, nunca arredondamento implícito de `number` em cálculos financeiros. Horários respeitam timezone configurada da loja.

## 5. Modelo de dados conceitual

`tenants`, `stores`, `store_settings`, `opening_hours`, `service_zones`, `delivery_fees`, `categories`, `products`, `product_variants`, `option_groups`, `options`, `option_constraints`, `inventory_availability`, `promotions`, `customer_profiles`, `customer_addresses`, `quotes`, `orders`, `order_items_snapshot`, `order_adjustments`, `payments`, `payment_events`, `order_events`, `order_status_history`, `store_users`, `role_permissions`, `audit_log`.

Persistir em cada pedido: loja, moeda, origem/canal, itens com nomes e preços congelados, escolhas/observações, preço-base e adicionais, descontos, taxa de entrega, total e versão do orçamento, modalidade, informações essenciais de entrega, timestamps, identificador idempotente e estado de pagamento independente. Dados pessoais com finalidade, retenção mínima e controles LGPD.

**Segurança:** autenticação forte para operação, autorização no servidor e isolamento tenant/store testados; IDs não enumeráveis nas superfícies de cliente; sem exposição de WhatsApp operacional ou segredos no bundle; rate limit, logs saneados, validação de input, proteção contra CSRF quando aplicável e autorização para cancelamentos/estornos.

## 6. Contrato P0 — painel/PDV mínimo de entrega

- Gestor edita produtos, imagens, disponibilidade, variantes, taxa por região, promoções, horários, prazo, modalidades e dados da loja sem editar código.
- Tela de pedidos com novos pedidos claramente destacados, alertas sonoros controláveis, filtros e estados de loading/erro/sem pedidos; nunca mascarar backend offline como "sem pedidos".
- Aceite/rejeição justificável, sequência de preparo → pronto → entregue/retirado; transições autorizadas, registradas e coerentes com status do cliente.
- Impressão/KDS quando módulo estiver contratado e testado; o sistema **não** deve dizer "enviado para cozinha" se não tiver confirmação.
- Histórico com pedidos, pagamentos, ajustes, cancelamentos e usuário responsável.
- Perfis mínimos: proprietário/gestor e operador; caixa/cozinha/entregador apenas se módulo habilitado. Privacidade e isolamento entre lojas devem ser testados.

**Módulos de segunda fase**, não falsamente anunciados como entregues pelo padrão mínimo: mesas/comandas, controle de caixa completo, estoque por ingrediente/ficha técnica, relatórios avançados, multi-loja centralizado, fiscais NFC-e/NF-e, integrações marketplace, roteirização/entregador, funcionamento offline com sincronização. Cada módulo tem contrato, testes e liberação próprios.

## 7. Pipeline para novos projetos 0WEB

- Resolver entidade e material oficial (nome, logotipo, cardápio, preços, fotos, horário, endereço, cobertura) com prova/consentimento.
- Criar `storeId` estável ligado ao `clientKey`; separar identidade da landing do contrato transacional.
- Aplicar design autoral por cliente: arquitetura visual distinta, tokens por marca, imagens reais, SEO local, URL canônica, OG, dados estruturados apenas verdadeiros.
- Construir ou configurar catálogo, regras e modalidades antes de habilitar `order_enabled`.
- Provisionar backend, permissões, painel, integração de pagamentos quando solicitada, auditoria e monitoramento.
- Testar com **dados de teste** e credenciais de sandbox, nunca efetuar compra real sem autorização.
- Somente publicar compra ativa depois do gate de aceitação. Sem dados materiais: permitir prévia identificada e não indexada, não fingir pedido real.
- Preservar conteúdo e URLs úteis do projeto pré-existente; evolução aditiva, sem DNS e sem regressão de funis.

## 8. DELIVERY_OPERATIONAL_GATE — bloqueador de publicação

Um projeto só recebe `DELIVERY_READY=PASS` mediante evidências por estabelecimento, em ambiente equivalente à produção:

| Gate | Evidência mínima |
|---|---|
| Catalog truth | produto/preço/estoque/regra de opção batem com cadastro da loja |
| Configurable product | customizações válidas e inválidas, inclusive pizza fracionada quando aplicável |
| Cart persistence | adicionar/editar/remover, refresh, mudança de categoria e variação |
| Quote authority | preço/entrega/horário recalculados no servidor; bloqueios reais |
| Checkout | pedido salvo atomicamente, ID único e estado correto |
| Payment integrity | sandbox aprovado, recusado, duplicado, webhook repetido; ou pagamento offline explicitamente configurado |
| Fulfillment | pedido chega ao painel, operador transiciona, consumidor acompanha |
| Tenant isolation | usuário de loja A não lê/edita dados da loja B |
| Resilience | rede falha, backend indisponível, retry, concorrência e dedupe |
| Accessibility/mobile | 320/390/430/768/1440, teclado, leitor de tela básico, reduced motion |
| SEO | conteúdo de loja indexável quando apropriado; checkout, sessão e dados pessoais fora do índice |
| Privacy/observability | sem dados pessoais em analytics, logs saneados, auditoria por pedido |

**Status possíveis:** `NOT_STARTED`, `IN_PROGRESS`, `BLOCKED`, `PASS`, `FAIL`, `NOT_APPLICABLE` justificado. Sem evidência E2E não declarar `PASS`. Testes unitários de componentes isolados não substituem o pedido real do catálogo até a operação.

**Critério P0 de rejeição imediata:** preço inventado, pedido não persistido, carrinho só ilustrativo, WhatsApp como único "banco de pedidos", pagamento declarado confirmado sem webhook, status mentiroso, ausência de painel de pedidos, mistura de dados de clientes ou jornada mobile quebrada.

## 9. Plano de oito micro-rodadas de documentação e integração

| Rodada | Trabalho | Entregável verificável |
|---|---|---|
| 1 | Benchmark público, limites de evidência, inventário de projetos 0WEB | este contrato inicial + gap report |
| 2 | UX real da loja por categoria e estado, inspeção interativa da referência | fluxos, estados, prints, matriz adapt/reject |
| 3 | Cardápio/variantes, pizza, combos e regras comerciais | esquema de opções, precificação e exemplos |
| 4 | Carrinho, cotação, entrega, checkout e pagamento | contrato de API, state machines e erros |
| 5 | Gestão de pedidos, KDS/PDV e permissões | jornadas do operador + modelo de eventos |
| 6 | Arquitetura multi-tenant, persistência, segurança, LGPD | ERD, autorização, integrações e runbook |
| 7 | Plano de QA, testes E2E, acessibilidade, performance, antifraude | matriz de testes e `DELIVERY_OPERATIONAL_GATE` executável |
| 8 | Integração normativa nos playbooks/skills/manifests/readiness, revisão e PR | documentação canônica consolidada e vinculada no `main` |

**Oito rodadas são para documentar o alvo completo com critérios verificáveis e integrá-lo aos padrões 0WEB.** Não significam oito rodadas suficientes para desenvolver, ligar pagamentos, homologar e publicar todos os deliveries existentes; essa execução terá estimativa depois da auditoria do código e dos ambientes de cada loja.

## 10. Base real da 0WEB na inspeção de 2026-11-01

- `src/components/site/DlaraPizzariaPage.tsx`: landing de restaurante com `FunnelCTAButton`; no componente observado não existe carrinho, cotação de entrega ou checkout.
- `src/components/site/ParaisoHotDogPage.tsx`: há catálogo em array e carrinho em `useState`; o resumo vira entrada do `PortfolioCTAQuiz`. No componente observado não há persistência de pedido, integração do fluxo de checkout com API de pedidos ou painel operacional.
- Esses achados são evidência de **lacuna arquitetural dos componentes inspecionados**, não prova de que não exista qualquer backend alternativo ou serviço externo no projeto.

### Decisão de migração

1. Não apagar essas landings nem remover SEO, mídia, funis ou identidade.
2. Adicionar uma loja transacional ligada ao mesmo cliente, com `storeId` e jornada própria.
3. Integrar CTAs de "pedir agora" com a loja; manter contato/orçamento em funil próprio quando fizer sentido.
4. Só ativar publicação de pedidos depois de testes integrados e dados confirmados pelo responsável.

## 11. Relação com os contratos existentes

Este documento **complementa** (não substitui):
- `AGENTS.md` e `docs/0WEB_EXECUTION_CONTRACT.md` (execução, Git e PR);
- `docs/PORTFOLIO_PROJECT_LIFECYCLE.md` (manifest/readiness);
- `docs/PORTFOLIO_FUNNELS.md` (funis do cliente, `external_store`, lead-first);
- `docs/PORTFOLIO_REFERENCE_COMPOSITION_GOVERNANCE_STANDARD.md` (referências, anti-cópia, SCOPE_TRUTH/FRESHNESS);
- `docs/PORTFOLIO_UNIQUE_COMPOSITION_STANDARD.md` e `docs/PORTFOLIO_ZERO_GENERIC_STANDARD.md` (originalidade e design);
- `docs/PORTFOLIO_INDIVIDUAL_SITE_SEO_STANDARD.md` (SEO individual);
- `docs/RLS_CI_SECURITY_GATE.md` (segurança, não confundir gate pulado com aprovado).

Prioridade em colisão: segurança, integridade monetária e de pedido, LGPD e autorização → operação real → acessibilidade → identidade e originalidade → SEO/performance → conveniência visual. A política histórica de funil lead-first continua para captação, mas **pedido transacional exige persistência server-side própria**, distinta de lead.

## 12. Pendências e prova de completude

**Hoje o contrato é especificação inicial, não relatório de sistema finalizado.** Faltam:
- inspeção gráfica e interativa da Juma em navegador executando JavaScript;
- teste autorizado da jornada de compra, sem cobrança real;
- inspeção de autenticação e painéis de referência somente com acesso autorizado;
- auditoria mais ampla do código 0WEB para identificar componentes e serviços reaproveitáveis;
- derivação de schema/API executáveis e validação de pagamentos;
- implementação e CI do `DELIVERY_OPERATIONAL_GATE`, com teste cross-tenant;
- integração final nos manifestos e geração automática de novos projetos.

Não marcar `100% DOCUMENTADO`, `100% FUNCIONAL`, `PUBLICADO` ou `INDEXADO` enquanto o respectivo conjunto de evidências não existir.
