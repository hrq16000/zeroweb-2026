# PORTFOLIO ZERO-GENERIC STANDARD

Status: **CANÔNICO · OBRIGATÓRIO · ZERO TOLERÂNCIA**.

Este documento complementa e endurece `PORTFOLIO_UNIQUE_COMPOSITION_STANDARD.md`, `PORTFOLIO_NEW_CLIENT_PLAYBOOK.md`, `EXPERIENCE_DESIGN_MAX_STANDARD.md`, `LAYOUT_ENGINEERING_STANDARD.md` e `SKILL_MARKETPLACE_DISCOVERY_STANDARD.md`.

## 1. Regra absoluta

Nenhuma página, variante, derivado, preview ou material visual pertencente a um projeto `/portfolio/<slug>` pode ser aceito como concluído se parecer genérico, vazio, estático por falta de intenção, derivado de um esqueleto compartilhado ou apenas uma troca de marca/conteúdo em um layout já usado.

**Cliente diferente = experiência digital diferente.**

Engenharia, segurança, analytics, funil e primitives podem ser compartilhados. A composição perceptível, direção visual, narrativa, mídia, ritmo, interação e assinatura de movimento não podem ser tratadas como template.

## 2. Escopo — vale para a família inteira do projeto

A política não vale apenas para a URL pública principal. Ela cobre obrigatoriamente:

- `/portfolio/<slug>`;
- card/capa do cliente em `/portfolio`;
- preview/modal/viewer/iframe do catálogo;
- preview de editor/admin e preview de PR/Vercel;
- hero, cover, social/OG, thumbnail, preview e share media;
- kits derivados exibidos pela plataforma quando representarem o projeto;
- funil visual quando integrado à experiência da marca;
- versões mobile/tablet/desktop;
- versão `prefers-reduced-motion`;
- futuras variantes A/B, campanhas ou LPs derivadas do mesmo projeto;
- promoção do mesmo projeto para domínio próprio/alias, sem reconstrução estética paralela;
- qualquer rota ou componente alternativo que renderize a identidade do mesmo `client_key`/projeto.

Não é permitido um hero premium na landing e uma capa genérica no catálogo; uma página autoral e um preview velho; uma versão Vercel e outra versão visual no domínio; ou OG/social desconectado da direção aprovada.

## 3. Skill discovery é obrigatório, não opcional

Antes de criar um projeto novo ou executar manutenção visual/material em qualquer item do escopo acima:

1. executar o roteador local `0web-skill-router`;
2. executar `0web-skill-discovery`;
3. consultar catálogo local e fontes originais;
4. pesquisar LobeHub Skills Marketplace e AwesomeSkill Search (`https://awesomeskill.ai/search`) quando houver ganho possível;
5. localizar a fonte original sempre que possível;
6. revisar segurança/licença/dependências/rede/segredos;
7. carregar o **máximo de competências relevantes e não redundantes**;
8. registrar skills usadas, rejeitadas e o motivo;
9. aplicar obrigatoriamente `0web-experience-design-max`, `0web-portfolio-art-direction`, layout engineering, qualidade UI, acessibilidade, performance, SEO/conteúdo, conversão e QA quando aplicáveis.

"Buscar/puxar skills" significa descobrir, avaliar e internalizar/usar capacidades úteis. Não significa executar cegamente scripts de terceiros, instalar dependências no runtime ou expor segredos.

## 4. Pesquisa antes de desenhar

A direção visual não nasce de um preset. Antes do layout, investigar:

- entidade real do cliente e sua localidade;
- produto/serviço, linguagem, público e intenção de conversão;
- concorrência e códigos visuais do mercado;
- ativos reais disponíveis;
- provas verificáveis;
- material enviado pelo cliente;
- oportunidade de gerar/derivar brand art, ilustração, recortes ou composições sem fingir evidência factual;
- páginas vizinhas do próprio portfólio para evitar repetição.

Quando houver pouca informação, o sistema deve pesquisar e perguntar somente os gaps que impedem uma decisão factual ou criativa segura.

## 5. Direção criativa antes do JSX

Toda criação ou redesign material deve produzir Creative Composition Brief e considerar pelo menos três direções **substancialmente divergentes** antes de escolher a direção final. Elas precisam divergir em mais do que cor:

- geometria de hero;
- topologia/ordem de regiões;
- relação mídia/texto;
- tipografia e escala;
- navegação/header;
- densidade e espaço negativo;
- fundo e ritmo cromático;
- prova e conversão;
- assinatura de movimento;
- encerramento.

Se as direções forem apenas variações do mesmo esqueleto, devem ser regeneradas.

## 6. Layout engineering obrigatório

Flexbox, Grid, intrinsic sizing e responsive flow são ferramentas de engenharia, não uma estética. Toda página deve avaliar conscientemente:

- Flexbox: `main axis`, `cross axis`, `flex-direction`, `justify-content`, `align-items`, `flex-wrap`, `gap`, `flex-grow`, `flex-shrink`, `flex-basis`, `min-width: 0` e ordem semântica;
- CSS Grid: macrocomposição bidimensional, áreas, tracks e assimetria quando apropriado;
- intrinsic sizing: `minmax()`, `clamp()`, `min-content`, `max-content`, `fit-content` e containers fluidos quando úteis;
- 390px, 768px e 1440px como evidência mínima;
- layout nunca dependente de hover em touch;
- sem overflow horizontal ou layout shift evitável.

