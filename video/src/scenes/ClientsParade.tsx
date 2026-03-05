/**
 * Scene 03 — Clients Parade (7s = 210 frames)
 */
import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

import {fontFamily} from '../lib/fonts';
import {useSceneOpacity} from '../lib/transitions';

const TEXT = '#0a0a0a';
const ACCENT = '#00C896';

const CLIENTS = [
  {name: 'Airbus', logo: 'https://gaviota.fr/assets/logos/airbus.png'},
  {name: 'Thales', logo: 'https://gaviota.fr/assets/logos/thales.png'},
  {name: 'Alstom', logo: 'https://gaviota.fr/assets/logos/alstom.png'},
  {name: 'TotalEnergies', logo: 'https://gaviota.fr/assets/logos/totalenergies.png'},
  {name: 'SWAP GPS', logo: 'https://gaviota.fr/assets/logos/swap_gps.png'},
  {
    name: 'STMicroelectronics',
    logo: 'https://gaviota.fr/assets/logos/STMicroelectronics.png',
  },
];

// Words of title for staggered pop-in
const TITLE_WORDS = ['Programmes', 'spatiaux.', 'Ferroviaire.', 'IoT.'];
const ACCENT_WORDS = new Set(['Ferroviaire.']);

export const ClientsParade: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sceneOpacity = useSceneOpacity(10, 15);

  // Eyebrow pop-in
  const eyebrowScale = spring({
    frame,
    fps,
    config: {damping: 18, stiffness: 280, mass: 0.4},
    from: 2.5,
    to: 1,
  });
  const eyebrowOpacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Decorative bottom line
  const lineWidth = interpolate(frame, [120, 185], [0, 680], {
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
        opacity: sceneOpacity,
      }}
    >
      {/* Eyebrow */}
      <div
        style={{
          fontFamily,
          fontSize: 12,
          fontWeight: 600,
          color: ACCENT,
          letterSpacing: '0.38em',
          marginBottom: 14,
          opacity: eyebrowOpacity,
          transform: `scale(${eyebrowScale})`,
          textShadow: 'none',
        }}
      >
        ILS NOUS CONFIENT LEURS PRODUITS CRITIQUES
      </div>

      {/* Title — word by word pop-in */}
      <div
        style={{
          fontFamily,
          fontSize: 50,
          fontWeight: 700,
          color: TEXT,
          letterSpacing: '-0.03em',
          marginBottom: 72,
          textAlign: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0 14px',
        }}
      >
        {TITLE_WORDS.map((word, i) => {
          const delay = 10 + i * 8;
          const wordScale = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: {damping: 16, stiffness: 300, mass: 0.4},
            from: 3,
            to: 1,
          });
          const wordOpacity = interpolate(frame, [delay, delay + 10], [0, 1], {
            extrapolateRight: 'clamp',
          });
          return (
            <span
              key={word}
              style={{
                display: 'inline-block',
                color: ACCENT_WORDS.has(word) ? ACCENT : TEXT,
                transform: `scale(${wordScale})`,
                opacity: wordOpacity,
                transformOrigin: 'center bottom',
                textShadow: 'none',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Logo grid — white on dark bg */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 64,
          maxWidth: 1100,
        }}
      >
        {CLIENTS.map((client, i) => {
          const staggerStart = 35 + i * 18;
          const logoScale = spring({
            frame: Math.max(0, frame - staggerStart),
            fps,
            config: {damping: 16, stiffness: 280, mass: 0.45},
            from: 2.8,
            to: 1,
          });
          const logoOpacity = interpolate(
            frame,
            [staggerStart, staggerStart + 16],
            [0, 1],
            {extrapolateRight: 'clamp'},
          );

          return (
            <div
              key={client.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 180,
                height: 70,
                opacity: logoOpacity,
                transform: `scale(${logoScale})`,
              }}
            >
              <Img
                src={client.logo}
                style={{
                  maxWidth: 160,
                  maxHeight: 56,
                  objectFit: 'contain',
                  filter: 'brightness(0)',
                  opacity: 0.75,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Glowing bottom line */}
      <div
        style={{
          marginTop: 72,
          width: lineWidth,
          height: 1,
          background: `linear-gradient(to right, transparent, ${ACCENT}, transparent)`,
          boxShadow: `0 0 10px rgba(0,200,150,0.5)`,
        }}
      />
    </AbsoluteFill>
  );
};
