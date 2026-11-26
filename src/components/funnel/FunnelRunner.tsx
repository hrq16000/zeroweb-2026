import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft, Check, Loader2, Sparkles } from "lucide-react";
import {
  submitFunnel,
  attachFunnelRecoveryContact,
  type FunnelDefinition,
  type FunnelQuestion,
} from "@/lib/dynamic-funnel.functions";
import { normalizeRecoveryPhone } from "@/lib/lead-recoverability";
import {
  createVisitorFunnelSession,
  updateVisitorFunnelSession,
} from "@/lib/visitor-funnel.functions";
import { trackEvent, trackConversion } from "@/lib/analytics";
import { getLeadAttribution } from "@/lib/lead-attribution";
import { saveAttributionSnapshot } from "@/lib/lead-attribution-snapshot";
import { getVisitorId, newFunnelSessionId, collectTechnicalContext } from "@/lib/visitor-id";
import { readCart } from "@/lib/cart";
import { getGeoForLead, inferNeighborhoodSlug, slugifyGeo } from "@/lib/geo-location";

function readUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const utm: Record<string, string> = {};
  const url = new URL(window.location.href);
  ["utm_source","utm_medium","utm_campaign","utm_content","utm_term"].forEach((k) => {
    con¶»§q«^