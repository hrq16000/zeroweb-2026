import { useMemo, useState } from "react";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { normalizeText } from "@/lib/portfolio-search";

const LIMIT = 24;
const ALL = "Todas as regiões";

export function PortfolioRegionFilter({
  regions,
  value,
  onChange,
}: {
  regions: string[];
  value: string;
  onChange: (region: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const terms = normalizeText(query).split(" ").filter(Boolean);
  const normalized = normalizeText(query);
  const matches = useMemo(() => {
    const tokens = normalized.split(" ").filter(Boolean);
    return regions
      .map((label) => ({ label, key: normalizeText(label) }))
      .filter(({ key }) => tokens.every((token) => key.includes(token)))
      .sort((a, b) =>
        Number(b.key.startsWith(normalized)) - Number(a.key.startsWith(normalized)),
      )
      .map(({ label }) => label);
  }, [regions, normalized]);
  const showAll = terms.every((term) => normalizeText(ALL).includes(term));
  const changeOpen = (next: boolean) => {
    setOpen(next);
    if (!next) setQuery("");
  };
  const select = (region: string) => {
    onChange(region);
    changeOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={changeOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={value === "todas" ? "Filtrar por região" : `Filtrar por região: ${value}`}
          className="flex h-11 min-w-0 items-center justify-between gap-2 rounded-lg border border-border bg-background px-2.5 text-left text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 sm:text-sm lg:h-12 lg:w-56 lg:rounded-xl lg:px-4"
        >
          <span className="min-w-0 truncate">{value === "todas" ? ALL : value}</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" aria-label="Escolher região do portfólio" className="w-80 max-w-[calc(100vw-2rem)] p-0 motion-reduce:animate-none">
        <Command shouldFilter={false} label="Opções de região">
          <CommandInput value={query} onValueChange={setQuery} aria-label="Buscar região" placeholder="Digite cidade ou bairro..." className="min-h-11" />
          <CommandList>
            <CommandEmpty>Nenhuma região encontrada.</CommandEmpty>
            {showAll && (
              <CommandItem value="todas" onSelect={() => select("todas")} className="min-h-11 gap-2">
                <CheckCircle2 className={`h-4 w-4 shrink-0 text-primary ${value === "todas" ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
                <span>{ALL}{value === "todas" && <span className="sr-only"> — filtro atual</span>}</span>
              </CommandItem>
            )}
            {matches.slice(0, LIMIT).map((location) => (
              <CommandItem key={location} value={location} onSelect={() => select(location)} className="min-h-11 gap-2">
                <CheckCircle2 className={`h-4 w-4 shrink-0 text-primary ${value === location ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
                <span className="min-w-0 whitespace-normal break-words">{location}{value === location && <span className="sr-only"> — filtro atual</span>}</span>
              </CommandItem>
            ))}
          </CommandList>
          <p aria-live="polite" className="border-t px-3 py-2 text-xs text-muted-foreground">
            {matches.length > LIMIT ? `${LIMIT} de ${matches.length} locais. Digite para refinar.` : `${matches.length} ${matches.length === 1 ? "local disponível" : "locais disponíveis"}.`}
          </p>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
