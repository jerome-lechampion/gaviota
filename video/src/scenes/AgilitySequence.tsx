/**
 * Scene 04 — Agility Sequence (10s = 300 frames)
 *
 * Each card slides in from right, puis le contenu s'anime en cascade :
 *   numéro → titre (overflow-clip slide-up) → body (fade-up) → tags (stagger slide-left)
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

const BG = '#ffffff';
const TEXT = '#0a0a0a';
const ACCENT = '#00C896';
const GRAY = '#71717a';

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
    tags: ['Support 24/7', 'Coaching équipes', 'Roadmap produit'],
  },
];

const StepCard: React.FC<{
  step: (typeof STEPS)[0];
  index: number;
  activationFrame: number;
}> = ({step, index, activationFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lf = frame - activationFrame; // local frame depuis l'activation de la carte

  // — Carte : slide depuis la droite —
  const cardX = spring({
    frame: lf,
    fps,
    config: {damping: 120, stiffness: 55, mass: 0.9},
    from: 100,
    to: 0,
  });

  // — Numéro fantôme : fade immédiat —
  const numberOpacity = interpolate(lf, [0, 18], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // — Titre : slide-up depuis overflow caché, délai 10f —
  const titleY = spring({
    frame: Math.max(0, lf - 10),
    fps,
    config: {damping: 220, stiffness: 90, mass: 0.6},
    from: 48,
    to: 0,
  });
  const titleOpacity = interpolate(lf, [10, 28], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // — Body : fade-up, délai 28f après activation —
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

  // — Tags : stagger slide depuis la gauche, à partir de 44f —
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
        borderLeft: `2px solid ${isFirst ? ACCENT : 'rgba(0,0,0,0.08)'}`,
        transform: `translateX(${cardX}px)`,
        // pas d'opacity sur le container → chaque enfant gère le sien
      }}
    >
      {/* Numéro fantôme */}
      <div
        style={{
          fontFamily,
          fontSize: 88,
          fontWeight: 700,
          color: ACCENT,
          opacity: numberOpacity * 0.15,
          lineHeight: 1,
          marginBottom: -16,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {step.number}
      </div>

      {/* Titre — slide-up depuis overflow caché */}
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
            transform: `translateY(${titleY}px)`,
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

      {/* Tags — stagger slide depuis la gauche, taille augmentée */}
      <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
        {step.tags.map((tag, ti) => {
          const tagStart = TAG_START + ti * TAG_STAGGER;
          const tagX = spring({
            frame: Math.max(0, lf - tagStart),
            fps,
            config: {damping: 220, stiffness: 90},
            from: -28,
            to: 0,
          });
          const tagOpacity = interpolate(lf, [tagStart, tagStart + 14], [0, 1], {
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
                transform: `translateX(${tagX}px)`,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
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
  const sceneOpacity = useSceneOpacity(10, 15);

  const headerOpacity = interpolate(frame, [0, 22], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const headerY = interpolate(frame, [0, 22], [32, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        padding: '80px 120px',
        display: 'flex',
        flexDirection: 'column',
        opacity: sceneOpacity,
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: 56,
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 12,
            fontWeight: 600,
            color: ACCENT,
            letterSpacing: '0.38em',
            marginBottom: 12,
          }}
        >
          MÉTHODE ÉPROUVÉE
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 50,
            fontWeight: 700,
            color: TEXT,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}
        >
          Nous cadrons, construisons et faisons{' '}
          <span style={{color: ACCENT}}>grandir</span> vos produits.
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
