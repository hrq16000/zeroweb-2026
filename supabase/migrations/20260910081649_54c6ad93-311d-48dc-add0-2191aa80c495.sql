insert into public.dynamic_forms (slug, name, status, description, config_json, whatsapp_config)
values ('funnel-carecas-infotec', 'Atendimento · Careca''s Infotec', 'published', 'Funil individual de assistência técnica em São José dos Pinhais', '{"auto_advance_ms":250}'::jsonb, '{"enabled":true}'::jsonb)
on conflict (slug) do update set name = excluded.name, status = 'published', description = excluded.description, config_json = excluded.config_json, whatsapp_config = excluded.whatsapp_config;

do $$
declare v_form_id uuid;
begin
  select id into v_form_id from public.dynamic_forms where slug = 'funnel-carecas-infotec';
  delete from public.dynamic_form_conditions where form_id = v_form_id;
  delete from public.dynamic_form_questions where form_id = v_form_id;
  insert into public.dynamic_form_questions (form_id, key, type, label, hint, placeholder, order_index, required, options_json)
  values
    (v_form_id, 'welcome', 'statement', 'Vamos entender o que aconteceu com o seu aparelho', 'Três perguntas rápidas para agilizar o diagnóstico.', null, 0, false, '[]'::jsonb),
    (v_form_id, 'nome', 'short_text', 'Como podemos chamar você?', null, 'Seu nome', 1, true, '[]'::jsonb),
    (v_form_id, 'aparelho', 'radio', 'Qual aparelho precisa de atendimento?', null, null, 2, true, jsonb_build_array(jsonb_build_object('value', 'celular', 'label', 'Celular'), jsonb_build_object('value', 'notebook', 'label', 'Notebook'), jsonb_build_object('value', 'computador', 'label', 'Computador'), jsonb_build_object('value', 'impressora', 'label', 'Impressora'), jsonb_build_object('value', 'monitor', 'label', 'Monitor ou TV'), jsonb_build_object('value', 'tablet', 'label', 'Tablet'), jsonb_build_object('value', 'videogame', 'label', 'Videogame'), jsonb_build_object('value', 'recarga', 'label', 'Recarga de cartucho ou toner'))),
    (v_form_id, 'situacao', 'radio', 'O que está acontecendo?', null, null, 3, true, jsonb_build_array(jsonb_build_object('value', 'nao_liga', 'label', 'Não liga'), jsonb_build_object('value', 'tela', 'label', 'Tela quebrada ou com falha'), jsonb_build_object('value', 'lento', 'label', 'Lento ou travando'), jsonb_build_object('value', 'bateria', 'label', 'Bateria ou carregamento'), jsonb_build_object('value', 'agua', 'label', 'Caiu ou molhou'), jsonb_build_object('value', 'outro', 'label', 'Outro problema'))),
    (v_form_id, 'detalhes', 'long_text', 'Quer descrever com suas palavras?', 'Marca, modelo e há quanto tempo apresenta o problema ajudam bastante.', 'Descreva o defeito', 4, false, '[]'::jsonb),
    (v_form_id, 'contato', 'short_text', 'Como prefere receber o retorno?', 'Informe WhatsApp ou outro contato para resposta.', 'Seu contato', 5, true, '[]'::jsonb);
end $$;