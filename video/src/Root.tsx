import React from 'react';
import {Composition} from 'remotion';
import {GaviotaVideo} from './GaviotaVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="GaviotaVideo"
      component={GaviotaVideo}
      durationInFrames={1500} // 50s × 30fps (CaseStudies removed)
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
