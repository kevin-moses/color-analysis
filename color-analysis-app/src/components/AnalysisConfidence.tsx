import React from 'react';
import { sharedStyles, mergeStyles, BaseComponentProps } from '../styles/shared';

interface AnalysisConfidenceProps extends BaseComponentProps {
  confidence: number;
}

const AnalysisConfidence: React.FC<AnalysisConfidenceProps> = ({
  confidence,
  className
}) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence > 70) {
      return 'linear-gradient(90deg, #10b981, #34d399)';
    } else if (confidence > 50) {
      return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
    } else {
      return 'linear-gradient(90deg, #ef4444, #f87171)';
    }
  };

  return (
    <div className={mergeStyles(`${sharedStyles.card} bg-opacity-15 ${sharedStyles.cardCompact}`, className)}>
      <h3 className="font-normal mb-3 text-center font-korean">✨ Analysis Confidence</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm opacity-90 font-korean">Accuracy</span>
          <span className="text-lg font-normal font-korean">{Math.round(confidence)}%</span>
        </div>
        <div className="w-full bg-white bg-opacity-20 rounded-full h-4 overflow-hidden">
          <div 
            className="h-4 rounded-full transition-all duration-1000 ease-out relative"
            style={{ 
              width: `${confidence}%`,
              background: getConfidenceColor(confidence)
            }}
          >
            <div className="absolute inset-0 bg-white bg-opacity-20 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisConfidence;
