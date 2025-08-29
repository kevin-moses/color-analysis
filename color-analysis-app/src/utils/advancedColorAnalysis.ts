// Advanced color analysis using @thi.ng/color library for professional skin tone analysis

import { rgb, hsv, ycc } from '@thi.ng/color';
import type { ColorSwatch } from './mediapipeDetection';

// Enhanced analysis result interfaces
export interface ColorSpaceData {
  rgb: { r: number; g: number; b: number };
  hsv: { h: number; s: number; v: number };
  ycbcr: { y: number; cb: number; cr: number };
}

export interface UndertoneAnalysis {
  classification: 'warm' | 'cool' | 'neutral';
  confidence: number;
  hueAngle: number;
  yellowBlueIndex: number;
  redGreenIndex: number;
  ycbcrClusterPosition: 'warm_cluster' | 'cool_cluster' | 'neutral';
  methods: {
    hsvMethod: { result: 'warm' | 'cool' | 'neutral'; confidence: number };
    ybIndex: { result: 'warm' | 'cool' | 'neutral'; confidence: number };
    rgIndex: { result: 'warm' | 'cool' | 'neutral'; confidence: number };
    ycbcrCluster: { result: 'warm' | 'cool' | 'neutral'; confidence: number };
  };
}

export interface OvertoneAnalysis {
  classification: 'rosy' | 'golden' | 'sallow' | 'olive' | 'ashen' | 'tanned';
  regionalVariation: {
    cheeksVsForehead: number;
    peripheralVsCentral: number;
  };
  dominantHue: number;
  saturationLevel: 'high' | 'medium' | 'low';
}

export interface EnhancedColorMetrics {
  value: { score: number; classification: 'light' | 'medium' | 'dark' };
  chroma: { score: number; classification: 'bright' | 'muted' };
  contrast: { skinEye: number; interRegional: number; classification: 'low' | 'medium' | 'high' };
}

export interface RegionalAnalysis {
  regionName: string;
  colorSpace: ColorSpaceData;
  localUndertone: 'warm' | 'cool' | 'neutral';
  contribution: number; // 0-1, how much this region contributes to overall analysis
}

export interface ComprehensiveColorAnalysis {
  averageColors: ColorSpaceData;
  undertone: UndertoneAnalysis;
  overtone: OvertoneAnalysis;
  metrics: EnhancedColorMetrics;
  regionalBreakdown: RegionalAnalysis[];
  recommendations: {
    bestColors: string[];
    avoidColors: string[];
    seasonalPalette: string;
  };
}

// Convert RGB to all color spaces using @thi.ng/color
function convertToColorSpaces(r: number, g: number, b: number): ColorSpaceData {
  const rgbColor = rgb(r / 255, g / 255, b / 255);
  const hsvColor = hsv(rgbColor);
  const yccColor = ycc(rgbColor);

  return {
    rgb: { r, g, b },
    hsv: { 
      h: hsvColor[0] * 360, // Convert from [0,1] to [0,360] degrees
      s: hsvColor[1] * 100, // Convert from [0,1] to [0,100] percentage
      v: hsvColor[2] * 100  // Convert from [0,1] to [0,100] percentage
    },
    ycbcr: { 
      y: yccColor[0] * 255,   // Luminance
      cb: yccColor[1] * 255,  // Blue-difference
      cr: yccColor[2] * 255   // Red-difference
    }
  };
}

// Calculate Yellow-Blue index from normalized RGB
function calculateYellowBlueIndex(r: number, g: number, b: number): number {
  const total = r + g + b;
  if (total === 0) return 0;
  
  const rn = r / total;
  const gn = g / total;  
  const bn = b / total;
  
  // YB index: positive = yellow undertone, negative = blue undertone
  return (rn + gn - 2 * bn) * 100;
}

// Calculate Red-Green index from normalized RGB
function calculateRedGreenIndex(r: number, g: number, b: number): number {
  const total = r + g + b;
  if (total === 0) return 0;
  
  const rn = r / total;
  const gn = g / total;
  
  // RG index: positive = red undertone, negative = green undertone  
  return (rn - gn) * 100;
}

