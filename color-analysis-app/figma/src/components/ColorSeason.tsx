import { Card } from "./ui/card";

interface ColorSeasonProps {
  season: string;
}

export function ColorSeason({ season }: ColorSeasonProps) {
  const getSeasonGradient = (season: string) => {
    switch (season.toLowerCase()) {
      case 'deep autumn':
        return 'linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #CD853F 100%)';
      case 'soft autumn':
        return 'linear-gradient(135deg, #DEB887 0%, #D2B48C 50%, #BC9A6A 100%)';
      case 'warm autumn':
        return 'linear-gradient(135deg, #CD853F 0%, #DAA520 50%, #B8860B 100%)';
      case 'warm spring':
        return 'linear-gradient(135deg, #FFE4B5 0%, #F0E68C 50%, #DDA0DD 100%)';
      case 'light spring':
        return 'linear-gradient(135deg, #F5F5DC 0%, #FFE4E1 50%, #E6E6FA 100%)';
      case 'clear spring':
        return 'linear-gradient(135deg, #87CEEB 0%, #98FB98 50%, #F0E68C 100%)';
      case 'clear winter':
        return 'linear-gradient(135deg, #4169E1 0%, #8A2BE2 50%, #DC143C 100%)';
      case 'cool winter':
        return 'linear-gradient(135deg, #191970 0%, #4B0082 50%, #8B008B 100%)';
      case 'deep winter':
        return 'linear-gradient(135deg, #000080 0%, #8B0000 50%, #2F4F4F 100%)';
      case 'light summer':
        return 'linear-gradient(135deg, #B0E0E6 0%, #E6E6FA 50%, #F0F8FF 100%)';
      case 'cool summer':
        return 'linear-gradient(135deg, #708090 0%, #9370DB 50%, #4682B4 100%)';
      case 'soft summer':
        return 'linear-gradient(135deg, #D3D3D3 0%, #C0C0C0 50%, #A9A9A9 100%)';
      default:
        return 'linear-gradient(135deg, #D2B48C 0%, #DEB887 50%, #F5DEB3 100%)';
    }
  };

  return (
    <Card className="p-6 bg-card border border-border rounded-2xl shadow-sm">
      <h3 className="text-lg mb-6 text-foreground uppercase tracking-wide font-medium">your color season</h3>
      
      <div className="text-center">
        <div 
          className="w-32 h-32 mx-auto rounded-2xl border border-border mb-4 flex items-center justify-center"
          style={{ background: getSeasonGradient(season) }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2">
            <p className="text-foreground text-sm lowercase">{season}</p>
          </div>
        </div>
        
        <h4 className="text-xl text-foreground mb-2 uppercase tracking-wide font-medium">{season.toLowerCase()}</h4>
        <p className="text-muted-foreground text-sm mb-3 lowercase">
          your personalized color palette based on your natural coloring
        </p>
        
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-left">
          <p className="text-xs text-orange-800 mb-1 lowercase font-medium">color season science</p>
          <p className="text-xs text-orange-700 lowercase">
            your season is determined by analyzing your skin's undertone, value (lightness), and chroma (saturation). we compare these against the 12 seasonal palettes to find your perfect match! each season has specific colors that harmonize with your natural coloring.
          </p>
        </div>
      </div>
    </Card>
  );
}