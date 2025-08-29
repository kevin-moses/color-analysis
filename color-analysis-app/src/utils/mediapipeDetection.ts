// MediaPipe-based face detection for color analysis

import { FaceMesh } from '@mediapipe/face_mesh';

export interface MediaPipeResults {
  landmarks: any[];
  imageData: ImageData;
}

export interface ColorSwatch {
  r: number;
  g: number;
  b: number;
  color: string; // rgb() string for CSS
  region?: string; // optional region label for skin swatches
  lab?: {
    l: number;
    a: number;
    b: number;
  };
}

export interface ColorExtractionResults {
  skinSwatches: ColorSwatch[]; // 10 skin colors from regions
  eyeSwatches: ColorSwatch[]; // 3 eye colors
  dominantSkinTone: ColorSwatch; // K-means clustered dominant skin tone
}

// MediaPipe face landmark indices for skin regions (tightened to avoid hairline and jaw edges)
export const SKIN_REGIONS = {
  leftCheek: [116, 117, 118, 119, 120, 121, 126, 142, 205, 206, 207, 213, 192, 147],
  rightCheek: [345, 346, 347, 348, 349, 350, 355, 371, 425, 426, 427, 436, 416, 376], 
  // Central forehead only (avoid hairline edges)
  forehead: [9, 10, 151],
  chin: [18, 175, 199, 428, 262, 431, 394, 395],
  noseBridge: [6, 19, 20, 94, 125, 141],
  noseBase: [1, 2, 5, 4, 115, 131, 134, 102],
  leftEyeArea: [46, 53, 52, 51, 50, 49, 220], // Skin around left eye (exclude brows)
  rightEyeArea: [276, 283, 282, 281, 280, 279, 440]  // Skin around right eye (exclude brows)
};

// Explicit non-skin exclusions: eyebrows and approximate hairline boundary points
export const NON_SKIN_EXCLUDE = {
  leftEyebrow: [70, 63, 105, 66, 107],
  rightEyebrow: [336, 296, 334, 293, 300],
  hairlineApprox: [338, 297, 332, 284, 251, 389, 356, 454]
};

// Helper: indices used to compute median Lab for undertone/ITA
export const MEDIAN_TARGET_REGION_NAMES = ['leftCheek','rightCheek','noseBridge','noseBase','chin'] as const;
export function getMedianTargetIndices(): number[] {
  const excluded = new Set<number>([...Object.values(NON_SKIN_EXCLUDE).flat() as number[]]);
  const indices: number[] = [];
  for (const name of MEDIAN_TARGET_REGION_NAMES) {
    const region = (SKIN_REGIONS as any)[name] as number[];
    region.forEach((idx) => { if (!excluded.has(idx)) indices.push(idx); });
  }
  return indices;
}

// Draw just the median-target landmarks as red dots on a canvas positioned over the image
export function drawMedianLandmarksOverlay(canvas: HTMLCanvasElement, landmarks: any[], opts?: { clear?: boolean }): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const doClear = opts?.clear ?? true;
  if (doClear) ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Use displayed CSS size for coordinate mapping to align with on-screen image
  const displayWidth = (canvas as HTMLCanvasElement).clientWidth || canvas.width;
  const displayHeight = (canvas as HTMLCanvasElement).clientHeight || canvas.height;

  const indices = getMedianTargetIndices();
  ctx.fillStyle = '#ff4d4d';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;

  for (const index of indices) {
    const lm = landmarks[index];
    if (!lm) continue;
    const x = lm.x * displayWidth;
    const y = lm.y * displayHeight;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

// Color-coded overlay: highlights the indices used for undertone/ITA in red,
// other skin-region indices in white (low opacity), and non-skin exclusions in cyan
export function drawColorCodedLandmarksOverlay(canvas: HTMLCanvasElement, landmarks: any[]): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('❌ Could not get canvas context');
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  console.log(`🎯 Drawing landmarks on ${canvas.width}x${canvas.height} canvas with ${landmarks.length} landmarks`);

  // Use displayed CSS size for coordinate mapping to align with on-screen image
  const displayWidth = (canvas as HTMLCanvasElement).clientWidth || canvas.width;
  const displayHeight = (canvas as HTMLCanvasElement).clientHeight || canvas.height;

  const used = new Set(getMedianTargetIndices());
  const excluded = new Set<number>([...Object.values(NON_SKIN_EXCLUDE).flat() as number[]]);
  const allSkin = new Set<number>([...Object.values(SKIN_REGIONS).flat() as number[]]);

  console.log(`🔴 Used indices (${used.size}):`, Array.from(used));
  console.log(`🔵 Excluded indices (${excluded.size}):`, Array.from(excluded));

  const drawSet = (indices: Set<number>, fill: string, radius = 6, alpha = 1) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = fill;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 3;
    let drawn = 0;
    indices.forEach((idx) => {
      const lm = landmarks[idx];
      if (!lm) return;
      const x = lm.x * displayWidth;
      const y = lm.y * displayHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      drawn++;
    });
    console.log(`✅ Drew ${drawn} landmarks with color ${fill}`);
    ctx.restore();
  };

  // Order: faint others first, then exclusions, then used (so used stays on top)
  const otherSkin = new Set<number>([...allSkin].filter((i) => !used.has(i)));
  drawSet(otherSkin, '#ffffff', 5, 0.6);
  drawSet(excluded, '#00ffff', 6, 0.8); // bright cyan for excluded
  drawSet(used, '#ff0000', 8, 1); // bright red for used - larger and more visible
}

// Eye regions for 3 different swatches
const EYE_REGIONS = {
  leftEyeInner: [33, 7, 163, 144, 145],
  leftEyeOuter: [153, 154, 155, 133, 173],
  leftEyeIris: [157, 158, 159, 160, 161, 246],
  rightEyeInner: [362, 382, 381, 380, 374],
  rightEyeOuter: [373, 390, 249, 263, 466],
  rightEyeIris: [388, 387, 386, 385, 384, 398]
};

// Extract average color from specific landmarks using neighborhood sampling
function extractColorFromLandmarks(imageData: ImageData, landmarks: any[], indices: number[], neighborhoodSize: number = 5): [number, number, number] {
  let r = 0, g = 0, b = 0, count = 0;
  
  
  const halfSize = Math.floor(neighborhoodSize / 2);
  
  for (const index of indices) {
    if (landmarks[index]) {
      const centerX = Math.floor(landmarks[index].x * imageData.width);
      const centerY = Math.floor(landmarks[index].y * imageData.height);
      
      // Sample neighborhood around each landmark
      for (let dy = -halfSize; dy <= halfSize; dy++) {
        for (let dx = -halfSize; dx <= halfSize; dx++) {
          const x = centerX + dx;
          const y = centerY + dy;
          
          if (x >= 0 && x < imageData.width && y >= 0 && y < imageData.height) {
            const pixelIndex = (y * imageData.width + x) * 4;
            r += imageData.data[pixelIndex];
            g += imageData.data[pixelIndex + 1];
            b += imageData.data[pixelIndex + 2];
            count++;
          }
        }
      }
    }
  }
  
  const avgR = count > 0 ? Math.round(r / count) : 0;
  const avgG = count > 0 ? Math.round(g / count) : 0;
  const avgB = count > 0 ? Math.round(b / count) : 0;
  
  return [avgR, avgG, avgB];
}

// Create color swatch object with L*a*b* values
function createSwatch(r: number, g: number, b: number, region?: string): ColorSwatch {
  const [l, a, bStar] = rgbToLab(r, g, b);
  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b),
    color: `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`,
    region,
    lab: {
      l: Math.round(l * 10) / 10,
      a: Math.round(a * 10) / 10,
      b: Math.round(bStar * 10) / 10
    }
  };
}

// Sort colors by brightness (darkest to lightest)
function sortByBrightness(swatches: ColorSwatch[]): ColorSwatch[] {
  return swatches.sort((a, b) => {
    const brightnessA = 0.299 * a.r + 0.587 * a.g + 0.114 * a.b;
    const brightnessB = 0.299 * b.r + 0.587 * b.g + 0.114 * b.b;
    return brightnessA - brightnessB; // darkest first
  });
}


