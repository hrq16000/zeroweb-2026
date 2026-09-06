insert into public.dynamic_forms (slug, name, status, description)
values ('funnel-mania-de-limpeza', 'Mania de Limpeza Higienização', 'published', 'Orçamento para higienização e combo família')
on conflict (slug) do update set name = excluded.name, status = excluded.status, description = excluded.description;

do $$
declare form_id uuid;
begin
  select id into form_id from public.dynamic_forms where slug = 'funnel-mania-de-limpeza' limit 1;
  delete from public.dynamic_form_conditions where dynamic_form_id = form_id;
  delete from public.dynamic_form_questions where dynamic_form_id = form_id;
  insert into public.dynamic_form_questions (dynamic_form_id, position, question_key, label, type, required, options)
  values
    (form_id, 1, 'welcome', 'Vamos montar seu combo de higienização.', 'statement', true, '[]'::jsonb),
    (form_id, 2, 'service', 'O que você quer higienizar?', 'radio', true, '["Combo família · 3 ou mais itens","Higienização de sofá","Higienização de colchão","Higienização de tapete","Quero avaliar outros itens"]'::jsonb),
    (form_id, 3, 'experience', 'Onde será o atendimento?', 'radio', true, '["Minha casa","Apartamento","Empresa ou comércio","Ainda estou pesquisando"]'::jsonb),
    (form_id, 4, 'period', 'Em qual região?', 'radio', true, '["Curitiba","Região Metropolitana","Vou confirmar o local"]'::jsonb),
    (form_id, 5, 'note', 'Conte um pouco mais.', 'long_text', false, '[]'::jsonb),
    (form_id, 6, 'phone', 'Qual WhatsApp devemos chamar?', 'phone', true, '[]'::jsonb),
    (form_id, 7, 'confirmacao', 'Confirmo que quero receber orientação e orçamento.', 'statement', true, '[]'::jsonb);
end $$;
