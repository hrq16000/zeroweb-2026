// ============================================================================
// Capitais brasileiras — base para as páginas locais de
// /criacao-de-site-institucional/<capital>.
//
// Dataset próprio (não usa src/lib/geo-data.ts) para não gerar automaticamente
// rotas de outros clusters. Apenas dados públicos e verificáveis: nome, UF,
// estado, região e DDD principal.
// ============================================================================

export type Capital = {
  slug: string;
  name: string;
  uf: string;
  state: string;
  region: "Norte" | "Nordeste" | "Centro-Oeste" | "Sudeste" | "Sul";
  ddd: string;
};

export const CAPITAIS: Capital[] = [
  { slug: "rio-branco", name: "Rio Branco", uf: "AC", state: "Acre", region: "Norte", ddd: "68" },
  { slug: "maceio", name: "Maceió", uf: "AL", state: "Alagoas", region: "Nordeste", ddd: "82" },
  { slug: "macapa", name: "Macapá", uf: "AP", state: "Amapá", region: "Norte", ddd: "96" },
  { slug: "manaus", name: "Manaus", uf: "AM", state: "Amazonas", region: "Norte", ddd: "92" },
  { slug: "salvador", name: "Salvador", uf: "BA", state: "Bahia", region: "Nordeste", ddd: "71" },
  { slug: "fortaleza", name: "Fortaleza", uf: "CE", state: "Ceará", region: "Nordeste", ddd: "85" },
  { slug: "brasilia", name: "Brasília", uf: "DF", state: "Distrito Federal", region: "Centro-Oeste", ddd: "61" },
  { slug: "vitoria", name: "Vitória", uf: "ES", state: "Espírito Santo", region: "Sudeste", ddd: "27" },
  { slug: "goiania", name: "Goiânia", uf: "GO", state: "Goiás", region: "Centro-Oeste", ddd: "62" },
  { slug: "sao-luis", name: "São Luís", uf: "MA", state: "Maranhão", region: "Nordeste", ddd: "98" },
  { slug: "cuiaba", name: "Cuiabá", uf: "MT", state: "Mato Grosso", region: "Centro-Oeste", ddd: "65" },
  { slug: "campo-grande", name: "Campo Grande", uf: "MS", state: "Mato Grosso do Sul", region: "Centro-Oeste", ddd: "67" },
  { slug: "belo-horizonte", name: "Belo Horizonte", uf: "MG", state: "Minas Gerais", region: "Sudeste", ddd: "31" },
  { slug: "belem", name: "Belém", uf: "PA", state: "Pará", region: "Norte", ddd: "91" },
  { slug: "joao-pessoa", name: "João Pessoa", uf: "PB", state: "Paraíba", region: "Nordeste", ddd: "83" },
  { slug: "curitiba", name: "Curitiba", uf: "PR", state: "Paraná", region: "Sul", ddd: "41" },
  { slug: "recife", name: "Recife", uf: "PE", state: "Pernambuco", region: "Nordeste", ddd: "81" },
  { slug: "teresina", name: "Teresina", uf: "PI", state: "Piauí", region: "Nordeste", ddd: "86" },
  { slug: "rio-de-janeiro", name: "Rio de Janeiro", uf: "RJ", state: "Rio de Janeiro", region: "Sudeste", ddd: "21" },
  { slug: "natal", name: "Natal", uf: "RN", state: "Rio Grande do Norte", region: "Nordeste", ddd: "84" },
  { slug: "porto-alegre", name: "Porto Alegre", uf: "RS", state: "Rio Grande do Sul", region: "Sul", ddd: "51" },
  { slug: "porto-velho", name: "Porto Velho", uf: "RO", state: "Rondônia", region: "Norte", ddd: "69" },
  { slug: "boa-vista", name: "Boa Vista", uf: "RR", state: "Roraima", region: "Norte", ddd: "95" },
  { slug: "florianopolis", name: "Florianópolis", uf: "SC", state: "Santa Catarina", region: "Sul", ddd: "48" },
  { slug: "sao-paulo", name: "São Paulo", uf: "SP", state: "São Paulo", region: "Sudeste", ddd: "11" },
  { slug: "aracaju", name: "Aracaju", uf: "SE", state: "Sergipe", region: "Nordeste", ddd: "79" },
  { slug: "palmas", name: "Palmas", uf: "TO", state: "Tocantins", region: "Norte", ddd: "63" },
];

export const CAPITAL_SLUGS = CAPITAIS.map((c) => c.slug);

export function getCapital(slug: string): Capital | undefined {
  return CAPITAIS.find((c) => c.slug === slug);
}

/** Capitais relacionadas: mesma região primeiro, depois as demais. Determinístico. */
export function relatedCapitais(slug: string, n = 6): Capital[] {
  const me = getCapital(slug);
  if (!me) return CAPITAIS.slice(0, n);
  const same = CAPITAIS.filter((c) => c.slug !== slug && c.region === me.region);
  const others = CAPITAIS.filter((c) => c.slug !== slug && c.region !== me.region);
  return [...same, ...others].slice(0, n);
}

export const REGIOES = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"] as const;

export function capitaisPorRegiao() {
  return REGIOES.map((region) => ({
    region,
    cidades: CAPITAIS.filter((c) => c.region === region),
  }));
}
