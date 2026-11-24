import { expect, test } from 'bun:test';
import { canAnswer } from './support-answer';
test('uncertain answers hand off to a person', () => expect(canAnswer({answer:'a',confidence:.84,sourceIndexes:[0],handoff:false},1)).toBe(false));
test('unsupported answers hand off', () => expect(canAnswer({answer:'a',confidence:1,sourceIndexes:[9],handoff:false},1)).toBe(false));
test('verified confident answers can be displayed', () => expect(canAnswer({answer:'a',confidence:.95,sourceIndexes:[0],handoff:false},1)).toBe(true));
