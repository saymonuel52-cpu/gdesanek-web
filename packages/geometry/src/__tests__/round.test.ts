import { describe, it, expect } from 'vitest';
import { roundTo } from '../round';

describe('roundTo', () => {
  it('3456 → 3460 (шаг 10)', () => expect(roundTo(3456, 10)).toBe(3460));
  it('3454 → 3450 (шаг 10)', () => expect(roundTo(3454, 10)).toBe(3450));
  it('1234 → 1200 (шаг 100)', () => expect(roundTo(1234, 100)).toBe(1200));
  it('99 → 100 (шаг 100)', () => expect(roundTo(99, 100)).toBe(100));
  it('0 → 0', () => expect(roundTo(0, 100)).toBe(0));
});