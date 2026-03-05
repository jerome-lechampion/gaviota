import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';

import {DynamicBackground} from './lib/DynamicBackground';
import {AgilitySequence} from './scenes/AgilitySequence';
import {CTAFinal} from './scenes/CTAFinal';
import {ClientsParade} from './scenes/ClientsParade';
import {KineticStats} from './scenes/KineticStats';
import {LogoReveal} from './scenes/LogoReveal';
import {Outro} from './scenes/Outro';
import {Testimonials} from './scenes/Testimonials';

// Helper: seconds → frames at 30fps
const s = (sec: number) => Math.round(sec * 30);

// Timeline (50s total):
// 00:00–00:03  LogoReveal        (3s  = 90f)
// 00:03–00:08  KineticStats      (5s  = 150f)
// 00:08–00:15  ClientsParade     (7s  = 210f)
// 00:15–00:25  AgilitySequence   (10s = 300f)
// 00:25–00:35  Testimonials      (10s = 300f)
// 00:35–00:45  CTAFinal          (10s = 300f)
// 00:45–00:50  Outro             (5s  = 150f)
// TOTAL                          50s = 1500f

export const GaviotaVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#f8f8f6'}}>
      {/* Global animated background — persists across all scenes */}
      <DynamicBackground />

      <Sequence from={s(0)} durationInFrames={s(3)}>
        <LogoReveal />
      </Sequence>

      <Sequence from={s(3)} durationInFrames={s(5)}>
        <KineticStats />
      </Sequence>

      <Sequence from={s(8)} durationInFrames={s(7)}>
        <ClientsParade />
      </Sequence>

      <Sequence from={s(15)} durationInFrames={s(10)}>
        <AgilitySequence />
      </Sequence>

      <Sequence from={s(25)} durationInFrames={s(10)}>
        <Testimonials />
      </Sequence>

      <Sequence from={s(35)} durationInFrames={s(10)}>
        <CTAFinal />
      </Sequence>

      <Sequence from={s(45)} durationInFrames={s(5)}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
