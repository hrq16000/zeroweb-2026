import { lazy, Suspense } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { PrototypeSite, VERTICALS } from "./sites.$vertical";
import { absUrl } from "@/lib/seo";
import { findPortfolioPrototype } from "@/lib/portfolio-site-registry";
import { breadcrumbNode, graph, organizationNode, serviceNode } from "@/lib/portfolio-seo";
import { MARIDO_ALUGUEL_FAQ } from "@/components/site/marido-de-aluguel-faq";
import { PAULO_MESTRE_FAQ } from "@/components/site/paulo-mestre-de-obras-faq";
import { PortfolioStandardShell } from "@/components/portfolio/PortfolioStandardShell";
import { resolvePortfolioAssets, withSocialVersion } from "@/lib/portfolio-assets";
import {
  applyPortfolioRuntime,
  type PortfolioRuntimeOverrides,
} from "@/lib/portfolio-runtime";
import { getPortfolioRuntimeOverrides } from "@/lib/portfolio-runtime.functions";
import { PortfolioRuntimeProvider } from "@/components/portfolio/PortfolioRuntimeContext";
import { getManagedProject } from "@/lib/portfolio-managed.functions";
import type { ManagedProject } from "@/lib/portfolio-managed";
import { PortfolioManagedView } from "@/components/portfolio/PortfolioManagedView";
import { getBlueprintPage } from "@/components/portfolio/blueprint/registry";
import { getCompositionPage } from "@/components/portfolio/composition/registry";
import { bookingIntent } from "@/lib/portfolio-funnel-context";
import { createDonaGarimpeiraSeo } from "@/lib/dona-garimpeira-seo";
import {
  por¶»§q«^