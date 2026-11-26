# WebHub Motion Skill v0.3 — referência canônica transversal (2026-11-23)

> Escopo: documentação e critérios de adoção, NÃO implantação de bibliotecas no runtime, não instalação de skills de terceiros nem publicação de efeito em site.

## Origem e nível de prova
- Material analisado: HTML salvo e webhub.zip fornecidos pelo responsável, com script.js.download e style.css. Há evidência estática de implementação, não QA visual dinâmico.
- Integridade das fontes locais: JS SHA-256 `9cd4caf9f030338b150539ad779c0997b601cb142d9711bcfc951ba9806aa192`; CSS SHA-256 `cb5819007ce0184ec71d5c045fb5b790fb5ab86955c3cf841db4be3a4ba15b1e`.
- A versão local WebHub Motion Skill v0.3 documenta 11/12 efeitos com código que os implementa total ou parcialmente; nenhum foi homologado por vídeo/QA/fps. Não redistribuir CSS/JS, imagens, fontes, vídeo ou identidade da WebHub.
- Referência original: https://webhubeducacao.com.br/comunidade-webhub/ ; não clonar layout, marca ou conteúdo. Reproduzir padrões autorais apenas quando agregarem valor.

## Inventário M01–M12 (C=código confirmado; C parcial; H=hipótese)
| ID | Estado | Evidência técnica | Adaptação segura |
|---|---|---|---|
| M01 Hero e tipografia | C | ScrollTrigger pin/scrub, trecho `+=1000`, GSAP SplitText, 3D/crossfade | CSS/WAAPI para entrada simples; GSAP só para sequência complexa; alternativa sem movimento |
| M02 Cards e módulos | C | entradas com stagger, ícones em rotação, trilhas horizontais opostas, pin `+=3000` | usar só em vitrine editorial, nunca prender busca/admin |
| M03 Hover | C para botões | cápsula expansível `0.3s`, botão secundário `translateY(-4px)`, glitch condicional desktop | limitar a botões não essenciais, preservar foco e teclado |
| M04 Letreiros | C | `letreiroEsq/Dir` deslocam com scrub e scroll | não confundir com marquee automático infinito |
| M05 Menu | C | painel deslizante `0.4s`, overlay, animação de SVG | Escape, foco, navegação e estado aberto/fechado prevalecem |
| M06 FAQ | C | accordion grid `0fr → 1fr` em `0.3s`, ícone rotacionado | usar semântica botão/aria-expanded/teclado |
| M07 Vídeo | C | play e overlay com fade, ocultação `300ms` | não autoplay áudio; poupar LCP e respeitar consentimento/UX |
| M08 Fundos e imagens | C parcial | gradiente hero `30s` e overlays com scroll | parallax de velocidade diferencial NÃO comprovado |
| M09 Tilt/magnetismo de cursor | H/sem evidência | nenhum listener/tween de acompanhamento de cursor no JS principal | não alegar efeito original; evitar por padrão |
| M10 Indicador circular | C | giro `360°/12s`; oculto em telas `>=1000px` | decorativo e ocultável em motion reduzido |
| M11 Depoimentos | C | fades/stagger, vídeo fixado só no desktop | sem inventar autoplay/carrossel/draggable |
| M12 Transição de seção | C | máscara SVG e pinned scroll `+=1700` | liberar scroll normal e conteúdo legível sem JS |

Nota: duração de tween em timeline com `scrub` é fração de progresso; `+=1000/3000/1700` são distâncias de rolagem, não segundos.

