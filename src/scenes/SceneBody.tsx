import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, STROKE_COLORS, STROKE_NAMES} from '../theme';
import {Scene} from '../script';
import {PARTS} from '../parts';
import {Cylinder} from '../components/Cylinder';
import {Intro} from './Intro';
import {FlowRow} from '../components/Flow';
import {Glyph, GlyphId} from '../components/Glyphs';
import {
  BORE, HEAD_Y, L, R, crankPin, flameOpacity, flameRadius, gasColor, mod, pinY,
  rad, strokeIndex, valveLift,
} from '../kinematics';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Scene progress from 0 to 1. */
const useProgress = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return frame / durationInFrames;
};

const Fill: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{position: 'absolute', inset: 0}}>{children}</div>
);

// ------------------------------------------------------------ The big idea
const Idea: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useProgress();
  const stages = [
    {label: 'FUEL', color: C.oil},
    {label: 'HEAT', color: C.power},
    {label: 'PRESSURE', color: C.compress},
    {label: 'MOTION', color: C.intake},
  ];
  const active = Math.min(stages.length - 1, Math.floor(p * stages.length));
  return (
    <Fill>
      <div style={{position: 'absolute', left: 170, top: -40, filter: 'drop-shadow(0 0 42px rgba(65,153,232,0.15))'}}>
        <Cylinder phi={frame * 3.4} width={760} />
      </div>
      <div style={{position: 'absolute', right: 145, top: 320, width: 600, display: 'flex', flexDirection: 'column', gap: 32}}>
        {stages.map((stage, i) => (
          <div key={stage.label} style={{display: 'flex', alignItems: 'center', gap: 24, opacity: i <= active ? 1 : 0.3}}>
            <div style={{width: 58, height: 4, background: stage.color, boxShadow: i === active ? `0 0 22px ${stage.color}` : 'none'}} />
            <div style={{fontSize: 52, fontWeight: 700, letterSpacing: 4, color: stage.color}}>{stage.label}</div>
            {i < stages.length - 1 && <div style={{position: 'absolute', right: 300, top: 73 + i * 84, fontSize: 34, color: C.inkDim}}>↓</div>}
          </div>
        ))}
        <div style={{position: 'absolute', right: 26, top: 55, transform: `rotate(${frame * 3}deg)`, opacity: 0.8}}>
          <svg width={230} height={230} viewBox="0 0 230 230">
            <circle cx={115} cy={115} r={84} fill="none" stroke={C.intake} strokeWidth={5} opacity={0.65} />
            <line x1={115} y1={31} x2={115} y2={199} stroke={C.intake} strokeWidth={4} opacity={0.6} />
            <circle cx={115} cy={115} r={11} fill={C.hi} />
          </svg>
        </div>
      </div>
    </Fill>
  );
};

// ----------------------------------------------------------------- Anatomy
const Anatomy: React.FC<{scene: Scene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const p = useProgress();
  const ids = scene.highlights ?? [];
  const idx = Math.min(ids.length - 1, Math.floor(p * ids.length));
  const info = PARTS[ids[idx]];
  return (
    <Fill>
      <div style={{position: 'absolute', left: 520, top: -100, filter: 'drop-shadow(0 0 35px rgba(83,165,237,0.16))'}}>
        <Cylinder phi={frame * 1.8 + 60} highlight={[ids[idx]]} width={880} />
      </div>
      <div style={{position: 'absolute', left: 120, bottom: 140, maxWidth: 380, opacity: interpolate(p, [0, 0.06, 0.9, 1], [0, 1, 1, 0.7], clamp)}}>
        <div style={{width: 74, height: 5, background: C.intake, marginBottom: 22, boxShadow: `0 0 20px ${C.intake}`}} />
        <div style={{fontSize: 54, fontWeight: 700, lineHeight: 1.05}}>{info.name}</div>
        <div style={{fontSize: 27, color: C.inkDim, lineHeight: 1.35, marginTop: 20}}>{info.role}</div>
      </div>
    </Fill>
  );
};

