-- Funil individual de HBK Iluminação LED Atacadão (funnel-hbk-iluminacao-led).
-- Modelo: supabase/migrations/*_seed_paraiso_hot_dog_funnel.sql
-- Preencha as perguntas reais do cliente antes de aplicar.

insert into public.dynamic_forms (slug, name, status, description)
values ('funnel-hbk-iluminacao-led', 'HBK Iluminação LED Atacadão', 'published', 'Funil individual de HBK Iluminação LED Atacadão')
on conflict (slug) do update
  set name = excluded.name,
      status = 'published',
      description = excluded.description;

-- TODO: inserir as etapas em public.dynamic_form_questions referenciando o form acima.
