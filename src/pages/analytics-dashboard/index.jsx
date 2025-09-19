import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MetricsCard from './components/MetricsCard';
import ChartContainer from './components/ChartContainer';
import IssuesByCategoryChart from './components/IssuesByCategoryChart';
import ResolutionTimelineChart from './components/ResolutionTimelineChart';
import DepartmentPerformanceChart from './components/DepartmentPerformanceChart';
import GeographicHeatMap from './components/GeographicHeatMap';
import DataTable from './components/DataTable';
import DateRangeSelector from './components/DateRangeSelector';

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '2024-08-17',
    endDate: '2024-09-17',
    range: '30d'
  });
  const [chartType, setChartType] = useState('line');
  const [refreshTimestamp, setRefreshTimestamp] = useState(new Date()?.toLocaleString());

  // Mock current user for header
  const currentUser = {
    name: "Admin User",
    email: "admin@civicare.gov.in"
  };

  // Mock metrics data
  const metricsData = [
    {
      title: "Total Issues",
      value: "2,847",
      change: "+12.5%",
      changeType: "increase",
      icon: "AlertCircle",
      description: "vs last month"
    },
    {
      title: "Resolution Rate",
      value: "87.3%",
      change: "+5.2%",
      changeType: "increase",
      icon: "CheckCircle",
      description: "issues resolved"
    },
    {
      title: "Avg Response Time",
      value: "4.2 days",
      change: "-1.3 days",
      changeType: "decrease",
      icon: "Clock",
      description: "faster than last month"
    },
    {
      title: "Citizen Satisfaction",
      value: "4.6/5",
      change: "+0.3",
      changeType: "increase",
      icon: "Star",
      description: "average rating"
    }
  ];

  // Add mock data for chart components
  const mockChartData = {
    categories: [
      { name: 'Roads & Transport', value: 450, percentage: 35 },
      { name: 'Water Supply', value: 320, percentage: 25 },
      { name: 'Sanitation', value: 280, percentage: 22 },
      { name: 'Electricity', value: 150, percentage: 12 },
      { name: 'Others', value: 80, percentage: 6 }
    ],
    timeline: [
      { date: '2024-08-17', resolved: 45, pending: 12, total: 57 },
      { date: '2024-08-24', resolved: 52, pending: 15, total: 67 },
      { date: '2024-08-31', resolved: 48, pending: 8, total: 56 },
      { date: '2024-09-07', resolved: 61, pending: 18, total: 79 },
      { date: '2024-09-14', resolved: 55, pending: 10, total: 65 }
    ],
    departments: [
      { name: 'Public Works', efficiency: 87, resolved: 234, total: 269 },
      { name: 'Water Board', efficiency: 92, resolved: 195, total: 212 },
      { name: 'Municipal Corp', efficiency: 78, resolved: 156, total: 200 },
      { name: 'Transport Dept', efficiency: 85, resolved: 128, total: 151 }
    ],
    geographic: [
      { region: 'North Zone', issues: 245, severity: 'medium' },
      { region: 'South Zone', issues: 189, severity: 'high' },
      { region: 'East Zone', issues: 167, severity: 'low' },
      { region: 'West Zone', issues: 201, severity: 'medium' }
    ]
  };

  const mockTableData = [
    { id: 1, category: 'Roads', status: 'Resolved', priority: 'High', date: '2024-09-15', department: 'Public Works' },
    { id: 2, category: 'Water', status: 'Pending', priority: 'Medium', date: '2024-09-14', department: 'Water Board' },
    { id: 3, category: 'Sanitation', status: 'In Progress', priority: 'High', date: '2024-09-13', department: 'Municipal Corp' }
  ];

  const handleRefreshData = () => {
    setLoading(true);
    setRefreshTimestamp(new Date()?.toLocaleString());
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const handleExportChart = (chartName) => {
    console.log(`Exporting ${chartName} chart...`);
    // Export logic would be implemented here
  };

  const handleExportData = () => {
    console.log('Exporting analytics data to CSV...');
    // CSV export logic would be implemented here
  };

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
    console.log('Date range changed:', newRange);
    // Refresh data with new date range
  };

  useEffect(() => {
    // Initial data load
    handleRefreshData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header currentUser={currentUser} notificationCount={5} />
      <main className="container mx-auto px-4 py-6">
        <Breadcrumb />
        
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive insights into civic issue patterns and resolution performance
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mt-4 lg:mt-0">
            <DateRangeSelector onDateRangeChange={handleDateRangeChange} />
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshData}
                loading={loading}
                iconName="RefreshCw"
                iconPosition="left"
                iconSize={16}
              >
                Refresh
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportData}
                iconName="Download"
                iconPosition="left"
                iconSize={16}
              >
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricsData?.map((metric, index) => (
            <MetricsCard
              key={index}
              title={metric?.title}
              value={metric?.value}
              change={metric?.change}
              changeType={metric?.changeType}
              icon={metric?.icon}
              description={metric?.description}
              loading={loading}
            />
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Issues by Category */}
          <ChartContainer
            title="Issues by Category"
            onExport={() => handleExportChart('category')}
            onRefresh={handleRefreshData}
            loading={loading}
            lastUpdated={refreshTimestamp}
            controls={null}
          >
            <IssuesByCategoryChart loading={loading} data={mockChartData.categories} />
          </ChartContainer>

          {/* Resolution Timeline */}
          <ChartContainer
            title="Resolution Timeline"
            onExport={() => handleExportChart('timeline')}
            onRefresh={handleRefreshData}
            loading={loading}
            lastUpdated={refreshTimestamp}
            controls={
              <div className="flex items-center space-x-2">
                <Button
                  variant={chartType === 'line' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setChartType('line')}
                >
                  Line
                </Button>
                <Button
                  variant={chartType === 'area' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setChartType('area')}
                >
                  Area
                </Button>
              </div>
            }
          >
            <ResolutionTimelineChart chartType={chartType} loading={loading} data={mockChartData.timeline} />
          </ChartContainer>
        </div>

        {/* Department Performance & Geographic Heat Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartContainer
            title="Department Performance"
            onExport={() => handleExportChart('department')}
            onRefresh={handleRefreshData}
            loading={loading}
            lastUpdated={refreshTimestamp}
            controls={null}
          >
            <DepartmentPerformanceChart loading={loading} data={mockChartData.departments} />
          </ChartContainer>

          <ChartContainer
            title="Geographic Heat Map"
            onExport={() => handleExportChart('geographic')}
            onRefresh={handleRefreshData}
            loading={loading}
            lastUpdated={refreshTimestamp}
            controls={null}
          >
            <GeographicHeatMap loading={loading} data={mockChartData.geographic} />
          </ChartContainer>
        </div>

        {/* Detailed Data Table */}
        <div className="mb-8">
          <DataTable loading={loading} onExport={handleExportData} data={mockTableData} />
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-card">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/admin-dashboard">
              <Button
                variant="outline"
                className="w-full justify-start"
                iconName="BarChart3"
                iconPosition="left"
                iconSize={16}
              >
                Admin Dashboard
              </Button>
            </Link>
            
            <Link to="/public-reports-listing">
              <Button
                variant="outline"
                className="w-full justify-start"
                iconName="List"
                iconPosition="left"
                iconSize={16}
              >
                View All Issues
              </Button>
            </Link>
            
            <Link to="/interactive-issue-map">
              <Button
                variant="outline"
                className="w-full justify-start"
                iconName="Map"
                iconPosition="left"
                iconSize={16}
              >
                Issue Map
              </Button>
            </Link>
            
            <Button
              variant="outline"
              className="w-full justify-start"
              iconName="FileText"
              iconPosition="left"
              iconSize={16}
              onClick={() => console.log('Generate detailed report')}
            >
              Generate Report
            </Button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Data updated every 15 minutes • Last refresh: {refreshTimestamp}
          </p>
          <p className="mt-1">
            © {new Date()?.getFullYear()} Civicare Analytics Dashboard. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;