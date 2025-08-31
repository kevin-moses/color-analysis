import { useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface ProcessingScreenProps {
  imageUrl: string;
  onStartAnalysis: () => void;
}

export function ProcessingScreen({ imageUrl, onStartAnalysis }: ProcessingScreenProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (imageRef.current && overlayRef.current) {
      const img = imageRef.current;
      const canvas = overlayRef.current;
      const ctx = canvas.getContext('2d');
      
      const updateCanvas = () => {
        const rect = img.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        
        // Draw median landmarks (mock data for demo)
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = 'rgba(249, 115, 22, 0.8)';
          
          // Mock landmark positions
          const landmarks = [
            { x: rect.width * 0.3, y: rect.height * 0.4 },
            { x: rect.width * 0.7, y: rect.height * 0.4 },
            { x: rect.width * 0.5, y: rect.height * 0.6 },
          ];
          
          landmarks.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
            ctx.fill();
          });
        }
      };
      
      img.onload = updateCanvas;
      window.addEventListener('resize', updateCanvas);
      
      return () => window.removeEventListener('resize', updateCanvas);
    }
  }, [imageUrl]);

  return (
    <div className="min-h-screen bg-background p-4 font-['Inter']">
      <div className="max-w-md mx-auto">
        <div className="mb-4 text-center">
          <h2 className="text-lg mb-2 text-foreground uppercase tracking-wide font-medium">ready for analysis</h2>
          <p className="text-sm text-muted-foreground lowercase">
            orange dots show where our ai will sample your skin color
          </p>
        </div>
        <Card className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm mb-6">
          <div className="relative">
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Selected for analysis"
              className="w-full h-auto"
            />
            <canvas
              ref={overlayRef}
              className="absolute top-0 left-0 pointer-events-none"
            />
          </div>
        </Card>
        
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-xl">
          <p className="text-xs text-orange-800 mb-1 lowercase font-medium">what happens next:</p>
          <p className="text-xs text-orange-700 lowercase">
            we'll analyze 468 facial landmarks, extract colors from specific skin areas, convert them to lab color space, and run statistical analysis to determine your color season!
          </p>
        </div>
        
        <Button
          onClick={onStartAnalysis}
          className="w-full h-14 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl lowercase font-medium"
        >
          start color analysis
        </Button>
      </div>
    </div>
  );
}