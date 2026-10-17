import { describe, expect, it } from 'vitest';
import { resolveOpenMaicOfflineLessonPath } from './openmaicOffline';

describe('OpenMAIC offline lesson URL guard', () => {
  it('accepts only reviewed same-origin HTML lesson locations', () => {
    expect(resolveOpenMaicOfflineLessonPath('/openmaic-lessons/primeiros-passos.html')).toBe('/openmaic-lessons/primeiros-passos.html');
    expect(resolveOpenMaicOfflineLessonPath('/openmaic-lessons/informatica/diagnostico_1.html')).toBe('/openmaic-lessons/informatica/diagnostico_1.html');
  });

  it.each([
    'https://open.maic.chat/course/123',
    '//example.com/classroom.html',
    '/openmaic-lessons/../admin.html',
    '/openmaic-lessons/a%2fb.html',
    '/openmaic-lessons/course.html?token=secret',
    '/openmaic-lessons/course.js',
    '/openmaic-lessons//course.html',
    '/other-path/course.html',
    '/openmaic-lessons/.html',
    '',
    null,
    undefined,
  ])('rejects external, malformed or unexpected paths (%s)', (value) => {
    expect(resolveOpenMaicOfflineLessonPath(value)).toBeNull();
  });
});