// Classify warm/cool based on HSV hue
function classifyHueWarmCool(hue: number): { classification: 'warm' | 'cool' | 'neutral'; confidence: number } {
  // Warm hues: 15-45° (oranges/yellows) and 315-345° (reds)
  // Cool hues: 180-270° (blues/cyans/purples)  
  // Neutral: transition zones
  
  if ((hue >= 15 && hue <= 45) || (hue >= 315 && hue <= 345)) {
    return { classification: 'warm', confidence: 0.8 };
  } else if (hue >= 180 && hue <= 270) {
    return { classification: 'cool', confidence: 0.8 };
  } else if ((hue >= 45 && hue <= 90) || (hue >= 270 && hue <= 315)) {
    return { classification: 'neutral', confidence: 0.6 };
  } else {
    // Edge cases - lower confidence
    return { classification: 'neutral', confidence: 0.4 };
  }
}

// Classify based on Yellow-Blue index
function classifyYBIndex(ybIndex: number): { classification: 'warm' | 'cool' | 'neutral'; confidence: number } {
  if (ybIndex > 2) {
    return { classification: 'warm', confidence: Math.min(0.9, 0.5 + ybIndex / 20) };
  } else if (ybIndex < -2) {
    return { classification: 'cool', confidence: Math.min(0.9, 0.5 + Math.abs(ybIndex) / 20) };
  } else {
    return { classification: 'neutral', confidence: 0.6 };
  }
}

// Classify based on Red-Green index
function classifyRGIndex(rgIndex: number): { classification: 'warm' | 'cool' | 'neutral'; confidence: number } {
  if (rgIndex > 1) {
    return { classification: 'warm', confidence: Math.min(0.8, 0.5 + rgIndex / 15) };
  } else if (rgIndex < -1) {
    return { classification: 'cool', confidence: Math.min(0.8, 0.5 + Math.abs(rgIndex) / 15) };
  } else {
    return { classification: 'neutral', confidence: 0.5 };
  }
}

// Classify based on YCbCr cluster position
function classifyYCbCrCluster(cb: number, cr: number): { classification: 'warm' | 'cool' | 'neutral'; confidence: number } {
  // Research-based skin tone clusters in YCbCr space
  // Warm cluster: higher Cr (red-difference), moderate-to-low Cb
  // Cool cluster: lower Cr, higher Cb (blue-difference)
  
  const normalizedCb = cb / 255;
  const normalizedCr = cr / 255;
  
  if (normalizedCr > 0.53 && normalizedCb < 0.50) {
    return { classification: 'warm', confidence: 0.7 };
  } else if (normalizedCr < 0.47 && normalizedCb > 0.52) {
    return { classification: 'cool', confidence: 0.7 };
  } else {
    return { classification: 'neutral', confidence: 0.6 };
  }
}

// Analyze undertone using multiple methods
function analyzeUndertone(colorData: ColorSpaceData): UndertoneAnalysis {
  const { rgb, hsv, ycbcr } = colorData;
  
  // Method 1: HSV Hue analysis
  const hsvMethod = classifyHueWarmCool(hsv.h);
  
  // Method 2: Yellow-Blue index
  const ybIndex = calculateYellowBlueIndex(rgb.r, rgb.g, rgb.b);
  const ybMethod = classifyYBIndex(ybIndex);
  
  // Method 3: Red-Green index
  const rgIndex = calculateRedGreenIndex(rgb.r, rgb.g, rgb.b);
  const rgMethod = classifyRGIndex(rgIndex);
  
  // Method 4: YCbCr cluster analysis
  const ycbcrMethod = classifyYCbCrCluster(ycbcr.cb, ycbcr.cr);
  
  // Consensus analysis with confidence weighting
  const methods = { 
    hsvMethod: { result: hsvMethod.classification, confidence: hsvMethod.confidence },
    ybIndex: { result: ybMethod.classification, confidence: ybMethod.confidence },
    rgIndex: { result: rgMethod.classification, confidence: rgMethod.confidence },
    ycbcrCluster: { result: ycbcrMethod.classification, confidence: ycbcrMethod.confidence }
  };
  
  const warmScore = (
    (hsvMethod.classification === 'warm' ? hsvMethod.confidence : 0) +
    (ybMethod.classification === 'warm' ? ybMethod.confidence : 0) +
    (rgMethod.classification === 'warm' ? rgMethod.confidence : 0) +
    (ycbcrMethod.classification === 'warm' ? ycbcrMethod.confidence : 0)
  );
  
  const coolScore = (
    (hsvMethod.classification === 'cool' ? hsvMethod.confidence : 0) +
    (ybMethod.classification === 'cool' ? ybMethod.confidence : 0) +
    (rgMethod.classification === 'cool' ? rgMethod.confidence : 0) +
    (ycbcrMethod.classification === 'cool' ? ycbcrMethod.confidence : 0)
  );
  
  const neutralScore = (
    (hsvMethod.classification === 'neutral' ? hsvMethod.confidence : 0) +
    (ybMethod.classification === 'neutral' ? ybMethod.confidence : 0) +
    (rgMethod.classification === 'neutral' ? rgMethod.confidence : 0) +
    (ycbcrMethod.classification === 'neutral' ? ycbcrMethod.confidence : 0)
  );
  
  let classification: 'warm' | 'cool' | 'neutral';
  let confidence: number;
  
  if (warmScore > coolScore && warmScore > neutralScore) {
    classification = 'warm';
    confidence = warmScore / 4; // Average confidence
  } else if (coolScore > neutralScore) {
    classification = 'cool';
    confidence = coolScore / 4;
  } else {
    classification = 'neutral';
    confidence = neutralScore / 4;
  }
  
  return {
    classification,
    confidence,
    hueAngle: hsv.h,
    yellowBlueIndex: ybIndex,
    redGreenIndex: rgIndex,
    ycbcrClusterPosition: ycbcrMethod.classification === 'neutral' ? 'neutral' : 
                         ycbcrMethod.classification === 'warm' ? 'warm_cluster' : 'cool_cluster',
    methods
  };
}

// Analyze overtone by comparing regions
function analyzeOvertone(skinSwatches: ColorSwatch[]): OvertoneAnalysis {
  
  // Calculate average colors for region comparison
  const cheeks = [skinSwatches[0], skinSwatches[1]]; // Left & Right Cheek
  const forehead = [skinSwatches[2]]; // Forehead
  const peripheral = [skinSwatches[4], skinSwatches[5]]; // Jaw areas
  const central = [skinSwatches[6], skinSwatches[7]]; // Nose areas
  
  const avgCheeks = averageColorSpaceData(cheeks);
  const avgForehead = averageColorSpaceData(forehead);
  const avgPeripheral = averageColorSpaceData(peripheral);
  const avgCentral = averageColorSpaceData(central);
  
  const cheeksVsForehead = calculateColorDifference(avgCheeks, avgForehead);
  const peripheralVsCentral = calculateColorDifference(avgPeripheral, avgCentral);
  
  // Overall average for dominant characteristics
  const overallAvg = averageColorSpaceData(skinSwatches);
  const dominantHue = overallAvg.hsv.h;
  const saturationLevel = overallAvg.hsv.s > 60 ? 'high' : overallAvg.hsv.s > 30 ? 'medium' : 'low';
  
  // Classify overtone based on regional differences and color characteristics
  let classification: 'rosy' | 'golden' | 'sallow' | 'olive' | 'ashen' | 'tanned';
  
  if (cheeksVsForehead > 15 && (dominantHue >= 330 || dominantHue <= 30)) {
    classification = 'rosy'; // Cheeks redder than forehead
  } else if (dominantHue >= 30 && dominantHue <= 60 && saturationLevel !== 'low') {
    classification = 'golden'; // Yellow-orange hues with good saturation
  } else if (dominantHue >= 45 && dominantHue <= 75 && saturationLevel === 'low') {
    classification = 'sallow'; // Yellow-green hues with low saturation  
  } else if (dominantHue >= 60 && dominantHue <= 120 && saturationLevel !== 'low') {
    classification = 'olive'; // Green-yellow hues with moderate+ saturation
  } else if (saturationLevel === 'low') {
    classification = 'ashen'; // Very low saturation across all hues
  } else {
    classification = 'tanned'; // Default for other combinations
  }
  
  return {
    classification,
    regionalVariation: {
      cheeksVsForehead,
      peripheralVsCentral
    },
    dominantHue,
    saturationLevel
  };
}

// Calculate enhanced color metrics using research-backed seasonal analysis methods
function calculateEnhancedMetrics(skinSwatches: ColorSwatch[], eyeSwatches: ColorSwatch[], undertoneClass: 'warm' | 'cool' | 'neutral'): EnhancedColorMetrics {
  const avgSkin = averageColorSpaceData(skinSwatches);
  const avgEyes = averageColorSpaceData(eyeSwatches);
  
  // Value (lightness) analysis using relative luminance or HSV V
  // Use HSV V (normalized to 0-1 for comparison with luminance thresholds)
  const valueMetric = avgSkin.hsv.v / 100; // Convert from [0,100] to [0,1]
  let valueClassification: 'light' | 'medium' | 'dark';
  if (valueMetric >= 0.78) valueClassification = 'light';
  else if (valueMetric <= 0.46) valueClassification = 'dark';
  else valueClassification = 'medium';
  
  // Contrast analysis using eye↔skin luminance ratio
  const skinLuminance = calculateRelativeLuminance(avgSkin.rgb.r, avgSkin.rgb.g, avgSkin.rgb.b);
  const eyeLuminance = calculateRelativeLuminance(avgEyes.rgb.r, avgEyes.rgb.g, avgEyes.rgb.b);
  
  // Contrast ratio: max of both directions to ensure >= 1.0
  const contrastRatio = Math.max(
    (eyeLuminance + 0.05) / (skinLuminance + 0.05),
    (skinLuminance + 0.05) / (eyeLuminance + 0.05)
  );
  
  let contrastClassification: 'low' | 'medium' | 'high';
  if (contrastRatio >= 1.95) contrastClassification = 'high';
  else if (contrastRatio <= 1.35) contrastClassification = 'low';
  else contrastClassification = 'medium';
  
  // Chroma analysis using seasonal theory relationship
  // Start from seasonal theory: Warm+Light and Cool+Dark skew bright; Warm+Dark and Cool+Light skew muted
  let baseChromaClassification: 'bright' | 'muted';
  
  if ((undertoneClass === 'warm' && valueClassification === 'light') || 
      (undertoneClass === 'cool' && valueClassification === 'dark')) {
    baseChromaClassification = 'bright';
  } else if ((undertoneClass === 'warm' && valueClassification === 'dark') || 
             (undertoneClass === 'cool' && valueClassification === 'light')) {
    baseChromaClassification = 'muted';
  } else {
    // Neutral undertone or medium value - use measured saturation as tiebreaker
    baseChromaClassification = avgSkin.hsv.s > 35 ? 'bright' : 'muted';
  }
  
  // Nudge by measured contrast & eye saturation
  let chromaClassification = baseChromaClassification;
  const eyeSaturation = avgEyes.hsv.s;
  
  // High contrast and high eye saturation can push toward bright
  if (contrastClassification === 'high' && eyeSaturation > 40 && baseChromaClassification === 'muted') {
    chromaClassification = 'bright';
  }
  // Very low contrast and low eye saturation can push toward muted  
  else if (contrastClassification === 'low' && eyeSaturation < 25 && baseChromaClassification === 'bright') {
    chromaClassification = 'muted';
  }
  
  const chromaScore = avgSkin.hsv.s; // Keep original saturation score for reference
  const interRegionalContrast = calculateInterRegionalContrast(skinSwatches); // Keep for reference
  
  return {
    value: { score: valueMetric * 100, classification: valueClassification },
    chroma: { score: chromaScore, classification: chromaClassification },
    contrast: { 
      skinEye: contrastRatio, 
      interRegional: interRegionalContrast, 
      classification: contrastClassification 
    }
  };
}

// Helper functions
function averageColorSpaceData(swatches: ColorSwatch[]): ColorSpaceData {
  if (swatches.length === 0) {
    return { rgb: { r: 0, g: 0, b: 0 }, hsv: { h: 0, s: 0, v: 0 }, ycbcr: { y: 0, cb: 128, cr: 128 } };
  }
  
  const avgR = swatches.reduce((sum, s) => sum + s.r, 0) / swatches.length;
  const avgG = swatches.reduce((sum, s) => sum + s.g, 0) / swatches.length;
  const avgB = swatches.reduce((sum, s) => sum + s.b, 0) / swatches.length;
  
  return convertToColorSpaces(Math.round(avgR), Math.round(avgG), Math.round(avgB));
}

