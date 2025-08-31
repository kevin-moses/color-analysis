import React, { useRef } from 'react';
import type { BaseComponentProps } from '../types/components';

interface UploadScreenProps extends BaseComponentProps {
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLoadTestImage: () => void;
}

const UploadScreen: React.FC<UploadScreenProps> = ({
  onImageUpload,
  onLoadTestImage,
  className
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`min-h-screen bg-background p-4 flex flex-col font-inter ${className || ''}`}>
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl mb-2 text-foreground uppercase tracking-wide font-medium">
            color analysis
          </h1>
          <p className="text-muted-foreground mb-4 lowercase">
            discover your personal color palette using ai
          </p>
          
          <div className="bg-[#ffedd5] border border-orange-200 rounded-xl p-4 text-left">
            <h3 className="text-sm mb-2 text-orange-800 uppercase font-medium tracking-wide">
              for best results:
            </h3>
            <ul className="list-disc pl-5 marker:text-orange-600 text-xs text-orange-700 space-y-1 lowercase">
              <li>use natural lighting (near a window)</li>
              <li>take a front-facing selfie or portrait</li>
              <li>remove heavy makeup if possible</li>
              <li>ensure your face is well-lit and clear</li>
              <li>avoid harsh shadows or yellow lighting</li>
            </ul>
          </div>
        </div>

        <div className="w-full p-6 bg-card border border-border rounded-2xl shadow-sm">
          <div className="space-y-4">
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={onImageUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="w-full h-14 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl gap-3 lowercase font-medium flex items-center justify-center cursor-pointer transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7,10 12,15 17,10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  upload from camera roll
                </button>
              </label>
            </div>
            
            <button
              onClick={onLoadTestImage}
              className="w-full h-14 border border-secondary text-secondary hover:bg-secondary/5 rounded-xl gap-3 lowercase font-medium flex items-center justify-center transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                <circle cx="12" cy="13" r="3"/>
              </svg>
              try sample image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadScreen;
