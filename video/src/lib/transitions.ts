import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * Returns a scene-level opacity that fades in at the start
 * and fades out at the end, creating smooth dip-to-black transitions.
 */
export const useSceneOpacity = (
  enterDuration = 15,
  exitDuration = 15,
): number => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const enter = interpolate(frame, [0, enterDuration], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const exit = interpolate(
    frame,
    [durationInFrames - exitDuration, durationInFrames],
    [1, 0],
    {extrapolateRight: 'clamp'},
  );

  return Math.min(enter, exit);
};
