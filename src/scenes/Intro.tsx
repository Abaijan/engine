import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {Cylinder} from '../components/Cylinder';

/**
 * Opening scene. One continuous camera move, in three beats:
 *  1. Exterior: a driver walks up, opens the door and gets in. The camera pushes in on the driver.
 *  2. First person: the view crossfades into the driver's eyes, a hand turns the ignition key.
 *  3. The camera dives through the hood into the engine, which starts to turn.
 * Frame numbers are local to the scene (a 30 fps design clock; the parent sequence maps it to the 60 fps output, so values may be fractional).
 */
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.inOut(Easing.cubic);
const lin = (f: number, r: number[], o: number[]) => interpolate(f, r, o, clamp);
const smooth = (f: number, r: number[], o: number[]) => interpolate(f, r, o, {...clamp, easing: ease});
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
type P = [number, number];
const rotAbout = (p: P, c: P, deg: number): P => {
  const a = (deg * Math.PI) / 180;
  const dx = p[0] - c[0];
  const dy = p[1] - c[1];
  return [c[0] + dx * Math.cos(a) - dy * Math.sin(a), c[1] + dx * Math.sin(a) + dy * Math.cos(a)];
};

const Fill: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{position: 'absolute', inset: 0, ...style}}>{children}</div>
);

