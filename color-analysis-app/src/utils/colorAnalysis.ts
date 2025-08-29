// Enhanced seasonal color analysis based on comprehensive theory
// Reference: https://theconceptwardrobe.com/colour-analysis-comprehensive-guides/seasonal-color-analysis-which-color-season-are-you

export interface ColorDimensions {
  hue: 'warm' | 'cool' | 'neutral';
  value: 'light' | 'dark';
  chroma: 'bright' | 'muted';
}

export interface ColorAnalysisResult {
  undertone: 'warm' | 'cool' | 'neutral';
  overtone: string;
  season: string;
  dimensions: ColorDimensions;
  confidence: number;
  ita?: number; // Individual Typology Angle (degrees)
  fitzpatrick?: 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';
}

// Convert RGB to HSL with more precision
export const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
};

// Skin-only undertone detection based on seasonal theory
// Use L*a*b* (perceptual) for undertone analysis
import { rgbToLab } from './mediapipeDetection';

export const determineUndertoneFromLab = (l: number, a: number, b: number): 'warm' | 'cool' | 'neutral' => {
  let warmScore = 0;
  let coolScore = 0;

  // Primary: a* (green↔red) and b* (blue↔yellow)
  // Warm if a*>0 (towards red) and/or b*>0 (towards yellow)
  if (a > 4) warmScore += 3; // noticeable red component
  if (b > 6) warmScore += 4; // strong yellow component is a key warm indicator
  if (a < -3) coolScore += 3; // greenish cast
  if (b < -4) coolScore += 4; // bluish cast

  // Secondary: balance between channels
  if (a > 0 && b > 0) warmScore += 2; // red+yellow together → warm
  if (a < 0 && b < 0) coolScore += 2; // green+blue together → cool

  // Tertiary: very light skin can amplify undertone perception
  if (l > 75) {
    if (a > 6) warmScore += 1;
    if (b > 8) warmScore += 1;
    if (a < -5) coolScore += 1;
    if (b < -6) coolScore += 1;
  }

  const scoreDifference = Math.abs(warmScore - coolScore);
  console.log(`🎨 Undertone (Lab): L*a*b*(${Math.round(l)}, ${Math.round(a)}, ${Math.round(b)}) | Warm: ${warmScore}, Cool: ${coolScore}`);

  if (scoreDifference < 2) return 'neutral';
  return warmScore > coolScore ? 'warm' : 'cool';
};

export const determineUndertone = (skinR: number, skinG: number, skinB: number): 'warm' | 'cool' | 'neutral' => {
  const [l, a, b] = rgbToLab(skinR, skinG, skinB);
  return determineUndertoneFromLab(l, a, b);
};

// Determine value (light/dark) based on luminosity
export const determineValue = (r: number, g: number, b: number): 'light' | 'dark' => {
  const [, , lightness] = rgbToHsl(r, g, b);
  return lightness > 55 ? 'light' : 'dark';
};

// Determine chroma (bright/muted) based on skin and eye analysis only
export const determineChroma = (skinR: number, skinG: number, skinB: number, eyeR: number, eyeG: number, eyeB: number): 'bright' | 'muted' => {
  const [, skinSaturation] = rgbToHsl(skinR, skinG, skinB);
  const [, eyeSaturation] = rgbToHsl(eyeR, eyeG, eyeB);
  
  // Calculate contrast between skin and eyes only
  const skinLuma = 0.299 * skinR + 0.587 * skinG + 0.114 * skinB;
  const eyeLuma = 0.299 * eyeR + 0.587 * eyeG + 0.114 * eyeB;
  
  const skinEyeContrast = Math.abs(skinLuma - eyeLuma);
  const averageSaturation = (skinSaturation + eyeSaturation) / 2;
  
  // Higher contrast and saturation = bright, lower = muted
  const chromaScore = (skinEyeContrast / 255 * 100) + averageSaturation;
  
  console.log(`🌈 Chroma Analysis: Contrast=${Math.round(skinEyeContrast)}, Avg Saturation=${Math.round(averageSaturation)}, Score=${Math.round(chromaScore)}`);
  
  return chromaScore > 35 ? 'bright' : 'muted';
};

// Enhanced seasonal classification based on 3-dimensional analysis
export const determineSeason = (undertone: 'warm' | 'cool' | 'neutral', value: 'light' | 'dark', chroma: 'bright' | 'muted'): string => {
  // Four primary seasons based on the guide
  if (undertone === 'warm' && value === 'light' && chroma === 'bright') {
    return 'Spring'; // warm + light → bright
  } else if (undertone === 'cool' && value === 'light' && chroma === 'muted') {
    return 'Summer'; // cool + light → muted
  } else if (undertone === 'warm' && value === 'dark' && chroma === 'muted') {
    return 'Autumn'; // warm + dark → muted
  } else if (undertone === 'cool' && value === 'dark' && chroma === 'bright') {
    return 'Winter'; // cool + dark → bright
  }
  
  // Handle edge cases and neutral undertones
  if (undertone === 'warm') {
    return value === 'light' ? 'Light Spring' : 'Deep Autumn';
  } else if (undertone === 'cool') {
    return value === 'light' ? 'Light Summer' : 'Deep Winter';
  } else {
    // Neutral undertones
    if (value === 'light') {
      return chroma === 'bright' ? 'Light Spring' : 'Light Summer';
    } else {
      return chroma === 'bright' ? 'Deep Winter' : 'Deep Autumn';
    }
  }
};

