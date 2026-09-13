---
id: 0web-portfolio-evolution-no-regression
status: ACTIVE_EXECUTION_CONTRACT
owner: 0WEB
updated: 2026-09-13
---

# 0WEB — PORTFOLIO EVOLUTION / NO REGRESSION

Este documento é o contrato operacional para evolução de `/portfolio`. Ele existe para impedir ciclos de remendo, divergência de ambientes, retrabalho caro e regressões entre Lovable, GitHub, Vercel e banco.

## 1. Fonte de verdade

1. Código: `hrq16000/zeroweb-2026`, branch `main` apenas depois de validação.
2. Dados operacionais: Supabase de produção já existente.
3. Deploy alvo: Vercel, usando exatamente o mesmo Git e o mesmo Supabase.
4. Lovable é editor auxiliar, não fonte paralela de produção.
5. Relatórios antigos são evidência histórica, nunca substituem inspeção atual de Git + banco + runtime.

## 2. Regra de execução

- Não iniciar nova auditoria global se a frente atual já possui baseline válido; atualizar somente o delta.
- Não corrigir visual com patch cosmético quando a causa é estrutural.
- Não publicar alteração que reduza originalidade, SEO, funil, privacidade, acessibilidade, performance ou ownership.
- Toda mudança relevante deve ter: baseline → alteração isolada → teste → comparação → deploy → validação de runtime.
- `build green` não significa `visual pass`.
- `NOT_TESTED` nunca significa `PASS`.

## 3. Baseline em 2026-09-13

Catálogo: 92 projetos.

`portfolio_client_settings`:
- 86 linhas;
- 70 publicadas;
- 57 com `funnel_recipient` configurado;
- 28 publicadas sem destino;
- 1 não publicada sem destino;
- total sem destino no banco: 29.

Originalidade atual (`reports/portfolio-originality.json`):
- 1 ORIGINAL;
- 29 ACCEPTABLE;
- 56 ATTENTION;
- 6 HIGH_SIMILARITY;
- 0 CLONE;
- 24 capas ausentes;
- 45 capas pendentes;
- 25 logos placeholder;
- 19 sinais de crop severo.

Autorização atual:
- enum global possui `admin`, `cliente`, `prestador`, `empresa`, `parceiro`, `admin_integrations`, `dev`, `super_admin`;
- ainda não existe tabela de membership por projeto em produção;
- portanto cliente autorizado ainda não possui ownership seguro por `client_key`.

Vercel:
- código compila e publica;
- enquanto as variáveis do Supabase não forem configuradas, runtime cai em fallback e não possui paridade com Lovable/produção.

## 4. Ordem obrigatória das frentes

### P0-A — Paridade de ambiente

Objetivo: Lovable/produção e Vercel executarem o mesmo SHA + mesmo Supabase + mesmas regras de runtime.

Done quando:
- Vercel possui as variáveis do Supabase de produção;
- logs não mostram configuração Supabase ausente;
- leitura de `portfolio_client_settings` funciona na Vercel;
- funis, auth, admin, leads e overrides são testados no mesmo backend;
- nenhuma nova base é criada.

### P0-B — Destinos reais dos funis

Objetivo: resolver os 29 projetos atualmente sem destino, usando `confirmDestination` e evidência real.

Prioridade de evidência:
1. material do cliente;
2. histórico interno/Git/banco;
3. site oficial;
4. Google Business oficial;
5. rede social oficial;
6. registro público confiável;
7. diretório de terceiros apenas como apoio.

Regras:
- DDD + 8 e DDD + 9 são válidos;
- fixo e móvel são válidos;
- nunca adicionar/remover dígito;
- nunca usar contato institucional 0WEB;
- conflito de identidade permanece pendente;
- cada promoção deve criar revisão e passar pelo resolver canônico.

Done quando cada projeto estiver `VERIFIED` ou explicitamente `UNRESOLVED_WITH_EVIDENCE_GAP`, nunca preenchido por chute.

### P0-C — Ownership multi-tenant

Objetivo: super admin concede acesso a projeto; cliente edita apenas seu(s) próprio(s) `client_key`.

Modelo alvo:
- `portfolio_project_members(project_id/client_key, user_id, role)`;
- roles: owner/editor/viewer;
- servidor + RLS validam acesso;
- esconder botão nunca é considerado segurança;
- cliente não enumera projetos alheios;
- super admin concede/revoga;
- publicação/arquivamento continuam protegidos até política comercial automatizada.

### P1-A — Remover uniformização estrutural

Para projetos autorais/composição própria, a casca global não pode injetar seções visuais genéricas como parte da narrativa do cliente.

O shell compartilhado deve limitar-se a infraestrutura: analytics, segurança, funnel plumbing, host credit e utilidades não intrusivas.

Cada projeto controla:
- hero;
- ordem de seções;
- grid;
- tipografia;
- media narrative;
- CTA distribution;
- motion signature;
- closing structure.

### P1-B — SEO por projeto

Nunca herdar descrição/keywords de um vertical genérico quando existe projeto específico.

Todo projeto deve possuir SEO factual próprio, canonical próprio e JSON-LD coerente com sua entidade.

### P1-C — Asset contract

Cada projeto deve declarar explicitamente:
- `hero`;
- `catalogCover`;
- `social/OG`;
- `preview`;
- focal points quando necessário.

Alterar hero não pode deixar catálogo/OG presos em arte antiga sem um status explícito.

### P1-D — Dívida visual

Fila de redesign baseada no relatório de originalidade, começando por HIGH_SIMILARITY e depois ATTENTION.

Não corrigir similaridade trocando apenas cor, borda ou copy. Alterar composição e linguagem espacial.

## 5. Novo projeto — fluxo definitivo

`few_words → entity_discovery → entity_resolution → evidence → gaps → adaptive_questions → 3 divergent creative directions → originality rejection → composition graph → media → content → funnel → SEO → mobile → QA → preview → owner approval → publish`

Presets podem ajudar no bootstrap técnico, nunca definir o resultado visual.

## 6. Regra de criatividade

Dois projetos não podem compartilhar de forma perceptível a mesma combinação de:
- geometria do hero;
- ordem de seções;
- grid topology;
- família de cards;
- background rhythm;
- media distribution;
- motion signature;
- CTA distribution;
- fechamento.

Se parecer o mesmo site recolorido, falhou.

## 7. Regra de custo

Não usar Lovable para tarefas que podem ser feitas com GitHub/Vercel/banco/web sem perda de qualidade.

Lovable só entra quando sua capacidade específica é necessária. Antes de pedir um novo turno caro, verificar se a alteração pode ser executada diretamente na fonte de verdade.

## 8. Definição de evolução

Uma rodada só conta como evolução quando:
- resolve causa raiz;
- reduz dependência manual futura;
- mantém ou melhora todos os gates relevantes;
- deixa o próximo projeto mais fácil de criar do que o anterior;
- não exige repetir a mesma correção por slug.

Correção que precisa ser refeita cliente a cliente sem motivo de negócio é dívida arquitetural, não evolução.
