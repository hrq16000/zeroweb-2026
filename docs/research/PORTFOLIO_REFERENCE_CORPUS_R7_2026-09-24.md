# 0WEB — Reference Corpus R7 · profissões regulamentadas e limites de conteúdo

Status: **research ledger oficial / aditivo**  
Data: **2026-09-24**  
Escopo: micro-rodada de referências para novas `/portfolio/:slug`.

Esta rodada não cria experience engine nem interaction signature. Ela adiciona
uma matriz de governança para páginas de profissões regulamentadas, porque
credenciais, prova, formulários, preço e claims podem ter limites diferentes
conforme profissão, conselho/órgão, jurisdição e contexto.

Princípio:

> **REGRA DE OUTRA PROFISSÃO NÃO É PADRÃO REUTILIZÁVEL.**

## 1. Fontes com sinal estrutural útil

### Henrique Figueirôa — Psicólogos

https://henriquefigueiroa.com.br/psicologos

Sinais observados na referência:

- credencial profissional aparece como elemento de confiança;
- temas/problemas são descritos na linguagem de quem procura;
- modalidade online/presencial, horários e preço podem ser tratados como
  informação operacional;
- a referência evita depoimentos e promessas de resultado para psicologia;
- a página diferencia claramente informação profissional de propaganda.

**Importante:** esses pontos são observações da referência. Qualquer regra
profissional precisa ser revalidada em fonte oficial vigente antes de virar
claim ou restrição normativa de um projeto 0WEB.

### Henrique Figueirôa — Fisioterapeutas

https://henriquefigueiroa.com.br/fisioterapeutas

Sinais observados:

- busca organizada por queixa/sintoma, não apenas nome técnico da especialidade;
- convênio, reembolso, atendimento domiciliar e região mudam a decisão;
- credencial/CREFITO é tratada como prova profissional;
- a referência apresenta depoimento como recurso condicionado a consentimento;
- localização e atendimento em casa alteram estrutura e conteúdo.

Novamente: nenhuma regra profissional é importada sem resolução em fonte oficial.

### Henrique Figueirôa — Médicos

https://henriquefigueiroa.com.br/medicos

Sinais observados:

- especialidade, convênios, endereço, horário e credencial profissional aparecem
  como informação de decisão;
- privacidade ganha peso porque o contexto pode envolver dados de saúde;
- mobile e contato rápido são tratados como parte da experiência;
- prova profissional depende mais de clareza, credencial e presença do que de
  claims promocionais genéricos.

### Henrique Figueirôa — Advogados

https://henriquefigueiroa.com.br/advogados

Sinais observados:

- áreas de atuação são traduzidas para problemas reconhecíveis pelo visitante;
- credenciais/equipe/localidade sustentam confiança;
- formulário curto evita incentivar descrição sensível do caso;
- a referência evita promessa de resultado, placar de causas e superlativos;
- preço é tratado como dado/escopo, não como isca promocional;
- conteúdo explicativo substitui prova baseada em resultado individual.

Esses sinais exigem revalidação oficial da OAB aplicável antes de implementação.

## 2. Nova matriz — PROFESSIONAL_COMPLIANCE_BOUNDARY_MATRIX

Para qualquer projeto em profissão regulamentada, avaliar antes de hero, prova,
formulário e CTA:

```text
profession:
jurisdiction:
officialAuthority:
officialSources:
rulesVerifiedAt:
credentialDisplay:
credentialFreshness:
allowedProof:
conditionalProof:
forbiddenProof:
pricingTreatment:
promotionalClaimLimits:
testimonialPolicy:
caseResultPolicy:
sensitiveDataBoundary:
formFieldPolicy:
contactHandoffPolicy:
requiredDisclosures:
localityRequirements:
accessibilityOrSpecialDuty:
sourceConflicts:
unresolvedQuestions:
implementationNotes:
```

Estados recomendados para cada item:

- `VERIFIED_ALLOWED`
- `VERIFIED_CONDITIONAL`
- `VERIFIED_FORBIDDEN`
- `NOT_APPLICABLE`
- `UNRESOLVED_REQUIRES_OFFICIAL_SOURCE`

## 3. Regras de uso

1. A referência comercial nunca é fonte final de regra profissional.
2. Conselho, órgão regulador, legislação ou fonte oficial aplicável deve ser
   resolvido antes da implementação de claim/restrição.
