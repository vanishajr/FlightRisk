
// Define types for our flight data and risk assessment
export type FlightData = {
  speed: number;
  acceleration: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
};

export type RiskAssessment = {
  score: number;
  level: 'low' | 'medium' | 'high';
  factors: {
    [key: string]: {
      value: number;
      risk: number;
      weight: number;
      description: string;
    }
  };
};

// Default thresholds for each parameter
const thresholds = {
  speed: {
    low: 500, // below this is low risk
    high: 600, // above this is high risk
    weight: 0.3, // importance in overall risk
    description: "Aircraft speed in knots"
  },
  acceleration: {
    low: -0.5, // stable or slight deceleration
    high: 2, // rapid acceleration
    weight: 0.1,
    description: "Rate of speed change"
  },
  temperature: {
    low: 5, // cold but not extreme
    high: 35, // hot conditions
    ideal: 15, // ideal temperature
    weight: 0.15,
    description: "Outside air temperature"
  },
  humidity: {
    low: 30,
    high: 80,
    weight: 0.05,
    description: "Air humidity percentage"
  },
  windSpeed: {
    low: 5,
    high: 25,
    weight: 0.25,
    description: "Current wind speed"
  },
  visibility: {
    low: 3, // below this is high risk
    high: 10, // above this is low risk
    weight: 0.15,
    description: "Visibility distance in km"
  }
};

// Calculate risk score for individual factor
function calculateFactorRisk(value: number, factorName: string): number {
  const threshold = thresholds[factorName as keyof typeof thresholds];
  
  // Special cases
  if (factorName === 'visibility') {
    // For visibility, higher is better (lower risk)
    if (value >= threshold.high) return 0;
    if (value <= threshold.low) return 1;
    return 1 - ((value - threshold.low) / (threshold.high - threshold.low));
  }
  
  if (factorName === 'temperature') {
    // Temperature risk is based on deviation from ideal
    const deviation = Math.abs(value - threshold.ideal);
    const range = Math.max(threshold.ideal - threshold.low, threshold.high - threshold.ideal);
    return Math.min(deviation / range, 1);
  }
  
  // Standard case - higher value means higher risk
  if (value <= threshold.low) return 0;
  if (value >= threshold.high) return 1;
  return (value - threshold.low) / (threshold.high - threshold.low);
}

// Calculate overall risk
export function calculateRisk(data: FlightData): RiskAssessment {
  // Initialize empty factors object
  const factors: RiskAssessment['factors'] = {};
  
  // Calculate risk for each factor
  let totalRisk = 0;
  let totalWeight = 0;
  
  for (const [key, value] of Object.entries(data)) {
    const threshold = thresholds[key as keyof typeof thresholds];
    if (!threshold) continue;
    
    const factorRisk = calculateFactorRisk(value, key);
    totalRisk += factorRisk * threshold.weight;
    totalWeight += threshold.weight;
    
    factors[key] = {
      value,
      risk: factorRisk,
      weight: threshold.weight,
      description: threshold.description
    };
  }
  
  // Normalize risk score to 0-100 range
  const normalizedScore = Math.round((totalRisk / totalWeight) * 100);
  
  // Determine risk level
  let level: 'low' | 'medium' | 'high';
  if (normalizedScore <= 30) {
    level = 'low';
  } else if (normalizedScore <= 70) {
    level = 'medium';
  } else {
    level = 'high';
  }
  
  return {
    score: normalizedScore,
    level,
    factors
  };
}