// ------------------------------------------------------------------- Strokes
const StrokeView: React.FC<{scene: Scene}> = ({scene}) => {
  const frame = useCurrentFrame();
  let phi: number;
  if (scene.kind === 'stroke' && scene.stroke !== undefined) {
    // The selected stroke runs slowly (8 s); the other three run quickly (6 s).
    const s = scene.stroke * 180;
    const u = frame % 420;
    phi = u < 240 ? s + 180 * (u / 240) : s + 180 + 540 * ((u - 240) / 180);
  } else {
    phi = frame * (720 / 420);
  }
  const cur = strokeIndex(phi);
  const active = scene.kind === 'stroke' && scene.stroke !== undefined ? scene.stroke : cur;
  return (
    <Fill>
      <div style={{position: 'absolute', left: 500, top: -50, filter: `drop-shadow(0 0 30px ${STROKE_COLORS[active]}44)`}}>
        <Cylinder phi={phi} width={850} />
      </div>
      <div style={{position: 'absolute', left: 110, top: 250, width: 440}}>
        <div style={{fontSize: 26, color: C.inkDim, letterSpacing: 4, marginBottom: 18}}>
          {scene.kind === 'stroke' ? `STROKE ${active + 1} / 4` : 'THE CYCLE'}
        </div>
        <div style={{fontSize: 66, fontWeight: 700, color: STROKE_COLORS[active], lineHeight: 1.05}}>
          {STROKE_NAMES[active]}
        </div>
        <svg width={370} height={76} viewBox="0 0 370 76" style={{marginTop: 34}}>
          {STROKE_COLORS.map((color, i) => (
            <g key={color}>
              <rect x={i * 94} y={12} width={78} height={8} rx={4} fill={color} opacity={i === active ? 1 : 0.25} />
              <circle cx={i * 94 + 39} cy={45} r={i === active ? 12 : 7} fill={color} opacity={i === active ? 1 : 0.35} />
            </g>
          ))}
        </svg>
      </div>
    </Fill>
  );
};

