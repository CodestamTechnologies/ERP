'use client';

import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';

interface WebsiteTab {
  id: string;
  url: string;
  title: string;
  favicon?: string;
}

interface WebsiteTabBarProps {
  tabs: WebsiteTab[];
  activeTabId: string | null;
  onSwitchTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onAddNewTab: () => void;
}

const WebsiteTabBar = ({ 
  tabs, 
  activeTabId, 
  onSwitchTab, 
  onCloseTab, 
  onAddNewTab 
}: WebsiteTabBarProps) => {
  return (
    <div className="bg-gray-100 border-b border-gray-200 px-4 py-2">
      <div className="flex items-center space-x-1">
        {tabs.map((tab) => (
          <motion.div
            key={tab.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`group flex items-center px-4 py-2 rounded-t-lg cursor-pointer transition-all relative ${
              activeTabId === tab.id
                ? 'bg-white border-t border-l border-r border-gray-200 -mb-px'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => onSwitchTab(tab.id)}
          >
            <img 
              src={tab.favicon} 
              alt="" 
              className="w-4 h-4 mr-2"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggMTVBNyA3IDAgMSAwIDggMUE3IDcgMCAwIDAgOCAxNVoiIGZpbGw9IiM2MzY2RjEiLz4KPC9zdmc+';
              }}
            />
            <span className="text-sm font-medium text-gray-700 max-w-32 truncate">
              {tab.title}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(tab.id);
              }}
              className="ml-2 p-1 rounded-full hover:bg-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
        
        <button
          onClick={onAddNewTab}
          className="p-2 rounded-lg hover:bg-gray-300 transition-colors"
          title="Add new tab"
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default WebsiteTabBar;