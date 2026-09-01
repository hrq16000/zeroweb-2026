-- Funil individual de Toquinho de Gente Brechó Adulto e Infantil (funnel-toquinho-de-gente-brecho).
-- Modelo: supabase/migrations/*_seed_paraiso_hot_dog_funnel.sql
-- Preencha as perguntas reais do cliente antes de aplicar.

insert into public.dynamic_forms (slug, name, status, description)
values ('funnel-toquinho-de-gente-brecho', 'Toquinho de Gente Brechó Adulto e Infantil', 'published', 'Funil individual de Toquinho de Gente Brechó Adulto e Infantil')
on conflict (slug) do update
  set name = excluded.name,
      status = 'published',
      description = excluded.description;

-- TODO: inserir as etapas em public.dynamic_form_questions referenciando o form acima.
