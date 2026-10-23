import { describe, it, expect } from 'vitest';
import { powerOf, calculateCurrent, selectCable, selectBreaker } from '../calculators/electrical';

describe('electrical calculators', () => {
  it('стиралка = 2000 Вт (IP44 розетка)', () => expect(powerOf('socket_b3', 'Розетка IP44 стиралка')).toBe(2000));
  it('плита 380В = 7000 Вт', () => expect(powerOf('socket_380', 'Розетка плиты 380В')).toBe(7000));
  it('вытяжка = 250 Вт', () => expect(powerOf('cons_hood', 'Вытяжка над плитой')).toBe(250));
  it('ТВ-розетка = 150 Вт', () => expect(powerOf('sks_tv', 'ТВ-розетка напротив дивана')).toBe(150));
  it('2000 Вт при 220В ≈ 9.6 А', () => expect(calculateCurrent(2000)).toBeCloseTo(9.57, 1));
  it('7000 Вт при 220В ≈ 33.5 А', () => expect(calculateCurrent(7000)).toBeCloseTo(33.5, 1));
  it('9.6 А свет → 3x1.5', () => expect(selectCable(9.6, true)).toBe('3x1.5'));
  it('33.5 А плита → 3x10', () => expect(selectCable(33.5)).toBe('3x10'));
  it('52 А Гр.1 → 3x16', () => expect(selectCable(52)).toBe('3x16'));
  it('9.6 А → C10', () => expect(selectBreaker(9.6)).toBe(10));
  it('33.5 А → C40', () => expect(selectBreaker(33.5)).toBe(40));
});
