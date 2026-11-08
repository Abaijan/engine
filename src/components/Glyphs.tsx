import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';

export type GlyphId =
  | 'tank' | 'pump' | 'filter' | 'rail' | 'airbox' | 'throttle' | 'manifold' | 'cyl'
  | 'sensor' | 'ecu' | 'coil' | 'plug' | 'oilpan' | 'bearings' | 'jacket' | 'thermostat'
  | 'radiator' | 'exmanifold' | 'cat' | 'muffler' | 'turbo' | 'motor' | 'engine';

interface Props {
  id: GlyphId;
  cx: number;
  cy: number;
  color: string;
}

/** Small schematic part icons, roughly 120×84 around the center. */
export const Glyph: React.FC<Props> = ({id, cx, cy, color}) => {
  const frame = useCurrentFrame();
  const f = `${color}22`;
  const common = {stroke: color, strokeWidth: 3, fill: f, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
  const spin = frame * 6;

  let body: React.ReactNode = null;
  switch (id) {
    case 'tank':
      body = (
        <>
          <rect x={-50} y={-26} width={100} height={56} rx={16} {...common} />
          <rect x={-10} y={-38} width={20} height={12} rx={3} {...common} />
          <path d="M-36,6 q9,-8 18,0 t18,0 t18,0 t18,0" fill="none" stroke={color} strokeWidth={3} />
        </>
      );
      break;
    case 'pump':
      body = (
        <>
          <circle r={30} {...common} />
          <g transform={`rotate(${spin})`}>
            {[0, 120, 240].map((a) => (
              <line key={a} x1={0} y1={0} x2={0} y2={-22} stroke={color} strokeWidth={5} transform={`rotate(${a})`} />
            ))}
          </g>
          <line x1={-56} y1={0} x2={-30} y2={0} stroke={color} strokeWidth={6} />
          <line x1={30} y1={-14} x2={56} y2={-14} stroke={color} strokeWidth={6} />
        </>
      );
      break;
    case 'filter':
      body = (
        <>
          <rect x={-30} y={-36} width={60} height={72} rx={12} {...common} />
          {[-18, -9, 0, 9, 18].map((x) => (
            <line key={x} x1={x} y1={-24} x2={x} y2={24} stroke={color} strokeWidth={2} />
          ))}
        </>
      );
      break;
    case 'rail':
      body = (
        <>
          <rect x={-58} y={-22} width={116} height={20} rx={8} {...common} />
          {[-42, -14, 14, 42].map((x) => (
            <g key={x}>
              <polygon points={`${x - 7},-2 ${x + 7},-2 ${x + 4},20 ${x - 4},20`} {...common} />
              <polygon points={`${x - 10},36 ${x + 10},36 ${x},22`} fill={color} opacity={0.35 + 0.25 * Math.sin(frame / 3 + x)} stroke="none" />
            </g>
          ))}
        </>
      );
      break;
    case 'airbox':
      body = (
        <>
          <rect x={-46} y={-28} width={92} height={56} rx={10} {...common} />
          {[-30, -18, -6, 6, 18, 30].map((x) => (
            <line key={x} x1={x} y1={-20} x2={x} y2={20} stroke={color} strokeWidth={2} />
          ))}
          <line x1={-60} y1={0} x2={-46} y2={0} stroke={color} strokeWidth={8} />
          <line x1={46} y1={0} x2={60} y2={0} stroke={color} strokeWidth={8} />
        </>
      );
      break;
    case 'throttle': {
      const ang = 50 + 35 * Math.sin(frame / 14);
      body = (
        <>
          <rect x={-52} y={-28} width={104} height={56} rx={8} {...common} />
          <line x1={0} y1={-24} x2={0} y2={24} stroke={color} strokeWidth={4} transform={`rotate(${ang})`} />
          <circle r={5} fill={color} />
        </>
      );
      break;
    }
    case 'manifold':
      body = (
        <>
          <rect x={-52} y={-34} width={104} height={18} rx={8} {...common} />
          {[-38, -13, 13, 38].map((x) => (
            <line key={x} x1={x} y1={-16} x2={x} y2={34} stroke={color} strokeWidth={9} />
          ))}
        </>
      );
      break;
    case 'exmanifold':
      body = (
        <>
          {[-40, -14, 14, 40].map((x) => (
            <path key={x} d={`M${x},-34 L${x},-12 Q${x},2 0,8`} fill="none" stroke={color} strokeWidth={7} />
          ))}
          <line x1={0} y1={8} x2={0} y2={36} stroke={color} strokeWidth={10} />
        </>
      );
      break;
    case 'cyl':
      body = (
        <>
          <rect x={-30} y={-38} width={60} height={72} rx={4} {...common} />
          <rect x={-25} y={-8 + 12 * Math.sin(frame / 8)} width={50} height={22} rx={3} fill={color} opacity={0.6} />
        </>
      );
      break;
    case 'sensor':
      body = (
        <>
          <circle r={14} {...common} />
          {[24, 36, 48].map((r) => (
            <path key={r} d={`M${-r * 0.7},${-r * 0.7} A${r} ${r} 0 0 1 ${r * 0.7},${-r * 0.7}`} fill="none" stroke={color} strokeWidth={3} opacity={0.9 - r / 70} />
          ))}
          <line x1={0} y1={14} x2={0} y2={36} stroke={color} strokeWidth={6} />
        </>
      );
      break;
    case 'ecu':
      body = (
        <>
          <rect x={-46} y={-30} width={92} height={60} rx={8} {...common} />
          <rect x={-18} y={-14} width={36} height={28} rx={3} fill={color} opacity={0.5} />
          {[-34, -20, -6, 8, 22].map((y) => (
            <g key={y}>
              <line x1={-58} y1={y} x2={-46} y2={y} stroke={color} strokeWidth={3} />
              <line x1={46} y1={y} x2={58} y2={y} stroke={color} strokeWidth={3} />
            </g>
          ))}
        </>
      );
      break;
    case 'coil':
      body = (
        <>
          {[-26, -13, 0, 13, 26].map((y) => (
            <ellipse key={y} cx={0} cy={y} rx={26} ry={6} {...common} />
          ))}
          <line x1={0} y1={-36} x2={0} y2={-30} stroke={color} strokeWidth={5} />
        </>
      );
      break;
    case 'plug':
      body = (
        <>
          <rect x={-8} y={-38} width={16} height={34} rx={4} fill="#f4f8ff" stroke={color} strokeWidth={2} />
          <rect x={-15} y={-6} width={30} height={14} {...common} />
          <rect x={-9} y={8} width={18} height={20} {...common} />
          <path d="M0,28 V34 M9,28 V32 H2" fill="none" stroke={color} strokeWidth={3} />
        </>
      );
      break;
    case 'oilpan':
      body = (
        <>
          <path d="M-52,-20 H52 L36,28 H-36 Z" {...common} />
          <path d="M-44,-4 H44 L38,10 H-38 Z" fill={C.oil} opacity={0.6} stroke="none" />
        </>
      );
      break;
    case 'bearings':
      body = (
        <>
          <circle r={30} {...common} />
          <circle r={14} {...common} />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <circle key={a} cx={22 * Math.sin(((a + spin / 3) * Math.PI) / 180)} cy={-22 * Math.cos(((a + spin / 3) * Math.PI) / 180)} r={4} fill={color} />
          ))}
        </>
      );
      break;
    case 'jacket':
      body = (
        <>
          <rect x={-46} y={-32} width={92} height={64} rx={6} {...common} />
          <rect x={-22} y={-32} width={44} height={64} fill="#06142b" stroke={color} strokeWidth={2} />
          <path d="M-34,-22 V22 M34,-22 V22" stroke={color} strokeWidth={6} opacity={0.8} />
        </>
      );
      break;
    case 'thermostat':
      body = (
        <>
          <circle r={26} {...common} />
          <line x1={0} y1={0} x2={22} y2={-8 - 6 * Math.sin(frame / 20)} stroke={color} strokeWidth={5} />
          <line x1={-58} y1={0} x2={-26} y2={0} stroke={color} strokeWidth={7} />
          <line x1={26} y1={0} x2={58} y2={0} stroke={color} strokeWidth={7} />
        </>
      );
      break;
    case 'radiator':
      body = (
        <>
          <rect x={-46} y={-34} width={92} height={68} rx={6} {...common} />
          {[-34, -24, -14, -4, 6, 16, 26, 36].map((x) => (
            <line key={x} x1={x} y1={-26} x2={x} y2={26} stroke={color} strokeWidth={2} />
          ))}
        </>
      );
      break;
    case 'cat':
      body = (
        <>
          <rect x={-54} y={-28} width={108} height={56} rx={28} {...common} />
          {[-28, -12, 4, 20].flatMap((x) =>
            [-12, 2, 16].map((y) => <circle key={`${x}${y}`} cx={x + 8} cy={y} r={3.5} fill={color} />),
          )}
        </>
      );
      break;
    case 'muffler':
      body = (
        <>
          <rect x={-56} y={-26} width={112} height={52} rx={26} {...common} />
          <line x1={-24} y1={-26} x2={-24} y2={26} stroke={color} strokeWidth={2} />
          <line x1={8} y1={-26} x2={8} y2={26} stroke={color} strokeWidth={2} />
          <line x1={-70} y1={0} x2={-56} y2={0} stroke={color} strokeWidth={8} />
          <line x1={56} y1={0} x2={70} y2={0} stroke={color} strokeWidth={8} />
        </>
      );
      break;
    case 'turbo':
      body = (
        <>
          <circle cx={-28} cy={0} r={26} {...common} />
          <circle cx={30} cy={0} r={22} {...common} />
          <line x1={-28} y1={0} x2={30} y2={0} stroke={color} strokeWidth={4} />
          <g transform={`translate(-28,0) rotate(${spin * 2})`}>
            {[0, 72, 144, 216, 288].map((a) => (
              <line key={a} x1={0} y1={0} x2={0} y2={-22} stroke={color} strokeWidth={4} transform={`rotate(${a})`} />
            ))}
          </g>
          <g transform={`translate(30,0) rotate(${spin * 2})`}>
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <line key={a} x1={0} y1={0} x2={0} y2={-18} stroke={color} strokeWidth={4} transform={`rotate(${a})`} />
            ))}
          </g>
        </>
      );
      break;
    case 'motor':
      body = (
        <>
          <rect x={-42} y={-30} width={84} height={60} rx={14} {...common} />
          <polygon points="4,-22 -14,4 -2,4 -6,22 14,-6 2,-6" fill={color} stroke="none" />
        </>
      );
      break;
    case 'engine':
      body = (
        <>
          <rect x={-50} y={-10} width={100} height={42} rx={6} {...common} />
          {[-34, -12, 10, 32].map((x) => (
            <rect key={x} x={x - 7} y={-34} width={14} height={26} rx={2} {...common} />
          ))}
        </>
      );
      break;
  }
  return <g transform={`translate(${cx},${cy})`}>{body}</g>;
};
