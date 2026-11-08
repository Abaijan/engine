import {interpolate, interpolateColors} from 'remotion';

/** Cylinder geometry in drawing units. The crankshaft axis is at (0, 0). */
export const R = 55; // crank radius (piston stroke = 2R)
export const L = 165; // connecting rod length
export const HEAD_Y = -262; // combustion chamber ceiling
export const BORE = 140; // cylinder bore

export const rad = (deg: number) => (deg * Math.PI) / 180;
export const mod = (v: number, m: number) => ((v % m) + m) % m;

/** Piston pin position. phi = 0 is top dead center. */
export const pinY = (phi: number) => {
  const t = rad(phi);
  return -(R * Math.cos(t) + Math.sqrt(L * L - R * R * Math.sin(t) ** 2));
};

export const crankPin = (phi: number) => {
  const t = rad(phi);
  return {x: R * Math.sin(t), y: -R * Math.cos(t)};
};

/** Gap between the piston and head, proportional to the volume above the piston. */
export const gap = (phi: number) => pinY(phi) - 30 - HEAD_Y;

// ---- Camshaft ----
export const CAM_BASE = 12;
export const CAM_LOBE = 14;

const wrapPi = (a: number) => mod(a + Math.PI, 2 * Math.PI) - Math.PI;

/** Cam radius in a direction offset from the lobe tip by angle a (radians). */
export const camRadius = (a: number) => {
  const w = wrapPi(a);
  if (Math.abs(w) >= Math.PI / 4) return CAM_BASE;
  return CAM_BASE + CAM_LOBE * Math.cos(2 * w);
};

/** Cam rotation angle relative to the tip pointing down. It turns at half crankshaft speed. */
export const camAngleDeg = (phi: number, kind: 'in' | 'ex') => {
  const mid = kind === 'in' ? 90 : 630;
  return (mod(phi, 720) - mid) / 2;
};

export const valveLift = (phi: number, kind: 'in' | 'ex') =>
  camRadius(rad(camAngleDeg(phi, kind))) - CAM_BASE;

export const camPath = () => {
  const pts: string[] = [];
  for (let d = 0; d < 360; d += 4) {
    const r = camRadius(rad(d));
    pts.push(`${(r * Math.sin(rad(d))).toFixed(2)},${(r * Math.cos(rad(d))).toFixed(2)}`);
  }
  return `M${pts.join('L')}Z`;
};

// ---- Strokes ----
export const strokeIndex = (phi: number) => Math.floor(mod(phi, 720) / 180);

export const gasColor = (phi: number) =>
  interpolateColors(
    mod(phi, 720),
    [0, 180, 330, 360, 368, 420, 540, 560, 720],
    [
      'rgba(92,200,255,0.12)',
      'rgba(92,200,255,0.55)',
      'rgba(255,210,74,0.75)',
      'rgba(255,210,74,0.9)',
      'rgba(255,248,214,0.95)',
      'rgba(255,106,61,0.75)',
      'rgba(255,106,61,0.45)',
      'rgba(169,180,199,0.55)',
      'rgba(169,180,199,0.18)',
    ],
  );

const smooth = (x: number, a: number, b: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Illustrative cylinder pressure in bar; this is a schematic, not a measurement. */
export const pressure = (phiIn: number) => {
  const phi = mod(phiIn, 720);
  const gBdc = gap(180);
  if (phi < 180) return 1.0;
  if (phi >= 540) {
    return 1.0 + 0.5 * (1 - smooth(phi, 540, 720));
  }
  const g = gap(phi);
  const base = 0.9 * Math.pow(gBdc / g, 1.35);
  const heat = 1 + 1.7 * smooth(phi, 350, 372) - 0.75 * smooth(phi, 372, 540);
  const blow = 1 - smooth(phi, 530, 545);
  return Math.max(1.0, base * heat * blow + 1.5 * (1 - blow));
};

export const flameRadius = (phi: number) =>
  interpolate(mod(phi, 720), [358, 470], [6, 150], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

export const flameOpacity = (phi: number) =>
  interpolate(mod(phi, 720), [358, 372, 470], [0, 0.95, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
