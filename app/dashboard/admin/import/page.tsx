'use client';

import { useState } from 'react';
import { Upload, CheckCircle, XCircle, AlertCircle, Download } from 'lucide-react';

interface ImportStats {
  totalRows: number;
  newStates: number;
  existingStates: number;
  newDistricts: number;
  existingDistricts: number;
  newPostals: number;
  existingPostals: number;
  skippedRows: number;
  errors: string[];
}

export default function BulkImportPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importComplete, setImportComplete] = useState(false);
  const [stats, setStats] = useState<ImportStats | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        showNotification('error', 'Please select a CSV file');
        return;
      }
      setSelectedFile(file);
      setImportComplete(false);
      setStats(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      showNotification('error', 'Please select a CSV file to import');
      return;
    }

    setImporting(true);
    setImportComplete(false);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/admin/import-postal', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
        setImportComplete(true);
        showNotification('success', `Imported ${data.stats.newPostals} new postal codes`);
      } else {
        showNotification('error', data.error || 'Import failed');
      }
    } catch (error) {
      showNotification('error', 'Failed to import data');
    } finally {
      setImporting(false);
    }
  };

  const downloadSampleCSV = () => {
    const sampleData = `officename,pincode,district,statename
Connaught Place,110001,NEW DELHI,DELHI
Andheri East,400069,MUMBAI,MAHARASHTRA
Koramangala,560034,BANGALORE,KARNATAKA`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_postal_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <p className="font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Bulk Import Postal Data</h1>
        <p className="text-gray-300 mt-2 text-base">
          Import states, districts, and postal codes from CSV file
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Import Card */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Upload CSV File</h2>
            <p className="text-sm text-gray-600 mt-1">
              Select a CSV file containing postal data to import
            </p>
          </div>
          <div className="p-6 space-y-4">
            {/* Alert */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900">CSV Format Required</h3>
                  <p className="text-sm text-blue-800 mt-1">
                    Your CSV must have columns: <span className="font-medium">officename, pincode, district, statename</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={downloadSampleCSV}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-gray-700 bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50 transition font-medium"
              >
                <Download className="h-4 w-4" />
                Download Sample CSV
              </button>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-700 mb-1 font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">CSV files only</p>
                </label>
              </div>

              {selectedFile && (
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-900">
                        File selected: {selectedFile.name}
                      </p>
                      <p className="text-xs text-green-700 mt-0.5">
                        Size: {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleImport}
                disabled={!selectedFile || importing}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md font-semibold transition ${
                  !selectedFile || importing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {importing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Start Import
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Import Instructions</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-1.5 flex-shrink-0">
                  <div className="text-blue-700 font-bold text-sm w-6 h-6 flex items-center justify-center">
                    1
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Prepare your CSV file</p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Ensure it has columns: officename, pincode, district, statename
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-1.5 flex-shrink-0">
                  <div className="text-blue-700 font-bold text-sm w-6 h-6 flex items-center justify-center">
                    2
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Upload the file</p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Click the upload area or drag and drop your CSV file
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-1.5 flex-shrink-0">
                  <div className="text-blue-700 font-bold text-sm w-6 h-6 flex items-center justify-center">
                    3
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Start import</p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Click "Start Import" and wait for the process to complete
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-1.5 flex-shrink-0">
                  <div className="text-blue-700 font-bold text-sm w-6 h-6 flex items-center justify-center">
                    4
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Review results</p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Check the import statistics and any errors
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900">Important Notes</h3>
                  <div className="text-sm text-yellow-800 mt-2 space-y-1.5">
                    <p>• Existing postal codes will be skipped</p>
                    <p>• New states and districts will be created automatically</p>
                    <p>• State codes must match standard Indian state codes</p>
                    <p>• Large files may take several minutes to process</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Import Results */}
      {importComplete && stats && (
        <div className="bg-white rounded-lg border shadow-sm mt-6">
          <div className="p-6 border-b">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Import Complete</h2>
            </div>
            <p className="text-sm text-gray-600 mt-1">Import statistics and summary</p>
          </div>
          <div className="p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-700 font-semibold mb-1">Total Rows</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalRows}</p>
              </div>

              <div className="bg-green-50 p-5 rounded-lg border border-green-100">
                <p className="text-sm text-green-700 font-semibold mb-1">New Postals</p>
                <p className="text-3xl font-bold text-green-900">{stats.newPostals}</p>
              </div>

              <div className="bg-yellow-50 p-5 rounded-lg border border-yellow-100">
                <p className="text-sm text-yellow-700 font-semibold mb-1">New States</p>
                <p className="text-3xl font-bold text-yellow-900">{stats.newStates}</p>
              </div>

              <div className="bg-purple-50 p-5 rounded-lg border border-purple-100">
                <p className="text-sm text-purple-700 font-semibold mb-1">New Districts</p>
                <p className="text-3xl font-bold text-purple-900">{stats.newDistricts}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <div className="border-2 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Existing Records</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Postal Codes:</span>
                    <span className="font-semibold text-gray-900">{stats.existingPostals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">States:</span>
                    <span className="font-semibold text-gray-900">{stats.existingStates}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Districts:</span>
                    <span className="font-semibold text-gray-900">{stats.existingDistricts}</span>
                  </div>
                </div>
              </div>

              <div className="border-2 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Skipped & Errors</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Skipped Rows:</span>
                    <span className="font-semibold text-red-600">{stats.skippedRows}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Errors:</span>
                    <span className="font-semibold text-red-600">{stats.errors.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {stats.errors.length > 0 && (
              <div className="mt-4">
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-red-900 mb-2">
                        Errors Encountered ({stats.errors.length})
                      </h3>
                      <div className="mt-2 max-h-40 overflow-y-auto text-sm text-red-800 space-y-1">
                        {stats.errors.slice(0, 10).map((error, idx) => (
                          <div key={idx} className="pl-2">
                            • {error}
                          </div>
                        ))}
                        {stats.errors.length > 10 && (
                          <div className="text-sm italic mt-2 text-red-700">
                            ... and {stats.errors.length - 10} more errors
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}