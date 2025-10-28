import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageLayout from '../../components/layout/PageLayout';
import FilterToolbar from './components/FilterToolbar';
import IssueGrid from './components/IssueGrid';
import MapView from './components/MapView';
import Pagination from './components/Pagination';
import { useAuth } from '../../contexts/AuthContext';
import { civicIssueService } from '../../services/civicIssueService';
import { useTheme } from '../../contexts/ThemeContext';
import Icon from '../../components/AppIcon';

const PublicReportsListing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { animations } = useTheme();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState(null);
  
  // Filters state
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    priority: '',
    search: '',
    sortBy: 'newest'
  });

  // Load issues and stats
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('📋 Reports Listing: Loading real data from Supabase...');
        
        // Get real data from Supabase
        const { data: allIssues, error: issuesError } = await civicIssueService.getIssues(filters);
        const { data: statsData, error: statsError } = await civicIssueService.getIssuesStats();
        
        if (issuesError) {
          console.error('📋 Error loading issues:', issuesError);
          setError('Failed to load reports: ' + issuesError);
          setIssues([]);
        } else {
          console.log('📋 Reports Listing: Loaded', allIssues?.length || 0, 'real issues');
          console.log('🔗 Real issue IDs:', allIssues?.slice(0, 6).map(i => i.id) || []);
          setIssues(allIssues || []);
        }
        
        if (statsError) {
          console.error('📊 Error loading stats:', statsError);
        } else {
          setStats(statsData);
        }
      } catch (err) {
        console.error('📋 Error loading data:', err);
        setError('Failed to load reports');
        setIssues([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [filters.category, filters.status, filters.priority]);

  // Vote on issue function
  const voteOnIssue = async (issueId, voteType) => {
    try {
      const result = await civicIssueService.voteOnIssue(issueId, voteType);
      
      if (result.error) {
        return { success: false, error: result.error };
      }
      
      // Refresh the specific issue to get updated vote count
      const { data: updatedIssue } = await civicIssueService.getIssueById(issueId);
      if (updatedIssue) {
        setIssues(prev => prev.map(issue => 
          issue.id === issueId ? updatedIssue : issue
        ));
      }
      
      return { success: true, data: result.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Calculate pagination
  const totalItems = issues?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedIssues = issues?.slice(startIndex, startIndex + itemsPerPage) || [];

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle search
  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setCurrentPage(1);
  };

  // Handle sort change
  const handleSortChange = (sortBy) => {
    setFilters(prev => ({ ...prev, sortBy }));
    setCurrentPage(1);
  };

  // Handle vote
  const handleVote = async (issueId, voteType) => {
    const { success, error } = await voteOnIssue(issueId, voteType);
    
    if (!success && error) {
      alert(error);
    }
  };

  // Handle issue click
  const handleIssueClick = (issue) => {
    navigate(`/issue/${issue?.id}`);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Apply client-side filtering and sorting for better UX
  const processedIssues = React.useMemo(() => {
    let filtered = [...(issues || [])];

    // Apply search filter
    if (filters?.search) {
      const searchLower = filters?.search?.toLowerCase();
      filtered = filtered?.filter(issue => 
        issue?.title?.toLowerCase()?.includes(searchLower) ||
        issue?.description?.toLowerCase()?.includes(searchLower) ||
        issue?.address?.toLowerCase()?.includes(searchLower)
      );
    }

    // Apply sorting
    switch (filters?.sortBy) {
      case 'newest':
        filtered?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        filtered?.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'priority':
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        filtered?.sort((a, b) => priorityOrder?.[b?.priority] - priorityOrder?.[a?.priority]);
        break;
      case 'most_voted':
        filtered?.sort((a, b) => (b?.upvoteCount || 0) - (a?.upvoteCount || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [issues, filters?.search, filters?.sortBy]);

  // Get paginated results from processed issues
  const finalPaginatedIssues = processedIssues?.slice(startIndex, startIndex + itemsPerPage) || [];
  const finalTotalPages = Math.ceil(processedIssues?.length / itemsPerPage);

  return (
    <PageLayout backgroundPattern>
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <motion.div 
          className="mb-6"
          initial={animations.fadeInUp.initial}
          animate={animations.fadeInUp.animate}
          transition={animations.fadeInUp.transition}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Public Reports
              </h1>
              <p className="text-slate-600 mt-1 text-lg">
                Browse and track community issues reported by residents
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* View Toggle */}
              <div className="flex bg-muted rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'grid' ?'bg-background text-text-primary shadow-sm' :'text-muted-foreground hover:text-text-primary'
                  }`}
                >
                  <Icon name="Grid" size={16} className="inline mr-2" />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'map' ?'bg-background text-text-primary shadow-sm' :'text-muted-foreground hover:text-text-primary'
                  }`}
                >
                  <Icon name="MapPin" size={16} className="inline mr-2" />
                  Map
                </button>
              </div>
            </div>
          </div>

          {/* Statistics */}
          {stats && (
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
              initial={animations.stagger.initial}
              animate={animations.stagger.animate}
              transition={animations.stagger.transition}
            >
              {[
                { label: 'Total Reports', value: stats.total, color: 'text-slate-800' },
                { label: 'Resolved', value: stats.byStatus?.resolved || 0, color: 'text-green-600' },
                { label: 'In Progress', value: stats.byStatus?.in_progress || 0, color: 'text-yellow-600' },
                { label: 'This Week', value: stats.recentCount, color: 'text-blue-600' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                  initial={animations.fadeInUp.initial}
                  animate={animations.fadeInUp.animate}
                  transition={{ ...animations.fadeInUp.transition, delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value.toLocaleString()}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Data Sync Status */}
        {!loading && issues.length > 0 && (
          <motion.div 
            className="mb-4 flex justify-center"
            initial={animations.fadeIn.initial}
            animate={animations.fadeIn.animate}
            transition={{ ...animations.fadeIn.transition, delay: 0.3 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              Data synchronized with Issue Map & Analytics • {issues.length} total issues
            </div>
          </motion.div>
        )}

        {/* Filter Toolbar */}
        <FilterToolbar
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onSearchChange={handleSearch}
          onSortChange={handleSortChange}
          onViewToggle={setViewMode}
          totalResults={processedIssues?.length || 0}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-muted-foreground">Loading reports...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-3">
              <Icon name="AlertCircle" size={20} className="text-red-500" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error Loading Reports</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {processedIssues?.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-2">No Reports Found</h3>
                <p className="text-muted-foreground mb-6">
                  {filters?.search || filters?.category || filters?.status || filters?.priority
                    ? 'Try adjusting your filters to see more results.' :'No reports have been submitted yet.'}
                </p>
                <button
                  onClick={() => navigate('/issue-reporting-form')}
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Icon name="Plus" size={16} className="mr-2" />
                  Report an Issue
                </button>
              </div>
            ) : (
              <>
                {/* Content View */}
                {viewMode === 'grid' ? (
                  <IssueGrid
                    issues={finalPaginatedIssues}
                    onIssueClick={handleIssueClick}
                    onVote={handleVote}
                    onViewDetails={handleIssueClick}
                    loading={loading}
                    currentUser={user}
                  />
                ) : (
                  <MapView
                    issues={processedIssues} // Show all issues on map, not paginated
                    onIssueClick={handleIssueClick}
                    onIssueSelect={handleIssueClick}
                    selectedIssue={null}
                    selectedFilters={filters}
                  />
                )}

                {/* Pagination */}
                {viewMode === 'grid' && finalTotalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={finalTotalPages}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    totalItems={processedIssues?.length}
                    onItemsPerPageChange={setItemsPerPage}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default PublicReportsListing;