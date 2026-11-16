# 0WEB — Reference Corpus R3 · interaction signatures para assistência e tecnologia local

Status: **research ledger oficial / aditivo**  
Data: **2026-09-23**  
Escopo: terceira micro-rodada do corpus de referências para novas `/portfolio/:slug`.

Este ledger não adiciona novos experience engines. Ele registra apenas
**assinaturas de interação/decisão** que podem ser combinadas aos motores já
existentes quando houver evidência real do negócio.

Princípio:

> **ASSINATURA DE INTERAÇÃO ≠ NOVO TEMPLATE.**

## 1. Fontes desta micro-rodada

Com evidência suficiente nesta R3:

1. https://bryytech.com.br/
2. https://www.eletronicafast.com.br/
3. https://grupordmcuritiba.com.br/
4. https://www.rssolution.com.br/
5. https://infocaseinformatica.com.br/
6. https://aiconbr.com.br/ — apenas identidade/escopo básico confirmado nesta rodada.

Sem evidência suficiente nesta rodada:

- https://irepair.com.br/ — fetch indisponível;
- https://vendas.infocaseinformatica.com.br/ — timeout;
- https://assistencia-rose.vercel.app/ — cache miss;
- https://novageracaoinformatica.com.br/?page_id=9 — timeout.

Esses últimos ficam como `INSUFFICIENT_EVIDENCE` e não alimentam padrões
normativos até nova inspeção confiável.

## 2. Assinaturas novas compatíveis

### SERVICE_MODE_SELECTOR

Pergunta dominante:

> **Como você quer ser atendido?**

Aplicável quando o negócio realmente oferece modalidades com diferenças
operacionais relevantes, como:

- padrão;
- emergencial;
- agendado;
- domicílio;
- retirada/entrega;
- remoto;
- presencial.

Não usar como tabs decorativas. A escolha deve alterar o contexto do funil,
expectativa de prazo, disponibilidade, logística ou preço quando isso for real.

Referência principal desta R3: Bryy Tech.

### CATEGORY_THEN_LOCATION

Pergunta dominante:

> **Qual categoria/equipamento você precisa resolver e onde isso deve ser atendido?**

Útil quando categoria técnica e unidade/região realmente mudam o caminho do
cliente.

Pode assumir:

- equipamento → unidade;
- marca → categoria → unidade;
- linha de produto → laboratório/domicílio;
- categoria → região/cobertura.

Referência principal desta R3: Eletro Fast.

### SYMPTOM_TO_SERVICE_MODE

Pergunta dominante:

> **Qual é o sintoma e qual modalidade faz sentido para esse caso?**

Combina taxonomia de sintomas com modo de atendimento e pode reduzir a distância
entre `PROBLEM_TO_DIAGNOSIS` e o funil.

Exemplo de tradução:
- “não liga” → equipamento/categoria → loja;
- “não posso transportar” → domicílio/retirada;
- “preciso hoje” → emergencial, se houver de fato.

Referências desta R3: Grupo RDM e Bryy Tech.

### SERVICE_PLUS_COMMERCE_CONTINUITY

Pergunta dominante:

> **Preciso consertar, comprar uma peça/produto ou acompanhar outra ação?**

Aplicável quando serviço técnico e comércio coexistem de verdade.

A página pode separar caminhos sem transformar tudo em “serviços”:
- reparo/diagnóstico;
- peças;
- seminovos/produtos;
- instalação;
- acompanhamento/status;
- rastreio de pedido.

Referências desta R3: Eletro Fast e RS Solution.

### WARRANTY_ELIGIBILITY_TRIAGE

Pergunta dominante:

> **Este caso segue garantia/autorizada ou atendimento particular?**

Aplicável somente quando o negócio possui fluxo real de garantia ou assistência
autorizada. Pode solicitar, quando necessário e proporcional:

- marca/modelo;
- voltagem;
- nota fiscal/data de compra;
- serial/etiqueta;
- defeito/sintoma;
- endereço e janela de atendimento.

A coleta deve obedecer minimização de dados e só existir se alterar o fluxo.

Referência desta R3: RS Solution.

### PRODUCT_IDENTITY_CAPTURE

Pergunta dominante:

> **Qual equipamento exato precisa de atendimento?**

Pode usar categoria, marca, modelo, sintoma e identificação técnica do produto
quando isso reduz erro de roteamento, repetição de perguntas ou visita
improdutiva. Foto de etiqueta só entra quando houver necessidade real e tratamento
compatível com privacidade.

Referência desta R3: RS Solution; aplicável também a jornadas técnicas em que a
categoria muda equipe, unidade ou diagnóstico.

