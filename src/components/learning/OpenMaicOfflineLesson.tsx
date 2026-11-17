import { resolveOpenMaicOfflineLessonPath } from '../../lib/integrations/openmaicOffline';

export type OpenMaicOfflineLessonProps = {
  /** Only reviewed OpenMAIC standalone HTML files are allowed. */
  lessonPath: string;
  title: string;
  description?: string;
  /** Fail closed: this component is invisible unless explicitly enabled. */
  enabled?: boolean;
  minHeight?: number;
};

/**
 * Optional viewer for approved OpenMAIC offline HTML exports.
 * Sandboxing deliberately omits allow-same-origin, forms and top navigation.
 * This is a playback adapter, not an AI generation service or published route.
 */
export function OpenMaicOfflineLesson({
  lessonPath,
  title,
  description,
  enabled = false,
  minHeight = 480,
}: OpenMaicOfflineLessonProps) {
  const safePath = resolveOpenMaicOfflineLessonPath(lessonPath);

  if (!enabled || !safePath || !title.trim()) return null;

  const height = Number.isFinite(minHeight)
    ? Math.max(320, Math.min(minHeight, 960))
    : 480;

  return (
    <section aria-label={title}>
      <iframe
        title={'Aula interativa: ' + title}
        src={safePath}
        loading="lazy"
        sandbox="allow-scripts"
        referrerPolicy="no-referrer"
        className="w-full rounded-xl border border-border"
        style={{ minHeight: height, height: 'min(75vh, 820px)' }}
      />
      {description ? (
        <p className="mt-3 text-sm text-muted-foreground">{description}</p>
      ) : null}
    </section>
  );
}
