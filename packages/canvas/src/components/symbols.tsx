import { Group, Arc, Circle, Line, Rect, Text } from 'react-konva';

const COLORS: Record<string, string> = {
  socket: '#D32F2F',
  switch: '#1976D2',
  lamp: '#F9A825',
  weak: '#388E3C',
  panel: '#455A64',
  sensor: '#7B1FA2',
};

function colorOf(type: string): string {
  if (type.startsWith('socket')) return COLORS.socket;
  if (type.startsWith('switch')) return COLORS.switch;
  if (type.startsWith('lamp')) return COLORS.lamp;
  if (type.startsWith('sks') || type.startsWith('rj45')) return COLORS.weak;
  if (type.startsWith('panel') || type.startsWith('junction')) return COLORS.panel;
  if (type.startsWith('sensor')) return COLORS.sensor;
  return '#333';
}

interface Props { type: string; selected?: boolean }

export function SymbolShape({ type, selected }: Props) {
  const c = selected ? '#00BFFF' : colorOf(type);
  const sw = 3;

  // Розетки: полукруг + штырь (ГОСТ 21.614)
  if (type.startsWith('socket')) {
    const double = type.includes('b2');
    const ip44 = type.includes('b3');
    const v380 = type.includes('380');
    return (
      <Group>
        {(double ? [-10, 10] : [0]).map((dx, i) => (
          <Arc key={i} x={dx} y={0} radius={12} angle={180} rotation={0}
            stroke={c} strokeWidth={sw} fill={ip44 ? c : undefined} closed={ip44} />
        ))}
        {(v380 ? [-6, 0, 6] : [0]).map((dx, i) => (
          <Line key={`p${i}`} points={[dx, 0, dx, -16]} stroke={c} strokeWidth={sw} />
        ))}
      </Group>
    );
  }

  // Выключатели: круг + риски клавиш
  if (type.startsWith('switch')) {
    const keys = type.includes('3') ? 3 : type.includes('2') ? 2 : 1;
    const pass = type.includes('pass');
    return (
      <Group>
        <Circle radius={10} stroke={c} strokeWidth={sw} />
        {Array.from({ length: pass ? 2 : keys }).map((_, i) => (
          <Line key={i}
            points={[-4 + i * 5, -8, -1 + i * 5, -18]}
            stroke={c} strokeWidth={sw} />
        ))}
      </Group>
    );
  }

  // Освещение
  if (type.startsWith('lamp')) {
    if (type.includes('grig')) return <Circle radius={7} fill={c} />;
    if (type.includes('titan') || type.includes('flame')) {
      const w = type.includes('flame') ? 120 : 60;
      return <Rect x={-w / 2} y={-5} width={w} height={10} stroke={c} strokeWidth={sw} />;
    }
    if (type.includes('bra')) {
      return (
        <Group>
          <Circle radius={9} stroke={c} strokeWidth={sw} />
          <Line points={[0, 9, 0, 18]} stroke={c} strokeWidth={sw} />
        </Group>
      );
    }
    if (type.includes('led')) {
      return <Line points={[-40, 0, 40, 0]} stroke={c} strokeWidth={sw} dash={[8, 6]} />;
    }
    // люстра: круг + крест
    return (
      <Group>
        <Circle radius={13} stroke={c} strokeWidth={sw} />
        <Line points={[-9, -9, 9, 9]} stroke={c} strokeWidth={sw} />
        <Line points={[-9, 9, 9, -9]} stroke={c} strokeWidth={sw} />
      </Group>
    );
  }

  // Щиты и коробки
  if (type.startsWith('panel') || type.startsWith('junction')) {
    const box = type.startsWith('junction');
    return (
      <Group>
        <Rect x={-18} y={-14} width={36} height={28} stroke={c} strokeWidth={sw} />
        {box ? (
          <Group>
            <Line points={[-18, -14, 18, 14]} stroke={c} strokeWidth={2} />
            <Line points={[-18, 14, 18, -14]} stroke={c} strokeWidth={2} />
          </Group>
        ) : (
          <Line points={[-18, 14, 18, -14]} stroke={c} strokeWidth={2} />
        )}
      </Group>
    );
  }

  // Слаботочка: квадрат с буквой
  if (type.startsWith('sks') || type.startsWith('rj45')) {
    const letter = type.includes('tv') ? 'ТВ' : type.includes('tel') ? 'Т'
      : type.includes('dom') ? 'Д' : type.includes('kam') ? 'К' : 'И';
    return (
      <Group>
        <Rect x={-12} y={-12} width={24} height={24} stroke={c} strokeWidth={sw} />
        <Text text={letter} fontSize={13} fontStyle="bold" fill={c} offsetX={7} offsetY={7} />
      </Group>
    );
  }

  // Датчики: круг с буквой
  if (type.startsWith('sensor')) {
    return (
      <Group>
        <Circle radius={11} stroke={c} strokeWidth={sw} />
        <Text text={type.includes('smoke') ? 'S' : 'О'} fontSize={12}
          fontStyle="bold" fill={c} offsetX={5} offsetY={7} />
      </Group>
    );
  }

  return <Circle radius={10} stroke={c} strokeWidth={sw} />;
}