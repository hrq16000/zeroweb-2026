# São Francisco Pet Center — Creative Composition Brief / 0WEB

Status: demonstração técnica para prospecção, **não site oficial**. Data: 2026-11-04.

## Evidência de entidade
- Endereço: Rua João Ângelo Cordeiro, 1616, Bom Jesus, São José dos Pinhais, PR, CEP 83025-120. Fonte: https://www.tutorcanino.com.br/creches/pr/sao-jose-dos-pinhais/sao-francisco-pet-center-hotel-sao-jose-dos-pinhais
- Serviços: hotel, creche e banho/tosa. Fontes: https://www.planetabrasileiro.com/sao-jose-dos-pinhais/banho%2Be%2Btosa e https://ondepet.com/hoteis-para-caes/sao-jose-dos-pinhais/sao-francisco-pet-center-hotel/
- Avaliações: 4,8 e 137 avaliações públicas no TutorCanino na data da pesquisa; número volátil, link atribuído visivelmente.
- Horários divergentes em diretórios; não fixados na landing.
- Instagram referenciado: https://www.instagram.com/saofrancisco_petcenterhotel/ . Facebook apontado em diretório, sem validação de titularidade. Provedor Instagram restringiu consulta dos seis posts; **não inventar feed**.
- Website anterior referenciado: https://www.saofranciscopetcenter.com . Não alterar seu domínio, DNS ou conteúdo.

## Creative direction e limites
- Personalidade visual proposta (não marca oficial): jardim de convivência, acolhimento, tempero editorial contemporâneo. Verde profundo + lima + terracota suave.
- Metáfora: um dia de descobertas no jardim; hero tipográfico monumental em contraste com retrato canino ensolarado.
- Famílias exploradas: resort fotográfico, magazine editorial e diário botânico. Selecionada **magazine editorial com jardim** por narrativa própria.
- Hero: colunas assimétricas com tipografia e fotografia documental ilustrativa.
- Composição: hero editorial → faixa gráfica horizontal → tríptico cromático de serviços → reflexão sobre adaptação → passos sequenciais → pausa fotográfica → endereço com painel gráfico de mapa → formulário de consulta → dúvidas.
- Motion: hover mínimo nos CTAs, com reduced motion. Sem parallax que prejudique desempenho.
- Ações: cada CTA leva ao formulário de hospedagem Jotform exclusivo; não abre número de outra empresa.
- Formulário: https://form.jotform.com/263077982107059 — persistência Jotform. Não sincroniza automaticamente com painel Supabase da 0WEB. Sem chaves Supabase.
- Privacidade: consentimento no formulário; sem telefone/WhatsApp público no bundle.
- Proteção: noindex até confirmar aprovação da empresa e canal oficial, dada a natureza de demonstração independente.

## Mídia / procedência
Fotos nos três blocos são **editoriais ilustrativas** e não retratam equipe, imóvel nem resultados do estabelecimento.
- Hero: https://images.unsplash.com/photo-1657318216069-399acfda68d1 — foto free Unsplash (https://unsplash.com/photos/golden-retriever-running-on-grass-near-fence-V679tLnQ2RY)
- Complementar: https://images.unsplash.com/photo-1583337130417-3346a1be7dee — imagem editorial Unsplash, sujeito genérico.
- Complementar: https://images.unsplash.com/photo-1543466835-00a7907e9de1 — imagem editorial Unsplash, sujeito genérico.
- Fotos oficiais do Instagram não foram copiadas nem apresentadas como verificadas porque o provedor limitou o acesso a permalinks públicos.
- OG é um recorte da mesma imagem editorial e é atribuído como ilustrativo. Substituir por foto oficial com direitos confirmados antes de promoção definitiva.

## Estado operacional
- Rota: /portfolio/sao-francisco-pet-center
- Não substituir site anterior, não criar domínio novo e não mexer em DNS.
- Formulário dedicado com envio independente de Supabase e fallback para abertura direta.
- Gate de lead: submeter dado sintético identificado QA e comprovar leitura na inbox Jotform; nunca alegar integração ao WhatsApp.
- Gate de publicação: CI/QA, preview real e then merge; indexação só com verificação jurídica/comercial e prova de originalidade/SEO.
- Skills: 0web-skill-router; 0web-autonomous-portfolio-factory; docs/PORTFOLIO_PROJECT_LIFECYCLE; 0WEB_EXECUTION_CONTRACT; portfolio individual SEO; direção autoral, mobile, acessibilidade e limites de mídia aplicada. Terceiros não executados para evitar dependências.
