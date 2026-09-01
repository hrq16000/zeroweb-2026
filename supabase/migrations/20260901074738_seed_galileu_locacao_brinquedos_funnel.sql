-- Funil individual de Galileu Locação de Brinquedos (funnel-galileu-locacao-brinquedos).
-- Modelo: supabase/migrations/*_seed_paraiso_hot_dog_funnel.sql
-- Preencha as perguntas reais do cliente antes de aplicar.

insert into public.dynamic_forms (slug, name, status, description)
values ('funnel-galileu-locacao-brinquedos', 'Galileu Locação de Brinquedos', 'published', 'Funil individual de Galileu Locação de Brinquedos')
on conflict (slug) do update
  set name = excluded.name,
      status = 'published',
      description = excluded.description;

-- TODO: inserir as etapas em public.dynamic_form_questions referenciando o form acima.