function calculateColorDifference(color1: ColorSpaceData, color2: ColorSpaceData): number {
  // Simple Euclidean distance in RGB space
  const dr = color1.rgb.r - color2.rgb.r;
  const dg = color1.rgb.g - color2.rgb.g;
  const db = color1.rgb.b - color2.rgb.b;
  
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function calculateContrastRatio(rgb1: { r: number; g: number; b: number }, rgb2: { r: number; g: number; b: number }): number {
  const lum1 = calculateRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = calculateRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

function calculateRelativeLuminance(r: number, g: number, b: number): number {
  const rSRGB = r / 255;
  const gSRGB = g / 255;
  const bSRGB = b / 255;

  const rLin = rSRGB <= 0.03928 ? rSRGB / 12.92 : Math.pow((rSRGB + 0.055) / 1.055, 2.4);
  const gLin = gSRGB <= 0.03928 ? gSRGB / 12.92 : Math.pow((gSRGB + 0.055) / 1.055, 2.4);
  const bLin = bSRGB <= 0.03928 ? bSRGB / 12.92 : Math.pow((bSRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

function calculateInterRegionalContrast(swatches: ColorSwatch[]): number {
  if (swatches.length < 2) return 0;
  
  let maxContrast = 0;
  for (let i = 0; i < swatches.length; i++) {
    for (let j = i + 1; j < swatches.length; j++) {
      const contrast = calculateContrastRatio(
        { r: swatches[i].r, g: swatches[i].g, b: swatches[i].b },
        { r: swatches[j].r, g: swatches[j].g, b: swatches[j].b }
      );
      maxContrast = Math.max(maxContrast, contrast);
    }
  }
  
  return maxContrast;
}

// Placeholder for future seasonal mapping - currently returns data-driven analysis only
function generateRecommendations(): {
  bestColors: string[];
  avoidColors: string[];
  seasonalPalette: string;
} {
  // TODO: Build comprehensive seasonal mapping based on validated data
  return { 
    bestColors: [], 
    avoidColors: [], 
    seasonalPalette: 'Analysis Complete - Seasonal Mapping Pending' 
  };
}

// Main analysis function
export function performAdvancedColorAnalysis(skinSwatches: ColorSwatch[], eyeSwatches: ColorSwatch[]): ComprehensiveColorAnalysis {
  if (!skinSwatches.length || !eyeSwatches.length) {
    throw new Error('Insufficient color data for analysis');
  }
  
  // Calculate average colors across all regions
  const averageColors = averageColorSpaceData(skinSwatches);
  
  // Perform multi-method undertone analysis
  const undertone = analyzeUndertone(averageColors);
  
  // Analyze overtones using regional comparison
  const overtone = analyzeOvertone(skinSwatches);
  
  // Calculate enhanced metrics (pass undertone for seasonal chroma analysis)
  const metrics = calculateEnhancedMetrics(skinSwatches, eyeSwatches, undertone.classification);
  
  // Regional breakdown
  const regionNames = ['Left Cheek', 'Right Cheek', 'Forehead', 'Chin', 'Left Jaw', 'Right Jaw', 
                       'Nose Bridge', 'Nose Base', 'Left Eye Area', 'Right Eye Area'];
  
  const regionalBreakdown: RegionalAnalysis[] = skinSwatches.map((swatch, index) => {
    const regionColorSpace = convertToColorSpaces(swatch.r, swatch.g, swatch.b);
    const localUndertone = analyzeUndertone(regionColorSpace);
    
    return {
      regionName: regionNames[index] || `Region ${index + 1}`,
      colorSpace: regionColorSpace,
      localUndertone: localUndertone.classification,
      contribution: 1 / skinSwatches.length // Equal weighting for now
    };
  });
  
  // Generate recommendations (placeholder until seasonal mapping is built)
  const recommendations = generateRecommendations();
  
  return {
    averageColors,
    undertone,
    overtone,
    metrics,
    regionalBreakdown,
    recommendations
  };
}