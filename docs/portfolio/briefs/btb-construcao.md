# Creative brief v3 — BTB Construção

Contrato: redesign material R3 · Slug/client_key: `btb-construcao`  
Data da evolução: 2026-09-21  
Objetivo: transformar a landing de catálogo de serviços em uma experiência de **organização inicial da reforma**, preservando fatos, funil e destino do cliente.

## 1. Business truth

- businessTruth: reformas internas e acabamentos em Curitiba e região.
- servicesVerifiedFromClientMaterial: pintura; elétrica; hidráulica; pisos e revestimentos; drywall e forro; acabamentos; iluminação LED.
- evidenceAvailable: flyer oficial fornecido pelo cliente + briefing já versionado.
- conditionVerifiedFromClientMaterial: garantia informada pela BTB de 90 dias.
- unknowns: CNPJ; endereço comercial; equipe; portfólio fotográfico real; redes sociais oficiais; website oficial; tabela de preços; prazo padrão de execução; condições de parcelamento vigentes.
- rule: unknown não vira claim.

## 2. Entity resolution 2026-09-21

Pesquisa pública refeita antes do redesign.

Consultas:
- `"BTB Construção" Curitiba reforma elétrica hidráulica drywall iluminação LED`
- `"BTB Construção" Curitiba Instagram Facebook`
- `"BTB Construção" "99970-6634"`

Resultado: **nenhuma presença pública de Curitiba foi resolvida com confiança suficiente**. A busca retornou homônimos/entidades diferentes, principalmente BTB Construções e Participações, sediada em Goiás e focada em infraestrutura/rodovias, e BTB Engenharia. Esses resultados foram rejeitados e nenhum dado deles foi promovido para a landing.

Fontes externas rejeitadas por conflito de entidade:
- https://btbconstrucoes.com.br/ — empresa de Goiás, escopo incompatível.
- https://play.google.com/store/apps/details?id=br.com.btbEngenharia.btb_engenharia_app — BTB Engenharia, entidade diferente.

A fonte factual continua sendo o material fornecido pelo cliente e os registros internos versionados.

## 3. Landing intent profile

- trafficIntent: comercial/local, visitante procurando reforma ou uma frente de serviço.
- trafficSource: desconhecida/variável; preservar UTM/referrer quando existirem.
- offerType: orçamento consultivo para serviço local.
- primaryJob: explicar uma reforma que pode envolver várias frentes.
- singleGoal: gerar pedido de orçamento qualificado no funil individual da BTB.
- primaryBarrier: transformar uma necessidade difusa ("quero reformar") em um escopo inicial compreensível.
- decisionComplexity: média/alta; diferentes serviços podem coexistir na mesma obra.
- riskDimensions: financeiro, operacional, prazo e interferência no ambiente.
- proofNeed: alta; porém prova publicada deve permanecer limitada ao que possui evidência.
- formStrategy: coletar contexto mínimo útil, sem repetir escolhas feitas na landing.
- transparencyPlan: explicar que seleção não calcula preço nem garante agenda; orçamento depende da avaliação.
- locationRequirement: Curitiba e Região Metropolitana, conforme material atual.
- postConversionPlan: lead persistido → resolver destino exclusivo do client_key → WhatsApp do cliente quando disponível.
- measurementPlan: CTA → início do funil → etapas → lead salvo → redirect resolvido/entregue.

## 4. Landing Decision Profile V2

- uncertainties:
  - quais frentes de serviço podem entrar no mesmo pedido;
  - que informação a equipe precisa para avaliar;
  - qual região e horizonte de início;
  - se a seleção da landing já segue para o atendimento.
- decisionSupport: Mapa da Reforma + lista editorial de frentes + linha de processo.
- valueDemonstration: organizar escopo antes da conversa, sem simular preço.
- formFriction: baixa; escolhas já feitas são pré-preenchidas no funil.
- proofStrategy: garantia de 90 dias fornecida pelo cliente; nenhuma avaliação, número de obras ou depoimento inventado.
- sourceContinuity: UTM/referrer mantidos pela infraestrutura existente.
- crossChannelContinuity: `client_key=btb-construcao`; destino não pode cair em outro cliente ou 0WEB.
- postConversionContinuity: confirmação/redirect segue o contrato canônico do portfolio.

