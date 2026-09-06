insert into public.dynamic_forms (slug, name, status, description)
values ('funnel-dona-lucy-salgados', 'Dona Lucy Salgados', 'published', 'Pedido e encomenda de salgados delivery')
on conflict (slug) do update set name = excluded.name, status = excluded.status, description = excluded.description;

do $$
declare form_id uuid;
begin
  select id into form_id from public.dynamic_forms where slug = 'funnel-dona-lucy-salgados' limit 1;
  delete from public.dynamic_form_conditions where dynamic_form_id = form_id;
  delete from public.dynamic_form_questions where dynamic_form_id = form_id;
  insert into public.dynamic_form_questions (dynamic_form_id, position, question_key, label, type, required, options)
  values
    (form_id, 1, 'welcome', 'Vamos preparar seu pedido.', 'statement', true, '[]'::jsonb),
    (form_id, 2, 'service', 'O que vai deixar seu momento melhor?', 'radio', true, '["Combo de salgados a partir de R$ 11,99","Salgados fritos","Churros de doce de leite","Encomenda para evento","Entrega agendada"]'::jsonb),
    (form_id, 3, 'experience', 'Qual é a ocasião?', 'radio', true, '["Domingo em família","Festa ou comemoração","Reunião ou encontro","Quero só experimentar"]'::jsonb),
    (form_id, 4, 'period', 'Quando você precisa?', 'radio', true, '["Hoje","Terça a domingo","Quero agendar outro horário"]'::jsonb),
    (form_id, 5, 'note', 'Conte um pouco mais.', 'long_text', false, '[]'::jsonb),
    (form_id, 6, 'phone', 'Qual WhatsApp devemos chamar?', 'phone', true, '[]'::jsonb),
    (form_id, 7, 'confirmacao', 'Confirmo que quero receber orientação e pedido.', 'statement', true, '[]'::jsonb);
end $$;
