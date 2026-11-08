import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import {SEQ_RATE, TOTAL_FRAMES} from './script';
import {H, OUTPUT_FPS, W} from './theme';

export const Root: React.FC = () => (
  <Composition id="Engine" component={Video} durationInFrames={Math.ceil(TOTAL_FRAMES / SEQ_RATE)} fps={OUTPUT_FPS} width={W} height={H} />
);
