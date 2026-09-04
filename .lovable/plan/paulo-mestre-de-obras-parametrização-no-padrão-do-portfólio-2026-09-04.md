# Paulo Mestre de Obras — parametrização no padrão do portfólio

## Situação verificada

- `portfolio-assets.json` usa a **foto de capa como logo** (`icon: capa.webp`, 1084x1600). Projetos no padrão (ex.: Águia Sul) têm `logo.webp` quadrado próprio.
- A imagem social (`capa-og.jpg`, 1200x630) é apenas um recorte da mesma foto, sem marca do projeto. As tags Open Graph já estão publicadas e corretas tecnicamente (`og:image` com versão de cache), então o que falta é qualidade/identidade, não a tag.
- A página usa **a mesma foto duas vezes** (hero e bloco "qualidade"); não há outras imagens.
- O pop-up da 0WEB **está montado** (`PortfolioUpsellPopup` na página e no `PortfolioStandardShell`, com guard de instância única) e a configuração global está `enabled: true`. O disparo é uma vez por sessão (10s, 90% de scroll ou fallback de 25s) e fica gravado em `localStorage`. Antes de mudar código, o comportamento real na página publicada será reproduzido em navegador para confirmar se há falha ou apenas sessão já marcada.
- Conteúdo enxuto comparado ao padrão: hero, 4 cards, bloco de qualidade e CTA. Sem blocos de processo/diferenciais, sem FAQ, sem JSON-LD de negócio local próprio.

## O que será feito

### 1. Identidade visual própria
- Criar `public/images/paulo-mestre-de-obras/logo.webp` (marca própria do projeto: capacete/prumo + tipografia, paleta azul-noite `#101d35` e amarelo `#f5b51b` já usada na página) e apontar `icon` para ele.
- Gerar imagens de apoio próprias do projeto (fundação/alvenaria, revestimento/azulejo, acabamento) em `/images/paulo-mestre-de-obras/`, otimizadas em WebP, para que hero, bloco de qualidade e galeria não repitam a mesma foto.
- Gerar nova imagem social 1200x630 com a marca e o posicionamento do serviço, regenerar `socialVersion` (cache-busting) via o script existente e revalidar `og:image`/`twitter:image`.

### 2. Pop-up da 0WEB
- Reproduzir a página em navegador (desktop e mobile) com sessão limpa e confirmar exibição, foco, ESC e envio do funil. Se houver falha real (guard, gating por slug ou overlay), corrigir a causa; caso contrário, registrar a evidência de que já funciona igual ao Águia Sul.

### 3. Conteúdo e experiência
- Reescrever `PauloMestreDeObrasPage.tsx` em formato legível (hoje é praticamente uma linha só), mantendo rota, CTA e funil atuais, com:
  - hero com marca própria e imagem real;
  - serviços detalhados por etapa de obra;
  - bloco "como funciona" (visita/orçamento → execução → entrega);
  - galeria de serviços com imagens próprias;
  - FAQ curta (prazos, orçamento, região atendida);
  - CTA final e faixa de contato via funil (sem telefone no bundle).
- **Sem depoimentos, notas ou métricas inventadas** (regra editorial do projeto). A prova social usa o `PortfolioSocialProofPopup` já configurado, com linguagem qualitativa.

### 4. SEO local
- Adicionar em `portfolio.$slug.tsx` um nó JSON-LD `LocalBusiness`/`HomeAndConstructionBusiness` específico do projeto (área atendida Curitiba e região, serviços), no mesmo padrão já aplicado a Heloá Gás, sem expor contato.
- Revisar título/descrição com palavras-chave locais (pedreiro, azulejista, reforma, Curitiba e região).

### 5. Validação
- `bun run validate:portfolio-boundaries`, validadores de logos/ícones/assets/meta/link-previews, `bun test`, typecheck e `bun run build`.
- Playwright em viewport mobile e desktop: pop-up, CTA/funil, imagens carregando, `prefers-reduced-motion`.
- Conferência das tags sociais no HTML publicado após o deploy.

## Notas técnicas

- Arquivos tocados: `src/components/site/PauloMestreDeObrasPage.tsx`, `src/config/portfolio-assets.json`, `src/config/portfolio-catalog.json` (capa), `src/routes/portfolio.$slug.tsx` (JSON-LD/meta), novos assets em `public/images/paulo-mestre-de-obras/`.
- Sem alteração de identidade compartilhada da 0WEB dentro da região do cliente; casca, rodapé e upsell continuam vindo do `PortfolioStandardShell`.
- A imagem social só muda no preview de link após publicar; crawlers podem servir o cache antigo até re-rastrear.
