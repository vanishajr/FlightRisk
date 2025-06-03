
// Define fuzzy sets for each parameter
export type FuzzySet = {
  low: { min: number; max: number; peak?: number };
  medium: { min: number; max: number; peak?: number };
  high: { min: number; max: number; peak?: number };
};

export type FlightData = {
  speed: number;
  acceleration: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
};

export type FuzzyRiskAssessment = {
  score: number;
  level: 'low' | 'medium' | 'high';
  factors: {
    [key: string]: {
      value: number;
      fuzzyValues: { low: number; medium: number; high: number };
      dominantSet: 'low' | 'medium' | 'high';
      weight: number;
      description: string;
    }
  };
  fuzzyRules: string[];
};

// Define fuzzy sets for each flight parameter
const fuzzyParameters: Record<string, FuzzySet> = {
  speed: {
    low: { min: 0, max: 520, peak: 450 },
    medium: { min: 480, max: 580, peak: 530 },
    high: { min: 550, max: 800, peak: 650 }
  },
  acceleration: {
    low: { min: -2, max: 0.5, peak: 0 },
    medium: { min: 0, max: 2, peak: 1 },
    high: { min: 1.5, max: 5, peak: 3 }
  },
  temperature: {
    low: { min: -20, max: 10, peak: 5 },
    medium: { min: 5, max: 25, peak: 15 },
    high: { min: 20, max: 50, peak: 35 }
  },
  humidity: {
    low: { min: 0, max: 40, peak: 20 },
    medium: { min: 30, max: 70, peak: 50 },
    high: { min: 60, max: 100, peak: 85 }
  },
  windSpeed: {
    low: { min: 0, max: 10, peak: 5 },
    medium: { min: 8, max: 20, peak: 15 },
    high: { min: 18, max: 50, peak: 30 }
  },
  visibility: {
    low: { min: 0, max: 5, peak: 2 },
    medium: { min: 3, max: 12, peak: 8 },
    high: { min: 10, max: 20, peak: 15 }
  }
};

// Weights for each parameter
const parameterWeights = {
  speed: 0.25,
  acceleration: 0.15,
  temperature: 0.15,
  humidity: 0.10,
  windSpeed: 0.25,
  visibility: 0.10
};

// Triangular membership function
function triangularMembership(value: number, set: { min: number; max: number; peak?: number }): number {
  const peak = set.peak || (set.min + set.max) / 2;
  
  if (value <= set.min || value >= set.max) {
    return 0;
  }
  
  if (value <= peak) {
    return (value - set.min) / (peak - set.min);
  } else {
    return (set.max - value) / (set.max - peak);
  }
}

// Calculate fuzzy membership values for a parameter
function calculateFuzzyMembership(value: number, parameter: string): { low: number; medium: number; high: number } {
  const sets = fuzzyParameters[parameter];
  
  return {
    low: triangularMembership(value, sets.low),
    medium: triangularMembership(value, sets.medium),
    high: triangularMembership(value, sets.high)
  };
}

// Get dominant fuzzy set
function getDominantSet(fuzzyValues: { low: number; medium: number; high: number }): 'low' | 'medium' | 'high' {
  if (fuzzyValues.high >= fuzzyValues.medium && fuzzyValues.high >= fuzzyValues.low) {
    return 'high';
  } else if (fuzzyValues.medium >= fuzzyValues.low) {
    return 'medium';
  } else {
    return 'low';
  }
}

