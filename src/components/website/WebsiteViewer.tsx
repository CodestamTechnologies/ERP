'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { WebsiteIcon } from '@/components/Icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, ExternalLink, X, ChevronLeft, Home, Rocket, 
  Plus, Settings, MoreHorizontal
} from 'lucide-react';
import { useState } from 'react';

interface WebsiteTab {
  id: string;
  url: string;
  title: string;
  favicon?: string;
}

interface WebsiteViewerProps {
  websiteTabs: WebsiteTab[];
  activeTabId: string | null;
  addedWebsite: string;
  getActiveTab: () => WebsiteTab | undefined;
  handleSwitchTab: (tabId: string) => void;
  handleCloseTab: (tabId: string) => void;
  handleCloseFullScreen: () => void;
  handleCreateWebsite: () => void;
}

const WebsiteViewer = ({
  websiteTabs,
  activeTabId,
  addedWebsite,
  getActiveTab,
  handleSwitchTab,
  handleCloseTab,
  handleCloseFullScreen,
  handleCreateWebsite,
}: WebsiteViewerProps) => {
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [showAllTabs, setShowAllTabs] = useState(false);

  // Show only first 4 tabs, rest in dropdown
  const visibleTabs = websiteTabs.slice(0, 4);
  const hiddenTabs = websiteTabs.slice(4);

  const quickActions = [
    {
      icon: <Globe className="w-4 h-4" />,
      title: 'Add Domain',
      desc: 'Connect new website',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100',
      onClick: () => {
        setShowRightPanel(false);
        handleCloseFullScreen();
      }
    },
    {
      icon: <Rocket className="w-4 h-4" />,
      title: 'Create Website',
      desc: 'Build from scratch',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      hoverColor: 'hover:bg-indigo-100',
      onClick: () => {
        setShowRightPanel(false);
        handleCreateWebsite();
      }
    },
    {
      icon: <Home className="w-4 h-4" />,
      title: 'Dashboard',
      desc: 'Go to main page',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      hoverColor: 'hover:bg-emerald-100',
      onClick: () => {
        setShowRightPanel(false);
        handleCloseFullScreen();
      }
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1 
      }
    }
  };

  const tabVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.15 }
    }
  };

  const panelVariants: Variants = {
    hidden: { 
      opacity: 0, 
      x: 100, 
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1
    },
    exit: { 
      opacity: 0, 
      x: 100, 
      scale: 0.95
    }
  };

  const renderTab = (tab: WebsiteTab, index: number) => (
    <motion.div
      key={tab.id}
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className={`group flex items-center px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-200 relative min-w-0 ${
        activeTabId === tab.id
          ? 'bg-white shadow-md border border-gray-200/50 scale-105'
          : 'bg-gray-100/50 hover:bg-gray-200/50 hover:scale-102'
      }`}
      onClick={() => handleSwitchTab(tab.id)}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.img 
        src={tab.favicon} 
        alt="" 
        className="w-4 h-4 mr-2 rounded-sm"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.05 }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiByeD0iNCIgZmlsbD0iIzYzNjZGMSIvPgo8cGF0aCBkPSJNOCAxMkE0IDQgMCAxIDAgOCA0QTQgNCAwIDAgMCA4IDEyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+';
        }}
      />
      <span className="text-sm font-medium text-gray-700 max-w-32 truncate">
        {tab.title}
      </span>
      
      {/* Active indicator */}
      {activeTabId === tab.id && (
        <motion.div
          className="absolute -bottom-0.5 left-1/2 w-8 h-0.5 bg-blue-500 rounded-full"
          layoutId="activeTab"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          style={{ x: '-50%' }}
        />
      )}
      
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          handleCloseTab(tab.id);
        }}
        className="ml-2 p-1 rounded-full hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-all duration-200"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <X className="w-3 h-3 text-red-500" />
      </motion.button>
    </motion.div>
  );

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
    >
      {/* Enhanced Tab Bar */}
      <motion.div 
        className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-4 py-2 shadow-sm"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 flex-1">
            <AnimatePresence mode="popLayout">
              {visibleTabs.map((tab, index) => renderTab(tab, index))}
            </AnimatePresence>
            
            {/* More tabs dropdown */}
            {hiddenTabs.length > 0 && (
              <div className="relative">
                <motion.button
                  onClick={() => setShowAllTabs(!showAllTabs)}
                  className="p-2.5 rounded-xl hover:bg-gray-200/50 transition-all duration-200 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-600" />
                </motion.button>
                
                <AnimatePresence>
                  {showAllTabs && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200/50 p-2 min-w-48 z-50"
                    >
                      {hiddenTabs.map((tab, index) => (
                        <motion.div
                          key={tab.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            activeTabId === tab.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => {
                            handleSwitchTab(tab.id);
                            setShowAllTabs(false);
                          }}
                        >
                          <img 
                            src={tab.favicon} 
                            alt="" 
                            className="w-4 h-4 mr-2 rounded-sm"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiByeD0iNCIgZmlsbD0iIzYzNjZGMSIvPgo8cGF0aCBkPSJNOCAxMkE0IDQgMCAxIDAgOCA0QTQgNCAwIDAgMCA4IDEyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+';
                            }}
                          />
                          <span className="text-sm font-medium text-gray-700 truncate flex-1">
                            {tab.title}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCloseTab(tab.id);
                            }}
                            className="ml-2 p-1 rounded-full hover:bg-red-100 transition-all duration-200"
                          >
                            <X className="w-3 h-3 text-red-500" />
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            {/* Add New Tab Button - Now beside tabs like a browser */}
            <motion.button
              onClick={handleCloseFullScreen}
              className="p-2.5 rounded-xl hover:bg-gray-200/50 transition-all duration-200 group ml-1"
              title="Add new tab"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Compact Top Bar */}
      <motion.div 
        className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 px-4 py-2 flex items-center justify-between flex-shrink-0"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <WebsiteIcon size={16} className="text-blue-600" />
          </motion.div>
          <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
            {getActiveTab()?.title || 'Website Viewer'}
          </span>
          <Badge variant="secondary" className="text-xs">
            <motion.div 
              className="w-2 h-2 bg-green-500 rounded-full mr-1"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Secure
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(addedWebsite, '_blank')}
            className="h-8 w-8 p-0 hover:bg-blue-50 rounded-xl"
          >
            <ExternalLink className="w-4 h-4 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCloseFullScreen}
            className="h-8 w-8 p-0 hover:bg-red-50 rounded-xl"
          >
            <X className="w-4 h-4 text-gray-600" />
          </Button>
        </div>
      </motion.div>

      {/* Website Content */}
      <motion.div 
        className="flex-1 bg-gray-50 relative"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="absolute inset-2 bg-white rounded-xl shadow-sm overflow-hidden">
          <iframe
            src={addedWebsite}
            className="w-full h-full border-0 rounded-xl"
            title="Website Full View"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          />
        </div>
      </motion.div>

      {/* Enhanced Right Side Panel */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50">
        <div className="flex items-center">
          {/* Panel Content */}
          <AnimatePresence mode="wait">
            {showRightPanel && (
              <motion.div
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
                className="bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 mr-3 overflow-hidden"
              >
                <div className="w-64">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-100/50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 text-sm flex items-center">
                        <motion.div 
                          className="w-2 h-2 bg-blue-500 rounded-full mr-2"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        Quick Actions
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {quickActions.length}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="p-3 space-y-2">
                    {quickActions.map((action, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Button
                          variant="ghost"
                          onClick={action.onClick}
                          className={`w-full justify-start h-auto p-3 ${action.hoverColor} transition-all duration-200 group hover:shadow-sm border border-transparent hover:border-gray-200/50 rounded-xl`}
                        >
                          <motion.div 
                            className={`p-2 ${action.bgColor} rounded-lg mr-3 group-hover:scale-110 transition-transform duration-200`}
                            whileHover={{ rotate: 5 }}
                          >
                            <div className={action.color}>{action.icon}</div>
                          </motion.div>
                          <div className="flex-1 text-left">
                            <div className="font-medium text-gray-900 text-sm">{action.title}</div>
                            <div className="text-xs text-gray-500">{action.desc}</div>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Separator */}
                  <div className="mx-3 h-px bg-gray-200 my-2" />
                  
                  {/* Additional Actions */}
                  <div className="p-3 space-y-2">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-auto p-3 hover:bg-gray-50 transition-all duration-200 rounded-xl"
                      >
                        <div className="p-2 bg-gray-50 rounded-lg mr-3">
                          <Settings className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-gray-900 text-sm">Settings</div>
                          <div className="text-xs text-gray-500">Configure preferences</div>
                        </div>
                      </Button>
                    </motion.div>
                  </div>
                  
                  {/* Footer */}
                  <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100/50">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{websiteTabs.length} tabs active</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                        <span>Online</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Toggle Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => setShowRightPanel(!showRightPanel)}
              variant="outline"
              size="sm"
              className="h-12 w-12 p-0 rounded-xl bg-white/95 backdrop-blur-xl shadow-lg border-gray-200/50 hover:shadow-xl transition-all duration-200"
            >
              <motion.div
                animate={{ rotate: showRightPanel ? 180 : 0 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default WebsiteViewer;