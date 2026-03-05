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

const TEXT = '#0a0a0a';
const ACCENT = '#00C896';
const GRAY = '#71717a';
const TESTI_DURATION = 100;

const TESTIMONIALS = [
  {
    quote:
      "« Jérôme a su inventer et réaliser l'ensemble des composantes techniques du projet avec inventivité, rigueur et rapidité. »",
    accentWord: 'inventer',
    author: 'Guillaume Eberwein',
    role: 'PDG de SWAP GPS',
  },
  {
    quote:
      "« Jérôme a su répondre à nos besoins très spécifiques avec une qualité d'exécution irréprochable. »",
    accentWord: 'qualité',
    author: 'Stéphane Seguin',
    role: 'Directeur de programme chez TotalEnergies',
  },
  {
    quote: '« Top collaborateur ! En tout point de vue. »',
    accentWord: 'collaborateur',
    author: 'Marianne Cros',
    role: 'Key Account Manager, Nexton',
  },
];

/** Renders a quote string with one word highlighted in accent color */
const HighlightedQuote: React.FC<{quote: string; accentWord: string; style: React.CSSProperties}> = ({quote, accentWord, style}) => {
  const parts = quote.split(new RegExp(`(${accentWord})`, 'i'));
  return (
    <div style={style}>
      {parts.map((part, i) =>
        part.toLowerCase() === accentWord.toLowerCase() ? (
          <span key={i} style={{color: ACCENT}}>{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </div>
  );
};

const TestimonialItem: React.FC<{
  t: (typeof TESTIMONIALS)[0];
  startFrame: number;
}> = ({t, startFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lf = frame - startFrame;

  if (lf < 0 || lf >= TESTI_DURATION) return null;

  const fadeOut = interpolate(lf, [TESTI_DURATION - 14, TESTI_DURATION], [1, 0], {
    extrapolateRight: 'clamp',
  });

  // Quote mark pops in
  const quoteMarkScale = spring({
    frame: lf,
    fps,
    config: {damping: 14, stiffness: 340, mass: 0.35},
    from: 3,
    to: 1,
  });
  const quoteMarkOpacity = interpolate(lf, [0, 10], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Quote text — scale pop-in
  const quoteScale = spring({
    frame: Math.max(0, lf - 8),
    fps,
    config: {damping: 18, stiffness: 260, mass: 0.45},
    from: 2.5,
    to: 1,
  });
  const quoteOpacity = interpolate(lf, [8, 22], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Author slides up + pops in
  const authorScale = spring({
    frame: Math.max(0, lf - 22),
    fps,
    config: {damping: 20, stiffness: 240, mass: 0.5},
    from: 2,
    to: 1,
  });
  const authorOpacity = interpolate(lf, [22, 36], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 220px',
        opacity: fadeOut,
      }}
    >
      {/* Opening quote mark */}
      <div
        style={{
          fontFamily,
          fontSize: 130,
          fontWeight: 700,
          color: ACCENT,
          opacity: quoteMarkOpacity * 0.35,
          lineHeight: 0.5,
          marginBottom: 36,
          alignSelf: 'flex-start',
          transform: `scale(${quoteMarkScale})`,
          transformOrigin: 'left center',
          textShadow: 'none',
        }}
      >
        "
      </div>

      {/* Quote — pop-in scale */}
      <HighlightedQuote
        quote={t.quote}
        accentWord={t.accentWord}
        style={{
          fontFamily,
          fontSize: 36,
          fontWeight: 600,
          color: TEXT,
          lineHeight: 1.45,
          letterSpacing: '-0.02em',
          textAlign: 'center',
          transform: `scale(${quoteScale})`,
          opacity: quoteOpacity,
        }}
      />

      {/* Stars */}
      <div
        style={{
          marginTop: 32,
          fontSize: 28,
          letterSpacing: '4px',
          transform: `scale(${authorScale})`,
          opacity: authorOpacity,
        }}
      >
        ⭐️⭐️⭐️⭐️⭐️
      </div>

      {/* Author */}
      <div
        style={{
          marginTop: 52,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          transform: `scale(${authorScale})`,
          opacity: authorOpacity,
        }}
      >
        <div
          style={{
            width: 40,
            height: 2,
            background: `linear-gradient(to right, transparent, ${ACCENT}, transparent)`,
            marginBottom: 14,
            boxShadow: 'none',
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
  const {fps} = useVideoConfig();
  const sceneOpacity = useSceneOpacity(10, 15);

  const badgeScale = spring({
    frame,
    fps,
    config: {damping: 16, stiffness: 300, mass: 0.4},
    from: 3,
    to: 1,
  });
  const badgeOpacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{opacity: sceneOpacity}}>
      {/* Score badge — pop-in */}
      <div
        style={{
          position: 'absolute',
          top: 64,
          right: 120,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          opacity: badgeOpacity,
          transform: `scale(${badgeScale})`,
          transformOrigin: 'right top',
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
            textShadow: 'none',
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
