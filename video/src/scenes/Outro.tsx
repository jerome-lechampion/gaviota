/**
 * Scene 07 — Outro (5s = 150 frames)
 * Logo 2.5× larger (200px) for strong brand close.
 */
import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

import {fontFamily} from '../lib/fonts';

const BG = '#ffffff';
const TEXT = '#0a0a0a';
const ACCENT = '#00C896';
const GRAY = '#71717a';

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    config: {damping: 180, stiffness: 55},
    from: 0.75,
    to: 1,
  });

  const logoOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const nameOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const taglineOpacity = interpolate(frame, [32, 52], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Final fade to white
  const finalFade = interpolate(
    frame,
    [durationInFrames - 28, durationInFrames],
    [1, 0],
    {extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: finalFade,
      }}
    >
      {/* Logo mark — 2.5× bigger: 80 → 200px */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          marginBottom: 24,
        }}
      >
        <Img
          src="https://gaviota.fr/assets/images/logo.png"
          style={{width: 360, height: 360, objectFit: 'contain'}}
        />
      </div>

      {/* Wordmark */}
      <div
        style={{
          fontFamily,
          fontSize: 80,
          fontWeight: 700,
          color: TEXT,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          opacity: nameOpacity,
          marginBottom: 10,
        }}
      >
        GAVIOTA
      </div>

      {/* URL */}
      <div
        style={{
          fontFamily,
          fontSize: 22,
          fontWeight: 500,
          color: ACCENT,
          letterSpacing: '0.22em',
          opacity: taglineOpacity,
          marginBottom: 10,
        }}
      >
        gaviota.fr
      </div>

      {/* Tagline */}
      <div
        style={{
          fontFamily,
          fontSize: 13,
          fontWeight: 400,
          color: GRAY,
          letterSpacing: '0.28em',
          opacity: taglineOpacity,
        }}
      >
        WEB · MOBILE · CRITIQUE · PARIS
      </div>
    </AbsoluteFill>
  );
};
