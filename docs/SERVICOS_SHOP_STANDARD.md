# Padrão da loja virtual `/servicos`

`/servicos` é uma vitrine de produtos digitais da 0WEB. A rota raiz deve ser
curta, comparável e orientada à decisão de compra. Ela não é uma página
editorial nem uma listagem de páginas institucionais.

## Contrato de publicação

Um produto só pode aparecer na vitrine quando tiver, no mínimo:

- imagem própria cadastrada no produto, na primeira imagem válida da galeria ou no OG image do próprio produto;
- preço numérico maior que zero;
- nome e categoria;
- descrição curta, adequada ao card;
- link para `/servicos/<slug>`.

Produtos sem imagem ou sem preço não devem receber placeholder nem ocupar espaço
na loja. Devem permanecer fora da vitrine até o cadastro ser corrigido. A rota
de detalhe continua sendo a responsável pelo conteúdo completo do produto.

## Composição do card

Cada card deve apresentar somente o necessário para comparar produtos:

1. imagem;
2. categoria;
3. nome;
4. descrição limitada visualmente a duas linhas;
5. preço e período, quando houver;
6. ação para ver detalhes ou iniciar a compra.

O índice não deve repetir FAQs, processo, prova social, especialidades,
consultoria ou blocos editoriais. Esses conteúdos pertencem à página do produto
ou a outras rotas. `/servicos/xxx` não faz parte deste contrato de compactação.
