import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import { cn } from '../../utils/cn';
import { useAuth } from '../../contexts/AuthContext';
import CitizenMetricsCard from './components/CitizenMetricsCard';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { civicIssueService } from '../../services/civicIssueService';

const CitizenDashboard = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(location.pathname.includes('community') ? 'community' : 'personal');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    recent: 0
  });

  const tabs = [
    {
      id: 'personal',
      label: 'My Complaints',
      path: '/citizen-dashboard/my-complaints'
    },
    {
      id: 'community',
      label: 'Community Complaints',
      path: '/citizen-dashboard/community'
    }
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const myIssues = await civicIssueService.getCivicIssuesByUser(user.id);
        
        const stats = {
          total: myIssues.length,
          pending: myIssues.filter(issue => issue.status === 'submitted' || issue.status === 'in_review').length,
          inProgress: myIssues.filter(issue => issue.status === 'in_progress').length,
          resolved: myIssues.filter(issue => issue.status === 'resolved').length,
          recent: myIssues.filter(issue => {
            const issueDate = new Date(issue.created_at);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return issueDate > weekAgo;
          }).length
        };

        setStats(stats);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    if (user?.id) {
      fetchStats();
    }
  }, [user]);

  const dashboardMetrics = [
    {
      title: 'Total Complaints',
      value: stats.total,
      change: `+${stats.recent} this week`,
      changeType: 'info',
      icon: 'FileText'
    },
    {
      title: 'Pending Review',
      value: stats.pending,
      change: 'Awaiting response',
      changeType: 'warning',
      icon: 'Clock'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      change: 'Being addressed',
      changeType: 'info',
      icon: 'Settings'
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      change: `${stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}% resolution rate`,
      changeType: 'positive',
      icon: 'CheckCircle'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Citizen Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Track and manage your complaints and stay updated with community issues
              </p>
            </div>
            <Link
              to="/issue-reporting-form"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              <span className="mr-2">Report New Issue</span>
              <span className="text-xl">+</span>
            </Link>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardMetrics.map((metric, index) => (
            <CitizenMetricsCard
              key={index}
              title={metric.title}
              value={metric.value}
              change={metric.change}
              changeType={metric.changeType}
              icon={metric.icon}
            />
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-card border border-border rounded-lg mb-6">
          <div className="border-b border-border">
            <nav className="flex">
              {tabs.map(tab => (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={cn(
                    'py-4 px-6 text-sm font-medium border-b-2 transition-colors',
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                  )}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Dashboard Content */}
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;