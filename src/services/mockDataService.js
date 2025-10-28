// Centralized mock data service for consistent data across all components
import { format, subDays, subHours, addDays } from 'date-fns';

// Base configuration for realistic data generation
const CONFIG = {
  // Delhi coordinates and zones
  DELHI_CENTER: { lat: 28.6139, lng: 77.2090 },
  ZONES: [
    { name: 'Central Delhi', center: { lat: 28.6139, lng: 77.2090 }, population: 582320 },
    { name: 'North Delhi', center: { lat: 28.7041, lng: 77.1025 }, population: 887978 },
    { name: 'South Delhi', center: { lat: 28.5355, lng: 77.2490 }, population: 2731929 },
    { name: 'East Delhi', center: { lat: 28.6508, lng: 77.3152 }, population: 1709346 },
    { name: 'West Delhi', center: { lat: 28.6692, lng: 77.1174 }, population: 2543243 },
    { name: 'New Delhi', center: { lat: 28.6139, lng: 77.2090 }, population: 249998 },
    { name: 'North East Delhi', center: { lat: 28.7233, lng: 77.2903 }, population: 2241624 },
    { name: 'North West Delhi', center: { lat: 28.7233, lng: 77.1394 }, population: 3656539 },
    { name: 'South East Delhi', center: { lat: 28.5355, lng: 77.3152 }, population: 1634200 },
    { name: 'South West Delhi', center: { lat: 28.5355, lng: 77.1394 }, population: 2292958 }
  ],
  
  CATEGORIES: [
    { id: 'roads', name: 'Roads & Transport', icon: 'Car', color: '#ef4444', weight: 0.35 },
    { id: 'sanitation', name: 'Sanitation & Waste', icon: 'Trash2', color: '#f97316', weight: 0.25 },
    { id: 'utilities', name: 'Utilities & Infrastructure', icon: 'Zap', color: '#eab308', weight: 0.20 },
    { id: 'environment', name: 'Environment & Parks', icon: 'Leaf', color: '#22c55e', weight: 0.10 },
    { id: 'safety', name: 'Safety & Security', icon: 'Shield', color: '#3b82f6', weight: 0.10 }
  ],
  
  STATUSES: [
    { id: 'submitted', name: 'Submitted', color: '#6b7280', weight: 0.15 },
    { id: 'in_review', name: 'In Review', color: '#f59e0b', weight: 0.20 },
    { id: 'in_progress', name: 'In Progress', color: '#3b82f6', weight: 0.35 },
    { id: 'resolved', name: 'Resolved', color: '#10b981', weight: 0.25 },
    { id: 'closed', name: 'Closed', color: '#6b7280', weight: 0.05 }
  ],
  
  PRIORITIES: [
    { id: 'low', name: 'Low', color: '#10b981', weight: 0.30 },
    { id: 'medium', name: 'Medium', color: '#f59e0b', weight: 0.45 },
    { id: 'high', name: 'High', color: '#ef4444', weight: 0.20 },
    { id: 'critical', name: 'Critical', color: '#dc2626', weight: 0.05 }
  ],
  
  DEPARTMENTS: [
    { id: 'pwd', name: 'Public Works Department', categories: ['roads'], efficiency: 0.87 },
    { id: 'mcd', name: 'Municipal Corporation', categories: ['sanitation', 'environment'], efficiency: 0.78 },
    { id: 'deb', name: 'Delhi Electricity Board', categories: ['utilities'], efficiency: 0.92 },
    { id: 'djb', name: 'Delhi Jal Board', categories: ['utilities'], efficiency: 0.85 },
    { id: 'dda', name: 'Delhi Development Authority', categories: ['environment', 'roads'], efficiency: 0.73 },
    { id: 'police', name: 'Delhi Police', categories: ['safety'], efficiency: 0.89 }
  ]
};

// Utility functions for realistic data generation
const getRandomElement = (array, weights = null) => {
  if (!weights) return array[Math.floor(Math.random() * array.length)];
  
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < array.length; i++) {
    random -= weights[i];
    if (random <= 0) return array[i];
  }
  return array[array.length - 1];
};

const generateCoordinates = (center, radiusKm = 5) => {
  const radiusDeg = radiusKm / 111; // Rough conversion km to degrees
  const angle = Math.random() * 2 * Math.PI;
  const radius = Math.random() * radiusDeg;
  
  return {
    lat: center.lat + radius * Math.cos(angle),
    lng: center.lng + radius * Math.sin(angle)
  };
};

const generateRealisticAddress = (zone, coordinates) => {
  const streets = [
    'Main Road', 'Park Street', 'Gandhi Road', 'Nehru Avenue', 'Station Road',
    'Market Street', 'School Road', 'Hospital Road', 'Temple Street', 'Mall Road',
    'Ring Road', 'Metro Station Road', 'Bus Stand Road', 'Railway Station Road'
  ];
  
  const areas = [
    'Block A', 'Block B', 'Sector 1', 'Sector 2', 'Phase 1', 'Phase 2',
    'Extension', 'Colony', 'Nagar', 'Vihar', 'Enclave', 'Park'
  ];
  
  const street = getRandomElement(streets);
  const area = getRandomElement(areas);
  
  return `${street}, ${area}, ${zone.name}, Delhi`;
};

