# Curadoria e adoção de inteligência de marketing — 0WEB

Data da inspeção: 26/11/2026 (horário Brasil). Base 0WEB: `bb8e969ce546dbc32f52d7c50ac053c8c7e4b5c8`.
Escopo: dez repositórios indicados pelo responsável. Inspecionados READMEs originais
em commits fixos, licenças e instruções relevantes de SEO/CRO/analytics/ads;
não é auditoria integral de dependências nem homologação dos servidores externos.
Nenhum instalador, script, container ou código de terceiros foi executado/copied.
Não exige Lovable, novos serviços pagos, secrets, migração ou alteração no runtime.

## Decisões por capacidade

| Repositório / commit observado | Licença declarada | Adoção / justificativa |
|---|---|---|
| [Marketing Skills](https://github.com/coreyhaines31/marketingskills/tree/2bf95edb4ebd37198ab7fd18b99ba95c2145ec64) | MIT | ADOTADO_COMO_PRINCIPIO: posicionamento por cliente, SEO, conteúdo, CRO, medição orientada a decisões; regras operacionais abaixo. Não importar toda a biblioteca ou conectores. |
| [Claude Ads](https://github.com/AgriciDaniel/claude-ads/tree/fc3908e786c318776df89a3a098333da377364be) | MIT | ADOTADO_COMO_PRINCIPIO: auditoria por evidência, estado desconhecido, plano de alteração separado. Não instalar plugin dependente do host Claude ou scripts. |
| [Google Ads MCP](https://github.com/googleads/google-ads-mcp/tree/44ca7770519362c8f334875477e1ceb499f8d2dd) | Apache-2.0 | PILOTO_CONDICIONAL: Google Ads API/ADC ou OAuth proxy; somente ferramentas search, metadata, customers; desabilitar assets e labels; verificar versão, escopo de conta e credenciais de menor privilégio. Não confundir capacidade de consulta com criação de campanhas. |
| [Meta Ads MCP](https://github.com/pipeboard-co/meta-ads-mcp/tree/63d0e5e29f2cf823f7f5317a77e66151eceb7415) | BSL 1.1 (restrição de oferta hospedada/embutida concorrente; mudança prevista 01/01/2029) | SECURITY_REVIEW_REQUIRED: consulta de insights em conta única autorizada; não embutir/revender o servidor a clientes sem revisão jurídica/licença. O serviço remoto é de terceiro, não oficial da Meta. OAuth, escopo/leitura, custos e compartilhamento exigem verificação. |
| [Umami](https://github.com/umami-software/umami/tree/dbb8d606fbd4e99220fb83bcb4abad3e0f97f42a) | MIT | PILOTO_CONDICIONAL: analytics privativo e independente para um site, Node + Postgres (instância/banco separado e credenciais seguras). Não duplicar a instrumentação existente; avaliar consentimento, dados, retenção e custo. Não lançar credenciais default em rede. |
| [Dub](https://github.com/dubinc/dub.link/tree/6b463b4bdd9ed2fd9aa416f67b5b77d317b1471e) (URL original dubinc/dub resolve para dub.link) | AGPLv3 + partes enterprise comerciais | PILOTO_CONDICIONAL: links curtos de campanhas, UTMs e atribuição; primeiro comparar com first-touch/partner internos. Se necessário, API/serviço separado após validação de licença, custo e privacidade. Não copiar código enterprise nem introduzir a stack Next.js/Prisma/Redis/analytics no portal. |
| [Paid Media Agent](https://github.com/langchain-ai/paid-media-agent/tree/a599253255cd9ddf9141f00c41a2493764f77004) | Apache-2.0 | ADOTADO_COMO_PRINCIPIO / executável CONDICIONAL: análise de mudanças, relatório periódico e proposta separada de execução. Implantação canônica exige Python/LangSmith, modelo, Pipeboard e Slack; não provisionar nem criar custos ou rotinas automáticas. |
| [Mautic](https://github.com/mautic/mautic/tree/01d9dc31becb4d337a610aed9f79338602d2ea4f) | GPL-3.0-or-later | PILOTO_FUTURO: automação de nutrição com consentimento, supressão/descadastro e segregação de organizações; stack PHP/Composer e operação própria. CRM/lead intake atual permanece canônico; não importar contatos, enviar e-mail ou configurar envios automáticos. |
| [Meridian](https://github.com/google/meridian/tree/24f23e32edc32fa86b4595cb11fd8730ce74f4f5) | Apache-2.0 | PILOTO_FUTURO: MMM Bayesiano com dados agregados, históricos de investimento e KPI confiável, controles e calibração; exige volume/variação suficientes e computação separada. Não inventar estimativas causais em amostra pequena. |
| [Robyn](https://github.com/facebookexperimental/Robyn/tree/aab4226ed5e40196cdbd82ff7fbbff55e91e1f58) | MIT | ALTERNATIVA_FUTURA a Meridian: MMM e alocação, ambiente R/Python + Nevergrad. Selecionar no máximo um piloto inicialmente, nunca instalar ambos no runtime. |

Licenças acima são constatações dos arquivos upstream, não parecer jurídico.
Antes de instalar qualquer pacote: cumprir `docs/skills/SECURITY.md`,
fixar versão/commit/licença, revisar scripts e dependências, validar em ambiente
isolado com dados sintéticos e provar read-back. Parar se custo, OAuth,
exportação de dados ou direitos comerciais dependerem de decisão do responsável.

## Capacidade existente a preservar

- `src/lib/analytics.ts`: eventos GA4/dataLayer, Pixel para WhatsApp, consentimento e contadores.
- `src/lib/persistence.ts`: fila persistente de eventos, first touch, UTMs e proteção de lead.
- `src/lib/commerce-funnel.ts`: etapas do carrinho/checkout e receita de pagamento.
- `src/lib/lead-attribution*`: atribuição e snapshot; painel autenticado de leads/funis.
- `docs/0WEB_GIT_FIRST_RELEASE_AND_SEO_POLICY.md`: SEO local, sitemap, SSR e validação no host.
- Separar todos os clientes por clientKey e conta; não compartilhar dados de cliente com outro,
  nem confundir clique WhatsApp com lead confirmado, venda ou receita.

## Playbook operacional adotado

Para um novo portfólio ou melhoria comercial pontual, adicionar esta camada
somente no que for relevante, sem substituir o stack de UI/SEO/funil local:

1. **Contexto real:** cliente, oferta, localidade, objetivo, público, ação primária,
   fonte de tráfego e evidências. Sem inventar métricas, avaliações ou segmentação.
2. **SEO e conteúdo:** priorizar elegibilidade, canonical/sitemap/SSR/links internos,
   intenção local e conteúdo específico; cruzar GSC e páginas públicas.
   Não trocar identidade, textos aprovados ou gerar doorway pages.
3. **CRO:** revisar clareza da proposta, coerência tráfego/landing, hierarquia do CTA,
   prova verificável, fricção do formulário e experiência mobile. Preservar funil
   individual e destino oficial. Hipótese de A/B não é ganho comprovado.
4. **Analytics:** definir a conversão de negócio, UTMs, intervalo, moeda, timezone,
   fonte, atribuição e cobertura; verificar eventos observáveis e sanitização/consentimento.
   CTA/scroll = microconversão; WhatsApp = intenção; lead válido e pagamento = resultados distintos.
5. **Mídia:** comparar apenas campanhas/períodos fechados e equivalentes, sem misturar
   contas, moedas ou definições e sem somar conversões atribuídas por várias plataformas.
   Registrar origem, data, evidência, lacunas, ação sugerida e KPI objetivo.
6. **Decisão:** priorizar P0 medição/destino/privacidade, P1 oferta/intenção/UX,
   P2 criativo/teste/conteúdo; mutações em campanha, orçamento, segmentação,
   publicação de anúncio ou contato a lead exigem proposta e autorização específica.
7. **Prova:** reaplicar os gates locais pertinentes e diferenciar verificado,
   executado, aprovado, publicado e desconhecido. Nenhuma simulação é dado real.

## Piloto R1 executável — relatório local de mídia paga

Implementação autoral, sem dependências, rede, tokens, alteração em anúncios ou
banco. É um primeiro recorte da capacidade comum de Marketing Skills / Claude Ads /
Paid Media Agent; não uma instalação de qualquer um deles.

```sh
node scripts/paid-media-report.mjs --demo
node --test tests/marketing/paid-media-report.test.mjs
node scripts/paid-media-report.mjs /caminho-privado/export-agregado.json
```

Contrato v1: JSON com `schemaVersion: 1`, `clientAlias` (pseudônimo),
`currency` (código de moeda), `timezone` (IANA), `conversionDefinition` e
`attributionWindow` (aliases sem PII). Campos `previous`, `current` contêm
`start` e `end` ISO YYYY-MM-DD (inclusive), `complete` booleano e `rows`
com um registro agregado por campanha/plataforma/intervalo. Cada linha:
`platform` (google/meta/linkedin/tiktok/reddit/snap/microsoft/other),
`campaign` (alias), `spendMinor`, `impressions`, `clicks`,
`conversions`, `revenueMinor`. Valores de dinheiro em unidades menores da moeda;
contagens inteiras salvo conversões atribuídas fracionárias. Métrica ausente
= null explícito; não tratar falta de dados como zero. Um cliente e no máximo
uma conta por plataforma em cada arquivo. Caso definições/atribuição não possam
ser alinhadas entre plataformas, gerar relatórios separados por conta.
Janelas não podem se sobrepor e devem ter a mesma duração. Importe somente
totais agregados (sem telefones/e-mails, nomes, IDs pessoais, tokens, click IDs ou
linhas de eventos); arquivos reais permanecem fora do Git. Confira manualmente
totais e completude do export antes de marcar `complete: true`.
O script imprime JSON com dados por plataforma e campanha, CTR (fração),
CPC, custo por conversão, ROAS e deltas absolutos; não soma atribuição
entre plataformas e não propõe alteração automática. `--demo` usa dados sintéticos.

## Próximas micro-rodadas (não executadas)

- R2: um Google Ads MCP em ambiente isolado e read-only, OU Meta se esse for o primeiro
  canal efetivamente usado. Confirmar acesso autorizado à conta/clientAlias, escopo
  da credencial, definição de conversão, custo e obtenção de um export agregado.
  Integrar de forma incremental sem permitir mutações.
- R3: piloto Umami em apenas um portfólio consentido com dados e banco separados;
  reconciliar pageviews/conversões com GA4 e base interna. Dub só quando
  a atribuição/gestão de links atual não atender necessidade comprovada e licença permitir.
- R4: Mautic somente se CRM/nutrição realmente exigirem serviço e houver política
  de opt-in/supressão/retenção; Paid Media Agent somente se houver ganho operacional
  que justifique serviço/Slack/modelo, sem criar rotinas de envio por padrão.
- R5: selecionar Meridian OU Robyn quando existir histórico longo, variação
  de investimento e KPI consistente; teste temporal, incerteza e validação independente.
  Sem histórico confiável, usar relatórios descritivos (R1).

Nenhuma fase autoriza mudanças em produção, dados reais, DNS, permissões,
templates de clientes, campanhas, orçamento, infraestrutura ou contratação por si só.
Rollback da R1: reverter o commit desta curadoria/piloto; nenhum esquema, serviço,
configuração de tracking ou usuário precisa ser restaurado.
