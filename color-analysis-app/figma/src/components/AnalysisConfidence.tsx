import { Card } from "./ui/card";
import { Progress } from "./ui/progress";

interface AnalysisConfidenceProps {
  confidence: number;
}

export function AnalysisConfidence({ confidence }: AnalysisConfidenceProps) {
  const getConfidenceLabel = (conf: number) => {
    if (conf >= 90) return 'Excellent';
    if (conf >= 75) return 'Very Good';
    if (conf >= 60) return 'Good';
    if (conf >= 45) return 'Fair';
    return 'Low';
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 75) return 'text-green-600';
    if (conf >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <h3 className="text-lg mb-4 text-black">Analysis Confidence</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-black">{confidence.toFixed(1)}%</span>
          <span className={`text-sm ${getConfidenceColor(confidence)}`}>
            {getConfidenceLabel(confidence)}
          </span>
        </div>
        
        <Progress 
          value={confidence} 
          className="h-3 bg-gray-200"
        />
        
        <div className="mt-3 p-3 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-800 mb-2">What This Score Means:</p>
          <div className="space-y-1 text-xs text-gray-600">
            <p>• <strong>90%+:</strong> Excellent lighting and clear facial features detected</p>
            <p>• <strong>75-89%:</strong> Good quality analysis with reliable results</p>
            <p>• <strong>60-74%:</strong> Decent analysis, but lighting or image quality could be better</p>
            <p>• <strong>Under 60%:</strong> Consider retaking with better lighting</p>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            This score is based on MediaPipe's facial landmark detection accuracy and color extraction quality.
          </p>
        </div>
      </div>
    </Card>
  );
}