// ------------------------------------------------------------ 1. Exterior
const Exterior: React.FC<{frame: number}> = ({frame}) => {
  const approachX = lin(frame, [0, 115], [250, 625]);
  const walkingOpacity = lin(frame, [0, 20, 100, 125, 145], [0, 1, 1, 1, 0]);
  const doorAngle = lin(frame, [105, 155, 225, 270], [0, -58, -58, 0]);
  const enteringOpacity = lin(frame, [125, 160, 215, 245], [0, 1, 1, 0]);
  const enterX = lin(frame, [125, 240], [625, 805]);
  const enterY = lin(frame, [125, 240], [0, 62]);
  const seatedOpacity = lin(frame, [215, 250], [0, 1]);
  // Camera push-in on the driver's head.
  const s = smooth(frame, [165, 292], [1, 3.8]);
  const fx = smooth(frame, [165, 292], [960, 813]);
  const fy = smooth(frame, [165, 292], [540, 468]);
  const opacity = lin(frame, [286, 326], [1, 0]);
  if (frame > 330) return null;
  return (
    <Fill style={{opacity}}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        <defs>
          <linearGradient id="carPaint" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4775a8" />
            <stop offset="0.5" stopColor="#24466f" />
            <stop offset="1" stopColor="#142b49" />
          </linearGradient>
          <linearGradient id="windowGlass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#142b45" />
            <stop offset="1" stopColor="#345a80" />
          </linearGradient>
        </defs>
        <g transform={`translate(960 540) scale(${s}) translate(${-fx} ${-fy})`}>
          <ellipse cx="970" cy="855" rx="760" ry="40" fill="#020914" opacity="0.72" />
          <g filter="drop-shadow(0 26px 35px rgba(0,0,0,0.45))">
            <path d="M210 748 L254 655 Q293 619 427 593 L583 425 Q628 376 737 365 L1085 365 Q1145 369 1198 419 L1331 564 L1510 602 Q1582 624 1612 692 L1638 748 L1622 803 L235 803Z" fill="url(#carPaint)" stroke="#83a8d1" strokeWidth="8" />
            <path d="M475 585 L615 438 Q640 410 716 405 L845 405 L845 585Z" fill="url(#windowGlass)" stroke="#9bb8d7" strokeWidth="8" />
            <path d="M875 405 L1070 405 Q1117 409 1151 447 L1267 585 L875 585Z" fill="url(#windowGlass)" stroke="#9bb8d7" strokeWidth="8" />
            <path d="M847 402 L847 588 M1174 454 L1127 592" fill="none" stroke="#9bb8d7" strokeWidth="17" />
            <path d="M300 672 Q660 630 1328 661" fill="none" stroke="#c3d8ef" strokeWidth="5" opacity="0.42" />
            <path d="M1285 605 L1480 631 L1510 685 L1280 685Z" fill="#0c1a2a" stroke="#7896b8" strokeWidth="6" />
            <path d="M1280 637 L1465 652" fill="none" stroke="#81a6cf" strokeWidth="5" opacity="0.55" />
            <path d="M305 742 L1532 742" stroke="#b6cee9" strokeWidth="5" opacity="0.45" />
            <path d="M247 700 L335 688 L320 729 L230 735Z" fill="#ffc45c" opacity="0.9" />
            <path d="M1542 671 L1595 688 L1606 716 L1540 716Z" fill="#ff755f" opacity="0.8" />
            <circle cx="510" cy="775" r="102" fill="#08111d" stroke="#91acd0" strokeWidth="12" />
            <circle cx="510" cy="775" r="61" fill="#243c5c" stroke="#526e94" strokeWidth="9" />
            <circle cx="510" cy="775" r="21" fill="#a9c2df" />
            <circle cx="1370" cy="775" r="102" fill="#08111d" stroke="#91acd0" strokeWidth="12" />
            <circle cx="1370" cy="775" r="61" fill="#243c5c" stroke="#526e94" strokeWidth="9" />
            <circle cx="1370" cy="775" r="21" fill="#a9c2df" />
          </g>
          <path d="M744 628 Q790 604 839 630 L861 744 L716 744Z" fill="#182b43" stroke="#7894b5" strokeWidth="8" />
          <path d="M1110 625 Q1153 597 1200 626 L1226 744 L1084 744Z" fill="#182b43" stroke="#7894b5" strokeWidth="8" />
          <path d="M735 626 Q785 605 844 628 L831 650 L746 650Z" fill="#a9c1dd" opacity="0.68" />
          <path d="M1100 624 Q1153 601 1205 625 L1194 649 L1110 649Z" fill="#a9c1dd" opacity="0.68" />
          <path d="M1191 564 Q1224 552 1244 582 L1255 615" fill="none" stroke="#c6d9ee" strokeWidth="10" strokeLinecap="round" />
          <circle cx="1194" cy="559" r="31" fill="none" stroke="#c6d9ee" strokeWidth="10" />
          <path d="M1256 600 L1320 600" stroke="#c6d9ee" strokeWidth="8" strokeLinecap="round" />
          <g transform="rotate(0 700 730)">
            <path d="M700 488 L980 520 L1005 730 L700 730Z" fill="url(#carPaint)" stroke="#9bb8d7" strokeWidth="8" transform={`rotate(${doorAngle} 700 730)`} />
            <path d="M738 526 L941 550 L951 652 L738 642Z" fill="url(#windowGlass)" stroke="#9bb8d7" strokeWidth="6" transform={`rotate(${doorAngle} 700 730)`} />
            <path d="M710 680 L950 698" fill="none" stroke="#b8cee7" strokeWidth="5" opacity="0.65" transform={`rotate(${doorAngle} 700 730)`} />
            <path d="M888 672 L922 676" fill="none" stroke="#d7e4f5" strokeWidth="9" strokeLinecap="round" transform={`rotate(${doorAngle} 700 730)`} />
          </g>
          <g opacity={walkingOpacity} transform={`translate(${approachX} 0)`}>
            <circle cx="0" cy="394" r="39" fill="#d4e1f1" />
            <path d="M-39 437 Q0 418 34 442 L51 563 L-46 563Z" fill="#47739f" stroke="#a9c2dd" strokeWidth="5" />
            <path d="M-28 557 L-35 660 L-76 724 M30 557 L39 656 L78 718" fill="none" stroke="#c2d4e9" strokeWidth="22" strokeLinecap="round" />
            <path d="M-36 464 L-81 530 L-104 578 M31 463 L72 518 L88 563" fill="none" stroke="#d4e1f1" strokeWidth="17" strokeLinecap="round" />
            <path d="M-101 578 L-77 584 M84 563 L106 557" stroke="#ffc45c" strokeWidth="9" strokeLinecap="round" />
          </g>
          <g opacity={enteringOpacity} transform={`translate(${enterX} ${enterY}) rotate(-12 0 500)`}>
            <circle cx="0" cy="394" r="39" fill="#d4e1f1" />
            <path d="M-39 437 Q0 418 34 442 L51 563 L-46 563Z" fill="#47739f" stroke="#a9c2dd" strokeWidth="5" />
            <path d="M-36 470 L-80 528 L-92 587 M31 465 L75 510 L116 530" fill="none" stroke="#d4e1f1" strokeWidth="17" strokeLinecap="round" />
            <path d="M-34 557 L-16 632 L62 655 M25 557 L69 625 L131 635" fill="none" stroke="#c2d4e9" strokeWidth="22" strokeLinecap="round" />
          </g>
          <g opacity={seatedOpacity}>
            <circle cx="813" cy="456" r="38" fill="#d4e1f1" />
            <path d="M777 499 Q816 476 848 506 L874 609 L787 626Z" fill="#47739f" stroke="#a9c2dd" strokeWidth="5" />
            <path d="M795 605 L843 671 L978 674 M850 603 L911 652 L1002 657" fill="none" stroke="#c2d4e9" strokeWidth="22" strokeLinecap="round" />
            <path d="M789 522 Q900 545 1000 560" fill="none" stroke="#d4e1f1" strokeWidth="20" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    </Fill>
  );
};

