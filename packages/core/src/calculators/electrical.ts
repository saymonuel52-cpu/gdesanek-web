export function powerOf(type: string, name: string): number {
  const n = name.toLowerCase();
  
  // Сначала проверяем специфичные случаи (порядок важен!)
  if (n.includes('вытяж')) return 250;
  if (n.includes('стир')) return 2000;
  if (n.includes('посудом')) return 2000;
  if (n.includes('духов')) return 2500;
  if (n.includes('бойлер') || n.includes('нагрев')) return 1500;
  if (n.includes('кондиц') || n.includes('сплит')) return 1200;
  if (n.includes('насос')) return 600;
  if (n.includes('микроволн') || n.includes('свч')) return 1000;
  if (n.includes('чайник')) return 1500;
  if (n.includes('холодил')) return 300;
  if (n.includes('тв')) return 150;
  
  // Потом проверяем общие типы
  if (n.includes('380') || type.includes('380') || n.includes('плит')) return 7000;
  
  if (type.includes('sks') || type.includes('rj45')) return 20;
  if (type.includes('socket')) return 100;
  if (type.includes('switch')) return 0;
  if (type.includes('lamp')) return 60;
  return 60;
}

export function calculateCurrent(pW: number, u = 220, cos = 0.95): number { 
  return pW / (u * cos); 
}

export function selectCable(a: number, light = false): string {
  if (a <= 10 && light) return '3x1.5';
  if (a <= 16) return '3x2.5';
  if (a <= 25) return '3x4';
  if (a <= 32) return '3x6';
  if (a <= 40) return '3x10';
  return '3x16';
}

export function selectBreaker(a: number): number {
  return [6,10,16,20,25,32,40,50,63].find(n => n >= a) ?? 63;
}