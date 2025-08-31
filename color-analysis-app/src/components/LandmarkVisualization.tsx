import React, { useRef, useEffect } from 'react';
import { sharedStyles, mergeStyles } from '../styles/shared';
import type { BaseComponentProps } from '../types/components';
import { drawColorCodedLandmarksOverlay } from '../utils/mediapipeDetection';

interface LandmarkVisualizationProps extends BaseComponentProps {
  selectedImage: string | null;
  landmarks: any[] | null;
}

const LandmarkVisualization: React.FC<LandmarkVisualizationProps> = ({ 
  selectedImage, 
  landmarks,
  className 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!selectedImage || !landmarks || !canvasRef.current || !imgRef.current) return;

    const canvas = canvasRef.current;
    const img = imgRef.current;

    const drawLandmarks = () => {
      if (!canvas || !img) return;
      
      canvas.width = img.offsetWidth;
      canvas.height = img.offsetHeight;
      
      console.log(`🎯 Drawing landmarks on ${canvas.width}x${canvas.height} canvas`);
      drawColorCodedLandmarksOverlay(canvas, landmarks);
    };

    if (img.complete && img.naturalWidth > 0) {
      drawLandmarks();
    } else {
      img.addEventListener('load', drawLandmarks, { once: true });
    }
  }, [selectedImage, landmarks]);

  if (!selectedImage || !landmarks) return null;

  return (
    <div className={mergeStyles(`${sharedStyles.card} bg-opacity-15 ${sharedStyles.cardCompact}`, className)}>
      <h3 className="font-bold text-center mb-4">🎯 Analysis Landmarks</h3>
      <div className="relative rounded-lg overflow-hidden border border-white border-opacity-20">
        <img
          ref={imgRef}
          src={selectedImage}
          alt="Facial landmarks analysis"
          className="w-full h-auto object-cover block"
          crossOrigin="anonymous"
        />
        <canvas
          ref={canvasRef}
          className={sharedStyles.overlay}
          style={{ zIndex: 10 }}
        />
      </div>
      <div className="mt-3 p-3 bg-black bg-opacity-30 rounded-lg text-xs">
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 border border-white"></div>
            <span>Primary analysis points (cheeks, nose, chin)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white opacity-60"></div>
            <span>Other skin regions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400 border border-white"></div>
            <span>Excluded areas (eyebrows, hairline)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandmarkVisualization;
