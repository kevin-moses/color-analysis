import { Camera, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface UploadScreenProps {
  onImageSelect: (file: File) => void;
  onSampleImage: () => void;
}

export function UploadScreen({ onImageSelect, onSampleImage }: UploadScreenProps) {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col font-['Inter']">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl mb-2 text-foreground uppercase tracking-wide font-medium">color analysis</h1>
          <p className="text-muted-foreground mb-4 lowercase">discover your personal color palette using ai</p>
          
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-left">
            <h3 className="text-sm mb-2 text-orange-800 uppercase font-medium tracking-wide">for best results:</h3>
            <ul className="text-xs text-orange-700 space-y-1 lowercase">
              <li>• use natural lighting (near a window)</li>
              <li>• take a front-facing selfie or portrait</li>
              <li>• remove heavy makeup if possible</li>
              <li>• ensure your face is well-lit and clear</li>
              <li>• avoid harsh shadows or yellow lighting</li>
            </ul>
          </div>
        </div>

        <Card className="w-full p-6 bg-card border border-border rounded-2xl shadow-sm">
          <div className="space-y-4">
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button
                  type="button"
                  className="w-full h-14 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl gap-3 lowercase font-medium"
                  asChild
                >
                  <span className="cursor-pointer">
                    <Upload size={20} />
                    upload from camera roll
                  </span>
                </Button>
              </label>
            </div>
            
            <Button
              onClick={onSampleImage}
              variant="outline"
              className="w-full h-14 border-secondary text-secondary hover:bg-secondary/5 rounded-xl gap-3 lowercase font-medium"
            >
              <Camera size={20} />
              try sample image
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}