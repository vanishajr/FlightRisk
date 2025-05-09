
import React from 'react';
import { cn } from '@/lib/utils';

type RiskLevel = 'low' | 'medium' | 'high';

interface RiskIndicatorProps {
  level: RiskLevel;
  score: number;
  className?: string;
}

const getRiskColor = (level: RiskLevel) => {
  switch (level) {
    case 'low':
      return 'bg-risk-low';
    case 'medium':
      return 'bg-risk-medium';
    case 'high':
      return 'bg-risk-high animate-pulse-warning';
    default:
      return 'bg-risk-low';
  }
};

const RiskIndicator = ({ level, score, className }: RiskIndicatorProps) => {
  const riskColor = getRiskColor(level);
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="text-sm font-medium mb-1">Risk Level</div>
      <div className={cn("w-24 h-24 rounded-full flex items-center justify-center", riskColor)}>
        <span className="text-2xl font-bold text-white">{score}</span>
      </div>
      <div className="mt-2 font-semibold capitalize">{level}</div>
    </div>
  );
};

export default RiskIndicator;
