export interface CatalogItem { type: string; label: string; group: string; power?: number; h?: number }
export const CATALOG: CatalogItem[] = [
  { type: 'socket_b1', label: 'Розетка 220В', group: 'Розетки', power: 100, h: 30 },
  { type: 'socket_b2', label: 'Розетка 220В сдвоенная', group: 'Розетки', power: 200, h: 30 },
  { type: 'socket_b3', label: 'Розетка IP44', group: 'Розетки', power: 2000, h: 110 },
  { type: 'socket_380', label: 'Розетка 380В', group: 'Розетки', power: 7000, h: 30 },
  { type: 'switch_1', label: 'Выключатель 1-кл', group: 'Выключатели', h: 90 },
  { type: 'switch_2', label: 'Выключатель 2-кл', group: 'Выключатели', h: 90 },
  { type: 'switch_3', label: 'Выключатель 3-кл', group: 'Выключатели', h: 90 },
  { type: 'switch_pass', label: 'Проходной (П)', group: 'Выключатели', h: 90 },
  { type: 'switch_dim', label: 'Диммер (N)', group: 'Выключатели', h: 90 },
  { type: 'switch_move', label: 'Датчик движения', group: 'Выключатели', power: 20, h: 220 },
  { type: 'lamp_grig', label: 'Точечный свет', group: 'Освещение', power: 36, h: 270 },
  { type: 'lamp_lust', label: 'Люстра', group: 'Освещение', power: 180, h: 270 },
  { type: 'lamp_titan', label: 'Лин. светильник 600', group: 'Освещение', power: 36, h: 270 },
  { type: 'lamp_flame', label: 'Лин. светильник 1200', group: 'Освещение', power: 72, h: 270 },
  { type: 'lamp_bra', label: 'Бра', group: 'Освещение', power: 60, h: 180 },
  { type: 'lamp_led', label: 'LED-лента', group: 'Освещение', power: 50, h: 270 },
  { type: 'panel_shr', label: 'Электрощит ЩР', group: 'Щиты', h: 180 },
  { type: 'junction_box', label: 'Распаячная коробка', group: 'Щиты', h: 250 },
  { type: 'rj45', label: 'RJ45 Интернет', group: 'Слаботочка', power: 20, h: 30 },
  { type: 'sks_tv', label: 'ТВ-розетка', group: 'Слаботочка', power: 20, h: 30 },
  { type: 'sks_tel', label: 'Телефон', group: 'Слаботочка', power: 20, h: 30 },
  { type: 'sks_dom', label: 'Домофон', group: 'Слаботочка', power: 20, h: 30 },
  { type: 'sks_kam', label: 'Камера', group: 'Слаботочка', power: 20, h: 220 },
  { type: 'sensor_smoke', label: 'Дымовой датчик (S)', group: 'Слаботочка', power: 5, h: 270 },
  { type: 'sensor_alarm', label: 'Датчик охраны (ОХР)', group: 'Слаботочка', power: 5, h: 220 },
];
export const GROUPS = [...new Set(CATALOG.map(i => i.group))];

export function getItemByType(type: string): CatalogItem | undefined {
  return CATALOG.find((i) => i.type === type);
}

export function getItemsByGroup(group: string): CatalogItem[] {
  return CATALOG.filter((i) => i.group === group);
}