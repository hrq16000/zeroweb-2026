# WebHub Motion Skill — curadoria e conclusão documental (2026-11-23)

Status: **CURATED_REFERENCE / DOCUMENTED**. Não equivale a instalação, integração funcional, QA visual ou publicação de novas animações. Referência transversal para 0WEB, Encontre um Técnico, O Técnico de Informática e projetos futuros, sempre subordinada ao `AGENTS.md` de cada projeto.

## Objetivo e evidências da WebHub

Fonte observada: https://webhubeducacao.com.br/comunidade-webhub/ (HTML, CSS e JavaScript fornecidos pelo responsável e analisados fora dos repositórios). A captura do código revelou GSAP, ScrollTrigger, ScrollSmoother, SplitText, timelines e vários padrões. **11 dos 12 itens têm evidência de código**, mas os movimentos não foram homologados visualmente em runtime e não existe medição visual de frames/easing. Não copiar HTML, CSS, JS, layouts, branding ou assets da WebHub; transpor somente padrões técnicos e ideias gerais.

| ID | Padrão identificado no código | Nível de evidência |
| --- | --- | --- |
| M01 | Hero: pin de 1.000 px, transformações/opacidade/SplitText | Código confirmado |
| M02 | Cards e módulos: stagger, rotações e galeria horizontal com pin de 3.000 px | Código confirmado |
| M03 | Botões: cápsula expansível, elevação e glitch de caracteres | Código confirmado |
| M04 | Letreiros em deslocamento horizontal ligado à rolagem | Código confirmado |
| M05 | Menu: painel lateral, overlay e SVG desenhado | Código confirmado |
| M06 | FAQ: accordion 0,3 s e rotação de seta | Código confirmado |
| M07 | Vídeo: controle inline, overlay que desaparece | Código confirmado |
| M08 | Gradiente em ciclo de 30 s e transições por scroll; **parallax diferencial não comprovado** | Parcialmente confirmado |
| M09 | Magnetismo/tilt de cursor | **Não identificado** |
| M10 | Indicador de scroll circular, 12 s; oculto a partir de 1.000 px | Código confirmado |
| M11 | Depoimentos: fade, desktop/mobile diferentes | Código confirmado |
| M12 | Transição por máscara SVG com pin de 1.700 px | Código confirmado |

Os números de pin indicam **distância de rolagem**, não duração em segundos. A existência de um tween no JS não prova que foi executado em todas as viewports. Captura visual futura é *opcional* para catálogo, mas necessária antes de alegar fidelidade final a uma referência visual.

## Três fontes oficiais — versão da consulta

- **GreenSock / GSAP Skills:** https://github.com/greensock/gsap-skills @ `aed9cfd3277740755f6bfc1155c7aa645403b760` (licença MIT para as skills). Oito competências: `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins`, `gsap-utils`, `gsap-react`, `gsap-performance`, `gsap-frameworks`. Consultar especialmente lifecycle React, escopo, cleanup, SSR, scroll pin e performance. **Referência de método**, não prova de instalação da biblioteca GSAP.
- **LottieFiles / Motion Design Skill:** https://github.com/LottieFiles/motion-design-skill @ `d77a9fc8cb371cab1ba5420df5bfd232cd14c9bb` (MIT). Filosofia agnóstica ao motor: intenção emocional, narrativa visual, craft, arquétipo de marca, duração/easing, coreografia, estados de loading/sucesso/erro, reduced motion. A skill pode orientar CSS/WAAPI, Motion ou GSAP **sem incorporar runtime Lottie**. Creator MCP/exportação não são requisito para UI web.
- **img2threejs:** https://github.com/img2threejs/img2threejs @ `0c0c49bc168e648dbaf9c8c080474de0b3a941b6` (Apache-2.0). Modelagem procedural Three.js a partir de imagem, pipeline de passos bloqueantes, spec de componentes/materiais, comparação de renders, limites de confiança e correções limitadas. Usar quando exista **necessidade real de 3D autoral**, não para qualquer card/hero. O próprio projeto descreve custos de tokens estimados elevados; não tratar estimativas como benchmark nem executar o pipeline sem aprovação.

