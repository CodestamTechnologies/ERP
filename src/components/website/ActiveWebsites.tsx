'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor, ExternalLink, X } from 'lucide-react';

interface WebsiteTab {
  id: string;
  url: string;
  title: string;
  favicon?: string;
}

interface ActiveWebsitesProps {
  websiteTabs: WebsiteTab[];
  onSwitchTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
}

const ActiveWebsites = ({ websiteTabs, onSwitchTab, onCloseTab }: ActiveWebsitesProps) => {
  if (websiteTabs.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Monitor className="w-4 h-4 mr-2" />
            Active Websites ({websiteTabs.length})
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            Click to open
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {websiteTabs.map((tab) => (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer bg-white"
              onClick={() => onSwitchTab(tab.id)}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="relative">
                  <img 
                    src={tab.favicon} 
                    alt="" 
                    className="w-8 h-8 rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iIzYzNjZGMSIvPgo8cGF0aCBkPSJNMTYgMjJBNiA2IDAgMSAwIDE2IDEwQTYgNiAwIDAgMCAxNiAyMloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg==';
                    }}
                  />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                </div>
                <div className="text-center min-h-[2.5rem] flex flex-col justify-center">
                  <h3 className="font-medium text-gray-900 text-xs leading-tight truncate max-w-full">
                    {tab.title}
                  </h3>
                  <p className="text-xs text-gray-500 truncate max-w-full mt-0.5">
                    {new URL(tab.url).hostname}
                  </p>
                </div>
              </div>
              
              {/* Close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="w-3 h-3 text-white" />
              </button>
              
              {/* External link button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(tab.url, '_blank');
                }}
                className="absolute bottom-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600"
              >
                <ExternalLink className="w-2.5 h-2.5 text-white" />
              </button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveWebsites;