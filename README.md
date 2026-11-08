# How an Engine Works — Remotion Video

An educational video (1920×1080, rendered at 60 fps) explaining how a four-stroke internal combustion engine works.
The animation uses engine kinematics: piston, connecting rod, crankshaft, cam lobes, and valves are
computed from formulas, so the strokes, valve timing, and cylinder firing order are represented consistently.
The video keeps scenes 1–13 and the finale (scene 18), which are covered by the narration.
Scenes 14–17 are omitted. The visuals play at 3×. Narration for scenes 1–3 plays at 1.3×,
while narration for scenes 4–13 and 18 plays slightly faster at 1.4×, with pitch preservation.
There are no subtitles or presentation-style title cards; the engine animation and diagrams fill the frame.

## Run

```bash
npm install
npm run dev        # Remotion Studio for frame-by-frame preview
npm run render     # render the final video to out/engine.mp4
npm run still      # render one frame to out/preview.png
```

Node.js 18 or later is required. Remotion downloads Chrome for rendering on first run.

## Project structure

- `src/script.ts` — source scenes, selected scenes, and narration timing. Scene duration follows the measured voice-over length;
  `PLAYBACK_RATE` controls visual speed and `NARRATION_PLAYBACK_RATE` controls voice speed.
  Set `seconds` to override a scene with no voice-over timing.
- `src/kinematics.ts` — cylinder geometry, cam profile, pressure, and gas color.
- `src/components/Cylinder.tsx` — the main animated engine cross-section.
- `src/components/Flow.tsx`, `Glyphs.tsx` — fuel, air, oil, coolant, and exhaust flow diagrams.
- `src/scenes/SceneBody.tsx` — visuals for each scene.
- `src/components/Shell.tsx` — cinematic background and progress bar.
- `src/parts.ts` — part descriptions and functions.

## Narration audio

The first three scenes use their individual MP3 voice-overs at 1.3× speed.
Scenes 4–13 and 18 use
`public/audio/scenes-04-13-and-18-5min.mp3`, starting exactly after scene 3. Its playback rate
is adjusted to align it with the scene visuals for an effective 1.4× narration speed.
Scenes 14–17 are omitted.

## Background music

Place a music file in `public/` and add
`<Audio src={staticFile('music.mp3')} volume={0.12} />` to `src/Video.tsx`.
# engine
