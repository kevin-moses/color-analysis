import React from 'react';
import { sharedStyles, mergeStyles } from '../styles/shared';
import type { BaseComponentProps } from '../types/components';
import type { ColorSwatch as MediaPipeColorSwatch } from '../utils/mediapipeDetection';

interface DominantSkinToneProps extends BaseComponentProps {
  dominantSkinTone: MediaPipeColorSwatch;
}

const DominantSkinTone: React.FC<DominantSkinToneProps> = ({
  dominantSkinTone,
  className
}) => {
  return (
    <div className={mergeStyles(sharedStyles.gradientCard, className)}>
      <h3 className={sharedStyles.sectionTitle}>🎯 Dominant Skin Tone (K-means)</h3>
      <div className="flex justify-center items-center space-x-4">
        <div className="text-center">
          <div
            className={`${sharedStyles.colorChipLarge} mx-auto mb-3`}
            style={{ backgroundColor: dominantSkinTone.color }}
            title={`Dominant skin tone: ${dominantSkinTone.color}`}
          />
          <div className="text-white text-xs space-y-1">
            <p className="font-normal">RGB</p>
            <p>{dominantSkinTone.r}, {dominantSkinTone.g}, {dominantSkinTone.b}</p>
            {dominantSkinTone.lab && (
              <>
                <p className="font-normal mt-2">L*a*b*</p>
                <p>L: {dominantSkinTone.lab.l}</p>
                <p>a: {dominantSkinTone.lab.a}</p>
                <p>b: {dominantSkinTone.lab.b}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DominantSkinTone;
