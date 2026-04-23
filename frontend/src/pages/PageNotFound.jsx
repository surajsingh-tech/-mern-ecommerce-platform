import React from "react";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black px-4 overflow-hidden">
      {/* Background gradient blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-pink-600 opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-600 opacity-20 blur-3xl rounded-full"></div>

      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(236,72,153,0.15)] rounded-3xl p-10 md:p-14 text-center max-w-lg w-full">
        {/* 404 */}
        <h1 className="text-7xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-2xl md:text-3xl font-bold text-white tracking-wide">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-3 text-gray-400 text-sm md:text-base leading-relaxed">
          Sorry, the page you’re looking for doesn’t exist or may have been
          moved. Please check the URL or return to the homepage.
        </p>

        {/* Button */}
        <Link
          to="/"
          className="mt-6 inline-block px-7 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-medium shadow-lg hover:scale-105 hover:shadow-pink-500/30 transition-all duration-300"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
