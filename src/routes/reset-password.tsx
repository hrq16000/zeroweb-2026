import {createFileRoute} from '@tanstack/react-router';
import {AgentPassword} from '@/components/app/AgentPassword';
export const Route=createFileRoute('/reset-password')({head:()=>({meta:[{title:'Recuperar senha · 0WEB'},{name:'description',content:'Defina uma nova senha pelo link de recuperação.'},{property:'og:title',content:'Recuperar senha · 0WEB'},{property:'og:description',content:'Recuperação segura da senha da conta.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'},{name:'robots',content:'noindex,nofollow'}]}),component:()=> <AgentPassword/>});
