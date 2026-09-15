import {readFileSync,writeFileSync} from 'node:fs';
import {portfolioWhatsAppEnvName} from '@/lib/whatsapp-redirect.server';
const clients=JSON.parse(readFileSync('src/config/portfolio-clients.json','utf8'));
const noDest=new Set(["almeida-torres","angel-mix-brecho","artesanatos-darleia-oliveira","bh-barreiro-marmitas","casa-nativa","fernanda-amaral-drywall","galileu-locacao-brinquedos","guaratuba-atelie-presentes","guaratuba-oficina-nautica","guaratuba-reparos-residenciais","guaratuba-sabores-da-baia","jkl-marcenaria","marido-de-aluguel","mirassol-conserta-celular","mirassol-delicias-caseiras","pinturas-nunes","r-beauty","raphael-construcoes","santos-montador-de-moveis","ton-e-cor","uberlandia-eletrica-residencial","woodhouse-hamburgueres"]);
const dbKeys=new Set(JSON.parse(readFileSync('/tmp/dbkeys.json','utf8')));
const rows=clients.map((c:any)=>{
  const hasDb=dbKeys.has(c.clientKey)&&!noDest.has(c.clientKey);
  const n=portfolioWhatsAppEnvName(c.clientKey);
  const env=!!(n&&process.env[n]);
  const status=(hasDb||env)?'CONFIGURED':'MISSING';
  return {slug:c.slug,clientKey:c.clientKey,status,source:env&&hasDb?'env+db':env?'env':hasDb?'db':'—',hasConfigRow:dbKeys.has(c.clientKey)};
});
const counts=rows.reduce((a:any,r:any)=>({...a,[r.status]:(a[r.status]??0)+1}),{CONFIGURED:0,MISSING:0,INVALID_FORMAT:0,CONFLICT:0});
writeFileSync('/tmp/class.json',JSON.stringify({counts,rows},null,1));
console.log(counts);
console.log(rows.filter((r:any)=>r.status==='MISSING').map((r:any)=>`${r.slug} (${r.hasConfigRow?'config sem destino':'sem registro'})`).join('\n'));