Existem *cópias de repositório*, que não são instalação das skills nos produtos:
- https://github.com/hrq16000-a11y/gsap-skills
- https://github.com/hrq16000-a11y/motion-design-skill
- https://github.com/hrq16000-a11y/img2threejs

## Estado verificado nos três projetos em 2026-11-23

| Repositório | Skills locais / runtime evidenciados | Status destas três skills |
| --- | --- | --- |
| `hrq16000/zeroweb-2026` | `.agents/skills/` e roteador local presentes; pacote `motion@12.40.0` no package.json | Referências **curadas** neste documento; **não há instalação comprovada** das três skills oficiais |
| `hrq16000-a11y/encontreumtecnico` | AGENTS.md e contratos de UX; manifesto sem dependência direta GSAP/Three/Lottie | **Não instaladas/comprovadas**; motion discreto, funcional e acessível |
| `hrq16000/otecnicodeinformatica_2026` | Duas skills locais de editorial/segurança, gates de motion, manifesto sem dependência direta GSAP/Three/Lottie | **Não instaladas/comprovadas**; priorizar performance/SEO/CTA real |

**Escopo da verificação:** manifesto de dependências diretas, pastas locais de skills e políticas AGENTS consultadas; não é auditoria de dependências transitivas, CDN, branches fora da main ou execução em produção. Não prometer que uma documentação no 0WEB é descoberta automaticamente por agentes de outros repositórios.

## Regra de seleção por tarefa (reutilizável)

1. `CSS/WAAPI` e biblioteca **já instalada** primeiro. Reutilizar componentes e contratos existentes; nenhum pacote obrigatório apenas por ter sido pesquisado.
2. Se houver sequenciamento avançado, pin, scrub ou sincronização por scroll, **consultar GSAP Skills**; adotar GSAP runtime apenas com medição e justificativa. Em React, escopar e limpar tweens/ScrollTriggers no unmount; nunca acessar DOM no SSR.
3. Para definir linguagem de movimento, hierarquia, timing e feedback, consultar **LottieFiles Motion Design Skill** como referência de princípios. Não exigir MCP, conta, vídeo ou render externo por padrão.
4. Para reconstrução 3D a partir de imagem legítima, considerar **img2threejs**, com protótipo isolado, orçamento de tokens, limite de passagens e revisão de qualidade. Não instalar em landing comum; SVG/CSS/imagem estática podem resolver melhor.
5. Selecionar `USE_EXISTING`, `ADAPT_PRINCIPLES`, `REFERENCE_ONLY`, `NOT_APPLICABLE` ou `REJECT`, justificando o mínimo necessário. **Não** copiar código de terceiros sem verificar licença do trecho específico.
6. Preservar `prefers-reduced-motion`, foco, teclado, leitura sem JS, mobile 390px/desktop 1440px, Core Web Vitals, SEO indexável, funis e privacidade. Evitar movimento contínuo sobre conteúdo importante e motion no painel administrativo sem propósito.
7. Prioridade de aplicação: **novos** portfólios 0WEB quando a identidade pedir; em EUT e Técnico de Informática apenas estados/feedback úteis. Não retrabalhar portfólios existentes só pela existência da skill.
8. Nenhum instalador (`npx skills add`, `npm install`), agente externo, testes caros, PR cruzada, banco, RLS, merge ou deploy é consequência automática deste registro.

## Encerramento / rastreabilidade

- Entrega desta PR: **governança documental central e ligação à skill local**. Não altera CSS/JS/rotas/pacotes, UI ou conteúdo comercial.
- **Documentação publicada no GitHub** e **biblioteca instalada no agente** são estados diferentes. Só declarar a segunda após verificar caminho do agente, import/ativação e execução em um repositório específico.
- Não há motivo para repetir auditoria HTML/WebHub nem exigir vídeo para a curadoria.
- Integrações reais por site, se algum dia forem pedidas, são **novos escopos independentes**, com PR mínima, QA existente e autorização específica para publicar.

Fontes internas vinculadas: `.agents/skills/shared-reference-intelligence/SKILL.md`, `docs/AGENT_SKILLS_GOVERNANCE.md`, `docs/LANDING_PAGE_MOTION_EVIDENCE_STANDARD.md`, `docs/skills/REGISTRY.md`.
