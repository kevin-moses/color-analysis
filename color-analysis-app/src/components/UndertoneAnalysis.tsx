import React from 'react';
import { sharedStyles, mergeStyles } from '../styles/shared';
import type { BaseComponentProps } from '../types/components';
import UndertoneColorMap from './UndertoneColorMap';
import type { ColorSwatch as MediaPipeColorSwatch } from '../utils/mediapipeDetection';

interface UndertoneAnalysisProps extends BaseComponentProps {
  undertone: 'warm' | 'cool' | 'neutral';
  dominantSkinTone?: MediaPipeColorSwatch;
}

const UndertoneAnalysis: React.FC<UndertoneAnalysisProps> = ({
  undertone,
  dominantSkinTone,
  className
}) => {
  const getUndertoneColor = (undertone: string) => {
    switch (undertone) {
      case 'warm': return '#f59e0b';
      case 'cool': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <div className={mergeStyles(`${sharedStyles.card} bg-opacity-15 ${sharedStyles.cardCompact}`, className)}>
      <div className="text-center mb-4">
        <div className="flex items-center justify-center mb-2">
          <div 
            className="w-6 h-6 rounded-full border-2 border-white shadow-sm mr-2"
            style={{ backgroundColor: getUndertoneColor(undertone) }}
          />
          <h3 className="font-bold text-lg">Undertone Analysis</h3>
        </div>
        <p className="capitalize text-xl font-bold">{undertone}</p>
        {dominantSkinTone?.lab && (
          <div className="mt-2 text-xs opacity-90">
            <p className="font-bold">L*a*b* Values</p>
            <p>
              L: {dominantSkinTone.lab.l} | a: {dominantSkinTone.lab.a} | b: {dominantSkinTone.lab.b}
            </p>
          </div>
        )}
      </div>
      
      {/* Color Map Visualization */}
      {dominantSkinTone?.lab && (
        <UndertoneColorMap 
          userLab={dominantSkinTone.lab}
          className="mt-4"
          gridSize={15}
          maxDelta={10}
        />
      )}
    </div>
  );
};

export default UndertoneAnalysis;
