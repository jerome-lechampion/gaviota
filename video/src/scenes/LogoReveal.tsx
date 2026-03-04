/**
 * Scene 01 — Logo Reveal (3s = 90 frames)
 */
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';

import {fontFamily} from '../lib/fonts';
import {useSceneOpacity} from '../lib/transitions';

const BG = '#ffffff';
const TEXT = '#0a0a0a';
const ACCENT = '#00C896';

export const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const sceneOpacity = useSceneOpacity(8, 10);

  const lineProgress = interpolate(frame, [0, 35], [0, 100], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const textClip = interpolate(frame, [5, 40], [0, 100], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const subtitleOpacity = interpolate(frame, [45, 65], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: sceneOpacity,
      }}
    >
      {/* Sweeping accent line */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          width: `${lineProgress}%`,
          height: 2,
          backgroundColor: ACCENT,
          transform: 'translateY(-80px)',
        }}
      />

      {/* GAVIOTA wordmark */}
      <div style={{clipPath: `inset(0 ${100 - textClip}% 0 0)`}}>
        <div
          style={{
            fontFamily,
            fontSize: 148,
            fontWeight: 700,
            color: TEXT,
            letterSpacing: '-0.05em',
            lineHeight: 1,
          }}
        >
          GAVIOTA
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          fontFamily,
          fontSize: 15,
          fontWeight: 500,
          color: ACCENT,
          letterSpacing: '0.45em',
          marginTop: 28,
          opacity: subtitleOpacity,
        }}
      >
        STUDIO · PARIS
      </div>
    </AbsoluteFill>
  );
};
