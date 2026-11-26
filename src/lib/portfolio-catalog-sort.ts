/**
 * Ordenação do catálogo `/portfolio`.
 *
 * As datas vêm de `portfolio-project-dates.json` (histórico Git real). Nenhuma
 * posição fixa simula recência: projeto sem data conhecida vai para o fim.
 */
import projectDates from "@/config/portfolio-project-dates.json";

export const CATALOG_SORTS = ["recent", "oldest", "updated", "az", "random"] as const;
export type CatalogSort = (typeof CATALOG_SORTS)[number];

export type ProjectDates = { createdAt?: string; updatedAt?: string };
type DateIndex = Record<string, ProjectDates | undefined>;
type Sortable = { id: string; title: string };

const DATES = (projectDates as { projects: DateIndex }).projects;

export function parseCatalogSort(value: unknown): CatalogSort {
  return CATALOG_SORTS.includes(value as CatalogSort) ? (value as CatalogSort) : "recent";
}

export function projectDatesFor(id: string, dates: DateIndex = DATES): ProjectDates {
  return dates[id] ?? {};
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates com semente: embaralha sem excluir nem duplicar registros. */
export function shuffleWithSeed<T>(items: readonly T[], seed: number): T[] {
  const out = [...items];
  const random = mulberry32(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

export function sortCatalog<T extends Sortable>(
  items: readonly T[],
  sort: CatalogSort,
  options: { seed?: number; dates?: DateIndex } = {},
): T[] {
  const dates = options.dates ?? DATES;
  const byTitle = (a: T, b: T) => a.title.localeCompare(b.title, "pt-BR");
  if (sort === "random") return shuffleWithSeed(items, options.seed ?? 1);
  if (sort === "az") return [...items].sort(byTitle);

  const field = sort === "updated" ? "updatedAt" : "createdAt";
  const direction = sort === "oldest" ? 1 : -1;
  const stamp = (item: T) => {
    const value = dates[item.id]?.[field];
    const time = value ? Date.parse(value) : Number.NaN;
    return Number.isNaN(time) ? null : time;
  };
  return [...items].sort((a, b) => {
    const ta = stamp(a);
    const tb = stamp(b);
    if (ta === null && tb === null) return byTitle(a, b);
    if (ta === null) return 1;
    if (tb === null) return -1;
    return ta === tb ? byTitle(a, b) : (ta - tb) * direction;
  });
}
