/**
 * Scene 02 — Kinetic Stats (5s = 150 frames)
 * Big numbers pop in with scale 3→1, punchy energy.
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
const STAT_DURATION = 50;

const STATS = [
  {number: '20+', label: 'PLATEFORMES & APPS LANCÉES', sub: 'depuis 2018'},
  {number: '99%', label: 'SATISFACTION CLIENT', sub: 'comités projets grands comptes'},
];

const StatItem: React.FC<{
  stat: (typeof STATS)[0];
  startFrame: number;
}> = ({stat, startFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lf = frame - startFrame;

  if (lf < 0 || lf >= STAT_DURATION) return null;

  // Big number — scale 3→1 pop with strong energy
  const numScale = spring({
    frame: lf,
    fps,
    config: {damping: 12, stiffness: 380, mass: 0.35},
    from: 3,
    to: 1,
  });
  const numOpacity = interpolate(lf, [0, 10], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  // Scene fade out
  const fadeOut = interpolate(lf, [STAT_DURATION - 12, STAT_DURATION], [1, 0], {
    extrapolateRight: 'clamp',
  });

  // Label slides up + pops in
  const labelScale = spring({
    frame: Math.max(0, lf - 14),
    fps,
    config: {damping: 20, stiffness: 260, mass: 0.45},
    from: 2,
    to: 1,
  });
  const labelOpacity = interpolate(lf, [14, 26], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Sub label
  const subOpacity = interpolate(lf, [22, 36], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const subY = spring({
    frame: Math.max(0, lf - 22),
    fps,
    config: {damping: 22, stiffness: 240, mass: 0.5},
    from: 20,
    to: 0,
  });

  // Accent bar grows upward
  const barScale = interpolate(lf, [0, 16], [0, 1], {
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
        opacity: fadeOut,
      }}
    >
      {/* Glowing accent bar */}
      <div
        style={{
          width: 4,
          height: 56,
          background: `linear-gradient(to bottom, ${ACCENT}, rgba(0,200,150,0.5))`,
          marginBottom: 28,
          transform: `scaleY(${barScale})`,
          transformOrigin: 'top',
          boxShadow: `0 0 14px rgba(0,200,150,0.4)`,
        }}
      />

      {/* Big number — pop-in 3→1 */}
      <div
        style={{
          fontFamily,
          fontSize: 210,
          fontWeight: 700,
          color: TEXT,
          letterSpacing: '-0.06em',
          lineHeight: 0.85,
          transform: `scale(${numScale})`,
          opacity: numOpacity,
          fontVariantNumeric: 'tabular-nums',
          textShadow: 'none',
        }}
      >
        {stat.number}
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily,
          fontSize: 20,
          fontWeight: 600,
          color: ACCENT,
          letterSpacing: '0.22em',
          marginTop: 28,
          transform: `scale(${labelScale})`,
          opacity: labelOpacity,
          textShadow: 'none',
        }}
      >
        {stat.label}
      </div>

      {/* Sub-label */}
      <div
        style={{
          fontFamily,
          fontSize: 15,
          fontWeight: 400,
          color: GRAY,
          letterSpacing: '0.1em',
          marginTop: 10,
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
        }}
      >
        {stat.sub}
      </div>
    </AbsoluteFill>
  );
};

export const KineticStats: React.FC = () => {
  const sceneOpacity = useSceneOpacity(8, 8);

  return (
    <AbsoluteFill style={{opacity: sceneOpacity}}>
      {STATS.map((stat, i) => (
        <StatItem key={stat.number} stat={stat} startFrame={i * STAT_DURATION} />
      ))}
    </AbsoluteFill>
  );
};
