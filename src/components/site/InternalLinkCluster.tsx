import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ClusterLink } from "@/lib/portfolio-clusters";

/**
 * Bloco de links internos automáticos (âncoras descritivas) para
 * reforçar o cluster: portfólio ↔ hubs ↔ serviços ↔ bairros ↔ blog.
 */
export function InternalLinkCluster({
  links,
  title = "Continue explorando",
  description,
}: {
  links: ClusterLink[];
  title?: string;
  description?: string;
}) {
  if (links.length === 0) return null;
  return (
    <nav aria-label={title} className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8">
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              to={l.href}
              title={l.title ?? l.label}
              className="group inline-flex w-full items-center justify-between gap-2 rounded-xl border border-border/50 px-4 py-2.5 text-sm text-foreground hover:border-primary/50 hover:bg-primary/5 transition-colors"
            >
              <span className="capitalize">{l.label}</span>
              <ArrowUpRight className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-primary" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
