
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { FuzzyRiskAssessment } from '@/services/fuzzyRiskCalculator';
import { useIsMobile } from '@/hooks/use-mobile';

interface RiskFactorsChartProps {
  riskAssessment: FuzzyRiskAssessment;
}

const getRiskColor = (dominantSet: string) => {
  switch (dominantSet) {
    case 'low': return '#4ade80';
    case 'medium': return '#facc15';
    case 'high': return '#f87171';
    default: return '#94a3b8';
  }
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border border-border p-2 rounded-md shadow-md">
        <p className="font-medium">{`${data.name}`}</p>
        <p>{`${data.description}`}</p>
        <p>{`Value: ${data.value}`}</p>
        <p>{`Dominant Set: ${data.dominantSet}`}</p>
        <p>{`Low: ${(data.fuzzyValues.low * 100).toFixed(1)}%`}</p>
        <p>{`Medium: ${(data.fuzzyValues.medium * 100).toFixed(1)}%`}</p>
        <p>{`High: ${(data.fuzzyValues.high * 100).toFixed(1)}%`}</p>
      </div>
    );
  }
  return null;
};

const RiskFactorsChart = ({ riskAssessment }: RiskFactorsChartProps) => {
  const isMobile = useIsMobile();
  
  const chartData = Object.entries(riskAssessment.factors).map(([key, data]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    riskValue: data.fuzzyValues.high + (data.fuzzyValues.medium * 0.5), // Combined risk score
    value: data.value,
    description: data.description,
    weight: data.weight,
    dominantSet: data.dominantSet,
    fuzzyValues: data.fuzzyValues
  }));

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={isMobile ? { top: 20, right: 10, left: 0, bottom: 100 } : { top: 20, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={80}
            tick={{ fontSize: isMobile ? 10 : 12 }}
            interval={0}
          />
          <YAxis 
            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            domain={[0, 1]}
            tick={{ fontSize: isMobile ? 10 : 12 }}
            width={isMobile ? 30 : 40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            height={36}
            wrapperStyle={isMobile ? { fontSize: '10px' } : undefined}
          />
          <Bar dataKey="riskValue" name="Fuzzy Risk Factor">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getRiskColor(entry.dominantSet)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RiskFactorsChart;
