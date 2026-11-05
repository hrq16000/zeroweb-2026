# 0WEB — Agendamento real + painel de cliente com Google (capacidade opcional)

Status: **contrato aditivo de produto e engenharia** · 2026-11-05  
Escopo: novos e futuros sites `/portfolio/:slug` com agenda; existentes ficam inalterados até opt-in explícito.

## 1. Origem, evidência e limites da inspeção

Referências fornecidas:
- [Paula Salão de Beleza](https://www.crieai.app/mvp/paula-salao-de-beleza)
- [Agatha Silva — Fio a Fio e Tufos de Seda](https://www.crieai.app/mvp/agatha-silva-fio-a-fio-e-tufos-de-seda)

Ambas as URLs públicas responderam com os respectivos títulos. O conteúdo interativo
não foi extraível pelo navegador de pesquisa; tampouco havia acesso autenticado
ao painel interno. **Não atribuir recursos específicos verificados à CRIE.AI
sem evidência de navegação real.** Os módulos abaixo são requisitos novos
solicitados à 0WEB, inspirados pelo caso de uso de salão/estúdio, sem replicar
layout, marca ou código da referência.

### Matriz de interpretação (USE / ADAPT / REJECT)

| Papel | Adotar na 0WEB | Limites |
|---|---|---|
| Vitrine pública | serviços, equipe, duração, fotos reais, localização, horários, links oficiais, SEO individual | não inventar preços, imagens, depoimentos ou horários |
| Conversão | CTA contextual `Agendar`, escolha de serviço, profissional, data e horário | botão não equivale a reserva |
| Reserva | disponibilidade transacional, protocolo e estado persistido | proibir double-booking e confirmação só em frontend |
| Gestão | painel da empresa com agenda, bloqueios, profissionais, serviços e histórico | isolado por `clientKey` no servidor/RLS |
| Identidade | autenticação por Google; lista de e-mails autorizados por empresa | não confiar em e-mail informado no cliente |
| Plataforma | administração própria da 0WEB com acesso global auditável | não expor console ou dados de outra empresa ao proprietário |
| Identidade visual | componentes técnicos compartilhados, composição do site exclusiva | não clonar referência nem repetir um template visual |

## 2. Produto: três superfícies diferentes

1. **Site público** `/portfolio/:slug`: SSR, canonical do próprio negócio, sitemap e
   `index,follow` quando pronto/publicado. Inclui funil individual, popup de
   prova social factual, popup institucional 0WEB, crédito e regras de não
   expor contatos diretos. O site pode apresentar serviços + horários reais.
2. **Reserva de visitante**: seleção de serviço → profissional (ou primeiro
   disponível) → dia → horários realmente disponíveis → login Google quando
   necessário → confirmação transacional → protocolo. Cliente pode consultar
   ou cancelar **somente os próprios** agendamentos, conforme regras locais.
   Sem login, o funil legado pode captar **solicitação de agendamento** (lead),
   nunca simular horário confirmado.
3. **Painel do estabelecimento** `/app/cliente/:slug`: login Google obrigatório
   e e-mail explicitamente autorizado para aquele `clientKey`. Acesso a:
   calendário diário/semanal/mensal, solicitações, confirmação/remarcação,
   cancelamentos, bloqueios, feriados, jornada de trabalho, profissionais,
   serviços/duração/preços, clientes, relatórios básicos e histórico de ações.
   Área privada, fora do sitemap e sem conteúdo pessoal no HTML público.

## 3. Regras de identidade e autorização

- Único método de **login**: Google OAuth (tanto proprietários quanto visitantes
  com conta). Um visitante pode navegar anonimamente; a reserva confirmada
  requer sessão Google validada. Não habilitar senha própria, login via
  WhatsApp ou credencial genérica do proprietário.
- Verificar, **no backend**, `auth.uid()`, identidade Google real em
  `auth.identities`, e-mail verificado e associação ativa ao `clientKey`
  solicitado. Cadastro de e-mail deve ser autorizado por gestor 0WEB ou
  proprietário já validado; nunca é autoatribuído via URL, form ou metadata do
  usuário. Revalidar identidade a cada operação privilegiada.
- Perfis: `platform_admin` (0WEB, privilégio independente do cliente),
  `owner` (uma ou mais empresas explicitamente vinculadas), `manager`
  (opera a empresa), `staff` (somente própria agenda quando configurado),
  `customer` (somente reservas próprias).
- RLS obrigatória em todas as tabelas com dados privados; políticas de
  inserção/edição devem verificar `clientKey` também em `WITH CHECK`.
  Foreign keys compostas por (`clientKey`, ID) impedem vincular profissional,
  serviço ou reserva a registros de outro cliente.
- **Um Google Account pode ser gestor em várias empresas**, mas o painel deve
  exigir seleção explícita e carregar somente o contexto ativo.
- Nenhuma `SUPABASE_SERVICE_ROLE_KEY` separada por portfolio. Utilizar o
  banco/infraestrutura compartilhados com OAuth, autorização e RLS por
  `clientKey`; chave privilegiada, se existente, é exclusivamente da
  infraestrutura central e **nunca** chega ao browser nem ao site do cliente.

## 4. Agendamento transacional

Entidades mínimas:

```text
portfolio_booking_tenants(client_key, enabled, timezone, policies)
portfolio_booking_memberships(client_key, user_id, google_email, role, active)
portfolio_booking_services(client_key, service_id, name, duration, price?, active)
portfolio_booking_professionals(client_key, professional_id, name, active)
portfolio_booking_professional_services(client_key, professional_id, service_id)
portfolio_booking_work_hours(client_key, professional_id, weekday, start, end)
portfolio_booking_exceptions(client_key, professional_id?, start, end, reason)
portfolio_booking_appointments(client_key, appointment_id, customer_id,
  professional_id, service_id, starts_at, ends_at, status, created_at)
portfolio_booking_audit(client_key, actor_id, action, record_id, created_at)
```

- Fuso IANA por empresa (ex.: `America/Sao_Paulo`). Backend converte
  instantes locais e lida com DST; nunca usar offset de navegador como verdade.
- Duração real do serviço + intervalo/buffer + horário do profissional +
  exceções/feriados + lead-time + antecedência máxima + janela de cancelamento.
- Na **mesma transação** de reserva: sessão Google validada, capacidade
  habilitada, serviço/equipe ativos, data futura, janela disponível e
  exclusão de conflitos do profissional (exclusion constraint
  `tstzrange` com `btree_gist`, ou mecanismo transacional equivalente).
  Requisições simultâneas não podem confirmar o mesmo horário.
- `requested` não significa `confirmed`; política define aceitação
  automática ou manual. Estados: `requested`, `confirmed`,
  `completed`, `cancelled`, `no_show`. Transições centralizadas e
  registradas em log.
- Idempotência por identificador único de tentativa; retentativa da rede
  não duplica reservas. Horário expirado gera nova consulta, não um falso
  sucesso. Falhas de persistência jamais redirecionam com confirmação.
- Dados pessoais não aparecem em logs, prova social, Open Graph, sitemap,
  analytics nem relatórios públicos. Consentimento e retenção conforme LGPD.
- WhatsApp ou Google Calendar são **integrações opcionais**, só após a
  reserva persistida e com autorização adequada; não são fonte de verdade
  sobre disponibilidade.

## 5. Convivência obrigatória com o funil atual

`funnelType=agendamento` hoje significa solicitação/lead, conforme
`docs/PORTFOLIO_FUNNELS.md`. A capacidade nova exige
`bookingMode=managed_booking` mais gate operacional próprio:

- `lead_only`: funil já existente; não mostrar calendário de reserva real.
- `managed_booking` em **DRAFT/BLOCKED**: prepara configuração sem ativar CTA
  confirmatório ou endpoint público.
- `managed_booking` **READY**: backend com migrations aplicadas, Google
  OAuth, políticas RLS, e-mails autorizados, calendário e horários, E2E real.
  Só então exibir `Confirmar agendamento` e protocolo.
- CTA principal continua exclusivo da marca, não da 0WEB. Popups
  institucionais e regras de indexação atuais permanecem.

## 6. Regras do painel (MVP e evolução)

MVP: agenda, filtros por profissional/serviço/status, horários e bloqueios,
confirmação/cancelamento, cadastro/edição de serviço, gestão da equipe,
registro de cliente e histórico. Ações destrutivas exigem confirmação e
são auditadas. Mostrar claramente estados vazio, salvando, erro e conflito.

Etapa posterior: lembretes consentidos, recorrência, pacotes e
pré-pagamento, políticas de no-show, relatórios financeiros, exportações,
integração Google Calendar e múltiplas unidades. Nunca presumir que
pagamentos/estoque/lealdade já existem.

## 7. Definition of Done — gates não negociáveis

- [ ] dono autorizado por e-mail Google real consegue entrar;
- [ ] e-mail não autorizado não entra, mesmo com `clientKey` alterado;
- [ ] cliente A não lê/edita agenda, equipe ou dados do cliente B;
- [ ] serviço de 60 minutos ocupa exatamente sua janela + buffer;
- [ ] turno, almoço, folga, feriado, limite de antecedência e fuso respeitados;
- [ ] duas reservas simultâneas no mesmo horário produzem **uma** vencedora;
- [ ] agendamento persiste e devolve protocolo recuperável;
- [ ] cliente autenticado só consulta/cancela sua própria reserva;
- [ ] painel não indexável, site público segue indexável e com SSR/SEO próprios;
- [ ] funil, popup 0WEB, CTA e portfolios legados sem regressão;
- [ ] mobile 390/768/1440, teclado, loading/error/empty states, reduced motion;
- [ ] testes unitários, E2E, RLS REAL e produção homologada por cliente.

### Situação ao registrar este padrão

O arquivo `src/lib/portfolio-booking-contract.ts` contém regras **puras**
de disponibilidade, transições e verificação auxiliar de associação
tenant/Google; `tests/portfolio/booking-contract.test.ts` cobre essas
regras. **Não** equivale a autenticação, persistência ou agendamento
operacional. O scaffold cria apenas manifesto bloqueado: nunca atribuir
`bookingEnabled=true` sem os gates acima.

## 8. Skill stack e critérios de projeto

Stack consultado: `AGENTS.md`, `0web-skill-router`,
`PORTFOLIO_ZERO_GENERIC_STANDARD`, `PORTFOLIO_CLIENT_STANDARD`,
`PORTFOLIO_FUNNELS`, `PORTFOLIO_REFERENCE_COMPOSITION_GOVERNANCE_STANDARD`,
`PORTFOLIO_INDIVIDUAL_SITE_SEO_STANDARD`,
`0WEB_UNIVERSAL_ADDITIVE_GROWTH_CONSTITUTION`,
`0WEB_EXECUTION_CONTRACT`, `PORTFOLIO_CAPABILITY_PALETTE`, padrão
de RLS e habilidade Supabase. Sem redesign nesta rodada,
`0web-experience-design-max`/arte continuam **obrigatórios quando as
telas e composições forem implementadas**.

Sem copiar a referência. Na composição de cada cliente, reavaliar
`ROLE_MATRIX`, `COMPOSITION_MATRIX`, `RHYTHM_MEDIA_MATRIX`,
`ANTI_COPY_MATRIX`, `SCOPE_TRUTH_MATRIX` e `FRESHNESS_MATRIX`.
