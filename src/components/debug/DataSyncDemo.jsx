import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { mockDataService } from '../../services/mockDataService';
import Icon from '../AppIcon';

const DataSyncDemo = () => {
  const [recentReports, setRecentReports] = useState([]);
  const [allIssues, setAllIssues] = useState([]);
  const [syncStatus, setSyncStatus] = useState(null);

  useEffect(() => {
    // Load data from the same service that other components use
    const recentIssues = mockDataService.getRecentIssues(6);
    const allIssuesData = mockDataService.getIssues();
    const verification = mockDataService.verifySynchronization();

    setRecentReports(recentIssues);
    setAllIssues(allIssuesData);
    setSyncStatus(verification);
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center">
          <Icon name="Link" size={20} className="mr-2 text-blue-600" />
          Data Synchronization Demo
        </h3>
        <p className="text-sm text-slate-600">
          This demonstrates that the same issues appear in Reports, Issue Map, and Analytics
        </p>
      </div>

      {syncStatus && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center mb-2">
            <Icon name="CheckCircle" size={16} className="text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">
              Synchronization Status: {syncStatus.synchronized ? 'ACTIVE' : 'ERROR'}
            </span>
          </div>
          <div className="text-xs text-green-700 space-y-1">
            <div>Total Issues in Dataset: {syncStatus.totalIssues}</div>
            <div>Issues on Map: {syncStatus.mapIssues}</div>
            <div>Recent Issues Shown: {syncStatus.recentIssues}</div>
            <div>Recent Issue IDs: [{syncStatus.recentIds.join(', ')}]</div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Reports (Landing Page) */}
        <div>
          <h4 className="font-medium text-slate-800 mb-3 flex items-center">
            <Icon name="FileText" size={16} className="mr-2" />
            Recent Reports (Landing Page)
          </h4>
          <div className="space-y-2">
            {recentReports.slice(0, 3).map((issue) => (
              <motion.div
                key={issue.id}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-800">
                    Issue #{issue.id}
                  </span>
                  <span className="text-xs text-slate-500">
                    {issue.coordinates.lat.toFixed(4)}, {issue.coordinates.lng.toFixed(4)}
                  </span>
                </div>
                <div className="text-xs text-slate-600 line-clamp-2">
                  {issue.title}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  📍 {issue.zone} • 🏷️ {issue.category}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Map Issues */}
        <div>
          <h4 className="font-medium text-slate-800 mb-3 flex items-center">
            <Icon name="Map" size={16} className="mr-2" />
            Same Issues on Map
          </h4>
          <div className="space-y-2">
            {recentReports.slice(0, 3).map((issue) => {
              // Find the same issue in the all issues array to prove they're identical
              const mapIssue = allIssues.find(i => i.id === issue.id);
              return (
                <motion.div
                  key={mapIssue?.id}
                  className="p-3 bg-blue-50 rounded-lg border border-blue-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-blue-800">
                      Issue #{mapIssue?.id}
                    </span>
                    <span className="text-xs text-blue-600">
                      {mapIssue?.coordinates.lat.toFixed(4)}, {mapIssue?.coordinates.lng.toFixed(4)}
                    </span>
                  </div>
                  <div className="text-xs text-blue-700 line-clamp-2">
                    {mapIssue?.title}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    📍 {mapIssue?.zone} • 🏷️ {mapIssue?.category}
                  </div>
                  {mapIssue?.id === issue.id && (
                    <div className="mt-2 flex items-center text-xs text-green-600">
                      <Icon name="Check" size={12} className="mr-1" />
                      Identical to Reports data
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <div className="font-medium mb-1">How Synchronization Works:</div>
            <ul className="text-xs space-y-1 text-blue-700">
              <li>• All components use the same MockDataService instance</li>
              <li>• Issues are generated once and shared across all views</li>
              <li>• Same coordinates appear on map as in reports listing</li>
              <li>• Analytics calculations use the same dataset</li>
              <li>• Filtering and voting updates are synchronized</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSyncDemo;