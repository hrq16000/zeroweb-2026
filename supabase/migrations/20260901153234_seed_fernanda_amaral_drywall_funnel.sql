-- Funil individual de Fernanda & Amaral — Instalação de Drywall (funnel-fernanda-amaral-drywall).
-- Modelo: supabase/migrations/*_seed_paraiso_hot_dog_funnel.sql
-- Preencha as perguntas reais do cliente antes de aplicar.

insert into public.dynamic_forms (slug, name, status, description)
values ('funnel-fernanda-amaral-drywall', 'Fernanda & Amaral — Instalação de Drywall', 'published', 'Funil individual de Fernanda & Amaral — Instalação de Drywall')
on conflict (slug) do update
  set name = excluded.name,
      status = 'published',
      description = excluded.description;

-- TODO: inserir as etapas em public.dynamic_form_questions referenciando o form acima.
