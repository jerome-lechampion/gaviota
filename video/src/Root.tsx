import React from 'react';
import {Composition} from 'remotion';
import {GaviotaVideo} from './GaviotaVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="GaviotaVideo"
      component={GaviotaVideo}
      durationInFrames={1570} // 52.33s × 30fps
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
