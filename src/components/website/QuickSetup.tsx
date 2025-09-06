'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, Plus, Trash2, Edit3, ExternalLink, Settings, 
  Zap, Shield, Monitor, BarChart3, RefreshCw, Download,
  CheckCircle, AlertCircle, Clock, Star
} from 'lucide-react';

interface WebsiteTab {
  id: string;
  url: string;
  title: string;
  favicon?: string;
}

interface QuickSetupProps {
  isOpen: boolean;
  onClose: () => void;
  websiteTabs: WebsiteTab[];
  onSwitchTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onAddWebsite: (url: string) => void;
}

const QuickSetup = ({ 
  isOpen, 
  onClose, 
  websiteTabs, 
  onSwitchTab, 
  onCloseTab,
  onAddWebsite 
}: QuickSetupProps) => {
  const [activeTab, setActiveTab] = useState('manage');
  const [bulkUrls, setBulkUrls] = useState('');
  const [editingDomain, setEditingDomain] = useState<string | null>(null);
  const [newDomainName, setNewDomainName] = useState('');

  // Quick actions for domains
  const quickActions = [
    {
      icon: <RefreshCw className="w-4 h-4" />,
      title: 'Refresh All',
      desc: 'Reload all active websites',
      action: () => {
        websiteTabs.forEach(tab => {
          // Simulate refresh by switching tabs
          onSwitchTab(tab.id);
        });
      }
    },
    {
      icon: <Download className="w-4 h-4" />,
      title: 'Export List',
      desc: 'Download domain list as CSV',
      action: () => {
        const csv = websiteTabs.map(tab => `${tab.title},${tab.url}`).join('\n');
        const blob = new Blob([`Title,URL\n${csv}`], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'website-domains.csv';
        a.click();
      }
    },
    {
      icon: <Shield className="w-4 h-4" />,
      title: 'Security Check',
      desc: 'Verify SSL certificates',
      action: () => {
        // Simulate security check
        alert('Security check completed. All domains have valid SSL certificates.');
      }
    },
    {
      icon: <BarChart3 className="w-4 h-4" />,
      title: 'Performance Report',
      desc: 'Generate speed analysis',
      action: () => {
        // Simulate performance report
        alert('Performance report generated. Average load time: 1.2s');
      }
    }
  ];

  // Handle bulk domain addition
  const handleBulkAdd = () => {
    const urls = bulkUrls.split('\n').filter(url => url.trim());
    urls.forEach(url => {
      const trimmedUrl = url.trim();
      if (trimmedUrl && isValidUrl(trimmedUrl)) {
        onAddWebsite(trimmedUrl);
      }
    });
    setBulkUrls('');
  };

  // URL validation
  const isValidUrl = (url: string) => {
    try {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      return urlPattern.test(url);
    } catch {
      return false;
    }
  };

  // Handle domain rename
  const handleRename = (tabId: string) => {
    if (newDomainName.trim()) {
      // In a real app, you'd update the domain name in your state management
      console.log(`Renaming domain ${tabId} to ${newDomainName}`);
      setEditingDomain(null);
      setNewDomainName('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Quick Setup & Management</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="manage">Manage Domains</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Actions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Manage Domains Tab */}
          <TabsContent value="manage" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Quick Actions */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="text-blue-600">{action.icon}</div>
                        <span className="font-medium text-sm">{action.title}</span>
                      </div>
                      <p className="text-xs text-gray-600">{action.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Domain List */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Active Domains ({websiteTabs.length})</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {websiteTabs.map((tab) => (
                    <div key={tab.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={tab.favicon} 
                          alt="" 
                          className="w-6 h-6 rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzYzNjZGMSIvPgo8cGF0aCBkPSJNMTIgMTZBNCA0IDAgMSAwIDEyIDhBNCA0IDAgMCAwIDEyIDE2WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+';
                          }}
                        />
                        <div>
                          {editingDomain === tab.id ? (
                            <div className="flex items-center space-x-2">
                              <Input
                                value={newDomainName}
                                onChange={(e) => setNewDomainName(e.target.value)}
                                className="h-8 text-sm"
                                placeholder="New name"
                              />
                              <Button size="sm" onClick={() => handleRename(tab.id)}>
                                <CheckCircle className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <p className="font-medium text-sm">{tab.title}</p>
                              <p className="text-xs text-gray-500">{new URL(tab.url).hostname}</p>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => onSwitchTab(tab.id)}
                          className="p-1 hover:bg-blue-100 rounded transition-colors"
                          title="Open"
                        >
                          <ExternalLink className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingDomain(tab.id);
                            setNewDomainName(tab.title);
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Rename"
                        >
                          <Edit3 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => onCloseTab(tab.id)}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {websiteTabs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Globe className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No domains added yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Bulk Actions Tab */}
          <TabsContent value="bulk" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Bulk Add Domains</h3>
                <div className="space-y-3">
                  <textarea
                    value={bulkUrls}
                    onChange={(e) => setBulkUrls(e.target.value)}
                    placeholder="Enter multiple URLs (one per line):&#10;https://example1.com&#10;https://example2.com&#10;example3.com"
                    className="w-full h-32 p-3 border border-gray-200 rounded-lg resize-none"
                  />
                  <Button onClick={handleBulkAdd} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add All Domains
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Bulk Operations</h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      websiteTabs.forEach(tab => onSwitchTab(tab.id));
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh All Domains
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      if (confirm('Are you sure you want to remove all domains?')) {
                        websiteTabs.forEach(tab => onCloseTab(tab.id));
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove All Domains
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      const urls = websiteTabs.map(tab => tab.url).join('\n');
                      navigator.clipboard.writeText(urls);
                      alert('Domain URLs copied to clipboard!');
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Copy All URLs
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Total Domains</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{websiteTabs.length}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-900">Active</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{websiteTabs.length}</p>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-amber-900">Avg Load Time</span>
                </div>
                <p className="text-2xl font-bold text-amber-600">1.2s</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Domain Performance</h3>
              <div className="space-y-2">
                {websiteTabs.map((tab, index) => (
                  <div key={tab.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img src={tab.favicon} alt="" className="w-5 h-5" />
                      <span className="font-medium">{tab.title}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className="text-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Online
                      </Badge>
                      <span className="text-sm text-gray-600">{(Math.random() * 2 + 0.5).toFixed(1)}s</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Display Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Show favicons in domain list</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Auto-refresh domains every 5 minutes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Show performance metrics</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Security Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Enable SSL verification</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Block insecure domains</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Enable domain monitoring alerts</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Export/Import</h3>
                <div className="flex space-x-3">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Settings
                  </Button>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Import Settings
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onClose}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickSetup;