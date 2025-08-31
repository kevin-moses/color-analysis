import { Card } from "./ui/card";

interface ColorSwatchesProps {
  title: string;
  colors: string[];
  showLabels?: boolean;
  description?: string;
}

export function ColorSwatches({ title, colors, showLabels = true, description }: ColorSwatchesProps) {
  return (
    <Card className="p-6 bg-card border border-border rounded-2xl shadow-sm">
      <h3 className="text-lg mb-2 text-foreground uppercase tracking-wide font-medium">{title.toLowerCase()}</h3>
      {description && (
        <p className="text-xs text-muted-foreground mb-4 lowercase">{description}</p>
      )}
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
        {colors.map((color, index) => (
          <div key={index} className="text-center">
            <div
              className="w-full aspect-square rounded-xl border border-border mb-2"
              style={{ backgroundColor: color }}
            />
            {showLabels && (
              <span className="text-xs text-muted-foreground lowercase">#{index + 1}</span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}