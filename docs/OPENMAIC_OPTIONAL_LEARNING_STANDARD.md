# OpenMAIC — integração opcional de aprendizagem (0WEB)

**Situação:** fundamento técnico em PR; **não publicado**. Nenhuma aula é ligada por padrão.

**Fonte:** https://github.com/THU-MAIC/OpenMAIC (MIT; conferir avisos e licenças dos recursos exportados). Referência avaliada: OpenMAIC 1.2.0, 16/10/2026.

## Decisão de arquitetura

Adotar capacidades educacionais do OpenMAIC quando houver uma necessidade real, sem copiar seu servidor Next.js para a 0WEB e sem alterar o modelo da plataforma:

- \`/portfolio\` continua catálogo de projetos, cada projeto com identidade, conteúdo e funil próprios.
- \`/servicos\` continua loja de serviços com funis comerciais específicos.
- Um módulo de aprendizagem pode ser adicionado **somente por opt-in contextual**, com conteúdo revisado e proveniente de fonte confiável.
- Nenhum curso ou experiência nova é criado em massa. Nada é incluído em sitemap nem liberado para indexação automaticamente.
- Não modificar páginas, canonical, rotas, CTAs, WhatsApp, preços, promessa comercial ou layouts existentes por causa desta integração.

### Caminho A — primeira etapa: HTML offline (baixo risco)

O OpenMAIC 1.2.0 pode exportar uma aula interativa como HTML offline autônomo. Após verificar licença, conteúdo, scripts, privacidade, acessibilidade e tamanho, colocar o arquivo em \`public/openmaic-lessons/<slug>.html\`.

O componente \`src/components/learning/OpenMaicOfflineLesson.tsx\` só permite caminhos locais dentro de \`/openmaic-lessons/\`, usa iframe com sandbox restritivo (sem \`allow-same-origin\`) e exige \`enabled={true}\`. Não faz chamadas de geração de IA e **não aparece em página alguma até integração explícita**.

Exemplo futuro (não ativado por este PR):

\`\`\`tsx
<OpenMaicOfflineLesson
  enabled={true}
  lessonPath="/openmaic-lessons/seo-para-pequenos-negocios.html"
  title="SEO para pequenos negócios"
/>
\`\`\`

O HTML exportado precisa existir antes de usar o exemplo; neste PR não há arquivos de aulas nem rotas habilitadas. Jamais incluir uma URL externa ou HTML não revisado no mesmo domínio. Testar comportamento do export dentro de iframe sandbox: recursos que precisem de permissões adicionais devem usar hospedagem isolada em vez de relaxar a sandbox.

### Caminho B — depois: SDKs, caso necessário

\`@openmaic/renderer\` depende de React 18+, \`motion >= 11\` e **Tailwind 4**; \`echarts\` e \`shiki\` são peers opcionais. Usar SDK em uma área isolada e carregada sob demanda somente se houver cenas JSON reais e benefício mensurável; não adicionar a dependência ao bundle comum. Validar desempenho mobile, CSS, fontes e riscos de XSS em conteúdo de terceiros.

### Caminho C — IA dinâmica, somente quando justificada

A geração em tempo real do OpenMAIC 1.2.0 exige **processo Node >= 22.19 em execução permanente e PostgreSQL**. Não funciona como instalação completa dentro do build estático ou função serverless da Vercel. Se necessária, hospedar separadamente com autenticação por usuário, proteção de APIs, isolamento de dados e quotas. Não compartilhar segredos no browser ou via variáveis \`VITE_\`.

## Critérios de ativação

1. Caso de uso educativo que resolva dúvida real do visitante, não conteúdo genérico para SEO.
2. Conteúdo original e revisado, com fontes, autoria e limites claros; sem promessas, mídia ou provas inventadas.
3. Isolamento de marca, conformidade com as políticas do cliente e preservação do funil e da intenção da página.
4. Export estático inspecionado, caminho autorizado, política de CSP adequada, acessibilidade e teste de teclado/mobile.
5. Budget de transferência e Core Web Vitals preservados; carregamento sob demanda.
6. SEO editorial controlado pelos gates canônicos, sem indexação automática de cascas de aulas.
7. PR e gates oficiais verdes + evidência em preview antes de merge; deploy público confirmado separadamente.

## Escopo desta rodada

Fundação reversível composta por validador local de caminho, componente React opt-in e teste unitário. **Não inclui:** migração de stack, instalação de SDK, PostgreSQL, chaves, chamadas de IA, geração de cursos, alteração de páginas ou deploy.

A integração com outros repositórios do ecossistema deve usar o mesmo contrato funcional, mas ser adaptada a cada framework e governança. Não copiar esta implementação para todas as marcas sem avaliação de compatibilidade e conteúdo.
