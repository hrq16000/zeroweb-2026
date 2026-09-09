-- Funil individual da EN — Estrutura Nacional.
-- O destinatário é resolvido exclusivamente no servidor pela chave privada
-- PORTFOLIO_WHATSAPP_ESTRUTURA_NACIONAL; nenhum contato é publicado aqui.

insert into public.dynamic_forms (slug, name, status, description, config_json, whatsapp_config)
values ('funnel-estrutura-nacional', 'Solicitação · EN Estrutura Nacional', 'published', 'Funil individual para estruturas metálicas e soluções em aço', '{"auto_advance_ms":250}'::jsonb, '{"enabled":true}'::jsonb)
on conflict (slug) do update set name = excluded.name, status = 'published', description = excluded.description, config_json = excluded.config_json, whatsapp_config = excluded.whatsapp_config;

do $$
declare v_form_id uuid;
begin
  select id into v_form_id from public.dynamic_forms where slug = 'funnel-estrutura-nacional';
  delete from public.dynamic_form_conditions where form_id = v_form_id;
  delete from public.dynamic_form_questions where form_id = v_form_id;
  insert into public.dynamic_form_questions (form_id, key, type, label, hint, placeholder, order_index, required, options_json)
  values
    (v_form_id, 'welcome', 'statement', 'Vamos organizar sua solicitação em aço', 'Conte o essencial do projeto para encaminhar o atendimento.', null, 0, false, '[]'::jsonb),
    (v_form_id, 'nome', 'short_text', 'Como podemos chamar você?', null, 'Seu nome', 1, true, '[]'::jsonb),
    (v_form_id, 'solucao', 'radio', 'Qual solução você procura?', null, null, 2, true, jsonb_build_array(jsonb_build_object('value', 'estrutura', 'label', 'Fabricação e montagem de estrutura metálica'), jsonb_build_object('value', 'solda', 'label', 'Abrasivos ou arames para solda'), jsonb_build_object('value', 'perfis', 'label', 'Perfis estruturais'), jsonb_build_object('value', 'aco', 'label', 'Outra solução em aço'))),
    (v_form_id, 'contexto', 'radio', 'Em qual contexto está o projeto?', null, null, 3, true, jsonb_build_array(jsonb_build_object('value', 'industria', 'label', 'Indústria'), jsonb_build_object('value', 'comercio', 'label', 'Comércio'), jsonb_build_object('value', 'obra', 'label', 'Obra ou construção'), jsonb_build_object('value', 'outro', 'label', 'Outro contexto'))),
    (v_form_id, 'detalhes', 'long_text', 'Quais detalhes ajudam a entender a demanda?', 'Medidas aproximadas, etapa do projeto ou materiais desejados.', 'Descreva brevemente o que precisa', 4, false, '[]'::jsonb),
    (v_form_id, 'contato', 'short_text', 'Como prefere receber o retorno?', 'Informe WhatsApp ou outro contato para resposta.', 'Seu contato', 5, true, '[]'::jsonb);
end $$;
