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
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 }); // Default to Delhi
  const [mapZoom, setMapZoom] = useState(11);
  const [clusteredIssues, setClusteredIssues] = useState([]);
  const [hoveredIssue, setHoveredIssue] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

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

  // Get user's current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLoc = { lat: latitude, lng: longitude };
          setUserLocation(userLoc);
          setMapCenter(userLoc);
          setMapZoom(15); // Zoom in more when showing user location
          console.log('📍 User location detected:', userLoc);
        },
        (error) => {
          console.warn('❌ Could not get user location:', error.message);
          // Keep default Delhi location
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    }
  }, []);

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
    if (userLocation) {
      setMapCenter(userLocation);
      setMapZoom(15);
    } else {
      setMapCenter({ lat: 28.6139, lng: 77.2090 });
      setMapZoom(11);
    }
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
          // Improved positioning calculation for better accuracy
          const latDiff = issue?.coordinates?.lat - mapCenter?.lat;
          const lngDiff = issue?.coordinates?.lng - mapCenter?.lng;
          
          // Convert lat/lng differences to pixel positions
          // Using a more accurate conversion factor based on zoom level
          const scaleFactor = Math.pow(2, mapZoom) * 0.5;
          const x = 50 + (lngDiff * scaleFactor * 100);
          const y = 50 - (latDiff * scaleFactor * 100);
          
          // Check if marker is within viewport bounds
          if (x < -50 || x > window.innerWidth + 50 || y < -50 || y > window.innerHeight + 50) {
            return null; // Don't render markers outside viewport
          }

          return (
            <div
              key={issue?.id}
              className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 group"
              style={{ 
                left: `${Math.max(0, Math.min(100, (x / window.innerWidth) * 100))}%`,
                top: `${Math.max(0, Math.min(100, (y / window.innerHeight) * 100))}%`
              }}
              onClick={() => handleMarkerClick(issue)}
              onMouseEnter={(e) => {
                setHoveredIssue(issue);
                e.currentTarget.style.zIndex = '10';
              }}
              onMouseLeave={(e) => {
                setHoveredIssue(null);
                e.currentTarget.style.zIndex = '1';
              }}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:border-blue-300 transition-all duration-200 ${
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
              
              {/* GPS Coordinates Tooltip */}
              {hoveredIssue?.id === issue?.id && !issue?.isCluster && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-card border border-border rounded-lg px-3 py-2 shadow-lg z-50 whitespace-nowrap max-w-xs">
                  <div className="text-xs font-medium text-card-foreground mb-1">
                    📍 GPS Coordinates
                  </div>
                  <div className="text-xs text-muted-foreground font-mono mb-1">
                    {issue?.coordinates?.lat?.toFixed(6)}, {issue?.coordinates?.lng?.toFixed(6)}
                  </div>
                  <div className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {issue?.address}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-success font-medium">
                      ✓ Precise Location
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard?.writeText(`${issue?.coordinates?.lat?.toFixed(6)}, ${issue?.coordinates?.lng?.toFixed(6)}`);
                      }}
                      className="text-xs text-primary hover:underline cursor-pointer"
                    >
                      Copy
                    </button>
                  </div>
                  {/* Arrow pointing down */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-card" />
                </div>
              )}

              {/* Simple hover tooltip for clusters */}
              {hoveredIssue?.id === issue?.id && issue?.isCluster && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                  {issue?.count} complaints
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                </div>
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
          className="bg-card shadow-lg cursor-pointer hover:bg-card/90 transition-colors"
          title="Zoom In"
        >
          <Icon name="Plus" size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          className="bg-card shadow-lg cursor-pointer hover:bg-card/90 transition-colors"
          title="Zoom Out"
        >
          <Icon name="Minus" size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRecenter}
          className="bg-card shadow-lg cursor-pointer hover:bg-card/90 transition-colors"
          title="Recenter Map"
        >
          <Icon name="Home" size={16} />
        </Button>
      </div>
      {/* Map Status Indicator */}
      <div className="absolute top-4 right-4 bg-card border border-border rounded px-3 py-1 shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full" />
          <span className="text-xs text-card-foreground">
            {clusteredIssues?.length} issues visible
          </span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          📍 GPS coordinates enabled
        </div>
      </div>
    </div>
  );
};

export default MapContainer;