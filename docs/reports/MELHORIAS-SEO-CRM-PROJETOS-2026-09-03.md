# Melhorias compatíveis — SEO local, JSON-LD, CRM e "Projetos no ar" (2026-09-03)

## 1. Páginas locais (SEO regional)

Já entregues em 2026-09-02 e mantidas: `/criacao-de-site-institucional/<capital>`
para as 27 capitais (`src/lib/capitais.ts`), com H1, title, description, canonical,
conteúdo local, interlinks por região, link do hub e `sitemap-institucional.xml`
registrado no índice de sitemaps.

## 2. Schema JSON-LD

`criacao-de-site-institucional.$cidade.tsx` agora emite quatro blocos:

- `Service` (serviço + `areaServed: City`)
- **`ProfessionalService` (LocalBusiness)** — novo: `@id`, endereço com
  `addressLocality`/`addressRegion`, `priceRange`, `parentOrganization`
- `FAQPage`
- `BreadcrumbList`

Sem telefone/endereço de rua no schema: o repositório proíbe expor contato
operacional no bundle público, e não há endereço físico por capital.

## 3. CRM no formulário da landing

`src/lib/crm-intake.functions.ts` → `dispatchCrmLead` (server function pública):

- localiza o lead recém-gravado em `lead_submissions` (últimos 5 min, por
  telefone/e-mail + origem) — não aceita id arbitrário;
- rate limit por IP (`check_and_record_rate_limit`, 20/5 min);
- anexa a linha na Planilha Google de CRM (mesma planilha de `/app/crm-planilha`),
  quando conectada;
- cria notificação `kind: "lead"` para admin/super_admin com link para `/app/leads`;
- nunca devolve dados do lead ao navegador.

Chamada best-effort no `InstitutionalDiagnosticQuiz` após `persistLead` — falha
de CRM não bloqueia a confirmação ao visitante nem a gravação do lead.

## 4. "Projetos no ar" na Home

`src/components/site/ProjetosNoAr.tsx`: 6 projetos publicados do
`src/config/portfolio-catalog.json`, sorteados a cada carregamento. SSR e o
primeiro render do cliente usam os 6 primeiros itens (sem mismatch de
hidratação); o embaralhamento ocorre após a montagem. Links via
`<Link to="/portfolio/$slug">`.

## Validação

- `bunx tsgo --noEmit` sem erros.
- `bun run build` OK (canonicals, client-privacy, contato público, sitemaps).
