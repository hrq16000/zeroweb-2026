# EXPERIENCE DESIGN MAX — padrão global 0WEB

Status: **normativo** para novas páginas comerciais, homes, material redesigns e `/portfolio/:slug` com alteração visual relevante.

Este padrão soma aos contratos existentes. Não substitui identidade do cliente, direção criativa, segurança, acessibilidade, performance, funil, SEO, privacidade ou factualidade.

## 1. Objetivo

Transformar cada entrega em uma experiência digital completa: estratégia de negócio + UX/UI + design system + desenvolvimento + conteúdo + SEO/Web Vitals + motion + QA/Design Ops.

O princípio operacional é: **usar o máximo de competências relevantes sem transformar a página em demonstração de efeitos**. Skill é lente de decisão. Efeito é ferramenta. Nenhum dos dois é objetivo por si só.

## 2. Camadas obrigatórias de decisão

Toda entrega material deve passar por estas camadas antes de publicação:

1. **Estratégia Digital** — objetivo de negócio, persona/público, mercado, concorrência, posicionamento e jornada.
2. **UX/UI Design** — arquitetura de informação, hierarquia, clareza, estados, responsividade, acessibilidade e testes de usabilidade quando aplicáveis.
3. **Design System** — tokens e padrões coerentes com a identidade local do cliente; design-to-code sem impor skin institucional.
4. **Desenvolvimento Web** — semântica, progressive enhancement, compatibilidade com a stack, performance e segurança.
5. **Conteúdo + SEO & Web Vitals** — conteúdo factual, útil, indexável, legível por mecanismos de busca e agentes de IA.
6. **Motion Design** — roteiro, transições, 2D/3D quando justificado e UI motion com propósito.
7. **Design Ops / QA** — governança, critérios de aceite, evidência visual, quality gates e prevenção de regressão.

## 3. Matriz global de motion

Cada projeto classifica cada capacidade como `REQUIRED`, `OPTIONAL` ou `NOT_APPLICABLE`. `NOT_APPLICABLE` precisa ser uma decisão consciente, não ausência de análise.

| Capacidade | Nome técnico / intenção | Uso esperado | Reduced motion / mobile |
|---|---|---|---|
| `fade-up` | reveal vertical por opacidade + Y | entrada editorial e progressão de leitura | opacity-only ou imediato |
| `fade-left/right` | reveal lateral por opacidade + X | contraponto direcional, timeline, alternância | remover deslocamento |
| `blur-in` | blur → nitidez | atmosfera, foco progressivo, hero/arte | sem blur animado |
| `scale-in` | escala sutil → 1 | destaque de item/CTA/media | escala removida |
| `stagger-up` | sequência escalonada | grupos, grids e listas com ritmo | conteúdo simultâneo ou atraso mínimo |
| `image-reveal` | máscara/zoom controlado de mídia | introduzir imagem com intenção | imagem estática |
| `clip-reveal` | `clip-path`/mask reveal | cartaz, recorte editorial, transição de camadas | mostrar integralmente |
| `parallax` | deslocamento relativo ao scroll | profundidade e hierarquia espacial | desligado; em mobile normalmente desligado |
| `marquee` | fluxo horizontal contínuo | repertório/marcas/tags quando semanticamente útil | pausar/remover loop e manter conteúdo legível |
| `float` | oscilação lenta de elemento decorativo | profundidade leve, elementos abstratos | remover loop |
| `header-scroll` | estado do header ligado à rolagem | compactação, contraste e contexto | preservar navegação sem depender do efeito |
| `menu-reveal` | abertura com stagger/máscara | navegação imersiva | duração reduzida, foco correto |
| `text-line-reveal` | revelação por linha/palavra | hero, manifesto, títulos de transição | texto estático completo |
| `progress-line` | progresso ligado ao scroll | leitura longa, storytelling ou capítulo | opcional; não bloquear navegação |

## 4. Capacidades complementares

Avaliar quando relevantes:

