import React from 'react';

interface Props {
  ita: number;
  fitzpatrick: 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';
  className?: string;
}

const labels: Array<{type: 'I'|'II'|'III'|'IV'|'V'|'VI'; name: string; range: string;}> = [
  { type: 'I', name: 'Very Light', range: 'ITA > 55' },
  { type: 'II', name: 'Light', range: '41 < ITA ≤ 55' },
  { type: 'III', name: 'Intermediate', range: '28 < ITA ≤ 41' },
  { type: 'IV', name: 'Tan', range: '10 < ITA ≤ 28' },
  { type: 'V', name: 'Brown', range: '-30 < ITA ≤ 10' },
  { type: 'VI', name: 'Dark', range: 'ITA ≤ -30' },
];

const FitzpatrickScale: React.FC<Props> = ({ ita, fitzpatrick, className = '' }) => {
  return (
    <div className={`bg-white bg-opacity-10 rounded-xl p-4 border border-white border-opacity-20 ${className}`}>
      <h3 className="text-base font-normal mb-3 text-center text-white">Fitzpatrick Scale (ITA)</h3>
      <div className="grid grid-cols-6 gap-2">
        {labels.map(l => (
          <div key={l.type} className={`rounded-lg p-2 text-center ${l.type === fitzpatrick ? 'ring-2 ring-white' : ''}`} style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="text-xs text-white opacity-90">Type {l.type}</div>
            <div className="text-xs text-white opacity-80">{l.name}</div>
            <div className="text-[10px] text-white opacity-60 mt-1">{l.range}</div>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-white opacity-90 mt-3">ITA: {ita}° • Fitzpatrick: {fitzpatrick}</p>
    </div>
  );
};

export default FitzpatrickScale;


