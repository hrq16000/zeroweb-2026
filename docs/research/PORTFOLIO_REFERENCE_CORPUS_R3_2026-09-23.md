# 0WEB — Reference Corpus R3 · interaction signatures para assistência/tecnologia

Status: **research ledger oficial / aditivo**  
Data: **2026-09-23**  
Escopo: terceira micro-rodada do corpus de referências para novas `/portfolio/:slug`.

Esta rodada **não cria novos experience engines**. Ela amplia apenas o repertório
de assinaturas de interação e de roteamento da decisão.

Princípio:

> **INTERAÇÃO BOA REDUZ UMA INCERTEZA REAL; NÃO EXISTE PARA “DEIXAR A LANDING MAIS MODERNA”.**

## 1. Fontes verificadas nesta micro-rodada

- https://bryytech.com.br/
- https://www.eletronicafast.com.br/
- https://www.rssolution.com.br/
- https://vendas.infocaseinformatica.com.br/
- https://aiconbr.com.br/
- https://grupordmcuritiba.com.br/sjp/

Também foram observadas rotas internas relevantes de Bryy Tech, Eletro Fast e
RS Solution.

### URLs não resolvidas com segurança nesta rodada

As URLs abaixo foram fornecidas como referência, mas não produziram evidência
suficiente/estável no crawl atual. **Não substituir por domínio semelhante.**

- https://irepair.com.br/
- https://assistencia-rose.vercel.app/
- https://novageracaoinformatica.com.br/?page_id=9

Um resultado de busca para outro domínio, marca homônima ou domínio historicamente
parecido não é evidência suficiente para atribuir os sinais à URL fornecida.

## 2. REFERENCE_SIGNAL_MATRIX — R3

| Fonte | Sinal novo | Tradução 0WEB | Classe |
|---|---|---|---|
| Bryy Tech | atendimento separado em padrão, emergencial, agendado e domicílio | permitir que “como quero ser atendido?” seja decisão primária antes do catálogo completo | USE |
| Eletro Fast | categoria de equipamento → processo → unidade; assistência física + loja de peças | categoria/localidade podem conduzir a jornada; serviço e comércio podem fazer handoff sem se misturar | USE |
| RS Solution | autorizada por marca + multimarcas + peças; formulário de garantia coleta modelo, voltagem, NF, endereço, defeito, data/período | elegibilidade e identidade do produto podem virar triagem estruturada antes do atendimento | USE |
| Grupo RDM SJP | serviço único/urgente + loja/domicílio/busca-entrega + bairros + FAQ de custo-benefício | combinar sintoma com modalidade/logística, sem obrigar visitante a percorrer catálogo genérico | ADAPT |
| Infocase | dor operacional → capacidade do sistema → suporte humano + manutenção | em B2B, problema operacional pode rotear para capacidade e suporte, não apenas para “features” | ADAPT |
| Aicon | hero técnico + depoimentos curtos sem provenance visível no HTML auditado | usar somente como alerta: prova social precisa de fonte; não importar nomes/frases como decoração | REJECT para proof |

## 3. INTERACTION_SIGNATURE_MATRIX — novas assinaturas

### SERVICE_MODE_SELECTOR

Pergunta resolvida: **como o cliente quer/precisa ser atendido?**

Estados possíveis, quando reais:

- padrão;
- emergencial;
- agendado;
- domicílio;
- retirada/entrega;
- laboratório/loja;
- remoto/presencial.

Não exibir modalidade inexistente apenas para enriquecer a interface.

### CATEGORY_THEN_LOCATION

Pergunta resolvida:

1. **qual categoria/equipamento?**
2. **qual unidade/modalidade pode atender?**

Útil quando unidades/equipes possuem capacidades diferentes ou quando o tipo de
produto muda logística/diagnóstico.

### WARRANTY_ELIGIBILITY_TRIAGE

Pergunta resolvida: **este atendimento segue fluxo de garantia ou particular?**

Pode exigir, quando factual e necessário:

- modelo;
- voltagem;
- nota fiscal/data;
- etiqueta/serial;
- tipo de solicitação;
- endereço;
- período de atendimento.

A coleta deve respeitar minimização de dados e privacidade.

### PRODUCT_IDENTITY_CAPTURE

Pergunta resolvida: **qual equipamento exato está com problema?**

Campos podem incluir categoria, marca, modelo, sintoma e foto da etiqueta.
Objetivo: reduzir retrabalho e melhorar o contexto do funil.

### SERVICE_PLUS_PARTS_HANDOFF

