import { describe, expect, it } from 'vitest';
import { canTransition } from '../src/domain.js';

describe('referral state machine', () => {
  it('allows the happy path', () => {
    expect(canTransition('DRAFT', 'SUBMITTED')).toBe(true);
    expect(canTransition('RECEIVED', 'ACCEPTED')).toBe(true);
    expect(canTransition('ACCEPTED', 'SCHEDULED')).toBe(true);
  });

  it('blocks unsafe invalid transitions', () => {
    expect(canTransition('DRAFT', 'CLOSED')).toBe(false);
    expect(canTransition('SUBMITTED', 'ATTENDED')).toBe(false);
  });
});
