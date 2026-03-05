/**
 * Scene 06 — CTA Final (10s = 300 frames)
 */
import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

import {fontFamily} from '../lib/fonts';
import {useSceneOpacity} from '../lib/transitions';

const TEXT = '#0a0a0a';
const ACCENT = '#00C896';

const BULLETS = [
  'Équipe projet dédiée en moins de 10 jours',
  'Production en France',
  'Références vérifiables auprès de nos clients',
];

// Words for kinetic line 1 + 2
const LINE1_WORDS = ['Parlons', 'de'];
const LINE2_WORDS = ['votre', 'produit.'];

export const CTAFinal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sceneOpacity = useSceneOpacity(10, 20);

  // URL pop-in
  const urlScale = spring({
    frame: Math.max(0, frame - 140),
    fps,
    config: {damping: 14, stiffness: 320, mass: 0.35},
    from: 3,
    to: 1,
  });
  const urlOpacity = interpolate(frame, [140, 155], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 160px',
        opacity: sceneOpacity,
      }}
    >
      {/* Kinetic text — line 1: word by word pop-in */}
      <div
        style={{
          display: 'flex',
          gap: '0 20px',
          marginBottom: 0,
          overflow: 'visible',
        }}
      >
        {LINE1_WORDS.map((word, i) => {
          const delay = i * 8;
          const wScale = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: {damping: 14, stiffness: 340, mass: 0.35},
            from: 3,
            to: 1,
          });
          const wOpacity = interpolate(frame, [delay, delay + 10], [0, 1], {
            extrapolateRight: 'clamp',
          });
          return (
            <span
              key={word + i}
              style={{
                display: 'inline-block',
                fontFamily,
                fontSize: 92,
                fontWeight: 700,
                color: TEXT,
                letterSpacing: '-0.04em',
                lineHeight: 1.0,
                transform: `scale(${wScale})`,
                opacity: wOpacity,
                transformOrigin: 'left bottom',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Kinetic text — line 2: accent, word by word */}
      <div
        style={{
          display: 'flex',
          gap: '0 20px',
          marginBottom: 56,
        }}
      >
        {LINE2_WORDS.map((word, i) => {
          const delay = 10 + i * 8;
          const wScale = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: {damping: 14, stiffness: 340, mass: 0.35},
            from: 3,
            to: 1,
          });
          const wOpacity = interpolate(frame, [delay, delay + 10], [0, 1], {
            extrapolateRight: 'clamp',
          });
          return (
            <span
              key={word + i}
              style={{
                display: 'inline-block',
                fontFamily,
                fontSize: 92,
                fontWeight: 700,
                color: ACCENT,
                letterSpacing: '-0.04em',
                lineHeight: 1.0,
                transform: `scale(${wScale})`,
                opacity: wOpacity,
                transformOrigin: 'left bottom',
                textShadow: 'none',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Bullets — pop-in scale */}
      <div style={{display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 64}}>
        {BULLETS.map((bullet, i) => {
          const delay = 60 + i * 22;
          const bScale = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: {damping: 18, stiffness: 280, mass: 0.45},
            from: 2.5,
            to: 1,
          });
          const bOpacity = interpolate(frame, [delay, delay + 14], [0, 1], {
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={bullet}
              style={{
                fontFamily,
                fontSize: 22,
                fontWeight: 500,
                color: 'rgba(10,10,10,0.65)',
                opacity: bOpacity,
                transform: `scale(${bScale})`,
                transformOrigin: 'left center',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <span
                style={{
                  color: ACCENT,
                  fontSize: 20,
                  fontWeight: 700,
                  textShadow: 'none',
                }}
              >
                ✓
              </span>
              {bullet}
            </div>
          );
        })}
      </div>

      {/* URL — big pop-in */}
      <div
        style={{
          opacity: urlOpacity,
          transform: `scale(${urlScale})`,
          transformOrigin: 'left center',
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 68,
            fontWeight: 700,
            color: TEXT,
            letterSpacing: '-0.04em',
            borderBottom: `3px solid ${ACCENT}`,
            display: 'inline-block',
            paddingBottom: 6,
            textShadow: 'none',
          }}
        >
          gaviota.fr
        </div>
      </div>
    </AbsoluteFill>
  );
};
