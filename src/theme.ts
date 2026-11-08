import {loadFont} from '@remotion/google-fonts/IBMPlexSans';

export const W = 1920;
export const H = 1080;
/** Design clock: all scene timings and animations are authored in 30-frame seconds. */
export const FPS = 30;
/** Real output frame rate of the rendered video. */
export const OUTPUT_FPS = 60;

export const {fontFamily: FONT} = loadFont('normal', {
  weights: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

/**
 * Blueprint-inspired palette.
 * Stroke colors are consistent throughout the video:
 * intake — blue, compression — amber, power — red-orange, exhaust — gray.
 */
export const C = {
  bg: '#0c2547',
  bgDeep: '#071a33',
  grid: 'rgba(170, 205, 255, 0.07)',
  gridMajor: 'rgba(170, 205, 255, 0.14)',
  ink: '#e6efff',
  inkDim: '#8fb0dc',
  line: '#b9d2f7',
  steel: '#3b5a8c',
  steelDark: '#1e3760',
  steelLight: '#a9c4ee',
  panel: 'rgba(6, 22, 45, 0.78)',
  intake: '#5cc8ff',
  compress: '#ffd24a',
  power: '#ff6a3d',
  exhaust: '#a9b4c7',
  oil: '#f0b43c',
  coolant: '#4d8dff',
  hi: '#ffffff',
};

export const STROKE_COLORS = [C.intake, C.compress, C.power, C.exhaust];
export const STROKE_NAMES = ['Intake', 'Compression', 'Power', 'Exhaust'];
