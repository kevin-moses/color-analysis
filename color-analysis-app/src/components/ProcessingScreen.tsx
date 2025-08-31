import React, { useRef, useEffect } from 'react';
import type { BaseComponentProps } from '../types/components';

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

  // Keep overlay canvas in sync with displayed image size; draw demo dots
  useEffect(() => {
    const img = imageRef.current;
    const canvas = overlayRef.current;
    if (!img || !canvas) return;

    const ctx = canvas.getContext('2d');
    const updateCanvas = () => {
      const rect = img.getBoundingClientRect();
      canvas.width = Math.round(rect.width);
      canvas.height = Math.round(rect.height);
      canvas.style.width = `${Math.round(rect.width)}px`;
      canvas.style.height = `${Math.round(rect.height)}px`;

      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Subtle preview markers (orange) showing where sampling will occur
      ctx.fillStyle = 'rgba(249,115,22,0.85)';
      const demo = [
        { x: canvas.width * 0.32, y: canvas.height * 0.42 },
        { x: canvas.width * 0.68, y: canvas.height * 0.42 },
        { x: canvas.width * 0.50, y: canvas.height * 0.62 }
      ];
      demo.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    if (img.complete) updateCanvas();
    img.addEventListener('load', updateCanvas, { once: true });
    window.addEventListener('resize', updateCanvas);
    return () => {
      window.removeEventListener('resize', updateCanvas);
    };
  }, [selectedImage]);

  return (
    <div className={`min-h-screen bg-background p-4 ${className || ''}`}>
      <div className="max-w-md mx-auto">
        <div className="mb-4 text-center">
          <h2 className="text-lg mb-2 text-foreground uppercase tracking-wide font-bold">ready for analysis</h2>
          <p className="text-sm text-muted-foreground lowercase">
            orange dots show where our ai will sample your skin color
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm mb-6">
          <div className="relative">
            <img
              ref={imageRef}
              src={selectedImage}
              alt="Selected for analysis"
              className="w-full h-auto"
              crossOrigin="anonymous"
            />
            <canvas
              ref={overlayRef}
              className="absolute top-0 left-0 pointer-events-none"
              style={{ zIndex: 20 }}
            />
          </div>
        </div>

        <div className="mb-4 p-3 bg-[#fff7ed] border border-orange-200 rounded-xl">
          <p className="text-xs text-orange-800 mb-1 lowercase font-bold">what happens next:</p>
          <p className="text-xs text-orange-700 lowercase">
            we'll analyze 468 facial landmarks, extract colors from specific skin areas, convert them to lab color space, and run statistical analysis to determine your color season!
          </p>
        </div>

        <button
          onClick={onAnalyzeColors}
          disabled={isAnalyzing}
          className="w-full h-14 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl lowercase font-bold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              analyzing colors...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              start color analysis
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProcessingScreen;
export { ProcessingScreen };
