# 0WEB — Portfólios autônomos sem service role

**Diretriz do operador em 04/11/2026:** a criação e publicação de cada portfólio deve ser de ponta a ponta e **não depende de SUPABASE_SERVICE_ROLE_KEY**. O banco central da 0WEB e sua chave administrativa não são requisito para páginas individuais. Não criar um novo banco por cliente.

## Contrato de entrega

`nome + localização → pesquisa de múltiplas fontes → ledger de fatos e autorização → fingerprint autoral → página responsive → funil individual persistente → screenshots + prova de gravação → aprovação de SEO → merge → deploy produção → HTTP/robots/sitemap`.

Apenas **uma** captação por cliente. Nunca exibir uma UI falsa com botão de enviar não operacional. Não usar telefone/WhatsApp não confirmado. Não compartilhar o funil ou o destino de outro cliente.

## Persistência de leads sem credencial administrativa

Resolver uma destas opções *antes* de publicar:

1. **Provedor de formulário hospedado por cliente, administrado pela 0WEB**, com URL exclusiva, consentimento LGPD e caixa de entrada verificável (exemplo validado: Jotform para Agropet Filt). Formulário inserido via iframe na própria experiência e fallback HTTPS externo; submissão é persistida no provedor. O provedor deve ter acesso real à inbox e ser operável pela 0WEB. Esse modo não garante que leads apareçam no painel interno legado.
2. **Integração pública oficialmente suportada** com autenticação anônima e regras RLS específicas de INSERT, somente se comprovada por teste de submissão + leitura admin autorizada, sem chave service role. Nunca expor token privilegiado, ID de cliente ou contato de terceiro. Não afrouxar RLS global.
3. **Canal comprovado do estabelecimento** depois de registro persistido em armazenamento independente, se consentimento e privacidade estiverem corretos. WhatsApp sozinho **não comprova** persistência do lead.

Se nenhuma opção estiver disponível, publicar apenas prévia noindex sem botão de envio funcional, registrar blocker e não chamar de concluído. **Não investir** em criação automática de Supabase por portfólio.

## Gates de publicação

- Página com nome real, endereço, horário marcado como não verificado até confirmação, fotos reais quando licenciadas, arte ilustrativa distinta de fotografia documental.
- Testar em 390/1440 px, links, modal, consentimento obrigatório, entrada e leitura de lead sintético na inbox, acessibilidade, QA visual e canonical.
- Criar/atualizar entrada de catálogo e SEO indexável só após prova de armazenamento; marcação indexável não equivale a indexação efetiva pelo Google.
- Evitar alteração DNS, Lovable e qualquer workflow caro que não acrescente evidência. Preferir GitHub/Vercel e pequenos commits.
- Padronizar método de captura e testes, mas variar composição, hero, narrativa, mídia e identidade (não gerar clones).
- Meta operacional desejada: ≤60 min desde dados suficientes até página pronta, **sujeita a medição**, não prometer como SLA.

## Caso de referência: Agropet Filt

Portfólio com arte própria, seis categorias e teste real de armazenamento em formulário dedicado, protegido por consentimento. Provedor: Jotform. Prova de gravação sintética e leitura: 04/11/2026. `clientKey=agropet-filt`. WhatsApp empresarial sem confirmação: nulo. A inbox é Jotform, **não** dashboard de leads da 0WEB. O código da página não chama `supabaseAdmin` nem `submitPortfolioQuiz` no caminho comercial.

## Governança

A ligação externa é uma dependência operacional do **provedor de formulários**, não da plataforma Lovable ou de chave administrativa de banco. Monitorar disponibilidade, limitações do plano, retenção e controle de acesso ao formulário. Documentar plano de migração caso a rede ultrapasse a capacidade da conta. A prova de gravação de **um** formulário não demonstra capacidade ilimitada para centenas de empresas.
