import { Lock } from 'lucide-react';

export function LockedPageMessage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 max-w-md w-full text-center space-y-6">
        {/* Lock Icon */}
        <div className="flex justify-center">
          <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-4">
            <Lock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Page Unavailable
        </h1>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
          This page is currently unavailable. Please contact our support team for assistance.
        </p>

        {/* Support Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            <span className="font-semibold">📧 Email:</span> support@example.com
          </p>
          <p className="text-sm text-blue-900 dark:text-blue-200 mt-2">
            <span className="font-semibold">📞 Phone:</span> +1 (555) 123-4567
          </p>
        </div>

        {/* Back Button */}
        <button
          onClick={() => window.location.href = '/'}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