// Draw landmarks on canvas for debugging
export function drawLandmarksOnCanvas(canvas: HTMLCanvasElement, landmarks: any[]): void {
  const ctx = canvas.getContext('2d');
  if (!ctx || !landmarks || landmarks.length === 0) return;
  
  
  // Define colors for different regions
  const regionColors = {
    skin: '#FF6B6B',      // Red for skin regions
    eyes: '#4ECDC4',      // Teal for eyes
    other: '#96CEB4'      // Green for other landmarks
  };
  
  // Get all skin landmark indices
  const allSkinIndices = new Set([
    ...SKIN_REGIONS.leftCheek,
    ...SKIN_REGIONS.rightCheek, 
    ...SKIN_REGIONS.forehead,
    ...SKIN_REGIONS.chin,
    ...SKIN_REGIONS.noseBridge,
    ...SKIN_REGIONS.noseBase,
    ...SKIN_REGIONS.leftEyeArea,
    ...SKIN_REGIONS.rightEyeArea
  ]);
  
  // Get all eye landmark indices
  const allEyeIndices = new Set([
    ...EYE_REGIONS.leftEyeInner,
    ...EYE_REGIONS.leftEyeOuter,
    ...EYE_REGIONS.leftEyeIris,
    ...EYE_REGIONS.rightEyeInner,
    ...EYE_REGIONS.rightEyeOuter,
    ...EYE_REGIONS.rightEyeIris
  ]);
  
  // Draw all landmarks
  landmarks.forEach((landmark, index) => {
    const x = landmark.x * canvas.width;
    const y = landmark.y * canvas.height;
    
    // Determine color based on region
    let color = regionColors.other;
    if (allSkinIndices.has(index)) {
      color = regionColors.skin;
    } else if (allEyeIndices.has(index)) {
      color = regionColors.eyes;
    }
    
    // Draw landmark point
    ctx.fillStyle = color;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    
    // Draw landmark index number (small text)
    if (allSkinIndices.has(index) || allEyeIndices.has(index)) {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '8px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(index.toString(), x, y - 4);
    }
  });
  
  // Draw legend
  const legendY = 20;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(10, legendY - 15, 200, 60);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.strokeRect(10, legendY - 15, 200, 60);
  
  ctx.fillStyle = '#000000';
  ctx.font = '12px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Landmarks:', 15, legendY);
  
  // Legend items
  const legendItems = [
    { color: regionColors.skin, text: 'Skin regions (10)' },
    { color: regionColors.eyes, text: 'Eye regions (3)' }
  ];
  
  legendItems.forEach((item, i) => {
    const y = legendY + 15 + (i * 12);
    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.arc(20, y - 3, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#000000';
    ctx.fillText(item.text, 30, y);
  });
}