Pergunta resolvida: **o visitante precisa de reparo ou da peça/produto?**

A landing pode direcionar para jornadas diferentes sem misturar:

- serviço;
- instalação;
- venda de peça;
- catálogo;
- encomenda.

Na 0WEB, qualquer handoff deve respeitar o contrato do projeto e não criar
contato paralelo/bypass do funil.

### SYMPTOM_TO_SERVICE_MODE

Pergunta resolvida:

1. **o que está acontecendo?**
2. **qual forma de atendimento faz sentido?**

Exemplo conceitual:
`não liga → diagnóstico → loja/domicílio/retirada conforme evidência e escopo`.

Não transformar sintomas em diagnóstico clínico/técnico definitivo sem
avaliação real.

## 4. Regra de compatibilidade com EXPERIENCE_ENGINE_MATRIX

Interaction signature **não é experience engine**.

Um projeto pode ter:

`primaryEngine = PROBLEM_TO_DIAGNOSIS`

e usar:

`interactionSignature = SYMPTOM_TO_SERVICE_MODE`

Outro pode ter:

`primaryEngine = LOCATION_AND_NETWORK`

e usar:

`interactionSignature = CATEGORY_THEN_LOCATION`.

A assinatura existe dentro da arquitetura dominante; não cria outra arquitetura
concorrente.

## 5. Proof/factuality findings

Esta rodada reforça duas regras já canônicas:

1. depoimento, nome, rating, contagem ou claim de performance só entra com
   provenance verificável;
2. claims como “reparo em X minutos”, “X% de sucesso”, “mais de N clientes”,
   “mais de N anos” ou disponibilidade precisam de fonte e freshness adequada.

Não classificar como falso apenas porque a fonte não aparece no crawl. O estado
correto é **UNVERIFIED / NÃO USAR COMO EVIDÊNCIA ATÉ VERIFICAR**.

## 6. Form complexity principle

Formulário deve acompanhar a decisão.

- lead simples → poucos campos;
- diagnóstico técnico → equipamento + sintoma;
- garantia → identificação/elegibilidade;
- visita → localização + janela;
- B2B → contexto operacional mínimo necessário.

Formulário grande por padrão é anti-pattern. Formulário grande pode ser correto
quando cada campo reduz uma incerteza operacional real.

## 7. Skill translation — R3

- SERVICE_MODE_SELECTOR → UX/CRO + funnel state + truth/freshness;
- CATEGORY_THEN_LOCATION → entity/location research + local SEO + accessible selector;
- WARRANTY_ELIGIBILITY_TRIAGE → forms + privacy/LGPD + validation + funnel carryover;
- PRODUCT_IDENTITY_CAPTURE → forms + media upload when justified + privacy;
- SERVICE_PLUS_PARTS_HANDOFF → commerce/service boundary + routing + conversion;
- SYMPTOM_TO_SERVICE_MODE → decision intelligence + scope truth + funnel context;
- proof sem provenance → factuality gate + evidence research.

## 8. Motion candidates derivados — não observados

Nenhum efeito visual específico é declarado como observado nesta R3.

Candidatos próprios da 0WEB, quando justificáveis:

- selector state transition;
- progress state para triagem;
- categoria → unidade com transição de contexto;
- confirmação visual de elegibilidade;
- handoff serviço → peça com mudança de estado, não de site inteiro.

Sempre com `prefers-reduced-motion`, teclado e orçamento de performance.

## 9. Anti-padrões rejeitados

- selector que só muda aparência e não muda decisão;
- modalidade “emergencial” sem capacidade operacional comprovada;
- formulário de garantia em serviço fora de garantia;
- pedir CPF/NF/endereço antes de existir necessidade operacional;
- misturar loja e assistência no mesmo CTA/contexto;
- depoimentos copiados sem fonte;
- claim de rapidez, sucesso, rating ou escala sem provenance/freshness;
- substituir URL indisponível por marca/domínio parecido.

## 10. Resultado desta micro-rodada

R3 **não aumenta a quantidade de engines**.

Ela melhora a execução dos engines existentes com seis assinaturas de interação:

`SERVICE_MODE_SELECTOR`  
`CATEGORY_THEN_LOCATION`  
`WARRANTY_ELIGIBILITY_TRIAGE`  
`PRODUCT_IDENTITY_CAPTURE`  
`SERVICE_PLUS_PARTS_HANDOFF`  
`SYMPTOM_TO_SERVICE_MODE`

Isso amplia a variedade funcional das futuras landings sem criar outra família
de templates.
