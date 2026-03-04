/**
 * Scene 05 — Testimonials (10s = 300 frames)
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
const GRAY = '#71717a';
const TESTI_DURATION = 100;

const TESTIMONIALS = [
  {
    quote:
      "« Jérôme a su inventer et réaliser l'ensemble des composantes techniques du projet avec inventivité, rigueur et rapidité. »",
    author: 'Guillaume Eberwein',
    role: 'PDG de SWAP GPS',
  },
  {
    quote:
      "« Jérôme a su répondre à nos besoins très spécifiques avec une qualité d'exécution irréprochable. »",
    author: 'Stéphane Seguin',
    role: 'Directeur de programme',
  },
  {
    quote: '« Top collaborateur ! En tout point de vue. »',
    author: 'Marianne Cros',
    role: 'Key Account Manager, Nexton',
  },
];

const TestimonialItem: React.FC<{
  t: (typeof TESTIMONIALS)[0];
  startFrame: number;
}> = ({t, startFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = frame - startFrame;

  if (localFrame < 0 || localFrame >= TESTI_DURATION) return null;

  const opacity = interpolate(
    localFrame,
    [0, 14, TESTI_DURATION - 14, TESTI_DURATION],
    [0, 1, 1, 0],
    {extrapolateRight: 'clamp'},
  );

  const quoteY = spring({
    frame: localFrame,
    fps,
    config: {damping: 200, stiffness: 75},
    from: 45,
    to: 0,
  });

  const authorY = spring({
    frame: Math.max(0, localFrame - 18),
    fps,
    config: {damping: 200, stiffness: 75},
    from: 22,
    to: 0,
  });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 220px',
        opacity,
      }}
    >
      {/* Opening quote mark */}
      <div
        style={{
          fontFamily,
          fontSize: 130,
          fontWeight: 700,
          color: ACCENT,
          opacity: 0.2,
          lineHeight: 0.5,
          marginBottom: 36,
          alignSelf: 'flex-start',
        }}
      >
        "
      </div>

      {/* Quote */}
      <div
        style={{
          fontFamily,
          fontSize: 36,
          fontWeight: 600,
          color: TEXT,
          lineHeight: 1.45,
          letterSpacing: '-0.02em',
          textAlign: 'center',
          transform: `translateY(${quoteY}px)`,
        }}
      >
        {t.quote}
      </div>

      {/* Author */}
      <div
        style={{
          marginTop: 52,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          transform: `translateY(${authorY}px)`,
        }}
      >
        <div
          style={{
            width: 40,
            height: 2,
            backgroundColor: ACCENT,
            marginBottom: 14,
          }}
        />
        <div
          style={{
            fontFamily,
            fontSize: 20,
            fontWeight: 700,
            color: TEXT,
            letterSpacing: '-0.01em',
          }}
        >
          {t.author}
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 14,
            fontWeight: 500,
            color: GRAY,
            letterSpacing: '0.12em',
          }}
        >
          {t.role}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Testimonials: React.FC = () => {
  const frame = useCurrentFrame();
  const sceneOpacity = useSceneOpacity(10, 15);

  const badgeOpacity = interpolate(frame, [0, 28], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: BG, opacity: sceneOpacity}}>
      {/* Persistent score badge */}
      <div
        style={{
          position: 'absolute',
          top: 64,
          right: 120,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          opacity: badgeOpacity,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 56,
            fontWeight: 700,
            color: ACCENT,
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}
        >
          4.9/5
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 12,
            fontWeight: 500,
            color: GRAY,
            letterSpacing: '0.18em',
            marginTop: 6,
          }}
        >
          SCORE MOYEN POST-PROJET
        </div>
      </div>

      {TESTIMONIALS.map((t, i) => (
        <TestimonialItem
          key={t.author}
          t={t}
          startFrame={i * TESTI_DURATION}
        />
      ))}
    </AbsoluteFill>
  );
};
