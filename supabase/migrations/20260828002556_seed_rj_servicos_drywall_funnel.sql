-- Funil individual de RJ Serviços de Drywall (funnel-rj-servicos-drywall).
-- Modelo: supabase/migrations/*_seed_paraiso_hot_dog_funnel.sql
-- Preencha as perguntas reais do cliente antes de aplicar.

insert into public.dynamic_forms (slug, name, status, description)
values ('funnel-rj-servicos-drywall', 'RJ Serviços de Drywall', 'published', 'Funil individual de RJ Serviços de Drywall')
on conflict (slug) do update
  set name = excluded.name,
      status = 'published',
      description = excluded.description;

do $$
declare v_form_id uuid;
begin
  select id into v_form_id from public.dynamic_forms where slug = 'funnel-rj-servicos-drywall';
  delete from public.dynamic_form_conditions where form_id = v_form_id;
  delete from public.dynamic_form_questions where form_id = v_form_id;
  insert into public.dynamic_form_questions (form_id, key, type, label, hint, placeholder, order_index, required, options_json) values
    (v_form_id, 'welcome', 'statement', 'Vamos entender sua obra', 'Responda algumas perguntas rápidas para organizar seu orçamento.', null, 0, false, '[]'::jsonb),
    (v_form_id, 'nome', 'short_text', 'Qual é o seu nome?', null, 'Seu nome', 1, true, '[]'::jsonb),
    (v_form_id, 'servico', 'radio', 'Qual serviço você precisa?', null, null, 2, true, jsonb_build_array(jsonb_build_object('value','divisorias','label','Paredes divisórias'),jsonb_build_object('value','personalizacao','label','Parede personalizada ou painel'),jsonb_build_object('value','forro','label','Forro, rebaixamento ou sanca'),jsonb_build_object('value','reparo','label','Reparo em drywall'))),
    (v_form_id, 'local', 'short_text', 'Em qual bairro e cidade será o serviço?', null, 'Bairro e cidade', 3, true, '[]'::jsonb),
    (v_form_id, 'detalhes', 'long_text', 'Conte um pouco sobre o ambiente', 'Se souber, inclua medidas aproximadas, acabamento desejado e se possui fotos.', 'Detalhes da obra', 4, true, '[]'::jsonb),
    (v_form_id, 'prazo', 'radio', 'Para quando você precisa?', null, null, 5, true, jsonb_build_array(jsonb_build_object('value','urgente','label','O quanto antes'),jsonb_build_object('value','sete-dias','label','Nos próximos 7 dias'),jsonb_build_object('value','mes','label','Ainda neste mês'),jsonb_build_object('value','planejando','label','Estou planejando'))),
    (v_form_id, 'telefone', 'phone', 'Qual WhatsApp para o retorno?', null, '(41) 99999-9999', 6, true, '[]'::jsonb),
    (v_form_id, 'confirmacao', 'statement', 'Solicitação organizada!', 'A RJ Serviços de Drywall vai avaliar as informações e continuar o atendimento pelo WhatsApp.', null, 7, false, '[]'::jsonb);
end $$;
