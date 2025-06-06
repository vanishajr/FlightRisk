
import React, { useState } from 'react';
import FlightDataForm from './FlightDataForm';
import RiskIndicator from './RiskIndicator';
import RiskFactorsChart from './RiskFactorsChart';
import Recommendations from './Recommendations';
import FuzzyRulesDisplay from './FuzzyRulesDisplay';
import PilotAlerts from './PilotAlerts';
import { calculateFuzzyRisk, FuzzyRiskAssessment, FlightData } from '@/services/fuzzyRiskCalculator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAlerts } from '@/contexts/AlertContext';

const initialFlightData: FlightData = {
  speed: 550,
  acceleration: 0,
  temperature: 15,
  humidity: 60,
  windSpeed: 10,
  visibility: 10
};

const Dashboard = () => {
  const [riskAssessment, setRiskAssessment] = useState<FuzzyRiskAssessment>(
    calculateFuzzyRisk(initialFlightData)
  );
  const { alerts, addAlert } = useAlerts();
  const isMobile = useIsMobile();

  const handleDataSubmit = (data: Record<string, number>) => {
    const flightData: FlightData = {
      speed: data.speed,
      acceleration: data.acceleration,
      temperature: data.temperature,
      humidity: data.humidity,
      windSpeed: data.windSpeed,
      visibility: data.visibility
    };
    
    const newRiskAssessment = calculateFuzzyRisk(flightData);
    setRiskAssessment(newRiskAssessment);
  };

  const handleSendAlert = (message: string, severity: 'info' | 'warning' | 'critical') => {
    addAlert(message, severity, 'Captain');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <FlightDataForm onSubmitData={handleDataSubmit} />
          <PilotAlerts 
            isForPilot={true} 
            alerts={alerts} 
            onSendAlert={handleSendAlert}
          />
        </div>
        
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-6">
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
            
            <FuzzyRulesDisplay riskAssessment={riskAssessment} />
            
            <Recommendations riskAssessment={riskAssessment} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