## Curadoria externa (não confundir skill com pacote em produção)
| Origem | Commit verificado | Licença | Decisão |
|---|---|---|---|
| [greensock/gsap-skills](https://github.com/greensock/gsap-skills) | `aed9cfd3277740755f6bfc1155c7aa645403b760` | MIT (skills) | `APPROVED_CONDITIONAL`: 8 skills oficiais: core, timelines, ScrollTrigger, plugins, utils, React, performance, frameworks. Só usar runtime GSAP se justificativa técnica e dependência existente/aprovada. |
| [img2threejs/img2threejs](https://github.com/img2threejs/img2threejs) | `0c0c49bc168e648dbaf9c8c080474de0b3a941b6` | Apache-2.0 | `REFERENCE_ONLY`: reconstrução procedural 3D a partir de imagem com spec, passes, revisão visual e custo alto; não instalar automaticamente nem adicionar Three.js a sites comuns. |
| [LottieFiles/motion-design-skill](https://github.com/LottieFiles/motion-design-skill) | `d77a9fc8cb371cab1ba5420df5bfd232cd14c9bb` | MIT | `APPROVED_CONDITIONAL` como MÉTODO: intenção emocional, motion personality, duração/easing, coreografia, checklist de 8 decisões; não requer player Lottie nem Creator MCP. |

Forks existentes em `hrq16000-a11y/gsap-skills` e `hrq16000-a11y/img2threejs` são cópias de código, não prova de instalação de skill ou dependência em qualquer aplicação. Ausência de integração no runtime deste trabalho.

## Contrato de seleção para QUALQUER projeto
1. Ler AGENTS.md, router, skills e regras locais antes desta referência. Escolher `USE` (recurso já existente), `ADAPT` (método), `REFERENCE_ONLY`, `REJECT` ou `NOT_APPLICABLE` por tarefa. Evitar duplicar.
2. Prioridade: CSS nativo → Web Animations API existente → GSAP já aprovado/instalado quando scroll/timeline exceder CSS → modelagem 3D só mediante caso de uso e aprovação de custo. LottieFiles Motion Design é método independente de biblioteca.
3. Preservar `prefers-reduced-motion`, teclado, foco, Escape, SSR, LCP/CLS, SEO/index/sitemap e conteúdo completo sem JS. Não instalar libs, hooks, MCPs ou rodar `npx skills add` sem escopo/aprovação.
4. 0WEB: novas páginas e futuros portfólios com identidade própria e CTA→lead→WhatsApp; não retrabalhar portfólios existentes por adoção de skills. Não tocar no institucional congelado.
5. Encontre um Técnico: movimento mínimo em busca, perfis e painel; não alterar contatos, Supabase, RLS, pagamentos nem condições comerciais.
6. O Técnico de Informática: usar transições discretas em serviço/editorial; preservar SEO, acessibilidade, desempenho e funil.
7. Demais projetos: adotar somente padrões relevantes e licenciados, com revisão antes de qualquer dependência. Motion pode ser `NOT_APPLICABLE`.
8. Em implantação futura validar apenas o que for afetado no Chromium 390/1440, motion reduzido, teclado e fluidez. Nenhum efeito aqui é considerado homologado em produção.

## Status de publicação e conclusão deste registro
- **Inventário**: M01–M12 preservados; 11 com evidência estática (M08 parcial), M09 não comprovado; **0** com validação visual dinâmica.
- **Skill transversal**: documento de referência inserido no 0WEB e apontado por `.agents/skills/shared-reference-intelligence/SKILL.md` após merge.
- **GSAP/img2threejs/LottieFiles**: fontes catalogadas, não instaladas/ativadas por esta PR. Não publicar alterações em sites ou Vercel a partir de documentação.
- **Futuro trabalho opcional**: aplicação pontual por projeto, em PR de runtime própria, mediante necessidade real, gates de segurança/performance e autorização.

## Evidências de repositório
- Registro de 2026-11-23 com status separado: `documentado`, `skill local disponível`, `dependência instalada`, `site implantado` e `QA visual`. Esta PR só comprova o primeiro e o apontamento à skill local 0WEB.
- Não embutir arquivos de terceiros nem executar scripts do site analisado. Verificação: diff somente de arquivos de documentação; sem package.json, lockfile, workflows, fontes, assets, deploy ou alterações de produção.
