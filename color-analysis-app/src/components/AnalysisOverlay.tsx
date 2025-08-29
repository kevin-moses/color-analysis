import React from 'react';
import { sharedStyles, BaseComponentProps } from '../styles/shared';

interface AnalysisOverlayProps extends BaseComponentProps {
  isVisible: boolean;
}

const AnalysisOverlay: React.FC<AnalysisOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className={sharedStyles.fullScreen}>
      <div className="cute-loader text-white">
        <div className="cute-palette">
          <span className="dot dot-1">💗</span>
          <span className="dot dot-2">💜</span>
          <span className="dot dot-3">💙</span>
        </div>
        <p className="mt-4 text-center text-sm font-normal opacity-90 font-korean">
          Analyzing your colors…
        </p>
      </div>
    </div>
  );
};

export default AnalysisOverlay;
