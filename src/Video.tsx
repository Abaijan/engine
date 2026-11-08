import React from 'react';
import {Audio, Sequence, Series, staticFile} from 'remotion';
import {
  COMBINED_VOICEOVER_PLAYBACK_RATE,
  COMBINED_VOICEOVER_START_FRAME,
  NARRATION_PLAYBACK_RATE,
  SEQ_RATE,
  SCENES,
  TOTAL_FRAMES,
  USE_AUDIO,
  sceneFrames,
} from './script';
import {ProgressBar, Shell} from './components/Shell';
import {SceneBody} from './scenes/SceneBody';

export const Video: React.FC = () => (
  <Sequence durationInFrames={TOTAL_FRAMES} playbackRate={SEQ_RATE}>
    <>
      <Series>
        {SCENES.map((scene) => (
          <Series.Sequence key={scene.id} durationInFrames={sceneFrames(scene)}>
            <Shell scene={scene}>
              <SceneBody scene={scene} />
            </Shell>
            {USE_AUDIO && ['01-intro', '02-idea', '03-block'].includes(scene.id) && (
              <Audio
                src={staticFile(`audio/${scene.id}.mp3`)}
                playbackRate={NARRATION_PLAYBACK_RATE / SEQ_RATE}
                preservePitch
              />
            )}
          </Series.Sequence>
        ))}
      </Series>
      {USE_AUDIO && (
        <Sequence
          from={COMBINED_VOICEOVER_START_FRAME}
          durationInFrames={TOTAL_FRAMES - COMBINED_VOICEOVER_START_FRAME}
        >
          <Audio
            src={staticFile('audio/scenes-04-13-and-18-5min.mp3')}
            playbackRate={COMBINED_VOICEOVER_PLAYBACK_RATE / SEQ_RATE}
            preservePitch
          />
        </Sequence>
      )}
      <ProgressBar total={TOTAL_FRAMES} />
    </>
  </Sequence>
);
