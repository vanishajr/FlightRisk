
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RiskAssessment } from '@/services/riskCalculator';
import { cn } from '@/lib/utils';

interface RecommendationsProps {
  riskAssessment: RiskAssessment;
  className?: string;
}

const getRecommendation = (factor: string, risk: number): string => {
  switch (factor) {
    case 'speed':
      return risk > 0.7 
        ? "Reduce aircraft speed to safe levels" 
        : risk > 0.3 
          ? "Monitor speed closely" 
          : "Speed is within safe parameters";
    case 'acceleration':
      return risk > 0.7 
        ? "Reduce rate of speed change immediately" 
        : risk > 0.3 
          ? "Smooth out acceleration/deceleration" 
          : "Acceleration is stable";
    case 'temperature':
      return risk > 0.7 
        ? "Be aware of temperature effects on aircraft performance" 
        : risk > 0.3 
          ? "Monitor systems for temperature-related issues" 
          : "Temperature conditions are optimal";
    case 'humidity':
      return risk > 0.7 
        ? "Be aware of potential icing conditions" 
        : risk > 0.3 
          ? "Monitor for condensation effects" 
          : "Humidity levels are acceptable";
    case 'windSpeed':
      return risk > 0.7 
        ? "Exercise extreme caution with current wind conditions" 
        : risk > 0.3 
          ? "Adjust for wind effects during maneuvers" 
          : "Wind conditions are favorable";
    case 'visibility':
      return risk > 0.7 
        ? "Consider alternative routes or delayed departure" 
        : risk > 0.3 
          ? "Maintain vigilant visual monitoring" 
          : "Visibility is good";
    default:
      return "No specific recommendation";
  }
};

const Recommendations = ({ riskAssessment, className }: RecommendationsProps) => {
  // Sort factors by risk level (highest first)
  const sortedFactors = Object.entries(riskAssessment.factors)
    .sort((a, b) => b[1].risk - a[1].risk);

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {sortedFactors.map(([factor, data]) => (
            <li key={factor} className="border-l-4 pl-4 py-1" 
              style={{ 
                borderColor: data.risk > 0.7 
                  ? '#f87171' 
                  : data.risk > 0.3 
                    ? '#facc15' 
                    : '#4ade80' 
              }}
            >
              <h4 className="font-medium capitalize">{factor}</h4>
              <p className="text-sm text-muted-foreground">{getRecommendation(factor, data.risk)}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default Recommendations;
