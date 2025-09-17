import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const IssuesTable = ({ issues, onStatusUpdate, onBulkAssign, onExport }) => {
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'submittedAt', direction: 'desc' });

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIssues(issues?.map(issue => issue?.id));
    } else {
      setSelectedIssues([]);
    }
  };

  const handleSelectIssue = (issueId, checked) => {
    if (checked) {
      setSelectedIssues([...selectedIssues, issueId]);
    } else {
      setSelectedIssues(selectedIssues?.filter(id => id !== issueId));
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedIssues = [...issues]?.sort((a, b) => {
    if (sortConfig?.direction === 'asc') {
      return a?.[sortConfig?.key] > b?.[sortConfig?.key] ? 1 : -1;
    }
    return a?.[sortConfig?.key] < b?.[sortConfig?.key] ? 1 : -1;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
      case 'in-progress': return 'bg-primary/10 text-primary border-primary/20';
      case 'resolved': return 'bg-success/10 text-success border-success/20';
      case 'rejected': return 'bg-accent/10 text-accent border-accent/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-accent text-accent-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Table Header Actions */}
      <div className="p-4 border-b border-border bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {selectedIssues?.length} of {issues?.length} selected
            </span>
            {selectedIssues?.length > 0 && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onBulkAssign(selectedIssues)}
                  iconName="Users"
                  iconPosition="left"
                  iconSize={14}
                >
                  Assign
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStatusUpdate(selectedIssues, 'in-progress')}
                  iconName="Play"
                  iconPosition="left"
                  iconSize={14}
                >
                  Start Progress
                </Button>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            iconName="Download"
            iconPosition="left"
            iconSize={14}
          >
            Export CSV
          </Button>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="w-12 p-4">
                <Checkbox
                  checked={selectedIssues?.length === issues?.length && issues?.length > 0}
                  indeterminate={selectedIssues?.length > 0 && selectedIssues?.length < issues?.length}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('id')}
                  className="flex items-center space-x-1 hover:text-foreground transition-smooth"
                >
                  <span>Issue ID</span>
                  <Icon name={getSortIcon('id')} size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center space-x-1 hover:text-foreground transition-smooth"
                >
                  <span>Title & Location</span>
                  <Icon name={getSortIcon('title')} size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('category')}
                  className="flex items-center space-x-1 hover:text-foreground transition-smooth"
                >
                  <span>Category</span>
                  <Icon name={getSortIcon('category')} size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 hover:text-foreground transition-smooth"
                >
                  <span>Status</span>
                  <Icon name={getSortIcon('status')} size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('priority')}
                  className="flex items-center space-x-1 hover:text-foreground transition-smooth"
                >
                  <span>Priority</span>
                  <Icon name={getSortIcon('priority')} size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('assignedDepartment')}
                  className="flex items-center space-x-1 hover:text-foreground transition-smooth"
                >
                  <span>Department</span>
                  <Icon name={getSortIcon('assignedDepartment')} size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('submittedAt')}
                  className="flex items-center space-x-1 hover:text-foreground transition-smooth"
                >
                  <span>Submitted</span>
                  <Icon name={getSortIcon('submittedAt')} size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedIssues?.map((issue) => (
              <tr key={issue?.id} className="hover:bg-muted/30 transition-smooth">
                <td className="p-4">
                  <Checkbox
                    checked={selectedIssues?.includes(issue?.id)}
                    onChange={(e) => handleSelectIssue(issue?.id, e?.target?.checked)}
                  />
                </td>
                <td className="p-4">
                  <span className="font-mono text-sm text-primary">#{issue?.id}</span>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <p className="font-medium text-card-foreground line-clamp-1">{issue?.title}</p>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Icon name="MapPin" size={12} />
                      <span className="line-clamp-1">{issue?.location}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                    {issue?.category}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(issue?.status)}`}>
                    {issue?.status?.replace('-', ' ')?.toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue?.priority)}`}>
                    {issue?.priority?.toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-card-foreground">
                    {issue?.assignedDepartment || 'Unassigned'}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">{issue?.submittedAt}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => console.log('View issue', issue?.id)}
                      className="h-8 w-8"
                    >
                      <Icon name="Eye" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => console.log('Edit issue', issue?.id)}
                      className="h-8 w-8"
                    >
                      <Icon name="Edit" size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Table Footer */}
      <div className="p-4 border-t border-border bg-muted/50">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {sortedIssues?.length} of {issues?.length} issues</span>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              <Icon name="ChevronLeft" size={14} />
            </Button>
            <span className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs">1</span>
            <Button variant="outline" size="sm" disabled>
              <Icon name="ChevronRight" size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssuesTable;