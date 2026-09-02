/**
 * Cliente do pixel do quiz.
 *
 * Gera um identificador anônimo de sessão (sessionStorage, sem cookie e sem
 * dado pessoal) e envia eventos de etapa/clique/abandono para o servidor.
 * Falhas são silenciosas: rastreamento nunca pode quebrar o funil.
 */
import { trackQuizEvent, type QuizEventType } from "./quiz-pixel.functions";

const STORAGE_KEY = "0web.quiz.session";

export function getQuizSessionKey(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.sessionStorage.getItem(STORAGE_KEY);
    if (existing && existing.length >= 8) return existing;
    const fresh =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID().replace(/-/g, "")
        : `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
    window.sessionStorage.setItem(STORAGE_KEY, fresh);
    return fresh;
  } catch {
    return `s${Date.now().toString(36)}`;
  }
}

export type QuizPixelPayload = {
  quizKey: string;
  eventType: QuizEventType;
  stepKey?: string;
  stepIndex?: number;
  answerLabel?: string | null;
  leadId?: string | null;
};

export function trackQuiz(payload: QuizPixelPayload): void {
  if (typeof window === "undefined") return;
  const sessionKey = getQuizSessionKey();
  if (!sessionKey) return;
  void trackQuizEvent({
    data: {
      sessionKey,
      quizKey: payload.quizKey,
      stepKey: payload.stepKey ?? "",
      stepIndex: payload.stepIndex ?? 0,
      eventType: payload.eventType,
      answerLabel: payload.answerLabel ?? null,
      pagePath: window.location.pathname.slice(0, 200),
      leadId: payload.leadId ?? null,
    },
  }).catch(() => {
    /* rastreamento é best-effort */
  });
}
