import React from 'react';
import type { BaseComponentProps } from '../types/components';

interface AnalysisOverlayProps extends BaseComponentProps {
  isVisible: boolean;
}

const pulseKeyframes = {
  animation: 'pulseDots 1.5s ease-in-out infinite',
} as const;

const AnalysisOverlay: React.FC<AnalysisOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card rounded-2xl p-8 mx-4 text-center max-w-sm w-full">
        <div className="mb-4">
          <div className="flex justify-center space-x-1 mb-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-secondary rounded-full"
                style={{
                  ...pulseKeyframes,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
        
        <h3 className="text-lg mb-2 text-foreground uppercase tracking-wide font-bold">analyzing your colors...</h3>
        <p className="text-muted-foreground text-sm mb-3 lowercase">
          our ai is working its magic! here's what's happening:
        </p>
        <div className="text-left text-xs text-muted-foreground space-y-1 lowercase">
          <p>🔍 detecting facial landmarks with mediapipe</p>
          <p>🎨 extracting skin and eye colors</p>
          <p>📊 running k-means clustering analysis</p>
          <p>🧪 converting to lab color space</p>
          <p>✨ determining your color season</p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisOverlay;
