# 0WEB — Plano de evolução por micro-rodadas

Status: **ativo**
Início: 2026-09-25
Escopo: `/portfolio`

Objetivo: reduzir dívida de similaridade visual, identidade e mídia sem redesenho
indiscriminado, preservando funis, SEO, dados comprovados e estabilidade de produção.

## Regras operacionais

Cada micro-rodada deve:

1. atuar em no máximo 1–2 projetos de alto risco;
2. preservar conteúdo factual e funil do cliente;
3. alterar composição materialmente, não apenas cores;
4. rodar originality gate, typecheck, unitários, build/SSR e regressão visual;
5. publicar somente com gates verdes;
6. medir o novo score antes de iniciar a próxima rodada;
7. não tocar projetos fora do alvo sem necessidade técnica direta.

## Baseline — 2026-09-25

Catálogo canônico: **96 projetos**.

Originalidade:
- ORIGINAL: 1
- ACCEPTABLE: 32
- ATTENTION: 58
- HIGH_SIMILARITY: 5
- CLONE: 0

Dívida visual:
- logos placeholder: 26
- capas válidas: 48
- capas pendentes: 48

HIGH_SIMILARITY atual:
- `bruna-diarista` ↔ `popys-conservacao-limpeza`: score 66
- `easy-clean` ↔ `bruna-diarista`: score 65
- `embalar-embalagens` ↔ `maximos-cabeleireiros`: score 61

## Onda 1 — eliminar HIGH_SIMILARITY

### Micro 1A — Bruna Diarista — CONCLUÍDA
Resultado: Bruna saiu de HIGH_SIMILARITY; total crítico caiu de 5 para 4.

Objetivo: quebrar o cluster Bruna/POPYS/Easy Clean.

Direção:
- trocar hero split por composição editorial vertical;
- tornar tabela de diárias a estrutura dominante;
- introduzir navegação lateral/índice de agenda;
- alterar ordem dos capítulos;
- reduzir card-grid genérico;
- preservar preços, serviços e disponibilidade confirmados;
- manter o mesmo funil.

Gate de saída:
- Bruna abaixo de HIGH_SIMILARITY;
- nenhuma regressão em outros projetos;
- build/SSR e visual verdes.

### Micro 1B — POPYS — CONCLUÍDA
Resultado: POPYS saiu de HIGH_SIMILARITY; Easy Clean caiu para ATTENTION. Total crítico: 4 → 2.

Baseline após 1A: POPYS ↔ Easy Clean = 62 (HIGH_SIMILARITY).

Objetivo: separar limpeza B2B da linguagem residencial e da higienização de estofados.

Direção:
- composição operacional B2B;
- serviços como matriz de ambientes/superfícies;
- processo e frequência como eixo central;
- hero horizontal institucional, sem repetir estrutura Bruna.

### Micro 1C — Easy Clean — RECLASSIFICADA PARA ONDA 2
Resultado indireto da 1B: Easy Clean caiu para ATTENTION (score 59), portanto deixa de ser prioridade crítica nesta onda.

Objetivo original: remover o terceiro membro do cluster de limpeza.

Direção:
- identidade e composição baseadas no material real do flyer;
- evitar hero/card/processo herdado;
- estrutura própria por prova e escopo.

### Micro 1D — Embalar Embalagens — EM EXECUÇÃO
Baseline: Embalar ↔ Maximos = 61 (HIGH_SIMILARITY), único par crítico restante.

Objetivo: quebrar similaridade estrutural com Maximos.

Direção:
- loja/catálogo como eixo;
- ritmo de prateleira, categorias, estoque visual e loja física;
- mídia real como estrutura, não decoração.

### Micro 1E — Maximos Cabeleireiros
Objetivo: assumir narrativa editorial de beleza/atendimento.

Direção:
- jornada de serviço, estilo e agenda;
- composição de salão/editorial;
- separar completamente do grid comercial da Embalar.

## Onda 2 — ATTENTION por prioridade

Atacar em lotes de 2 projetos, começando pelos maiores scores e pelos pares
SAME_FAMILY`. Cada lote deve produzir queda mensurável antes do próximo.

Prioridade inicial:
1. `js-eletrica-manutencao`;
2. `aguia-sul-sinalizacao`;
3. `diego-montador-moveis`;
4. `mp-festas-eventos`;
5. `studio-de-cilios`.

## Onda 3 — identidade e mídia

Executar em lotes pequenos, sem redesign obrigatório:

- substituir logos placeholder quando houver fonte oficial ou criação autorizada;
- criar variação de contraste quando necessária;
- corrigir focal point de capas;
- corrigir ratio mismatch;
- eliminar capas pendentes;
- priorizar mídia real versionada.

Meta:
- 0 logo placeholder;
- 96/96 capas válidas.

## Onda 4 — riqueza factual individual

Por projeto, quando houver evidência:
- serviços/produtos reais;
- perguntas frequentes específicas;
- localização e área atendida;
- redes sociais oficiais;
- últimas publicações reais;
- galeria real;
- provas verificáveis;
- Schema.org específico somente quando comprovado.

## Onda 5 — feedback de busca

Usar GSC/index coverage por slug para gerar fila de ação baseada em:
- indexação;
- impressões;
- queries;
- CTR;
- páginas sem crescimento;
- páginas com oportunidade de intenção.

Nenhuma página nova será criada apenas por palavra-chave. Novos conteúdos exigem
substância factual suficiente.

## Critério de conclusão

A evolução não termina quando "todas parecem diferentes", mas quando:
- 0 HIGH_SIMILARITY;
- queda progressiva de ATTENTION;
- 0 placeholders de identidade;
- 100% das capas válidas;
- novos projetos continuam entrando sob o contrato autoral e SEO universal.
