# PORTFOLIO DATA INTEGRITY STANDARD

Status: **norma aditiva e canônica para /portfolio/:slug**.

Esta norma existe para impedir regressões silenciosas de vínculo entre projeto, funil, destino de atendimento, serviços, imagens e identidade visual. Ela **não transforma as landing pages em um template**. A plataforma pode compartilhar infraestrutura; a experiência de cada cliente continua autoral, exclusiva e contextual.

## 1. Princípio central: dado, vínculo e política são coisas diferentes

Um telefone/WhatsApp comercial do cliente é um **dado de negócio e um vínculo operacional**, não uma credencial de API. A decisão de não tornar esse número clicável é uma **política de conversão**, não motivo para apagar a associação do projeto ou fazer a associação depender exclusivamente de um segredo de deploy.

Credenciais reais (tokens, chaves, senhas, secrets de provedores) continuam em cofre/secret store. O vínculo `cliente -> destino comercial` deve ser durável, auditável e recuperável.

## 2. PROJECT_IDENTITY_INVARIANT

Todo projeto precisa de uma identidade estável:

- `clientKey` canônico e imutável para relações internas;
- `slug` como endereço público, podendo ter aliases/301 sem trocar a identidade interna;
- nenhuma relação crítica pode depender de índice de array, posição visual, label editável ou nome de arquivo inferido;
- renomear slug, título ou seção não pode órfãnar funil, contato, mídia ou analytics.

## 3. CONTACT_BINDING_INVARIANT

O vínculo comercial deve ter uma fonte versionada e auditável, com no mínimo:

- `clientKey`;
- telefone normalizado;
- telefone de exibição;
- status (`VERIFIED`, `CANDIDATE`, `MISSING`, `CONFLICT`, `NOT_APPLICABLE`);
- proveniência;
- data de verificação;
- evidência/observação de conflito quando houver.

O registro versionado é a **linha de base recuperável**. Uma configuração privada/admin pode sobrescrever a linha de base, mas precisa ser explícita, rastreável e validada. Variável de ambiente pode ser compatibilidade/override operacional; **não deve ser a única memória da associação**.

Conflito entre fontes nunca é resolvido silenciosamente. Deve gerar `CONFLICT` até haver decisão verificável.

## 4. FUNNEL_FIRST_INVARIANT

Em toda landing comercial de `/portfolio/:slug`:

`CTA comercial -> funil contextual do projeto -> respostas -> lead salvo -> resolução do destino -> handoff`

Regras obrigatórias:

- `tel:` proibido;
- `wa.me`, `api.whatsapp.com` ou equivalente direto proibido no CTA da landing;
- número pode aparecer como **texto institucional não clicável** quando fizer sentido;
- handoff para WhatsApp somente depois de salvar o lead/pedido;
- nunca usar o WhatsApp institucional da 0WEB como fallback de um cliente;
- nunca cruzar destino entre dois clientes;
- se não houver destino operacional, salvar o pedido e coletar um meio de retorno do visitante; nunca encerrar em beco sem saída.

## 5. DESTINATION_RESOLUTION_INVARIANT

A resolução server-side deve separar três conceitos:

1. **baseline versionado** — vínculo comercial conhecido e recuperável;
2. **override controlado** — alteração feita por admin/configuração privada, com auditoria;
3. **compatibilidade legada** — env/secret existente, enquanto a migração não terminou.

Nenhuma dessas fontes deve apagar as outras. A resolução deve detectar divergência e reportar conflito em vez de escolher silenciosamente um número diferente.

Estados de operação devem ser distintos:

- `FUNNEL_OPERATIONAL`: o visitante consegue concluir e o lead fica recuperável;
- `DIRECT_DELIVERY`: existe destino do cliente comprovado para handoff;
- `DESTINATION_VERIFIED`: titularidade/proveniência do número está confirmada.

Assim, um projeto pode ter `FUNNEL_OPERATIONAL=PASS` e `DIRECT_DELIVERY=PENDING_DESTINATION` sem ser falsamente classificado como totalmente resolvido.

## 6. RECOVERY_INVARIANT

Antes de declarar um destino `MISSING`, o pipeline deve procurar, de forma rastreável:

- registro versionado atual;
- configuração privada/admin;
- secret/env legado;
- histórico Git de arquivos do projeto e configurações;
- briefs, enrichment e source materials;
- fontes públicas já resolvidas para a entidade, quando apropriado.

Candidato recuperado não vira `VERIFIED` automaticamente se houver dúvida de titularidade.

O script `scripts/recover-portfolio-contact-bindings.mjs` existe para produzir evidência de recuperação sem sobrescrever dados automaticamente.

## 7. MEDIA_LINK_INVARIANT

Serviço e imagem devem usar IDs estáveis, por exemplo `serviceId` e `mediaId`.

É proibido usar como vínculo permanente:

- índice do array;
- ordem visual;
- texto do título;
- posição do card;
- nome do arquivo como única chave implícita.

Mudanças de ordem, copy ou layout não podem trocar a imagem de um serviço por outra. Um gate deve acusar mídia órfã, serviço sem mídia exigida e referência a ID inexistente.

## 8. SHARED_ENGINE_NOT_TEMPLATE

O que deve ser compartilhado:

- funil e persistência;
- resolução de destino;
- telemetria;
- acessibilidade;
- motion primitives;
- plataforma 0WEB;
- gates de segurança, qualidade e integridade.

O que **não** deve ser uniformizado em um template visual:

- arquitetura narrativa;
- ordem e peso dos blocos;
- geometria do hero;
- ritmo visual;
- linguagem de mídia;
- composição;
- identidade;
- motion narrative e signature moments;
- tom e microcopy;
- perguntas contextuais do funil.

Novo projeto deve partir de pesquisa/evidência e direção criativa própria. Reuso de infraestrutura não autoriza clone de esqueleto.

## 9. INTEGRITY GATES

Um projeto publicado não pode ser declarado integralmente saudável apenas porque o componente renderiza. A matriz deve separar:

- `PROJECT_IDENTITY_BOUND`;
- `FUNNEL_BOUND`;
- `LEAD_PERSISTENCE_PROVEN`;
- `CONTACT_BINDING_EXPLICIT`;
- `DIRECT_DELIVERY_PROVEN` ou `PENDING_DESTINATION`;
- `NO_DIRECT_COMMERCIAL_BYPASS`;
- `NO_CROSS_CLIENT_FALLBACK`;
- `MEDIA_BINDINGS_VALID`;
- `STRUCTURAL_ORIGINALITY_VALID`;
- `RUNTIME_QA`.

`BLOCKED_ENVIRONMENT`, `NOT_EXECUTED` e `PENDING_DESTINATION` nunca contam como `PASS` da dimensão correspondente.

## 10. Migração sem regressão

A correção desta camada não autoriza redesenhar em massa os projetos legados.

Ordem segura:

1. recuperar e registrar vínculos;
2. validar conflitos e duplicidades;
3. integrar o resolver server-side à fonte durável;
4. manter o funil-first e o fallback recuperável;
5. rodar gates e E2E;
6. somente depois remover dependências legadas redundantes de env/secret.

Nenhum número conhecido deve ser apagado durante a migração. Nenhum projeto deve trocar de identidade, visual, rota ou funil só para receber a correção de integridade.