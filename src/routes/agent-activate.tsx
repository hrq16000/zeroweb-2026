import {createFileRoute} from '@tanstack/react-router';
import {AgentPassword} from '@/components/app/AgentPassword';
export const Route=createFileRoute('/agent-activate')({head:()=>({meta:[{title:'Ativar agente · 0WEB'},{name:'description',content:'Defina a senha da sua conta convidada.'},{property:'og:title',content:'Ativar agente · 0WEB'},{property:'og:description',content:'Ativação de conta por convite.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'},{name:'robots',content:'noindex,nofollow'}]}),component:()=> <AgentPassword invite/>});
