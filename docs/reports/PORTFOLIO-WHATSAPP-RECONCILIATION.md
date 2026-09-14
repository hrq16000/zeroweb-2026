# Reconciliação de destinos WhatsApp dos portfólios

Data da auditoria: 2026-09-14  
Fonte de código: `origin/main`  
Commit auditado: `598dae6599e2a2b0b5f10ca15255b36cf0a56a0a`

## Resultado executivo

- Total auditado: **92 clientKeys / 92 portfólios**.
- `CONFIGURED`: **5** — evidência comprovada no ledger de proveniência existente.
- `CONFLICT`: **1** — `marido-de-aluguel`; mantido bloqueado por evidência institucional conflitante.
- `MISSING`: **86** — não há fonte comprovável suficiente para sincronizar um destino.
- `INVALID_FORMAT`: **0**.
- Nenhum número, token, secret ou valor sensível foi incluído neste relatório.
- Não foi encontrado secret local disponível para revalidar os destinos em runtime. Portanto, `CONFIGURED` significa “configurado/evidenciado no ledger do projeto”, não “secret de produção testado nesta máquina”.

## Status por clientKey

Os grupos abaixo cobrem os 92 clientKeys do catálogo. Os únicos valores permitidos no relatório são `CONFIGURED`, `MISSING`, `INVALID_FORMAT` e `CONFLICT`.

### CONFIGURED (5)

`paraiso-do-hot-dog`, `carecas-infotec`, `moreira-auto-mecanica`, `jkl-decor`, `adhonep-curitiba`

### CONFLICT (1)

`marido-de-aluguel`

### INVALID_FORMAT (0)

Nenhum.

### MISSING (86)

`sos-presentes-cosmeticos`, `dyzpromo`, `renata-beauty`, `r-beauty`, `emporio-lelecute`, `rm-fretes`, `rj-servicos-drywall`, `confeitaria-chyrley`, `mp-festas-eventos`, `studio-de-cilios`, `refrigeracao-maresia`, `ag-electrical-services`, `vila-da-capivara`, `lk-alvenaria`, `lucas-arruma-maquina-lavar`, `paulo-mestre-de-obras`, `ecommerce-on`, `no-brilho-higienizacao`, `salao-da-marcia`, `espaco-cih-luh`, `diego-montador-moveis`, `aguia-sul-sinalizacao`, `eletrovale-eletromecanica`, `eletro-solucoes-eficazes`, `eisenfer-tubos-acos`, `mary-diarista`, `acai-total-araucaria`, `santos-montador-de-moveis`, `marmitaria-dom-diego`, `beto-pasteis`, `woodhouse-hamburgueres`, `dlara-pizzaria`, `toquinho-de-gente-brecho`, `reuse-house-brecho`, `brecho-sao-francisco`, `angel-mix-brecho`, `lolipa-arte-em-festas`, `confeitaria-sabor-da-realeza`, `premium-envelopamentos`, `miro-tech`, `galileu-locacao-brinquedos`, `lj-cleaning`, `manu-pasteis`, `liz-moraes-nail-designer`, `assistencia-microondas-santos`, `artesanatos-darleia-oliveira`, `thays-camilla`, `fernanda-amaral-drywall`, `denise-gomes-psicologa`, `ton-e-cor`, `raphael-construcoes`, `jc-revestimentos`, `hbk-iluminacao-led`, `heloa-gas`, `almeida-torres`, `bh-barreiro-marmitas`, `casa-nativa`, `clinica-integrada`, `guaratuba-atelie-presentes`, `guaratuba-oficina-nautica`, `guaratuba-reparos-residenciais`, `guaratuba-sabores-da-baia`, `mirassol-conserta-celular`, `mirassol-delicias-caseiras`, `uberlandia-eletrica-residencial`, `sscons`, `mimo-salgados-doces`, `popys-conservacao-limpeza`, `bruna-diarista`, `btb-construcao`, `easy-clean`, `js-eletrica-manutencao`, `papelemi-personalizados`, `maximos-cabeleireiros`, `embalar-embalagens`, `simone-lacerda-vaz`, `kitutes-na-mesa`, `enoel-portas`, `mania-de-limpeza`, `dona-lucy-salgados`, `centro-mega`, `pastelaria-route-66`, `your_brutus_burguer`, `auto-socorro-dentinho`, `pinturas-nunes`, `estrutura-nacional`

## Fontes e correções

Foram comparados, sem revelar valores, o catálogo, o cadastro de clientes, o contexto de funil, o ledger de destinos, o resolver server-only, o fluxo de confirmação, migrations, documentação e a convenção de secrets `PORTFOLIO_WHATSAPP_<CLIENTKEY_NORMALIZED>`.

As cinco entradas `CONFIGURED` já documentadas foram preservadas, sem alteração de mapeamento:

- `paraiso-do-hot-dog`: ledger com evidência `OPERATIONAL_SECRET+GOOGLE_ENTITY`.
- `carecas-infotec`, `moreira-auto-mecanica`, `jkl-decor`: ledger com evidência `OWNER_PROVIDED+GOOGLE_ENTITY`.
- `adhonep-curitiba`: ledger com evidência `OWNER_CONFIRMED`.

`marido-de-aluguel` permanece `CONFLICT`: a evidência existente aponta para um contato institucional da 0WEB, não para um contato comprovadamente pertencente ao cliente. Nenhum fallback ou número de outro cliente foi reutilizado.

Nenhum novo mapeamento foi criado porque o ambiente desta auditoria não continha secrets de WhatsApp disponíveis para confirmação. Não é seguro transformar ausência de evidência em sincronização.

## Privacidade

Nenhum contato foi exposto no bundle público por esta auditoria. Os destinos continuam resolvidos server-side por `clientKey`; este documento não contém números, tokens ou secrets. A varredura de fonte não encontrou exposição de secret operacional, embora mantenha avisos históricos de literais de contato em páginas legadas que exigem tratamento separado.

## Gates executados

- `audit-portfolio-funnel-context.mjs --check`: **92 auditados · PASS 92 · WARNING 0 · FAIL 0**.
- `check-portfolio-funnel-operational.mjs --json`: **92 projetos · 0 deadEnds · 0 failures · 91 PENDING_DESTINATION · 1 NOT_APPLICABLE**.
- `validate-portfolio-catalog.mjs`: **OK — 92 itens canônicos, 92 clientes registrados**.
- `validate-portfolio-boundaries.mjs`: **OK — 92 sites isolados e parametrizados**.
- `validate-portfolio-conversion-profiles.mjs`: **OK — 92 narrativas individuais e distintas**.
- `scan-source-privacy.mjs`: **PASS** para secrets operacionais; avisos de literais públicos legados permanecem reportados pela ferramenta.

Build completo, testes unitários e E2E não foram executados neste clone porque Bun/dependências e um servidor de produção não estavam disponíveis localmente. Portanto, não são declarados como aprovados.

## Conclusão

Auditoria e reconciliação documental concluídas no clone atualizado. A sincronização efetiva de 100% dos números **não pode ser declarada concluída**: 86 destinos estão sem evidência suficiente e 1 está em conflito. Para fechar esses casos, é necessário disponibilizar os secrets/configurações oficiais no ambiente de execução ou registrar confirmação documental inequívoca por `clientKey`; até lá, os casos permanecem bloqueados por segurança.
