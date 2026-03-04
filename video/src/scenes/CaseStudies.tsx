/**
 * Scene 05 — Case Studies (10s = 300 frames)
 *
 * Four case study cards slide in from the right in a staggered
 * sequence, each showing client, project and a key result.
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
import {useSceneOpacity} from '../lib/transitions';

const ACCENT = '#4AFFB4';
const WHITE = '#ffffff';
const BG = '#05060a';
const CARD_BG = '#0c0d13';

const CASES = [
  {
    client: 'Airbus Defence & Space',
    project: 'Programme Ariane 6',
    tag: 'MISSION CRITICAL',
    tagColor: '#FF6B6B',
    result: 'Validation UML ↔ Ada — pierre angulaire de la certification ESA/CNES',
    logo: 'https://gaviota.fr/assets/logos/airbus.png',
  },
  {
    client: 'TotalEnergies',
    project: 'Plateforme IoT industrielle',
    tag: 'PWA INDUSTRIELLE',
    tagColor: '#FFB347',
    result: 'Monitoring temps réel des usines — Next.js, Node.js, offline-first',
    logo: 'https://gaviota.fr/assets/logos/totalenergies.png',
  },
  {
    client: 'Thales Air Systems',
    project: 'Radar Sea Fire 500',
    tag: 'EMBARQUÉ NAVAL',
    tagColor: '#4D9FFF',
    result: 'Logiciel temps réel durci pour frégates de nouvelle génération',
    logo: 'https://gaviota.fr/assets/logos/thales.png',
  },
  {
    client: 'Alstom Transport',
    project: 'Signalisation Urbalis',
    tag: 'RAIL & MOBILITÉ',
    tagColor: '#B8FF47',
    result: 'Industrialisation QA & validation Ada sur la chaîne CBTC',
    logo: 'https://gaviota.fr/assets/logos/alstom.png',
  },
];

const CaseCard: React.FC<{c: (typeof CASES)[0]; index: number}> = ({
  c,
  index,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const staggerStart = 20 + index * 42;

  const x = spring({
    frame: frame - staggerStart,
    fps,
    config: {damping: 140, stiffness: 65, mass: 0.7},
    from: 130,
    to: 0,
  });

  const opacity = interpolate(frame, [staggerStart, staggerStart + 22], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        backgroundColor: CARD_BG,
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 14,
        padding: '28px 30px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        opacity,
        transform: `translateX(${x}px)`,
        flex: 1,
      }}
    >
      {/* Logo + tag row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Img
          src={c.logo}
          style={{
            height: 26,
            maxWidth: 96,
            objectFit: 'contain',
            filter: 'brightness(0) invert(1)',
            opacity: 0.8,
          }}
        />
        <div
          style={{
            fontFamily,
            fontSize: 9,
            fontWeight: 600,
            color: c.tagColor,
            letterSpacing: '0.2em',
            backgroundColor: `${c.tagColor}1A`,
            padding: '4px 10px',
            borderRadius: 4,
          }}
        >
          {c.tag}
        </div>
      </div>

      {/* Client name */}
      <div
        style={{
          fontFamily,
          fontSize: 19,
          fontWeight: 700,
          color: WHITE,
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
        }}
      >
        {c.client}
      </div>

      {/* Project */}
      <div
        style={{
          fontFamily,
          fontSize: 13,
          fontWeight: 500,
          color: ACCENT,
          letterSpacing: '0.06em',
        }}
      >
        {c.project}
      </div>

      {/* Result */}
      <div
        style={{
          fontFamily,
          fontSize: 14,
          fontWeight: 400,
          color: 'rgba(255,255,255,0.45)',
          lineHeight: 1.55,
          flexGrow: 1,
        }}
      >
        {c.result}
      </div>
    </div>
  );
};

export const CaseStudies: React.FC = () => {
  const frame = useCurrentFrame();
  const sceneOpacity = useSceneOpacity(10, 15);

  const headerOpacity = interpolate(frame, [0, 22], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        padding: '72px 120px',
        display: 'flex',
        flexDirection: 'column',
        opacity: sceneOpacity,
      }}
    >
      {/* Header */}
      <div style={{marginBottom: 44, opacity: headerOpacity}}>
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
          CAS CLIENTS
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 42,
            fontWeight: 700,
            color: WHITE,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}
        >
          Nous propulsons la transformation des{' '}
          <span style={{color: ACCENT}}>leaders industriels.</span>
        </div>
      </div>

      {/* Cards */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 22,
          flexGrow: 1,
        }}
      >
        {CASES.map((c, i) => (
          <CaseCard key={c.client} c={c} index={i} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
