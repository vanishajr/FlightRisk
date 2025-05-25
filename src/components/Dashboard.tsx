import React, { useState } from 'react';
import FlightDataForm from './FlightDataForm';
import RiskIndicator from './RiskIndicator';
import RiskFactorsChart from './RiskFactorsChart';
import Recommendations from './Recommendations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import axios from 'axios';
import Plot from 'react-plotly.js';
import { toast } from 'sonner';

interface RiskAssessment {
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
}

interface VisualizationData {
  risk_factors: any;
  risk_gauge: any;
}

const initialFlightData = {
  speed: 550,
  acceleration: 0,
  temperature: 15,
  humidity: 60,
  windSpeed: 10,
  visibility: 10
};

const Dashboard = () => {
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [visualizations, setVisualizations] = useState<VisualizationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const handleDataSubmit = async (data: Record<string, number>) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/calculate-risk', {
        speed: data.speed,
        acceleration: data.acceleration,
        temperature: data.temperature,
        humidity: data.humidity,
        wind_speed: data.windSpeed,
        visibility: data.visibility
      });

      setRiskAssessment(response.data.risk_assessment);
      setVisualizations(response.data.visualizations);
      toast.success('Risk assessment updated successfully');
    } catch (error) {
      console.error('Error calculating risk:', error);
      toast.error('Failed to calculate risk assessment. Please try again.');
      if (axios.isAxiosError(error)) {
        console.error('API Error:', error.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <FlightDataForm onSubmitData={handleDataSubmit} isLoading={isLoading} />
        </div>
        
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Flight Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {isLoading ? (
                    <div className="w-full text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-4 text-muted-foreground">Calculating risk assessment...</p>
                    </div>
                  ) : riskAssessment ? (
                    <>
                      <RiskIndicator 
                        level={riskAssessment.level} 
                        score={riskAssessment.score} 
                      />
                      <div className={`${isMobile ? 'w-full overflow-x-auto' : 'w-full'}`}>
                        {visualizations && (
                          <Plot
                            data={visualizations.risk_factors.data}
                            layout={visualizations.risk_factors.layout}
                            style={{ width: '100%', height: '400px' }}
                            config={{ responsive: true }}
                          />
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="w-full text-center py-8 text-muted-foreground">
                      Enter flight data to calculate risk assessment
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {!isLoading && riskAssessment && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Gauge</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {visualizations && (
                      <Plot
                        data={visualizations.risk_gauge.data}
                        layout={visualizations.risk_gauge.layout}
                        style={{ width: '100%', height: '300px' }}
                        config={{ responsive: true }}
                      />
                    )}
                  </CardContent>
                </Card>
                <Recommendations riskAssessment={riskAssessment} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
