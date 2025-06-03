
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FuzzyRiskAssessment } from '@/services/fuzzyRiskCalculator';
import { cn } from '@/lib/utils';

interface RecommendationsProps {
  riskAssessment: FuzzyRiskAssessment;
  className?: string;
}

const getRecommendation = (factor: string, dominantSet: string, fuzzyValues: any): string => {
  switch (factor) {
    case 'speed':
      return dominantSet === 'high' 
        ? "Reduce aircraft speed to safe levels immediately" 
        : dominantSet === 'medium' 
          ? "Monitor speed closely and consider reduction" 
          : "Speed is within safe parameters";
    case 'acceleration':
      return dominantSet === 'high' 
        ? "Reduce rate of speed change immediately" 
        : dominantSet === 'medium' 
          ? "Smooth out acceleration/deceleration patterns" 
          : "Acceleration is stable and safe";
    case 'temperature':
      return dominantSet === 'high' 
        ? "Monitor aircraft systems for high temperature effects" 
        : dominantSet === 'low' 
          ? "Be aware of potential icing conditions in cold weather" 
          : "Temperature conditions are optimal for flight";
    case 'humidity':
      return dominantSet === 'high' 
        ? "Monitor for potential icing and condensation effects" 
        : dominantSet === 'medium' 
          ? "Watch for minor condensation effects" 
          : "Humidity levels are acceptable";
    case 'windSpeed':
      return dominantSet === 'high' 
        ? "Exercise extreme caution - consider postponing or diverting" 
        : dominantSet === 'medium' 
          ? "Adjust flight path and speed for wind conditions" 
          : "Wind conditions are favorable for safe flight";
    case 'visibility':
      return dominantSet === 'low' 
        ? "Consider alternative routes or delayed departure due to poor visibility" 
        : dominantSet === 'medium' 
          ? "Maintain heightened visual monitoring" 
          : "Visibility is excellent for safe flight operations";
    default:
      return "Monitor parameter within normal operational guidelines";
  }
};

const getRiskColor = (dominantSet: string) => {
  switch (dominantSet) {
    case 'high': return '#f87171';
    case 'medium': return '#facc15';
    case 'low': return '#4ade80';
    default: return '#94a3b8';
  }
};

const Recommendations = ({ riskAssessment, className }: RecommendationsProps) => {
  // Sort factors by risk level (high dominance and high fuzzy values first)
  const sortedFactors = Object.entries(riskAssessment.factors)
    .sort((a, b) => {
      const aRisk = a[1].fuzzyValues.high + (a[1].fuzzyValues.medium * 0.5);
      const bRisk = b[1].fuzzyValues.high + (b[1].fuzzyValues.medium * 0.5);
      return bRisk - aRisk;
    });

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Fuzzy Logic Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {sortedFactors.map(([factor, data]) => (
            <li key={factor} className="border-l-4 pl-4 py-1" 
              style={{ borderColor: getRiskColor(data.dominantSet) }}
            >
              <h4 className="font-medium capitalize flex items-center gap-2">
                {factor}
                <span className="text-xs bg-muted px-2 py-1 rounded">
                  {data.dominantSet.toUpperCase()}
                </span>
              </h4>
              <p className="text-sm text-muted-foreground">
                {getRecommendation(factor, data.dominantSet, data.fuzzyValues)}
              </p>
              <div className="text-xs text-muted-foreground mt-1">
                Fuzzy membership: L:{(data.fuzzyValues.low * 100).toFixed(0)}% 
                M:{(data.fuzzyValues.medium * 100).toFixed(0)}% 
                H:{(data.fuzzyValues.high * 100).toFixed(0)}%
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default Recommendations;
