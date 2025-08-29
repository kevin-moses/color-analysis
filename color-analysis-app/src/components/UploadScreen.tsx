import React, { useRef } from 'react';
import { sharedStyles, mergeStyles, BaseComponentProps } from '../styles/shared';

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
    <section className={mergeStyles(sharedStyles.section, className)}>
      <div className={`${sharedStyles.card} ${sharedStyles.cardPadding}`}>
        <h2 className={sharedStyles.sectionTitle}>📸 Choose Your Photo</h2>
        <div className="space-y-3">
          <button
            onClick={handleUploadClick}
            className={sharedStyles.buttonSecondary}
          >
            <span className="flex items-center justify-center gap-2 font-korean">
              📱 Upload from Camera Roll
            </span>
          </button>
          
          <button
            onClick={onLoadTestImage}
            className={sharedStyles.buttonTertiary}
          >
            <span className="flex items-center justify-center gap-2 font-korean">
              🖼️ Try Sample Image
            </span>
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={onImageUpload}
            className="hidden"
          />
        </div>
      </div>
    </section>
  );
};

export default UploadScreen;