// Generate realistic issue data
const generateIssueData = (count = 1000) => {
  const issues = [];
  const now = new Date();
  
  // Generate names for reporters
  const firstNames = [
    'Rajesh', 'Priya', 'Amit', 'Sunita', 'Vikram', 'Neha', 'Ramesh', 'Kavita',
    'Suresh', 'Meera', 'Anil', 'Pooja', 'Deepak', 'Ritu', 'Manoj', 'Sonia',
    'Ashok', 'Geeta', 'Rohit', 'Anjali', 'Vinod', 'Shanti', 'Pankaj', 'Usha'
  ];
  
  const lastNames = [
    'Sharma', 'Singh', 'Kumar', 'Gupta', 'Agarwal', 'Verma', 'Jain', 'Yadav',
    'Mishra', 'Tiwari', 'Chauhan', 'Saxena', 'Pandey', 'Srivastava', 'Arora'
  ];
  
  // Issue templates by category
  const issueTemplates = {
    roads: [
      { title: 'Large pothole on {street} causing traffic issues', description: 'Significant pothole approximately {size} causing vehicle damage and traffic congestion.' },
      { title: 'Broken footpath near {landmark}', description: 'Footpath has broken tiles and uneven surfaces, creating pedestrian hazards.' },
      { title: 'Traffic signal not working at {intersection}', description: 'Traffic light has been non-functional for {duration}, causing traffic chaos.' },
      { title: 'Road construction debris blocking {street}', description: 'Construction materials left on road creating obstruction for vehicles.' }
    ],
    sanitation: [
      { title: 'Overflowing garbage bin in {area}', description: 'Community garbage bin overflowing for {duration}, creating unhygienic conditions.' },
      { title: 'Illegal dumping in {location}', description: 'Construction waste and household garbage being illegally dumped.' },
      { title: 'Blocked drainage system causing waterlogging', description: 'Drainage blocked leading to water accumulation during rains.' },
      { title: 'Stray animals creating mess near {landmark}', description: 'Stray dogs and cattle creating sanitation issues.' }
    ],
    utilities: [
      { title: 'Street light not working for {duration}', description: 'Street lighting non-functional making area unsafe during night hours.' },
      { title: 'Water leakage from municipal pipeline', description: 'Continuous water leak causing wastage and making road slippery.' },
      { title: 'Power outage in {area} for {duration}', description: 'Electricity supply disrupted affecting daily activities.' },
      { title: 'Internet/cable lines hanging dangerously low', description: 'Utility cables at dangerous height posing safety risk.' }
    ],
    environment: [
      { title: 'Tree branches blocking road in {area}', description: 'Overgrown tree branches obstructing traffic and pedestrians.' },
      { title: 'Park maintenance required at {location}', description: 'Community park needs cleaning and maintenance of facilities.' },
      { title: 'Air pollution from construction site', description: 'Excessive dust and pollution from nearby construction activities.' },
      { title: 'Noise pollution from {source}', description: 'Excessive noise levels affecting residents quality of life.' }
    ],
    safety: [
      { title: 'Inadequate lighting creating safety concerns', description: 'Poor street lighting making area vulnerable to criminal activities.' },
      { title: 'Broken boundary wall posing security risk', description: 'Damaged perimeter wall allowing unauthorized access.' },
      { title: 'Unsafe construction practices at {location}', description: 'Construction site not following safety protocols.' },
      { title: 'Missing manhole cover on {street}', description: 'Open manhole without cover creating serious safety hazard.' }
    ]
  };
  
  for (let i = 0; i < count; i++) {
    const zone = getRandomElement(CONFIG.ZONES);
    const category = getRandomElement(CONFIG.CATEGORIES, CONFIG.CATEGORIES.map(c => c.weight));
    const status = getRandomElement(CONFIG.STATUSES, CONFIG.STATUSES.map(s => s.weight));
    const priority = getRandomElement(CONFIG.PRIORITIES, CONFIG.PRIORITIES.map(p => p.weight));
    const coordinates = generateCoordinates(zone.center);
    const address = generateRealisticAddress(zone, coordinates);
    
    // Generate realistic timestamp (more recent issues have higher probability)
    const daysAgo = Math.floor(Math.pow(Math.random(), 2) * 90); // Weighted towards recent
    const hoursAgo = Math.floor(Math.random() * 24);
    const reportedAt = subHours(subDays(now, daysAgo), hoursAgo);
    
    // Select appropriate department
    const department = CONFIG.DEPARTMENTS.find(d => d.categories.includes(category.id)) || CONFIG.DEPARTMENTS[0];
    
    // Generate issue content
    const template = getRandomElement(issueTemplates[category.id]);
    const replacements = {
      '{street}': getRandomElement(['Main Road', 'Park Street', 'Gandhi Road', 'Station Road']),
      '{area}': zone.name,
      '{landmark}': getRandomElement(['bus stop', 'market', 'school', 'hospital', 'metro station']),
      '{intersection}': getRandomElement(['Main Road crossing', 'Market intersection', 'School junction']),
      '{location}': getRandomElement(['community park', 'residential area', 'market area']),
      '{duration}': getRandomElement(['2 days', '1 week', '3 days', '5 days']),
      '{size}': getRandomElement(['2 feet wide', '3 feet diameter', '1.5 feet deep']),
      '{source}': getRandomElement(['construction site', 'factory', 'generator', 'traffic'])
    };
    
    let title = template.title;
    let description = template.description;
    
    Object.entries(replacements).forEach(([placeholder, replacement]) => {
      title = title.replace(placeholder, replacement);
      description = description.replace(placeholder, replacement);
    });
    
    // Generate votes (more for older, resolved issues)
    const ageInDays = daysAgo;
    const baseVotes = Math.floor(Math.random() * 10) + 1;
    const ageMultiplier = Math.min(ageInDays / 30, 2);
    const statusMultiplier = status.id === 'resolved' ? 1.5 : status.id === 'in_progress' ? 1.2 : 1;
    const upvotes = Math.floor(baseVotes * ageMultiplier * statusMultiplier);
    
    const issue = {
      id: i + 1,
      title,
      description,
      category: category.id,
      status: status.id,
      priority: priority.id,
      coordinates,
      address,
      zone: zone.name,
      reporter: {
        id: Math.floor(Math.random() * 10000) + 1000,
        name: `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`,
        email: `user${i + 1}@example.com`
      },
      assignedTo: status.id !== 'submitted' ? {
        department: department.name,
        team: `${department.name} Team ${String.fromCharCode(65 + Math.floor(Math.random() * 3))}`,
        officer: `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`
      } : null,
      reportedAt: reportedAt.toISOString(),
      updatedAt: status.id !== 'submitted' ? addDays(reportedAt, Math.floor(Math.random() * 7) + 1).toISOString() : reportedAt.toISOString(),
      resolvedAt: status.id === 'resolved' || status.id === 'closed' ? addDays(reportedAt, Math.floor(Math.random() * 14) + 3).toISOString() : null,
      upvotes,
      comments: Math.floor(upvotes * 0.3),
      images: Math.random() > 0.3 ? [`https://picsum.photos/400/300?random=${i + 1}`] : [],
      timeline: generateTimeline(reportedAt, status.id, department.name)
    };
    
    issues.push(issue);
  }
  
  return issues.sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt));
};

