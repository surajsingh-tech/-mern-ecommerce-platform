import React from "react";

export default function NoDataAvailable() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="flex flex-col items-center text-center max-w-md w-full">
        {/* Icon / Illustration */}
        <div className="bg-gray-100 rounded-full p-6 mb-6 shadow-inner">
          <span className="text-5xl">🛍️</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          No products found
        </h2>

        {/* Description */}
        <p className="text-gray-500 text-sm mb-6">
          We couldn’t find any products matching your criteria. Try adjusting
          your filters or search again.
        </p>

        {/* Actions */}
        <div className="flex gap-3 w-full">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 py-2.5 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
