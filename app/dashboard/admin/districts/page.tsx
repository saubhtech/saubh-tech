'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';

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
  stateid: number;
  district: string;
  districthq: string | null;
  state?: string;
  country?: string;
}

export default function DistrictsPage() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [filteredStates, setFilteredStates] = useState<State[]>([]);
  const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState<District | null>(null);
  const [deletingDistrict, setDeletingDistrict] = useState<District | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    countrycode: '',
    stateid: '',
    district: '',
    districthq: '',
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    fetchDistricts();
    fetchCountries();
    fetchStates();
  }, []);

  useEffect(() => {
    const filtered = districts.filter(
      (district) =>
        district.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        district.districthq?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        district.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        district.country?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDistricts(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, districts]);

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

  const fetchDistricts = async () => {
    try {
      const response = await fetch('/api/admin/districts');
      const data = await response.json();
      if (data.success) {
        setDistricts(data.data);
        setFilteredDistricts(data.data);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
      showNotification('error', 'Failed to fetch districts');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = '/api/admin/districts';
      const method = editingDistrict ? 'PUT' : 'POST';
      const body = editingDistrict
        ? {
            districtid: editingDistrict.districtid,
            stateid: parseInt(formData.stateid),
            district: formData.district,
            districthq: formData.districthq || null,
          }
        : {
            stateid: parseInt(formData.stateid),
            district: formData.district,
            districthq: formData.districthq || null,
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
        fetchDistricts();
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
    if (!deletingDistrict) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/districts?districtid=${deletingDistrict.districtid}`,
        { method: 'DELETE' }
      );

      const data = await response.json();

      if (data.success) {
        showNotification('success', data.message);
        setIsDeleteDialogOpen(false);
        setDeletingDistrict(null);
        fetchDistricts();
      } else {
        showNotification('error', data.error);
      }
    } catch (error) {
      showNotification('error', 'Failed to delete district');
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (district: District) => {
    setEditingDistrict(district);
    const state = states.find((s) => s.stateid === district.stateid);
    setFormData({
      countrycode: state?.countrycode || '',
      stateid: district.stateid.toString(),
      district: district.district,
      districthq: district.districthq || '',
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (district: District) => {
    setDeletingDistrict(district);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ countrycode: '', stateid: '', district: '', districthq: '' });
    setEditingDistrict(null);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredDistricts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDistricts = filteredDistricts.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
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
        <h1 className="text-3xl font-bold">District Management</h1>
        <button
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Add District
        </button>
      </div>

      {/* Search and Items Per Page */}
      <div className="mb-4 flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search districts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Show:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">District ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">District Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">District HQ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">State</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Country</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white">
            {currentDistricts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-900">
                  No districts found
                </td>
              </tr>
            ) : (
              currentDistricts.map((district) => (
                <tr key={district.districtid} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{district.districtid}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{district.district}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{district.districthq || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{district.state}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{district.country}</td>
                  <td className="px-6 py-4 text-sm text-right">
                    <button
                      onClick={() => openEditDialog(district)}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <Edit className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => openDeleteDialog(district)}
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
      {filteredDistricts.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredDistricts.length)} of {filteredDistricts.length} districts
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Show first page, last page, current page, and pages around current
                  return page === 1 || 
                         page === totalPages || 
                         Math.abs(page - currentPage) <= 1;
                })
                .map((page, index, array) => {
                  // Add ellipsis if there's a gap
                  const showEllipsisBefore = index > 0 && page - array[index - 1] > 1;
                  return (
                    <div key={page} className="flex items-center gap-1">
                      {showEllipsisBefore && <span className="px-2">...</span>}
                      <button
                        onClick={() => goToPage(page)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    </div>
                  );
                })}
            </div>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
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
                {editingDistrict ? 'Edit District' : 'Add New District'}
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
                      setFormData({ ...formData, countrycode: e.target.value, stateid: '' })
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
                      setFormData({ ...formData, stateid: e.target.value })
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
                  <label className="block text-sm font-medium mb-1">District Name</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) =>
                      setFormData({ ...formData, district: e.target.value })
                    }
                    placeholder="e.g., Los Angeles"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">District Headquarters (Optional)</label>
                  <input
                    type="text"
                    value={formData.districthq}
                    onChange={(e) =>
                      setFormData({ ...formData, districthq: e.target.value })
                    }
                    placeholder="e.g., Downtown LA"
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
                  {loading ? 'Saving...' : editingDistrict ? 'Update' : 'Create'}
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
              Are you sure you want to delete the district &quot;{deletingDistrict?.district}&quot;? This action cannot be undone.
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