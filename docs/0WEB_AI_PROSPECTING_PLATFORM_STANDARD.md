# 0WEB — padrão de prospecção e geração de presença digital

Este documento registra o produto pretendido para transformar o nome de um negócio real, sua região e referências públicas em uma presença digital pronta para abordagem comercial. É uma especificação de produto e backlog: capacidade só deve ser anunciada como ativa depois de implementada e validada no repositório oficial.

## Entrada e pesquisa

- Nome, município/bairro, segmento e referências fornecidas pelo operador.
- Busca em fontes públicas e oficiais, com conferência humana antes de publicar endereço, horário, serviços, telefone, preços ou links.
- Fotos do cliente e imagens de marca devem ser classificadas; a IA pode compor capa, logo e peças visuais, mas não pode inventar evidência, equipe, avaliação ou resultado.

## Pacotes de presença

- **Site simples:** rápido, econômico e direto.
- **Site completo:** seções autorais, edição precisa, motion e funil.
- **Site animado:** primeira dobra com animação que responde ao scroll, sempre com fallback para reduced motion.
- **Sistema:** presença completa com painel para agendamento, pedidos ou reservas quando o negócio realmente precisar.

Todo pacote deve manter identidade própria, histórico de versões, preview, link público do cliente e publicação no GitHub oficial/Lovable. Primitives de engenharia podem ser compartilhadas; layout, narrativa, conteúdo e contatos não.

## Operação comercial

- Scripts de abordagem e CTA individual por negócio.
- Busca por bairro, município e categoria sem limitar o catálogo a uma única região.
- Exportação de leads em CSV e dashboard de funil como capacidades condicionadas a consentimento, segurança e backend.
- Pixels de Meta, Google Analytics e Google Ads somente com configuração de consentimento e privacidade.
- Marca d'água configurável por plano, sem ocultar autoria ou criar associação enganosa.

## Limites e segurança

“3.000 leads/mês”, “200 edições/mês”, equipe de duas pessoas e hospedagem com subdomínio são metas de planos/configuração, não promessa automática. Contatos operacionais ficam server-side em `PORTFOLIO_WHATSAPP_<CLIENT_KEY>`; nunca entram no bundle público. Cada rota precisa de SEO, OG própria, funil, acessibilidade, performance, privacy e quality gates.

