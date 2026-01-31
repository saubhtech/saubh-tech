'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';

interface Country {
  countrycode: string;
  country: string;
}

interface State {
  stateid: number;
  state: string;
  countrycode: string;
}

interface District {
  districtid: number;
  district: string;
  stateid: number;
}

interface Postal {
  postid: number;
  postcode: string;
  districtid: number;
  stateid: number;
  countrycode: string;
  district?: string;
  state?: string;
  country?: string;
}

export default function PostalPage() {
  const [postals, setPostals] = useState<Postal[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [filteredStates, setFilteredStates] = useState<State[]>([]);
  const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);
  const [filteredPostals, setFilteredPostals] = useState<Postal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPostal, setEditingPostal] = useState<Postal | null>(null);
  const [deletingPostal, setDeletingPostal] = useState<Postal | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const [formData, setFormData] = useState({
    countrycode: '',
    stateid: '',
    districtid: '',
    postcode: '',
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    fetchPostals();
    fetchCountries();
    fetchStates();
    fetchDistricts();
  }, []);

  useEffect(() => {
    const filtered = postals.filter(
      (postal) =>
        postal.postcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        postal.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        postal.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        postal.country?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPostals(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, postals]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPostals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPostals = filteredPostals.slice(startIndex, endIndex);

  useEffect(() => {
    if (formData.countrycode) {
      const filtered = states.filter(
        (state) => state.countrycode === formData.countrycode
      );
      setFilteredStates(filtered);
    } else {
      setFilteredStates([]);
    }
  }, [formData.countrycode, states]);

  useEffect(() => {
    if (formData.stateid) {
      const filtered = districts.filter(
        (district) => district.stateid === parseInt(formData.stateid)
      );
      setFilteredDistricts(filtered);
    } else {
      setFilteredDistricts([]);
    }
  }, [formData.stateid, districts]);

  const fetchPostals = async () => {
    try {
      const response = await fetch('/api/admin/postal');
      const data = await response.json();
      if (data.success) {
        setPostals(data.data);
        setFilteredPostals(data.data);
      }
    } catch (error) {
      console.error('Error fetching postal codes:', error);
      showNotification('error', 'Failed to fetch postal codes');
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await fetch('/api/admin/countries');
      const data = await response.json();
      if (data.success) {
        setCountries(data.data);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchStates = async () => {
    try {
      const response = await fetch('/api/admin/states');
      const data = await response.json();
      if (data.success) {
        setStates(data.data);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const fetchDistricts = async () => {
    try {
      const response = await fetch('/api/admin/districts');
      const data = await response.json();
      if (data.success) {
        setDistricts(data.data);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = '/api/admin/postal';
      const method = editingPostal ? 'PUT' : 'POST';
      const body = editingPostal
        ? {
            postid: editingPostal.postid,
            postcode: formData.postcode,
            districtid: parseInt(formData.districtid),
            stateid: parseInt(formData.stateid),
            countrycode: formData.countrycode,
          }
        : {
            postcode: formData.postcode,
            districtid: parseInt(formData.districtid),
            stateid: parseInt(formData.stateid),
            countrycode: formData.countrycode,
          };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        showNotification('success', data.message);
        setIsDialogOpen(false);
        resetForm();
        fetchPostals();
      } else {
        showNotification('error', data.error);
      }
    } catch (error) {
      showNotification('error', 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingPostal) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/postal?postid=${deletingPostal.postid}`,
        { method: 'DELETE' }
      );

      const data = await response.json();

      if (data.success) {
        showNotification('success', data.message);
        setIsDeleteDialogOpen(false);
        setDeletingPostal(null);
        fetchPostals();
      } else {
        showNotification('error', data.error);
      }
    } catch (error) {
      showNotification('error', 'Failed to delete postal code');
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (postal: Postal) => {
    setEditingPostal(postal);
    setFormData({
      countrycode: postal.countrycode,
      stateid: postal.stateid.toString(),
      districtid: postal.districtid.toString(),
      postcode: postal.postcode,
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (postal: Postal) => {
    setDeletingPostal(postal);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      countrycode: '',
      stateid: '',
      districtid: '',
      postcode: '',
    });
    setEditingPostal(null);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Postal Code Management</h1>
        <button
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Add Postal Code
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search postal codes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Post ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Postal Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">District</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">State</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Country</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white">
            {currentPostals.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-900">
                  No postal codes found
                </td>
              </tr>
            ) : (
              currentPostals.map((postal) => (
                <tr key={postal.postid} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{postal.postid}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{postal.postcode}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{postal.district}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{postal.state}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{postal.country}</td>
                  <td className="px-6 py-4 text-sm text-right">
                    <button
                      onClick={() => openEditDialog(postal)}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <Edit className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => openDeleteDialog(postal)}
                      className="p-2 hover:bg-gray-100 rounded ml-2"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredPostals.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredPostals.length)} of {filteredPostals.length} results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingPostal ? 'Edit Postal Code' : 'Add New Postal Code'}
              </h2>
              <button onClick={() => setIsDialogOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <select
                    value={formData.countrycode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        countrycode: e.target.value,
                        stateid: '',
                        districtid: '',
                      })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option key={country.countrycode} value={country.countrycode}>
                        {country.country}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <select
                    value={formData.stateid}
                    onChange={(e) =>
                      setFormData({ ...formData, stateid: e.target.value, districtid: '' })
                    }
                    required
                    disabled={!formData.countrycode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Select a state</option>
                    {filteredStates.map((state) => (
                      <option key={state.stateid} value={state.stateid.toString()}>
                        {state.state}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">District</label>
                  <select
                    value={formData.districtid}
                    onChange={(e) =>
                      setFormData({ ...formData, districtid: e.target.value })
                    }
                    required
                    disabled={!formData.stateid}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Select a district</option>
                    {filteredDistricts.map((district) => (
                      <option key={district.districtid} value={district.districtid.toString()}>
                        {district.district}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={formData.postcode}
                    onChange={(e) =>
                      setFormData({ ...formData, postcode: e.target.value })
                    }
                    placeholder="e.g., 90001"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingPostal ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the postal code &quot;{deletingPostal?.postcode}&quot;? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}