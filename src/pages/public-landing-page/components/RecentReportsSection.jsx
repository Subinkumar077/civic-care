import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { civicIssueService } from '../../../services/civicIssueService';
import { useTheme } from '../../../contexts/ThemeContext';

const RecentReportsSection = () => {
  const navigate = useNavigate();
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { animations, hoverEffects } = useTheme();

  useEffect(() => {
    const loadRecentReports = async () => {
      try {
        setLoading(true);
        console.log('🏠 Landing Page: Loading real recent reports...');
        
        // Get real data from Supabase
        const { data: reports, error } = await civicIssueService.getIssues({ limit: 6 });
        
        if (error) {
          console.error('Error loading recent reports:', error);
          setRecentReports([]);
        } else {
          console.log('🏠 Landing Page: Loaded', reports?.length || 0, 'real reports');
          console.log('🔗 Real issue IDs:', reports?.map(r => `#${r.id}: ${r.title?.substring(0, 30)}...`) || []);
          setRecentReports(reports || []);
        }
      } catch (error) {
        console.error('Error loading recent reports:', error);
        setRecentReports([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecentReports();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'in_review': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    const categoryIcons = {
      'roads': 'Car',
      'sanitation': 'Trash2',
      'utilities': 'Zap',
      'infrastructure': 'Building',
      'safety': 'Shield',
      'environment': 'Leaf',
      'water': 'Droplets',
      'electricity': 'Zap',
      'transport': 'Bus'
    };
    return categoryIcons[category] || 'AlertCircle';
  };

  const getCategoryColor = (category) => {
    const categoryColors = {
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
    return categoryColors[category] || '#6b7280';
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  const handleReportClick = (report) => {
    navigate(`/issue/${report?.id}`);
  };

  // Loading skeleton
  if (loading) {
    return (
      <section id="reports" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">Recent Reports</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stay informed about the latest community issues and their resolution progress.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(6)]?.map((_, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6">
                <div className="animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="reports" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-4">Recent Reports</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay informed about the latest community issues and their resolution progress.
          </p>
          {recentReports.length > 0 && (
            <div className="mt-4 inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
              <Icon name="Link" size={14} className="mr-1" />
              Synchronized with Issue Map & Analytics
            </div>
          )}
        </div>
        
        {recentReports?.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">No Reports Yet</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to report a community issue and help improve our neighborhood.
            </p>
            <Button onClick={() => navigate('/issue-reporting-form')}>
              Report an Issue
            </Button>
          </div>
        ) : (
          <>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              initial={animations.stagger.initial}
              animate={animations.stagger.animate}
              transition={animations.stagger.transition}
            >
              {recentReports?.map((report, index) => (
                <motion.div
                  key={report?.id}
                  onClick={() => handleReportClick(report)}
                  className="bg-white border border-slate-200 rounded-xl p-6 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-200"
                  initial={animations.fadeInUp.initial}
                  animate={animations.fadeInUp.animate}
                  transition={{ ...animations.fadeInUp.transition, delay: index * 0.1 }}
                  {...hoverEffects.lift}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${getCategoryColor(report?.category)}20` }}
                      >
                        <Icon 
                          name={getCategoryIcon(report?.category)} 
                          size={16} 
                          style={{ color: getCategoryColor(report?.category) }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-600 capitalize">
                        {report?.category?.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report?.status)}`}>
                      {report?.status?.replace('_', ' ')?.toUpperCase()}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-800 line-clamp-2 leading-tight flex-1">
                        {report?.title}
                      </h3>
                      <span className="text-xs text-slate-400 ml-2 flex-shrink-0">
                        #{report?.id}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {report?.description}
                    </p>
                    
                    {/* Display images if available */}
                    {report?.issue_images && report.issue_images.length > 0 && (
                      <div className="mt-3 flex space-x-2">
                        {report.issue_images.slice(0, 2).map((image, imgIndex) => (
                          <div key={imgIndex} className="relative">
                            <img
                              src={image.image_url || `https://picsum.photos/100/80?random=${report.id}-${imgIndex}`}
                              alt={image.caption || 'Issue image'}
                              className="w-16 h-12 object-cover rounded-lg border border-slate-200"
                              onError={(e) => {
                                e.target.src = `https://picsum.photos/100/80?random=${report.id}-${imgIndex}`;
                              }}
                            />
                            {report.issue_images.length > 2 && imgIndex === 1 && (
                              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                <span className="text-white text-xs font-medium">
                                  +{report.issue_images.length - 2}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-1 text-slate-500">
                      <Icon name="MapPin" size={12} />
                      <span className="truncate max-w-[120px]">
                        {report?.address?.split(',')?.[0] || 'Unknown location'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {(report?.upvoteCount || 0) > 0 && (
                        <div className="flex items-center space-x-1 text-slate-500">
                          <Icon name="ThumbsUp" size={12} />
                          <span>{report?.upvoteCount}</span>
                        </div>
                      )}
                      <span className="text-slate-500">
                        {formatTimeAgo(report?.created_at)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* View All Button */}
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/public-reports-listing')}
                iconName="ArrowRight"
                iconPosition="right"
              >
                View All Reports
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default RecentReportsSection;