export function extractColorsFromMediaPipe(mediapipeResults: MediaPipeResults): ColorExtractionResults {
  const { landmarks, imageData } = mediapipeResults;
  
  console.log('🎨 Starting color extraction with k-means clustering...');
  
  // Extract regional skin colors (existing method)
  const skinSwatches: ColorSwatch[] = [];
  
  const excluded = new Set<number>([...Object.values(NON_SKIN_EXCLUDE).flat() as number[]]);
  Object.entries(SKIN_REGIONS).forEach(([regionName, landmarks_indices]) => {
    const filtered = landmarks_indices.filter(idx => !excluded.has(idx));
    const [r, g, b] = extractColorFromLandmarks(imageData, landmarks, filtered, 7); // Use 7x7 neighborhoods for skin
    skinSwatches.push(createSwatch(r, g, b, regionName));
  });
  
  const sortedSkinSwatches = sortByBrightness(skinSwatches);
  
  // K-means clustering for dominant skin tone
  console.log('🔬 Collecting skin pixels for k-means clustering...');
  const skinPixels = collectSkinPixels(imageData, landmarks, SKIN_REGIONS, 2000);
  console.log(`📊 Collected ${skinPixels.length} skin pixels`);
  
  const skinClusters = kMeansClustering(skinPixels, 3, 25);
  console.log('🎯 K-means clustering complete');
  
  // Find the most representative cluster (usually the largest/most central)
  let dominantCluster = skinClusters[0];
  if (skinClusters.length > 1) {
    // Choose the cluster with values closest to the median of all skin pixels
    const medianR = skinPixels.map(p => p[0]).sort((a, b) => a - b)[Math.floor(skinPixels.length / 2)];
    const medianG = skinPixels.map(p => p[1]).sort((a, b) => a - b)[Math.floor(skinPixels.length / 2)];
    const medianB = skinPixels.map(p => p[2]).sort((a, b) => a - b)[Math.floor(skinPixels.length / 2)];
    
    let minDistance = Infinity;
    for (const cluster of skinClusters) {
      const distance = Math.sqrt(
        Math.pow(cluster[0] - medianR, 2) +
        Math.pow(cluster[1] - medianG, 2) +
        Math.pow(cluster[2] - medianB, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        dominantCluster = cluster;
      }
    }
  }
  
  const dominantSkinTone = createSwatch(dominantCluster[0], dominantCluster[1], dominantCluster[2]);
  console.log(`🌟 Dominant skin tone: RGB(${dominantCluster[0]}, ${dominantCluster[1]}, ${dominantCluster[2]}) | L*a*b*(${dominantSkinTone.lab?.l}, ${dominantSkinTone.lab?.a}, ${dominantSkinTone.lab?.b})`);
  
  // Extract eye colors (existing method)
  const eyeSwatches: ColorSwatch[] = [];
  
  // Left eye regions
  const [leftInnerR, leftInnerG, leftInnerB] = extractColorFromLandmarks(imageData, landmarks, EYE_REGIONS.leftEyeInner);
  const [rightInnerR, rightInnerG, rightInnerB] = extractColorFromLandmarks(imageData, landmarks, EYE_REGIONS.rightEyeInner);
  const innerEyeR = Math.round((leftInnerR + rightInnerR) / 2);
  const innerEyeG = Math.round((leftInnerG + rightInnerG) / 2);
  const innerEyeB = Math.round((leftInnerB + rightInnerB) / 2);
  eyeSwatches.push(createSwatch(innerEyeR, innerEyeG, innerEyeB));
  
  // Outer eye regions
  const [leftOuterR, leftOuterG, leftOuterB] = extractColorFromLandmarks(imageData, landmarks, EYE_REGIONS.leftEyeOuter);
  const [rightOuterR, rightOuterG, rightOuterB] = extractColorFromLandmarks(imageData, landmarks, EYE_REGIONS.rightEyeOuter);
  const outerEyeR = Math.round((leftOuterR + rightOuterR) / 2);
  const outerEyeG = Math.round((leftOuterG + rightOuterG) / 2);
  const outerEyeB = Math.round((leftOuterB + rightOuterB) / 2);
  eyeSwatches.push(createSwatch(outerEyeR, outerEyeG, outerEyeB));
  
  // Iris regions
  const [leftIrisR, leftIrisG, leftIrisB] = extractColorFromLandmarks(imageData, landmarks, EYE_REGIONS.leftEyeIris);
  const [rightIrisR, rightIrisG, rightIrisB] = extractColorFromLandmarks(imageData, landmarks, EYE_REGIONS.rightEyeIris);
  const irisR = Math.round((leftIrisR + rightIrisR) / 2);
  const irisG = Math.round((leftIrisG + rightIrisG) / 2);
  const irisB = Math.round((leftIrisB + rightIrisB) / 2);
  eyeSwatches.push(createSwatch(irisR, irisG, irisB));
  
  const sortedEyeSwatches = sortByBrightness(eyeSwatches);
  
  return {
    skinSwatches: sortedSkinSwatches,
    eyeSwatches: sortedEyeSwatches,
    dominantSkinTone
  };
}

export async function detectFaceRegionsWithMediaPipe(canvas: HTMLCanvasElement): Promise<MediaPipeResults> {
  return new Promise((resolve, reject) => {
    let faceMesh: FaceMesh | null = null;
    let isResolved = false;
    let timeoutId: NodeJS.Timeout;
    
    const cleanup = () => {
      if (faceMesh) {
        try {
          faceMesh.close();
        } catch (e) {
          console.warn('Error closing FaceMesh:', e);
        }
        faceMesh = null;
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };

    const safeResolve = (result: MediaPipeResults) => {
      if (!isResolved) {
        isResolved = true;
        cleanup();
        resolve(result);
      }
    };

    const safeReject = (error: Error) => {
      if (!isResolved) {
        isResolved = true;
        cleanup();
        reject(error);
      }
    };

    try {
      faceMesh = new FaceMesh({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        }
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.3,
        minTrackingConfidence: 0.3
      });

      // Set a timeout to prevent hanging
      timeoutId = setTimeout(() => {
        safeReject(new Error('MediaPipe processing timeout (10s)'));
      }, 10000);

      faceMesh.onResults((results) => {
        if (isResolved) return;

        try {
          if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            const landmarks = results.multiFaceLandmarks[0];
            
            const imageData = canvas.getContext('2d')?.getImageData(0, 0, canvas.width, canvas.height);
            if (!imageData) {
              safeReject(new Error('Could not get canvas image data'));
              return;
            }
            
            safeResolve({
              landmarks,
              imageData
            });
          } else {
            // Try alternative image processing
            tryAlternativeImageProcessing(canvas, faceMesh!, safeReject, safeResolve);
          }
        } catch (error) {
          safeReject(error instanceof Error ? error : new Error('Unknown error in onResults'));
        }
      });

      canvas.toBlob((blob) => {
        if (isResolved) return;
        
        if (!blob) {
          safeReject(new Error('Failed to convert canvas to blob'));
          return;
        }
        
        const img = new Image();
        img.onload = () => {
          if (isResolved || !faceMesh) return;
          
          try {
            faceMesh.send({ image: img });
          } catch (error) {
            safeReject(error instanceof Error ? error : new Error('Failed to send image to MediaPipe'));
          }
          
          // Clean up blob URL
          URL.revokeObjectURL(img.src);
        };
        
        img.onerror = () => {
          safeReject(new Error('Failed to load image from blob'));
          URL.revokeObjectURL(img.src);
        };
        
        img.src = URL.createObjectURL(blob);
      }, 'image/jpeg', 0.95);
      
    } catch (error) {
      safeReject(error instanceof Error ? error : new Error('Failed to initialize MediaPipe'));
    }
  });
}

