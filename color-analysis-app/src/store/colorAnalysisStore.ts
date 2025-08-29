import { create } from 'zustand';
import type { ComprehensiveColorAnalysis } from '../utils/advancedColorAnalysis';
import type { ColorSwatch as MediaPipeColorSwatch } from '../utils/mediapipeDetection';

interface ColorSwatch {
  name: string;
  color: string;
  rgb: [number, number, number];
}

interface ColorDimensions {
  hue: 'warm' | 'cool' | 'neutral';
  value: 'light' | 'medium' | 'dark';
  chroma: 'bright' | 'muted';
}

interface AnalysisResults {
  undertone: 'warm' | 'cool' | 'neutral';
  overtone: string;
  eyeColor: ColorSwatch;
  skinColor: ColorSwatch;
  dominantSkinTone?: MediaPipeColorSwatch; // K-means clustered dominant skin tone
  medianLab?: { l: number; a: number; b: number }; // Median Lab used for ITA (cheeks/nose/chin)
  season: string;
  dimensions: ColorDimensions;
  confidence: number;
  skinSwatches: MediaPipeColorSwatch[];
  eyeSwatches: MediaPipeColorSwatch[];
  advancedAnalysis?: ComprehensiveColorAnalysis;
  ita?: number;
  fitzpatrick?: 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';
}

interface ColorAnalysisStore {
  selectedImage: string | null;
  isAnalyzing: boolean;
  showAnalysisScreen: boolean;
  hasStartedAnalysis: boolean;
  results: AnalysisResults | null;
  landmarks: any[] | null;
  showLandmarkOverlay: boolean;
  setSelectedImage: (image: string | null) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  setShowAnalysisScreen: (show: boolean) => void;
  setHasStartedAnalysis: (started: boolean) => void;
  setResults: (results: AnalysisResults | null) => void;
  setLandmarks: (lm: any[] | null) => void;
  setShowLandmarkOverlay: (show: boolean) => void;
  clearResults: () => void;
}

const useColorAnalysisStore = create<ColorAnalysisStore>((set) => ({
  selectedImage: null,
  isAnalyzing: false,
  showAnalysisScreen: false,
  hasStartedAnalysis: false,
  results: null,
  landmarks: null,
  showLandmarkOverlay: false,
  setSelectedImage: (image) => set({ selectedImage: image }),
  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
  setShowAnalysisScreen: (show) => set({ showAnalysisScreen: show }),
  setHasStartedAnalysis: (started) => set({ hasStartedAnalysis: started }),
  setResults: (results) => set({ results }),
  setLandmarks: (lm) => set({ landmarks: lm }),
  setShowLandmarkOverlay: (show) => set({ showLandmarkOverlay: show }),
  clearResults: () => set({ results: null }),
}));

export default useColorAnalysisStore;
export type { ColorSwatch, AnalysisResults };