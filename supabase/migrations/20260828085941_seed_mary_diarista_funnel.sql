-- Funil individual de Mary Diarista (funnel-mary-diarista).
-- Modelo: supabase/migrations/*_seed_paraiso_hot_dog_funnel.sql
-- Preencha as perguntas reais do cliente antes de aplicar.

insert into public.dynamic_forms (slug, name, status, description)
values ('funnel-mary-diarista', 'Mary Diarista', 'published', 'Funil individual de Mary Diarista')
on conflict (slug) do update
  set name = excluded.name,
      status = 'published',
      description = excluded.description;

DO $$ DECLARE v_form_id uuid; BEGIN SELECT id INTO v_form_id FROM public.dynamic_forms WHERE slug='funnel-mary-diarista'; DELETE FROM public.dynamic_form_questions WHERE form_id=v_form_id; INSERT INTO public.dynamic_form_questions (form_id,key,type,label,order_index,required,options_json) VALUES (v_form_id,'welcome','statement','Vamos cuidar da sua casa ✨',0,false,'[]'::jsonb),(v_form_id,'nome','short_text','Qual é o seu nome?',1,true,'[]'::jsonb),(v_form_id,'servico','radio','Qual serviço você precisa?',2,true,jsonb_build_array(jsonb_build_object('value','4h','label','Diária de até 4 horas'),jsonb_build_object('value','6h','label','Diária de até 6 horas'),jsonb_build_object('value','8h','label','Diária de até 8 horas'),jsonb_build_object('value','pos-obra','label','Pós-obra ou pós-mudança'),jsonb_build_object('value','organizer','label','Personal organizer'))),(v_form_id,'frequencia','radio','Qual frequência prefere?',3,true,jsonb_build_array(jsonb_build_object('value','semanal','label','Quintas-feiras semanais'),jsonb_build_object('value','quinzenal','label','Quintas-feiras quinzenais'),jsonb_build_object('value','esporadica','label','Atendimento esporádico'))),(v_form_id,'local','radio','Onde será o atendimento?',4,true,jsonb_build_array(jsonb_build_object('value','curitiba','label','Curitiba e região'),jsonb_build_object('value','confirmar','label','Vou confirmar o endereço'))),(v_form_id,'detalhes','long_text','Mais detalhes','Quantidade de cômodos e preferências ajudam.','Descreva sua necessidade',5,false,'[]'::jsonb),(v_form_id,'telefone','phone','Qual WhatsApp para retorno?',6,true,'[]'::jsonb),(v_form_id,'confirmacao','statement','Solicitação recebida! ✅','Mary confirmará os próximos passos.',7,false,'[]'::jsonb); END $$;
