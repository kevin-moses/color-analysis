import { Card } from "./ui/card";

interface FitzpatrickScaleProps {
  type: number;
  ita: number;
}

export function FitzpatrickScale({ type, ita }: FitzpatrickScaleProps) {
  const types = [
    { label: 'Type I', description: 'Very Light', range: 'ITA > 55', color: '#F5DEB3' },
    { label: 'Type II', description: 'Light', range: '41 < ITA ≤ 55', color: '#DEB887' },
    { label: 'Type III', description: 'Intermediate', range: '28 < ITA ≤ 41', color: '#D2B48C' },
    { label: 'Type IV', description: 'Tan', range: '10 < ITA ≤ 28', color: '#BC9A6A' },
    { label: 'Type V', description: 'Brown', range: '-30 < ITA ≤ 10', color: '#8B7355' },
    { label: 'Type VI', description: 'Dark', range: 'ITA ≤ -30', color: '#654321' },
  ];

  return (
    <Card className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <h3 className="text-lg mb-4 text-black">Fitzpatrick Scale (ITA)</h3>
      
      <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-xl">
        <p className="text-xs text-purple-800 mb-1">What is ITA?</p>
        <p className="text-xs text-purple-700 mb-2">
          ITA (Individual Typology Angle) is calculated using the formula: ITA° = [Arc Tangent ((L* - 50)/b*)] × (180/π)
        </p>
        <p className="text-xs text-purple-700">
          This measures your skin's lightness vs. yellow/blue undertones to scientifically classify your skin type. Higher numbers = lighter skin, lower = darker.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-6 sm:grid-cols-3">
        {types.map((fitzType, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl border-2 text-center ${
              index + 1 === type ? 'border-secondary' : 'border-gray-200'
            }`}
          >
            <div
              className="w-full h-8 rounded-lg mb-2"
              style={{ backgroundColor: fitzType.color }}
            />
            <p className="text-xs text-black mb-1">{fitzType.label}</p>
            <p className="text-xs text-gray-600 mb-1">{fitzType.description}</p>
            <p className="text-xs text-gray-500">{fitzType.range}</p>
          </div>
        ))}
      </div>
      
      <div className="text-center bg-gray-50 rounded-xl p-4">
        <p className="text-black">
          <span className="text-secondary">ITA: {ita.toFixed(1)}°</span> • Fitzpatrick: {type}
        </p>
      </div>
    </Card>
  );
}