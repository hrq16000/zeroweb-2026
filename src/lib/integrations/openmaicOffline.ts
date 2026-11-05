/**
 * OpenMAIC offline lesson URL guard.
 *
 * Lessons must be reviewed, exported as standalone HTML, and copied into
 * public/openmaic-lessons/ before a project explicitly enables their display.
 * No model calls, secrets, database or remote origins are used here.
 */
const SAFE_LESSON_PATH = /^\/openmaic-lessons\/(?:[a-z0-9]+(?:[-_][a-z0-9]+)*\/)*[a-z0-9]+(?:[-_][a-z0-9]+)*\.html$/;

export function resolveOpenMaicOfflineLessonPath(value: unknown): string | null {
  return typeof value === 'string' && SAFE_LESSON_PATH.test(value) ? value : null;
}
