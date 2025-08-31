import React, { useRef } from 'react';
import useColorAnalysisStore, { type AnalysisResults } from './store/colorAnalysisStore';
import { 
  determineUndertoneFromLab,
  determineValue, 
  determineChroma, 
  determineSeason, 
  determineOvertone, 
  determineOvertoneFromLabITA,
  calculateConfidence,
  getUndertoneScores,
  getUndertoneScoresFromLab
} from './utils/colorAnalysis';
import { detectFaceRegionsWithMediaPipe, extractColorsFromMediaPipe, type MediaPipeResults, drawMedianLandmarksOverlay } from './utils/mediapipeDetection';
import { sharedStyles } from './styles/shared';
import UploadScreen from './components/UploadScreen';
import ProcessingScreen from './components/ProcessingScreen';
import AnalysisOverlay from './components/AnalysisOverlay';
import ResultsScreen from './components/ResultsScreen';



const ColorAnalysis: React.FC = () => {
  const {
    selectedImage,
    isAnalyzing,
    showAnalysisScreen,
    hasStartedAnalysis,
    results,
    landmarks,
    setSelectedImage,
    setIsAnalyzing,
    setShowAnalysisScreen,
    setHasStartedAnalysis,
    setResults,
    setLandmarks,
    clearResults
  } = useColorAnalysisStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  // Managed in Zustand


  // No special loading needed for simple detection

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        clearResults();
      };
      reader.readAsDataURL(file);
    }
  };

  const loadTestImage = () => {
    setSelectedImage('/test.jpg');
    clearResults();
  };



  const analyzeColors = async () => {
    if (!selectedImage || !canvasRef.current || !imageRef.current || isAnalyzing) {
      console.warn('Analysis skipped: missing requirements or already analyzing');
      return;
    }

    setHasStartedAnalysis(true);
    setShowAnalysisScreen(true);
    setIsAnalyzing(true);
    clearResults(); // Clear any previous results

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;

      // Calculate optimal canvas size (max 1024px for MediaPipe performance)
      const MAX_SIZE = 1024;
      let canvasWidth = img.width;
      let canvasHeight = img.height;
      
      // Scale down if image is too large
      if (canvasWidth > MAX_SIZE || canvasHeight > MAX_SIZE) {
        const aspectRatio = canvasWidth / canvasHeight;
        if (canvasWidth > canvasHeight) {
          canvasWidth = MAX_SIZE;
          canvasHeight = Math.round(MAX_SIZE / aspectRatio);
        } else {
          canvasHeight = MAX_SIZE;
          canvasWidth = Math.round(MAX_SIZE * aspectRatio);
        }
        console.log(`📏 Scaling image from ${img.width}x${img.height} to ${canvasWidth}x${canvasHeight} for MediaPipe processing`);
      }

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      
      // Use high-quality image rendering
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      }

      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      if (!imageData) return;

      // Step 1: Use MediaPipe for face detection
      console.log('🎯 Starting MediaPipe face detection...');
      const mediapipeResults: MediaPipeResults = await detectFaceRegionsWithMediaPipe(canvas);
      console.log('✅ MediaPipe detection successful!');
      console.log(`📍 Detected ${mediapipeResults.landmarks.length} facial landmarks`);
      setLandmarks(mediapipeResults.landmarks);
      
      // Step 2: Extract colors from MediaPipe landmarks
      console.log('🎨 Extracting colors from MediaPipe landmarks...');
      const colorResults = extractColorsFromMediaPipe(mediapipeResults);
      // Draw overlay of median landmarks
      if (overlayRef.current) {
        const overlayCanvas = overlayRef.current;
        const imgEl = imageRef.current;
        if (imgEl) {
          const rect = imgEl.getBoundingClientRect();
          overlayCanvas.width = Math.round(rect.width);
          overlayCanvas.height = Math.round(rect.height);
        }
        drawMedianLandmarksOverlay(overlayCanvas, mediapipeResults.landmarks, { clear: true });
      }
      const { skinSwatches, eyeSwatches, dominantSkinTone } = colorResults;
      

      
      // Step 3: Color analysis begins AFTER MediaPipe
      console.log('🔍 Starting color analysis with extracted swatches...');
      console.log(`🌸 Skin swatches (${skinSwatches.length}):`, skinSwatches.map(s => s.color));
      console.log(`👁️ Eye swatches (${eyeSwatches.length}):`, eyeSwatches.map(s => s.color));

      
      // Compute robust median Lab from cheek/nose/chin swatches only (bypass k-means for undertone/ITA)
      const targetRegions = new Set(['leftCheek','rightCheek','noseBridge','noseBase','chin']);
      const labSamples = skinSwatches
        .filter((s) => s.lab && (!s.region || targetRegions.has(s.region)))
        .map((s) => s.lab!)
        .filter(Boolean);

      const median = (arr: number[]) => {
        if (arr.length === 0) return 0;
        const sorted = [...arr].sort((a,b)=>a-b);
        const mid = Math.floor(sorted.length/2);
        return sorted.length % 2 ? sorted[mid] : Math.round(((sorted[mid-1]+sorted[mid]) / 2) * 10) / 10;
      };

      const medianL = median(labSamples.map(v=>v.l));
      const medianA = median(labSamples.map(v=>v.a));
      const medianB = median(labSamples.map(v=>v.b));

      // Use RGB from dominant tone for UI color chips, but Lab medians for undertone/ITA
      const skinR = dominantSkinTone.r;
      const skinG = dominantSkinTone.g;
      const skinB = dominantSkinTone.b;
      console.log(`📏 Median L*a*b*: L=${medianL}, a=${medianA}, b=${medianB}`);
      
      // Use average eye color for analysis 
      const eyeR = eyeSwatches[Math.floor(eyeSwatches.length / 2)].r;
      const eyeG = eyeSwatches[Math.floor(eyeSwatches.length / 2)].g;
      const eyeB = eyeSwatches[Math.floor(eyeSwatches.length / 2)].b;
      
      // Debug color values before analysis
      console.log('🔍 Skin-Only Color Analysis:');
      console.log(`  Skin RGB: (${skinR}, ${skinG}, ${skinB})`);
      if (results?.dominantSkinTone?.lab) {
        console.log(`  Skin L*a*b*: (${results.dominantSkinTone.lab.l}, ${results.dominantSkinTone.lab.a}, ${results.dominantSkinTone.lab.b})`);
      }
      console.log(`  Eye RGB: (${eyeR}, ${eyeG}, ${eyeB})`);
      
      // Use skin-only analysis functions (prefer Lab path when available)
      const undertone = determineUndertoneFromLab(medianL, medianA, medianB);
      console.log(`  Calculated undertone: ${undertone}`);
      
      // Overtone via ITA when Lab available, else fallback to RGB descriptor
      let overtone = determineOvertone(skinR, skinG, skinB);
      let itaValue: number | undefined = undefined;
      let fitz: 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | undefined = undefined;
      {
        const itaRes = determineOvertoneFromLabITA(medianL, medianB);
        overtone = itaRes.overtone;
        itaValue = itaRes.ita;
        fitz = itaRes.fitzpatrick;
      }
      const value = determineValue(skinR, skinG, skinB);
      const chroma = determineChroma(skinR, skinG, skinB, eyeR, eyeG, eyeB);
      const season = determineSeason(undertone, value, chroma);
      
      console.log(`  Value: ${value}, Chroma: ${chroma}, Season: ${season}`);
      
      // Calculate confidence based on skin-eye contrast only
      const skinLuma = 0.299 * skinR + 0.587 * skinG + 0.114 * skinB;
      const eyeLuma = 0.299 * eyeR + 0.587 * eyeG + 0.114 * eyeB;
      const skinEyeContrast = Math.abs(skinLuma - eyeLuma);
      
      // Get the actual scores from the undertone calculation (Lab path when available)
      const { warmScore, coolScore } = dominantSkinTone.lab
        ? getUndertoneScoresFromLab(dominantSkinTone.lab.a, dominantSkinTone.lab.b)
        : getUndertoneScores(skinR, skinG, skinB);
      console.log(`  Warm score: ${warmScore}, Cool score: ${coolScore}`);
      
      const confidence = calculateConfidence(warmScore, coolScore, skinEyeContrast);

      const analysisResults: AnalysisResults = {
        undertone,
        overtone,
        season,
        dimensions: {
          hue: undertone,
          value,
          chroma
        },
        confidence,
        skinColor: {
          name: 'Skin',
          color: `rgb(${skinR}, ${skinG}, ${skinB})`,
          rgb: [skinR, skinG, skinB]
        },
        dominantSkinTone,
        eyeColor: {
          name: 'Eyes',
          color: `rgb(${eyeR}, ${eyeG}, ${eyeB})`,
          rgb: [eyeR, eyeG, eyeB]
        },

        // Include swatches for UI display
        skinSwatches,
        eyeSwatches,
        ita: itaValue,
        fitzpatrick: fitz
      };

      setResults(analysisResults);

      console.log('🎉 Color analysis completed successfully');
      console.log('Results stored with swatches:', {
        skinSwatches: analysisResults.skinSwatches,
        eyeSwatches: analysisResults.eyeSwatches
      });

    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Show user-friendly error messages
      if (errorMessage.includes('timeout')) {
        alert('Analysis took too long. Please try with a different image or check your internet connection.');
      } else if (errorMessage.includes('No face detected')) {
        alert('No face was detected in the image. Please use a clear photo with a visible face.');
      } else if (errorMessage.includes('BindingError') || errorMessage.includes('deleted object')) {
        alert('Technical error occurred. Please refresh the page and try again.');
      } else {
        alert(`Analysis failed: ${errorMessage}`);
      }
      
      clearResults();
    } finally {
      setIsAnalyzing(false);
      setShowAnalysisScreen(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Analysis Overlay */}
      <AnalysisOverlay isVisible={showAnalysisScreen} />
    
      {/* Upload Screen (only when no image selected yet) */}
      {!hasStartedAnalysis && !selectedImage && (
        <UploadScreen
          onImageUpload={handleImageUpload}
          onLoadTestImage={loadTestImage}
        />
      )}

      {/* Processing Screen */}
      {selectedImage && !hasStartedAnalysis && (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#c7e3ff' }}>
      <div className="safe-area-padding">


            <main className={sharedStyles.container}>
              <ProcessingScreen
                selectedImage={selectedImage}
                isAnalyzing={isAnalyzing}
                onAnalyzeColors={analyzeColors}
                imageRef={imageRef as React.RefObject<HTMLImageElement>}
                overlayRef={overlayRef as React.RefObject<HTMLCanvasElement>}
              />
            </main>
              </div>
            </div>
          )}
        
      {/* Results Screen */}
      {results && selectedImage && (
        <div className="min-h-screen text-white" style={{ backgroundColor: '#c7e3ff' }}>
          <div className="safe-area-padding">

            <main className={sharedStyles.container}>
              <ResultsScreen
                results={results}
                          selectedImage={selectedImage}
                          landmarks={landmarks}
                        />
            </main>
                      </div>
                    </div>
      )}

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ColorAnalysis;