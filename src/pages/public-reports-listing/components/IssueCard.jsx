import React from 'react';

import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const IssueCard = ({ issue, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'in-progress':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'resolved':
        return 'bg-success/10 text-success border-success/20';
      case 'rejected':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'roads':
        return 'Car';
      case 'sanitation':
        return 'Trash2';
      case 'water':
        return 'Droplets';
      case 'electricity':
        return 'Zap';
      case 'parks':
        return 'Trees';
      case 'safety':
        return 'Shield';
      default:
        return 'AlertCircle';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-destructive';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date?.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const truncateText = (text, maxLength = 120) => {
    if (text?.length <= maxLength) return text;
    return text?.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-card hover:shadow-modal transition-smooth group">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={issue?.image}
          alt={issue?.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-layout"
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(issue?.status)}`}>
            {issue?.status}
          </span>
        </div>

        {/* Priority Indicator */}
        {issue?.priority && (
          <div className="absolute top-3 right-3">
            <div className={`w-3 h-3 rounded-full ${getPriorityColor(issue?.priority)} bg-current`} />
          </div>
        )}

        {/* View Count */}
        <div className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
          <Icon name="Eye" size={12} />
          {issue?.viewCount || 0}
        </div>
      </div>
      {/* Content Section */}
      <div className="p-4">
        {/* Category and Date */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name={getCategoryIcon(issue?.category)} size={14} />
            <span className="capitalize">{issue?.category}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDate(issue?.createdAt)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-heading font-semibold text-lg text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-smooth">
          {issue?.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
          {truncateText(issue?.description)}
        </p>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Icon name="MapPin" size={14} />
          <span className="truncate">{issue?.location}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Reporter Info */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
              <Icon name="User" size={12} color="white" />
            </div>
            <span className="text-xs text-muted-foreground">
              {issue?.reporterName || 'Anonymous'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {issue?.upvotes > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Icon name="ThumbsUp" size={12} />
                <span>{issue?.upvotes}</span>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails?.(issue)}
              iconName="ExternalLink"
              iconPosition="right"
              iconSize={14}
              className="text-xs"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;