import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DepartmentPerformanceChart = ({ data, loading = false }) => {
  const mockData = data || [
    { 
      department: 'Roads & Transport', 
      assigned: 156, 
      completed: 142, 
      pending: 14,
      avgResolutionTime: 4.2
    },
    { 
      department: 'Water & Sanitation', 
      assigned: 134, 
      completed: 128, 
      pending: 6,
      avgResolutionTime: 3.8
    },
    { 
      department: 'Waste Management', 
      assigned: 98, 
      completed: 89, 
      pending: 9,
      avgResolutionTime: 5.1
    },
    { 
      department: 'Public Works', 
      assigned: 87, 
      completed: 81, 
      pending: 6,
      avgResolutionTime: 6.3
    },
    { 
      department: 'Electrical', 
      assigned: 76, 
      completed: 72, 
      pending: 4,
      avgResolutionTime: 2.9
    },
    { 
      department: 'Parks & Recreation', 
      assigned: 45, 
      completed: 43, 
      pending: 2,
      avgResolutionTime: 7.2
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-4 shadow-modal">
          <p className="font-medium text-popover-foreground mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Assigned: <span className="font-medium text-popover-foreground">{data?.assigned}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Completed: <span className="font-medium text-success">{data?.completed}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Pending: <span className="font-medium text-accent">{data?.pending}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Avg Resolution: <span className="font-medium text-popover-foreground">{data?.avgResolutionTime} days</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Success Rate: <span className="font-medium text-popover-foreground">
                {((data?.completed / data?.assigned) * 100)?.toFixed(1)}%
              </span>
            </p>
          </div>
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
          <p className="text-sm text-muted-foreground">Loading department data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={mockData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E9ECEF" />
          <XAxis 
            dataKey="department" 
            stroke="#6C757D"
            fontSize={11}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#6C757D"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="completed" 
            fill="#28A745" 
            name="Completed"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="pending" 
            fill="#E63946" 
            name="Pending"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentPerformanceChart;