import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { DominantSkinTone } from "./DominantSkinTone";
import { ColorSwatches } from "./ColorSwatches";
import { AnalysisColors } from "./AnalysisColors";
import { UndertoneAnalysis } from "./UndertoneAnalysis";
import { ColorSeason } from "./ColorSeason";
import { FitzpatrickScale } from "./FitzpatrickScale";
import { ColorProfile } from "./ColorProfile";
import { AnalysisConfidence } from "./AnalysisConfidence";
import { LandmarkVisualization } from "./LandmarkVisualization";

interface ResultsScreenProps {
  imageUrl: string;
  results: {
    dominantSkinTone: {
      color: string;
      rgb: string;
      lab?: { l: number; a: number; b: number };
    };
    skinTones: string[];
    eyeColors: string[];
    analysisColors: {
      skinColor: string;
      skinRgb: string;
      eyeColor: string;
      eyeRgb: string;
    };
    undertone: {
      name: string;
      color: string;
    };
    overtone?: {
      name: string;
      ita?: number;
      fitzpatrick?: number;
    };
    season: string;
    colorProfile: {
      value: number;
      chroma: number;
      hue: number;
    };
    confidence: number;
  };
  onStartOver: () => void;
}

export function ResultsScreen({ imageUrl, results, onStartOver }: ResultsScreenProps) {
  return (
    <div className="min-h-screen bg-background p-4 font-['Inter']">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onStartOver}
            className="mr-2 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl text-foreground uppercase tracking-wide font-medium">your color analysis</h1>
        </div>
        
        <div className="space-y-6">
          <DominantSkinTone
            color={results.dominantSkinTone.color}
            rgb={results.dominantSkinTone.rgb}
            lab={results.dominantSkinTone.lab}
          />
          
          <ColorSwatches
            title="mediapipe skin swatches"
            colors={results.skinTones}
            description="colors extracted from different areas of your face using ai landmark detection. these show the natural variation in your skin tone."
          />
          
          <ColorSwatches
            title="eye color analysis"
            colors={results.eyeColors}
            showLabels={false}
            description="colors sampled from your iris using precise facial landmark mapping. eye color affects which makeup and clothing colors will make your eyes pop!"
          />
          
          <AnalysisColors
            skinColor={results.analysisColors.skinColor}
            skinRgb={results.analysisColors.skinRgb}
            eyeColor={results.analysisColors.eyeColor}
            eyeRgb={results.analysisColors.eyeRgb}
          />
          
          <UndertoneAnalysis
            undertone={results.undertone.name}
            undertoneColor={results.undertone.color}
          />
          
          {results.overtone?.ita && results.overtone?.fitzpatrick && (
            <FitzpatrickScale
              type={results.overtone.fitzpatrick}
              ita={results.overtone.ita}
            />
          )}
          
          <ColorSeason season={results.season} />
          
          <LandmarkVisualization imageUrl={imageUrl} />
          
          <ColorProfile
            value={results.colorProfile.value}
            chroma={results.colorProfile.chroma}
            hue={results.colorProfile.hue}
          />
          
          <AnalysisConfidence confidence={results.confidence} />
          
          <div className="pb-8">
            <Button
              onClick={onStartOver}
              variant="outline"
              className="w-full h-12 border-secondary text-secondary hover:bg-secondary/5 rounded-xl lowercase font-medium"
            >
              analyze another image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}