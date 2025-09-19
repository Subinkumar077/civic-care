import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { getCivicIssuesByUser } from '../../../services/civicIssueService';
import SearchBar from '../../../components/ui/SearchBar';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const MyComplaints = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

  useEffect(() => {
    fetchComplaints();
  }, [user]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const userComplaints = await getCivicIssuesByUser(user.id);
      setComplaints(userComplaints);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'assigned': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'in_progress': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedComplaints = [...filteredComplaints]?.sort((a, b) => {
    if (sortConfig?.direction === 'asc') {
      return a?.[sortConfig?.key] > b?.[sortConfig?.key] ? 1 : -1;
    }
    return a?.[sortConfig?.key] < b?.[sortConfig?.key] ? 1 : -1;
  });

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'in_review', label: 'In Review' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
    { value: 'rejected', label: 'Rejected' }
  ];

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading complaints...</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">My Complaints</h2>
          <Button
            onClick={() => navigate('/issue-reporting-form')}
            iconName="Plus"
            iconPosition="left"
            iconSize={14}
          >
            Report New Issue
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your complaints..."
            />
          </div>
          <div className="w-48">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
            />
          </div>
        </div>
      </div>

      {sortedComplaints.length === 0 ? (
        <div className="p-8 text-center">
          <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="font-heading font-semibold text-lg text-card-foreground mb-2">
            No Complaints Found
          </h3>
          <p className="text-muted-foreground mb-6">
            You haven't submitted any complaints yet. Click the button above to report a new issue.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
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
                    onClick={() => handleSort('created_at')}
                    className="flex items-center space-x-1 hover:text-foreground transition-smooth"
                  >
                    <span>Submitted</span>
                    <Icon name={getSortIcon('created_at')} size={14} />
                  </button>
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedComplaints?.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-muted/30 transition-smooth">
                  <td className="p-4">
                    <span className="font-mono text-sm text-primary">
                      #{complaint.id?.slice(0, 8)}...
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <p className="font-medium text-card-foreground line-clamp-1">{complaint.title}</p>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Icon name="MapPin" size={12} />
                        <span className="line-clamp-1">{complaint.address}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary capitalize">
                      {complaint.category?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                      {complaint.status?.replace('_', ' ')?.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">{formatDate(complaint.created_at)}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/issue/${complaint.id}`)}
                        className="h-8 w-8"
                        title="View Details"
                      >
                        <Icon name="Eye" size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="p-4 border-t border-border bg-muted/50">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {sortedComplaints?.length} of {complaints?.length} complaints</span>
        </div>
      </div>
    </div>
  );
};

export default MyComplaints;