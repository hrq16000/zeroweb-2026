# PORTFOLIO RESOURCE UTILIZATION STANDARD

Status: **normativo, obrigatório e aditivo** para toda nova landing `/portfolio/:slug`, para redesign material, republicação visual relevante e evolução do pipeline de portfolios.

Princípio oficial:

> **O portfolio deve se empenhar ativamente em descobrir, avaliar e usar o máximo de recursos relevantes que aumentem verdade, clareza, identidade, conversão, acessibilidade, performance e qualidade — sem transformar “usar recursos” em excesso decorativo, dependência desnecessária ou fabricação de prova.**

Este padrão aplica **SOME = SOMAR / AGREGAR, nunca substituir**. Ele não revoga Lifecycle, Blueprint, Research Intelligence, Creative Direction, Premium Acceptance, Unique Composition, Funnel, SEO, Privacy, Accessibility, Performance ou Skills Governance.

## 1. O que significa “forçar o uso dos recursos”

“Forçar” significa **forçar consideração, tentativa e evidência**, não ligar indiscriminadamente tudo que existe.

Para cada projeto novo ou revisão material, o agente deve:

1. descobrir os recursos disponíveis;
2. avaliar relevância para o caso real;
3. tentar usar os recursos relevantes quando tecnicamente e juridicamente viáveis;
4. registrar o que foi usado, rejeitado, bloqueado ou marcado `NOT_APPLICABLE`;
5. justificar qualquer capacidade relevante que não tenha sido usada;
6. nunca declarar “não existe”, “não foi possível” ou `NOT_APPLICABLE` sem tentativa suficiente e evidência do motivo;
7. continuar procurando alternativa segura quando um recurso principal estiver bloqueado.

A entrega não deve ser aprovada apenas porque “funciona” se recursos relevantes claramente disponíveis foram ignorados por conveniência.

## 2. Hierarquia de esforço

A ordem de prioridade é:

`VERDADE → EVIDÊNCIA → DECISÃO → IDENTIDADE → EXPERIÊNCIA → CONVERSÃO → ACESSIBILIDADE → PERFORMANCE → MEDIÇÃO → POLIMENTO`.

Recursos visuais ou de motion não têm precedência sobre factualidade, privacidade, acessibilidade ou funcionamento.

## 3. Classes de recursos obrigatoriamente consideradas

### 3.1 Pesquisa e evidência

Sempre considerar, quando aplicável:

- site oficial;
- Google/Maps/Business;
- Facebook, Instagram, TikTok, YouTube e demais perfis oficiais;
- diretórios locais confiáveis;
- marketplaces/perfis comerciais;
- notícias/imprensa/local community pages;
- materiais enviados pelo proprietário;
- histórico do Git e dados já versionados;
- dados estruturados e fontes oficiais atuais;
- referências concorrenciais apenas como repertório, nunca como fonte para copiar identidade.

Resultado esperado: fatos, provenance, freshness e lacunas explícitas.

### 3.2 Mídia e identidade

Sempre procurar primeiro:

- logo oficial;
- fotos reais do negócio;
- produtos, trabalhos, obras, ambiente e equipe quando houver direito/uso adequado;
- vídeos reais;
- materiais promocionais oficiais;
- social media oficial;
- mídia licenciada;
- geração contextual/original como fallback honesto;
- composição gráfica/SVG original;
- capa, hero, preview e OG próprios.

Mídia gerada não substitui mídia real por conveniência e nunca pode fingir ser prova documental.

### 3.3 Skills e competências

Aplicar o maior conjunto **relevante e não redundante** de competências disponível:

- research/entity resolution;
- landing/CRO;
- direção de arte;
- UX/UI;
- design system;
- layout engineering;
- React/web engineering;
- motion/interação;
- acessibilidade;
- performance;
- SEO/entity/schema;
- conteúdo;
- privacidade/segurança;
- funil/conversão;
- browser/runtime QA;
- analytics/measurement.

Discovery externo é obrigatório quando houver chance real de acrescentar competência útil, seguindo a política de segurança.

### 3.4 Capacidades de experiência

Avaliar conscientemente:

