'use client'
import React from 'react';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative inline-block">
            <h1 className="text-9xl font-bold text-orange-500 opacity-20">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full p-8 shadow-2xl">
                <Search className="w-16 h-16 text-orange-500" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          The page you are looking for does nt exist or has been moved. Let is get you back on track!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-lg shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-orange-200">
          <p className="text-sm text-gray-500 mb-4">Popular pages:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="#" className="text-sm text-orange-600 hover:text-orange-700 hover:underline transition-colors">
              Main
            </a>
            <span className="text-gray-300">•</span>
            <a href="#" className="text-sm text-orange-600 hover:text-orange-700 hover:underline transition-colors">
              Restaurants
            </a>
            <span className="text-gray-300">•</span>
            <a href="#" className="text-sm text-orange-600 hover:text-orange-700 hover:underline transition-colors">
              Stock
            </a>
            <span className="text-gray-300">•</span>
            <a href="#" className="text-sm text-orange-600 hover:text-orange-700 hover:underline transition-colors">
              About
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;