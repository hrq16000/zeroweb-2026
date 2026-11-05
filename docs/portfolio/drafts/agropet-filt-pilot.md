# 0WEB — Agropet Filt | Piloto de conversão local (prévia não oficial)

**Etapa:** research/design preview. **Não publicado como portfólio oficial.** **Não autorizado pelo titular.**  
**Última pesquisa:** 04/11/2026. **Branch:** `feat/agropet-filt-preview-20261104`.  
**Rota exclusiva de visualização:** `/portfolio-preview/agropet-filt` (somente DEV / Vercel preview, 404 em produção).

## 1. Hipótese e fonte

**Nome encontrado:** AVIÁRIO AGROPET FILT.  
**Endereço publicado:** Rua Monteiro Lobato, 160 — Vargem Grande, Pinhais/PR, CEP 83321-260.  
**Categorias reportadas:** aviário/artigos para pássaros, rações, petiscos, acessórios, pesca, jardinagem e banho e tosa.  
**Horários reportados:** segunda a sábado 08h30–19h30; domingo fechado. São horários **não validados com o estabelecimento**.  
**Telefone exibido em diretórios:** +55 (41) 99823-6598. **Não ativar como WhatsApp, CTA, segredo ou atendimento sem confirmação do titular.**  
**Site oficial:** não foi localizado nas buscas efetuadas, o que não comprova inexistência.
**Fontes de descoberta (não são prova de autorização comercial):**
- https://ondepet.com/pet-shops/pinhais/aviario-agropet-filt/
- https://www.locaisdobrasil.com.br/encontre/pet-shop-perto-de-mim-em-pinhais-pr?pagina=6
- https://ondepet.com/pet-shops/pinhais/vargem-grande/

Nenhuma fotografia do local, marca registrada, logotipo oficial, funcionário, depoimento ou produto específico foi reivindicado. A ilustração é vetorial original e explicitamente contextual; o diagrama de localização é um esquema não cartográfico. Não há promoções, valores, marcas de ração, estoque, números de satisfação ou prazos inventados.

## 2. Objetivo e desafio frente à referência Realeza Pets

**Benchmark funcional observado na Realeza Pets:** perfis de pets, ferramentas interativas, informações detalhadas de serviço e funcionalidades de relacionamento. Não copiar identidade, promessa ou arquitetura visual. Não prometer superar o produto inteiro apenas com uma landing.

**Oportunidade própria do Agropet Filt:** negócio híbrido de proximidade, com interesse comercial mais amplo que estética canina. Otimizar descoberta de categorias, auto-seleção de intenção e facilidade para consultas regionais. O padrão de sucesso é **maior clareza e conversão mensurável**, não uma afirmação não testada de ranking, desempenho, faturamento ou superioridade.

## 3. Direção criativa autoral

**Conceito:** `Do bico ao focinho. Tudo por perto.`  
**Voz:** acolhedora, leve, de bairro, descomplicada, com microcopy transparente.  
**Linguagem visual:** ilustração editorial de cão/ave, verde floresta + verde-lima + terracota, contraste entre tipos arredondados e serif italic, grandes áreas de cor, sem fotos fictícias da loja.

Três direções avaliadas:
- A. Pet boutique: luxo, fotos de cães e predominância de banho; **rejeitada** por reduzir o escopo aviário/varejo e aproximar a composição da concorrência.
- B. Marketplace compacto: grande grade de produtos e filtros de estoque; **rejeitada** por induzir catálogo e estoque não verificados.
- C. **Editorial de bairro + categorias + guia de interesse**; **escolhida** por representar a vocação agropet com conteúdo fiel e autoatendimento útil.

