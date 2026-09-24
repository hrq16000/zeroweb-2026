# 0WEB — Reference Corpus R4 · source classes e uso correto das referências

Status: **research ledger oficial / aditivo**  
Data: **2026-09-23**  
Escopo: quarta micro-rodada do corpus de referências para novas `/portfolio/:slug`.

Objetivo: impedir que toda URL fornecida seja tratada como referência de layout.

Princípio:

> **A FONTE DE PESQUISA NÃO DEFINE AUTOMATICAMENTE A FONTE DE COMPOSIÇÃO.**

## 1. Classes de fonte

### COMPOSITION_REFERENCE

Site/página cujo valor principal está em:
- arquitetura de decisão;
- composição;
- ritmo;
- mídia;
- interação;
- prova;
- jornada.

Pode alimentar:
`ROLE_MATRIX · COMPOSITION_MATRIX · RHYTHM_MEDIA_MATRIX · ANTI_COPY_MATRIX`.

Ex.: FFIX, Profitize, Service One, Impacto Prime.

### ENTITY_DISCOVERY_SOURCE

Fonte útil para descobrir:
- nome/entidade;
- serviço;
- endereço;
- telefone;
- cidade/região;
- sintomas;
- categorias;
- preços de mercado;
- concorrentes;
- avaliações/Google quando verificáveis.

Não deve definir hero, section order, grid, motion ou estilo visual.

Ex.: diretórios e marketplaces locais.

### META_METHOD_REFERENCE

Artigo/guia/plataforma que ensina:
- CRO;
- tipos de landing;
- fricção de formulário;
- CTA;
- page mode;
- boas práticas.

Serve para estratégia, não como evidência visual de um cliente.

Ex.: HubSpot, Wix, Hotmart, RD Station, Unbounce, EAD Plataforma.

### ANTI_PATTERN_REFERENCE

Fonte cuja principal utilidade é mostrar o que evitar:
- domínio/conteúdo incoerente;
- métricas não verificadas;
- prova social fraca;
- skeleton repetitivo;
- claims genéricos.

### INSUFFICIENT_EVIDENCE

Fonte inacessível, ambígua, sem crawl suficiente ou com evidência insuficiente.
Não pode gerar regra estrutural até nova inspeção confiável.

## 2. Diretórios inspecionados

### Achei o Profissional

A página local de mecânicos funciona como diretório:
- lista profissionais;
- cidade;
- serviço;
- sinais de Google;
- contagem por localidade;
- sintomas/necessidades;
- guia de contratação;
- FAQ;
- contato direto.

Valor para 0WEB:
`ENTITY_DISCOVERY_SOURCE`.

Pode ajudar no enrichment e discovery de:
- concorrentes;
- serviços recorrentes;
- vocabulário local;
- sintomas;
- cobertura;
- intenção de busca.

Não usar como referência de landing premium: a arquitetura responde ao problema
de **comparar vários profissionais**, não de vender um cliente individual.

### Conserta Meu Carro

Perfis individuais expõem:
- nome;
- endereço;
- telefone;
- serviços;
- localização/mapa;
- descrição operacional.

Valor para 0WEB:
`ENTITY_DISCOVERY_SOURCE`.

Pode confirmar escopo/localidade e revelar categorias de serviço, mas não deve
ser copiado como composição de mini-site premium.

## 3. Artigos/metodologia inspecionados

HubSpot, Wix, Hotmart e EAD Plataforma reforçam:
- landing orientada por objetivo;
- CTA coerente;
- formulário proporcional;
- profundidade variável por page mode;
- mobile/performance;
- diferentes tipos de landing.

Esses princípios já estão cobertos por:
- LandingDecisionProfileV3;
- EXPERIENCE_ENGINE_MATRIX;
- conversion/funnel standards;
- truth/freshness;
- capability palette.

Portanto entram como `META_METHOD_REFERENCE`, sem nova norma nesta rodada.

## 4. REFERENCE_SOURCE_CLASS_MATRIX

Campos:

`source | sourceClass | usableFor | forbiddenFor | evidenceStrength |
freshness | notes`

Exemplo:

| sourceClass | usableFor | forbiddenFor |
|---|---|---|
| COMPOSITION_REFERENCE | composição, ritmo, interação, mídia, decisão | copiar silhueta/identidade |
| ENTITY_DISCOVERY_SOURCE | entidade, serviços, localidade, vocabulário, concorrência | definir layout/motion |
| META_METHOD_REFERENCE | CRO, page mode, formularios, CTA, método | servir como prova do cliente |
| ANTI_PATTERN_REFERENCE | aprender o que rejeitar | virar preset |
| INSUFFICIENT_EVIDENCE | backlog de nova inspeção | qualquer regra normativa |

## 5. Regra de seleção

Ao receber várias URLs:

1. classificar todas por `sourceClass`;
2. selecionar 2–4 `COMPOSITION_REFERENCE` complementares;
3. usar `ENTITY_DISCOVERY_SOURCE` para enrichment, nunca para copiar layout;
4. usar `META_METHOD_REFERENCE` apenas para método/CRO;
5. registrar `ANTI_PATTERN_REFERENCE` como rejeição explícita;
6. ignorar estruturalmente `INSUFFICIENT_EVIDENCE` até nova evidência.

## 6. Resultado

Esta rodada não cria novo engine, signature ou blocker.

Ela reduz um erro de processo: misturar diretório, artigo, concorrente e
referência visual como se fossem equivalentes.

Regra operacional:

> **Primeiro classifique a fonte. Depois decida o que ela tem autoridade para ensinar.**