// Generate realistic timeline for issues
const generateTimeline = (reportedAt, status, departmentName) => {
  const timeline = [{
    action: 'Issue reported by citizen',
    timestamp: reportedAt.toISOString(),
    actor: 'Citizen'
  }];
  
  if (status !== 'submitted') {
    timeline.push({
      action: `Assigned to ${departmentName}`,
      timestamp: addDays(reportedAt, Math.floor(Math.random() * 2) + 1).toISOString(),
      actor: 'System'
    });
  }
  
  if (status === 'in_progress' || status === 'resolved' || status === 'closed') {
    timeline.push({
      action: 'Investigation started',
      timestamp: addDays(reportedAt, Math.floor(Math.random() * 3) + 2).toISOString(),
      actor: departmentName
    });
  }
  
  if (status === 'resolved' || status === 'closed') {
    timeline.push({
      action: 'Work completed',
      timestamp: addDays(reportedAt, Math.floor(Math.random() * 10) + 5).toISOString(),
      actor: departmentName
    });
    
    timeline.push({
      action: 'Issue marked as resolved',
      timestamp: addDays(reportedAt, Math.floor(Math.random() * 12) + 7).toISOString(),
      actor: 'System'
    });
  }
  
  return timeline;
};

// Generate analytics data based on issues
const generateAnalyticsData = (issues) => {
  const now = new Date();
  const last30Days = subDays(now, 30);
  const last7Days = subDays(now, 7);
  
  // Filter recent issues
  const recentIssues = issues.filter(issue => new Date(issue.reportedAt) >= last30Days);
  const weeklyIssues = issues.filter(issue => new Date(issue.reportedAt) >= last7Days);
  
  // Calculate metrics
  const totalIssues = issues.length;
  const resolvedIssues = issues.filter(i => i.status === 'resolved').length;
  const inProgressIssues = issues.filter(i => i.status === 'in_progress').length;
  const resolutionRate = ((resolvedIssues / totalIssues) * 100).toFixed(1);
  
  // Calculate average response time
  const resolvedWithTimeline = issues.filter(i => i.status === 'resolved' && i.resolvedAt);
  const avgResponseTime = resolvedWithTimeline.length > 0 
    ? resolvedWithTimeline.reduce((sum, issue) => {
        const reported = new Date(issue.reportedAt);
        const resolved = new Date(issue.resolvedAt);
        return sum + (resolved - reported) / (1000 * 60 * 60 * 24); // days
      }, 0) / resolvedWithTimeline.length
    : 0;
  
  // Generate category breakdown
  const categoryStats = CONFIG.CATEGORIES.map(category => {
    const categoryIssues = issues.filter(i => i.category === category.id);
    return {
      name: category.name,
      value: categoryIssues.length,
      percentage: ((categoryIssues.length / totalIssues) * 100).toFixed(1),
      color: category.color
    };
  });
  
  // Generate timeline data (last 30 days)
  const timelineData = [];
  for (let i = 29; i >= 0; i--) {
    const date = subDays(now, i);
    const dayIssues = issues.filter(issue => {
      const issueDate = new Date(issue.reportedAt);
      return issueDate.toDateString() === date.toDateString();
    });
    
    timelineData.push({
      date: format(date, 'yyyy-MM-dd'),
      total: dayIssues.length,
      resolved: dayIssues.filter(i => i.status === 'resolved').length,
      pending: dayIssues.filter(i => ['submitted', 'in_review'].includes(i.status)).length,
      inProgress: dayIssues.filter(i => i.status === 'in_progress').length
    });
  }
  
  // Generate department performance
  const departmentStats = CONFIG.DEPARTMENTS.map(dept => {
    const deptIssues = issues.filter(issue => 
      issue.assignedTo && issue.assignedTo.department === dept.name
    );
    const deptResolved = deptIssues.filter(i => i.status === 'resolved').length;
    const efficiency = deptIssues.length > 0 ? (deptResolved / deptIssues.length) * 100 : 0;
    
    return {
      name: dept.name,
      total: deptIssues.length,
      resolved: deptResolved,
      efficiency: efficiency.toFixed(1)
    };
  });
  
  // Generate geographic data
  const geographicStats = CONFIG.ZONES.map(zone => {
    const zoneIssues = issues.filter(i => i.zone === zone.name);
    const severity = zoneIssues.filter(i => ['high', 'critical'].includes(i.priority)).length;
    const severityLevel = severity > zoneIssues.length * 0.3 ? 'high' : 
                         severity > zoneIssues.length * 0.15 ? 'medium' : 'low';
    
    return {
      region: zone.name,
      issues: zoneIssues.length,
      severity: severityLevel,
      coordinates: zone.center,
      population: zone.population,
      issuesPerCapita: ((zoneIssues.length / zone.population) * 100000).toFixed(2)
    };
  });
  
  return {
    overview: {
      totalIssues,
      resolvedIssues,
      inProgressIssues,
      resolutionRate: parseFloat(resolutionRate),
      avgResponseTime: avgResponseTime.toFixed(1),
      weeklyIssues: weeklyIssues.length,
      monthlyIssues: recentIssues.length,
      citizenSatisfaction: 4.6 // Mock satisfaction score
    },
    categories: categoryStats,
    timeline: timelineData,
    departments: departmentStats,
    geographic: geographicStats,
    trends: {
      issueGrowth: ((recentIssues.length / (totalIssues - recentIssues.length)) * 100).toFixed(1),
      resolutionImprovement: 5.2, // Mock improvement percentage
      responseTimeImprovement: -1.3 // Negative means improvement (faster)
    }
  };
};