// ------------------------------------------------------------ 2. First-person cockpit
const IGN: P = [1160, 805];
const KEY_R = 125;
const HAND_START: P = [1900, 1120];

const Gauge: React.FC<{cx: number; cy: number; r: number; f: number; labels: string[]; glow: number; accent: string}> = ({
  cx, cy, r, f, labels, glow, accent,
}) => {
  const n = labels.length - 1;
  const pt = (a: number, rr: number): P => [cx + Math.cos((a * Math.PI) / 180) * rr, cy + Math.sin((a * Math.PI) / 180) * rr];
  const [nx, ny] = pt(135 + 270 * f, r - 14);
  const [tx, ty] = pt(135 + 270 * f + 180, 14);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#050c16" stroke="#27456d" strokeWidth={6} />
      <g opacity={0.2 + 0.8 * glow}>
        {labels.map((l, i) => {
          const a = 135 + (270 * i) / n;
          const [x1, y1] = pt(a, r - 20);
          const [x2, y2] = pt(a, r - 8);
          const [lx, ly] = pt(a, r - 40);
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.ink} strokeWidth={3} />
              <text x={lx} y={ly + 6} textAnchor="middle" fontSize={16} fontWeight={600} fill={C.ink} fontFamily={FONT}>{l}</text>
            </g>
          );
        })}
        <line x1={tx} y1={ty} x2={nx} y2={ny} stroke={accent} strokeWidth={5} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={9} fill="#0c1a2a" stroke={accent} strokeWidth={3} />
      </g>
    </g>
  );
};

