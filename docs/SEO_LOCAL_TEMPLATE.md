# Template de páginas locais (SEO regional) e capas do portfólio

## 1. Capas do portfólio (fallback garantido)

Componente: `src/components/portfolio/PortfolioCover.tsx`
Resolver: `resolvePortfolioCoverCandidates()` em `src/lib/portfolio-assets.ts`

Ordem de resolução da capa:

1. `image` do item em `src/config/portfolio-catalog.json`
2. `socialImage` do cliente em `src/config/portfolio-assets.json`
3. `icon` do cliente
4. `fallbackImage` do item
5. capa gerada (gradiente determinístico por slug + iniciais do nome)

Se uma imagem falhar em runtime (`onError`), o componente avança para o próximo
candidato — nunca fica card vazio. Usado em `ProjetosNoAr` (Home); a lista
`/portfolio` já aplica a mesma cadeia na montagem dos itens.

Para dar capa real a um cliente: adicione o arquivo em
`public/images/<clientKey>/` e informe `icon`/`socialImage` em
`portfolio-assets.json` (validado por `scripts/validate-portfolio-assets.mjs`).

## 2. Template de página local

Rota template: `src/routes/criacao-de-site-institucional.$cidade.tsx`
Fonte de dados: `src/lib/capitais.ts` (`slug`, `name`, `uf`, `state`, região).

O template já gera dinamicamente:

- H1 e título com cidade/UF: "Criação de Site Institucional em {cidade} ({UF})"
- meta title, meta description, `og:*` e canonical por cidade
- conteúdo regional (diferenciais, processo, CTA para o diagnóstico)
- JSON-LD: `Service`, `ProfessionalService`/`LocalBusiness` com `@id` e
  `areaServed` da cidade, `FAQPage` e `BreadcrumbList`
- links internos para a landing principal e para capitais relacionadas

### Como adicionar uma nova cidade

1. Acrescente a entrada em `src/lib/capitais.ts` (`slug` em kebab-case).
2. A rota `$cidade` passa a responder automaticamente em
   `/criacao-de-site-institucional/<slug>`.
3. O hub "Atendimento por capital" e `public/sitemap-institucional.xml`
   (gerado no build) incluem a nova página.
4. Rode `bun run build` e valide o schema no Rich Results Test.

### Provas sociais locais

Depoimentos permanecem omitidos por decisão editorial: só podem ser publicados
com fonte auditável e consentimento (ver AGENTS.md — credibilidade editorial).
Quando houver material real, insira no bloco de conteúdo regional do template.

## 3. Gestão das páginas locais no painel

Tela: `/app/paginas-locais` (admin/super_admin).
Tabela: `local_pages` · funções: `src/lib/local-pages.functions.ts`.

- Campos editáveis por capital: meta title, meta description, texto de abertura
  e conteúdo regional adicional (parágrafos separados por linha em branco).
- Campos vazios fazem fallback para o texto padrão do template — nunca ficam
  em branco na página pública.
- "Restaurar padrão" remove o override; "Publicada" desmarcada remove a URL de
  `sitemap-institucional.xml` sem apagar o conteúdo.
- Toda alteração fica registrada em `audit_logs`.

## 4. WhatsApp Business (disparo em lote)

Tela: `/app/atendimento` · funções: `src/lib/wa-dispatch.functions.ts` ·
adaptador: `src/lib/whatsapp-business.server.ts`.

Sem credenciais o lote roda em **modo simulado**: nada é enviado, e as
mensagens são gravadas com status `simulated`. Para ativar o envio real,
configure os secrets `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` e,
opcionalmente, `WHATSAPP_TEMPLATE_NAME` / `WHATSAPP_TEMPLATE_LANG`.

Regras aplicadas: no máximo 50 destinatários por lote, pausa entre mensagens,
deduplicação por telefone, exclusão automática dos números em `wa_optouts`
(LGPD) e log por mensagem em `wa_dispatch_messages`. A interface exibe apenas
os quatro últimos dígitos do telefone.
