import React, { useRef } from 'react';
import { sharedStyles, mergeStyles, BaseComponentProps } from '../styles/shared';

interface ProcessingScreenProps extends BaseComponentProps {
  selectedImage: string;
  isAnalyzing: boolean;
  onAnalyzeColors: () => void;
  imageRef?: React.RefObject<HTMLImageElement>;
  overlayRef?: React.RefObject<HTMLCanvasElement>;
}

const ProcessingScreen: React.FC<ProcessingScreenProps> = ({
  selectedImage,
  isAnalyzing,
  onAnalyzeColors,
  imageRef: externalImageRef,
  overlayRef: externalOverlayRef,
  className
}) => {
  const internalImageRef = useRef<HTMLImageElement>(null);
  const internalOverlayRef = useRef<HTMLCanvasElement>(null);
  
  const imageRef = externalImageRef || internalImageRef;
  const overlayRef = externalOverlayRef || internalOverlayRef;

  return (
    <section className={mergeStyles(sharedStyles.section, className)}>
      <div className={`${sharedStyles.card} ${sharedStyles.cardCompact}`}>
        <div className={sharedStyles.imageContainer}>
          <img
            ref={imageRef}
            src={selectedImage}
            alt="Selected photo for analysis"
            className={sharedStyles.image}
            crossOrigin="anonymous"
          />
          {/* landmarks overlay */}
          <canvas 
            ref={overlayRef} 
            className={sharedStyles.overlay}
            style={{ zIndex: 20 }}
          />
          <div 
            className={sharedStyles.imageGradient}
            style={{ zIndex: 10 }}
          />
        </div>
        
        <button
          onClick={onAnalyzeColors}
          disabled={isAnalyzing}
          className={sharedStyles.buttonPrimary}
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center gap-2 font-korean">
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              Analyzing Colors...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2 font-korean">
              🎨 Start Color Analysis
            </span>
          )}
        </button>
      </div>
    </section>
  );
};

export default ProcessingScreen;
export { ProcessingScreen };
