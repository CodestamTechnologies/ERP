'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { WebsiteIcon } from '@/components/Icons';
import { 
  Globe, Plus, ExternalLink, Monitor, Eye, CheckCircle, AlertCircle, Clock,
  Palette, Code, Layers, Search, Smartphone, BarChart3, Star, ArrowRight, Target, Rocket,
  Shield, Zap, TrendingUp, Users, Settings, Link, Upload, Download
} from 'lucide-react';
import { useWebsite } from '@/hooks/useWebsite';
import { useState } from 'react';
import ActiveWebsites from '@/components/website/ActiveWebsites';
import WebsiteViewer from '@/components/website/WebsiteViewer';
import WebsiteFeatures from '@/components/website/WebsiteFeatures';
import QuickSetup from '@/components/website/QuickSetup';
import WebsiteBuilder from '@/components/website/WebsiteBuilder';

// Define interfaces for type safety
interface DomainAnalysis {
  domain: string;
  status: 'online' | 'offline' | 'error';
  loadTime: string;
  ssl: boolean;
  responsive: boolean;
  seoScore: number;
  technologies: string[];
}

interface WebsiteData {
  name: string;
  domain: string;
  template?: string;
  settings?: Record<string, unknown>;
}

const WebsitePage = () => {
  const {
    domainUrl,
    isValidUrl,
    showPreview,
    isLoading,
    showFullScreen,
    addedWebsite,
    websiteTabs,
    activeTabId,
    recentDomains,
    handleUrlChange,
    handleAddDomain,
    formatUrl,
    handleCreateWebsite,
    handleAddWebsite,
    handleCloseFullScreen,
    handleSwitchTab,
    handleCloseTab,
    getActiveTab,
    addToRecentDomains,
  } = useWebsite();

  const [activeTab, setActiveTab] = useState('overview');
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [showQuickSetup, setShowQuickSetup] = useState(false);
  const [showWebsiteBuilder, setShowWebsiteBuilder] = useState(false);
  const [domainAnalysis, setDomainAnalysis] = useState<DomainAnalysis | null>(null);

  // Template data
  const templates = [
    { name: 'Business Pro', category: 'Corporate', rating: 4.9 },
    { name: 'E-commerce Plus', category: 'Online Store', rating: 4.8 },
    { name: 'Portfolio Modern', category: 'Creative', rating: 4.7 },
  ];

  // Builder features data
  const builderFeatures = [
    { icon: <Palette className="w-5 h-5" />, text: 'Visual Design System', desc: 'Drag & drop with smart components' },
    { icon: <Code className="w-5 h-5" />, text: 'Custom Code Integration', desc: 'Add HTML, CSS, and JavaScript' },
    { icon: <Layers className="w-5 h-5" />, text: 'Advanced Layouts', desc: 'Grid, flexbox, and responsive design' },
    { icon: <Search className="w-5 h-5" />, text: 'SEO Optimization', desc: 'Built-in SEO tools and analytics' },
    { icon: <Smartphone className="w-5 h-5" />, text: 'Mobile-First Design', desc: 'Optimized for all screen sizes' },
    { icon: <BarChart3 className="w-5 h-5" />, text: 'Analytics Dashboard', desc: 'Real-time performance insights' },
  ];

  // Domain connection benefits
  const domainBenefits = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'SSL Security',
      desc: 'Automatic HTTPS encryption',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Fast Loading',
      desc: 'CDN-powered performance',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Analytics',
      desc: 'Real-time visitor insights',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Team Access',
      desc: 'Collaborative management',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  // Fallback domains when no recent domains exist
  const fallbackDomains = [
    'github.com',
    'dribbble.com',
    'behance.net',
    'medium.com',
    'dev.to'
  ];

  // Handle bulk website addition from QuickSetup
  const handleBulkAddWebsite = (url: string) => {
    const formattedUrl = formatUrl(url);
    const newTab = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      url: formattedUrl,
      title: new URL(formattedUrl).hostname,
      favicon: `${new URL(formattedUrl).origin}/favicon.ico`
    };
    
    console.log('Adding website:', newTab);
  };

  // Handle website creation from builder
  const handleWebsiteCreation = (websiteData: WebsiteData) => {
    console.log('Creating website with data:', websiteData);
    
    // Simulate adding the created website to tabs
    const newWebsiteUrl = `https://${websiteData.domain}.codestam.com`;
    const newTab = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      url: newWebsiteUrl,
      title: websiteData.name,
      favicon: `${newWebsiteUrl}/favicon.ico`
    };
    
    // In a real implementation, this would integrate with the useWebsite hook
    console.log('New website tab:', newTab);
  };

  // Enhanced domain analysis
  const analyzeDomain = async (url: string) => {
    if (!isValidUrl) return;
    
    // Simulate domain analysis
    setDomainAnalysis({
      domain: new URL(formatUrl(url)).hostname,
      status: 'online',
      loadTime: (Math.random() * 2 + 0.5).toFixed(1) + 's',
      ssl: true,
      responsive: true,
      seoScore: Math.floor(Math.random() * 30 + 70),
      technologies: ['React', 'Next.js', 'Tailwind CSS']
    });
  };

  // Show full screen viewer if active
  if (showFullScreen && addedWebsite) {
    return (
      <WebsiteViewer
        websiteTabs={websiteTabs}
        activeTabId={activeTabId}
        addedWebsite={addedWebsite}
        getActiveTab={getActiveTab}
        handleSwitchTab={handleSwitchTab}
        handleCloseTab={handleCloseTab}
        handleCloseFullScreen={handleCloseFullScreen}
        handleCreateWebsite={() => setShowWebsiteBuilder(true)}
      />
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <WebsiteIcon size={28} className="mr-3" />
            Website Management
          </h1>
          <p className="text-gray-600 mt-1">
            Seamlessly integrate, preview, and manage your web presence
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="flex-1 sm:flex-none">
            Domain Analytics
          </Button>
          <Button 
            variant="default" 
            className="flex-1 sm:flex-none"
            onClick={() => setShowQuickSetup(true)}
          >
            Quick Setup
          </Button>
          <Button className="flex-1 sm:flex-none">
            View All Sites
          </Button>
        </div>
      </div>

      {/* Quick Setup Modal */}
      <QuickSetup
        isOpen={showQuickSetup}
        onClose={() => setShowQuickSetup(false)}
        websiteTabs={websiteTabs}
        onSwitchTab={handleSwitchTab}
        onCloseTab={handleCloseTab}
        onAddWebsite={handleBulkAddWebsite}
      />

      {/* Website Builder Modal */}
      <WebsiteBuilder
        isOpen={showWebsiteBuilder}
        onClose={() => setShowWebsiteBuilder(false)}
        onCreateWebsite={handleWebsiteCreation}
      />

      {/* Active Websites */}
      <ActiveWebsites 
        websiteTabs={websiteTabs}
        onSwitchTab={handleSwitchTab}
        onCloseTab={handleCloseTab}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Build Website Card - Now First */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full border-0 shadow-lg bg-white">
            <CardHeader className="pb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-indigo-50 rounded-xl">
                  <Rocket className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-gray-900">Build Website</CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    Create professional websites with our advanced builder
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Quick Start Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer"
                  onClick={() => setShowWebsiteBuilder(true)}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Rocket className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Start from Scratch</h3>
                    <p className="text-sm text-gray-600">Use our guided builder</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all cursor-pointer"
                  onClick={() => window.open('https://store.codestam.com/', '_blank')}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Palette className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Use Template</h3>
                    <p className="text-sm text-gray-600">Choose from 50+ designs</p>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Codestam Store
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Features Preview */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                <div className="flex items-center space-x-3 mb-4">
                  <Target className="w-6 h-6 text-indigo-600" />
                  <h4 className="font-semibold text-indigo-900">What You&apos;ll Get</h4>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm text-indigo-800">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-indigo-600" />
                    <span>Professional templates</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-indigo-600" />
                    <span>Drag & drop editor</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-indigo-600" />
                    <span>Mobile responsive</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-indigo-600" />
                    <span>SEO optimized</span>
                  </div>
                </div>
              </div>

              {/* Popular Templates */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Popular Templates</h4>
                <div className="space-y-2">
                  {templates.slice(0, 3).map((template, index) => (
                    <motion.div
                      key={template.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => window.open('https://store.codestam.com/', '_blank')}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg"></div>
                        <div>
                          <h5 className="font-medium text-gray-900 text-sm">{template.name}</h5>
                          <p className="text-xs text-gray-600">{template.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs font-medium">{template.rating}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => setShowWebsiteBuilder(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-base font-medium"
                size="lg"
              >
                <div className="flex items-center">
                  <Rocket className="w-5 h-5 mr-2" />
                  Launch Builder
                </div>
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Professional website builder with advanced features
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Connect Domain Card - Now Second */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full border-0 shadow-lg bg-white overflow-hidden">
            <CardHeader className="pb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Globe className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-gray-900">Connect Domain</CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    Integrate and monitor any website with advanced analytics
                  </CardDescription>
                </div>
              </div>
              
              {/* Benefits Grid */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {domainBenefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`p-3 ${benefit.bgColor} rounded-lg border border-gray-100`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={benefit.color}>{benefit.icon}</div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{benefit.title}</h4>
                        <p className="text-xs text-gray-600">{benefit.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* URL Input Section */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Website URL
                    </label>
                    <Badge variant="outline" className="text-xs">
                      <Link className="w-3 h-3 mr-1" />
                      Auto-detect
                    </Badge>
                  </div>
                  
                  <div className="relative">
                    <Input
                      type="url"
                      placeholder="https://example.com or example.com"
                      value={domainUrl}
                      onChange={(e) => {
                        handleUrlChange(e.target.value);
                        if (e.target.value && isValidUrl) {
                          analyzeDomain(e.target.value);
                        }
                      }}
                      className={`pl-12 pr-4 py-3 text-base border-2 transition-all duration-200 ${
                        isValidUrl && domainUrl 
                          ? 'border-emerald-300 bg-emerald-50 focus:border-emerald-500' 
                          : domainUrl && !isValidUrl 
                          ? 'border-red-300 bg-red-50 focus:border-red-500' 
                          : 'border-gray-200 focus:border-blue-500'
                      }`}
                    />
                    <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    {domainUrl && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        {isValidUrl ? (
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Quick Suggestions */}
                  {!domainUrl && (
                    <div className="mt-3">
                      {recentDomains.length > 0 ? (
                        <>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-gray-500">Recent domains:</p>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {recentDomains.length}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {recentDomains.map((domain) => (
                              <motion.button
                                key={domain}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleUrlChange(domain)}
                                className="px-3 py-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors border border-blue-200 flex items-center space-x-1"
                              >
                                <Globe className="w-3 h-3" />
                                <span>{domain}</span>
                              </motion.button>
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-xs text-gray-500 mb-2">Popular domains:</p>
                          <div className="flex flex-wrap gap-2">
                            {fallbackDomains.map((domain) => (
                              <button
                                key={domain}
                                onClick={() => handleUrlChange(domain)}
                                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                              >
                                {domain}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  
                  {/* Validation Message */}
                  <AnimatePresence>
                    {domainUrl && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3"
                      >
                        <div className={`flex items-center space-x-2 text-sm ${
                          isValidUrl ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {isValidUrl ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              <span>Valid URL format detected</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4" />
                              <span>Please enter a valid URL (e.g., https://example.com)</span>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Domain Analysis */}
                <AnimatePresence>
                  {domainAnalysis && isValidUrl && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-gray-50 rounded-lg border"
                    >
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        Domain Analysis
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Status:</span>
                          <Badge variant="secondary" className="text-xs">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                            Online
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Load Time:</span>
                          <span className="font-medium">{domainAnalysis.loadTime}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">SSL:</span>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">SEO Score:</span>
                          <span className="font-medium text-green-600">{domainAnalysis.seoScore}/100</span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600 mb-2">Technologies detected:</p>
                        <div className="flex flex-wrap gap-1">
                          {domainAnalysis.technologies.map((tech: string) => (
                            <Badge key={tech} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button
                    onClick={handleAddDomain}
                    disabled={!isValidUrl || isLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium"
                    size="lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Analyzing...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Eye className="w-5 h-5 mr-2" />
                        Preview & Analyze
                      </div>
                    )}
                  </Button>
                  
                  <AnimatePresence>
                    {showPreview && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex-1"
                      >
                        <Button
                          onClick={handleAddWebsite}
                          disabled={!isValidUrl}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-base font-medium"
                          size="lg"
                        >
                          <div className="flex items-center">
                            <Plus className="w-5 h-5 mr-2" />
                            Add to Dashboard
                          </div>
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Additional Options */}
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Upload className="w-4 h-4 mr-2" />
                    Import CSV
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </div>

              {/* Enhanced Preview Section */}
              <AnimatePresence>
                {showPreview && domainUrl && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-200 pt-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 flex items-center">
                        <Monitor className="w-5 h-5 mr-2" />
                        Live Preview
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          Real-time
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(formatUrl(domainUrl), '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-100 rounded-xl p-3">
                      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b flex items-center space-x-3">
                          <div className="flex space-x-1.5">
                            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                            <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                          </div>
                          <div className="flex-1 bg-white rounded px-3 py-1.5 text-sm text-gray-600 font-mono">
                            {formatUrl(domainUrl)}
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span className="text-xs text-emerald-600">Secure</span>
                          </div>
                        </div>
                        <div className="relative">
                          <iframe
                            src={formatUrl(domainUrl)}
                            className="w-full h-80 border-0"
                            title="Website Preview"
                            sandbox="allow-same-origin allow-scripts"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default WebsitePage;