import { useRef, useEffect } from "react";
import { Card } from "./ui/card";

interface LandmarkVisualizationProps {
  imageUrl: string;
  landmarks?: Array<{ x: number; y: number; type: 'primary' | 'secondary' | 'excluded' }>;
}

export function LandmarkVisualization({ imageUrl, landmarks = [] }: LandmarkVisualizationProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (imageRef.current && canvasRef.current) {
      const img = imageRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      const drawLandmarks = () => {
        const rect = img.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Mock landmarks if none provided
          const defaultLandmarks = [
            // Primary analysis points (red)
            { x: rect.width * 0.35, y: rect.height * 0.45, type: 'primary' as const },
            { x: rect.width * 0.65, y: rect.height * 0.45, type: 'primary' as const },
            { x: rect.width * 0.5, y: rect.height * 0.6, type: 'primary' as const },
            { x: rect.width * 0.4, y: rect.height * 0.55, type: 'primary' as const },
            { x: rect.width * 0.6, y: rect.height * 0.55, type: 'primary' as const },
            
            // Secondary points (white/faint)
            { x: rect.width * 0.3, y: rect.height * 0.4, type: 'secondary' as const },
            { x: rect.width * 0.7, y: rect.height * 0.4, type: 'secondary' as const },
            { x: rect.width * 0.45, y: rect.height * 0.5, type: 'secondary' as const },
            { x: rect.width * 0.55, y: rect.height * 0.5, type: 'secondary' as const },
            
            // Excluded points (cyan)
            { x: rect.width * 0.4, y: rect.height * 0.35, type: 'excluded' as const },
            { x: rect.width * 0.6, y: rect.height * 0.35, type: 'excluded' as const },
          ];
          
          const pointsToRender = landmarks.length > 0 ? landmarks : defaultLandmarks;
          
          pointsToRender.forEach(point => {
            ctx.beginPath();
            
            switch (point.type) {
              case 'primary':
                ctx.fillStyle = '#ef4444'; // Red
                ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
                break;
              case 'secondary':
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // White/faint
                ctx.strokeStyle = '#666';
                ctx.lineWidth = 1;
                ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
                return;
              case 'excluded':
                ctx.fillStyle = '#06b6d4'; // Cyan
                ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
                break;
            }
            
            ctx.fill();
          });
        }
      };
      
      img.onload = drawLandmarks;
      window.addEventListener('resize', drawLandmarks);
      
      return () => window.removeEventListener('resize', drawLandmarks);
    }
  }, [imageUrl, landmarks]);

  return (
    <Card className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <h3 className="text-lg mb-4 text-black">Analysis Landmarks</h3>
      
      <div className="mb-4 p-3 bg-cyan-50 border border-cyan-200 rounded-xl">
        <p className="text-xs text-cyan-800 mb-1">How MediaPipe Works</p>
        <p className="text-xs text-cyan-700">
          MediaPipe is Google's AI that can detect 468 facial landmarks in real-time! We use specific points on your cheeks, forehead, and around your eyes to sample skin color while avoiding areas like eyebrows and hairline that could skew results.
        </p>
      </div>
      
      <div className="relative rounded-xl overflow-hidden">
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Analysis landmarks"
          className="w-full h-auto"
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 pointer-events-none"
        />
      </div>
      
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-gray-600">Primary analysis points (median target skin landmarks)</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-white border border-gray-400 rounded-full"></div>
          <span className="text-gray-600">Other skin-region indices</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
          <span className="text-gray-600">Excluded (brows/hairline)</span>
        </div>
      </div>
    </Card>
  );
}