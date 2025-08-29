import React from 'react';
import { labToRgb } from '../utils/colorAnalysis';

interface UndertoneColorMapProps {
  userLab: { l: number; a: number; b: number };
  className?: string;
  gridSize?: number; // number of cells per side (odd number recommended)
  maxDelta?: number; // maximum ± delta in Lab units at the grid edges
}

const UndertoneColorMap: React.FC<UndertoneColorMapProps> = ({ userLab, className = '', gridSize = 15, maxDelta = 15 }) => {
  // Create an NxN grid with user's LAB value in the center
  // x-axis: a* values (cool/red ← → warm/green)
  // y-axis: b* values (cool/blue ← → warm/yellow)
  const centerIndex = Math.floor(gridSize / 2);
  // Step per cell so that edges reach exactly ±maxDelta
  const step = centerIndex > 0 ? (maxDelta / centerIndex) : 0;

  const renderGrid = () => {
    const cells = [];
    
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        // Calculate the LAB values for this cell
        // Row 0 = highest b* (most yellow), Row 4 = lowest b* (most blue)
        // Col 0 = lowest a* (most green), Col 4 = highest a* (most red)
        const aOffset = (col - centerIndex) * step;
        const bOffset = (centerIndex - row) * step; // Inverted because row 0 should be highest b*
        
        const cellL = userLab.l;
        const cellA = userLab.a + aOffset;
        const cellB = userLab.b + bOffset;
        
        // Convert LAB to RGB for display
        const [r, g, b] = labToRgb(cellL, cellA, cellB);
        const backgroundColor = `rgb(${r}, ${g}, ${b})`;
        
        // Check if this is the center cell (user's actual value)
        const isCenter = row === centerIndex && col === centerIndex;
        
        cells.push(
          <div
            key={`${row}-${col}`}
            className="relative rounded-lg transition-all duration-200 hover:scale-110 active:scale-105 cursor-pointer touch-manipulation"
            style={{ 
              backgroundColor,
              aspectRatio: '1',
              minHeight: '40px',
              minWidth: '40px',
              ...(isCenter && {
                border: '1px solid white',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
              })
            }}
            title={`L*a*b*(${Math.round(cellL)}, ${Math.round(cellA)}, ${Math.round(cellB)})${isCenter ? ' - Your Value' : ''}`}
          >
          </div>
        );
      }
    }
    
    return cells;
  };

  return (
    <div className={`bg-white bg-opacity-10 rounded-xl p-4 border border-white border-opacity-20 ${className}`}>
      <h3 className="text-base font-normal mb-4 text-center text-white">
        🎨 Undertone Color Map
      </h3>
      <p className="text-xs text-white opacity-80 text-center mb-4">
        Your undertone position relative to others • White border = your value
      </p>
      
      {/* Color map grid with clean, non-overlapping axis labels */}
      <div className="flex justify-center mb-6">
        <div 
          className="grid items-center justify-items-center gap-3"
          style={{
            gridTemplateColumns: 'auto auto auto',
            gridTemplateRows: 'auto auto auto'
          }}
        >
          {/* Top label (b* warm) */}
          <div className="col-start-2 row-start-1 text-[11px] sm:text-xs text-white opacity-90">↑ Warm (Yellow)</div>

          {/* Left label (a* cool/green) */}
          <div className="col-start-1 row-start-2 text-right text-[11px] sm:text-xs text-white opacity-90 whitespace-nowrap">← Cool (Green)</div>

          {/* Grid in the middle */}
          <div className="col-start-2 row-start-2">
            <div 
              className="grid gap-2"
              style={{ 
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gridTemplateRows: `repeat(${gridSize}, 1fr)`
              }}
            >
              {renderGrid()}
            </div>
          </div>

          {/* Right label (a* warm/red) */}
          <div className="col-start-3 row-start-2 text-left text-[11px] sm:text-xs text-white opacity-90 whitespace-nowrap">Warm (Red) →</div>

          {/* Bottom label (b* cool/blue) */}
          <div className="col-start-2 row-start-3 text-[11px] sm:text-xs text-white opacity-90">↓ Cool (Blue)</div>
        </div>
      </div>

      {/* LAB summary */}
      <div className="text-center pt-3 border-t border-white border-opacity-20 text-xs text-white opacity-90">
        <p className="font-normal">Your LAB Values:</p>
        <p>L*: {Math.round(userLab.l)} | a*: {Math.round(userLab.a)} | b*: {Math.round(userLab.b)}</p>
        <p className="text-xs opacity-70 mt-1">Range: ±5 LAB units from your values</p>
      </div>
    </div>
  );
};

export default UndertoneColorMap;
