import { expect, test } from 'bun:test';
import { isMotionContentVisible } from '../../src/lib/motion-visibility';

test('conteúdo crítico permanece disponível mesmo após hidratação e antes do observer', () => {
  expect(isMotionContentVisible({ firstPaint: true, armed: true, seen: false, reduced: false })).toBe(true);
});
test('opt-in não desativa a revelação dos demais blocos', () => {
  expect(isMotionContentVisible({ firstPaint: false, armed: true, seen: false, reduced: false })).toBe(false);
  expect(isMotionContentVisible({ firstPaint: false, armed: true, seen: true, reduced: false })).toBe(true);
});
test('conteúdo existe sem JS e com redução de movimento', () => {
  expect(isMotionContentVisible({ firstPaint: false, armed: false, seen: false, reduced: false })).toBe(true);
  expect(isMotionContentVisible({ firstPaint: false, armed: true, seen: false, reduced: true })).toBe(true);
});