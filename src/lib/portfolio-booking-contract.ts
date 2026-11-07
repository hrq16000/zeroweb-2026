/**
 * Contrato funcional compartilhado de agendas por portfolio.
 *
 * Este módulo é puro: NÃO persiste agendamentos e NÃO confere identidade real.
 * Disponibilidade definitiva e autorização são obrigatoriamente revalidadas
 * no servidor/banco, de forma atômica, antes de confirmar uma reserva.
 * Nenhum portfolio herda agenda, acesso ou serviço de outro clientKey.
 */
export const BOOKING_STATUSES = [
  "requested",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export type BookingWindow = Readonly<{ startMinute: number; endMinute: number }>;
export type BookingAvailabilityInput = Readonly<{
  workingHours: readonly BookingWindow[];
  occupied: readonly BookingWindow[];
  blocked?: readonly BookingWindow[];
  durationMinutes: number;
  stepMinutes?: number;
  minimumStartMinute?: number;
}>;

const MINUTES_PER_DAY = 1440;

function validMinute(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= MINUTES_PER_DAY;
}

function assertWindow(window: BookingWindow): void {
  if (
    !validMinute(window.startMinute) ||
    !validMinute(window.endMinute) ||
    window.endMinute <= window.startMinute
  ) {
    throw new Error("Janela de agenda inválida.");
  }
}

function overlaps(a: BookingWindow, b: BookingWindow): boolean {
  return a.startMinute < b.endMinute && b.startMinute < a.endMinute;
}

/**
 * Calcula horários candidatos em MINUTOS LOCAIS do dia (0=00:00).
 * Uso: preview de disponibilidade; NÃO substitui transação do servidor.
 * Janelas usam intervalos semiabertos [início, fim), permitindo horários
 * consecutivos sem conflito. Fuso e horário de verão são responsabilidade
 * da conversão server-side da data local para timestamptz.
 */
export function findBookingStartMinutes({
  workingHours,
  occupied,
  blocked = [],
  durationMinutes,
  stepMinutes = 15,
  minimumStartMinute = 0,
}: BookingAvailabilityInput): number[] {
  if (!Number.isInteger(durationMinutes) || durationMinutes <= 0 || durationMinutes > 720) {
    throw new Error("Duração de serviço inválida.");
  }
  if (!Number.isInteger(stepMinutes) || stepMinutes < 5 || stepMinutes > 120) {
    throw new Error("Intervalo de agenda inválido.");
  }
  if (!validMinute(minimumStartMinute)) {
    throw new Error("Antecedência de agendamento inválida.");
  }
  for (const window of [...workingHours, ...occupied, ...blocked]) {
    assertWindow(window);
  }

  const occupiedOrBlocked = [...occupied, ...blocked];
  const starts = new Set<number>();
  for (const hours of workingHours) {
    const first = Math.ceil(Math.max(hours.startMinute, minimumStartMinute) / stepMinutes) * stepMinutes;
    for (let startMinute = first; startMinute + durationMinutes <= hours.endMinute; startMinute += stepMinutes) {
      const candidate = { startMinute, endMinute: startMinute + durationMinutes };
      if (!occupiedOrBlocked.some((window) => overlaps(candidate, window))) {
        starts.add(startMinute);
      }
    }
  }
  return [...starts].sort((a, b) => a - b);
}

export function minuteToTime(minute: number): string {
  if (!validMinute(minute) || minute === MINUTES_PER_DAY) {
    throw new Error("Horário inválido.");
  }
  return `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
}

const TRANSITIONS: Record<BookingStatus, readonly BookingStatus[]> = {
  requested: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled", "no_show"],
  completed: [],
  cancelled: [],
  no_show: [],
};

export function canTransitionBookingStatus(current: BookingStatus, next: BookingStatus): boolean {
  return TRANSITIONS[current]?.includes(next) ?? false;
}

/**
 * Política auxiliar para a UI. Os argumentos de identidade DEVEM vir de sessão
 * Google validada no servidor; esta função nunca autentica por conta própria.
 */
export function canManagePortfolioBooking(
  identity: Readonly<{ userId: string; email: string; provider: string; emailVerified: boolean }> | null,
  membership: Readonly<{ clientKey: string; userId: string; googleEmail: string; active: boolean }> | null,
  requestedClientKey: string,
): boolean {
  if (!identity?.userId || !membership?.active || !requestedClientKey) return false;
  if (identity.provider !== "google" || !identity.emailVerified) return false;
  if (membership.clientKey !== requestedClientKey || identity.userId !== membership.userId) return false;
  const email = identity.email.trim().toLowerCase();
  return email.length > 0 && email === membership.googleEmail.trim().toLowerCase();
}
