import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MapContainer = ({ 
  issues = [], 
  selectedIssue, 
  onIssueSelect, 
  onMapClick,
  searchLocation,
  searchRadius,
  activeLayers = [],
  isDrawingMode = false,
  className = ""
}) => {
  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 }); // New Delhi
  const [mapZoom, setMapZoom] = useState(11);
  const [clusteredIssues, setClusteredIssues] = useState([]);

  // Mock clustering logic - in real app, this would use a proper clustering library
  const clusterIssues = (issues, zoom) => {
    if (zoom > 14) return issues?.map(issue => ({ ...issue, isCluster: false }));
    
    const clusters = [];
    const processed = new Set();
    
    issues?.forEach((issue, index) => {
      if (processed?.has(index)) return;
      
      const nearby = issues?.filter((other, otherIndex) => {
        if (processed?.has(otherIndex) || index === otherIndex) return false;
        const distance = Math.sqrt(
          Math.pow(issue?.coordinates?.lat - other?.coordinates?.lat, 2) +
          Math.pow(issue?.coordinates?.lng - other?.coordinates?.lng, 2)
        );
        return distance < 0.01; // Cluster threshold
      });
      
      if (nearby?.length > 0) {
        clusters?.push({
          id: `cluster-${index}`,
          coordinates: issue?.coordinates,
          count: nearby?.length + 1,
          issues: [issue, ...nearby],
          isCluster: true,
          category: 'mixed',
          status: 'mixed'
        });
        processed?.add(index);
        nearby?.forEach((_, nearbyIndex) => {
          const originalIndex = issues?.findIndex(i => i?.id === nearby?.[nearbyIndex]?.id);
          processed?.add(originalIndex);
        });
      } else {
        clusters?.push({ ...issue, isCluster: false });
        processed?.add(index);
      }
    });
    
    return clusters;
  };

  useEffect(() => {
    setClusteredIssues(clusterIssues(issues, mapZoom));
  }, [issues, mapZoom]);

  useEffect(() => {
    if (searchLocation) {
      setMapCenter(searchLocation?.coordinates);
      setMapZoom(15);
    }
  }, [searchLocation]);

  const getMarkerColor = (issue) => {
    if (issue?.isCluster) return '#0D1B2A';
    
    const categoryColors = {
      'roads': '#E63946',
      'sanitation': '#F77F00',
      'utilities': '#FCBF49',
      'safety': '#277DA1',
      'environment': '#43AA8B',
      'transport': '#90E0EF'
    };
    
    return categoryColors?.[issue?.category] || '#6C757D';
  };

  const getMarkerIcon = (issue) => {
    if (issue?.isCluster) return 'Users';
    
    const categoryIcons = {
      'roads': 'Construction',
      'sanitation': 'Trash2',
      'utilities': 'Zap',
      'safety': 'Shield',
      'environment': 'Leaf',
      'transport': 'Bus'
    };
    
    return categoryIcons?.[issue?.category] || 'AlertCircle';
  };

  const handleMarkerClick = (issue) => {
    if (issue?.isCluster) {
      // Zoom in to expand cluster
      setMapCenter(issue?.coordinates);
      setMapZoom(Math.min(mapZoom + 3, 18));
    } else {
      onIssueSelect(issue);
    }
  };

  const handleZoomIn = () => {
    setMapZoom(Math.min(mapZoom + 1, 18));
  };

  const handleZoomOut = () => {
    setMapZoom(Math.max(mapZoom - 1, 3));
  };

  const handleRecenter = () => {
    setMapCenter({ lat: 28.6139, lng: 77.2090 });
    setMapZoom(11);
  };

  return (
    <div className={`relative w-full h-full bg-muted ${className}`} ref={mapRef}>
      {/* Google Maps Iframe */}
      <iframe
        width="100%"
        height="100%"
        loading="lazy"
        title="Interactive Issue Map"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps?q=${mapCenter?.lat},${mapCenter?.lng}&z=${mapZoom}&output=embed`}
        className="w-full h-full border-0"
      />
      {/* Map Overlay for Issues */}
      <div className="absolute inset-0 pointer-events-none">
        {clusteredIssues?.map((issue) => {
          // Calculate position based on map center and coordinates
          // This is a simplified positioning - real implementation would use proper map projection
          const x = 50 + (issue?.coordinates?.lng - mapCenter?.lng) * 1000 * mapZoom;
          const y = 50 + (mapCenter?.lat - issue?.coordinates?.lat) * 1000 * mapZoom;
          
          if (x < -50 || x > window.innerWidth + 50 || y < -50 || y > window.innerHeight + 50) {
            return null; // Don't render markers outside viewport
          }

          return (
            <div
              key={issue?.id}
              className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110"
              style={{ 
                left: `${Math.max(0, Math.min(100, (x / window.innerWidth) * 100))}%`,
                top: `${Math.max(0, Math.min(100, (y / window.innerHeight) * 100))}%`
              }}
              onClick={() => handleMarkerClick(issue)}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white ${
                  selectedIssue?.id === issue?.id ? 'ring-2 ring-primary' : ''
                }`}
                style={{ backgroundColor: getMarkerColor(issue) }}
              >
                {issue?.isCluster ? (
                  <span className="text-white text-xs font-bold">{issue?.count}</span>
                ) : (
                  <Icon name={getMarkerIcon(issue)} size={14} color="white" />
                )}
              </div>
              {/* Priority indicator */}
              {!issue?.isCluster && issue?.priority === 'high' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border border-white" />
              )}
            </div>
          );
        })}
      </div>
      {/* Search Radius Overlay */}
      {searchLocation && searchRadius && (
        <div
          className="absolute border-2 border-success border-dashed rounded-full pointer-events-none"
          style={{
            left: '50%',
            top: '50%',
            width: `${searchRadius * 20}px`,
            height: `${searchRadius * 20}px`,
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(67, 170, 139, 0.1)'
          }}
        />
      )}
      {/* Drawing Mode Overlay */}
      {isDrawingMode && (
        <div className="absolute inset-0 bg-primary/10 pointer-events-none flex items-center justify-center">
          <div className="bg-card border border-border rounded-lg p-4 shadow-modal">
            <div className="flex items-center space-x-2 text-card-foreground">
              <Icon name="Edit3" size={16} />
              <span className="text-sm font-medium">Drawing Mode Active</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Click and drag to draw search area
            </p>
          </div>
        </div>
      )}
      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          className="bg-card shadow-lg"
          title="Zoom In"
        >
          <Icon name="Plus" size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          className="bg-card shadow-lg"
          title="Zoom Out"
        >
          <Icon name="Minus" size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRecenter}
          className="bg-card shadow-lg"
          title="Recenter Map"
        >
          <Icon name="Home" size={16} />
        </Button>
      </div>
      {/* Map Loading Indicator */}
      <div className="absolute top-4 right-4 bg-card border border-border rounded px-3 py-1 shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full" />
          <span className="text-xs text-card-foreground">
            {clusteredIssues?.length} issues visible
          </span>
        </div>
      </div>
    </div>
  );
};

export default MapContainer;