- **Microinterações:** hover/press, underline animado, ícone responsivo, feedback do CTA, foco, loading, sucesso e erro.
- **Skeleton / preloader:** apenas quando há espera real; nunca segurar conteúdo já disponível.
- **Form feedback validation:** erro junto ao campo, foco e mensagem; shake apenas leve e opcional, nunca único sinal de erro.
- **Accordion transition:** abrir/fechar FAQ ou conteúdo expansível com altura/opacity tratadas de forma acessível.
- **Scroll-triggered storytelling:** sticky handoff, section transition, media crossfade ou pinning quando houver narrativa real.
- **3D interativo:** CSS perspective, WebGL/Three ou equivalente somente quando elevar compreensão/identidade; exige fallback estático, budget e mobile strategy.
- **Lottie/SVG motion:** preferível a vídeo pesado quando a animação vetorial comunica processo ou identidade.
- **Hero typography:** stagger de palavra/linha, máscara ou composição cinética sem atrasar entendimento da proposta de valor.

## 5. Regra de intensidade

`SUBTLE | BALANCED | EXPRESSIVE | IMMERSIVE` continua sendo o vocabulário canônico.

O nível define quantidade e amplitude, não qualidade. Um projeto `SUBTLE` pode ter microinterações sofisticadas; um `IMMERSIVE` continua obrigado a Web Vitals, reduced motion, mobile simplificado e clareza de conversão.

## 6. Máximo de skills relevantes

Antes de uma entrega visual substancial, a composição de skills deve cobrir, quando aplicável:

- descoberta de skills;
- estratégia/direção criativa;
- UI/UX design intelligence;
- landing/CRO;
- design system;
- motion;
- acessibilidade;
- React/performance;
- SEO/conteúdo;
- privacidade/segurança;
- quality gates e evidência visual.

A métrica não é quantidade bruta de skills carregadas. Duas skills que repetem a mesma receita não contam como ganho. Uma skill externa que conflita com identidade, segurança, stack ou performance é rejeitada e registrada.

## 7. Referências de repertório incorporadas

- **Dexa Experience Design:** estratégia digital, UX/UI, websites, design de produto, design system, motion design e Design Ops como disciplina integrada.
- **UI/UX Pro Max:** design intelligence pesquisável para estilo, cor, tipografia, landing, UX, acessibilidade, motion e stack.
- **AwesomeSkill / LobeHub Skills Marketplace:** descoberta de competências complementares e comparação de skills.
- **WCRIA / referências de landing pages:** repertório de ritmo, profundidade, parallax, microinterações e scroll-driven motion; nunca template para copiar.

Referência externa não autoriza copiar layout, identidade, asset, texto, depoimento, número ou claim.

## 8. Precedência

`requisito do projeto → segurança → acessibilidade → integridade factual/dados → regra de negócio → identidade/direção criativa → arquitetura existente → performance → UX → skills externas → estética/repertório`.

## 9. Regras de performance e acessibilidade

- Conteúdo essencial deve existir no HTML/DOM antes de animação.
- Preferir `transform`, `opacity` e `clip-path` limitado.
- Sem scroll horizontal, layout shift ou bloqueio de interação causado por motion.
- `prefers-reduced-motion` deve produzir uma experiência completa, não uma versão quebrada.
- Não depender de hover em touch.
- Parallax/pinning/3D pesado devem ser reduzidos ou desligados em mobile quando necessários.
- Não adicionar bibliotecas pesadas quando CSS, APIs nativas ou primitives locais resolvem.

## 10. Regra de originalidade

Motion também compõe identidade. Páginas com a mesma coreografia, ordem, hero e fechamento não se tornam originais só porque têm cores, logos e textos diferentes.

Cada projeto define sua própria assinatura visual e de movimento. O teste sem marca continua obrigatório: remover nome/logo/cores/copy/fotos e verificar se a composição ainda é reconhecivelmente distinta das vizinhas.

## 11. Evidência e aceite

Antes de declarar uma entrega visual concluída:

- hero e principais blocos devem ser vistos em runtime;
- signature moments devem ter evidência `BEFORE → DURING → AFTER` quando aplicável;
- validar 390px, 768px e 1440px;
- validar teclado/foco e `prefers-reduced-motion`;
- verificar console, overflow, LCP/CLS/INP quando a mudança justificar;
- registrar skill stack, capacidades aplicadas, capacidades rejeitadas/N/A e motivo.

## 12. Regra final

A 0WEB deve maximizar **competência, intenção, originalidade e qualidade observável**. Não maximizar ruído visual. Toda animação, componente e skill precisa justificar sua presença na jornada do usuário.