3. Regra de psicologia não migra para fisioterapia, medicina, advocacia ou outra
   profissão.
4. Regra vigente em uma jurisdição/data não é presumida vigente em outra.
5. Testemunho, caso, resultado, preço promocional, antes/depois e credencial só
   entram quando a matriz permitir e houver evidência/proveniência.
6. Formulário deve pedir o mínimo necessário e evitar captura antecipada de
   detalhe sensível sem necessidade operacional.
7. Credencial precisa ser verdadeira, verificável e atualizável.
8. Quando a regra não estiver resolvida, a página escolhe a alternativa mais
   conservadora sem inventar proibição inexistente.

## 4. Relação com experiência e composição

A matriz não define layout.

Pode afetar:

- ordem da prova;
- conteúdo do hero;
- posição e forma das credenciais;
- presença/ausência de depoimentos;
- desenho do formulário;
- microcopy de preço;
- FAQ;
- tipo de mídia;
- intensidade de CTA;
- handoff humano;
- conteúdo local;
- privacy notice.

Ela normalmente combina com:

- `FOUNDER_OR_SPECIALIST_TRUST`;
- `EDUCATION_AND_RISK_REDUCTION`;
- `PROCESS_AND_TRANSPARENCY`;
- `PROBLEM_TO_DIAGNOSIS`, quando o serviço realmente comportar triagem.

## 5. Meta-referências desta rodada

### FlamePages

https://flamepages.com/pt

A referência expõe:

- geração de múltiplas arquiteturas candidatas;
- design lint;
- quality gate;
- reparo visual em 390/768/1440;
- versionamento/restauração;
- origem/UTM em leads;
- builder editável e publicação em domínio próprio.

Esses sinais **confirmam mecanismos já existentes no 0WEB**:
direções divergentes, gates, QA real em múltiplos viewports, versionamento,
tracking e publicação. Não criam novo engine ou matriz nesta rodada.

### Achei o Profissional

https://acheioprofissional.com.br/mecanico/sao-jose-dos-pinhais-pr

Confirma:

- categoria + localidade;
- lista de provedores;
- perfis, prova e contato;
- conteúdo local;
- descoberta por intenção.

Já coberto por `PRODUCT_OR_SERVICE_FINDER`, `LOCATION_AND_NETWORK` e
`CATEGORY_THEN_LOCATION`.

### Conserta Meu Carro

https://www.consertameucarro.com.br/

Confirma:

- busca por cidade;
- busca por serviço/categoria;
- taxonomia extensa;
- diretório nacional.

Também não cria novo padrão além de finder + localidade + taxonomia.

## 6. Fontes que continuam sem expansão

- https://flamepages.com/pt — útil, mas seus principais mecanismos já existem no
  0WEB;
- https://acheioprofissional.com.br/mecanico/sao-jose-dos-pinhais-pr — útil como
  confirmação;
- https://www.consertameucarro.com.br/ — útil como confirmação.

A regra permanece: corpus cresce por **delta de capacidade**, não por quantidade
de URLs.

## 7. Motion

`motionObserved = NOT_VERIFIED` para as páginas profissionais desta rodada.

FlamePages descreve QA e builder, mas não é usado como evidência de easing,
parallax, stagger ou coreografia de motion das páginas geradas.

## 8. Anti-padrões

- importar regra profissional de blog/site comercial como se fosse normativa;
- reutilizar a mesma política de depoimentos para profissões diferentes;
- coletar relato sensível em formulário genérico sem necessidade;
- inventar credencial ou deixar registro profissional desatualizado;
- usar caso/resultado individual como prova quando a regra aplicável não estiver
  resolvida;
- transformar compliance em rodapé jurídico sem efeito na experiência;
- criar uma landing visualmente idêntica e trocar apenas sigla do conselho.

## 9. Resultado da micro-rodada

Delta real:

- **+1 matriz de governança:** `PROFESSIONAL_COMPLIANCE_BOUNDARY_MATRIX`;
- **+4 rotas profissionais úteis como referência estrutural**;
- **+0 experience engines**;
- **+0 interaction signatures**;
- **+0 motion observado**;
- FlamePages, Achei o Profissional e Conserta Meu Carro confirmam padrões
  existentes sem expandir a taxonomia.

Regra preservada:

> **ABSORB GRAMMAR — NEVER COPY SILHOUETTE.**
