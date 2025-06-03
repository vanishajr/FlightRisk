
import React, { useState } from 'react';
import RiskIndicator from './RiskIndicator';
import RiskFactorsChart from './RiskFactorsChart';
import Recommendations from './Recommendations';
import FuzzyRulesDisplay from './FuzzyRulesDisplay';
import { calculateFuzzyRisk, FuzzyRiskAssessment, FlightData } from '@/services/fuzzyRiskCalculator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

// Mock real-time data - in a real app, this would come from sensors or APIs
const mockFlightData: FlightData = {
  speed: 580,
  acceleration: 0.5,
  temperature: 12,
  humidity: 70,
  windSpeed: 15,
  visibility: 8
};

const PassengerDashboard = () => {
  const [riskAssessment] = useState<FuzzyRiskAssessment>(
    calculateFuzzyRisk(mockFlightData)
  );
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center">Current Flight Status</h1>
        <p className="text-muted-foreground text-center mt-2">
          Real-time fuzzy logic flight safety analysis for passengers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Fuzzy Logic Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <RiskIndicator 
                level={riskAssessment.level} 
                score={riskAssessment.score} 
              />
              <div className={`${isMobile ? 'w-full overflow-x-auto' : 'w-full'}`}>
                <RiskFactorsChart riskAssessment={riskAssessment} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Speed:</span>
                  <p className="text-muted-foreground">{mockFlightData.speed} knots</p>
                </div>
                <div>
                  <span className="font-medium">Temperature:</span>
                  <p className="text-muted-foreground">{mockFlightData.temperature}°C</p>
                </div>
                <div>
                  <span className="font-medium">Wind Speed:</span>
                  <p className="text-muted-foreground">{mockFlightData.windSpeed} knots</p>
                </div>
                <div>
                  <span className="font-medium">Visibility:</span>
                  <p className="text-muted-foreground">{mockFlightData.visibility} km</p>
                </div>
                <div>
                  <span className="font-medium">Humidity:</span>
                  <p className="text-muted-foreground">{mockFlightData.humidity}%</p>
                </div>
                <div>
                  <span className="font-medium">Acceleration:</span>
                  <p className="text-muted-foreground">{mockFlightData.acceleration} knots/min</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <FuzzyRulesDisplay riskAssessment={riskAssessment} />
          
          <Recommendations riskAssessment={riskAssessment} />
        </div>
      </div>
    </div>
  );
};

export default PassengerDashboard;
