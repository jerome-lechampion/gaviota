/**
 * Scene — Screens Cloud (6s = 180 frames)
 *
 * Chaque screen arrive depuis un bord vers SA position dans le nuage,
 * reste visible pendant que d'autres arrivent, puis repart vers le fond.
 * Plusieurs screens coexistent simultanément → effet nuage vivant.
 */
import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

import {fontFamily} from '../lib/fonts';
import {useSceneOpacity} from '../lib/transitions';

const ACCENT = '#00C896';

const STAGGER    = 12;  // frames entre chaque screen
const FLY_IN     = 18;  // frames d'entrée
const HOLD       = 44;  // frames où le screen reste visible (overlap avec les voisins)
const FLY_OUT    = 20;  // frames de recul vers le fond
const SCREEN_DUR = FLY_IN + HOLD + FLY_OUT; // = 82 frames

// dispX/dispY = position dans le nuage (offset px depuis centre 960,540)
// fromX/fromY = point de départ hors écran (direction d'entrée)
const SCREENS = [
  {
    src: staticFile('screens/swap.png'),
    label: 'SWAP GPS', w: 676, aspect: 1341 / 912,
    dispX: -220, dispY: -130,
    fromX: -1000, fromY: -300,
    rx: 4, ry: 18,
  },
  {
    src: staticFile('screens/lubpilot.png'),
    label: 'LubPilot', w: 697, aspect: 1250 / 800,
    dispX: 260,  dispY: -160,
    fromX: 1000, fromY: -200,
    rx: -3, ry: -20,
  },
  {
    src: staticFile('screens/mlp.png'),
    label: 'MLP Platform', w: 658, aspect: 1361 / 928,
    dispX: -30,  dispY: -260,
    fromX: 0,    fromY: -700,
    rx: 18, ry: 0,
  },
  {
    src: staticFile('screens/mypokeCardalog.jpeg'),
    label: 'MyPokéCardaLog', w: 260, aspect: 960 / 2011,
    dispX: -430, dispY: 50,
    fromX: -1000, fromY: 100,
    rx: 0, ry: 22,
  },
  {
    src: staticFile('screens/connectedoil.png'),
    label: 'ConnectedOil', w: 697, aspect: 1901 / 862,
    dispX: 270,  dispY: 190,
    fromX: 1000, fromY: 400,
    rx: -5, ry: -18,
  },
  {
    src: staticFile('screens/entrenador_personnal.png'),
    label: 'Entrenador Personal', w: 637, aspect: 1156 / 923,
    dispX: -210, dispY: 210,
    fromX: -900, fromY: 700,
    rx: -16, ry: 8,
  },
  {
    src: staticFile('screens/so.png'),
    label: 'SO Platform', w: 618, aspect: 1228 / 867,
    dispX: 430,  dispY: -30,
    fromX: 1000, fromY: -500,
    rx: 6, ry: -22,
  },
  {
    src: staticFile('screens/outdated.png'),
    label: 'Release Notes Scanner', w: 658, aspect: 1344 / 925,
    dispX: 50,   dispY: 110,
    fromX: 0,    fromY: 700,
    rx: -12, ry: 4,
  },
  {
    src: staticFile('screens/mon_swap.png'),
    label: 'Mon SWAP', w: 278, aspect: 595 / 1200,
    dispX: 490,  dispY: 120,
    fromX: 1000, fromY: 0,
    rx: 0, ry: -18,
  },
];

const ScreenCard: React.FC<{
  screen: (typeof SCREENS)[0];
  activationFrame: number;
}> = ({screen, activationFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lf = frame - activationFrame;

  if (lf < 0 || lf > SCREEN_DUR) return null;

  // Fly-in : spring depuis hors-écran vers la position dans le nuage
  const flyX = spring({
    frame: lf,
    fps,
    config: {damping: 24, stiffness: 170, mass: 0.6},
    from: screen.fromX,
    to: screen.dispX,
  });
  const flyY = spring({
    frame: lf,
    fps,
    config: {damping: 24, stiffness: 170, mass: 0.6},
    from: screen.fromY,
    to: screen.dispY,
  });

  // Rotation 3D qui se redresse à l'arrivée
  const rotFactor = interpolate(lf, [0, FLY_IN], [1, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Scale-in pendant le fly-in (0.4 → 1)
  const scaleIn = interpolate(lf, [0, FLY_IN], [0.4, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Fly-out : recul vers le fond (scale → 0 depuis la position du nuage)
  const flyOutP = interpolate(lf, [FLY_IN + HOLD, SCREEN_DUR], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  const depthScale = flyOutP > 0 ? (1 - flyOutP * 0.97) : scaleIn;

  // Pendant le fly-out, on fige la position à dispX/dispY (le spring est arrivé)
  const posX = flyOutP > 0 ? screen.dispX : flyX;
  const posY = flyOutP > 0 ? screen.dispY : flyY;

  // Flottement subtil pendant le hold
  const floatY = Math.sin((lf / 30) * 1.4 + activationFrame * 0.3) * 5;

  const opacity =
    interpolate(lf, [0, 10], [0, 1], {extrapolateRight: 'clamp'}) *
    interpolate(lf, [SCREEN_DUR - 8, SCREEN_DUR], [1, 0], {extrapolateRight: 'clamp'});

  const h = screen.w / screen.aspect;

  return (
    <AbsoluteFill
      style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
    >
      <div
        style={{
          transform: `
            translate(${posX}px, ${posY + (flyOutP > 0 ? 0 : floatY)}px)
            scale(${depthScale})
            rotateX(${screen.rx * rotFactor}deg)
            rotateY(${screen.ry * rotFactor}deg)
          `,
          opacity,
          transformStyle: 'preserve-3d',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            borderRadius: 10,
            overflow: 'hidden',
            boxShadow: `
              0 0 0 1.5px rgba(0,200,150,0.4),
              0 0 28px rgba(0,200,150,0.15),
              0 18px 50px rgba(0,0,0,0.28)
            `,
          }}
        >
          <Img
            src={screen.src}
            style={{width: screen.w, height: h, objectFit: 'cover', display: 'block'}}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 55%)',
            pointerEvents: 'none',
          }} />
        </div>
        <div style={{
          fontFamily, fontSize: 12, fontWeight: 600,
          color: ACCENT, letterSpacing: '0.18em',
          marginTop: 10,
          opacity: interpolate(flyOutP, [0, 0.25], [1, 0], {extrapolateRight: 'clamp'}),
        }}>
          {screen.label}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ScreensWarp: React.FC = () => {
  const frame = useCurrentFrame();
  const sceneOpacity = useSceneOpacity(12, 14);

  const labelOpacity =
    interpolate(frame, [6, 20], [0, 1], {extrapolateRight: 'clamp'}) *
    interpolate(frame, [165, 178], [1, 0], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{opacity: sceneOpacity, perspective: '1100px'}}>
      {SCREENS.map((screen, i) => (
        <ScreenCard key={screen.label} screen={screen} activationFrame={i * STAGGER} />
      ))}

      <div style={{
        position: 'absolute', top: 72, left: 100,
        display: 'flex', flexDirection: 'column', gap: 14,
        opacity: labelOpacity, pointerEvents: 'none',
      }}>
        <div style={{fontFamily, fontSize: 13, fontWeight: 600, color: ACCENT, letterSpacing: '0.38em'}}>
          NOS RÉALISATIONS
        </div>
        <div style={{fontFamily, fontSize: 52, fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.03em', lineHeight: 1}}>
          Nos applications
        </div>
        <div style={{width: 56, height: 2, background: ACCENT}} />
      </div>
    </AbsoluteFill>
  );
};