// Alternative image processing for problematic images
function tryAlternativeImageProcessing(
  canvas: HTMLCanvasElement, 
  faceMesh: FaceMesh, 
  safeReject: (error: Error) => void,
  safeResolve: (result: MediaPipeResults) => void
) {
  console.warn('⚠️ No face detected with standard settings. Trying alternative processing...');
  
  // Try with PNG format and lower detection thresholds
  try {
    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: false, // Faster processing
      minDetectionConfidence: 0.1,
      minTrackingConfidence: 0.1
    });

    canvas.toBlob((blob) => {
      if (!blob) {
        safeReject(new Error('Failed to create PNG blob'));
        return;
      }
      
      const img = new Image();
      img.onload = () => {
        try {
          faceMesh.send({ image: img });
          
          // Give it 3 seconds, then give up
          setTimeout(() => {
            safeReject(new Error('No face detected after multiple attempts. Please ensure the image contains a clear, front-facing face.'));
          }, 3000);
        } catch (error) {
          safeReject(error instanceof Error ? error : new Error('Failed to send PNG image to MediaPipe'));
        }
        
        URL.revokeObjectURL(img.src);
      };
      
      img.onerror = () => {
        safeReject(new Error('Failed to load PNG image'));
        URL.revokeObjectURL(img.src);
      };
      
      img.src = URL.createObjectURL(blob);
    }, 'image/png');
  } catch (error) {
    safeReject(error instanceof Error ? error : new Error('Failed alternative processing'));
  }
}

// Collect all skin pixels from landmarks for k-means clustering
function collectSkinPixels(imageData: ImageData, landmarks: any[], skinRegions: any, sampleSize: number = 1000): number[][] {
  const pixels: number[][] = [];
  const allSkinIndices = Object.values(skinRegions).flat() as number[];
  const excluded = new Set<number>([...Object.values(NON_SKIN_EXCLUDE).flat() as number[]]);
  
  for (const index of allSkinIndices) {
    if (landmarks[index] && !excluded.has(index)) {
      const centerX = Math.floor(landmarks[index].x * imageData.width);
      const centerY = Math.floor(landmarks[index].y * imageData.height);
      
      // Sample 5x5 neighborhood around each landmark
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const x = centerX + dx;
          const y = centerY + dy;
          
          if (x >= 0 && x < imageData.width && y >= 0 && y < imageData.height) {
            const pixelIndex = (y * imageData.width + x) * 4;
            const r = imageData.data[pixelIndex];
            const g = imageData.data[pixelIndex + 1];
            const b = imageData.data[pixelIndex + 2];
            
            // Stronger skin filter in YCbCr space to exclude hair and very dark non-skin
            const luma = 0.299*r + 0.587*g + 0.114*b;
            const cb = 128 - 0.168736*r - 0.331264*g + 0.5*b;
            const cr = 128 + 0.5*r - 0.418688*g - 0.081312*b;
            const isSkinRGB = r > 40 && g > 20 && b > 15 && r > b && g > b * 0.7;
            const isSkinYCbCr = (cb >= 77 && cb <= 127) && (cr >= 133 && cr <= 173);
            if (isSkinRGB && isSkinYCbCr && luma > 30) {
              pixels.push([r, g, b]);
            }
          }
        }
      }
    }
  }
  
  // Deterministic down-sampling to improve performance (avoid randomness across runs)
  if (pixels.length > sampleSize) {
    const stride = Math.max(1, Math.floor(pixels.length / sampleSize));
    const sampled: number[][] = [];
    for (let i = 0; i < pixels.length && sampled.length < sampleSize; i += stride) {
      sampled.push(pixels[i]);
    }
    return sampled;
  }
  
  return pixels;
}

