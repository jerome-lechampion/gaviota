import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';

import {DynamicBackground} from './lib/DynamicBackground';
import {AgilitySequence} from './scenes/AgilitySequence';
import {CTAFinal} from './scenes/CTAFinal';
import {ClientsParade} from './scenes/ClientsParade';
import {KineticStats} from './scenes/KineticStats';
import {LogoReveal} from './scenes/LogoReveal';
import {Outro} from './scenes/Outro';
import {ScreensWarp} from './scenes/ScreensWarp';
import {Testimonials} from './scenes/Testimonials';

// Helper: seconds → frames at 30fps
const s = (sec: number) => Math.round(sec * 30);

// Timeline (54.33s total = 1630 frames):
// 00:00–00:03  LogoReveal        (3s   =  90f)  → f0
// 00:03–00:06  KineticStats      (100f = 3.33s)  → f90
// 00:06–00:14  ClientsParade     (7s   = 210f)   → f190
// 00:14–00:24  AgilitySequence   (10s  = 300f)   → f400
// 00:24–00:30  ScreensWarp       (6s   = 180f)   → f700
// 00:30–00:40  Testimonials      (10s  = 300f)   → f880
// 00:40–00:50  CTAFinal          (10s  = 300f)   → f1180
// 00:50–00:55  Outro             (5s   = 150f)   → f1480
// TOTAL                          54.33s = 1630f

export const GaviotaVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#f8f8f6'}}>
      {/* Global animated background — persists across all scenes */}
      <DynamicBackground />

      {/* Background music */}
      <Audio src={staticFile('music.mp3')} volume={0.7} />

      <Sequence from={0} durationInFrames={s(3)}>
        <LogoReveal />
      </Sequence>

      <Sequence from={90} durationInFrames={100}>
        <KineticStats />
      </Sequence>

      <Sequence from={190} durationInFrames={s(7)}>
        <ClientsParade />
      </Sequence>

      <Sequence from={400} durationInFrames={s(10)}>
        <AgilitySequence />
      </Sequence>

      <Sequence from={700} durationInFrames={s(6)}>
        <ScreensWarp />
      </Sequence>

      <Sequence from={880} durationInFrames={s(10)}>
        <Testimonials />
      </Sequence>

      <Sequence from={1180} durationInFrames={240}>
        <CTAFinal />
      </Sequence>

      <Sequence from={1420} durationInFrames={s(5)}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
