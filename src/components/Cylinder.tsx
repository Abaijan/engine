import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {PartId} from '../parts';
import {
  BORE, HEAD_Y, R, camAngleDeg, camPath, crankPin, flameOpacity, flameRadius,
  gasColor, mod, pinY, valveLift,
} from '../kinematics';

const CAM = camPath();
const CAM_Y = -367;
const STEM_TOP = -355;

interface Props {
  /** Operating cycle angle, 0..720 (0 is intake start at top dead center). */
  phi: number;
  /** Highlight these parts and dim the rest. An empty list leaves everything unchanged. */
  highlight?: PartId[];
  width?: number;
}

export const Cylinder: React.FC<Props> = ({phi: phiIn, highlight = [], width = 520}) => {
  const frame = useCurrentFrame();
  const phi = mod(phiIn, 720);
  const th = phi;
  const py = pinY(th);
  const pt = py - 30;
  const pb = py + 25;
  const cp = crankPin(th);
  const liftIn = valveLift(phi, 'in');
  const liftEx = valveLift(phi, 'ex');
  const gasH = Math.max(0, pt - HEAD_Y);

  const o = (id: PartId) => (highlight.length === 0 || highlight.includes(id) ? 1 : 0.22);
  const glow = (id: PartId): React.CSSProperties =>
    highlight.includes(id) ? {filter: 'drop-shadow(0 0 7px #ffffff) drop-shadow(0 0 14px #ffffff88)'} : {};

  const sparkOn = phi >= 350 && phi <= 366;
  const sparkGlow = interpolate(phi, [350, 358, 366], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const spring = (x: number, lift: number) => {
    const y1 = -349 + lift;
    const y2 = -310;
    const pts: string[] = [];
    for (let i = 0; i <= 7; i++) {
      pts.push(`${x + (i % 2 ? -8 : 8)},${y1 + ((y2 - y1) * i) / 7}`);
    }
    return pts.join(' ');
  };

  const arrowShift = (frame * 1.6) % 20;
  const arrows = (x0: number, y: number, op: number, color: string) =>
    [0, 1, 2].map((k) => {
      const x = x0 + k * 20 + arrowShift - 20;
      const a = x < x0 ? 0 : x > x0 + 40 ? 0 : 1;
      return (
        <polygon
          key={k}
          points={`${x},${y - 7} ${x + 10},${y} ${x},${y + 7}`}
          fill={color}
          opacity={op * a}
        />
      );
    });

  return (
    <svg
      viewBox="-170 -450 460 640"
      width={width}
      height={(width * 640) / 460}
      style={{overflow: 'visible'}}
    >
      <defs>
        <linearGradient id="steelG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4a6ea8" />
          <stop offset="0.5" stopColor="#35568a" />
          <stop offset="1" stopColor="#2b4673" />
        </linearGradient>
        <linearGradient id="aluG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c9d9f2" />
          <stop offset="0.5" stopColor="#f1f6ff" />
          <stop offset="1" stopColor="#9db6dc" />
        </linearGradient>
        <radialGradient id="flameG">
          <stop offset="0" stopColor="#fff6d0" />
          <stop offset="0.45" stopColor="#ffb347" />
          <stop offset="1" stopColor="#ff6a3d" stopOpacity="0" />
        </radialGradient>
        <clipPath id="chamberClip">
          <rect x={-BORE / 2} y={HEAD_Y} width={BORE} height={gasH} />
        </clipPath>
      </defs>

      {/* Timing drive */}
      <g opacity={o('timing')} style={glow('timing')}>
        <path
          d="M208,0 L186,-367 A44 44 0 0 1 274,-367 L252,0 A22 22 0 0 1 208,0 Z"
          fill="none"
          stroke="#162b50"
          strokeWidth={9}
          strokeDasharray="5 4"
        />
        <path
          d="M208,0 L186,-367 A44 44 0 0 1 274,-367 L252,0 A22 22 0 0 1 208,0 Z"
          fill="none"
          stroke={C.steelLight}
          strokeWidth={1.5}
        />
        <g transform={`translate(230,0) rotate(${th})`}>
          <circle r={22} fill={C.steel} stroke={C.steelLight} strokeWidth={2} />
          <circle r={4} fill={C.steelDark} />
          <line x1={0} y1={0} x2={0} y2={-18} stroke={C.hi} strokeWidth={3} />
        </g>
        <g transform={`translate(230,${CAM_Y}) rotate(${th / 2})`}>
          <circle r={44} fill={C.steel} stroke={C.steelLight} strokeWidth={2} />
          <circle r={7} fill={C.steelDark} />
          <line x1={0} y1={0} x2={0} y2={-38} stroke={C.hi} strokeWidth={3} />
          {[60, 120, 180, 240, 300].map((a) => (
            <circle key={a} cx={30 * Math.sin(rad(a))} cy={-30 * Math.cos(rad(a))} r={5} fill={C.steelDark} />
          ))}
        </g>
      </g>

      {/* Cylinder block and crankcase */}
      <g opacity={o('block')} style={glow('block')}>
        <path
          d={`M-115,${HEAD_Y} H115 V-75 H140 V150 H-140 V-75 H-115 Z`}
          fill="url(#steelG)"
          stroke={C.steelLight}
          strokeWidth={2}
        />
        <rect x={-BORE / 2} y={HEAD_Y} width={BORE} height={-75 - HEAD_Y} fill="#06142b" />
        <rect x={-125} y={-75} width={250} height={215} fill="#06142b" />
      </g>
      <g opacity={o('jacket')} style={glow('jacket')}>
        <rect x={-106} y={HEAD_Y + 6} width={30} height={170} rx={6} fill={C.coolant} opacity={0.5} />
        <rect x={76} y={HEAD_Y + 6} width={30} height={170} rx={6} fill={C.coolant} opacity={0.5} />
      </g>
      <g opacity={o('sump')} style={glow('sump')}>
        <rect x={-125} y={112} width={250} height={28} fill={C.oil} opacity={0.65} />
        <path d="M-140,150 H140 L118,168 H-118 Z" fill={C.steelDark} stroke={C.steelLight} strokeWidth={2} />
      </g>

      {/* Gas in the chamber */}
      <g opacity={o('chamber')} style={glow('chamber')}>
        <g clipPath="url(#chamberClip)">
          <rect x={-BORE / 2} y={HEAD_Y} width={BORE} height={gasH} fill={gasColor(phi)} />
          <circle
            cx={0}
            cy={HEAD_Y + 12}
            r={flameRadius(phi)}
            fill="url(#flameG)"
            opacity={flameOpacity(phi)}
          />
        </g>
        {highlight.includes('chamber') && (
          <rect
            x={-BORE / 2 - 2}
            y={HEAD_Y - 2}
            width={BORE + 4}
            height={Math.max(gasH, 12) + 4}
            fill="none"
            stroke={C.hi}
            strokeWidth={2.5}
            strokeDasharray="7 5"
          />
        )}
      </g>

      {/* Flywheel */}
      <g opacity={o('flywheel')} style={glow('flywheel')}>
        <g transform={`rotate(${th})`}>
          <circle r={72} fill="#1c3866" stroke={C.steelLight} strokeWidth={2} />
          <circle r={76} fill="none" stroke={C.steelLight} strokeWidth={6} strokeDasharray="3 3" />
          {[0, 60, 120].map((a) => (
            <line key={a} x1={0} y1={-66} x2={0} y2={66} stroke="#2f538c" strokeWidth={8} transform={`rotate(${a})`} />
          ))}
        </g>
      </g>

      {/* Crankshaft */}
      <g opacity={o('crank')} style={glow('crank')}>
        <circle cx={-0.7 * cp.x} cy={-0.7 * cp.y} r={30} fill="#27467a" stroke={C.steelLight} strokeWidth={2} />
        <line x1={0} y1={0} x2={cp.x} y2={cp.y} stroke={C.steelLight} strokeWidth={20} strokeLinecap="round" />
        <circle r={14} fill={C.steelLight} stroke={C.steelDark} strokeWidth={2} />
        <circle cx={cp.x} cy={cp.y} r={11} fill={C.hi} stroke={C.steelDark} strokeWidth={2} />
      </g>

      {/* Connecting rod */}
      <g opacity={o('rod')} style={glow('rod')}>
        <line x1={0} y1={py} x2={cp.x} y2={cp.y} stroke="#cfe0fb" strokeWidth={13} strokeLinecap="round" />
        <line x1={0} y1={py} x2={cp.x} y2={cp.y} stroke="#6f93c9" strokeWidth={3} />
        <circle cx={cp.x} cy={cp.y} r={17} fill="none" stroke="#cfe0fb" strokeWidth={5} />
      </g>

      {/* Piston */}
      <g opacity={o('piston')} style={glow('piston')}>
        <rect x={-BORE / 2 + 4} y={pt} width={BORE - 8} height={pb - pt} rx={5} fill="url(#aluG)" stroke="#6f93c9" strokeWidth={2} />
      </g>
      <g opacity={o('rings')} style={glow('rings')}>
        <rect x={-BORE / 2 + 3} y={pt + 7} width={BORE - 6} height={4} fill="#0c2547" />
        <rect x={-BORE / 2 + 3} y={pt + 14} width={BORE - 6} height={4} fill="#0c2547" />
        <rect x={-BORE / 2 + 3} y={pt + 34} width={BORE - 6} height={5} fill="#0c2547" />
      </g>
      <g opacity={o('pin')} style={glow('pin')}>
        <circle cx={0} cy={py} r={10} fill="#0c2547" stroke={C.hi} strokeWidth={2.5} />
      </g>

      {/* Cylinder head */}
      <g opacity={o('head')} style={glow('head')}>
        <rect x={-115} y={-310} width={230} height={48} fill="url(#steelG)" stroke={C.steelLight} strokeWidth={2} />
        <rect x={-115} y={-440} width={230} height={130} fill="none" stroke={C.steelLight} strokeWidth={1.5} strokeDasharray="6 5" />
        {/* Intake port */}
        <path d={`M-35,${HEAD_Y} L-35,-282 Q-35,-286 -45,-286 L-170,-286`} fill="none" stroke="#06142b" strokeWidth={26} />
        <path d={`M-35,${HEAD_Y} L-35,-282 Q-35,-286 -45,-286 L-170,-286`} fill="none" stroke={C.intake} strokeWidth={26} opacity={(liftIn / 14) * 0.55} />
        <path d="M-115,-299 H-170 M-115,-273 H-170" stroke={C.steelLight} strokeWidth={4} />
        {/* Exhaust port */}
        <path d={`M35,${HEAD_Y} L35,-282 Q35,-286 45,-286 L170,-286`} fill="none" stroke="#06142b" strokeWidth={26} />
        <path d={`M35,${HEAD_Y} L35,-282 Q35,-286 45,-286 L170,-286`} fill="none" stroke={C.exhaust} strokeWidth={26} opacity={(liftEx / 14) * 0.6} />
        <path d="M115,-299 H170 M115,-273 H170" stroke={C.steelLight} strokeWidth={4} />
        {arrows(-165, -286, liftIn / 14, C.intake)}
        {arrows(122, -286, liftEx / 14, C.exhaust)}
        <text x={-168} y={-310} fontSize={13} fill={C.intake} fontWeight={600}>INTAKE</text>
        <text x={168} y={-310} fontSize={13} fill={C.exhaust} fontWeight={600} textAnchor="end">EXHAUST</text>
      </g>
      <g opacity={o('gasket')} style={glow('gasket')}>
        <rect x={-115} y={HEAD_Y - 4} width={45} height={8} fill="#e0a93c" stroke="#7a5a14" strokeWidth={1} />
        <rect x={70} y={HEAD_Y - 4} width={45} height={8} fill="#e0a93c" stroke="#7a5a14" strokeWidth={1} />
      </g>

      {/* Valves */}
      <g opacity={o('valves')} style={glow('valves')}>
        {([
          [-35, liftIn],
          [35, liftEx],
        ] as const).map(([x, lift]) => (
          <g key={x}>
            <polyline points={spring(x, lift)} fill="none" stroke={C.steelLight} strokeWidth={2.5} />
            <g transform={`translate(0,${lift})`}>
              <rect x={x - 3} y={STEM_TOP} width={6} height={93} fill="#dce8ff" />
              <polygon points={`${x - 8},-272 ${x + 8},-272 ${x + 20},${HEAD_Y} ${x - 20},${HEAD_Y}`} fill="#dce8ff" stroke="#6f93c9" strokeWidth={1.5} />
              <rect x={x - 12} y={STEM_TOP} width={24} height={6} fill="#9db6dc" />
            </g>
          </g>
        ))}
      </g>

      {/* Camshafts */}
      <g opacity={o('cam')} style={glow('cam')}>
        <g transform={`translate(-35,${CAM_Y}) rotate(${camAngleDeg(phi, 'in')})`}>
          <path d={CAM} fill="#173a6e" stroke={C.intake} strokeWidth={2.5} />
          <circle r={4} fill={C.intake} />
        </g>
        <g transform={`translate(35,${CAM_Y}) rotate(${camAngleDeg(phi, 'ex')})`}>
          <path d={CAM} fill="#173a6e" stroke={C.exhaust} strokeWidth={2.5} />
          <circle r={4} fill={C.exhaust} />
        </g>
      </g>

      {/* Spark plug */}
      <g opacity={o('plug')} style={glow('plug')}>
        <rect x={-8} y={-310} width={16} height={48} fill="#9db6dc" stroke="#6f93c9" strokeWidth={1} />
        <rect x={-11} y={-322} width={22} height={12} fill="#cfe0fb" stroke="#6f93c9" strokeWidth={1} />
        <rect x={-6} y={-350} width={12} height={28} rx={3} fill="#f4f8ff" />
        <rect x={-3} y={-358} width={6} height={8} fill={C.steelLight} />
        <line x1={0} y1={HEAD_Y} x2={0} y2={HEAD_Y + 8} stroke={C.hi} strokeWidth={3} />
        <path d={`M9,${HEAD_Y} V${HEAD_Y + 6} H3`} fill="none" stroke={C.hi} strokeWidth={2.5} />
        {sparkOn && (
          <g>
            <circle cx={1} cy={HEAD_Y + 9} r={22} fill="#fff6c0" opacity={sparkGlow * 0.55} />
            <polyline
              points={`0,${HEAD_Y + 7} 5,${HEAD_Y + 10} 1,${HEAD_Y + 12} 7,${HEAD_Y + 16}`}
              fill="none"
              stroke="#ffffff"
              strokeWidth={2.5}
              opacity={sparkGlow}
            />
          </g>
        )}
      </g>
    </svg>
  );
};

const rad = (d: number) => (d * Math.PI) / 180;
