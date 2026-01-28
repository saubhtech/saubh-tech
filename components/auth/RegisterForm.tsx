// components/auth/RegisterForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fname: '',
    whatsapp: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Step 1: Send "REGISTER Name" message to user's WhatsApp
      const registerMessage = `REGISTER ${formData.fname}`;
      
      const messageResponse = await fetch('/api/auth/send-register-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          whatsapp: formData.whatsapp,
          message: registerMessage
        })
      });

      if (!messageResponse.ok) {
        const errorData = await messageResponse.json();
        setError(errorData.error || 'Failed to send registration message');
        setLoading(false);
        return;
      }

      // Step 2: Show success - webhook will handle the rest
      setSuccess('✅ Registration message sent to your WhatsApp! Please check your phone and reply to complete registration.');
      setFormData({ fname: '', whatsapp: '' });
      
      setTimeout(() => {
        router.push('/login');
      }, 5000);

    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Create Account
      </h2>

      {/* WhatsApp Registration Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">📱 How it works:</h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Enter your name and WhatsApp number</li>
          <li>We'll send you a registration message</li>
          <li>Reply to that message to complete registration</li>
          <li>Get your password instantly!</li>
        </ol>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            value={formData.fname}
            onChange={(e) => setFormData({...formData, fname: e.target.value})}
            placeholder="Yash Singh"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            This will be sent as: REGISTER {formData.fname || 'Your Name'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            WhatsApp Number
          </label>
          <input
            type="tel"
            value={formData.whatsapp}
            onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
            placeholder="+919876543210"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Include country code (e.g., +91 for India)
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {loading ? 'Sending Message...' : 'Register via WhatsApp'}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Login here
          </a>
        </p>
      </form>

      {/* Alternative Direct WhatsApp Method */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 text-center mb-3">
          Or register directly via WhatsApp:
        </p>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-600 mb-2">Send this message:</p>
          <code className="text-sm bg-white px-3 py-2 rounded border border-gray-300 inline-block">
            REGISTER Your Full Name
          </code>
          <p className="text-xs text-gray-500 mt-2">to our WhatsApp number</p>
        </div>
      </div>
    </div>
  );
}