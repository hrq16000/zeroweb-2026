import { describe, expect, test } from "bun:test";
import {
  canManagePortfolioBooking,
  canTransitionBookingStatus,
  findBookingStartMinutes,
  minuteToTime,
} from "../../src/lib/portfolio-booking-contract";

describe("portfolio booking: disponibilidade", () => {
  test("não oferece horários em conflito e respeita limite do expediente", () => {
    const slots = findBookingStartMinutes({
      workingHours: [{ startMinute: 9 * 60, endMinute: 12 * 60 }],
      occupied: [{ startMinute: 10 * 60, endMinute: 11 * 60 }],
      durationMinutes: 60,
      stepMinutes: 30,
    }).map(minuteToTime);
    expect(slots).toEqual(["09:00", "11:00"]);
  });

  test("janelas adjacentes não conflitam e bloqueios são respeitados", () => {
    const slots = findBookingStartMinutes({
      workingHours: [{ startMinute: 8 * 60, endMinute: 10 * 60 }],
      occupied: [{ startMinute: 8 * 60, endMinute: 8 * 60 + 30 }],
      blocked: [{ startMinute: 9 * 60, endMinute: 9 * 60 + 30 }],
      durationMinutes: 30,
      stepMinutes: 30,
      minimumStartMinute: 8 * 60,
    }).map(minuteToTime);
    expect(slots).toEqual(["08:30", "09:30"]);
  });

  test("normaliza janelas duplicadas e rejeita entrada inválida", () => {
    expect(findBookingStartMinutes({
      workingHours: [
        { startMinute: 540, endMinute: 600 },
        { startMinute: 540, endMinute: 600 },
      ],
      occupied: [],
      durationMinutes: 30,
      stepMinutes: 30,
    })).toEqual([540, 570]);

    expect(() => findBookingStartMinutes({
      workingHours: [{ startMinute: 600, endMinute: 540 }],
      occupied: [],
      durationMinutes: 30,
    })).toThrow();
    expect(() => findBookingStartMinutes({
      workingHours: [{ startMinute: 540, endMinute: 600 }],
      occupied: [],
      durationMinutes: 0,
    })).toThrow();
  });
});

describe("portfolio booking: permissões e ciclo de vida", () => {
  const google = {
    userId: "google-user-123",
    email: "proprietario@exemplo.com",
    provider: "google",
    emailVerified: true,
  };
  const member = { clientKey: "salao-um", userId: "google-user-123", googleEmail: "Proprietario@Exemplo.com", active: true };

  test("autoriza apenas Google validado e e-mail associado ao mesmo clientKey", () => {
    expect(canManagePortfolioBooking(google, member, "salao-um")).toBe(true);
    expect(canManagePortfolioBooking(google, member, "salao-dois")).toBe(false);
    expect(canManagePortfolioBooking({ ...google, userId: "outro-usuario" }, member, "salao-um")).toBe(false);
    expect(canManagePortfolioBooking(google, { ...member, userId: "outro-usuario" }, "salao-um")).toBe(false);
    expect(canManagePortfolioBooking({ ...google, provider: "email" }, member, "salao-um")).toBe(false);
    expect(canManagePortfolioBooking({ ...google, emailVerified: false }, member, "salao-um")).toBe(false);
    expect(canManagePortfolioBooking({ ...google, email: "outra@exemplo.com" }, member, "salao-um")).toBe(false);
    expect(canManagePortfolioBooking(google, { ...member, active: false }, "salao-um")).toBe(false);
    expect(canManagePortfolioBooking(null, member, "salao-um")).toBe(false);
  });

  test("não permite reativar reservas canceladas ou alterar atendimentos concluídos", () => {
    expect(canTransitionBookingStatus("requested", "confirmed")).toBe(true);
    expect(canTransitionBookingStatus("requested", "completed")).toBe(false);
    expect(canTransitionBookingStatus("confirmed", "cancelled")).toBe(true);
    expect(canTransitionBookingStatus("confirmed", "no_show")).toBe(true);
    expect(canTransitionBookingStatus("cancelled", "confirmed")).toBe(false);
    expect(canTransitionBookingStatus("completed", "requested")).toBe(false);
  });
});
