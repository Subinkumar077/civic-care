import React, { useState, useEffect } from 'react';
import { getAllCivicIssues } from '../../../services/civicIssueService';
import SearchBar from '../../../components/ui/SearchBar';
import Select from '../../../components/ui/Select';
import { Link } from 'react-router-dom';

const CommunityComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const allComplaints = await getAllCivicIssues();
      setComplaints(allComplaints);
    } catch (error) {
      console.error('Error fetching community complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'roads', label: 'Roads' },
    { value: 'water', label: 'Water' },
    { value: 'electricity', label: 'Electricity' },
    { value: 'sanitation', label: 'Sanitation' },
    { value: 'other', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Community Complaints</h2>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search community complaints..."
          />
        </div>
        <div className="w-48">
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={categories}
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

      {filteredComplaints.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No complaints found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredComplaints.map((complaint) => (
            <div
              key={complaint.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div>
                <h3 className="text-lg font-medium mb-2">
                  <Link to={`/issues/${complaint.id}`} className="text-blue-600 hover:text-blue-800">
                    {complaint.title}
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm mb-2">{complaint.description}</p>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {complaint.category}
                  </span>
                  <span className={`px-2 py-1 rounded ${
                    complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    complaint.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    complaint.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {complaint.status}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  <span>{complaint.location} • </span>
                  <span>{new Date(complaint.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityComplaints;