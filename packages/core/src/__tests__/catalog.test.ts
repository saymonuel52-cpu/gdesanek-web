import { describe, it, expect } from 'vitest';
import { CATALOG, GROUPS, getItemByType, getItemsByGroup } from '../catalog';

describe('catalog', () => {
  it('25 позиций как в листе 7.1 PDF', () => expect(CATALOG.length).toBe(25));

  it('getItemByType: socket_b3 = 2000 Вт, h=110', () => {
    const i = getItemByType('socket_b3');
    expect(i?.power).toBe(2000);
    expect(i?.h).toBe(110);
  });

  it('getItemByType: неизвестный тип = undefined', () => {
    expect(getItemByType('nope_type')).toBeUndefined();
  });

  it('getItemsByGroup: Щиты содержат junction_box', () => {
    expect(getItemsByGroup('Щиты').some((i) => i.type === 'junction_box')).toBe(true);
  });

  it('GROUPS: 5 групп (Розетки/Выключатели/Освещение/Щиты/Слаботочка)', () => {
    expect(GROUPS).toContain('Розетки');
    expect(GROUPS).toContain('Щиты');
    expect(GROUPS.length).toBe(5);
  });
});