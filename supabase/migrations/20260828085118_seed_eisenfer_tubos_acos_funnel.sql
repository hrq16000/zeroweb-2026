-- Funil individual de Eisenfer Tubos e Aços (funnel-eisenfer-tubos-acos).
-- Modelo: supabase/migrations/*_seed_paraiso_hot_dog_funnel.sql
-- Preencha as perguntas reais do cliente antes de aplicar.

insert into public.dynamic_forms (slug, name, status, description)
values ('funnel-eisenfer-tubos-acos', 'Eisenfer Tubos e Aços', 'published', 'Funil individual de Eisenfer Tubos e Aços')
on conflict (slug) do update
  set name = excluded.name,
      status = 'published',
      description = excluded.description;

DO $$ DECLARE v_form_id uuid; BEGIN SELECT id INTO v_form_id FROM public.dynamic_forms WHERE slug='funnel-eisenfer-tubos-acos'; DELETE FROM public.dynamic_form_questions WHERE form_id=v_form_id; INSERT INTO public.dynamic_form_questions (form_id,key,type,label,order_index,required,options_json) VALUES (v_form_id,'welcome','statement','Vamos encontrar o material ideal 🏗️',0,false,'[]'::jsonb),(v_form_id,'nome','short_text','Qual é o seu nome?',1,true,'[]'::jsonb),(v_form_id,'produto','radio','O que você procura?',2,true,jsonb_build_array(jsonb_build_object('value','tubos','label','Tubos e perfis'),jsonb_build_object('value','chapas','label','Chapas de aço'),jsonb_build_object('value','telhas','label','Telhas TP40'),jsonb_build_object('value','outro','label','Outro material'))),(v_form_id,'projeto','radio','Para qual projeto?',3,true,jsonb_build_array(jsonb_build_object('value','obra','label','Obra residencial'),jsonb_build_object('value','comercial','label','Estrutura comercial'),jsonb_build_object('value','industrial','label','Projeto industrial'))),(v_form_id,'local','radio','Onde será a entrega?',4,true,jsonb_build_array(jsonb_build_object('value','sjp','label','São José dos Pinhais'),jsonb_build_object('value','curitiba','label','Curitiba e região'),jsonb_build_object('value','confirmar','label','Vou confirmar'))),(v_form_id,'detalhes','long_text','Mais detalhes','Medidas e quantidades ajudam na cotação.','Descreva o material',5,false,'[]'::jsonb),(v_form_id,'telefone','phone','Qual WhatsApp para retorno?',6,true,'[]'::jsonb),(v_form_id,'confirmacao','statement','Solicitação recebida! ✅','A Francine confirmará sua cotação.',7,false,'[]'::jsonb); END $$;
