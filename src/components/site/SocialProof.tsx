import { CheckCircle2, MapPin, Star, Users } from "lucide-react";

/**
 * Compromissos de entrega exibidos na Home.
 *
 * Este bloco evita avaliações, contadores e resultados numéricos até que exista
 * uma fonte auditável para cada alegação publicada.
 */
export function TrustBar() {
  return (
    <section aria-label="Compromissos de entrega" className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
        <Trust
          icon={<Star className="w-4 h-4 text-amber-500" />}
          label="Tecnologia, design e aquisição integrados"
        />
        <Trust
          icon={<Users className="w-4 h-4 text-primary" />}
          label="Atendimento humano do diagnóstico à entrega"
        />
        <Trust
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          label="Escopo e entregáveis documentados"
        />
        <Trust
          icon={<MapPin className="w-4 h-4 text-foreground" />}
          label="Curitiba · atendimento em todo o Brasil"
        />
      </div>
    </section>
  );
}

function Trust({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 font-medium text-foreground/80">
      {icon}
      {label}
    </div>
  );
}
