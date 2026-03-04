/**
 * Scene 02 — Kinetic Stats (5s = 150 frames)
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
const STAT_DURATION = 50;

const STATS = [
  {number: '20+', label: 'PLATEFORMES & APPS LANCÉES', sub: 'depuis 2018'},
  {number: '99%', label: 'SATISFACTION CLIENT', sub: 'comités projets grands comptes'},
  {number: '45j', label: "DE L'IDÉE AU MVP", sub: 'delivery cadencé, zéro bullshit'},
];

const StatItem: React.FC<{
  stat: (typeof STATS)[0];
  startFrame: number;
}> = ({stat, startFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = frame - startFrame;

  if (localFrame < 0 || localFrame >= STAT_DURATION) return null;

  const scale = spring({
    frame: localFrame,
    fps,
    config: {damping: 200, stiffness: 100, mass: 0.4},
    from: 1.5,
    to: 1,
  });

  const opacity = interpolate(
    localFrame,
    [0, 8, STAT_DURATION - 12, STAT_DURATION],
    [0, 1, 1, 0],
    {extrapolateRight: 'clamp'},
  );

  const labelY = interpolate(localFrame, [0, 22], [28, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const barScale = interpolate(localFrame, [0, 18], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
      }}
    >
      {/* Vertical accent bar */}
      <div
        style={{
          width: 4,
          height: 56,
          backgroundColor: ACCENT,
          marginBottom: 28,
          transform: `scaleY(${barScale})`,
          transformOrigin: 'top',
        }}
      />

      {/* Big number */}
      <div
        style={{
          fontFamily,
          fontSize: 210,
          fontWeight: 700,
          color: TEXT,
          letterSpacing: '-0.06em',
          lineHeight: 0.85,
          transform: `scale(${scale})`,
          fontVariantNumeric: 'tabular-nums',
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
          transform: `translateY(${labelY}px)`,
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
          transform: `translateY(${labelY}px)`,
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
    <AbsoluteFill style={{backgroundColor: BG, opacity: sceneOpacity}}>
      {STATS.map((stat, i) => (
        <StatItem key={stat.number} stat={stat} startFrame={i * STAT_DURATION} />
      ))}
    </AbsoluteFill>
  );
};
