/**
 * Scene 07 — Outro (5s = 150 frames)
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

const TEXT = '#0a0a0a';
const ACCENT = '#00C896';
const GRAY = '#71717a';

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  // Logo — big pop-in 3→1
  const logoScale = spring({
    frame,
    fps,
    config: {damping: 14, stiffness: 300, mass: 0.4},
    from: 3,
    to: 1,
  });
  const logoOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Wordmark pop-in
  const nameScale = spring({
    frame: Math.max(0, frame - 14),
    fps,
    config: {damping: 16, stiffness: 300, mass: 0.4},
    from: 3,
    to: 1,
  });
  const nameOpacity = interpolate(frame, [14, 26], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // URL pop-in
  const urlScale = spring({
    frame: Math.max(0, frame - 28),
    fps,
    config: {damping: 18, stiffness: 280, mass: 0.45},
    from: 2.5,
    to: 1,
  });
  const urlOpacity = interpolate(frame, [28, 42], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Tagline
  const taglineScale = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: {damping: 20, stiffness: 260, mass: 0.5},
    from: 2,
    to: 1,
  });
  const taglineOpacity = interpolate(frame, [40, 55], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Final fade to black
  const finalFade = interpolate(
    frame,
    [durationInFrames - 28, durationInFrames],
    [1, 0],
    {extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: finalFade,
      }}
    >
      {/* Logo — pop 3→1 */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          marginBottom: 24,
          filter: 'none',
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
          transform: `scale(${nameScale})`,
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
          opacity: urlOpacity,
          transform: `scale(${urlScale})`,
          marginBottom: 10,
          textShadow: 'none',
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
          transform: `scale(${taglineScale})`,
        }}
      >
        WEB · MOBILE · IOT · PARIS
      </div>
    </AbsoluteFill>
  );
};
