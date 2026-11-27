# Design engineering premium — análise e adoção Emil Kowalski

**Estado:** R0 + R1.1 — diagnóstico estático e baseline visual da Home; implementação NÃO iniciada.
**Data:** 27/11/2026 • **Repositório:** hrq16000/zeroweb-2026 • **Checkpoint analisado da main:** `fa26ec28808babca950832cbcaa20ec6c8ccdb80`.

Este documento é incremental. As regras locais de AGENTS.md, DESIGN.md, segurança, SEO, arquitetura, publicação, dados e funis prevalecem. Não autoriza alterações de runtime, instalações, custos, merge ou deploy. Não substitui a homologação visual da versão efetivamente publicada. R0 teve timeout do navegador; R1.1 registra abaixo a captura pública da Home. Nenhuma medição de performance, QA integral ou aprovação de produção é reivindicada.

## 1. Diagnóstico por projeto (evidência de leitura)

- **Contexto:** Growth engine e portfólios independentes.
- **Observação concreta:** Home src/routes/index.tsx já usa MotionScope, MotionChoreo, HomeHeroV2 e ProjetosNoAr. src/styles.css contém 3 @keyframes e 4 menções a reduced-motion. DESIGN.md, docs/design/MOTION.md e normas premium/originalidade já existem.
- **Stack presente (package.json):** @tanstack/react-start 1.168.60, motion 12.40.0, react ^19.2.0, sonner ^2.0.7, tailwindcss ^4.2.1, vite ^7.3.1, vitest ^4.1.8.
- **Home/entrada observada:** src/routes/index.tsx.
- **CSS amostrado:** src/styles.css (3 @keyframes; 4 referências a prefers-reduced-motion; 0 ocorrências de transição ampla). Contagem textual de declarações, não prova de uso/renderização ou defeito.
- **Documentação local a preservar:** DESIGN.md, docs/DESIGN_MOTION_PRINCIPLES.md, docs/design/MOTION.md
- **Oportunidade prioritária (hipótese a validar):** Usar skills para revisão de motion existente, preservar MotionScope e tokens, escolher um momento assinado por portfólio segundo marca, revisar hero acima da dobra e sequência/composição sem repetir template.
- **Limite local:** Cada cliente tem identidade, mídia real/funil e composição próprios; NO-BRAND TEST, sem copiar layouts, sem afetar publicação/SEO/rotas existentes.

## 2. Fonte primária e repertório

