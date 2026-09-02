import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/criacao-de-site-institucional")({
  component: () => <Outlet />,
});
