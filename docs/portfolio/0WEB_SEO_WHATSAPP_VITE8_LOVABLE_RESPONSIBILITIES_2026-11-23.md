# 0WEB — Indexação, malha comercial, WhatsApp, Vite 8 e responsabilidade Lovable

Data: 2026-11-23. Aplicação: raiz 0WEB, páginas `/portfolio/:slug`, atuais e novas. Esta nota complementa `AGENTS.md`, `docs/0WEB_GIT_FIRST_RELEASE_AND_SEO_POLICY.md`, o contrato individual de SEO e os gates atuais, sem substituí-los.

## Compromisso para publicação

- Todo projeto **publicado e validado** deve ter HTTP 200 no domínio oficial, `index,follow,max-image-preview:large`, canonical próprio, metadados e OG adequados, JSON-LD factual, caminho no catálogo, sitemap-portfolio.xml e links HTML em redes por segmento, bairro, cidade e serviços. Nunca promover projeto `draft`/não validado ao sitemap via atalho que burle o gate v4.
- `robots.txt` e `X-Robots-Tag` não podem contradizer a página publicada. Não anunciar indexação no Google sem status comprovado no GSC. Um sitemap não garante indexação, Discover ou ranking.
- A malha existente é `src/lib/portfolio-seo-network.ts`, `src/components/portfolio/PortfolioSeoNetwork.tsx` e `src/lib/portfolio-places.ts`. Reaproveitar, não duplicar páginas artificiais. Incluir links legítimos para criação de sites, presença digital, gestão de redes sociais e Google Meu Negócio quando pertinentes, separados dos serviços prestados pelo cliente.
- Conteúdo rico exige informações próprias e úteis ao leitor (serviços realmente oferecidos, localização, dúvidas, fotos com direitos confirmados, diferenciais e guias originais), transparência sobre demonstrações independentes e manutenção. Evitar páginas doorway, falsas avaliações, repetição de keywords, apropriação de identidade e links artificiais.
- Discover: orientar produção para imagens representativas relevantes com largura >= 1200 px, alta resolução, metadados, preview large, bom mobile e conteúdo de interesse. AdSense: originalidade, navegação, conformidade com políticas, transparência editorial; **nenhuma elegibilidade ou receita pode ser garantida**.

## Funil e WhatsApp

- Modelo desejado: CTA/funil específico do cliente -> respostas validadas e persistidas com consentimento -> protocolo ou confirmação -> opção de abrir WhatsApp real verificado daquele cliente com contexto do pedido. A última etapa é um clique consciente do visitante, jamais redirecionamento automático para WhatsApp não autorizado.
- `src/config/portfolio-whatsapp.json` é a fonte versionada das destinações de clientes; `whatsapp:null` significa **não confirmado**, nunca substituir pelo WhatsApp de outro cliente ou pelo canal operacional da agência. Manter lead-only Jotform seguro se o telefone não estiver comprovado, sem alegar entrega ao salão.
- Em `espaco-marli-nails-guaratuba`, o WhatsApp individual segue `null`; o formulário Jotform de consulta da 0WEB e o formulário comercial da 0WEB são **duas finalidades distintas**. O CTA da narrativa compartilhada deve usar o Jotform verificado, não abrir o backend antigo desconfigurado.
- Não pedir nem configurar SUPABASE_SERVICE_ROLE_KEY para portfólios. Não expor telefones privados, tokens de entrega ou credenciais em HTML/JS. Se houver integração com banco, aplicar somente a menor operação com segurança comprovada.

## Vite 8 / Rolldown — piloto isolado

- O repositório está em Vite ^7.3.1 e TanStack Start 1.168.60, `@lovable.dev/vite-tanstack-config` 2.26.5, Nitro 3 beta, React 19, Tailwind 4; configuração `vite.config.ts` contém `rollupOptions.onwarn`. Vite 8 troca Rollup+esbuild pelo Rolldown/Oxc com compatibilidade parcial.
- Usar a recomendação oficial: testar a migração Vite 7 -> `rolldown-vite` em **worktree/branch separada sem publish**, isolar diferenças de build/SSR, ajustar configurações incompatíveis e, só com resultados reproduzíveis, migrar para Vite 8 estável e atualizar lockfile via gerenciador do projeto.
- Antes de mudar o lockfile/deps: comprovar compatibilidade de `@lovable.dev/vite-tanstack-config` e TanStack/Nitro; verificar peerDependencies, Node suportado e plugins. Testar SSR, hydration, rotas, geração de sitemap, Jotform, source maps, assets, build, distribuição/chunks e Web Vitals 390/768/1440. Não deixar Vite 8 como dependência quebrada na PR comercial da Marli.
- Depois de GO e baseline: considerar 0WEB como projeto piloto para difundir a metodologia aos demais repositórios, **nunca atualização global simultânea**. Sem Max mode, sem Lovable para codificação, sem deploy de teste redundante.

## Limite de responsabilidade do Lovable e Supabase

- Lovable só entra **depois** da implementação visual, SEO, funil independente e QA GitHub/Codex, quando alguma capacidade restante depender exclusivamente do ambiente do Lovable (Supabase vinculado, RLS, webhooks, configuração da origem oficial).
- O Lovable deve **inspecionar o Supabase que já acompanha o próprio projeto**, não criar banco dedicado, não exigir `SUPABASE_SERVICE_ROLE_KEY` nos portfólios, não substituir o Jotform funcional nem reescrever a 0WEB. Se necessário, propor contrato mínimo idempotente para ingestão/observabilidade, sem abertura pública de leitura dos leads.
- Qualquer mudança de dados, RLS, segredos, rotas e publicação é uma operação separada, auditável e reversível, com aprovação explícita. Não bloquear publicação dos portfólios que funcionam sem esse banco.

## Pendência específica da Marli

- Página Draft na PR #536; SEO ainda noindex e catálogo `draft` por regra de publicação v4. Para ativar `index,follow` + sitemap, é preciso completar QA e registrar evidência real, publicar status/manifest/registry em um único conjunto coerente, integrar e validar o host oficial.
- Falta o número WhatsApp comercial **verificado** da Marli. Até receber essa evidência, não há como afirmar envio real para a profissional; Jotform armazena a consulta demonstrativa na 0WEB.
