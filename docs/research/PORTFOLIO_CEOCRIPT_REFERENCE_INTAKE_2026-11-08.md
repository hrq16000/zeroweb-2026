# Ceocript — triagem de padrões externos para 0WEB (2026-11-08)

**Classe:** pesquisa aplicada, sem execução de código externo.  
**Fontes:** https://github.com/ceocript/megax-site · https://github.com/ceocript/site-mega · https://github.com/ceocript/Lunaro-AI · https://github.com/ceocript/lunaro-presale-dapp  
**Evidência:** leitura dos arquivos públicos no GitHub; **sem renderização em navegador, testes de fluxo real ou validação de afirmações comerciais**.

## 1. O que vale absorver (ADAPT)

Os dois repositórios MegaX apresentam uma landing de serviços logísticos B2B. O HTML inclui:
- segmentação por modalidade de operação/carga, separando transporte express, contratos recorrentes e cargas sensíveis;
- caminho de orçamento/cotação perto da oferta e formulário pedindo descrição da necessidade (incluindo carga, origem e destino);
- explicações do escopo operacional, da cobertura declarada e do processo contratual.

**Aplicação condicionada na 0WEB:** para clientes reais com operação B2B/logística, a direção criativa pode propor uma jornada própria: selecionar necessidade → informar origem/destino/recorrência/condições de carga → qualificar escopo → registrar lead server-side → encaminhar ao funil individual. As perguntas e etapas dependem dos serviços comprovados do cliente; este fluxo **não** vira template obrigatório e não substitui um checkout, agendamento ou rastreio real. Todas as alegações de cobertura, SLA, prazo e capacidade exigem comprovação da entidade.

Usar mídia de frota, estrutura ou operação **somente** com proveniência e autorização adequadas. Uma foto no código externo não comprova que uma transportadora disponha daquela frota.

## 2. O que não copiar (REJECT)

1. **Contato direto/bypass do funil.** O HTML externo inclui link `wa.me` e transformação de formulário em mensagem WhatsApp no navegador. Na 0WEB, manter captura persistida antes do redirecionamento e destinatário resolvido server-side por `clientKey`. Não importar número do concorrente nem expor telefones em bundles.
2. **SEO insuficiente.** No `index.html` analisado faltam `meta description` válida, `rel=canonical` e JSON-LD. A 0WEB já tem a infraestrutura SEO, que deve ser preservada.
3. **Dependência de Tailwind via CDN em tempo de execução.** Preferir a build atual, SSR e CSS do projeto; não importar a tag CDN.
4. **Assets com caminhos inconsistentes.** Há referências a `./fronted/` e `./frontend/` entre variantes; validar caminhos e não importar arquivos cegamente.
5. **Duas variações quase idênticas.** Os `index.html` inspecionados têm 1.136 linhas cada, com apenas nove linhas diferentes depois de normalizar finais de linha. Não reutilizar geometria, ordem das seções, marcas, texto, fotos nem composição final como clone.
6. **Alegações de negócio não verificadas.** Ex.: cobertura nacional e prazo de resposta de 5 minutos são conteúdo da referência, não fatos transferíveis para outro cliente.

**Motion:** `NOT_VERIFIED`; a presença de classes CSS de transição não equivale a evidência de desempenho visual ou acessibilidade no navegador.

## 3. Outras fontes do perfil

- **Lunaro-AI:** README descreve plataforma multiagente e ferramentas, mas no repositório observado há apenas `README.md`; conceito pode orientar avaliação futura, **não há implementação pronta para instalar ou integrar**.
- **lunaro-presale-dapp:** aplicação Web3 com Vite e bibliotecas de carteira; fora do escopo atual de portfólio/SEO/funil da 0WEB. Não importar contratos, pagamentos, chaves ou modelos de preço.
- **viem/chainlist:** forks de ecossistema Web3; sem utilidade operacional imediata para os portfólios.

## 4. Decisão e escopo de aplicação

- Registrar **somente MegaX como `ADAPT`** na biblioteca de padrões em `src/config/portfolio-reference-pattern-library.json` para consultas futuras de composição e pesquisa B2B.
- Preservar padrões existentes em `docs/PORTFOLIO_REFERENCE_COMPOSITION_GOVERNANCE_STANDARD.md`, `docs/PORTFOLIO_UNIQUE_COMPOSITION_STANDARD.md`, a camada 0WEB, SEO/SSR, privacidade, funil, originalidade, gates e DNS.
- Não copiar código, instalar pacote, alterar rota, deploy, editar `main`, nem declarar ganhos de conversão/performance sem medição.
- **Validação desta micro-rodada:** integridade de JSON, unicidade das fontes e presença dos campos de decisão; CI e browser QA permanecem sob responsabilidade da PR se houver integração posterior.

### Skill stack / evidência

Roteamento: `.agents/skills/0web-skill-router/SKILL.md`; contrato: `docs/0WEB_EXECUTION_CONTRACT.md`; composição: `docs/PORTFOLIO_REFERENCE_COMPOSITION_GOVERNANCE_STANDARD.md`; princípio aditivo: `docs/0WEB_UNIVERSAL_ADDITIVE_GROWTH_CONSTITUTION.md`. Pesquisa estática, sem mudança visual material nem importação de skills externas.
