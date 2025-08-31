import { Card } from "./ui/card";

interface UndertoneAnalysisProps {
  undertone: string;
  undertoneColor: string;
  showColorMap?: boolean;
}

export function UndertoneAnalysis({ undertone, undertoneColor, showColorMap = true }: UndertoneAnalysisProps) {
  return (
    <Card className="p-6 bg-card border border-border rounded-2xl shadow-sm">
      <h3 className="text-lg mb-4 text-foreground uppercase tracking-wide font-medium">undertone analysis</h3>
      
      <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-xl">
        <p className="text-xs text-orange-800 mb-1 lowercase font-medium">understanding undertones</p>
        <p className="text-xs text-orange-700 lowercase">
          your undertone is the subtle hue beneath your skin's surface! we analyze the a* and b* values from lab color space - positive a* leans red (warm), negative leans green (cool), while b* shows yellow (warm) vs blue (cool) tendencies.
        </p>
      </div>
      
      <div className="flex items-center space-x-4 mb-6">
        <div
          className="w-12 h-12 rounded-xl border border-border"
          style={{ backgroundColor: undertoneColor }}
        />
        <div>
          <p className="text-foreground lowercase">{undertone.toLowerCase()}</p>
        </div>
      </div>
      
      {showColorMap && (
        <div>
          <h4 className="text-sm mb-3 text-foreground uppercase tracking-wide font-medium">undertone color map</h4>
          <p className="text-xs text-muted-foreground mb-4 lowercase">
            your undertone position relative to others • white border = your value
          </p>
          
          <div className="relative w-full h-48 rounded-xl overflow-hidden">
            {/* Gradient background representing undertone spectrum */}
            <div 
              className="w-full h-full"
              style={{
                background: 'linear-gradient(135deg, #D4A574 0%, #E4C4A6 25%, #F2D7B3 50%, #E8C5A0 75%, #D4A574 100%)'
              }}
            />
            
            {/* User's position marker */}
            <div 
              className="absolute w-8 h-8 border-2 border-white rounded-sm transform -translate-x-1/2 -translate-y-1/2"
              style={{ 
                left: '60%', 
                top: '65%',
                backgroundColor: undertoneColor
              }}
            />
          </div>
          
          <div className="mt-2 text-center">
            <p className="text-xs text-muted-foreground lowercase">↑ warm (yellow)</p>
          </div>
        </div>
      )}
    </Card>
  );
}