- hero autoral;
- tipografia e tokens locais;
- Grid/Flexbox/intrinsic sizing;
- navegação adequada ao `pageMode`;
- cards, mosaicos, timeline, catálogo, comparação e outras topologias;
- selector/filter/search;
- simulador/calculadora quando houver dado real e benefício;
- mapas/localidade quando a decisão depender de lugar;
- galeria/lightbox;
- before/after somente com prova real;
- vídeo, SVG, Lottie, 3D e parallax somente quando justificarem custo;
- microinterações e feedback;
- loading/error/empty/success states;
- reduced motion;
- mobile-specific composition;
- sticky/floating CTA quando não encobrir conteúdo e fizer sentido;
- FAQ, decisão assistida e prova próxima da objeção;
- thank-you/confirmation com continuidade.

A avaliação é obrigatória; a ativação depende de utilidade.

### 3.5 Recursos de decisão e conversão

Considerar os parâmetros R1/R2/R3:

- `LandingIntentProfile`;
- `LandingDecisionProfileV2`;
- `LandingDecisionProfileV3`;
- decision velocity;
- information scent;
- self-segmentation;
- context carryover;
- commitment ladder;
- decision aids;
- claim/evidence graph;
- transparency/freshness;
- location fit;
- human escalation;
- response expectation;
- mobile decision budget;
- post-conversion continuity.

O agente deve procurar a forma mais econômica de reduzir a dúvida: às vezes é texto; às vezes é comparação, catálogo, seletor, mapa, preview, simulador ou workflow.

### 3.6 SEO, IA e descoberta

Sempre considerar:

- SSR/HTML útil;
- headings semânticos;
- title/description únicos;
- canonical;
- OG/social;
- schema aplicável e factual;
- sitemap/robots;
- links internos;
- LocalBusiness/Service/Product/Event quando corretos;
- conteúdo legível por buscadores e agentes de IA;
- alt text e contexto de imagens;
- entidade/localidade/serviço claramente resolvidos.

### 3.7 Performance e acessibilidade

Sempre considerar:

- LCP/INP/CLS;
- tamanho/formato/crop de mídia;
- lazy/eager loading correto;
- code splitting;
- dependências evitáveis;
- keyboard/focus;
- contraste;
- touch targets;
- semantic landmarks;
- ARIA somente quando necessário;
- reduced motion;
- 390/768/1440;
- comportamento sem JS quando aplicável;
- fallbacks.

### 3.8 QA, observabilidade e medição

Sempre considerar:

- build;
- typecheck/testes;
- boundaries/privacy;
- readiness;
- originality/uniqueness;
- visual/runtime QA;
- console;
- funil ponta a ponta;
- destino e isolamento;
- UTM/referrer/source continuity;
- eventos CTA/funil/conclusão/redirect;
- performance de campo/lab quando disponível;
- analytics e hipótese de experimento quando aplicável.

## 4. Resource Effort Ledger

Todo novo projeto deve deixar evidência de esforço no brief, manifesto, PR, relatório ou changelog.

Formato mínimo:

```text
resource:
status: USED | ATTEMPTED_BLOCKED | REJECTED | NOT_APPLICABLE
why:
evidence:
fallback:
impact:
```

Não é necessário criar uma tabela enorme para recursos obviamente irrelevantes; porém, recursos centrais para aquele segmento/oferta não podem desaparecer sem registro.

Exemplos:

- negócio visual sem fotos: registrar busca em fontes oficiais + motivo de bloqueio + fallback contextual;
- serviço local: registrar Maps/localidade/coverage;
- B2B técnico: registrar prova operacional, integração/documentação e decisão assistida;
- evento: registrar data/local/preço/agenda/freshness quando públicos;
- comércio: registrar catálogo/produtos/seleção/context carryover;
- decisão sensível: registrar fontes, risco, ajuda humana e ausência de pressão artificial.

## 5. Regra de persistência: não abandonar recurso útil no meio da jornada

Recurso usado na landing deve manter coerência até o fim:

- item selecionado continua no funil;
- plano/unidade continua no lead;
- campanha/referrer/UTM continua no handoff;
- identidade e linguagem continuam na confirmação;
- condição comercial válida não muda silenciosamente;
- mídia e claim mantêm provenance;
- contexto do cliente nunca migra para outro `client_key`.

