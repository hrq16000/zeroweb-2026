# Toop Assados — proposta de portfólio 0WEB (micro-rodada 1)

**Situação:** proposta comercial versionada, **não publicada**, sem rota criada, sem funil ativado e sem contato operacional. 
**Local informado no panfleto:** Rua Omar Raimundo Pichet, 1217, Xaxim, Curitiba/PR (grafia impressa; confirmar forma cadastral: “Omar Raymundo Picheth”).
**Fonte primária:** panfleto fotografado e apresentado pelo usuário em 07/11/2026. 
**Observação:** não há prova de autorização comercial do estabelecimento; tratar a proposta como amostra não oficial para apresentação, sem afiliação presumida.

## 1. Diagnóstico e oportunidade

O panfleto real comprova intenção de divulgação comercial; a peça tem textos com erros (“Erango”, “battta”, “WatsApp”) e uma hierarquia visual que não associa claramente as fotos aos pratos. Isto sustenta uma proposta de melhoria de comunicação, não prova carência de vendas ou de presença digital.

Busca pública realizada em 07/11/2026 por nome exato + Curitiba/Xaxim, telefone e endereço, além de tentativa de resolver perfil comercial e redes. **Não houve correspondência oficial verificável** da Toop Assados do Xaxim no Google Maps/Instagram/Facebook/site. “Top Assados e Cia” de Tietê/SP aparece na busca e **não** deve ser associado a este lead. A não identificação não prova ausência de perfis.

## 2. Dados do folheto e regras de publicação

| Informação | Origem | Estado |
|---|---|---|
| Marca “Toop Assados” | Folheto | Escrita confirmada somente na peça |
| Combo de frango recheado com aipim + porção de maionese + batata assada + refrigerante 2 litros | Folheto | Composição a confirmar |
| Preço anunciado do combo: **R$ 59,99** | Folheto sem data de validade | **Histórico, não apresentar como oferta atual** |
| Costela assada na brasa anunciada por **R$ 69,99** | Folheto sem data de validade | **Histórico; unidade, peso e validade a confirmar** |
| Porção de maionese grátis na compra de 1 kg | Folheto | Condição/promoção a confirmar |
| Rua Omar Raimundo Pichet, 1217 — Xaxim | Folheto | Grafia oficial e situação da operação a confirmar |
| WhatsApp de encomendas | Folheto | **Número conhecido na fonte, mas nunca embutir em frontend; confirmar titularidade antes de roteamento server-side** |
| Horários, entrega, cardápio completo e depoimentos | Sem fonte | Não inventar |

**Texto revisado para demonstração (não oferta vigente):**

> **Toop Assados** — Da brasa para a sua mesa.
> 
> **Supercombo de frango:** frango recheado com aipim, porção de maionese, batatas assadas e refrigerante de 2 litros.
>
> **Costela assada na brasa:** consulte peso, disponibilidade e acompanhamentos.
>
> **Encomendas:** selecione a opção desejada e solicite confirmação de preço e horário.
>
> **Localização informada:** Xaxim, Curitiba/PR.
>
> *Itens e condições comerciais dependem de confirmação da empresa.*

Não usar superlativos factualizados como “a melhor carne assada da região” sem prova independente.

## 3. Escopo da amostra proposta

**Conceito editorial:** Caderno da Brasa. Um mini-site com identidade própria e navegação de intenção de compra, sem simular restaurante premium, checkout ou logística de entregas inexistentes.

**Estrutura de experiência:**

1. Abertura forte: Toop Assados, posicionamento local e dois caminhos de escolha.
2. Painel de produtos: frango recheado e costela, com composições e atributos apenas após conferência do proprietário.
3. “Monte sua encomenda”: escolher item, quantidade, data/horário pretendidos e retirada/entrega *a confirmar*.
4. Resumo do pedido: deixar claro que é **solicitação de encomenda**, não compra confirmada.
5. Localização em Curitiba/Xaxim; mapa só após endereço validado.
6. FAQ factual: composição, antecipação da encomenda, como consultar valores e local.
7. CTA flutuante de pedido (funil próprio), assinatura e pop-up comercial 0WEB externos à identidade visual.
8. SEO local individual `/portfolio/toop-assados` e material de divulgação conectado via QR Code **depois dos gates**.

**Política do funil:** perguntas de item/quantidade/data/observações → nome/contato/consentimento → gravar lead server-side → reencaminhar pelo mecanismo seguro ao WhatsApp oficial configurado no servidor. Não expor contato direto em HTML/JS, não disparar encomendas sem consentimento e não alegar pedido confirmado pelo restaurante.

## 4. Oferta comercial para abordar o titular

Propor em fases curtas, sem valores inventados:
- **Fase A — demonstração visual:** proposta 10×14 cm, identidade e mini-site de amostra.
- **Fase B — captação:** cardápio de produtos atualizável, formulário de encomenda, histórico de leads e treinamento rápido do responsável.
- **Fase C — presença local:** revisão/criação de Google Business Profile com titular, integração de links sociais oficiais quando verificados e monitoramento de desempenho orgânico.

A primeira abordagem deve deixar claro que a 0WEB criou um **conceito independente**, e que os preços e dados finais serão validados com o restaurante.

## 5. Critérios de avanço e rodada seguinte

- **R2:** confirmar dados, licenciamento das imagens e identidade; produzir arte exclusiva, capa/OG, composição autoral `src/components/site/ToopAssadosPage.tsx` e preview isolado (não indexável).
- **R3:** preparar registros de catálogo/manifest v4, funil próprio real, segurança, SEO JSON-LD/sitemap e camada plataforma; validar testes e qualidade.
- **R4:** somente após readiness e autorização, abrir PR de publicação, merge e verificar produção + indexabilidade/GSC. **Indexável não significa indexado.**

**Sem alterações em DNS, Lovable, Supabase Service Role, repositórios terceiros ou produção nesta R1.**

## 6. Conformidade e evidências

Leituras: `AGENTS.md`, skill router, `docs/0WEB_EXECUTION_CONTRACT.md`, lifecycle, `PORTFOLIO_INDIVIDUAL_SITE_SEO_STANDARD.md`, creative direction, entity enrichment, zero-generic e projeto similar `agropet-filt-pilot.md`. Nenhum pacote/skill externo executado; recursos REA/Firecrawl não são necessários para pesquisa textual pontual.

Amostra inexistente em frontend nesta etapa; portanto testes de browser, SEO, build, CTA e funil **não foram executados** e não podem ser declarados verdes. Esta PR registra somente a decisão factual e criativa, sem criar um site incompleto.
