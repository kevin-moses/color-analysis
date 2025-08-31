import { Card } from "./ui/card";

interface AnalysisColorsProps {
  skinColor: string;
  skinRgb: string;
  eyeColor: string;
  eyeRgb: string;
}

export function AnalysisColors({ skinColor, skinRgb, eyeColor, eyeRgb }: AnalysisColorsProps) {
  return (
    <Card className="p-6 bg-card border border-border rounded-2xl shadow-sm">
      <h3 className="text-lg mb-2 text-foreground uppercase tracking-wide font-medium">analysis colors</h3>
      <p className="text-xs text-muted-foreground mb-4 lowercase">
        these are the averaged colors we used for your season analysis - your representative skin tone and eye color after processing all the swatches above.
      </p>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="text-center">
          <div
            className="w-full aspect-square rounded-xl border border-border mb-3"
            style={{ backgroundColor: skinColor }}
          />
          <p className="text-sm mb-1 text-foreground lowercase">skin</p>
          <p className="text-xs text-muted-foreground lowercase">rgb: {skinRgb}</p>
        </div>
        
        <div className="text-center">
          <div
            className="w-full aspect-square rounded-xl border border-border mb-3"
            style={{ backgroundColor: eyeColor }}
          />
          <p className="text-sm mb-1 text-foreground lowercase">eyes</p>
          <p className="text-xs text-muted-foreground lowercase">rgb: {eyeRgb}</p>
        </div>
      </div>
    </Card>
  );
}