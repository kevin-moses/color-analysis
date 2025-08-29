import React from 'react';

interface ITAChartProps {
  l: number; // L*
  b: number; // b*
  className?: string;
}

// Domain for the chart (extended to include very dark tones / ITA < -30)
const L_MIN = 20; // allow down to 20 to cover ITA ~ -40
const L_MAX = 80;
const B_MIN = -5; // small negative b* just in case
const B_MAX = 45;

// Angle boundaries in degrees (from the ITA definition with pivot at (b=0, L=50))
const ANGLES = [55, 41, 28, 10, -30];

const CATEGORY_COLORS = {
  veryLight: '#ffe9d6',
  light: '#ffd0a6',
  intermediate: '#f0a66f',
  tan: '#d6854f',
  brown: '#995935',
  dark: '#5b3724'
};

const ITAChart: React.FC<ITAChartProps> = ({ l, b, className = '' }) => {
  const width = 340;
  const height = 260;
  const padding = 36;

  const scaleX = (bVal: number) => padding + (Math.max(B_MIN, Math.min(B_MAX, bVal)) - B_MIN) * ((width - padding * 2) / (B_MAX - B_MIN));
  const scaleY = (lVal: number) => padding + (L_MAX - Math.max(L_MIN, Math.min(L_MAX, lVal))) * ((height - padding * 2) / (L_MAX - L_MIN));

  const pivot = { x: scaleX(0), y: scaleY(50) };

  // Banana-shaped clip path (coarse approximation with bezier curves)
  // Broader locus that reaches further to the right at mid-L and lower to ~L=22
  const bananaPath = `M ${scaleX(3)} ${scaleY(80)}
                     C ${scaleX(12)} ${scaleY(78)}, ${scaleX(26)} ${scaleY(74)}, ${scaleX(35)} ${scaleY(66)}
                     C ${scaleX(44)} ${scaleY(58)}, ${scaleX(46)} ${scaleY(46)}, ${scaleX(38)} ${scaleY(38)}
                     C ${scaleX(28)} ${scaleY(30)}, ${scaleX(12)} ${scaleY(26)}, ${scaleX(7)} ${scaleY(24)}
                     C ${scaleX(12)} ${scaleY(30)}, ${scaleX(14)} ${scaleY(38)}, ${scaleX(16)} ${scaleY(48)}
                     C ${scaleX(18)} ${scaleY(60)}, ${scaleX(10)} ${scaleY(72)}, ${scaleX(3)} ${scaleY(80)} Z`;

  // Project a ray from the pivot at a given angle and draw a line across the plot
  const ray = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    const dx = Math.cos(rad);
    const dy = -Math.sin(rad); // SVG y increases downward
    // pick a long length to ensure it crosses the plotting area
    const len = Math.max(width, height);
    const x2 = pivot.x + dx * len;
    const y2 = pivot.y + dy * len;
    const x1 = pivot.x - dx * len;
    const y1 = pivot.y - dy * len;
    return `M ${x1} ${y1} L ${x2} ${y2}`;
  };

  return (
    <div className={className}>
      <svg width="100%" height="260" viewBox={`0 0 ${width} ${height}`}>
        {/* Axes */}
        <g stroke="#ffffff" opacity="0.7">
          <line x1={scaleX(B_MIN)} y1={scaleY(L_MIN)} x2={scaleX(B_MIN)} y2={scaleY(L_MAX)} strokeWidth="1" />
          <line x1={scaleX(B_MIN)} y1={scaleY(50)} x2={scaleX(B_MAX)} y2={scaleY(50)} strokeWidth="1" />
        </g>

        {/* Gradiented banana background */}
        <defs>
          <linearGradient id="itaGradient" x1="0" y1="0" x2="0" y2="1">
            {/* Top (higher L*) → very light */}
            <stop offset="0%" stopColor={CATEGORY_COLORS.veryLight} stopOpacity="0.95"/>
            <stop offset="20%" stopColor={CATEGORY_COLORS.light} stopOpacity="0.95"/>
            <stop offset="40%" stopColor={CATEGORY_COLORS.intermediate} stopOpacity="0.95"/>
            <stop offset="60%" stopColor={CATEGORY_COLORS.tan} stopOpacity="0.95"/>
            <stop offset="80%" stopColor={CATEGORY_COLORS.brown} stopOpacity="0.98"/>
            {/* Bottom (lower L*) → darkest */}
            <stop offset="100%" stopColor={CATEGORY_COLORS.dark} stopOpacity="1"/>
          </linearGradient>
          <clipPath id="bananaClip">
            <path d={bananaPath} />
          </clipPath>
        </defs>

        <rect x="0" y="0" width={width} height={height} fill="url(#itaGradient)" clipPath="url(#bananaClip)"/>

        {/* Angle rays (ITA) */}
        <g stroke="#ffffff" opacity="0.8">
          {/* include extra rays for negative angles down to about -40 */}
          {[...ANGLES, -10, -20, -40].map((deg) => (
            <path key={deg} d={ray(deg)} strokeWidth="1" strokeDasharray="6 5" />
          ))}
        </g>

        {/* Labels */}
        <g fill="#ffffff" fontSize="10" opacity="0.9">
          <text x={scaleX(B_MIN)} y={scaleY(L_MAX) - 6}>L* (Luminance)</text>
          <text x={scaleX(B_MAX) - 10} y={scaleY(50) + 14} textAnchor="end">b* (Yellow chroma)</text>
        </g>

        {/* Very dark guidance label */}
        <g fill="#ffffff" fontSize="9" opacity="0.8">
          <text x={scaleX(20)} y={scaleY(30) + 16}>ITA ≈ -30° to -40°</text>
        </g>

        {/* User marker */}
        <circle cx={scaleX(b)} cy={scaleY(l)} r="5" fill="#ffffff" stroke="#111111" strokeWidth="1.5" />
      </svg>
    </div>
  );
};

export default ITAChart;