// ------------------------------------------------------------ Multiple cylinders
const MiniCylinders: React.FC<{phi: number}> = ({phi}) => {
  // Firing order 1-3-4-2: offset the operating cycle of each cylinder.
  const offsets = [360, 540, 180, 0];
  return (
    <svg width={1480} height={696} viewBox="0 -300 1000 470">
      <line x1={40} y1={0} x2={960} y2={0} stroke={C.steelLight} strokeWidth={10} opacity={0.5} />
      {offsets.map((off, i) => {
        const ph = mod(phi + off, 720);
        const cx = 130 + 247 * i;
        const py = pinY(ph);
        const pt = py - 30;
        const cp = crankPin(ph);
        const gasH = Math.max(0, pt - HEAD_Y);
        const power = ph >= 360 && ph < 540;
        const si = strokeIndex(ph);
        return (
          <g key={i} transform={`translate(${cx},0)`}>
            <rect x={-BORE / 2 - 14} y={HEAD_Y - 14} width={BORE + 28} height={-75 - HEAD_Y + 14} fill={C.steelDark} stroke={C.steelLight} strokeWidth={2} />
            <rect x={-BORE / 2} y={HEAD_Y} width={BORE} height={-75 - HEAD_Y} fill="#06142b" />
            <clipPath id={`mc${i}`}>
              <rect x={-BORE / 2} y={HEAD_Y} width={BORE} height={gasH} />
            </clipPath>
            <g clipPath={`url(#mc${i})`}>
              <rect x={-BORE / 2} y={HEAD_Y} width={BORE} height={gasH} fill={gasColor(ph)} />
              <circle cx={0} cy={HEAD_Y + 12} r={flameRadius(ph)} fill={C.power} opacity={flameOpacity(ph) * 0.8} />
            </g>
            <line x1={0} y1={py} x2={cp.x} y2={cp.y} stroke="#cfe0fb" strokeWidth={12} strokeLinecap="round" />
            <rect x={-BORE / 2 + 4} y={pt} width={BORE - 8} height={55} rx={5} fill="#e9f1ff" stroke="#6f93c9" strokeWidth={2} />
            <circle cx={0} cy={0} r={13} fill={C.steelLight} />
            <line x1={0} y1={0} x2={cp.x} y2={cp.y} stroke={C.steelLight} strokeWidth={16} strokeLinecap="round" />
            <circle cx={cp.x} cy={cp.y} r={10} fill={C.hi} />
            <text x={0} y={70} textAnchor="middle" fontSize={34} fontWeight={700} fill={power ? C.power : C.ink}>
              Cylinder {i + 1}
            </text>
            <text x={0} y={110} textAnchor="middle" fontSize={28} fill={STROKE_COLORS[si]} fontWeight={600}>
              {STROKE_NAMES[si]}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

interface Bank {
  a: number;
  off: number;
}

const Schematic: React.FC<{cx: number; banks: Bank[]; phi: number; title: string; note: string}> = ({cx, banks, phi, title, note}) => {
  const r = 18;
  const l = 70;
  return (
    <g transform={`translate(${cx},330)`}>
      <circle r={30} fill={C.steelDark} stroke={C.steelLight} strokeWidth={3} />
      {banks.map((b, i) => {
        const th = phi + b.off;
        const a = rad(b.a);
        const pa = rad(th) - a;
        const s = r * Math.cos(pa) + Math.sqrt(l * l - r * r * Math.sin(pa) ** 2);
        const ux = Math.sin(a);
        const uy = -Math.cos(a);
        const pin = {x: r * Math.sin(rad(th)), y: -r * Math.cos(rad(th))};
        const px = ux * s;
        const py = uy * s;
        return (
          <g key={i}>
            <g transform={`rotate(${b.a})`}>
              <rect x={-26} y={-170} width={52} height={134} fill="none" stroke={C.steelLight} strokeWidth={3} />
              <line x1={-30} y1={-170} x2={30} y2={-170} stroke={C.steelLight} strokeWidth={8} />
            </g>
            <line x1={pin.x} y1={pin.y} x2={px} y2={py} stroke="#cfe0fb" strokeWidth={6} />
            <g transform={`translate(${ux * (s + 12)},${uy * (s + 12)}) rotate(${b.a})`}>
              <rect x={-24} y={-9} width={48} height={18} rx={3} fill="#e9f1ff" />
            </g>
            <circle cx={pin.x} cy={pin.y} r={6} fill={C.hi} />
          </g>
        );
      })}
      <text y={110} textAnchor="middle" fontSize={34} fontWeight={700} fill={C.ink}>{title}</text>
      <text y={150} textAnchor="middle" fontSize={26} fill={C.inkDim}>{note}</text>
    </g>
  );
};

const Multi: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useProgress();
  const phi = frame * (720 / 300);
  const first = interpolate(p, [0.5, 0.56], [1, 0], clamp);
  const second = interpolate(p, [0.54, 0.6], [0, 1], clamp);
  const order = [0, 2, 3, 1];
  const offsets = [360, 540, 180, 0];
  const power = offsets.findIndex((o) => {
    const ph = mod(phi + o, 720);
    return ph >= 360 && ph < 540;
  });
  return (
    <Fill>
      <div style={{position: 'absolute', left: 180, top: 160, opacity: first, filter: 'drop-shadow(0 0 24px rgba(83,165,237,0.12))'}}>
        <MiniCylinders phi={phi} />
        <div style={{fontSize: 34, marginTop: -4, display: 'flex', gap: 18, alignItems: 'center'}}>
          <span style={{color: C.inkDim}}>Firing order:</span>
          {order.map((n, i) => (
            <React.Fragment key={n}>
              <span style={{fontWeight: 700, color: power === n ? C.power : C.ink, fontSize: 56}}>{n + 1}</span>
              {i < 3 && <span style={{color: C.inkDim}}>–</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, top: 80, opacity: second}}>
        <svg width={1920} height={520}>
          <Schematic cx={330} banks={[{a: 0, off: 0}]} phi={phi / 2} title="Inline" note="simple and inexpensive" />
          <Schematic cx={960} banks={[{a: -30, off: 0}, {a: 30, off: 0}]} phi={phi / 2} title="V engine" note="shorter and more compact" />
          <Schematic cx={1590} banks={[{a: -90, off: 0}, {a: 90, off: 180}]} phi={phi / 2} title="Boxer" note="low center of gravity" />
        </svg>
      </div>
    </Fill>
  );
};

// ------------------------------------------------ Fuel, lubrication, exhaust, and more
const Fuel: React.FC = () => {
  const p = useProgress();
  const e = (a: number, b: number) => (p >= a && p < b ? 1 : 0);
  return (
    <Fill>
      <svg width={1920} height={1080}>
        <FlowRow
          title="Fuel"
          x0={260}
          x1={1660}
          y={250}
          color={C.oil}
          emph={e(0, 0.3)}
          nodes={[
            {label: 'Tank', glyph: 'tank'},
            {label: 'Pump', glyph: 'pump'},
            {label: 'Filter', glyph: 'filter'},
            {label: 'Fuel rail', glyph: 'rail'},
            {label: 'Injectors', glyph: 'cyl'},
          ]}
        />
        <FlowRow
          title="Air"
          x0={260}
          x1={1660}
          y={490}
          color={C.intake}
          emph={e(0.3, 0.5)}
          nodes={[
            {label: 'Air filter', glyph: 'airbox'},
            {label: 'Throttle', glyph: 'throttle'},
            {label: 'Intake manifold', glyph: 'manifold'},
            {label: 'Cylinders', glyph: 'cyl'},
          ]}
          labelSize={24}
        />
        <FlowRow
          title="Control and ignition"
          x0={260}
          x1={1660}
          y={730}
          color={C.compress}
          emph={e(0.5, 1)}
          nodes={[
            {label: 'Sensors', glyph: 'sensor'},
            {label: 'Control unit', glyph: 'ecu'},
            {label: 'Ignition coil', glyph: 'coil'},
            {label: 'Spark plug', glyph: 'plug'},
          ]}
        />
      </svg>
    </Fill>
  );
};

const Lube: React.FC = () => {
  const p = useProgress();
  const oil = p < 0.45 ? 1 : 0;
  const cool = 1 - oil;
  const bars = interpolate(p, [0.7, 0.78], [0, 1], clamp);
  return (
    <Fill>
      <svg width={1920} height={1080}>
        <FlowRow
          title="Lubrication"
          x0={180}
          x1={820}
          y={330}
          color={C.oil}
          emph={oil}
          loop
          labelSize={24}
          nodes={[
            {label: 'Oil pan', glyph: 'oilpan'},
            {label: 'Pump', glyph: 'pump'},
            {label: 'Filter', glyph: 'filter'},
            {label: 'Bearings', glyph: 'bearings'},
          ]}
        />
        <FlowRow
          title="Cooling"
          x0={1100}
          x1={1740}
          y={330}
          color={C.coolant}
          emph={cool}
          loop
          labelSize={24}
          nodes={[
            {label: 'Pump', glyph: 'pump'},
            {label: 'Cooling jacket', glyph: 'jacket'},
            {label: 'Thermostat', glyph: 'thermostat'},
            {label: 'Radiator', glyph: 'radiator'},
          ]}
        />
        <g opacity={bars} style={{fontFamily: FONT}}>
          <text x={1040} y={640} fontSize={30} fill={C.inkDim} textAnchor="middle">Where the fuel’s energy goes</text>
          {[
            {t: 'Motion', c: C.intake},
            {t: 'Exhaust', c: C.exhaust},
            {t: 'Heat to be removed', c: C.power},
          ].map((b, i) => (
            <g key={b.t}>
              <rect x={440 + i * 400} y={670} width={380} height={46} fill={b.c} opacity={0.85} />
              <text x={630 + i * 400} y={760} fontSize={28} fill={C.ink} textAnchor="middle">≈ ⅓ · {b.t}</text>
            </g>
          ))}
          <text x={1740} y={500} fontSize={60} fontWeight={700} fill={C.coolant} textAnchor="end">≈ 90 °C</text>
        </g>
      </svg>
    </Fill>
  );
};

const Exhaust: React.FC = () => {
  const p = useProgress();
  const react = interpolate(p, [0.4, 0.5], [0, 1], clamp);
  const hum = interpolate(p, [0.78, 0.86], [0, 1], clamp);
  return (
    <Fill>
      <svg width={1920} height={1080}>
        <FlowRow
          title="Exhaust gas path"
          x0={260}
          x1={1660}
          y={290}
          color={C.exhaust}
          nodes={[
            {label: 'Cylinders', glyph: 'cyl'},
            {label: 'Exhaust manifold', glyph: 'exmanifold'},
            {label: 'Catalytic converter', glyph: 'cat'},
            {label: 'Muffler', glyph: 'muffler'},
          ]}
        />
        <g opacity={react} style={{fontFamily: FONT}}>
          <text x={960} y={540} fontSize={32} fill={C.inkDim} textAnchor="middle">What the catalytic converter does</text>
          <text x={560} y={640} fontSize={50} fill={C.power} textAnchor="middle" fontWeight={600}>CO · CH · NOx</text>
          <text x={960} y={640} fontSize={60} fill={C.ink} textAnchor="middle">›</text>
          <text x={1360} y={640} fontSize={50} fill={C.intake} textAnchor="middle" fontWeight={600}>CO₂ · H₂O · N₂</text>
          <text x={560} y={690} fontSize={26} fill={C.inkDim} textAnchor="middle">carbon monoxide, hydrocarbons, nitrogen oxides</text>
          <text x={1360} y={690} fontSize={26} fill={C.inkDim} textAnchor="middle">carbon dioxide, water, nitrogen</text>
        </g>
        <g opacity={hum} style={{fontFamily: FONT}}>
          <text x={1500} y={440} fontSize={34} fill={C.ink} textAnchor="middle">Loud bang → steady hum</text>
        </g>
      </svg>
    </Fill>
  );
};

const Other: React.FC = () => {
  const p = useProgress();
  const idx = Math.min(2, Math.floor(p * 3));
  const cards: {t: string; big: string; s: string; g: GlyphId; c: string}[] = [
    {t: 'Diesel', big: '20 : 1', s: 'Only air is compressed. It gets so hot that fuel ignites on its own, without a spark plug.', g: 'cyl', c: C.compress},
    {t: 'Turbocharging', big: 'more air', s: 'Exhaust spins a turbine; a compressor on the same shaft forces more air into the cylinders.', g: 'turbo', c: C.exhaust},
    {t: 'Hybrid', big: 'engine + motor', s: 'An electric motor helps during acceleration, letting the engine run more efficiently.', g: 'motor', c: C.intake},
  ];
  const active = cards[idx];
  return (
    <Fill>
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 68% 48%, ${active.c}22, transparent 38%)`}} />
      <div style={{position: 'absolute', left: 170, top: 220, color: active.c}}>
        <div style={{fontSize: 28, letterSpacing: 5, opacity: 0.8}}>ALTERNATIVE POWERTRAINS</div>
        <div style={{fontSize: 84, fontWeight: 700, marginTop: 20}}>{active.t}</div>
        <div style={{fontSize: 112, fontWeight: 700, marginTop: 22, color: C.ink}}>{active.big}</div>
        <div style={{fontSize: 34, color: C.inkDim, marginTop: 30, width: 690, lineHeight: 1.4}}>{active.s}</div>
        <div style={{display: 'flex', gap: 16, marginTop: 46}}>
          {cards.map((card, i) => (
            <div key={card.t} style={{width: 90, height: 5, background: i === idx ? card.c : C.inkDim, opacity: i === idx ? 1 : 0.25}} />
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', right: 180, top: 285, transform: `scale(3.2)`, filter: `drop-shadow(0 0 18px ${active.c}66)`}}>
        {active.g === 'motor' ? (
          <svg width={390} height={120} viewBox="0 0 390 120">
            <Glyph id="engine" cx={105} cy={58} color={C.ink} />
            <text x={195} y={72} fontSize={45} fill={C.inkDim} textAnchor="middle">+</text>
            <Glyph id="motor" cx={285} cy={58} color={C.ink} />
          </svg>
        ) : (
          <svg width={160} height={150} viewBox="-80 -75 160 150">
            <Glyph id={active.g} cx={0} cy={0} color={C.ink} />
          </svg>
        )}
      </div>
    </Fill>
  );
};

const Numbers: React.FC = () => {
  const p = useProgress();
  const items = [
    {n: '10 : 1', s: 'compression ratio', c: C.compress},
    {n: '1,000 / min', s: 'power strokes per cylinder at 2,000 rpm', c: C.intake},
    {n: '2,000 °C', s: 'peak gas temperature', c: C.power},
    {n: '90 °C', s: 'coolant operating temperature', c: C.coolant},
    {n: '14.5 : 1', s: 'air-to-fuel ratio by mass', c: C.oil},
    {n: '⅓', s: 'of fuel energy becomes motion', c: C.hi},
  ];
  const active = Math.min(items.length - 1, Math.floor(p * items.length));
  const item = items[active];
  return (
    <Fill>
      <div style={{position: 'absolute', left: 120, top: 245, width: 890}}>
        <div style={{height: 5, width: 100, background: item.c, boxShadow: `0 0 24px ${item.c}`}} />
        <div style={{fontSize: 124, fontWeight: 700, color: item.c, marginTop: 28, letterSpacing: -4}}>{item.n}</div>
        <div style={{fontSize: 40, color: C.ink, marginTop: 14}}>{item.s}</div>
        <div style={{display: 'flex', gap: 20, marginTop: 66}}>
          {items.map((it, i) => (
            <div key={it.n} style={{height: 7, flex: 1, background: it.c, opacity: i === active ? 1 : 0.24, boxShadow: i === active ? `0 0 16px ${it.c}` : 'none'}} />
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', right: 150, top: 120, opacity: 0.72}}>
        <Cylinder phi={useCurrentFrame() * 2.4} width={650} />
      </div>
    </Fill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useProgress();
  const phi = frame * 4;
  const cur = strokeIndex(phi);
  const thanks = interpolate(p, [0.82, 0.94], [0, 1], clamp);
  return (
    <Fill>
      <div style={{position: 'absolute', left: 530, top: -90, filter: 'drop-shadow(0 0 36px rgba(83,165,237,0.18))'}}>
        <Cylinder phi={phi} width={880} />
      </div>
      <div style={{position: 'absolute', left: 150, top: 420}}>
        <div style={{fontSize: 24, letterSpacing: 5, color: C.inkDim, marginBottom: 18}}>THE CYCLE</div>
        <div style={{fontSize: 64, fontWeight: 700, color: STROKE_COLORS[cur]}}>{STROKE_NAMES[cur]}</div>
        <svg width={300} height={22} style={{marginTop: 20}}>
          <circle cx={12} cy={11} r={8} fill={STROKE_COLORS[cur]} />
          <line x1={12} y1={11} x2={290} y2={11} stroke={STROKE_COLORS[cur]} strokeWidth={3} opacity={0.45} />
          <circle cx={290} cy={11} r={6} fill={C.inkDim} />
        </svg>
      </div>
      <div style={{position: 'absolute', right: 120, bottom: 86, fontSize: 34, letterSpacing: 3, fontWeight: 600, color: C.inkDim, opacity: thanks}}>
        Thanks for watching!
      </div>
    </Fill>
  );
};

export const SceneBody: React.FC<{scene: Scene}> = ({scene}) => {
  switch (scene.kind) {
    case 'intro': return <Intro />;
    case 'idea': return <Idea />;
    case 'anatomy': return <Anatomy scene={scene} />;
    case 'cycle':
    case 'stroke': return <StrokeView scene={scene} />;
    case 'multi': return <Multi />;
    case 'fuel': return <Fuel />;
    case 'lube': return <Lube />;
    case 'exhaust': return <Exhaust />;
    case 'other': return <Other />;
    case 'numbers': return <Numbers />;
    case 'outro': return <Outro />;
  }
};
