import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const GeographicHeatMap = ({ data, loading = false }) => {
  const [selectedArea, setSelectedArea] = useState(null);

  const mockAreas = data || [
    { id: 1, name: 'Downtown', issues: 89, lat: 28.6139, lng: 77.2090, severity: 'high' },
    { id: 2, name: 'Commercial District', issues: 67, lat: 28.6304, lng: 77.2177, severity: 'medium' },
    { id: 3, name: 'Residential Area A', issues: 45, lat: 28.5355, lng: 77.3910, severity: 'medium' },
    { id: 4, name: 'Industrial Zone', issues: 34, lat: 28.7041, lng: 77.1025, severity: 'low' },
    { id: 5, name: 'Suburban Area', issues: 23, lat: 28.4595, lng: 77.0266, severity: 'low' },
    { id: 6, name: 'Old City', issues: 78, lat: 28.6507, lng: 77.2334, severity: 'high' }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-accent';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-success';
      default: return 'bg-muted';
    }
  };

  const getSeverityTextColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-accent';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading geographic data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-80 relative">
      {/* Map Container */}
      <div className="w-full h-full bg-muted rounded-lg overflow-hidden relative">
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Delhi Issues Heat Map"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=28.6139,77.2090&z=11&output=embed"
          className="border-0"
        />
        
        {/* Overlay with area markers */}
        <div className="absolute inset-0 pointer-events-none">
          {mockAreas?.map((area) => (
            <div
              key={area?.id}
              className={`absolute w-4 h-4 rounded-full ${getSeverityColor(area?.severity)} opacity-70 pointer-events-auto cursor-pointer hover:opacity-90 transition-smooth`}
              style={{
                left: `${20 + (area?.id * 15)}%`,
                top: `${30 + (area?.id * 8)}%`
              }}
              onClick={() => setSelectedArea(area)}
              title={`${area?.name}: ${area?.issues} issues`}
            />
          ))}
        </div>
      </div>
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-popover border border-border rounded-lg p-3 shadow-modal">
        <h4 className="text-sm font-medium text-popover-foreground mb-2">Issue Density</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span className="text-xs text-muted-foreground">High (50+)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-xs text-muted-foreground">Medium (20-49)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-xs text-muted-foreground">Low (&lt;20)</span>
          </div>
        </div>
      </div>
      {/* Area Details Panel */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-popover border border-border rounded-lg p-4 shadow-modal">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-popover-foreground">Area Statistics</h4>
            <Button
              variant="ghost"
              size="sm"
              iconName="RotateCcw"
              iconSize={14}
              onClick={() => setSelectedArea(null)}
            >
              Reset View
            </Button>
          </div>
          
          {selectedArea ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-popover-foreground">{selectedArea?.name}</span>
                <span className={`text-sm font-medium ${getSeverityTextColor(selectedArea?.severity)}`}>
                  {selectedArea?.issues} issues
                </span>
              </div>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span>Severity: {selectedArea?.severity}</span>
                <span>Coordinates: {selectedArea?.lat}, {selectedArea?.lng}</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {mockAreas?.slice(0, 3)?.map((area) => (
                <div key={area?.id} className="text-center">
                  <p className="text-sm font-medium text-popover-foreground">{area?.name}</p>
                  <p className={`text-xs ${getSeverityTextColor(area?.severity)}`}>
                    {area?.issues} issues
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeographicHeatMap;