import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const ResolutionTimelineChart = ({ data, chartType = 'line', loading = false }) => {
  const mockData = data || [
    { month: 'Jan', reported: 145, resolved: 132, pending: 13 },
    { month: 'Feb', reported: 167, resolved: 158, pending: 18 },
    { month: 'Mar', reported: 189, resolved: 175, pending: 32 },
    { month: 'Apr', reported: 203, resolved: 195, pending: 40 },
    { month: 'May', reported: 234, resolved: 218, pending: 56 },
    { month: 'Jun', reported: 256, resolved: 241, pending: 71 },
    { month: 'Jul', reported: 278, resolved: 265, pending: 84 },
    { month: 'Aug', reported: 298, resolved: 285, pending: 97 },
    { month: 'Sep', reported: 312, resolved: 301, pending: 108 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-modal">
          <p className="font-medium text-popover-foreground mb-2">{label} 2024</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: <span className="font-medium">{entry?.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading timeline data...</p>
        </div>
      </div>
    );
  }

  const ChartComponent = chartType === 'area' ? AreaChart : LineChart;

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent data={mockData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E9ECEF" />
          <XAxis 
            dataKey="month" 
            stroke="#6C757D"
            fontSize={12}
          />
          <YAxis 
            stroke="#6C757D"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {chartType === 'area' ? (
            <>
              <Area
                type="monotone"
                dataKey="reported"
                stackId="1"
                stroke="#0D1B2A"
                fill="#0D1B2A"
                fillOpacity={0.8}
                name="Reported"
              />
              <Area
                type="monotone"
                dataKey="resolved"
                stackId="1"
                stroke="#28A745"
                fill="#28A745"
                fillOpacity={0.8}
                name="Resolved"
              />
              <Area
                type="monotone"
                dataKey="pending"
                stackId="1"
                stroke="#E63946"
                fill="#E63946"
                fillOpacity={0.8}
                name="Pending"
              />
            </>
          ) : (
            <>
              <Line
                type="monotone"
                dataKey="reported"
                stroke="#0D1B2A"
                strokeWidth={3}
                dot={{ fill: '#0D1B2A', strokeWidth: 2, r: 4 }}
                name="Reported"
              />
              <Line
                type="monotone"
                dataKey="resolved"
                stroke="#28A745"
                strokeWidth={3}
                dot={{ fill: '#28A745', strokeWidth: 2, r: 4 }}
                name="Resolved"
              />
              <Line
                type="monotone"
                dataKey="pending"
                stroke="#E63946"
                strokeWidth={3}
                dot={{ fill: '#E63946', strokeWidth: 2, r: 4 }}
                name="Pending"
              />
            </>
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

export default ResolutionTimelineChart;