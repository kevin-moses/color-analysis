import React from 'react';
import { sharedStyles, mergeStyles, BaseComponentProps } from '../styles/shared';

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
      <h3 className="font-normal mb-3 text-center font-korean">📊 Color Profile</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-90 font-korean">Value (Lightness):</span>
          <span className="capitalize font-normal bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-korean">
            {dimensions.value}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-90 font-korean">Chroma (Intensity):</span>
          <span className="capitalize font-normal bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-korean">
            {dimensions.chroma}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-90 font-korean">Hue (Temperature):</span>
          <span className="capitalize font-normal bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-korean">
            {dimensions.hue}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ColorProfile;
