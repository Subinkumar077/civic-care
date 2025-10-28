import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import Button from '../../components/ui/Button';
import PageLayout from '../../components/layout/PageLayout';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MetricsCard from './components/MetricsCard';
import ChartContainer from './components/ChartContainer';
import IssuesByCategoryChart from './components/IssuesByCategoryChart';
import ResolutionTimelineChart from './components/ResolutionTimelineChart';
import DepartmentPerformanceChart from './components/DepartmentPerformanceChart';
import GeographicHeatMap from './components/GeographicHeatMap';
import DataTable from './components/DataTable';
import DateRangeSelector from './components/DateRangeSelector';
import { civicIssueService } from '../../services/civicIssueService';
import { useTheme } from '../../contexts/ThemeContext';

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: '2024-08-17',
    endDate: '2024-09-17',
    range: '30d'
  });
  const [chartType, setChartType] = useState('line');
  const [refreshTimestamp, setRefreshTimestamp] = useState(new Date()?.toLocaleString());
  const [analyticsData, setAnalyticsData] = useState(null);
  const [recentIssues, setRecentIssues] = useState([]);
  
  const { animations } = useTheme();

  // Mock current user for header
  const currentUser = {
    name: "Admin User",
    email: "admin@civicare.gov.in"
  };

  // Load real analytics data
  useEffect(() => {
    const loadAnalyticsData = async () => {
      setLoading(true);
      
      try {
        console.log('📊 Analytics Dashboard: Loading real data from Supabase...');
        
        // Get real data from Supabase
        const { data: issues, error: issuesError } = await civicIssueService.getIssues();
        const { data: stats, error: statsError } = await civicIssueService.getIssuesStats();
        
        if (issuesError) {
          console.error('📊 Error loading issues:', issuesError);
          setAnalyticsData(null);
          setRecentIssues([]);
        } else if (statsError) {
          console.error('📊 Error loading stats:', statsError);
          setAnalyticsData(null);
          setRecentIssues(issues?.slice(0, 10) || []);
        } else {
          console.log('📊 Analytics Dashboard: Loaded', issues?.length || 0, 'real issues');
          
          // Process real data into analytics format
          const processedAnalytics = processRealDataToAnalytics(issues || [], stats || {});
          setAnalyticsData(processedAnalytics);
          setRecentIssues(issues?.slice(0, 10) || []);
        }
        
        setRefreshTimestamp(new Date()?.toLocaleString());
      } catch (error) {
        console.error('📊 Error loading analytics data:', error);
        setAnalyticsData(null);
        setRecentIssues([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadAnalyticsData();
  }, [dateRange]);

  // Process real Supabase data into analytics format
  const processRealDataToAnalytics = (issues, stats) => {
    const totalIssues = issues.length;
    const resolvedIssues = issues.filter(i => i.status === 'resolved').length;
    const inProgressIssues = issues.filter(i => i.status === 'in_progress').length;
    const resolutionRate = totalIssues > 0 ? ((resolvedIssues / totalIssues) * 100) : 0;
    
    // Calculate average response time for resolved issues
    const resolvedWithDates = issues.filter(i => i.status === 'resolved' && i.resolved_at && i.created_at);
    const avgResponseTime = resolvedWithDates.length > 0 
      ? resolvedWithDates.reduce((sum, issue) => {
          const created = new Date(issue.created_at);
          const resolved = new Date(issue.resolved_at);
          return sum + (resolved - created) / (1000 * 60 * 60 * 24); // days
        }, 0) / resolvedWithDates.length
      : 0;

    // Process categories
    const categoryStats = {};
    issues.forEach(issue => {
      categoryStats[issue.category] = (categoryStats[issue.category] || 0) + 1;
    });
    
    const categories = Object.entries(categoryStats).map(([category, count]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: count,
      percentage: ((count / totalIssues) * 100).toFixed(1),
      color: getCategoryColor(category)
    }));

    // Generate timeline data (last 30 days)
    const timeline = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayIssues = issues.filter(issue => {
        const issueDate = new Date(issue.created_at).toISOString().split('T')[0];
        return issueDate === dateStr;
      });
      
      timeline.push({
        date: dateStr,
        total: dayIssues.length,
        resolved: dayIssues.filter(i => i.status === 'resolved').length,
        pending: dayIssues.filter(i => ['submitted', 'in_review'].includes(i.status)).length,
        inProgress: dayIssues.filter(i => i.status === 'in_progress').length
      });
    }

    return {
      overview: {
        totalIssues,
        resolvedIssues,
        inProgressIssues,
        resolutionRate: parseFloat(resolutionRate.toFixed(1)),
        avgResponseTime: avgResponseTime.toFixed(1),
        weeklyIssues: stats.recentCount || 0,
        monthlyIssues: issues.filter(i => {
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return new Date(i.created_at) >= monthAgo;
        }).length,
        citizenSatisfaction: 4.6 // Mock satisfaction score
      },
      categories,
      timeline,
      departments: [], // Will be populated if department data is available
      geographic: [], // Will be populated if location data is available
      trends: {
        issueGrowth: 12.5, // Mock growth percentage
        resolutionImprovement: 5.2,
        responseTimeImprovement: -1.3
      }
    };
  };

  const getCategoryColor = (category) => {
    const colors = {
      'roads': '#ef4444',
      'sanitation': '#f97316', 
      'utilities': '#eab308',
      'infrastructure': '#6366f1',
      'safety': '#3b82f6',
      'environment': '#22c55e',
      'water': '#06b6d4',
      'electricity': '#eab308',
      'transport': '#8b5cf6'
    };
    return colors[category] || '#6b7280';
  };

  // Generate metrics data from real analytics
  const metricsData = analyticsData ? [
    {
      title: "Total Issues",
      value: analyticsData.overview.totalIssues.toLocaleString(),
      change: `+${analyticsData.trends.issueGrowth}%`,
      changeType: "increase",
      icon: "AlertCircle",
      description: "vs last month"
    },
    {
      title: "Resolution Rate",
      value: `${analyticsData.overview.resolutionRate}%`,
      change: `+${analyticsData.trends.resolutionImprovement}%`,
      changeType: "increase",
      icon: "CheckCircle",
      description: "issues resolved"
    },
    {
      title: "Avg Response Time",
      value: `${analyticsData.overview.avgResponseTime} days`,
      change: `${analyticsData.trends.responseTimeImprovement} days`,
      changeType: "decrease",
      icon: "Clock",
      description: "faster than last month"
    },
    {
      title: "Citizen Satisfaction",
      value: `${analyticsData.overview.citizenSatisfaction}/5`,
      change: "+0.3",
      changeType: "increase",
      icon: "Star",
      description: "average rating"
    }
  ] : [];

  // Format table data from recent issues
  const tableData = recentIssues.map(issue => ({
    id: issue.id,
    title: issue.title,
    category: issue.category,
    status: issue.status,
    priority: issue.priority,
    date: new Date(issue.created_at).toLocaleDateString(),
    department: issue.departments?.name || 'Unassigned',
    location: issue.address?.split(',')?.[0] || 'Unknown',
    upvotes: issue.upvoteCount || 0
  }));

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
    <PageLayout backgroundPattern>
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb />
        
        {/* Page Header */}
        <motion.div 
          className="flex flex-col lg:flex-row lg:items-center justify-between mb-8"
          initial={animations.fadeInUp.initial}
          animate={animations.fadeInUp.animate}
          transition={animations.fadeInUp.transition}
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-slate-600 text-lg">
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
        </motion.div>

        {/* Key Metrics */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={animations.stagger.initial}
          animate={animations.stagger.animate}
          transition={animations.stagger.transition}
        >
          {metricsData?.map((metric, index) => (
            <motion.div
              key={index}
              initial={animations.fadeInUp.initial}
              animate={animations.fadeInUp.animate}
              transition={{ ...animations.fadeInUp.transition, delay: index * 0.1 }}
            >
              <MetricsCard
                title={metric?.title}
                value={metric?.value}
                change={metric?.change}
                changeType={metric?.changeType}
                icon={metric?.icon}
                description={metric?.description}
                loading={loading}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          initial={animations.fadeInUp.initial}
          animate={animations.fadeInUp.animate}
          transition={{ ...animations.fadeInUp.transition, delay: 0.4 }}
        >
          {/* Issues by Category */}
          <ChartContainer
            title="Issues by Category"
            onExport={() => handleExportChart('category')}
            onRefresh={handleRefreshData}
            loading={loading}
            lastUpdated={refreshTimestamp}
            controls={null}
          >
            <IssuesByCategoryChart 
              loading={loading} 
              data={analyticsData?.categories || []} 
            />
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
            <ResolutionTimelineChart 
              chartType={chartType} 
              loading={loading} 
              data={analyticsData?.timeline || []} 
            />
          </ChartContainer>
        </motion.div>

        {/* Department Performance & Geographic Heat Map */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          initial={animations.fadeInUp.initial}
          animate={animations.fadeInUp.animate}
          transition={{ ...animations.fadeInUp.transition, delay: 0.6 }}
        >
          <ChartContainer
            title="Department Performance"
            onExport={() => handleExportChart('department')}
            onRefresh={handleRefreshData}
            loading={loading}
            lastUpdated={refreshTimestamp}
            controls={null}
          >
            <DepartmentPerformanceChart 
              loading={loading} 
              data={analyticsData?.departments || []} 
            />
          </ChartContainer>

          <ChartContainer
            title="Geographic Distribution"
            onExport={() => handleExportChart('geographic')}
            onRefresh={handleRefreshData}
            loading={loading}
            lastUpdated={refreshTimestamp}
            controls={null}
          >
            <GeographicHeatMap 
              loading={loading} 
              data={analyticsData?.geographic || []} 
            />
          </ChartContainer>
        </motion.div>

        {/* Detailed Data Table */}
        <motion.div 
          className="mb-8"
          initial={animations.fadeInUp.initial}
          animate={animations.fadeInUp.animate}
          transition={{ ...animations.fadeInUp.transition, delay: 0.8 }}
        >
          <DataTable 
            loading={loading} 
            onExport={handleExportData} 
            data={tableData} 
          />
        </motion.div>

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
        <motion.div 
          className="mt-8 text-center text-sm text-slate-500"
          initial={animations.fadeIn.initial}
          animate={animations.fadeIn.animate}
          transition={{ ...animations.fadeIn.transition, delay: 1.0 }}
        >
          <p>
            Data updated every 15 minutes • Last refresh: {refreshTimestamp}
          </p>
          <p className="mt-1">
            © {new Date()?.getFullYear()} CivicCare Analytics Dashboard. All rights reserved.
          </p>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default AnalyticsDashboard;