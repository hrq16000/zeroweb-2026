# 0WEB — Reference Corpus R5 · perfis locais, verificação e contexto de decisão

Status: **research ledger oficial / aditivo**  
Data: **2026-09-23**  
Escopo: quinta micro-rodada do corpus para novas `/portfolio/:slug`.

Esta rodada não adiciona engine, cluster, blocker ou interaction signature.
Ela registra padrões de **perfil local estruturado** que podem fortalecer
localidade, prova e educação de decisão em uma landing individual.

## 1. Fontes

### Resolvida

- https://acheioprofissional.com.br/mecanico/sao-jose-dos-pinhais-pr

### Não resolvida nesta rodada

- https://www.consertameucarro.com.br/oficina-mec-nica-carlos-filho-sao-jose-dos-pinhais-pr

A segunda URL falhou no fetch e também não foi resolvida por busca restrita ao
domínio. Estado: `INSUFFICIENT_EVIDENCE`.

Regra: não substituir por domínio parecido, página homônima ou perfil de outra
empresa.

## 2. REFERENCE_SIGNAL_MATRIX — Achei o Profissional

A página local combina:

- categoria + cidade logo no contexto principal;
- breadcrumb/localidade;
- quantidade de profissionais e parcela verificada;
- evidência agregada de Google Meu Negócio;
- perfis locais;
- taxonomia dos serviços comuns;
- sinais de “quando contratar”;
- conteúdo “como escolher”;
- orientação de faixa de preço;
- FAQ local;
- cidades/serviços próximos.

### Tradução útil para uma landing individual

Esses padrões podem virar, quando houver evidência:

- **LOCAL_IDENTITY_FACTS** — nome, categoria, cidade/região, cobertura e
  identidade verificável próximos do início;
- **VERIFICATION_NEAR_IDENTITY** — credencial, Google, certificação,
  autorização ou prova real perto da identidade/claim correspondente;
- **WHEN_TO_HIRE_GUIDANCE** — sintomas/situações que ajudam o visitante a
  reconhecer a necessidade;
- **HOW_TO_CHOOSE_GUIDANCE** — critérios objetivos de decisão, especialmente
  quando o serviço tem risco técnico/financeiro;
- **PRICE_CONTEXT_EDUCATION** — faixa/contexto somente quando a fonte é
  adequada, atual e não é apresentada como preço próprio do cliente;
- **LOCAL_CONTEXT_LINKING** — regiões, bairros ou necessidades relacionadas
  quando isso melhora discovery sem criar doorway pages.

## 3. O que NÃO transportar para /portfolio/:slug

- ranking de profissionais;
- “melhores da cidade” sem metodologia/fonte;
- contadores globais do diretório como se fossem dados do cliente;
- média agregada de vários profissionais como prova do cliente individual;
- faixa de preço de mercado apresentada como orçamento/preço da empresa;
- contato direto por WhatsApp bypassando o funil 0WEB;
- páginas massivas de cidade/categoria sem conteúdo realmente específico;
- claims de verificação sem evidência vinculada ao cliente.

## 4. Relação com engines existentes

Nenhum engine novo é necessário.

Combinações possíveis:

- `LOCATION_AND_NETWORK` + LOCAL_IDENTITY_FACTS;
- `EDUCATION_AND_RISK_REDUCTION` + WHEN_TO_HIRE_GUIDANCE;
- `FOUNDER_OR_SPECIALIST_TRUST` + VERIFICATION_NEAR_IDENTITY;
- `PROBLEM_TO_DIAGNOSIS` + sinais de quando contratar/sintomas.

O engine continua governando a página. Esses padrões apenas enriquecem a
informação/prova local.

## 5. Factualidade e freshness

Dados locais e de reputação podem envelhecer:

- rating;
- review count;
- status “verificado”;
- preço/faixa;
- quantidade de profissionais;
- horário;
- cobertura;
- endereço/telefone.

Quando usados na 0WEB, precisam seguir `FRESHNESS_MATRIX` e provenance.
Sem fonte atual, omitir ou rebaixar para contexto editorial não factual.

## 6. Resultado

R5 adiciona repertório de **perfil local estruturado** sem criar template.

Regra operacional:

> **Localidade e verificação devem reduzir incerteza do cliente individual;
> não reproduzir a lógica de ranking/comparação de um marketplace.**
