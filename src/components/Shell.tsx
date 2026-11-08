import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT, H, W} from '../theme';
import {Scene} from '../script';

export const Background: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 62% 42%, #17395b 0%, #0b1d32 48%, #050a12 100%)'}}>
    <svg width={W} height={H}>
      <defs>
        <pattern id="gridMinor" width={40} height={40} patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke={C.grid} strokeWidth={1} opacity={0.35} />
        </pattern>
        <pattern id="gridMajor" width={200} height={200} patternUnits="userSpaceOnUse">
          <path d="M200 0H0V200" fill="none" stroke={C.gridMajor} strokeWidth={1.5} opacity={0.35} />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#gridMinor)" />
      <rect width={W} height={H} fill="url(#gridMajor)" />
    </svg>
  </AbsoluteFill>
);

export const Shell: React.FC<{scene: Scene; children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{fontFamily: FONT, color: C.ink}}>
    <Background />
    {children}
  </AbsoluteFill>
);

export const ProgressBar: React.FC<{total: number}> = ({total}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 0, bottom: 0, height: 6, width: W, background: 'rgba(255,255,255,0.06)'}}>
      <div style={{height: 6, width: (frame / total) * W, background: C.intake}} />
    </div>
  );
};
