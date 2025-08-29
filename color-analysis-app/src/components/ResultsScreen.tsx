import React from 'react';
import { sharedStyles, mergeStyles, BaseComponentProps } from '../styles/shared';
import DominantSkinTone from './DominantSkinTone';
import ColorSwatches from './ColorSwatches';
import UndertoneAnalysis from './UndertoneAnalysis';
import LandmarkVisualization from './LandmarkVisualization';
import ColorProfile from './ColorProfile';
import AnalysisConfidence from './AnalysisConfidence';
import ITAChart from './ITAChart';
import FitzpatrickScale from './FitzpatrickScale';
import type { AnalysisResults } from '../store/colorAnalysisStore';

interface AnalysisColorsProps {
  skinColor: AnalysisResults['skinColor'];
  eyeColor: AnalysisResults['eyeColor'];
}

const AnalysisColors: React.FC<AnalysisColorsProps> = ({ skinColor, eyeColor }) => (
  <div className={`${sharedStyles.card} bg-opacity-10 ${sharedStyles.cardCompact}`}>
    <h3 className="text-base font-normal mb-4 text-center font-korean">🎯 Analysis Colors</h3>
    <div className={sharedStyles.profileGrid}>
      {[skinColor, eyeColor].filter((swatch): swatch is NonNullable<typeof swatch> => Boolean(swatch)).map((swatch, index) => (
        <div key={index} className="text-center group">
          <div
            className="w-14 h-14 rounded-full mx-auto mb-2 border-2 border-white shadow-lg transition-transform duration-200 group-hover:scale-110"
            style={{ backgroundColor: swatch.color }}
          />
          <p className="text-xs font-normal font-korean">{swatch.name}</p>
          <p className="text-xs opacity-70 leading-tight font-korean">
            RGB: {swatch.rgb.join(', ')}
          </p>
        </div>
      ))}
    </div>
  </div>
);

interface OvertoneDisplayProps {
  overtone: string;
  skinColor: AnalysisResults['skinColor'];
  ita?: number;
  fitzpatrick?: 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';
}

const OvertoneDisplay: React.FC<OvertoneDisplayProps> = ({ overtone, skinColor, ita, fitzpatrick }) => (
  <div className={`${sharedStyles.card} bg-opacity-15 ${sharedStyles.cardCompact} text-center`}>
    <div className="flex items-center justify-center mb-2">
      <div 
        className="w-6 h-6 rounded-full border-2 border-white shadow-sm mr-2"
        style={{ backgroundColor: skinColor.color }}
      />
      <h3 className="font-normal text-sm font-korean">Overtone (ITA)</h3>
    </div>
    <p className="capitalize text-lg font-normal font-korean">{overtone}</p>
    {typeof ita === 'number' && fitzpatrick && (
      <div className="mt-3 text-xs opacity-90">
        <p className="font-korean">ITA: {ita}° • Fitzpatrick: {fitzpatrick}</p>
      </div>
    )}
  </div>
);

interface ResultsScreenProps extends BaseComponentProps {
  results: AnalysisResults;
  selectedImage: string;
  landmarks: any[] | null;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({
  results,
  selectedImage,
  landmarks,
  className
}) => {
  return (
    <section className={mergeStyles(`${sharedStyles.section} ${sharedStyles.fadeIn}`, className)}>
      <div className={`${sharedStyles.card} overflow-hidden`}>
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-4">
          <h2 className="text-xl font-normal text-center text-white font-korean">🎯 Your Color Analysis</h2>
          <p className="text-center text-sm opacity-90 mt-1 font-korean">Powered by AI face detection</p>
        </div>
        
        <div className={`${sharedStyles.cardPadding} ${sharedStyles.sectionContent}`}>
          {/* Dominant Skin Tone */}
          {results.dominantSkinTone && (
            <DominantSkinTone dominantSkinTone={results.dominantSkinTone} />
          )}

          {/* Color Swatches */}
          <ColorSwatches 
            skinSwatches={results.skinSwatches} 
            eyeSwatches={results.eyeSwatches} 
          />

          {/* Analysis Colors */}
          <AnalysisColors 
            skinColor={results.skinColor} 
            eyeColor={results.eyeColor} 
          />

          {/* Analysis Results */}
          <div className="space-y-4">
            {/* Undertone Analysis */}
            <UndertoneAnalysis 
              undertone={results.undertone}
              dominantSkinTone={results.dominantSkinTone}
            />

            {/* Overtone */}
            <OvertoneDisplay 
              overtone={results.overtone}
              skinColor={results.skinColor}
              ita={results.ita}
              fitzpatrick={results.fitzpatrick}
            />

            {/* Landmark Visualization */}
            <LandmarkVisualization 
              selectedImage={selectedImage}
              landmarks={landmarks}
            />
            
            {/* Season - Featured */}
            <div className={sharedStyles.featuredCard}>
              <h3 className="font-normal mb-2 text-lg font-korean">🌟 Your Color Season</h3>
              <p className="capitalize text-2xl font-normal tracking-wide font-korean">{results.season}</p>
            </div>
            
            {/* ITA Chart */}
            {results.dominantSkinTone?.lab && (
              <ITAChart 
                l={results.dominantSkinTone.lab.l} 
                b={results.dominantSkinTone.lab.b} 
                className="mt-4" 
              />
            )}

            {/* Fitzpatrick Scale */}
            {typeof results.ita === 'number' && results.fitzpatrick && (
              <FitzpatrickScale 
                ita={results.ita} 
                fitzpatrick={results.fitzpatrick} 
                className="mt-4" 
              />
            )}

            {/* Color Profile */}
            <ColorProfile dimensions={results.dimensions} />
            
            {/* Analysis Confidence */}
            <AnalysisConfidence confidence={results.confidence} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsScreen;
