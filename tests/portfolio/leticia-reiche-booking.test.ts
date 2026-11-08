import { describe, expect, test } from "bun:test";
import {
  LETICIA_REICHE_BOOKING_CONFIG,
  LETICIA_REICHE_CLIENT_KEY,
  LETICIA_REICHE_FUNNEL_SLUG,
  isLeticiaReichePilotAllowed,
  leticiaReicheFormSlugs,
} from "../../src/lib/leticia-reiche-booking";
import whatsapp from "../../src/config/portfolio-whatsapp.json";

describe("Letícia Reiche — isolamento do piloto", () => {
  test("piloto exige preview E habilitação explícita", () => {
    expect(isLeticiaReichePilotAllowed("preview", "enabled")).toBe(true);
    for (const env of [undefined, "production", "development"]) {
      expect(isLeticiaReichePilotAllowed(env, "enabled")).toBe(false);
    }
    for (const flag of [undefined, "", "true", "disabled"]) {
      expect(isLeticiaReichePilotAllowed("preview", flag)).toBe(false);
    }
  });
  test("sem fallback genérico nem destino de outro projeto", () => {
    expect(leticiaReicheFormSlugs()).toEqual(["funnel-leticia-reiche"]);
    expect(LETICIA_REICHE_FUNNEL_SLUG).toBe(`funnel-${LETICIA_REICHE_CLIENT_KEY}`);
    expect(leticiaReicheFormSlugs()).not.toContain("funnel-service");
    expect((whatsapp.contacts as Record<string, { whatsapp: string | null }>)[LETICIA_REICHE_CLIENT_KEY]).toEqual({ whatsapp: null });
  });
  test("etapas de agendamento não inventam serviços, preços, horários e slots", () => {
    expect(LETICIA_REICHE_BOOKING_CONFIG.services).toEqual(["Manicure", "Pedicure"]);
    expect(LETICIA_REICHE_BOOKING_CONFIG.timingOptions).toContain("Tenho uma data específica para informar");
    expect(LETICIA_REICHE_BOOKING_CONFIG.stepSubtitles.timing).toContain("não uma reserva");
    expect(LETICIA_REICHE_BOOKING_CONFIG.proposalKind).toBe("service");
  });
});