Fonte verificada: [emilkowalski/skills — revisão 64eb3deb](https://github.com/emilkowalski/skills/tree/64eb3deb9a5fbfa041faf783e0bc3fd635872e9c). Consultar `SKILL.md` do módulo e, quando necessário, RECIPES/STANDARDS antes da implementação. Esta é uma síntese autoral de princípios adaptados à aplicação; não instala nem executa scripts externos.

| Módulo | Uso no próximo trabalho visual |
| --- | --- |
| emil-design-eng | Refinar origem, feedback, legibilidade e detalhes; calibrar critérios de gosto |
| find-animation-opportunities | Ler UI e código, inventariar oportunidades e rejeições sem editar |
| remove-animations | Subtrair loops/reveals e atrasos que não se justificam |
| improve-animations / review-animations | Auditar componentes existentes e propor ajustes isolados |
| animate / animation-vocabulary | Escolher propósito, curva, duração, propriedade, entrada/saída e vocabulário |
| choreograph | Definir lead, apoio, simultaneidade, interrupção e o que permanece imóvel |
| animation-performance | Medir paint, layout, custo JS, frames, camadas e regressões |
| mobile-native / gestures | Touch, safe areas, hover, teclado, swipe e controle interrompível |
| apple-design | Continuidade espacial e adaptação da interação, sem copiar interfaces |
| prototype | Comparar duas ou três composições em branch local, inclusive versão sem motion |
| break-ui | Testar dados extremos, vazio, erro, loading, nomes longos, zoom e viewport |
| learn-taste | Registrar decisões confirmadas e seus motivos em DESIGN.md ou documento equivalente |
| pick-ui-library / ask-emil / ask-sonner | Escolher mecanismo mínimo e reaproveitar componentes existentes; módulos específicos só quando necessários |

Módulos mobile nativos (animate-expo/write-swift) não são aplicáveis por padrão a uma aplicação web. Não atualizar dependências só para cumprir esta diretriz; validar licença, SSR, bundle e compatibilidade se houver necessidade real. Referências anteriores (TasteSkill, Transitions.dev, React Bits, GSAP/Lottie/3D) são complementares quando compatíveis, não justificativa de efeitos obrigatórios.

## 3. Experiência premium: direção de arte primeiro

- Escolher uma personalidade (tipografia, paleta, contraste, espaço, forma, fotos/mídia reais, ritmo e assinatura) derivada da marca e da intenção de cada página.
- Estruturar o primeiro viewport para explicar o benefício e ação primária; evitar padrões repetitivos de cards/gradientes, sombras pesadas, excesso de badges e composição indistinguível entre projetos.
- Usar hierarquia editorial, alinhamento, espaço negativo e elementos visuais específicos ao negócio. Fazer teste sem marcas: a composição ainda comunica a proposta? Não copiar layout, ativos, textos ou marcas de sites premiados.
- Uma experiência de campanha rara pode ter um momento assinado (ex.: revelação localizada, galeria ou transformação explicativa). Não impor uma quantidade de animações; a ausência de motion pode ser a decisão correta.
- Nas rotas transacionais, busca, listas e administração, privilegiar velocidade, foco e estabilidade. Conteúdo, CTA, preços, resultados, navegação e formulários devem funcionar sem movimento, e conteúdo público/SEO deve ficar disponível antes da hidratação quando aplicável.

## 4. Critério de decisão de motion

Toda proposta precisa declarar **superfície, propósito, frequência, propriedade, easing, duração, fallback e interrupção**. Rejeitar quando não houver utilidade ou quando a frequência tornar o movimento incômodo.

| Superfície | Escolha inicial (adaptar tokens existentes) |
| --- | --- |
| Atalho de teclado ou ação repetida centenas de vezes | Imediato, sem animação ornamental |
| Press feedback ocasional | `scale(0.97)`, 100–160ms; manter hit target estável |
| Tooltip / popover pequeno | 125–200ms, origem no gatilho; tooltip seguinte sem atraso |
| Dropdown / seleção ocasional | 150–250ms, entrada/saída com resposta rápida |
| Modal / drawer | 200–500ms quando necessário, foco/escape, sem espera para interagir |
| Marketing / explicação rara | Só sequência com propósito, conteúdo legível e alternativa estática |

Se não existirem tokens equivalentes, avaliar curva de entrada/saída `cubic-bezier(0.23, 1, 0.32, 1)`, movimento entre estados `cubic-bezier(0.77, 0, 0.175, 1)` e drawer `cubic-bezier(0.32, 0.72, 0, 1)` da referência. Não adicionar sistema paralelo. Evitar ease-in em UI, transition: all, scale(0), layout properties animadas, loops decorativos e atraso no CTA. Usar transform/opacity, origem do gatilho, CSS para movimento previsível, springs para gesto realmente interrompível; `will-change` só com evidência. Não duplicar animação de pai e filhos; sem stagger em listas frequentes. Hover apenas em hover/pointer fine; respeitar reduced-motion e preferência local mais estrita, sem esconder conteúdo. Para 3D, orçamento específico, degradação estática e nenhuma dependência imposta.

## 5. Micro-rodadas futuras — sem autorização implícita de código

1. R1 — Auditoria visual real em Home e rotas críticas, 390/768/1440, registrar screenshots, fonte commit/deployment, interação, frequência, oportunidade e rejeição; comparar baseline de performance. Avaliar se os indícios acima se confirmam.
2. R2 — Direção de arte e protótipo de uma superfície, criar brief com paleta, tipografia, layout, mídia e assinatura; comparar com versão sem motion; evitar alterar contratos.
3. R3 — Implementar apenas o ajuste aprovado, em micro-PR; reusar tokens e componentes existentes. Validar teclado, foco, toque, reduced-motion, interrupção, loading/vazio/erro, textos longos e sem overflow.
4. R4 — Revisão por `review-animations`, `animation-performance`, `break-ui`; registrar antes/depois, LCP/CLS/INP ou gates locais e teste de uso real. Verificar que SEO, SSR, canonical, sitemap, dados, rotas e conversões não regrediram.
5. R5 — Aprender com feedback explícito; acrescentar decisões justificadas ao documento de design local. Merge/publicação só no fluxo aprovado do projeto; uma publicação quando necessária, sem Lovable Max sem autorização.

## 6. GO/NO-GO

GO para implementação somente com baseline visual, brief próprio da marca, propósito de cada movimento, seleção dos módulos pertinentes e uma micro-superfície definida. GO para release somente com gates locais, comparação real nos viewports, interação funcional, reduced-motion, zero regressão crítica de performance/conversão, sem novos riscos de acessibilidade, SSR/SEO e privacidade. NO-GO se movimento interferir na ação, se houver conteúdo invisível, template copiado, alteração comercial incidental, bloqueio de dados, dependência sem justificativa ou validação inconclusiva.

**Registro desta rodada:** leitura de referências e arquivos; documentação proposta/registrada em branch isolada. Nenhum código de aplicação, dependência, banco, DNS ou configuração de hospedagem foi alterado por esta diretriz.

## 7. R1.1 — baseline visual real: Home 0WEB (27/11/2026)

**Escopo:** https://0web.com.br/; visita pública sem enviar formulário, escolher consentimento ou alterar dados. Capturas após carregamento, desktop 1440 CSS px (documento 1427 px) e mobile 390 CSS px (documento 377 px); nenhuma largura excedeu o viewport nesta Home. A diferença inclui scrollbar. Não equivale a QA de todas as rotas/portfólios, acessibilidade completa, medição de Core Web Vitals ou vínculo comprovado com um SHA de Production.

| Passo e evidência | Observação | Prioridade |
|---|---|---|
| 01 — Home desktop, logo e hero carregados | Benefício e CTA claros, grade de duas colunas, painel de jornada com 3 etapas; composição tipográfica/gradiente e card informativo ainda pouco demonstrativos da capacidade autoral da agência. | P1 |
| 02 — Home mobile | CTA primário e portfólio aparecem cedo e em largura integral. Banner de privacidade semitransparente sobrepõe conteúdo da jornada; botão flutuante invade a região do banner. | P0 — reduzir sobreposição sem alterar consentimento |
| 03 — Estrutura pública (snapshot DOM da Home) | Seções loja, projetos publicados, metodologia e funil existem. Ações de detalhe e conteúdo comercial preservados; análise de cada portfolio individual e fluxo completo de contratação permanece pendente. | P1 |

**Próxima intervenção cirúrgica proposta:** primeiro arbitrar camadas flutuantes (privacidade, contato, navegação) sem remover ou manipular opções de consentimento. Depois testar uma assinatura visual autoral no hero: amostra de projetos reais e sequência legível (sem autoplay contínuo, sem mídia pesada acima da dobra, sem atrasar CTA). Usar MotionScope/MotionChoreo/tokens existentes e referência Emil para apresentação rara, não reanimar toda lista. Preservar conteúdo, rotas, funil, SEO e identidades individuais dos portfólios.

**Evidência capturada nesta sessão** (arquivos locais exatos, não integram o Git): `01-0web-1440.png` SHA256 `9bc3db0e7a9c7487a061a6b858c2adc1a321e5d49050ee4aee41f8d12fca4ee4`; `02-0web-390.png` SHA256 `6c48bdb80f8377aa38cf0d13be1c281ee7972ed0a2c1d9d39962b14602b74e8b`.
