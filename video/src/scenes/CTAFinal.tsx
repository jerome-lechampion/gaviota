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

const BG = '#ffffff';
const TEXT = '#0a0a0a';
const ACCENT = '#00C896';

const BULLETS = [
  'Équipe projet dédiée en moins de 10 jours',
  'Production en France — NDA systématique',
  'Références vérifiables auprès de nos clients',
];

export const CTAFinal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sceneOpacity = useSceneOpacity(10, 20);

  const line1Spring = spring({
    frame,
    fps,
    config: {damping: 200, stiffness: 100},
    from: 88,
    to: 0,
  });
  const line1Opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const line2Spring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: {damping: 200, stiffness: 100},
    from: 88,
    to: 0,
  });
  const line2Opacity = interpolate(frame, [10, 22], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const urlOpacity = interpolate(frame, [140, 165], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const urlScale = spring({
    frame: Math.max(0, frame - 140),
    fps,
    config: {damping: 200, stiffness: 80},
    from: 0.88,
    to: 1,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 160px',
        opacity: sceneOpacity,
      }}
    >
      {/* Kinetic text — line 1 */}
      <div style={{overflow: 'hidden'}}>
        <div
          style={{
            fontFamily,
            fontSize: 92,
            fontWeight: 700,
            color: TEXT,
            letterSpacing: '-0.04em',
            lineHeight: 1.0,
            transform: `translateY(${line1Spring}px)`,
            opacity: line1Opacity,
          }}
        >
          Parlons de
        </div>
      </div>

      {/* Kinetic text — line 2 (accent) */}
      <div style={{overflow: 'hidden', marginBottom: 56}}>
        <div
          style={{
            fontFamily,
            fontSize: 92,
            fontWeight: 700,
            color: ACCENT,
            letterSpacing: '-0.04em',
            lineHeight: 1.0,
            transform: `translateY(${line2Spring}px)`,
            opacity: line2Opacity,
          }}
        >
          votre produit.
        </div>
      </div>

      {/* Bullets */}
      <div style={{display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 64}}>
        {BULLETS.map((bullet, i) => {
          const bulletOpacity = interpolate(
            frame,
            [65 + i * 25, 82 + i * 25],
            [0, 1],
            {extrapolateRight: 'clamp'},
          );
          const bulletX = spring({
            frame: Math.max(0, frame - (65 + i * 25)),
            fps,
            config: {damping: 200, stiffness: 80},
            from: -32,
            to: 0,
          });

          return (
            <div
              key={bullet}
              style={{
                fontFamily,
                fontSize: 22,
                fontWeight: 500,
                color: 'rgba(10,10,10,0.65)',
                opacity: bulletOpacity,
                transform: `translateX(${bulletX}px)`,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <span style={{color: ACCENT, fontSize: 20, fontWeight: 700}}>✓</span>
              {bullet}
            </div>
          );
        })}
      </div>

      {/* URL */}
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
          }}
        >
          gaviota.fr
        </div>
      </div>
    </AbsoluteFill>
  );
};
