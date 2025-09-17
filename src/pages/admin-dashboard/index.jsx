import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import MetricsCard from './components/MetricsCard';
import IssuesTable from './components/IssuesTable';
import FilterToolbar from './components/FilterToolbar';
import ActivityFeed from './components/ActivityFeed';
import QuickActions from './components/QuickActions';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import { useCivicIssues } from '../../hooks/useCivicIssues';
import { departmentService } from '../../services/departmentService';

const AdminDashboard = () => {
  const { user, userProfile } = useAuth();
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    department: '',
    assignedTo: ''
  });
  
  const { 
    issues, 
    loading, 
    error, 
    stats, 
    updateIssueStatus, 
    addIssueUpdate 
  } = useCivicIssues(filters);

  const [departments, setDepartments] = useState([]);
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Load departments
  useEffect(() => {
    const loadDepartments = async () => {
      const { data } = await departmentService?.getDepartments();
      setDepartments(data || []);
    };
    
    loadDepartments();
  }, []);

  // Check if user has admin access
  const isAdmin = userProfile?.role === 'admin' || user?.user_metadata?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
              <Icon name="Shield" size={48} className="mx-auto text-yellow-500 mb-4" />
              <h2 className="text-xl font-bold text-yellow-700 mb-2">Access Restricted</h2>
              <p className="text-sm text-yellow-600">
                You don't have permission to access the admin dashboard. Please contact an administrator if you need access.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Handle issue status update
  const handleStatusUpdate = async (issueId, newStatus, comment) => {
    const { success, error } = await updateIssueStatus(issueId, newStatus, comment);
    
    if (!success) {
      alert(`Failed to update status: ${error}`);
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action, selectedIds) => {
    if (selectedIds?.length === 0) {
      alert('Please select issues first');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${selectedIds?.length} issue(s)?`
    );

    if (!confirmed) return;

    try {
      for (const issueId of selectedIds) {
        switch (action) {
          case 'mark_in_review': await updateIssueStatus(issueId,'in_review', 'Bulk updated to in review');
            break;
          case 'mark_in_progress': await updateIssueStatus(issueId,'in_progress', 'Bulk updated to in progress');
            break;
          case 'mark_resolved': await updateIssueStatus(issueId,'resolved', 'Bulk resolved');
            break;
          default:
            break;
        }
      }
      
      setSelectedIssues([]);
      setShowBulkActions(false);
      alert(`Successfully ${action?.replace('_', ' ')} ${selectedIds?.length} issue(s)`);
    } catch (error) {
      alert(`Error performing bulk action: ${error?.message}`);
    }
  };

  // Handle issue selection
  const handleIssueSelection = (issueId, selected) => {
    if (selected) {
      setSelectedIssues(prev => [...prev, issueId]);
    } else {
      setSelectedIssues(prev => prev?.filter(id => id !== issueId));
    }
  };

  // Handle select all
  const handleSelectAll = (selectAll) => {
    if (selectAll) {
      setSelectedIssues(issues?.map(issue => issue?.id) || []);
    } else {
      setSelectedIssues([]);
    }
  };

  // Show bulk actions when issues are selected
  useEffect(() => {
    setShowBulkActions(selectedIssues?.length > 0);
  }, [selectedIssues]);

  // Calculate dashboard metrics from stats
  const dashboardMetrics = stats ? [
    {
      title: 'Total Issues',
      value: stats?.total || 0,
      change: `+${stats?.recentCount || 0} this week`,
      changeType: 'positive',
      icon: 'FileText'
    },
    {
      title: 'Pending Review',
      value: (stats?.byStatus?.submitted || 0) + (stats?.byStatus?.in_review || 0),
      change: 'Needs attention',
      changeType: 'warning',
      icon: 'Clock'
    },
    {
      title: 'In Progress',
      value: stats?.byStatus?.in_progress || 0,
      change: 'Being worked on',
      changeType: 'info',
      icon: 'Settings'
    },
    {
      title: 'Resolved',
      value: stats?.byStatus?.resolved || 0,
      change: `${stats?.total > 0 ? Math.round(((stats?.byStatus?.resolved || 0) / stats?.total) * 100) : 0}% resolution rate`,
      changeType: 'positive',
      icon: 'CheckCircle'
    }
  ] : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Manage and track community issues across all departments
              </p>
            </div>
            
            <QuickActions 
              onAction={handleStatusUpdate}
              departments={departments}
              selectedIssues={selectedIssues}
              onBulkAssign={handleBulkAction}
              onBulkStatusUpdate={handleBulkAction}
              onExportData={() => {}}
            />
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardMetrics?.map((metric, index) => (
            <MetricsCard
              key={index}
              title={metric?.title}
              value={metric?.value}
              change={metric?.change}
              changeType={metric?.changeType}
              icon={metric?.icon}
              description=""
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Issues Table */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-border rounded-lg">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-text-primary">All Issues</h2>
                  
                  {/* Bulk Actions */}
                  {showBulkActions && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {selectedIssues?.length} selected
                      </span>
                      <select
                        onChange={(e) => {
                          if (e?.target?.value) {
                            handleBulkAction(e?.target?.value, selectedIssues);
                            e.target.value = '';
                          }
                        }}
                        className="px-3 py-1 border border-border rounded text-sm"
                      >
                        <option value="">Bulk Actions</option>
                        <option value="mark_in_review">Mark In Review</option>
                        <option value="mark_in_progress">Mark In Progress</option>
                        <option value="mark_resolved">Mark Resolved</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Filter Toolbar */}
              <FilterToolbar
                filters={filters}
                onFilterChange={handleFilterChange}
                departments={departments}
                totalResults={issues?.length || 0}
                resultCount={issues?.length || 0}
              />

              {/* Issues Table */}
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading issues...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <Icon name="AlertCircle" size={48} className="mx-auto text-red-500 mb-4" />
                  <p className="text-red-600">{error}</p>
                </div>
              ) : (
                <IssuesTable
                  issues={issues || []}
                  onStatusUpdate={handleStatusUpdate}
                  onIssueSelection={handleIssueSelection}
                  onSelectAll={handleSelectAll}
                  selectedIssues={selectedIssues}
                  departments={departments}
                  onBulkAssign={handleBulkAction}
                  onExport={() => {}}
                />
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-1">
            <ActivityFeed 
              issues={issues?.slice(0, 10) || []} // Show recent 10 issues
              loading={loading}
              activities={[]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;