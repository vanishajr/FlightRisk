
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FuzzyRiskAssessment } from '@/services/fuzzyRiskCalculator';
import { Badge } from '@/components/ui/badge';

interface FuzzyRulesDisplayProps {
  riskAssessment: FuzzyRiskAssessment;
}

const FuzzyRulesDisplay = ({ riskAssessment }: FuzzyRulesDisplayProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fuzzy Logic Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Applied Rules:</h4>
            <ul className="space-y-1">
              {riskAssessment.fuzzyRules.map((rule, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  • {rule}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Fuzzy Set Memberships:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(riskAssessment.factors).map(([param, data]) => (
                <div key={param} className="border rounded-lg p-3">
                  <h5 className="font-medium capitalize mb-2">{param}</h5>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Low:</span>
                      <Badge variant={data.dominantSet === 'low' ? 'default' : 'secondary'}>
                        {(data.fuzzyValues.low * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Medium:</span>
                      <Badge variant={data.dominantSet === 'medium' ? 'default' : 'secondary'}>
                        {(data.fuzzyValues.medium * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">High:</span>
                      <Badge variant={data.dominantSet === 'high' ? 'default' : 'secondary'}>
                        {(data.fuzzyValues.high * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FuzzyRulesDisplay;
