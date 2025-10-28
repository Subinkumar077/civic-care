import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageLayout from '../../components/layout/PageLayout';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import MapContainer from './components/MapContainer';
import MapControls from './components/MapControls';
import MapSearchBar from './components/MapSearchBar';
import MapLegend from './components/MapLegend';
import IssueDetailsPanel from './components/IssueDetailsPanel';
import { civicIssueService } from '../../services/civicIssueService';
import { useTheme } from '../../contexts/ThemeContext';

const InteractiveIssueMap = () => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [allIssues, setAllIssues] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [activeLayers, setActiveLayers] = useState([]);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [searchLocation, setSearchLocation] = useState(null);
  const [searchRadius, setSearchRadius] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { animations } = useTheme();

  // Mock current user for header
  const currentUser = {
    id: 1,
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    role: "resident"
  };

  // Load real issues data
  useEffect(() => {
    const loadIssues = async () => {
      setIsLoading(true);
      
      try {
        console.log('🗺️ Issue Map: Loading real issues from Supabase...');
        
        // Get real data from Supabase
        const { data: issues, error } = await civicIssueService.getIssues();
        
        if (error) {
          console.error('🗺️ Error loading issues:', error);
          setAllIssues([]);
          setFilteredIssues([]);
        } else {
          console.log('🗺️ Issue Map: Loaded', issues?.length || 0, 'real issues');
          console.log('🔗 Real issue IDs:', issues?.slice(0, 6).map(i => i.id) || []);
          console.log('📍 Real coordinates:', issues?.slice(0, 3).map(i => 
            `#${i.id}: ${i.latitude || 'no lat'}, ${i.longitude || 'no lng'}`
          ) || []);
          
          setAllIssues(issues || []);
          setFilteredIssues(issues || []);
        }
      } catch (error) {
        console.error('🗺️ Error loading issues:', error);
        setAllIssues([]);
        setFilteredIssues([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadIssues();
  }, []);

  // Filter issues based on selected criteria
  useEffect(() => {
    let filtered = [...allIssues];

    // Filter by categories
    if (selectedCategories?.length > 0) {
      filtered = filtered?.filter(issue => selectedCategories?.includes(issue?.category));
    }

    // Filter by status
    if (selectedStatuses?.length > 0) {
      filtered = filtered?.filter(issue => selectedStatuses?.includes(issue?.status));
    }

    // Filter by time range
    if (selectedTimeRange !== 'all') {
      const now = new Date();
      const timeRanges = {
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
        '90d': 90 * 24 * 60 * 60 * 1000
      };
      
      const timeLimit = timeRanges?.[selectedTimeRange];
      if (timeLimit) {
        filtered = filtered?.filter(issue => {
          const issueDate = new Date(issue.created_at);
          return (now - issueDate) <= timeLimit;
        });
      }
    }

    // Filter by search radius
    if (searchLocation && searchRadius) {
      filtered = filtered?.filter(issue => {
        // Handle both coordinate formats
        const issueLat = issue?.latitude || issue?.coordinates?.lat;
        const issueLng = issue?.longitude || issue?.coordinates?.lng;
        const searchLat = searchLocation?.coordinates?.lat || searchLocation?.latitude;
        const searchLng = searchLocation?.coordinates?.lng || searchLocation?.longitude;
        
        if (!issueLat || !issueLng || !searchLat || !searchLng) return false;
        
        const distance = Math.sqrt(
          Math.pow(issueLat - searchLat, 2) +
          Math.pow(issueLng - searchLng, 2)
        ) * 111; // Rough conversion to km
        return distance <= searchRadius;
      });
    }

    // Only show issues with valid coordinates for the map
    filtered = filtered.filter(issue => 
      (issue?.latitude && issue?.longitude) || 
      (issue?.coordinates?.lat && issue?.coordinates?.lng)
    );

    console.log('🗺️ Filtered issues for map:', filtered.length, 'out of', allIssues.length);
    setFilteredIssues(filtered);
  }, [allIssues, selectedCategories, selectedStatuses, selectedTimeRange, searchLocation, searchRadius]);

  const handleIssueSelect = (issue) => {
    setSelectedIssue(issue);
  };

  const handleLocationSearch = (location) => {
    setSearchLocation(location);
    setSearchRadius(null);
  };

  const handleRadiusSearch = (location, radius) => {
    setSearchLocation(location);
    setSearchRadius(radius);
  };

  const handleReportSimilar = (issue) => {
    // Navigate to issue reporting form with pre-filled data
    console.log('Report similar issue:', issue);
  };

  const handleDrawingModeToggle = () => {
    setIsDrawingMode(!isDrawingMode);
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-96">
          <motion.div 
            className="text-center"
            initial={animations.scaleIn.initial}
            animate={animations.scaleIn.animate}
            transition={animations.scaleIn.transition}
          >
            <Icon name="Loader2" size={32} className="animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-slate-600">Loading interactive map...</p>
          </motion.div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <main className="relative">
        {/* Breadcrumb Navigation */}
        <motion.div 
          className="container mx-auto px-4 py-4"
          initial={animations.fadeInDown.initial}
          animate={animations.fadeInDown.animate}
          transition={animations.fadeInDown.transition}
        >
          <Breadcrumb />
        </motion.div>

        {/* Map Interface */}
        <div className="relative h-[calc(100vh-120px)]">
          {/* Map Container */}
          <MapContainer
            issues={filteredIssues}
            selectedIssue={selectedIssue}
            onIssueSelect={handleIssueSelect}
            onMapClick={() => {}} // Add this required prop
            searchLocation={searchLocation}
            searchRadius={searchRadius}
            activeLayers={activeLayers}
            isDrawingMode={isDrawingMode}
          />

          {/* Map Search Bar */}
          <MapSearchBar
            onLocationSearch={handleLocationSearch}
            onRadiusSearch={handleRadiusSearch}
          />

          {/* Map Controls */}
          <MapControls
            onCategoryFilter={setSelectedCategories}
            onStatusFilter={setSelectedStatuses}
            onTimeRangeFilter={setSelectedTimeRange}
            onLayerToggle={setActiveLayers}
            onDrawingModeToggle={handleDrawingModeToggle}
            selectedCategories={selectedCategories}
            selectedStatuses={selectedStatuses}
            selectedTimeRange={selectedTimeRange}
            activeLayers={activeLayers}
            isDrawingMode={isDrawingMode}
          />

          {/* Map Legend */}
          <MapLegend />

          {/* Issue Details Panel */}
          {selectedIssue && (
            <IssueDetailsPanel
              issue={selectedIssue}
              onClose={() => setSelectedIssue(null)}
              onReportSimilar={handleReportSimilar}
            />
          )}

          {/* Quick Actions Floating Button */}
          <div className="absolute bottom-4 right-4 z-30">
            <div className="flex flex-col space-y-2">
              <Link to="/issue-reporting-form">
                <Button
                  variant="default"
                  size="lg"
                  iconName="Plus"
                  iconPosition="left"
                  iconSize={20}
                  className="shadow-lg"
                >
                  Report Issue
                </Button>
              </Link>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.location?.reload()}
                className="bg-card shadow-lg"
                title="Refresh Map"
              >
                <Icon name="RefreshCw" size={20} />
              </Button>
            </div>
          </div>

          {/* Data Sync Indicator */}
          <div className="absolute top-4 left-4 z-30">
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-slate-600">
                  {filteredIssues?.length} issues • Synced with Reports
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Bottom Sheet Trigger */}
          <div className="lg:hidden absolute bottom-20 left-4 right-4">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                // Toggle mobile filters panel
                console.log('Toggle mobile filters');
              }}
              iconName="Filter"
              iconPosition="left"
              iconSize={16}
              className="bg-card shadow-lg"
            >
              Filters & Search ({filteredIssues?.length} issues)
            </Button>
          </div>

          {/* No Issues Found State */}
          {filteredIssues?.length === 0 && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-40">
              <div className="text-center max-w-md mx-auto p-8">
                <Icon name="MapPin" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No Issues Found
                </h3>
                <p className="text-muted-foreground mb-6">
                  No issues match your current filters or search criteria. Try adjusting your filters or search in a different area.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategories([]);
                      setSelectedStatuses([]);
                      setSelectedTimeRange('all');
                      setSearchLocation(null);
                      setSearchRadius(null);
                    }}
                    iconName="RotateCcw"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Clear Filters
                  </Button>
                  <Link to="/issue-reporting-form">
                    <Button
                      variant="default"
                      iconName="Plus"
                      iconPosition="left"
                      iconSize={16}
                    >
                      Report New Issue
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </PageLayout>
  );
};

export default InteractiveIssueMap;