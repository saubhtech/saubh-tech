// components/auth/LoginForm.tsx
'use client';

export default function LoginForm() {
  const whatsappNumber = '919770370187';
  const displayNumber = '+91 97703 70187';

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Get Password via WhatsApp
      </h2>

      {/* Instructions */}
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
            <span className="text-2xl mr-2">🔐</span>
            Forgot Password?
          </h3>
          <p className="text-sm text-blue-800">
            Send a message to get a new password instantly!
          </p>
        </div>

        {/* Message to send */}
        <div className="bg-white border-2 border-green-300 rounded-lg p-4 shadow-sm">
          <p className="text-xs text-gray-600 mb-2 font-medium">📝 Send this message:</p>
          <div className="bg-gray-50 rounded p-3 mb-3">
            <code className="text-lg font-mono text-gray-900 block font-bold text-center">
              LOGIN
            </code>
          </div>
          <p className="text-xs text-gray-500 text-center">
            That's it! Just type <span className="font-semibold">LOGIN</span>
          </p>
        </div>

        {/* WhatsApp Number */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-900 font-medium mb-2">
            📞 Send to WhatsApp Number:
          </p>
          <div className="flex items-center justify-between bg-white rounded p-3 border border-green-300">
            <span className="text-lg font-bold text-green-600">
              {displayNumber}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(displayNumber);
                alert('Number copied!');
              }}
              className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Copy
            </button>
          </div>
        </div>

        {/* What happens next */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2 flex items-center">
            <span className="text-xl mr-2">⚡</span>
            What happens next?
          </h3>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>A <strong>new password</strong> will be generated</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>You'll receive it on WhatsApp instantly</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Use it to login below!</span>
            </li>
          </ul>
        </div>

        {/* Quick Link to WhatsApp */}
        
          href={`https://wa.me/${whatsappNumber}?text=LOGIN`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-4 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 font-semibold shadow-lg transition-all hover:shadow-xl"
        >
          <span className="text-xl mr-2">💬</span>
          Open WhatsApp to Get Password
        </a>

        {/* Login Form */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="font-semibold text-gray-900 mb-4 text-center">
            Login with Password
          </h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                WhatsApp Number
              </label>
              <input
                type="tel"
                placeholder="+919876543210"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password from WhatsApp"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Login
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline font-medium">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}