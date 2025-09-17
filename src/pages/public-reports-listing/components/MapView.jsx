import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MapView = ({ issues, onIssueSelect, selectedIssue }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 }); // Delhi coordinates
  const [zoom, setZoom] = useState(12);

  // Mock clustered issues for demonstration
  const clusterIssues = (issues) => {
    const clusters = [];
    const processed = new Set();

    issues?.forEach((issue, index) => {
      if (processed?.has(index)) return;

      const cluster = {
        id: `cluster-${index}`,
        lat: issue?.coordinates?.lat || mapCenter?.lat + (Math.random() - 0.5) * 0.1,
        lng: issue?.coordinates?.lng || mapCenter?.lng + (Math.random() - 0.5) * 0.1,
        issues: [issue],
        count: 1
      };

      // Find nearby issues to cluster
      issues?.forEach((otherIssue, otherIndex) => {
        if (processed?.has(otherIndex) || index === otherIndex) return;

        const distance = Math.sqrt(
          Math.pow(cluster?.lat - (otherIssue?.coordinates?.lat || mapCenter?.lat), 2) +
          Math.pow(cluster?.lng - (otherIssue?.coordinates?.lng || mapCenter?.lng), 2)
        );

        if (distance < 0.01) { // Cluster nearby issues
          cluster?.issues?.push(otherIssue);
          cluster.count++;
          processed?.add(otherIndex);
        }
      });

      processed?.add(index);
      clusters?.push(cluster);
    });

    return clusters;
  };

  const clusters = clusterIssues(issues);

  const getClusterColor = (count) => {
    if (count === 1) return 'bg-primary';
    if (count <= 5) return 'bg-warning';
    return 'bg-destructive';
  };

  const handleClusterClick = (cluster) => {
    if (cluster?.count === 1) {
      onIssueSelect?.(cluster?.issues?.[0]);
    } else {
      // Zoom in to show individual issues
      setMapCenter({ lat: cluster?.lat, lng: cluster?.lng });
      setZoom(Math.min(zoom + 2, 18));
    }
  };

  const resetView = () => {
    setMapCenter({ lat: 28.6139, lng: 77.2090 });
    setZoom(12);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-card">
      {/* Map Header */}
      <div className="p-4 border-b border-border bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Map" size={20} className="text-primary" />
            <h3 className="font-heading font-semibold text-lg">Issue Map View</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetView}
              iconName="RotateCcw"
              iconSize={14}
            >
              Reset View
            </Button>
            <div className="text-sm text-muted-foreground">
              {issues?.length} issues
            </div>
          </div>
        </div>
      </div>
      {/* Map Container */}
      <div className="relative h-96 bg-muted">
        {/* Google Maps Iframe */}
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Issues Map"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${mapCenter?.lat},${mapCenter?.lng}&z=${zoom}&output=embed`}
          className="absolute inset-0"
        />

        {/* Overlay with Issue Markers */}
        <div className="absolute inset-0 pointer-events-none">
          {clusters?.map((cluster) => (
            <div
              key={cluster?.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
              style={{
                left: `${50 + (cluster?.lng - mapCenter?.lng) * 1000}%`,
                top: `${50 - (cluster?.lat - mapCenter?.lat) * 1000}%`
              }}
              onClick={() => handleClusterClick(cluster)}
            >
              <div className={`w-8 h-8 rounded-full ${getClusterColor(cluster?.count)} text-white flex items-center justify-center text-sm font-bold shadow-lg hover:scale-110 transition-transform`}>
                {cluster?.count}
              </div>
            </div>
          ))}
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom(Math.min(zoom + 1, 18))}
            className="bg-background/90 backdrop-blur-sm"
          >
            <Icon name="Plus" size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom(Math.max(zoom - 1, 1))}
            className="bg-background/90 backdrop-blur-sm"
          >
            <Icon name="Minus" size={16} />
          </Button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3">
          <h4 className="font-medium text-sm mb-2">Legend</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary rounded-full" />
              <span>Single Issue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-warning rounded-full" />
              <span>2-5 Issues</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-destructive rounded-full" />
              <span>5+ Issues</span>
            </div>
          </div>
        </div>
      </div>
      {/* Selected Issue Details */}
      {selectedIssue && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden shrink-0">
              <img
                src={selectedIssue?.image}
                alt={selectedIssue?.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/assets/images/no_image.png';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-card-foreground truncate">
                {selectedIssue?.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {selectedIssue?.description}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Icon name="MapPin" size={12} />
                  <span className="truncate">{selectedIssue?.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="Calendar" size={12} />
                  <span>{new Date(selectedIssue.createdAt)?.toLocaleDateString('en-IN')}</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onIssueSelect?.(null)}
              className="shrink-0"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;