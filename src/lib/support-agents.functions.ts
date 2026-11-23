import {createServerFn} from '@tanstack/react-start';
import {requireSupabaseAuth} from '@/integrations/supabase/auth-middleware';
import {z} from 'zod';
export const listSupportAgents=createServerFn({method:'GET'}).middleware([requireSupabaseAuth]).handler(async({context})=>{
 const {requireAdmin}=await import('./admin-access.server');await requireAdmin(context.supabase,context.userId);
 const {data,error}=await context.supabase.from('support_agents').select('user_id,display_name,preferences,is_active,created_at,profiles(email)').order('created_at',{ascending:false});
 if(error)throw new Error('Não foi possível carregar os agentes.');return data??[];
});
export const inviteSupportAgent=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((raw:unknown)=>z.object({email:z.string().email().max(254),name:z.string().trim().min(2).max(100),preferences:z.string().max(2000).default('')}).parse(raw)).handler(async({context,data})=>{
 const {requireAdmin}=await import('./admin-access.server');await requireAdmin(context.supabase,context.userId);
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
 const {data:invite,error}=await supabaseAdmin.auth.admin.inviteUserByEmail(data.email,{redirectTo:'https://0web.com.br/agent-activate'});
 if(error || !invite.user)throw new Error('Não foi possível enviar o convite. Confira se a conta já existe ou se o limite de convites foi atingido.');
 const {error:saveError}=await context.supabase.from('support_agents').insert({user_id:invite.user.id,display_name:data.name,preferences:{notes:data.preferences},created_by:context.userId});
 if(saveError)throw new Error('O convite foi enviado, mas o cadastro do agente não foi salvo. Não reenvie; solicite a conclusão do cadastro.');
 return {id:invite.user.id};
});
export const updateSupportAgent=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((raw:unknown)=>z.object({id:z.string().uuid(),name:z.string().trim().min(2).max(100),preferences:z.string().max(2000),active:z.boolean()}).parse(raw)).handler(async({context,data})=>{
 const {requireAdmin}=await import('./admin-access.server');await requireAdmin(context.supabase,context.userId);
 const {data:row,error}=await context.supabase.from('support_agents').update({display_name:data.name,preferences:{notes:data.preferences},is_active:data.active}).eq('user_id',data.id).select('user_id').single();
 if(error || !row)throw new Error('Não foi possível salvar o agente.');return {ok:true};
});
export const getSupportAgentIdentity=createServerFn({method:'GET'}).middleware([requireSupabaseAuth]).handler(async({context})=>{
 const {data,error}=await context.supabase.from('support_agents').select('user_id,display_name,preferences,is_active').eq('user_id',context.userId).maybeSingle();
 if(error || !data || !data.is_active)throw new Error('Esta conta não possui acesso ativo de agente.');return data;
});
