/**
 * Scene 04 — Agility Sequence (10s = 300 frames)
 * Cards pop in scale 3→1, content cascades with energy.
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
const GRAY = '#71717a';
const BORDER = 'rgba(0,0,0,0.08)';

const STEPS = [
  {
    number: '01',
    title: 'IMMERSION\n& BLUEPRINT',
    body: 'Ateliers métiers, cartographie applicative et priorisation par impact. Budget et KPI sécurisés dès la première semaine.',
    tags: ['Discovery UX', 'Audit produit', 'Cadrage budgétaire'],
  },
  {
    number: '02',
    title: 'DELIVERY\nINCRÉMENTAL',
    body: 'Design sprint, full-stack, QA automatisée. Démonstrations live à chaque itération. Vélocité sans compromis sur la qualité.',
    tags: ['Sprint 2 semaines', 'CI/CD sécurisé', 'QA automatisée'],
  },
  {
    number: '03',
    title: 'RUN &\nACCÉLÉRATION',
    body: "Monitoring 24/7, coaching des équipes internes et plan d'évolution aligné sur vos ambitions de croissance.",
    tags: ['Monitoring 24/7', 'Coaching équipes', 'Roadmap produit'],
  },
];

const StepCard: React.FC<{
  step: (typeof STEPS)[0];
  index: number;
  activationFrame: number;
}> = ({step, index, activationFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lf = frame - activationFrame;

  // Card pops in: scale 3→1 + slide from right
  const cardScale = spring({
    frame: Math.max(0, lf),
    fps,
    config: {damping: 16, stiffness: 300, mass: 0.4},
    from: 3,
    to: 1,
  });
  const cardOpacity = interpolate(lf, [0, 10], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  // Number ghost — immediate
  const numberOpacity = interpolate(lf, [0, 18], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Title pops in
  const titleScale = spring({
    frame: Math.max(0, lf - 12),
    fps,
    config: {damping: 18, stiffness: 280, mass: 0.4},
    from: 2.5,
    to: 1,
  });
  const titleOpacity = interpolate(lf, [12, 26], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Body fade up
  const bodyY = spring({
    frame: Math.max(0, lf - 28),
    fps,
    config: {damping: 220, stiffness: 70, mass: 0.8},
    from: 32,
    to: 0,
  });
  const bodyOpacity = interpolate(lf, [28, 48], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Tags stagger pop-in
  const TAG_STAGGER = 14;
  const TAG_START = 44;

  const isFirst = index === 0;

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '36px 44px',
        borderLeft: `2px solid ${isFirst ? ACCENT : BORDER}`,
        transform: `scale(${cardScale})`,
        opacity: cardOpacity,
        transformOrigin: 'center center',
        boxShadow: 'none',
      }}
    >
      {/* Ghost number */}
      <div
        style={{
          fontFamily,
          fontSize: 88,
          fontWeight: 700,
          color: ACCENT,
          opacity: numberOpacity * 0.2,
          lineHeight: 1,
          marginBottom: -16,
          fontVariantNumeric: 'tabular-nums',
          textShadow: 'none',
        }}
      >
        {step.number}
      </div>

      {/* Title — pop-in */}
      <div style={{overflow: 'hidden', marginBottom: 22}}>
        <div
          style={{
            fontFamily,
            fontSize: 36,
            fontWeight: 700,
            color: TEXT,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            whiteSpace: 'pre-line',
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
            transformOrigin: 'left center',
          }}
        >
          {step.title}
        </div>
      </div>

      {/* Body — fade-up */}
      <div
        style={{
          fontFamily,
          fontSize: 22,
          fontWeight: 400,
          color: GRAY,
          lineHeight: 1.6,
          marginBottom: 32,
          flexGrow: 1,
          opacity: bodyOpacity,
          transform: `translateY(${bodyY}px)`,
        }}
      >
        {step.body}
      </div>

      {/* Tags — stagger pop */}
      <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
        {step.tags.map((tag, ti) => {
          const tagStart = TAG_START + ti * TAG_STAGGER;
          const tagScale = spring({
            frame: Math.max(0, lf - tagStart),
            fps,
            config: {damping: 18, stiffness: 300, mass: 0.4},
            from: 2.5,
            to: 1,
          });
          const tagOpacity = interpolate(lf, [tagStart, tagStart + 12], [0, 1], {
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={tag}
              style={{
                fontFamily,
                fontSize: 22,
                fontWeight: 600,
                color: ACCENT,
                letterSpacing: '0.06em',
                opacity: tagOpacity,
                transform: `scale(${tagScale})`,
                transformOrigin: 'left center',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                textShadow: 'none',
              }}
            >
              <span style={{fontSize: 14, opacity: 0.7}}>→</span>
              {tag}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const AgilitySequence: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sceneOpacity = useSceneOpacity(10, 15);

  // Header — word by word pop-in
  const HEADER_WORDS = ['Nous', 'cadrons,', 'construisons', 'et', 'faisons', 'grandir', 'vos', 'produits.'];
  const ACCENT_HEADER = new Set(['grandir']);

  const eyebrowScale = spring({
    frame,
    fps,
    config: {damping: 20, stiffness: 260, mass: 0.4},
    from: 2.5,
    to: 1,
  });
  const eyebrowOpacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        padding: '80px 120px',
        display: 'flex',
        flexDirection: 'column',
        opacity: sceneOpacity,
      }}
    >
      {/* Header */}
      <div style={{marginBottom: 56}}>
        <div
          style={{
            fontFamily,
            fontSize: 12,
            fontWeight: 600,
            color: ACCENT,
            letterSpacing: '0.38em',
            marginBottom: 12,
            opacity: eyebrowOpacity,
            transform: `scale(${eyebrowScale})`,
            transformOrigin: 'left center',
            textShadow: 'none',
          }}
        >
          MÉTHODE ÉPROUVÉE
        </div>

        {/* Word-by-word pop-in headline */}
        <div
          style={{
            fontFamily,
            fontSize: 50,
            fontWeight: 700,
            color: TEXT,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0 12px',
          }}
        >
          {HEADER_WORDS.map((word, i) => {
            const delay = 8 + i * 6;
            const wScale = spring({
              frame: Math.max(0, frame - delay),
              fps,
              config: {damping: 16, stiffness: 300, mass: 0.4},
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
                  color: ACCENT_HEADER.has(word) ? ACCENT : TEXT,
                  transform: `scale(${wScale})`,
                  opacity: wOpacity,
                  transformOrigin: 'center bottom',
                  textShadow: 'none',
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>

      {/* Three columns */}
      <div style={{display: 'flex', flexDirection: 'row', flexGrow: 1}}>
        {STEPS.map((step, i) => (
          <StepCard
            key={step.number}
            step={step}
            index={i}
            activationFrame={30 + i * 55}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
