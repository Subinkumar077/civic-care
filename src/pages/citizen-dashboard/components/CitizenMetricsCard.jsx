import React from 'react';
import Icon from '../../../components/AppIcon';

const CitizenMetricsCard = ({ title, value, change, changeType, icon, description }) => {
  const changeColors = {
    positive: 'text-success',
    negative: 'text-destructive',
    warning: 'text-warning',
    info: 'text-secondary'
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-text-primary mb-2">{value}</h3>
          {change && (
            <p className={`text-sm ${changeColors[changeType] || 'text-muted-foreground'}`}>
              {change}
            </p>
          )}
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {icon && (
          <div className={`p-2 rounded-full bg-${changeType || 'primary'}/10`}>
            <Icon name={icon} className={`h-5 w-5 ${changeColors[changeType] || 'text-primary'}`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenMetricsCard;