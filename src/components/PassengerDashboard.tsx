
import React, { useState } from 'react';
import RiskIndicator from './RiskIndicator';
import RiskFactorsChart from './RiskFactorsChart';
import Recommendations from './Recommendations';
import FuzzyRulesDisplay from './FuzzyRulesDisplay';
import FlightAwareness from './FlightAwareness';
import PilotAlerts from './PilotAlerts';
import EntertainmentCorner from './EntertainmentCorner';
import FlightReport from './FlightReport';
import { calculateFuzzyRisk, FuzzyRiskAssessment, FlightData } from '@/services/fuzzyRiskCalculator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAlerts } from '@/contexts/AlertContext';

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
  const { alerts } = useAlerts();
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center">Passenger Flight Experience</h1>
        <p className="text-muted-foreground text-center mt-2">
          Your comprehensive flight information and entertainment hub
        </p>
      </div>

      <Tabs defaultValue="status" className="w-full">
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2' : 'grid-cols-5'}`}>
          <TabsTrigger value="status">Flight Status</TabsTrigger>
          <TabsTrigger value="safety">Safety Info</TabsTrigger>
          <TabsTrigger value="alerts">Crew Updates</TabsTrigger>
          <TabsTrigger value="entertainment">Entertainment</TabsTrigger>
          <TabsTrigger value="report">Flight Report</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Current Flight Analysis</CardTitle>
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
            </div>
          </div>
          
          <Recommendations riskAssessment={riskAssessment} />
        </TabsContent>

        <TabsContent value="safety">
          <FlightAwareness />
        </TabsContent>

        <TabsContent value="alerts">
          <PilotAlerts alerts={alerts} isForPilot={false} />
        </TabsContent>

        <TabsContent value="entertainment">
          <EntertainmentCorner riskLevel={riskAssessment.level} />
        </TabsContent>

        <TabsContent value="report">
          <FlightReport riskAssessment={riskAssessment} flightData={mockFlightData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PassengerDashboard;
