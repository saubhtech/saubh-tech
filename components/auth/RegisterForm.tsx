// components/auth/RegisterForm.tsx
'use client';

export default function RegisterForm() {
  const whatsappNumber = '919770370187';
  const displayNumber = '+91 97703 70187';

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Create Account via WhatsApp
      </h2>

      {/* Instructions */}
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-5">
          <h3 className="font-semibold text-green-900 mb-3 flex items-center">
            <span className="text-2xl mr-2">📱</span>
            How to Register:
          </h3>
          <ol className="space-y-3 text-sm text-green-800">
            <li className="flex items-start">
              <span className="font-bold mr-2 text-green-600">1.</span>
              <span>Open WhatsApp on your phone</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2 text-green-600">2.</span>
              <span>Send the registration message to our number</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2 text-green-600">3.</span>
              <span>Receive your password instantly!</span>
            </li>
          </ol>
        </div>

        {/* Message to send */}
        <div className="bg-white border-2 border-blue-300 rounded-lg p-4 shadow-sm">
          <p className="text-xs text-gray-600 mb-2 font-medium">📝 Copy this message:</p>
          <div className="bg-gray-50 rounded p-3 mb-3">
            <code className="text-sm font-mono text-gray-900 block">
              REGISTER Your Full Name
            </code>
          </div>
          <p className="text-xs text-gray-500 italic">
            Example: <span className="font-semibold">REGISTER Yash Singh</span>
          </p>
        </div>

        {/* WhatsApp Number */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900 font-medium mb-2">
            📞 Send to WhatsApp Number:
          </p>
          <div className="flex items-center justify-between bg-white rounded p-3 border border-blue-300">
            <span className="text-lg font-bold text-blue-600">
              {displayNumber}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(displayNumber);
                alert('Number copied!');
              }}
              className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Copy
            </button>
          </div>
        </div>

        {/* What happens next */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-900 mb-2 flex items-center">
            <span className="text-xl mr-2">✨</span>
            What happens next?
          </h3>
          <ul className="space-y-2 text-sm text-purple-800">
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>You'll receive your <strong>User ID</strong> and <strong>Password</strong> instantly</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Use them to login on this website</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔹</span>
              <span>Keep your password secure!</span>
            </li>
          </ul>
        </div>

        {/* Quick Link to WhatsApp */}
        
          href={`https://wa.me/${whatsappNumber}?text=REGISTER%20`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-4 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 font-semibold shadow-lg transition-all hover:shadow-xl"
        >
          <span className="text-xl mr-2">💬</span>
          Open WhatsApp to Register
        </a>

        {/* Additional Commands */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <p className="text-xs text-gray-600 font-medium mb-2">
            📋 Other useful commands:
          </p>
          <div className="space-y-2 text-xs text-gray-700">
            <div className="bg-gray-50 rounded p-2">
              <code className="font-mono">LOGIN</code> - Get a new password
            </div>
            <div className="bg-gray-50 rounded p-2">
              <code className="font-mono">HELP</code> - Show all commands
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already registered?{' '}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}