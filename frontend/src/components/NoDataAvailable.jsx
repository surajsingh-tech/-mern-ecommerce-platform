import React from "react";
import { useNavigate } from "react-router-dom";

export default function NoDataAvailable({
  title,
  description,
  buttonText,
  navigateTo,
}) {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col justify-center items-center min-h-[70vh] md:min-h-[80vh] text-center">
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="flex flex-col items-center text-center max-w-md w-full">
          {/* Icon */}
          <div className="bg-gray-100 rounded-full p-6 mb-6 shadow-inner">
            <span className="text-5xl">🛍️</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>

          {/* Description */}
          <p className="text-gray-500 text-sm mb-6">{description}</p>

          {/* Button */}
          <div className="flex gap-3 w-full">
            <button
              onClick={() => navigate(navigateTo)}
              className="flex-1 py-2.5 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-medium"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
