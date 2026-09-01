-- Funil individual de D Lara Pizzaria Esfiharia e Hamburgueria (funnel-dlara-pizzaria).
-- Modelo: supabase/migrations/*_seed_paraiso_hot_dog_funnel.sql
-- Preencha as perguntas reais do cliente antes de aplicar.

insert into public.dynamic_forms (slug, name, status, description)
values ('funnel-dlara-pizzaria', 'D Lara Pizzaria Esfiharia e Hamburgueria', 'published', 'Funil individual de D Lara Pizzaria Esfiharia e Hamburgueria')
on conflict (slug) do update
  set name = excluded.name,
      status = 'published',
      description = excluded.description;

-- TODO: inserir as etapas em public.dynamic_form_questions referenciando o form acima.