## 5. Landing Decision Profile V3

- pageMode: `local_service`.
- decisionVelocity:
  - fastPathAvailable: sim, CTA direto abre o funil completo;
  - assistedPath: Mapa da Reforma;
  - avoidableStepsRemoved: serviço e tipo de espaço, quando já selecionados.
- informationScent:
  - "Montar mapa da reforma" leva ao decision aid;
  - "Continuar meu escopo" abre o funil na primeira informação ausente;
  - "Solicitar orçamento" abre o funil completo.
- selfSegmentation:
  - dimensions: frentes de serviço + tipo de espaço;
  - changesJourney: sim, os valores são levados como `initialAnswers`.
- contextCarryover:
  - service;
  - experience/spaceType;
  - source/referrer/UTM pela infraestrutura comum.
- commitmentLadder:
  - decision aid: selecionar escopo;
  - finalConversion: solicitar orçamento.
- claimEvidenceGraph:
  - serviços → flyer/brief do cliente;
  - Curitiba e região → flyer/brief do cliente;
  - garantia 90 dias → brief versionado como condição fornecida pelo cliente;
  - nenhuma condição de preço/parcelamento publicada nesta evolução.
- riskAdjustedPersuasion: `evidence_first`.
- actionStateModel: ARRIVAL → ORIENTED → SELF_SEGMENTED → INFORMED → QUALIFIED → COMMITTED → CONFIRMED.
- humanEscalationPolicy: especialista entra para avaliação de escopo, viabilidade e condição comercial.
- responseExpectationContract: landing não promete preço, agenda ou prazo; o funil organiza o pedido e segue ao canal da BTB.
- freshnessPolicy:
  - garantia: revalidar em futura alteração comercial;
  - área de atendimento: revalidar se houver mudança operacional;
  - serviços: revalidar se o cliente atualizar o flyer/brief.
- navigationLeakagePolicy: `focused`; navegação reduzida a âncoras/ação.
- mobileDecisionBudget: identidade → proposta → mapa → ação → fatos críticos.
- experimentReadiness: `hypothesis_required`; nenhum A/B aleatório nesta rodada.

## 6. Creative DNA

- brandPersonality: energética, direta, prática, industrial/editorial.
- visualMetaphor: **planta/escopo de obra que sai do improviso e ganha organização**.
- layoutTopology: hero full-bleed → decision aid técnico → lista linear de frentes → linha de obra → facts rail → fechamento editorial.
- heroArchetype: manifesto full-bleed com imagem conceitual explicitamente não documental.
- navigationArchetype: marca + ação; sem menu tradicional dominante.
- sectionRhythm: impacto → interação → inventário → processo → confiança → compromisso.
- typePairing: display pesada/condensada + sans legível.
- colorRoles: carvão = estrutura; amarelo segurança = orientação/ação; magenta = assinatura/estado ativo; papel claro = leitura.
- imageStrategy: usar mídia contextual existente como apoio; não apresentá-la como obra real.
- iconStrategy: Lucide apenas como sinalização funcional.
- motionGrammar: máscara/reveal no hero + entradas lineares no processo; sem loop ornamental.
- interactionSignature: Mapa da Reforma com multi-seleção e carryover para o funil.
- conversionNarrative: necessidade difusa → escopo inicial → região/prazo → orçamento.
- nearestPortfolioRisks: Easy Clean e demais páginas em hero split + cards + CTA.
- antiTemplateDecisions:
  - abandonar hero split;
  - abandonar grade de cards como narrativa dominante;
  - usar full-bleed + scope builder + rows/timeline;
  - CTA secundário não compete com conversão; apenas navega para decision aid.

## 7. Resource Effort Ledger

