/**
 * Scene 01 — Logo Reveal (3s = 90 frames)
 * Letters of GAVIOTA each pop in with scale 3→1, staggered.
 */
import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

import {fontFamily} from '../lib/fonts';
import {useSceneOpacity} from '../lib/transitions';

const TEXT = '#0a0a0a';
const ACCENT = '#00C896';
const LETTERS = 'GAVIOTA'.split('');
const LETTER_STAGGER = 5; // frames between each letter pop

const PopLetter: React.FC<{char: string; delay: number}> = ({char, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lf = frame - delay;

  const scale = spring({
    frame: Math.max(0, lf),
    fps,
    config: {damping: 14, stiffness: 320, mass: 0.35},
    from: 3,
    to: 1,
  });

  const opacity = interpolate(lf, [0, 10], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  return (
    <span
      style={{
        display: 'inline-block',
        transform: `scale(${scale})`,
        opacity,
        transformOrigin: 'center bottom',
      }}
    >
      {char}
    </span>
  );
};

export const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sceneOpacity = useSceneOpacity(6, 10);

  // Subtitle pops in after letters
  const subtitleDelay = LETTERS.length * LETTER_STAGGER + 12;
  const subtitleScale = spring({
    frame: Math.max(0, frame - subtitleDelay),
    fps,
    config: {damping: 20, stiffness: 280, mass: 0.4},
    from: 2.5,
    to: 1,
  });
  const subtitleOpacity = interpolate(frame, [subtitleDelay, subtitleDelay + 10], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Glowing underline that expands after the word is set
  const glowWidth = interpolate(frame, [40, 68], [0, 680], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: sceneOpacity,
      }}
    >
      {/* GAVIOTA — letter-by-letter pop-in */}
      <div
        style={{
          display: 'flex',
          gap: 0,
          fontFamily,
          fontSize: 148,
          fontWeight: 700,
          color: TEXT,
          letterSpacing: '-0.04em',
          lineHeight: 1,
        }}
      >
        {LETTERS.map((char, i) => (
          <PopLetter key={i} char={char} delay={i * LETTER_STAGGER} />
        ))}
      </div>

      {/* Glowing underline */}
      <div
        style={{
          width: glowWidth,
          height: 2,
          background: `linear-gradient(to right, transparent, ${ACCENT} 20%, ${ACCENT} 80%, transparent)`,
          boxShadow: `0 0 12px rgba(0,200,150,0.4)`,
          marginTop: 4,
        }}
      />

      {/* Tagline pop-in */}
      <div
        style={{
          fontFamily,
          fontSize: 15,
          fontWeight: 500,
          color: ACCENT,
          letterSpacing: '0.45em',
          marginTop: 28,
          opacity: subtitleOpacity,
          transform: `scale(${subtitleScale})`,
          textShadow: `0 0 14px rgba(0,200,150,0.35)`,
        }}
      >
        STUDIO WEB · PARIS
      </div>
    </AbsoluteFill>
  );
};