O uso repetido de `max-width + grid-cols-3 + rounded cards` sem justificativa é sinal de genericidade, não de qualidade.

## 7. Mídia é parte da composição

Cada projeto precisa de estratégia de mídia própria. Avaliar `hero`, `catalogCover`, `social/OG` e `preview` como destinos explícitos.

Fontes podem ser:

- mídia real do negócio;
- material fornecido pelo cliente;
- brand composition criada a partir da identidade;
- ilustração/editorial/contextual gerada;
- SVG, textura, recorte, composição tipográfica ou mockup claramente não documental.

É proibido fabricar equipe, sede, obra executada, cliente, review, prêmio ou resultado. Quando falta foto real, criar **arte de marca/contexto**, não falsa evidência.

`MEDIA_STARVATION` é falha: uma landing comercial visualmente vazia por falta de foto não pode ser publicada apenas com caixas e texto.

## 8. Motion e interação: vida com propósito

Toda página avalia a matriz global:

`fade-up` · `fade-left/right` · `blur-in` · `scale-in` · `stagger-up` · `image-reveal` · `clip-reveal` · `parallax` · `marquee` · `float` · `header-scroll` · `menu-reveal` · `text-line-reveal` · `progress-line`.

E também microinterações, feedback de CTA/form, accordion, media transition, SVG/Lottie, 3D/cursor response quando pertinentes.

Cada capability recebe `REQUIRED`, `OPTIONAL` ou `NOT_APPLICABLE`. Não aplicar todos os efeitos por obrigação; é obrigatório **avaliar todos** e usar o máximo que sobreviver a propósito, identidade, acessibilidade, performance e conversão.

Páginas inteiramente estáticas são permitidas somente quando a direção deliberadamente justificar isso e ainda houver riqueza compositiva. "Não teve tempo de animar" ou "usou o default" não é direção criativa.

## 9. Hard blockers — nenhum destes estados é aceitável como DONE

- `SKILL_DISCOVERY_SKIPPED`
- `GENERIC_COMPOSITION`
- `SHARED_VISUAL_SKELETON`
- `SKIN_SWAP`
- `REUSED_HERO_GEOMETRY_WITHOUT_JUSTIFICATION`
- `DEFAULT_SECTION_ORDER`
- `DEFAULT_TYPOGRAPHY_WITHOUT_BRAND_REASON`
- `REPEATED_GRID_TOPOLOGY`
- `REPEATED_MOTION_GRAMMAR`
- `NO_SIGNATURE_MOMENT`
- `MEDIA_STARVATION`
- `CATALOG_COVER_GENERIC`
- `PREVIEW_ASSET_DRIFT`
- `OG_DIRECTION_DRIFT`
- `MOBILE_GENERIC_COLLAPSE`
- `REDUCED_MOTION_BROKEN`
- `NO_BRAND_TEST_FAIL`
- `HIGH_SIMILARITY_UNRESOLVED`
- `VISUAL_QA_MISSING`

Build verde sem resolver esses estados não transforma a página em entrega aprovada.

## 10. Teste sem marca e teste de vizinhança

Remover nome, logo, cores, copy e fotos. Se a página continuar com a mesma silhueta/topologia de outra, FAIL.

Comparar cada projeto com os projetos visualmente mais próximos. Avaliar hero, header, DOM/section graph, grids, mídia, background rhythm, prova, CTA, motion e closing. Alta similaridade deve gerar redesign, não justificativa cosmética.

## 11. Legado não recebe anistia

Projetos antigos podem permanecer publicados durante remediação para não quebrar o negócio, mas **não são considerados visualmente concluídos** apenas por serem legados. Ao entrar em manutenção material, redesign, troca de mídia/capa, correção estrutural ou republicação relevante, passam integralmente por esta norma.

O backlog deve convergir todos os projetos atuais para a política zero-generic em ondas, priorizando `HIGH_SIMILARITY`, `ATTENTION`, mídia/capa fraca, hero genérico e páginas sem assinatura própria.

Não usar "legado" como justificativa para manter template perceptível indefinidamente.

## 12. Critério de aceite

Uma entrega de portfolio só pode receber estado visual equivalente a `DONE/PASS/PUBLISHED_QUALITY` quando existir evidência de:

- skill discovery executado;
- direção criativa e composição próprias;
- fingerprint completo;
- mídia por finalidade resolvida;
- layout responsivo autoral;
- motion/interação avaliados e implementados quando relevantes;
- NO-BRAND TEST = PASS;
- comparação com vizinhos = PASS;
- screenshots/runtime em 390/768/1440;
- reduced-motion funcional;
- SEO/funil/privacidade/performance sem regressão;
- card/capa/preview/OG coerentes com o mesmo projeto.

## 13. Proibição final

Não criar, regenerar ou "melhorar" `/portfolio/<slug>` com a fórmula:

`template conhecido + dados do cliente + logo + nova cor + nova foto + mesmos cards + mesmo CTA + mesmas animações`.

Isso é `FAIL`, mesmo que o resultado seja tecnicamente válido.

A plataforma deve parecer uma coleção de **sites independentes de clientes reais**, não uma galeria de skins do mesmo construtor.
