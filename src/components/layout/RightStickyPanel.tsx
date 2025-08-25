'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SettingsIcon, ThemeIcon } from '../Icons';

interface RightStickyPanelProps {
  onThemeToggle?: () => void;
}

const RightStickyPanel = ({ onThemeToggle }: RightStickyPanelProps) => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    if (onThemeToggle) {
      onThemeToggle();
    }
  };

  const handleSettingsClick = () => {
    router.push('/settings');
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="flex flex-col items-end space-y-2">
        {/* Expandable Icons Container */}
        <div className={`flex flex-col space-y-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-1.5 transition-all duration-300 transform ${
          isExpanded 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
        }`}>
          {/* Settings Icon */}
          <button
            onClick={handleSettingsClick}
            className="p-2 rounded-md bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105 group relative"
            title="Settings"
          >
            <SettingsIcon size={16} />
            <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Settings
            </div>
          </button>

          {/* Theme Toggle Icon */}
          <button
            onClick={handleThemeToggle}
            className={`p-2 rounded-md transition-all duration-200 hover:scale-105 group relative ${
              isDarkMode 
                ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                : 'bg-yellow-50 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600'
            }`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <ThemeIcon size={16} />
            <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </div>
          </button>
        </div>

        {/* Toggle Arrow Button */}
        <button
          onClick={toggleExpanded}
          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-105 group"
          title={isExpanded ? 'Hide Options' : 'Show Options'}
        >
          <svg 
            className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
          <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            {isExpanded ? 'Hide' : 'Options'}
          </div>
        </button>
      </div>
    </div>
  );
};

export default RightStickyPanel;