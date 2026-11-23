import { test, expect } from 'bun:test';
import { leadTracking, nextFilterDay } from './funnel-tracking';
test('preserves the persisted funnel protocol', () => expect(leadTracking({protocol:'0W-261123-ABC123'}).protocol).toBe('0W-261123-ABC123'));
test('end date includes the entire selected day', () => expect(nextFilterDay('2026-11-23')).toBe('2026-11-24T00:00:00.000Z'));
test('does not invent Jotform submissions', () => expect(leadTracking({}).jotform).toBeNull());
test('shows imported Jotform metadata when persisted', () => expect(leadTracking({jotform:{submission_id:'synthetic-1'}}).jotform).toBe('{"submission_id":"synthetic-1"}'));
