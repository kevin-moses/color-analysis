import { Card } from "./ui/card";

interface DominantSkinToneProps {
  color: string;
  rgb: string;
  lab?: {
    l: number;
    a: number;
    b: number;
  };
}

export function DominantSkinTone({ color, rgb, lab }: DominantSkinToneProps) {
  return (
    <Card className="p-6 bg-card border border-border rounded-2xl shadow-sm">
      <h3 className="text-lg mb-4 text-foreground uppercase tracking-wide font-medium">dominant skin tone (k-means)</h3>
      
      <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-xl">
        <p className="text-xs text-orange-800 mb-1 lowercase font-medium">what is k-means?</p>
        <p className="text-xs text-orange-700 lowercase">
          k-means is a smart algorithm that groups similar colors together! it analyzed thousands of pixels from your skin areas and found the most representative color that appears most frequently. think of it as finding the "average" of all your skin tones.
        </p>
      </div>
      
      <div className="flex flex-col items-center space-y-4">
        <div
          className="w-24 h-16 rounded-xl border border-border"
          style={{ backgroundColor: color }}
        />
        
        <div className="text-center space-y-2">
          <div>
            <p className="text-sm text-muted-foreground mb-1 lowercase">rgb</p>
            <p className="text-foreground lowercase">{rgb}</p>
          </div>
          
          {lab && (
            <div>
              <p className="text-sm text-muted-foreground mb-1 lowercase">l*a*b* color space</p>
              <div className="space-y-1 text-sm text-foreground mb-2 lowercase">
                <p>l: {lab.l.toFixed(1)} (lightness)</p>
                <p>a: {lab.a.toFixed(1)} (green ↔ red)</p>
                <p>b: {lab.b.toFixed(1)} (blue ↔ yellow)</p>
              </div>
              <p className="text-xs text-muted-foreground lowercase">
                lab values help us measure colors the way your eyes actually see them! more accurate than regular rgb for color analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}