const Cockpit: React.FC<{frame: number}> = ({frame}) => {
  const lightsOn = lin(frame, [410, 426], [0, 1]);
  const reach = smooth(frame, [335, 395], [0, 1]);
  const retreat = smooth(frame, [470, 520], [0, 1]);
  const keyAngle = smooth(frame, [400, 418, 436, 450, 466], [0, 34, 34, 66, 58]);
  const tach = frame < 440 ? 0 : frame < 456
    ? smooth(frame, [440, 456], [0, 0.85])
    : smooth(frame, [456, 486], [0.85, 0.11]) + (frame > 486 ? 0.012 * Math.sin(frame * 1.9) : 0);
  const speedo = lin(frame, [418, 432, 450], [0, 1, 0]);
  const warn = lightsOn * (1 - lin(frame, [462, 482], [0, 1]));
  const check = lightsOn * (1 - lin(frame, [490, 510], [0, 1]));

  // Camera: settle after the crossfade, breathe, shake while cranking, then dive through the hood.
  const settle = smooth(frame, [285, 380], [1.18, 1]);
  const t = smooth(frame, [480, 590], [0, 1]);
  const scale = settle * Math.pow(7, t);
  const fx = lerp(960, 1150, t);
  const fy = lerp(540, 430, t);
  const amp = lin(frame, [440, 470, 520], [3, 1.4, 0.5]) * (frame >= 440 ? 1 : 0);
  const dx = 3 * Math.sin(frame / 25) + amp * Math.sin(frame * 2.7);
  const dy = 2 * Math.cos(frame / 31) + amp * Math.cos(frame * 3.3);
  const opacity = lin(frame, [284, 330, 545, 590], [0, 1, 1, 0]);
  if (frame < 280 || frame > 595) return null;

  const keyB = rotAbout([IGN[0] + KEY_R, IGN[1]], IGN, keyAngle);
  const handBase: P = [lerp(HAND_START[0], IGN[0] + KEY_R, reach), lerp(HAND_START[1], IGN[1], reach)];
  const handRot = rotAbout(handBase, IGN, keyAngle);
  const handB: P = [lerp(handRot[0], HAND_START[0], retreat), lerp(handRot[1], HAND_START[1], retreat)];
  const showHand = frame > 330 && retreat < 1;
  const wrist = (p: P, a: number): P => rotAbout([p[0] + 215, p[1] + 110], p, a);
  const wr = wrist(handB, keyAngle);

  return (
    <Fill style={{opacity}}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        <defs>
          <linearGradient id="povSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0d2038" />
            <stop offset="1" stopColor="#3b6288" />
          </linearGradient>
          <linearGradient id="povGround" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1b2f46" />
            <stop offset="1" stopColor="#0a1523" />
          </linearGradient>
          <linearGradient id="povHood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4d7fb3" />
            <stop offset="1" stopColor="#1f3e66" />
          </linearGradient>
          <linearGradient id="povDash" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a2f4b" />
            <stop offset="1" stopColor="#07101c" />
          </linearGradient>
          <linearGradient id="povKey" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f4f8ff" />
            <stop offset="0.5" stopColor="#8fa9c8" />
            <stop offset="1" stopColor="#dce8f8" />
          </linearGradient>
          <radialGradient id="povIgnGlow">
            <stop offset="0" stopColor="#ffc45c" stopOpacity="0.6" />
            <stop offset="1" stopColor="#ffc45c" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g transform={`translate(${960 + dx} ${540 + dy}) scale(${scale}) translate(${-fx} ${-fy})`}>
          {/* world through the windshield */}
          <rect x={-200} y={-200} width={2320} height={560} fill="url(#povSky)" />
          <rect x={-200} y={340} width={2320} height={400} fill="url(#povGround)" />
          <path d="M1000 340 L1650 560 L300 560Z" fill="#0f1d2e" opacity={0.9} />
          <path d="M1000 345 L1000 372 M1000 392 L1000 430 M1000 452 L1000 520" stroke="#7f9cc0" strokeWidth={5} opacity={0.5} />
          {[120, 260, 380, 1500, 1640, 1760].map((x, i) => (
            <rect key={x} x={x} y={250 - (i % 3) * 38} width={90 + (i % 2) * 30} height={90 + (i % 3) * 38} fill="#0a1626" stroke="#1d3a5c" strokeWidth={3} />
          ))}
          {/* hood */}
          <path d="M820 410 L1480 410 L1760 540 L560 540Z" fill="url(#povHood)" stroke="#9bb8d7" strokeWidth={5} />
          <path d="M1010 414 L940 540 M1290 414 L1360 540" fill="none" stroke="#c3d8ef" strokeWidth={4} opacity={0.4} />
          <path d="M360 540 L980 478" fill="none" stroke="#08121f" strokeWidth={9} strokeLinecap="round" />
          {/* roof, pillars, mirror */}
          <path d="M-20 -20 H1940 V60 Q960 130 -20 60Z" fill="#0b1829" />
          <path d="M-20 0 L320 0 L130 540 L-20 580Z" fill="#08121f" stroke="#1d3555" strokeWidth={4} />
          <path d="M1600 0 L1940 0 L1940 580 L1790 540Z" fill="#08121f" stroke="#1d3555" strokeWidth={4} />
          <path d="M1015 100 L1015 125" stroke="#0a1422" strokeWidth={14} />
          <rect x={930} y={120} width={210} height={62} rx={16} fill="#0a1422" stroke="#27456d" strokeWidth={4} />
          <rect x={942} y={130} width={186} height={42} rx={10} fill="#173250" opacity={0.7} />
          {/* dashboard */}
          <path d="M-20 565 Q960 495 1940 548 V1100 H-20Z" fill="url(#povDash)" stroke="#2a456b" strokeWidth={4} />
          <rect x={1330} y={585} width={330} height={190} rx={18} fill="#050c16" stroke="#223b5c" strokeWidth={5} />
          <rect x={1344} y={599} width={302} height={162} rx={10} fill="#16466f" opacity={0.15 + 0.55 * lightsOn} />
          <path d="M1370 700 Q1440 650 1510 690 T1620 660" fill="none" stroke={C.intake} strokeWidth={5} opacity={lightsOn} />
          {[810, 830, 850].map((y) => (
            <rect key={y} x={1360} y={y} width={270} height={9} rx={4} fill="#050c16" stroke="#1d3555" strokeWidth={2} />
          ))}
          {/* instrument cluster */}
          <rect x={470} y={555} width={660} height={190} rx={40} fill="#060e19" stroke="#1d3555" strokeWidth={5} />
          <Gauge cx={640} cy={650} r={82} f={speedo} glow={lightsOn} accent={C.intake} labels={['0', '40', '80', '120', '160', '200', '240']} />
          <Gauge cx={960} cy={650} r={82} f={tach} glow={lightsOn} accent={C.power} labels={['0', '1', '2', '3', '4', '5', '6', '7', '8']} />
          <g opacity={warn}>
            <rect x={752} y={610} width={44} height={26} rx={4} fill="none" stroke="#ff5d4a" strokeWidth={4} />
            <rect x={758} y={602} width={8} height={8} fill="#ff5d4a" />
            <rect x={782} y={602} width={8} height={8} fill="#ff5d4a" />
            <ellipse cx={826} cy={626} rx={24} ry={11} fill="none" stroke={C.oil} strokeWidth={4} />
            <path d="M850 626 L868 640" stroke={C.oil} strokeWidth={4} strokeLinecap="round" />
          </g>
          <g opacity={check}>
            <rect x={780} y={668} width={50} height={28} rx={5} fill="none" stroke={C.oil} strokeWidth={4} />
            <path d="M792 668 V660 H818 V668 M772 676 V690 M838 676 V690" fill="none" stroke={C.oil} strokeWidth={4} />
          </g>
          {/* steering wheel */}
          <g>
            <path d="M800 1000 L430 945 M800 1000 L1170 945" fill="none" stroke="#0f2036" strokeWidth={62} strokeLinecap="round" />
            <ellipse cx={800} cy={1000} rx={420} ry={285} fill="none" stroke="#08121f" strokeWidth={48} />
            <ellipse cx={800} cy={1000} rx={420} ry={285} fill="none" stroke="#3a5578" strokeWidth={4} opacity={0.7} transform="translate(0 -22)" />
            <ellipse cx={800} cy={1000} rx={95} ry={62} fill="#0a1626" stroke="#2a456b" strokeWidth={5} />
            <circle cx={800} cy={998} r={22} fill="none" stroke="#6f8fb8" strokeWidth={4} />
          </g>
          {/* ignition */}
          <circle cx={IGN[0]} cy={IGN[1]} r={110} fill="url(#povIgnGlow)" opacity={lightsOn * 0.9} />
          <circle cx={IGN[0]} cy={IGN[1]} r={40} fill="#050b14" stroke="#2f4d78" strokeWidth={6} />
          <circle cx={IGN[0]} cy={IGN[1]} r={26} fill="#0a1626" stroke="#6f8fb8" strokeWidth={3} />
          {/* key */}
          <line x1={IGN[0]} y1={IGN[1]} x2={keyB[0]} y2={keyB[1]} stroke="url(#povKey)" strokeWidth={14} strokeLinecap="round" />
          <circle cx={keyB[0]} cy={keyB[1]} r={32} fill="none" stroke="url(#povKey)" strokeWidth={12} />
          {/* hand and sleeve */}
          {showHand && (
            <g>
              <path d={`M1980 1240 L${wr[0]} ${wr[1]}`} stroke="#47739f" strokeWidth={130} strokeLinecap="butt" fill="none" />
              <path d={`M${wr[0]} ${wr[1]} L${handB[0] + 85} ${handB[1] + 50}`} stroke="#d4e1f1" strokeWidth={66} strokeLinecap="round" fill="none" />
              <g transform={`translate(${handB[0]} ${handB[1]}) rotate(${keyAngle})`}>
                <ellipse cx={85} cy={50} rx={62} ry={46} fill="#d4e1f1" stroke="#a9c2dd" strokeWidth={4} transform="rotate(20 85 50)" />
                <path d="M62 36 L10 -6" stroke="#d4e1f1" strokeWidth={26} strokeLinecap="round" />
                <path d="M64 66 L14 26" stroke="#c2d4e9" strokeWidth={26} strokeLinecap="round" />
                <path d="M96 6 L128 20 M108 32 L136 44 M104 56 L128 70" stroke="#c2d4e9" strokeWidth={22} strokeLinecap="round" />
              </g>
            </g>
          )}
        </g>
      </svg>
      <Fill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 52%, rgba(0,0,0,0.55) 100%)'}}>{null}</Fill>
    </Fill>
  );
};

// ------------------------------------------------------------ 3. Intro scene
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const engineOpacity = lin(frame, [530, 595], [0, 1]);
  const engineScale = smooth(frame, [520, 630], [1.5, 1]);
  const flash = lin(frame, [510, 555, 600], [0, 0.7, 0]);
  return (
    <Fill>
      <div style={{position: 'absolute', inset: 0, opacity: engineOpacity, background: 'radial-gradient(ellipse at 73% 45%, rgba(84,163,234,0.22), transparent 48%)'}} />
      <div style={{position: 'absolute', left: 860, top: -85, opacity: engineOpacity, transform: `scale(${engineScale})`, transformOrigin: '450px 545px'}}>
        <Cylinder phi={Math.max(0, frame - 520) * 5} width={900} />
      </div>
      <Exterior frame={frame} />
      <Cockpit frame={frame} />
      <Fill style={{opacity: flash, background: 'radial-gradient(circle at 50% 50%, rgba(255,196,92,0.9), rgba(255,196,92,0) 60%)', pointerEvents: 'none'}}>{null}</Fill>
    </Fill>
  );
};