| resource | status | why / evidence | fallback / impact |
|---|---|---|---|
| flyer oficial do cliente | USED | fonte factual interna e referência de identidade | preservado em `docs/portfolio/source-materials/btb-construcao/flyer-reference.png` |
| busca web oficial | ATTEMPTED_BLOCKED | homônimos incompatíveis; nenhuma entidade Curitiba resolvida | não promover dados externos |
| Google/Maps | ATTEMPTED_BLOCKED | nenhuma entidade confirmada nesta rodada | manter localização apenas no nível Curitiba/região fornecido pelo cliente |
| redes sociais oficiais | ATTEMPTED_BLOCKED | nenhum perfil resolvido com confiança | não exibir social |
| fotos reais de obras | ATTEMPTED_BLOCKED | não existem assets documentais fornecidos | mídia conceitual claramente classificada |
| logo oficial separado | ATTEMPTED_BLOCKED | não há arquivo oficial isolado confirmado | wordmark/assinatura tipográfica; `logo.svg` legado não é alegado como marca histórica |
| hero contextual | USED | `hero.png` já existente, não documental | disclosure visível no hero |
| decision aid | USED | resolve a barreira "várias frentes na mesma reforma" | Mapa da Reforma |
| context carryover | USED | evita repetir serviço/tipo de espaço | `initialAnswers + skipPrefilledSteps` |
| motion | USED | orienta hierarquia sem ser protagonista | reduced motion mantido pelos primitives |
| SEO/entity | USED | title/description/canonical + schema específico BTB | sem telefone/endereço inventado |
| analytics/funnel | USED | infraestrutura canônica do portfolio | client_key preservado |
| preço/simulador | REJECTED | sem tabela verificada; simulação fabricaria condição | orçamento consultivo |
| mapa geográfico | NOT_APPLICABLE | endereço pontual não resolvido; apenas região | texto de cobertura |
| depoimentos/ratings | REJECTED | sem prova verificável | processo + garantia fornecida |
| 3D/vídeo pesado | REJECTED | nenhum ganho proporcional e sem mídia real | composição CSS + imagem existente |
| contato direto público | REJECTED | viola funnelOnly/isolation | funil individual server-side |

## 8. Media policy

- `hero.png`: GENERATED_CONTEXTUAL_MEDIA / documentary=false.
- `capa-card.jpg`, `capa-marca.jpg`, `hero-og.jpg`, `social-source.svg`: composições gráficas existentes; não são prova de obra real.
- `flyer-reference.png`: OWNER_SUPPLIED_REFERENCE / EVIDENCE_ONLY; não expor como CTA, contato ou imagem editorial se contiver PII.
- realBusinessPhotos: nenhuma confirmada nesta rodada.

Detalhes: `docs/portfolio/media-plans/btb-construcao.json`.

## 9. Funil e destino

- clientKey: `btb-construcao`.
- intent: `orcamento`.
- contactMode: `funnelOnly`.
- destino operacional existente preservado em `portfolio-whatsapp.json`.
- titularidade externa não foi revalidada por busca pública nesta rodada; o ledger de destinos registra o estado sem inventar verificação.
- nenhum fallback cross-client ou institucional.

## 10. Definition of Done deste piloto

- [x] pesquisa R1 reexecutada e conflitos de entidade registrados;
- [x] R2 factual preservada sem novos claims;
- [x] V2/V3 registrados;
- [x] Resource Effort Ledger preenchido;
- [x] composição estrutural redesenhada;
- [x] Mapa da Reforma implementado;
- [x] carryover da landing para o funil implementado;
- [x] claims de preço/parcelamento removidos por falta de revalidação;
- [x] mídia conceitual identificada como não documental;
- [ ] preview Vercel READY;
- [ ] gates/build verdes;
- [ ] runtime 390/768/1440 validado quando ferramenta de navegador estiver disponível;
- [ ] merge em `main`;
- [ ] produção READY;
- [ ] rota, funil, destino e isolamento revalidados após publicação.
