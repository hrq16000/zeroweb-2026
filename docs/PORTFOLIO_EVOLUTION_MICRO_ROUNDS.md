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

### Micro 1D — Embalar Embalagens — CONCLUÍDA
Resultado: Embalar saiu do par crítico; catálogo chegou a 0 HIGH_SIMILARITY e 0 CLONE.

Baseline: Embalar ↔ Maximos = 61 (HIGH_SIMILARITY), último par crítico da Onda 1.

Objetivo: quebrar similaridade estrutural com Maximos.

Direção:
- loja/catálogo como eixo;
- ritmo de prateleira, categorias, estoque visual e loja física;
- mídia real como estrutura, não decoração.

### Micro 1E — Maximos Cabeleireiros — RECLASSIFICADA PARA ONDA 2
Resultado indireto da 1D: Maximos caiu para ATTENTION (score 60); não há justificativa para redesign crítico na Onda 1.

Objetivo original: assumir narrativa editorial de beleza/atendimento.

Direção:
- jornada de serviço, estilo e agenda;
- composição de salão/editorial;
- separar completamente do grid comercial da Embalar.

## Fechamento da Onda 1

Resultado medido após as micros 1A, 1B e 1D:
- HIGH_SIMILARITY: 5 → 0;
- CLONE: 0 → 0;
- três redesigns diretos resolveram cinco projetos críticos;
- Easy Clean e Maximos foram rebaixados para ATTENTION por separação dos vizinhos mais próximos.

## Onda 2 — ATTENTION por prioridade

### Micro 2A — JS Elétrica e Manutenção — CONCLUÍDA
Resultado: HIGH_SIMILARITY permaneceu em 0 e JS saiu do topo crítico.

Baseline: score 60, nearest Maximos Cabeleireiros.

Direção:
- central técnica / quadro de controle;
- painel de escopo;
- serviços como circuitos lineares;
- foto real como registro de campo;
- ambientes codificados;
- CTA como barra operacional, não cartão.

Gate:
- reduzir o score de JS sem criar novo HIGH_SIMILARITY;
- preservar funil, runtime fields, SEO e performance.

### Micro 2B — Águia Sul Sinalização — CONCLUÍDA
Resultado: score 59 → 56, mantendo 0 HIGH_SIMILARITY e 0 CLONE.

Baseline: score 59, nearest Diego Montador de Móveis.

Direção:
- planta de sinalização / mapa de piso;
- composição clara e técnica, sem hero split convencional;
- linhas, setores e fluxo como linguagem visual;
- serviços em mapa linear de escopo;
- sem foto de obra inventada: somente marca e elementos gráficos próprios;
- preservar serviços, Curitiba/região e funil.

Gate:
- reduzir o score da Águia Sul;
- manter 0 HIGH_SIMILARITY e 0 CLONE;
- não aproximar a página do Diego ou da JS;
- build/SSR/visual verdes.

### Micro 2C — MP Festas e Eventos — CONCLUÍDA
Resultado: MP Festas saiu do topo de ATTENTION; Studio de Cílios caiu 59 → 56 por separação do vizinho.

Baseline: score 59, nearest Studio de Cílios.

Direção:
- storyboard de celebração / roteiro de festa;
- hero fotográfico full-bleed + briefing lateral;
- pacotes em pauta linear, não cards;
- galeria como composição editorial e social;
- atendimento local como fechamento de roteiro;
- preservar preços, Araucária/região, Instagram e funil.

Gate:
- reduzir o score da MP Festas;
- manter 0 HIGH_SIMILARITY e 0 CLONE;
- separar MP Festas do Studio de Cílios;
- build/SSR/visual verdes.

### Micro 2D — Cris Presentes · Colônia Rio Grande — EM EXECUÇÃO
Baseline atual: score 57, nearest Catharine Lima Studio.

Direção:
- experiência de loja local / gift finder;
- hero como painel de busca por pistas, não studio split;
- categorias em corredor linear de loja, não cards;
- ficha factual da filial como bloco de varejo;
- CTA de disponibilidade e retirada;
- preservar endereço, categorias registradas e funil.

Gate:
- reduzir o score da Cris;
- separar Cris da Catharine;
- manter 0 HIGH_SIMILARITY e 0 CLONE;
- build/SSR/visual verdes.

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
