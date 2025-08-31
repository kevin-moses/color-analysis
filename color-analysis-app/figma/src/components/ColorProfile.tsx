import { Card } from "./ui/card";

interface ColorProfileProps {
  value: number;
  chroma: number;
  hue: number;
}

export function ColorProfile({ value, chroma, hue }: ColorProfileProps) {
  const getTemperatureLabel = (hue: number) => {
    if (hue >= 45 && hue <= 135) return 'Warm';
    if (hue >= 225 && hue <= 315) return 'Cool';
    return 'Neutral';
  };

  return (
    <Card className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <h3 className="text-lg mb-4 text-black">Color Profile</h3>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Value (Lightness)</span>
          <span className="text-black">{value.toFixed(1)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Chroma (Saturation)</span>
          <span className="text-black">{chroma.toFixed(1)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Hue (Temperature)</span>
          <div className="text-right">
            <span className="text-black">{hue.toFixed(1)}°</span>
            <p className="text-sm text-secondary">{getTemperatureLabel(hue)}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <p className="text-xs text-gray-800 mb-2">Understanding Your Color Profile:</p>
        <div className="space-y-1 text-xs text-gray-600">
          <p><strong>Value:</strong> How light or dark your overall coloring is (0-100 scale)</p>
          <p><strong>Chroma:</strong> How muted or saturated your colors are (0-100+ scale)</p>
          <p><strong>Hue:</strong> Your color temperature - warm (yellow-based) vs cool (blue-based)</p>
        </div>
      </div>
    </Card>
  );
}