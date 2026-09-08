/**
 * Busca inteligente do catálogo `/portfolio`.
 *
 * A busca não pode depender da palavra exata: quem procura "lanche", "pastel"
 * ou "comida" precisa encontrar a pastelaria; quem procura "pedreiro" precisa
 * encontrar o mestre de obras. O ranking combina quatro sinais, todos
 * calculados no cliente e sem dependência externa:
 *
 * 1. normalização (minúsculas, sem acento e sem pontuação);
 * 2. radical simples em português (plural e sufixos comuns);
 * 3. dicionário de sinônimos/termos do dia a dia por ramo;
 * 4. tolerância a erro de digitação (distância de edição ≤ 2).
 */

export type SearchableItem = {
  title: string;
  subtitle?: string;
  location?: string;
  city?: string;
  state?: string;
  segment?: string;
  category?: string;
  metrics?: string;
  summary?: string;
  tags: string[];
};

export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Radical simples: remove plural e sufixos frequentes do português. */
export function stem(token: string): string {
  let t = token;
  if (t.length > 4 && /(oes|aes|ais|eis|ns)$/.test(t)) t = t.replace(/(oes|aes|ais|eis)$/, "ao").replace(/ns$/, "m");
  if (t.length > 3 && t.endsWith("s")) t = t.slice(0, -1);
  if (t.length > 5) t = t.replace(/(inho|inha|zinho|zinha|aria|eria|agem|mento|ista|eiro|eira)$/, "");
  return t;
}

export function tokenize(value: string): string[] {
  return normalizeText(value)
    .split(" ")
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

const STOPWORDS = new Set([
  "de", "da", "do", "das", "dos", "e", "em", "no", "na", "nos", "nas", "para",
  "por", "com", "um", "uma", "os", "as", "que", "ao", "sao",
]);

/**
 * Vocabulário do dia a dia → termos que aparecem nos projetos.
 * Cada chave é um jeito comum de pesquisar; os valores são termos que o
 * catálogo realmente usa (título, ramo, tags, resumo).
 */
const SYNONYMS: Record<string, string[]> = {
  // comida
  lanche: ["pastelaria", "lanchonete", "salgado", "hamburguer", "hot dog", "cafe", "restaurante", "pastel"],
  lanchonete: ["pastelaria", "lanche", "salgado", "restaurante"],
  pastel: ["pastelaria", "lanche", "salgado", "lanchonete"],
  pastelaria: ["pastel", "lanche", "salgado", "lanchonete"],
  comida: ["restaurante", "marmita", "lanche", "pizzaria", "salgado", "almoco", "pastelaria"],
  almoco: ["marmita", "restaurante", "comida", "lanchonete"],
  janta: ["restaurante", "pizzaria", "lanche", "comida"],
  jantar: ["restaurante", "pizzaria", "lanche", "comida"],
  fome: ["restaurante", "lanche", "comida", "pastelaria", "marmita"],
  marmita: ["comida", "almoco", "restaurante", "marmitaria"],
  pizza: ["pizzaria", "comida", "restaurante"],
  hamburguer: ["hamburgueria", "lanche", "burger", "lanchonete"],
  burger: ["hamburguer", "hamburgueria", "lanche"],
  cachorro: ["hot dog", "lanche", "dog"],
  dog: ["hot dog", "lanche", "cachorro quente"],
  doce: ["confeitaria", "bolo", "salgado", "festa", "docinho"],
  bolo: ["confeitaria", "doce", "festa", "aniversario"],
  salgado: ["salgados", "festa", "lanche", "pastelaria", "coxinha"],
  cafe: ["cafeteria", "lanche", "cafe da manha", "padaria"],
  padaria: ["pao", "cafe", "lanche"],
  delivery: ["entrega", "tele entrega", "pedido"],
  entrega: ["delivery", "frete", "pedido"],

  // casa, obra e serviços
  obra: ["construcao", "pedreiro", "reforma", "mestre de obras", "alvenaria", "engenharia"],
  pedreiro: ["obra", "construcao", "alvenaria", "mestre de obras", "reforma"],
  reforma: ["obra", "construcao", "pedreiro", "pintura", "marido de aluguel"],
  construcao: ["obra", "pedreiro", "reforma", "alvenaria", "engenharia"],
  eletricista: ["eletrica", "instalacao", "manutencao", "energia"],
  eletrica: ["eletricista", "instalacao", "manutencao", "energia"],
  encanador: ["hidraulica", "vazamento", "manutencao", "marido de aluguel"],
  pintura: ["pintor", "reforma", "obra"],
  pintor: ["pintura", "reforma", "obra"],
  conserto: ["manutencao", "reparo", "assistencia", "marido de aluguel"],
  reparo: ["conserto", "manutencao", "assistencia"],
  montagem: ["montador", "moveis", "marido de aluguel"],
  moveis: ["montador", "marcenaria", "montagem", "decoracao"],
  limpeza: ["faxina", "diarista", "conservacao", "higienizacao"],
  faxina: ["limpeza", "diarista", "conservacao"],
  diarista: ["limpeza", "faxina", "domestica"],
  gas: ["botijao", "revenda de gas", "agua", "entrega"],
  botijao: ["gas", "revenda de gas", "entrega"],
  agua: ["galao", "gas", "entrega"],
  mudanca: ["frete", "transporte", "carreto"],
  frete: ["mudanca", "transporte", "carreto", "entrega"],
  carreto: ["frete", "mudanca", "transporte"],
  ar: ["refrigeracao", "climatizacao", "ar condicionado", "manutencao"],
  geladeira: ["refrigeracao", "conserto", "assistencia"],
  refrigeracao: ["ar condicionado", "climatizacao", "geladeira"],
  jardim: ["jardinagem", "paisagismo", "poda"],

  // beleza, saúde e pessoal
  cabelo: ["cabeleireiro", "salao", "barbearia", "beleza", "corte"],
  cabeleireiro: ["cabelo", "salao", "beleza", "corte"],
  salao: ["cabeleireiro", "beleza", "cabelo", "estetica"],
  barbeiro: ["barbearia", "cabelo", "corte", "beleza"],
  unha: ["manicure", "nail", "beleza", "estetica"],
  cilios: ["estetica", "beleza", "extensao de cilios", "designer"],
  estetica: ["beleza", "salao", "cilios", "sobrancelha"],
  massagem: ["terapia", "bem estar", "saude", "estetica"],
  dentista: ["odontologia", "saude", "clinica"],
  psicologa: ["psicologia", "terapia", "saude"],
  psicologo: ["psicologia", "terapia", "saude"],

  // comércio e eventos
  roupa: ["brecho", "moda", "loja", "vestuario"],
  brecho: ["roupa", "moda", "seminovo", "loja"],
  festa: ["evento", "aniversario", "decoracao", "brinquedo", "buffet", "doce"],
  evento: ["festa", "aniversario", "buffet", "decoracao"],
  brinquedo: ["festa", "locacao", "aniversario", "pula pula"],
  presente: ["personalizado", "lembrancinha", "papelaria", "artesanato"],
  personalizado: ["papelaria", "lembrancinha", "presente", "artesanato"],
  embalagem: ["descartavel", "loja", "atacado"],
  grafica: ["impressao", "comunicacao visual", "banner", "adesivo"],
  adesivo: ["comunicacao visual", "envelopamento", "grafica"],
  envelopamento: ["adesivo", "comunicacao visual", "automotivo"],
  placa: ["comunicacao visual", "sinalizacao", "grafica"],
  sinalizacao: ["placa", "comunicacao visual", "seguranca"],

  // digital
  site: ["landing page", "presenca digital", "web", "loja virtual"],
  loja: ["comercio", "loja virtual", "ecommerce", "venda"],
  advogado: ["juridico", "advocacia", "direito"],
  juridico: ["advogado", "advocacia", "direito"],
  pet: ["animal", "petshop", "banho e tosa", "veterinario"],
  carro: ["automotivo", "oficina", "mecanica", "envelopamento"],
  mecanico: ["oficina", "automotivo", "carro", "manutencao"],
};

const EXPANSIONS = new Map<string, string[]>();
for (const [key, values] of Object.entries(SYNONYMS)) {
  EXPANSIONS.set(stem(normalizeText(key)), values.flatMap((v) => tokenize(v).map(stem)));
}

function levenshtein(a: string, b: string, max = 2): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let last = prev[0]!;
    prev[0] = i;
    let rowMin = prev[0]!;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j]!;
      prev[j] = Math.min(prev[j]! + 1, prev[j - 1]! + 1, last + (a[i - 1] === b[j - 1] ? 0 : 1));
      last = tmp;
      rowMin = Math.min(rowMin, prev[j]!);
    }
    if (rowMin > max) return max + 1;
  }
  return prev[b.length]!;
}

