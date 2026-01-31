'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';

interface Country {
  countrycode: string;
  country: string;
}

interface State {
  stateid: number;
  countrycode: string;
  statecode: string;
  state: string;
  country?: string;
}

export default function StatesPage() {
  const [states, setStates] = useState<State[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredStates, setFilteredStates] = useState<State[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingState, setEditingState] = useState<State | null>(null);
  const [deletingState, setDeletingState] = useState<State | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    countrycode: '',
    statecode: '',
    state: '',
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    fetchStates();
    fetchCountries();
  }, []);

  useEffect(() => {
    const filtered = states.filter(
      (state) =>
        state.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        state.statecode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        state.country?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStates(filtered);
  }, [searchTerm, states]);

  const fetchStates = async () => {
    try {
      const response = await fetch('/api/admin/states');
      const data = await response.json();
      if (data.success) {
        setStates(data.data);
        setFilteredStates(data.data);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
      showNotification('error', 'Failed to fetch states');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = '/api/admin/states';
      const method = editingState ? 'PUT' : 'POST';
      const body = editingState
        ? { ...formData, stateid: editingState.stateid }
        : formData;

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
        fetchStates();
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
    if (!deletingState) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/states?stateid=${deletingState.stateid}`,
        { method: 'DELETE' }
      );

      const data = await response.json();

      if (data.success) {
        showNotification('success', data.message);
        setIsDeleteDialogOpen(false);
        setDeletingState(null);
        fetchStates();
      } else {
        showNotification('error', data.error);
      }
    } catch (error) {
      showNotification('error', 'Failed to delete state');
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (state: State) => {
    setEditingState(state);
    setFormData({
      countrycode: state.countrycode,
      statecode: state.statecode,
      state: state.state,
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (state: State) => {
    setDeletingState(state);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ countrycode: '', statecode: '', state: '' });
    setEditingState(null);
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
        <h1 className="text-3xl font-bold">State Management</h1>
        <button
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Add State
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search states..."
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">State ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">State Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">State Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Country</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white">
            {filteredStates.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-900">
                  No states found
                </td>
              </tr>
            ) : (
              filteredStates.map((state) => (
                <tr key={state.stateid} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{state.stateid}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{state.state}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{state.statecode}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{state.country}</td>
                  <td className="px-6 py-4 text-sm text-right">
                    <button
                      onClick={() => openEditDialog(state)}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <Edit className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => openDeleteDialog(state)}
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

      {/* Add/Edit Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingState ? 'Edit State' : 'Add New State'}
              </h2>
              <button 
                onClick={() => setIsDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Country *
                  </label>
                  <select
                    value={formData.countrycode}
                    onChange={(e) =>
                      setFormData({ ...formData, countrycode: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 text-gray-900 bg-white border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    State Code *
                  </label>
                  <input
                    type="text"
                    value={formData.statecode}
                    onChange={(e) =>
                      setFormData({ ...formData, statecode: e.target.value.toUpperCase() })
                    }
                    maxLength={2}
                    placeholder="e.g., CA, TX"
                    required
                    className="w-full px-3 py-2 text-gray-900 bg-white border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">2 character code</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    State Name *
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    placeholder="e.g., California"
                    required
                    className="w-full px-3 py-2 text-gray-900 bg-white border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Saving...' : editingState ? 'Update' : 'Create'}
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
              Are you sure you want to delete the state &quot;{deletingState?.state}&quot;? This action cannot be undone.
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