import { useState, useRef } from "react";
import { UploadScreen } from "./components/UploadScreen";
import { ProcessingScreen } from "./components/ProcessingScreen";
import { AnalysisOverlay } from "./components/AnalysisOverlay";
import { ResultsScreen } from "./components/ResultsScreen";
import exampleImage from 'figma:asset/9a0381a0c53350ba14b3b464458e27aa0856507f.png';

type AppState = 'upload' | 'processing' | 'results';

interface AnalysisResults {
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
}

export default function App() {
  const [appState, setAppState] = useState<AppState>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showAnalysisScreen, setShowAnalysisScreen] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);

  const handleImageSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    setSelectedImage(url);
    setAppState('processing');
  };

  const handleSampleImage = () => {
    setSelectedImage(exampleImage);
    setAppState('processing');
  };

  const simulateAnalysis = async (): Promise<AnalysisResults> => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock analysis results
    return {
      dominantSkinTone: {
        color: '#9A6C53',
        rgb: '154, 108, 83',
        lab: { l: 49.8, a: 15.2, b: 21.3 }
      },
      skinTones: [
        '#8B4513', '#A0522D', '#CD853F', '#DEB887', 
        '#F5DEB3', '#FFEFD5', '#FFE4E1', '#FFF0F5'
      ],
      eyeColors: ['#654321', '#8B4513', '#A0522D'],
      analysisColors: {
        skinColor: '#9A6C53',
        skinRgb: '154, 108, 83',
        eyeColor: '#654321',
        eyeRgb: '101, 67, 33'
      },
      undertone: {
        name: 'Warm',
        color: '#D4A574'
      },
      overtone: {
        name: 'Medium',
        ita: 14.2,
        fitzpatrick: 4
      },
      season: 'Deep Autumn',
      colorProfile: {
        value: 65.4,
        chroma: 28.7,
        hue: 85.2
      },
      confidence: 87.3
    };
  };

  const handleStartAnalysis = async () => {
    setShowAnalysisScreen(true);
    
    try {
      // Simulate face detection and color analysis
      const results = await simulateAnalysis();
      setAnalysisResults(results);
      setShowAnalysisScreen(false);
      setAppState('results');
    } catch (error) {
      console.error('Analysis failed:', error);
      setShowAnalysisScreen(false);
    }
  };

  const handleStartOver = () => {
    setAppState('upload');
    setSelectedImage(null);
    setAnalysisResults(null);
    setShowAnalysisScreen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {appState === 'upload' && (
        <UploadScreen
          onImageSelect={handleImageSelect}
          onSampleImage={handleSampleImage}
        />
      )}
      
      {appState === 'processing' && selectedImage && (
        <ProcessingScreen
          imageUrl={selectedImage}
          onStartAnalysis={handleStartAnalysis}
        />
      )}
      
      {appState === 'results' && selectedImage && analysisResults && (
        <ResultsScreen
          imageUrl={selectedImage}
          results={analysisResults}
          onStartOver={handleStartOver}
        />
      )}
      
      <AnalysisOverlay isVisible={showAnalysisScreen} />
    </div>
  );
}