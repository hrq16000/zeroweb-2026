import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/app/admin")({
  component: lazyRouteComponent(() => import("@/components/route-pages/AuthenticatedAdminPage.tsx"), "AdminPage"),
});
