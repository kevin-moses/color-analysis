import React from 'react';
import { sharedStyles, mergeStyles } from '../styles/shared';
import type { BaseComponentProps } from '../types/components';

interface ColorDimensions {
  hue: 'warm' | 'cool' | 'neutral';
  value: 'light' | 'medium' | 'dark';
  chroma: 'bright' | 'muted';
}

interface ColorProfileProps extends BaseComponentProps {
  dimensions: ColorDimensions;
}

const ColorProfile: React.FC<ColorProfileProps> = ({
  dimensions,
  className
}) => {
  return (
    <div className={mergeStyles(`${sharedStyles.card} bg-opacity-15 ${sharedStyles.cardCompact}`, className)}>
      <h3 className="font-bold mb-3 text-center">📊 Color Profile</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-90">Value (Lightness):</span>
          <span className="capitalize font-bold bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
            {dimensions.value}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-90">Chroma (Intensity):</span>
          <span className="capitalize font-bold bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
            {dimensions.chroma}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-90">Hue (Temperature):</span>
          <span className="capitalize font-bold bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
            {dimensions.hue}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ColorProfile;