// Main data service class
class MockDataService {
  constructor() {
    this.issues = [];
    this.analytics = null;
    this.initialized = false;
  }
  
  initialize() {
    if (this.initialized) return;
    
    console.log('🔄 Initializing mock data service...');
    this.issues = generateIssueData(1000);
    this.analytics = generateAnalyticsData(this.issues);
    this.initialized = true;
    console.log('✅ Mock data service initialized with', this.issues.length, 'issues');
    
    // Verify synchronization on initialization
    setTimeout(() => {
      this.verifySynchronization();
    }, 1000);
  }
  
  // Get all issues with optional filtering
  getIssues(filters = {}) {
    this.initialize();
    
    // Note: This service is deprecated - use civicIssueService for real data
    console.warn('⚠️ MockDataService is deprecated. Use civicIssueService for real Supabase data.');
    console.log(`📊 MockDataService: Returning ${this.issues.length} mock issues`);
    if (filters.limit) {
      console.log(`🔍 Applying limit filter: ${filters.limit}`);
    }
    
    let filtered = [...this.issues];
    
    if (filters.category) {
      filtered = filtered.filter(issue => issue.category === filters.category);
    }
    
    if (filters.status) {
      filtered = filtered.filter(issue => issue.status === filters.status);
    }
    
    if (filters.priority) {
      filtered = filtered.filter(issue => issue.priority === filters.priority);
    }
    
    if (filters.zone) {
      filtered = filtered.filter(issue => issue.zone === filters.zone);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(issue => 
        issue.title.toLowerCase().includes(searchLower) ||
        issue.description.toLowerCase().includes(searchLower) ||
        issue.address.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.limit) {
      filtered = filtered.slice(0, filters.limit);
    }
    
    return filtered;
  }
  
  // Get single issue by ID
  getIssueById(id) {
    this.initialize();
    return this.issues.find(issue => issue.id === parseInt(id));
  }
  
  // Get analytics data
  getAnalytics() {
    this.initialize();
    return this.analytics;
  }
  
  // Get configuration data
  getConfig() {
    return CONFIG;
  }
  
  // Get issues for map display
  getMapIssues(bounds = null) {
    this.initialize();
    
    console.log(`🗺️ MockDataService: Getting map issues (${this.issues.length} total)`);
    
    if (!bounds) return this.issues;
    
    return this.issues.filter(issue => {
      const { lat, lng } = issue.coordinates;
      return lat >= bounds.south && lat <= bounds.north && 
             lng >= bounds.west && lng <= bounds.east;
    });
  }
  
  // Get specific issues by IDs (for perfect synchronization)
  getIssuesByIds(ids) {
    this.initialize();
    return this.issues.filter(issue => ids.includes(issue.id));
  }
  
  // Get the first N issues (for consistent ordering)
  getRecentIssues(limit = 6) {
    this.initialize();
    
    // Sort by most recent first, then take the limit
    const sorted = [...this.issues].sort((a, b) => 
      new Date(b.reportedAt) - new Date(a.reportedAt)
    );
    
    const recent = sorted.slice(0, limit);
    console.log(`📰 MockDataService: Returning ${recent.length} recent issues for reports section`);
    console.log(`🔗 Issue IDs: [${recent.map(i => i.id).join(', ')}]`);
    
    return recent;
  }
  
  // Simulate voting on an issue
  voteOnIssue(issueId, voteType = 'upvote') {
    this.initialize();
    
    const issue = this.issues.find(i => i.id === parseInt(issueId));
    if (issue) {
      if (voteType === 'upvote') {
        issue.upvotes += 1;
      }
      return { success: true, issue };
    }
    
    return { success: false, error: 'Issue not found' };
  }
  
  // Get statistics for dashboard
  getStats() {
    this.initialize();
    
    const total = this.issues.length;
    const byStatus = {};
    const byCategory = {};
    
    CONFIG.STATUSES.forEach(status => {
      byStatus[status.id] = this.issues.filter(i => i.status === status.id).length;
    });
    
    CONFIG.CATEGORIES.forEach(category => {
      byCategory[category.id] = this.issues.filter(i => i.category === category.id).length;
    });
    
    const recentCount = this.issues.filter(issue => {
      const weekAgo = subDays(new Date(), 7);
      return new Date(issue.reportedAt) >= weekAgo;
    }).length;
    
    return {
      total,
      byStatus,
      byCategory,
      recentCount
    };
  }
  
  // Verify data synchronization across components
  verifySynchronization() {
    this.initialize();
    
    const allIssues = this.getIssues();
    const recentIssues = this.getRecentIssues(6);
    const mapIssues = this.getMapIssues();
    
    console.log('🔍 Data Synchronization Verification:');
    console.log(`📊 Total Issues: ${allIssues.length}`);
    console.log(`📰 Recent Issues: ${recentIssues.length}`);
    console.log(`🗺️ Map Issues: ${mapIssues.length}`);
    console.log(`🔗 Recent Issue IDs: [${recentIssues.map(i => i.id).join(', ')}]`);
    console.log(`✅ All components use the same dataset: ${allIssues.length === mapIssues.length}`);
    
    return {
      totalIssues: allIssues.length,
      recentIssues: recentIssues.length,
      mapIssues: mapIssues.length,
      recentIds: recentIssues.map(i => i.id),
      synchronized: allIssues.length === mapIssues.length
    };
  }
}

// Export singleton instance
export const mockDataService = new MockDataService();
export default mockDataService;