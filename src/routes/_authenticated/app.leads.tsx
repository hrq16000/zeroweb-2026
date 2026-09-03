import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/app/leads")({
  component: LeadsLayout,
});

const TABS = [
  { to: "/app/leads", label: "Unificados", end: true },
  { to: "/app/leads/heloa-gas", label: "Pedidos · Heloá Gás", end: false },
] as const;

function LeadsLayout() {
  return (
    <div>
      <nav
        aria-label="Seções de leads"
        className="px-6 pt-6 max-w-7xl mx-auto flex flex-wrap gap-2"
      >
        {TABS.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            activeOptions={{ exact: t.end }}
            activeProps={{ className: "bg-primary text-primary-foreground border-primary" }}
            className="text-sm px-3 py-2 rounded-lg border border-border hover:bg-muted transition"
          >
            {t.label}
          </Link>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
