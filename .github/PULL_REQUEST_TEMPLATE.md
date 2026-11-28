# Evidências de evolução — 0WEB
> Modelo operacional de PR. A Central de Evolução é apenas uma ferramenta privada de coordenação; esta PR não publica o portal.

## Micro-rodada e rastreabilidade
- Objetivo e escopo mínimo:
- Issue / tarefa de origem:
- Ambiente: [ ] local [ ] CI [ ] preview [ ] produção (somente verificada)
- Etapa: [ ] planejamento [ ] desenvolvimento [ ] QA [ ] homologação [ ] publicação [ ] monitoramento [ ] saneamento
- Status: [ ] aberto [ ] em validação [ ] bloqueado [ ] pronto para publicar [ ] publicado [ ] concluído [ ] obsoleto
- Progresso documentado: __% (critérios medidos, não estimativa de publicação)
- Base `main` (SHA):
- HEAD candidato (SHA):
- HEAD validado + data:
- Versão/deployment real (se aplicável):

## Fato × intenção
- **Executado nesta PR:** (somente mudanças presentes no diff)
- **Apenas verificado:** (consulta, CI ou QA sem alteração)
- **Depende de validação manual:** (login, visual, homologação, aprovação)
- **Não alterar:** (limites explícitos do escopo)
- **Dependências externas / bloqueios:**

## Evidências — sem alegações não comprovadas
- Diff/commit:
- CI, jobs e run URLs:
- Preview/HTTP/QA reais (URL, data, viewport):
- Prints ou artefatos (URLs; ocultar dados privados):
- Sem evidência: escrever **NÃO VALIDADO**, nunca PASS por inferência.

## Conclusão e não regressão
- [ ] Escopo limitado ao tema da PR, sem perda de commits exclusivos
- [ ] HEAD e checks obrigatórios correspondem à versão candidata
- [ ] Critérios funcionais e de segurança aplicáveis atendidos
- [ ] Nenhum dado, segredo, contato privado ou funil afetado fora do escopo
- [ ] Publicação separada de merge: se não houve publicação, registrar **NÃO PUBLICADO**
- [ ] Decisão de merge humana e pós-merge conferida

## Limpeza de fila (somente se pertinente)
- Item/branch candidato:
- Prova de integração/substituição:
- Comparação de commits exclusivos:
- Dependências/checks pendentes:
- Autorização explícita e URL do encerramento externo:
- **Nenhuma exclusão automática** a partir deste checklist.

## Aceite específico 0WEB
- [ ] `/portfolio` continua **galeria/catálogo de projetos**; `/servicos` continua **loja de serviços** com funis próprios.
- [ ] Projeto/campanha permanece isolado por `clientKey`, identidade, SEO e CTA seguro; nada de copiar composição de outro cliente.
- [ ] SEO distingue `TECHNICALLY_INDEXABLE`, `GSC_INDEXED`, `RANKING_OBSERVED` e `UNKNOWN`.
- [ ] Testes/validações relevantes seguem os gates canônicos (incluindo mobile 390/1440 quando houver UI); não alterar thresholds.
- [ ] Nenhum WhatsApp/telefone de cliente incluído no bundle público.
- [ ] A publicação é Git-first, com PR validada e verificação separada da origem de `0web.com.br` e da Vercel. Não atribuir READY ao domínio sem HTTP real.
- [ ] Documento/skill roteada em `AGENTS.md` e `0web-skill-router`, uso ou não aplicação registrado.
