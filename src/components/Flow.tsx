import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {Glyph, GlyphId} from './Glyphs';

export interface FlowNode {
  label: string;
  glyph: GlyphId;
}

interface Props {
  nodes: FlowNode[];
  x0: number;
  x1: number;
  y: number;
  color: string;
  /** Row brightness: 1 is active; lower values are dimmed. */
  emph?: number;
  /** Return line below the row, used for closed loops. */
  loop?: boolean;
  title?: string;
  labelSize?: number;
}

const polyLength = (pts: [number, number][]) => {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  }
  return len;
};

const pointAt = (pts: [number, number][], d: number): [number, number] => {
  let rest = d;
  for (let i = 1; i < pts.length; i++) {
    const seg = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (rest <= seg) {
      const t = rest / seg;
      return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t];
    }
    rest -= seg;
  }
  return pts[pts.length - 1];
};

/** A row of nodes connected by a line along which flow particles travel. */
export const FlowRow: React.FC<Props> = ({nodes, x0, x1, y, color, emph = 1, loop = false, title, labelSize = 26}) => {
  const frame = useCurrentFrame();
  const n = nodes.length;
  const step = n > 1 ? (x1 - x0) / (n - 1) : 0;
  const cx = (i: number) => x0 + i * step;

  const pts: [number, number][] = nodes.map((_, i) => [cx(i), y]);
  if (loop) {
    pts.push([cx(n - 1), y + 150], [cx(0), y + 150], [cx(0), y]);
  }
  const length = polyLength(pts);
  const dotCount = Math.max(4, Math.round(length / 80));
  const dots = Array.from({length: dotCount}, (_, k) => {
    const d = (frame * 3 + (k * length) / dotCount) % length;
    return pointAt(pts, d);
  });

  return (
    <g opacity={0.25 + 0.75 * emph} style={{fontFamily: FONT}}>
      {title && (
        <text x={x0 - 60} y={y - 78} fill={color} fontSize={26} fontWeight={600}>
          {title}
        </text>
      )}
      <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={color} strokeWidth={4} opacity={0.4} />
      {dots.map(([dx, dy], k) => (
        <circle key={k} cx={dx} cy={dy} r={7} fill={color} style={{filter: `drop-shadow(0 0 6px ${color})`}} />
      ))}
      {nodes.map((nd, i) => (
        <g key={nd.label}>
          <circle cx={cx(i)} cy={y} r={58} fill={C.bgDeep} fillOpacity={0.72} stroke={color} strokeWidth={2} opacity={0.9} />
          <circle cx={cx(i)} cy={y} r={66} fill="none" stroke={color} strokeWidth={1} opacity={0.24} />
          <g transform={`translate(${cx(i)},${y}) scale(1.2)`}>
            <Glyph id={nd.glyph} cx={0} cy={0} color={C.ink} />
          </g>
          <text x={cx(i)} y={y + 86} textAnchor="middle" fill={C.ink} fontSize={labelSize} fontWeight={500}>
            {nd.label}
          </text>
        </g>
      ))}
    </g>
  );
};
