# 0WEB · Rede de autoridade local com prova real (R3/4)

Data: 27/10/2026. Fonte primária: `src/lib/geo-service-indexability.ts` e `src/config/portfolio-catalog.json` no `main` (baseline da rodada).

## Inventário efetivamente comprovado no código

| Cidade | Criação de sites | Landing pages | Referências do catálogo usadas nas duas páginas |
| --- | ---: | ---: | ---: |
| Curitiba | 3 projetos | 3 projetos | 6 referências |
| São José dos Pinhais | 3 | 3 | 6 |
| Araucária | 3 | 1 | 4 |
| Pinhais | 2 | 1 | 3 |
| Guaratuba | 4 | 2 | 6 |
| São Paulo | 1 | — | 1 |
| Belo Horizonte | 2 | — | 2 |
| **Total** | **18** | **10** | **28 referências, 12 combinações cidade×serviço** |

As 28 referências apontam a registros `status=published` em um catálogo com 96 entradas. Não são 28 clientes únicos: alguns projetos aparecem em site e landing. Esses projetos **não** comprovam posição no Google, vendas, depoimentos, faturamento ou disponibilidade física local.

## Padrão de interligação aprovado para SEO

1. **URL comercial local:** `/{cidade}/{servico}` com evidência específica do serviço e região. Página sem prova mantém `noindex,follow` e fica fora do sitemap.
2. **Prova visual:** link da página comercial para os exemplos `/portfolio/:slug`, usando título verdadeiro do catálogo e preservando a identidade e o funil individual do cliente.
3. **Produto 0WEB:** a partir de página local, link explícito para o produto real `/servicos/criacao-de-sites` ou outro serviço com escopo contratado e preço válido. Não transformar a galeria `/portfolio` em loja nem modificar a compra individual em `/servicos`.
4. **Conteúdo de decisão:** somente textos técnicos úteis, como comparação entre site institucional, landing e loja, critérios de entrega, perguntas de escopo, sem cifras/prazos inventados.
5. **Fluxos protegidos:** não injetar CTAs comerciais nos projetos dos clientes que desfaçam o funil. Não modificar WhatsApp redirect `/api/whatsapp-redirect/:token`, preços, checkout, redirects, slugs e canonical fora de sua página aprovada.

## Governança automática adicionada

Ampliação do teste já existente em `src/lib/geo-service-indexability.test.ts` para vetar:
- Prova local cujo `city` real no catálogo difere da cidade da landing (comparação normalizada por acentos).
- Projeto explicitamente `live:false`.
- Projeto não publicado.
- Entrada apontando a cidade inexistente no catálogo `CITIES`.

O teste original continua validando que *somente* 12 pares indexáveis têm evidência, que não são publicados serviços sem prova e que `landing-pages` aponta para projetos `projectType=landing`.

## Próxima rodada editorial prática, sem bypass

A PR #456 da rodada R2 aguarda solução dos gates reais: o teste visual reportou diferenças fora da rota alterada e os shards Lighthouse falharam em páginas de portfólio. Não aceitar hashes em massa, nem reduzir score mínimo 0,90 e limite visual 2% para promover a PR. Separar falhas ambientais/regressões existentes e reproduzir o impacto específico em `/curitiba/criacao-de-sites` antes do merge.

Após R2 aprovada, considerar links locais contextuais para a loja e catálogo somente na rota com prova, preservando as regras originais de SEO e conversão. Nenhuma nova cidade será promovida por automatismo de palavra-chave.

## Limite desta rodada

Os itens aqui são **prova de integridade editorial versionada**, não dados do Search Console. Indexação efetiva, CTR, posições, cliques, volume de buscas e conversão permanecem **não medidos** onde faltam fontes reais. Projeto concorrencial: [#454](https://github.com/hrq16000/zeroweb-2026/issues/454).
