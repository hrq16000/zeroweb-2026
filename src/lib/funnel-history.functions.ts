import {createServerFn} from '@tanstack/react-start';
import {requireSupabaseAuth} from '@/integrations/supabase/auth-middleware';
import {z} from 'zod';
import {leadTracking} from './funnel-tracking';
export const getFunnelHistory=createServerFn({method:'GET'}).middleware([requireSupabaseAuth]).inputValidator((raw:unknown)=>z.object({id:z.string().uuid()}).parse(raw)).handler(async({context,data})=>{
  const {requireAdmin}=await import('./admin-access.server');
  await requireAdmin(context.supabase,context.userId);
  const {data:form,error}=await context.supabase.from('dynamic_forms').select('id,name,slug,status,config_json,whatsapp_config').eq('id',data.id).single();
  if(error || !form) throw new Error('Funil não encontrado.');
  const {data:rows,error:le}=await context.supabase.from('dynamic_form_leads').select('id,created_at,metadata_json,whatsapp_alert_status,pipeline_stage').eq('form_id',data.id).order('created_at',{ascending:false}).limit(500);
  if(le) throw new Error('Não foi possível carregar o histórico.');
  const keys=[...new Set((rows??[]).map(r=>leadTracking(r.metadata_json).clientKey).filter((k):k is string=>!!k))];
  // Explicit association for the already-authorized funnel; never infer from a display name.
  const key=form.slug==='funnel-dona-garimpeira-brecho'?'dona-garimpeira-brecho':keys.length===1?keys[0]:null;
  const {resolveVersionedPortfolioWhatsApp}=await import('./portfolio-whatsapp-registry.server');
  const destination=key?resolveVersionedPortfolioWhatsApp(key):null;
  const {count,error:ce}=await context.supabase.from('dynamic_form_leads').select('id',{count:'exact',head:true}).eq('form_id',data.id).in('whatsapp_alert_status',['pending','failed']);
  if(ce) throw new Error('Não foi possível contar as pendências.');
  return {form,destination,clientKey:key,pending:count??0,rows:rows??[]};
});