// K-means clustering implementation
function kMeansClustering(pixels: number[][], k: number = 3, maxIterations: number = 20): number[][] {
  if (pixels.length === 0) return [[120, 90, 70]];
  
  // Initialize centroids deterministically using brightness quantiles
  const brightness = (p: number[]) => 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2];
  const sorted = [...pixels].sort((a, b) => brightness(a) - brightness(b));
  const centroids: number[][] = [];
  for (let i = 1; i <= k; i++) {
    const idx = Math.min(sorted.length - 1, Math.floor((i * sorted.length) / (k + 1)));
    centroids.push([...sorted[idx]]);
  }
  
  for (let iter = 0; iter < maxIterations; iter++) {
    // Assign pixels to nearest centroid
    const clusters: number[][][] = Array(k).fill(null).map(() => []);
    
    for (const pixel of pixels) {
      let minDistance = Infinity;
      let closestCentroid = 0;
      
      for (let j = 0; j < k; j++) {
        const distance = Math.sqrt(
          Math.pow(pixel[0] - centroids[j][0], 2) +
          Math.pow(pixel[1] - centroids[j][1], 2) +
          Math.pow(pixel[2] - centroids[j][2], 2)
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          closestCentroid = j;
        }
      }
      
      clusters[closestCentroid].push(pixel);
    }
    
    // Update centroids
    let converged = true;
    for (let j = 0; j < k; j++) {
      if (clusters[j].length > 0) {
        const newCentroid = [
          Math.round(clusters[j].reduce((sum, p) => sum + p[0], 0) / clusters[j].length),
          Math.round(clusters[j].reduce((sum, p) => sum + p[1], 0) / clusters[j].length),
          Math.round(clusters[j].reduce((sum, p) => sum + p[2], 0) / clusters[j].length)
        ];
        
        if (Math.abs(newCentroid[0] - centroids[j][0]) > 1 ||
            Math.abs(newCentroid[1] - centroids[j][1]) > 1 ||
            Math.abs(newCentroid[2] - centroids[j][2]) > 1) {
          converged = false;
        }
        
        centroids[j] = newCentroid;
      }
    }
    
    if (converged) break;
  }
  
  return centroids;
}

// Convert RGB to XYZ color space
function rgbToXyz(r: number, g: number, b: number): [number, number, number] {
  // Normalize RGB values
  r = r / 255;
  g = g / 255;
  b = b / 255;
  
  // Apply gamma correction
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  
  // Apply transformation matrix (sRGB to XYZ)
  const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
  const y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750;
  const z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041;
  
  return [x * 100, y * 100, z * 100];
}

// Convert XYZ to L*a*b* color space
function xyzToLab(x: number, y: number, z: number): [number, number, number] {
  // D65 illuminant
  const xn = 95.047;
  const yn = 100.0;
  const zn = 108.883;
  
  x = x / xn;
  y = y / yn;
  z = z / zn;
  
  const fx = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x + 16/116);
  const fy = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y + 16/116);
  const fz = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z + 16/116);
  
  const l = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const bStar = 200 * (fy - fz);
  
  return [l, a, bStar];
}

// Convert RGB directly to L*a*b*
export function rgbToLab(r: number, g: number, b: number): [number, number, number] {
  const [x, y, z] = rgbToXyz(r, g, b);
  return xyzToLab(x, y, z);
}