**Fingerprint (preview):**
- hero: pôster tipográfico dividido entre texto grande e ilustração autoral;
- header: logotipo conceitual + navegação leve de âncoras;
- jornada: localização e promessa → faixa de categorias → seis portas comerciais → guia de intenção → contexto local → endereço → dúvidas → encerramento editorial;
- estrutura: assimetria 53/47 no topo; mosaico 3×2; painel utilitário escuro; selo circular editorial; mapa estilizado;
- prova: endereço e origens públicas explicitadas, sem avaliações inventadas;
- CTA: entrada por cada categoria, simulação de interesse, sem dados pessoais ou transmissão;
- motion: flutuação decorativa sutil, feedback de hover, redução de movimento com `prefers-reduced-motion`;
- mobile: hero em coluna, catálogo 2 colunas, CTA touch, menu colapsado e seções sem overflow.

## 4. Funcionalidades da prévia

1. Página exclusiva com identidade visual autônoma e navegação.
2. Seis categorias comerciais com ações por interesse.
3. Guia interativo por tipo de pet: cão / ave / outro, com orientação **não veterinária** e sem inventar estoque.
4. Simulação de funil (3 etapas): interesse, detalhes livres não pessoais, resumo. **Zero leads salvos; zero mensagens enviadas.**
5. Localização pública, link externo para Google Maps e horários descritos como não confirmados.
6. FAQ factual e esclarecimento de não afiliação.
7. `noindex,nofollow,noarchive,noimageindex` e bloqueio `404` fora do ambiente DEV/Vercel preview.

**Atenção:** essas capacidades são a **prova visual e de navegação**, não a entrega de e-commerce, telemetria, contas de pets, pagamentos, estoque ou agendamento.

## 5. Funil comercial após autorização — contrato, não implementação

`interest → details → nome/contato+consentimento → persistência server-side por clientKey → protocolo → destino validado`.

- Cadastro do `clientKey` e do funil individual na infraestrutura 0WEB.
- Telefone confirmado via secret `PORTFOLIO_WHATSAPP_<CLIENT_KEY>` somente no backend; nunca `wa.me`/`tel:`/`mailto:` no bundle.
- Se não houver WhatsApp oficial, usar amostra `whatsapp:null` com lead persistido e aviso explícito.
- Salvar lead antes de qualquer redirecionamento. Testar isolamento, falhas e deduplicação.
- Definir base legal e transparência LGPD, titularidade e política de retenção antes de coletar dados reais.

## 6. Readiness para promover de prévia a publicação autorizada

`BLOCKED` até:
- confirmação da atividade e autorização/contrato do proprietário;
- validação de nome, identidade, endereço, horário, serviços, estoque/entrega, imagens e canal;
- 6 posts oficiais *somente se* existir Instagram público ativo identificado;
- assets aprovados: logo, capa, OG, ícone, galeria por papel e licenças;
- brief v2, manifest v4, composition registry, `portfolio-clients`, `portfolio-whatsapp` e funil com persistência comprovada;
- SEO real (canonical, hreflang, JSON-LD sem inventar avaliações, sitemap) e QA mobile / a11y / segurança;
- testes do CI, readiness gate e revisão visual da URL de preview.

**Proibição:** promover a rota de pesquisa em `/portfolio/agropet-filt`, `/portfolio.index` ou sitemap sem esses gates. Não reivindicar negócio como cliente atual.

## 7. Parametrização para 300 empresas

Compartilhar **somente o pipeline**, jamais a composição visual:

`nome+endereço → descoberta multi-fonte → resolução/conflitos → ledger de evidência → pesquisa de ativos/licenças → direções criativas → página autoral → funil simulado → preview seguro → aceite → funil real + SEO → readiness → publicação → monitoramento`.

Métricas a registrar desde o piloto: tempo até preview, fontes encontradas, % campos confirmados, tempo de validação, quantas intervenções humanas, tempo de implementação do funil, taxa de conversão após tráfego autorizado. Meta desejada: criação de uma prévia em até 1 hora, **não medida nem garantida neste piloto**.

