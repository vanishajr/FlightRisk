
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
import { RiskAssessment } from '@/services/riskCalculator';

interface RiskFactorsChartProps {
  riskAssessment: RiskAssessment;
}

const getRiskColor = (risk: number) => {
  if (risk <= 0.3) return '#4ade80';
  if (risk <= 0.7) return '#facc15';
  return '#f87171';
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border border-border p-2 rounded-md shadow-md">
        <p className="font-medium">{`${data.name}`}</p>
        <p>{`${data.description}`}</p>
        <p>{`Value: ${data.value}`}</p>
        <p>{`Risk: ${(data.risk * 100).toFixed(1)}%`}</p>
      </div>
    );
  }
  return null;
};

const RiskFactorsChart = ({ riskAssessment }: RiskFactorsChartProps) => {
  const chartData = Object.entries(riskAssessment.factors).map(([key, data]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    risk: data.risk,
    value: data.value,
    description: data.description,
    weight: data.weight
  }));

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
          <YAxis 
            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            domain={[0, 1]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="risk" name="Risk Factor">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getRiskColor(entry.risk)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RiskFactorsChart;
