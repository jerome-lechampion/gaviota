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

const BG = '#ffffff';
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

export const ClientsParade: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sceneOpacity = useSceneOpacity(10, 15);

  const titleOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const titleY = interpolate(frame, [0, 25], [40, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const lineWidth = interpolate(frame, [120, 185], [0, 680], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
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
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        ILS NOUS CONFIENT LEURS PRODUITS CRITIQUES
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily,
          fontSize: 50,
          fontWeight: 700,
          color: TEXT,
          letterSpacing: '-0.03em',
          marginBottom: 72,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          textAlign: 'center',
        }}
      >
        Programmes spatiaux.{' '}
        <span style={{color: ACCENT}}>Ferroviaire.</span> IoT.
      </div>

      {/* Logo grid — brightness(0) renders logos black on white bg */}
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
          const staggerStart = 30 + i * 20;
          const logoY = spring({
            frame: frame - staggerStart,
            fps,
            config: {damping: 180, stiffness: 70},
            from: 40,
            to: 0,
          });
          const logoOpacity = interpolate(
            frame,
            [staggerStart, staggerStart + 22],
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
                transform: `translateY(${logoY}px)`,
              }}
            >
              <Img
                src={client.logo}
                style={{
                  maxWidth: 160,
                  maxHeight: 56,
                  objectFit: 'contain',
                  // brightness(0) → black logos, readable on white bg
                  filter: 'brightness(0)',
                  opacity: 0.75,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Decorative bottom line */}
      <div
        style={{
          marginTop: 72,
          width: lineWidth,
          height: 1,
          backgroundColor: ACCENT,
          opacity: 0.5,
        }}
      />
    </AbsoluteFill>
  );
};