### Skill / recurso / decisão
- Aplicado: `0web-skill-router`, `PORTFOLIO_ZERO_GENERIC_STANDARD`, `PORTFOLIO_UNIQUE_COMPOSITION_STANDARD`, `PORTFOLIO_PROJECT_LIFECYCLE`, `PORTFOLIO_INDIVIDUAL_SITE_SEO_STANDARD`, `0WEB_EXECUTION_CONTRACT`.
- Estratégia de experiência: identidade escopada, narrativa de utilidade, caminhos de conversão, segurança de dados, acessibilidade, CSS responsivo, reduced motion, SEO de prévia.
- Mídia pública: fotos de terceiros não reutilizadas por falta de licença/identidade; arte vetorial conceitual produzida no código.
- Recurso operacional: GitHub branch/PR, sem Lovable, sem Max mode, sem mudanças DNS.
- Testes de build, route generator e UI manual: **pendentes de evidência do CI/preview**; não declarar aprovados por inspeção do código.

## 8. Validação CI isolada para fábrica de prévias (04/11/2026)

**Causa do primeiro bloqueio:** mudança exclusiva em uma rota de prévia e arquivos próprios não era reconhecida por `resolve-visual-regression-scope.mjs`; o CI executou visual/Lighthouse em dezenas de páginas antigas não alteradas. Na primeira execução, build/TypeScript/unitários/hidratação/axe da base passaram; o gate visual acusou 33 diferenças de outros portfólios e Lighthouse encontrou violações em páginas existentes. **Não interpretar como gate aprovado nem alterar baselines para esconder diffs.**

**Correção nesta PR:** `previewOnlyScope` reconhece mudanças isoladas de prévia com rota explícita, componente e CSS exclusivos, documento, rota tipada e infraestrutura de teste. Qualquer alteração em uma página pública, header, CSS global ou arquivo de outro cliente faz **fallback para o gate global**. Testes unitários verificam esse comportamento.

**Visual:** `VISUAL_ONLY=preview-agropet-filt`, `VERCEL_ENV=preview`, 3 viewports, HTTP 200, `meta[robots]` com `noindex`, declaração não oficial e screenshots; não se criam baselines para páginas alheias.

**Lighthouse:** `LHCI_SCOPE=preview`, uma rota, mesmo limite de performance (≥ 90) e acessibilidade (≥ 95), LCP, CLS e TBT. SEO indexável/canonical são intencionalmente não aplicáveis à prévia **noindex** e não são tratados como PASS. A versão pública oficial exigirá todos os SEO gates completos. As rotas de produção mantêm regras originais.

**Evidência obrigatória:** inspecionar resultados do commit atualizado da PR #489 e a Vercel de mesmo SHA. Nenhum número de CI ou preview deve ser declarado final antes de `conclusion:success` para os gates apropriados e `READY` para o deploy.

## 9. Alternativa operacional validada — formulário Jotform (04/11/2026)

O backend Supabase criado pelo Lovable não disponibiliza service role para o deploy Vercel. Em vez de criar outro banco ou persistir sem credencial, a Agropet recebe **formulário exclusivo Jotform**, embutido no portfólio com domínio https://form.jotform.com/263077233917057. A captura ocorre diretamente no provedor e é recuperável no inbox autenticado. Não são transmitidos dados de lead por código da 0WEB; o iframe é o ponto único de envio e aplica seu próprio consentimento obrigatório.

**Prova de gravação:** submissão de teste sintético criada e lida em 04/11/2026, número 6696476235206459409 (rotulada NÃO CONTATAR). O registro do formulário está acessível ao administrador pela conta Jotform. Não corresponde a lead real.

**UX:** o fluxo live, independente dos campos de prévia, mostra o iframe e um link externo de contingência. O botão flutuante antigo da shell fica desativado especificamente para Agropet, impedindo chamadas à captura que depende da service role. Nenhum WhatsApp presumido é usado.

**Trade-off:** os leads são guardados no Jotform e **não são automaticamente espelhados no painel Supabase da 0WEB**; portanto o dashboard interno de leads não deve afirmar contagem/resultado desse cliente até integração autorizada e comprovada. A dependência Jotform é um provedor SaaS externo, mas não exige Lovable/Supabase novo.
