import React from 'react';
import { sharedStyles, mergeStyles, BaseComponentProps } from '../styles/shared';
import type { ColorSwatch as MediaPipeColorSwatch } from '../utils/mediapipeDetection';

interface ColorSwatchesProps extends BaseComponentProps {
  skinSwatches: MediaPipeColorSwatch[];
  eyeSwatches: MediaPipeColorSwatch[];
}

interface SwatchSectionProps {
  title: string;
  emoji: string;
  swatches: MediaPipeColorSwatch[];
  swatchType: 'skin' | 'eye';
}

const SwatchSection: React.FC<SwatchSectionProps> = ({ title, emoji, swatches, swatchType }) => (
  <div className={`${sharedStyles.card} bg-opacity-10 ${sharedStyles.cardCompact}`}>
    <h3 className={sharedStyles.sectionTitleCompact}>
      {emoji} {title}
    </h3>
    <div className={sharedStyles.swatchGrid}>
      {swatches && swatches.length > 0 ? (
        swatches.map((swatch: MediaPipeColorSwatch, index: number) => (
          <div key={index} className="text-center group">
            <div
              className={`w-12 h-12 ${sharedStyles.colorChip}`}
              style={{
                backgroundColor: `rgb(${swatch.r}, ${swatch.g}, ${swatch.b})`,
                minHeight: '48px',
                minWidth: '48px'
              }}
              title={`${swatchType} tone ${index + 1}: RGB(${swatch.r}, ${swatch.g}, ${swatch.b})${
                swatch.lab ? ` | L*a*b*(${swatch.lab.l}, ${swatch.lab.a}, ${swatch.lab.b})` : ''
              }`}
            />
            <p className="text-xs mt-1 text-white opacity-80">#{index + 1}</p>
          </div>
        ))
      ) : (
        <p className="text-sm opacity-70">No {swatchType} tones detected</p>
      )}
    </div>
  </div>
);

const ColorSwatches: React.FC<ColorSwatchesProps> = ({
  skinSwatches,
  eyeSwatches,
  className
}) => {
  return (
    <div className={mergeStyles(sharedStyles.sectionContent, className)}>
      <SwatchSection
        title="Skin Tones"
        emoji="🌸"
        swatches={skinSwatches}
        swatchType="skin"
      />
      <SwatchSection
        title="Eye Colors"
        emoji="👁️"
        swatches={eyeSwatches}
        swatchType="eye"
      />
    </div>
  );
};

export default ColorSwatches;
