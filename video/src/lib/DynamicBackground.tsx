/**
 * Animated background — dark base + floating gradient orbs + dot grid
 * Used as a shared layer behind all scenes.
 */
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

export const DynamicBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;

  // Slowly drifting orbs — sin/cos float
  const o1x = 12 + Math.sin(t * 0.28) * 9;
  const o1y = 18 + Math.cos(t * 0.2) * 11;

  const o2x = 78 + Math.cos(t * 0.22) * 11;
  const o2y = 68 + Math.sin(t * 0.32) * 9;

  const o3x = 52 + Math.sin(t * 0.38 + 1.2) * 13;
  const o3y = 28 + Math.cos(t * 0.27 + 0.6) * 9;

  const o4x = 28 + Math.cos(t * 0.18 + 2.1) * 7;
  const o4y = 78 + Math.sin(t * 0.25 + 1.0) * 11;

  return (
    <AbsoluteFill style={{backgroundColor: '#f8f8f6', overflow: 'hidden'}}>
      {/* Subtle dot grid */}
      <AbsoluteFill
        style={{
          backgroundImage:
            'radial-gradient(rgba(0,0,0,0.07) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
        }}
      />

      {/* Orb 1 — main teal, large, top-left */}
      <div
        style={{
          position: 'absolute',
          left: `${o1x}%`,
          top: `${o1y}%`,
          width: 780,
          height: 780,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(0,200,150,0.22) 0%, rgba(0,200,150,0.07) 45%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(28px)',
        }}
      />

      {/* Orb 2 — cyan-blue, bottom-right */}
      <div
        style={{
          position: 'absolute',
          left: `${o2x}%`,
          top: `${o2y}%`,
          width: 560,
          height: 560,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(0,190,230,0.16) 0%, rgba(0,190,230,0.05) 45%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(36px)',
        }}
      />

      {/* Orb 3 — bright green, center */}
      <div
        style={{
          position: 'absolute',
          left: `${o3x}%`,
          top: `${o3y}%`,
          width: 340,
          height: 340,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(0,210,160,0.18) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Orb 4 — lavender accent, bottom-left */}
      <div
        style={{
          position: 'absolute',
          left: `${o4x}%`,
          top: `${o4y}%`,
          width: 440,
          height: 440,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(130,100,255,0.1) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(32px)',
        }}
      />

      {/* Thin diagonal accent line 1 */}
      <div
        style={{
          position: 'absolute',
          left: `${-10 + Math.sin(t * 0.12) * 5}%`,
          top: '0%',
          width: 1,
          height: '160%',
          background:
            'linear-gradient(to bottom, transparent, rgba(0,200,150,0.18) 30%, rgba(0,200,150,0.08) 70%, transparent)',
          transform: `rotate(${18 + Math.sin(t * 0.1) * 2}deg)`,
          transformOrigin: 'top left',
        }}
      />
      {/* Thin diagonal accent line 2 */}
      <div
        style={{
          position: 'absolute',
          left: `${65 + Math.cos(t * 0.14) * 4}%`,
          top: '0%',
          width: 1,
          height: '160%',
          background:
            'linear-gradient(to bottom, transparent, rgba(0,190,230,0.14) 40%, transparent)',
          transform: `rotate(${-14 + Math.cos(t * 0.09) * 2}deg)`,
          transformOrigin: 'top left',
        }}
      />
    </AbsoluteFill>
  );
};