// Fuzzy rules for risk assessment
const fuzzyRules = [
  // High risk rules
  { condition: (factors: any) => factors.speed.dominantSet === 'high' && factors.windSpeed.dominantSet === 'high', risk: 'high', description: 'High speed with high wind speed' },
  { condition: (factors: any) => factors.visibility.dominantSet === 'low' && factors.windSpeed.dominantSet === 'high', risk: 'high', description: 'Low visibility with high wind speed' },
  { condition: (factors: any) => factors.acceleration.dominantSet === 'high' && factors.speed.dominantSet === 'high', risk: 'high', description: 'High acceleration with high speed' },
  
  // Medium risk rules
  { condition: (factors: any) => factors.speed.dominantSet === 'medium' && factors.windSpeed.dominantSet === 'medium', risk: 'medium', description: 'Medium speed with medium wind speed' },
  { condition: (factors: any) => factors.temperature.dominantSet === 'high' && factors.humidity.dominantSet === 'high', risk: 'medium', description: 'High temperature with high humidity' },
  { condition: (factors: any) => factors.visibility.dominantSet === 'medium', risk: 'medium', description: 'Medium visibility conditions' },
  
  // Low risk rules (default)
  { condition: (factors: any) => factors.speed.dominantSet === 'low' && factors.windSpeed.dominantSet === 'low', risk: 'low', description: 'Low speed with low wind speed' },
  { condition: (factors: any) => factors.visibility.dominantSet === 'high' && factors.temperature.dominantSet === 'medium', risk: 'low', description: 'High visibility with optimal temperature' }
];

// Apply fuzzy rules and calculate overall risk
function applyFuzzyRules(factors: any): { risk: 'low' | 'medium' | 'high'; appliedRules: string[] } {
  const appliedRules: string[] = [];
  let riskScores = { low: 0, medium: 0, high: 0 };
  
  // Apply each rule
  for (const rule of fuzzyRules) {
    if (rule.condition(factors)) {
      appliedRules.push(rule.description);
      riskScores[rule.risk as keyof typeof riskScores] += 1;
    }
  }
  
  // If no rules applied, use weighted average of dominant sets
  if (appliedRules.length === 0) {
    for (const [param, factor] of Object.entries(factors)) {
      const weight = parameterWeights[param as keyof typeof parameterWeights] || 0.1;
      riskScores[factor.dominantSet as keyof typeof riskScores] += weight;
    }
    appliedRules.push('Default weighted calculation based on parameter dominance');
  }
  
  // Determine overall risk
  let overallRisk: 'low' | 'medium' | 'high' = 'low';
  if (riskScores.high > riskScores.medium && riskScores.high > riskScores.low) {
    overallRisk = 'high';
  } else if (riskScores.medium > riskScores.low) {
    overallRisk = 'medium';
  }
  
  return { risk: overallRisk, appliedRules };
}

// Main fuzzy risk calculation function
export function calculateFuzzyRisk(data: FlightData): FuzzyRiskAssessment {
  const factors: FuzzyRiskAssessment['factors'] = {};
  
  // Calculate fuzzy membership for each parameter
  for (const [param, value] of Object.entries(data)) {
    const fuzzyValues = calculateFuzzyMembership(value, param);
    const dominantSet = getDominantSet(fuzzyValues);
    
    factors[param] = {
      value,
      fuzzyValues,
      dominantSet,
      weight: parameterWeights[param as keyof typeof parameterWeights] || 0.1,
      description: getParameterDescription(param)
    };
  }
  
  // Apply fuzzy rules
  const { risk, appliedRules } = applyFuzzyRules(factors);
  
  // Calculate numerical score (0-100)
  let score = 0;
  for (const [param, factor] of Object.entries(factors)) {
    const weight = parameterWeights[param as keyof typeof parameterWeights] || 0.1;
    const riskContribution = (factor.fuzzyValues.low * 0 + factor.fuzzyValues.medium * 50 + factor.fuzzyValues.high * 100);
    score += riskContribution * weight;
  }
  
  return {
    score: Math.round(score),
    level: risk,
    factors,
    fuzzyRules: appliedRules
  };
}

function getParameterDescription(param: string): string {
  const descriptions: Record<string, string> = {
    speed: "Aircraft speed in knots",
    acceleration: "Rate of speed change",
    temperature: "Outside air temperature",
    humidity: "Air humidity percentage",
    windSpeed: "Current wind speed",
    visibility: "Visibility distance in km"
  };
  return descriptions[param] || "Unknown parameter";
}