## 3. REFERENCE_SIGNAL_MATRIX — R3

| Fonte | Sinal útil | Assinatura compatível | Tradução 0WEB | Classe |
|---|---|---|---|---|
| Bryy Tech | atendimento padrão, emergencial, agendado e domicílio | SERVICE_MODE_SELECTOR | deixar o visitante escolher modalidade quando isso altera prazo/logística/preço real | USE |
| Bryy Tech | serviços por problema + atendimento por modalidade | SYMPTOM_TO_SERVICE_MODE | conectar sintoma ao modo de atendimento e carregar contexto para o funil | USE |
| Eletro Fast | duas frentes técnicas + cinco unidades + loja online | CATEGORY_THEN_LOCATION | equipamento/categoria pode preceder unidade/rota de atendimento | USE |
| Eletro Fast | assistência + peças + seminovos + rastreio | SERVICE_PLUS_COMMERCE_CONTINUITY | manter jornadas técnicas e comerciais distintas, mas coerentes | USE |
| Grupo RDM | especialização em micro-ondas + orçamento + loja física | SYMPTOM_TO_SERVICE_MODE | problema específico pode levar a orçamento/localidade sem carregar home genérica | ADAPT |
| RS Solution | assistência + instalação + peças + contratos + formulário de garantia com identificação do equipamento | SERVICE_PLUS_COMMERCE_CONTINUITY · WARRANTY_ELIGIBILITY_TRIAGE · PRODUCT_IDENTITY_CAPTURE | separar serviço/comércio e usar triagem de elegibilidade/identidade apenas quando operacionalmente necessária | ADAPT |
| Infocase | software fiscal + venda de equipamentos + suporte presencial/remoto/telefone/e-mail | SERVICE_MODE_SELECTOR | em B2B técnico, canal/modalidade pode ser parte central da decisão | ADAPT |
| Aicon | assistência em computadores/notebooks/celulares em SJP | — | escopo básico confirmado, sem sinal estrutural forte suficiente nesta rodada | INSUFFICIENT_EVIDENCE |

## 4. O que não vira novo engine

Nenhuma das assinaturas acima cria um novo experience engine porque elas são
**mecanismos locais de escolha**, não a lógica que governa a página inteira.

Exemplos:

- `PROBLEM_TO_DIAGNOSIS` pode usar `SYMPTOM_TO_SERVICE_MODE`;
- `LOCATION_AND_NETWORK` pode usar `CATEGORY_THEN_LOCATION`;
- `PROCESS_AND_TRANSPARENCY` pode usar `SERVICE_MODE_SELECTOR`;
- `INVENTORY_OR_PRODUCT_BROWSING` pode coexistir com
  `SERVICE_PLUS_COMMERCE_CONTINUITY`.

Isso evita inflar o corpus até virar um catálogo de templates.

## 5. Regras de uso

Uma interaction signature só entra se:

1. responder a uma pergunta real do visitante;
2. houver dados/estado suficientes para a escolha;
3. a seleção produzir consequência funcional ou narrativa;
4. funcionar em teclado/touch e mobile;
5. preservar contexto no funil;
6. não inventar disponibilidade, prazo, cobertura ou preço.

Se a escolha não muda nada depois do clique, ela é decoração e deve ser removida.

## 6. Motion derivado — não observado

Candidatos compatíveis:

- SERVICE_MODE_SELECTOR → state transition curta entre modalidades;
- CATEGORY_THEN_LOCATION → progressivo categoria → unidade;
- SYMPTOM_TO_SERVICE_MODE → reveal por diagnóstico/decisão;
- SERVICE_PLUS_COMMERCE_CONTINUITY → switch claro entre jornada de serviço e compra.

Esses candidatos são implementação própria 0WEB. Nenhum easing, duração,
parallax ou microtransição foi afirmado como observado nas referências desta R3.

## 7. Anti-padrões observados/derivados

- CTA repetido em toda página quando uma escolha guiada seria melhor;
- página de marca/equipamento duplicada apenas para SEO sem mudança real de conteúdo;
- misturar peças, serviço, produto e atendimento numa grade única;
- selector que não preserva contexto;
- modalidade “emergencial” sem disponibilidade/freshness real;
- claims absolutos de sucesso/qualidade sem fonte;
- transformar lista longa de equipamentos em experiência principal sem busca/filtro.

## 8. Resultado

A R3 amplia o repertório de interação sem alterar a lista de experience engines.

Regra operacional:

> **O engine governa a página; a interaction signature resolve uma decisão local.**

Isso deve aumentar variedade funcional sem recriar templates por segmento.