type Haystack = { strong: string[]; weak: string[] };

function buildHaystack(item: SearchableItem): Haystack {
  const strong = [item.title, item.tags.join(" "), item.segment ?? "", item.category ?? ""]
    .flatMap((v) => tokenize(v))
    .map(stem);
  const weak = [
    item.subtitle ?? "",
    item.summary ?? "",
    item.metrics ?? "",
    item.location ?? "",
    item.city ?? "",
    item.state ?? "",
  ]
    .flatMap((v) => tokenize(v))
    .map(stem);
  return { strong, weak };
}

function matchToken(token: string, hay: string[]): number {
  let best = 0;
  for (const word of hay) {
    if (word === token) return 1;
    if (word.startsWith(token) || token.startsWith(word)) best = Math.max(best, 0.85);
    else if (word.includes(token) && token.length >= 4) best = Math.max(best, 0.7);
    else if (token.length >= 4 && levenshtein(token, word) <= (token.length >= 7 ? 2 : 1)) {
      best = Math.max(best, 0.6);
    }
  }
  return best;
}

/**
 * Pontua o quanto um projeto responde à busca. `0` significa "não mostrar".
 */
export function scoreItem(query: string, item: SearchableItem): number {
  const tokens = tokenize(query).map(stem);
  if (tokens.length === 0) return 1;
  const hay = buildHaystack(item);

  let total = 0;
  let matched = 0;

  for (const token of tokens) {
    const direct = Math.max(matchToken(token, hay.strong) * 1, matchToken(token, hay.weak) * 0.6);
    let related = 0;
    for (const alt of EXPANSIONS.get(token) ?? []) {
      related = Math.max(related, Math.max(matchToken(alt, hay.strong) * 0.75, matchToken(alt, hay.weak) * 0.45));
    }
    const score = Math.max(direct, related);
    if (score > 0.25) matched += 1;
    total += score;
  }

  // Pelo menos um termo precisa fazer sentido para o projeto aparecer.
  if (matched === 0) return 0;
  // Com vários termos, exigimos que a maioria case — evita resultado aleatório.
  if (tokens.length > 1 && matched / tokens.length < 0.5) return 0;
  return total / tokens.length;
}

/** Filtra e ordena por relevância. Sem busca, devolve a lista intacta. */
export function searchItems<T extends SearchableItem>(query: string, items: T[]): T[] {
  if (!query.trim()) return items;
  return items
    .map((item) => ({ item, score: scoreItem(query, item) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, "pt-BR"))
    .map((entry) => entry.item);
}