## 6. Resource Utilization Gate

Novo projeto ou redesign material **falha** no `RESOURCE_UTILIZATION_GATE` quando:

- não houve discovery de skills/competências aplicáveis;
- fontes oficiais relevantes não foram pesquisadas;
- mídia real disponível foi ignorada sem justificativa;
- decision aids claramente úteis não foram sequer avaliados;
- mobile/reduced-motion/acessibilidade/performance não foram revisados;
- funil/SEO/analytics/QA não foram exercitados;
- um recurso foi marcado `NOT_APPLICABLE` sem motivo;
- o agente escolheu o caminho mais simples por conveniência, apesar de haver recurso relevante disponível;
- foi adicionada dependência/efeito só para “cumprir recurso” sem benefício;
- uso de recurso gera clone visual, regressão, privacidade ruim ou prova fabricada.

## 7. Regra de esforço razoável e parada

“Empenhar-se” não significa pesquisa infinita.

A busca pode parar quando:

- as fontes prioritárias aplicáveis foram consultadas;
- a entidade está suficientemente resolvida;
- as principais incertezas estão respondidas ou claramente marcadas como faltantes;
- novas tentativas repetem o mesmo bloqueio sem perspectiva real de ganho;
- o custo/risco excede o benefício;
- a alternativa segura já resolve a necessidade.

O motivo da parada deve ser registrável.

## 8. Anti-Frankenstein

Máximo de recursos relevantes **não** significa máximo de componentes, bibliotecas, animações ou efeitos.

É proibido:

- instalar dependência só porque existe;
- misturar múltiplos estilos sem direção;
- ligar todas as capacidades da palette;
- adicionar simulador sem dados;
- criar mapa quando localidade não participa da decisão;
- usar vídeo/3D/parallax sem valor narrativo;
- inventar prova para preencher seção;
- duplicar funcionalidades já resolvidas pela stack;
- sacrificar Core Web Vitals, acessibilidade ou clareza pela demonstração técnica.

A regra é:

> **máximo de esforço e inteligência na seleção; máximo de recursos relevantes na solução; mínimo de ruído, redundância e automatismo.**

## 9. Definition of Done

Um portfolio novo só pode ser chamado de concluído quando houver evidência de que:

- recursos relevantes foram descobertos;
- fontes e mídia aplicáveis foram tentadas;
- skills relevantes foram aplicadas ou justificadamente rejeitadas;
- capacidades de decisão foram avaliadas;
- identidade/composição são próprias;
- experiência mobile e acessível foi validada;
- performance foi considerada;
- SEO/entity/LLM readiness foi verificado;
- funil e isolamento foram testados;
- analytics/continuity foram considerados;
- preview/runtime foi inspecionado;
- recursos não usados possuem justificativa quando materialmente relevantes;
- nenhuma camada aprovada anteriormente foi silenciosamente removida.

## 10. Relação com outros padrões

Este documento deve ser lido junto de:

- `AGENTS.md`;
- `docs/0WEB_EXECUTION_CONTRACT.md`;
- `docs/PORTFOLIO_PROJECT_LIFECYCLE.md`;
- `docs/AGENT_SKILLS_GOVERNANCE.md`;
- `docs/PORTFOLIO_CAPABILITY_PALETTE.md`;
- `docs/PORTFOLIO_LANDING_RESEARCH_INTELLIGENCE_STANDARD.md`;
- `docs/PORTFOLIO_CREATIVE_DIRECTION_STANDARD.md`;
- `docs/PORTFOLIO_PREMIUM_EXPERIENCE_ACCEPTANCE_STANDARD.md`;
- `docs/PORTFOLIO_NEW_CLIENT_PLAYBOOK.md`;
- `.agents/skills/0web-experience-design-max/SKILL.md`;
- `.agents/skills/0web-portfolio-autonomous-pipeline/SKILL.md`.

Em conflito, factualidade, segurança, privacidade, acessibilidade, integridade da marca e isolamento de cliente têm precedência sobre “usar mais recursos”.
