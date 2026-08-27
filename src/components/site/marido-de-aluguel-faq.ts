/**
 * FAQ do cliente Marido de Aluguel.
 *
 * Fica em módulo de dados próprio para que a rota `/portfolio/$slug` possa
 * montar o JSON-LD sem importar (e sem enviar ao bundle inicial) o componente
 * completo da página do cliente, que é carregado sob demanda.
 */
export const MARIDO_ALUGUEL_FAQ = [
  {
    q: "O que faz um marido de aluguel?",
    a: "Resolve pequenos reparos e melhorias residenciais, como instalações, ajustes hidráulicos, pintura, montagem e manutenção preventiva.",
  },
  {
    q: "Atende em Curitiba e região?",
    a: "Sim. O atendimento pode ser organizado por cidade, bairro e tipo de serviço, conforme disponibilidade do profissional.",
  },
  {
    q: "Como recebo um orçamento?",
    a: "Envie o que precisa pelo formulário seguro. A equipe confirma os detalhes, a localização e retorna com prazo e faixa de investimento.",
  },
  {
    q: "O serviço tem garantia?",
    a: "A garantia e as condições são informadas antes da execução, de acordo com o profissional e o tipo de reparo contratado.",
  },
  {
    q: "Posso contratar mais de um reparo na mesma visita?",
    a: "Sim. Liste todos os reparos no briefing para que o profissional avalie materiais, tempo e a melhor sequência de execução.",
  },
];