// Determine overtone description based on RGB values
export const determineOvertone = (r: number, g: number, b: number): string => {
  const [hue, , lightness] = rgbToHsl(r, g, b);
  
  let tone = '';
  
  // Lightness categories
  if (lightness > 75) {
    tone = 'Very Fair';
  } else if (lightness > 65) {
    tone = 'Fair';
  } else if (lightness > 55) {
    tone = 'Light';
  } else if (lightness > 45) {
    tone = 'Medium-Light';
  } else if (lightness > 35) {
    tone = 'Medium';
  } else if (lightness > 25) {
    tone = 'Medium-Dark';
  } else if (lightness > 15) {
    tone = 'Dark';
  } else {
    tone = 'Very Dark';
  }
  
  // Add hue description
  if (hue >= 10 && hue <= 45) {
    tone += ' with golden tones';
  } else if (hue >= 0 && hue <= 15) {
    tone += ' with peachy tones';
  } else if (hue >= 180 && hue <= 240) {
    tone += ' with cool tones';
  } else if (hue >= 300 || hue <= 10) {
    tone += ' with rosy tones';
  }
  
  return tone;
};

// ITA (Individual Typology Angle) utilities for overtone classification using L*b*
// ITA = arctan((L* - 50) / b*) * 180 / PI
export const calculateITA = (l: number, b: number): number => {
  const denominator = b === 0 ? 0.00001 : b; // avoid division by zero
  const radians = Math.atan((l - 50) / denominator);
  const degrees = radians * (180 / Math.PI);
  return Math.round(degrees * 10) / 10; // one decimal place
};

export type ITACategory =
  | 'Very Light'
  | 'Light'
  | 'Intermediate'
  | 'Tan'
  | 'Brown'
  | 'Dark';

export const classifyITA = (ita: number): { category: ITACategory; fitzpatrick: 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' } => {
  if (ita > 55) return { category: 'Very Light', fitzpatrick: 'I' };
  if (ita > 41) return { category: 'Light', fitzpatrick: 'II' };
  if (ita > 28) return { category: 'Intermediate', fitzpatrick: 'III' };
  if (ita > 10) return { category: 'Tan', fitzpatrick: 'IV' };
  if (ita > -30) return { category: 'Brown', fitzpatrick: 'V' };
  return { category: 'Dark', fitzpatrick: 'VI' };
};

// Convenience: determine overtone from L*a*b* using ITA
export const determineOvertoneFromLabITA = (l: number, b: number): { overtone: string; ita: number; fitzpatrick: 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' } => {
  const ita = calculateITA(l, b);
  const { category, fitzpatrick } = classifyITA(ita);
  return { overtone: category, ita, fitzpatrick };
};

// Calculate confidence score based on skin analysis clarity
export const calculateConfidence = (warmScore: number, coolScore: number, skinEyeContrast: number): number => {
  const scoreDifference = Math.abs(warmScore - coolScore);
  const maxScore = Math.max(warmScore, coolScore);
  
  let confidence = 0;
  
  // Score separation confidence - clearer the difference, higher confidence
  if (scoreDifference >= 4) {
    confidence += 40;
  } else if (scoreDifference >= 2) {
    confidence += 25;
  } else {
    confidence += 10;
  }
  
  // Overall score strength - stronger signals = higher confidence
  if (maxScore >= 6) {
    confidence += 30;
  } else if (maxScore >= 4) {
    confidence += 20;
  } else {
    confidence += 10;
  }
  
  // Skin-eye contrast confidence - better feature definition
  if (skinEyeContrast > 50) {
    confidence += 30;
  } else if (skinEyeContrast > 30) {
    confidence += 20;
  } else {
    confidence += 10;
  }
  
  return Math.min(confidence, 100);
};

// Export undertone scores for debugging
export const getUndertoneScoresFromLab = (a: number, b: number): { warmScore: number, coolScore: number } => {
  let warmScore = 0;
  let coolScore = 0;

  if (a > 4) warmScore += 3;
  if (b > 6) warmScore += 4;
  if (a < -3) coolScore += 3;
  if (b < -4) coolScore += 4;
  if (a > 0 && b > 0) warmScore += 2;
  if (a < 0 && b < 0) coolScore += 2;

  return { warmScore, coolScore };
};

export const getUndertoneScores = (skinR: number, skinG: number, skinB: number): { warmScore: number, coolScore: number } => {
  const [, a, b] = rgbToLab(skinR, skinG, skinB);
  return getUndertoneScoresFromLab(a, b);
};

// Convert LAB to RGB for color display
export const labToRgb = (l: number, a: number, b: number): [number, number, number] => {
  // First convert LAB to XYZ
  let y = (l + 16) / 116;
  let x = a / 500 + y;
  let z = y - b / 200;

  // Apply inverse gamma correction
  const xyzToRgbGamma = (t: number) => {
    return t > 0.206893034 ? Math.pow(t, 3) : (t - 16/116) / 7.787;
  };

  x = xyzToRgbGamma(x) * 95.047;
  y = xyzToRgbGamma(y) * 100.000;
  z = xyzToRgbGamma(z) * 108.883;

  // Convert XYZ to RGB (sRGB D65)
  x /= 100;
  y /= 100;
  z /= 100;

  let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  let b_rgb = x * 0.0557 + y * -0.2040 + z * 1.0570;

  // Apply gamma correction
  const rgbGamma = (t: number) => {
    return t > 0.0031308 ? 1.055 * Math.pow(t, 1/2.4) - 0.055 : 12.92 * t;
  };

  r = rgbGamma(r);
  g = rgbGamma(g);
  b_rgb = rgbGamma(b_rgb);

  // Clamp to 0-255 range
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val * 255)));

  return [clamp(r), clamp(g), clamp(b_rgb)];
};