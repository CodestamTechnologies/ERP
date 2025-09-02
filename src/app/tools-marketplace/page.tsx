'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, Settings, Zap, Crown, Star, Check, X, Search, Filter,
  ShoppingCart, CreditCard, Download, Users, Package, BarChart3,
  Shield, Truck, MessageSquare, Calendar, FileText, DollarSign,
  Building2, Wrench, Sparkles, Rocket, Globe, Lock, Eye, Heart,
  Plus, Minus, RefreshCw, ArrowRight, ChevronRight, Activity
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useToolsMarketplace } from '@/hooks/useToolsMarketplace';
import { ToolCard } from '@/components/tools-marketplace/ToolCard';
import { PurchaseDialog } from '@/components/tools-marketplace/PurchaseDialog';
import { SidebarCustomizer } from '@/components/tools-marketplace/SidebarCustomizer';
import { AdvancedSidebarCustomizer } from '@/components/tools-marketplace/AdvancedSidebarCustomizer';
import { PricingCard } from '@/components/tools-marketplace/PricingCard';

// Define the Tool interface to match the one from the hook
interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  features: string[];
  rating: number;
  downloads: number;
  size: string;
  version: string;
  developer: string;
  screenshots: string[];
  isPopular?: boolean;
  isNew?: boolean;
  isPremium?: boolean;
  suite?: string; // Added for the extended tool type
}

// Define CustomSection interface to match the hook
interface CustomSection {
  id: string;
  name: string;
  tools: string[];
  order: number;
}

// Define SidebarConfig interface to match the hook
interface SidebarConfig {
  enabledTools: string[];
  toolOrder: string[];
  customSections: CustomSection[];
  sectionConfigs: Record<string, {
    enabledSections: string[];
    sectionOrder: string[];
    subOptionConfigs: Record<string, string[]>;
  }>;
}

const ToolsMarketplacePage = () => {
  const {
    availableTools, installedTools, sidebarConfig, hubTrackTools, gokuTools, gamaTools,
    loading, isProcessing, installTool, uninstallTool, updateSidebarConfig,
    purchaseTool, getToolPrice, getUserSubscription
  } = useToolsMarketplace();

  const [activeTab, setActiveTab] = useState('sidebar');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [cart, setCart] = useState<string[]>([]);

  const subscription = getUserSubscription();

  const allTools = useMemo(() => [
    ...hubTrackTools.map(tool => ({ ...tool, suite: 'HubTrack Pro' })),
    ...gokuTools.map(tool => ({ ...tool, suite: 'GOKU' })),
    ...gamaTools.map(tool => ({ ...tool, suite: 'GAMA' }))
  ], [hubTrackTools, gokuTools, gamaTools]);

  const filteredTools = useMemo(() => {
    return allTools.filter(tool => {
      const matchesSearch = !searchTerm || 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allTools, searchTerm, selectedCategory]);

  const categories = useMemo(() => {
    const cats = ['all', ...new Set(allTools.map(tool => tool.category))];
    return cats;
  }, [allTools]);

  const handleToolPurchase = async (toolId: string) => {
    try {
      await purchaseTool(toolId);
      setCart(prev => prev.filter(id => id !== toolId));
      setShowPurchaseDialog(false);
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  const addToCart = (toolId: string) => {
    setCart(prev => prev.includes(toolId) ? prev : [...prev, toolId]);
  };

  const removeFromCart = (toolId: string) => {
    setCart(prev => prev.filter(id => id !== toolId));
  };

  const getTotalCartPrice = () => {
    return cart.reduce((total, toolId) => {
      const tool = allTools.find(t => t.id === toolId);
      return total + (tool ? getToolPrice(toolId) : 0);
    }, 0);
  };

  const getCartItems = () => {
    return cart
      .map(id => {
        const tool = allTools.find(tool => tool.id === id);
        if (!tool) return null;
        
        return {
          id: tool.id,
          name: tool.name,
          suite: tool.suite || 'Unknown',
          category: tool.category,
          icon: tool.icon,
          price: getToolPrice(tool.id),
          isPremium: tool.isPremium,
          isNew: tool.isNew
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-gray-200 rounded"></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
              <Store size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tools Marketplace
              </h1>
              <p className="text-gray-600 mt-2">Customize your workspace and unlock powerful business tools</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Current Plan: {subscription.plan}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Crown size={16} className="text-yellow-500" />
              <span className="text-gray-600">Credits: ₹{subscription.credits}</span>
            </div>
            {cart.length > 0 && (
              <div className="flex items-center space-x-2">
                <ShoppingCart size={16} className="text-blue-600" />
                <span className="text-blue-600 font-medium">Cart: {cart.length} items</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Main Content */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-white/50">
                <TabsTrigger value="sidebar" className="flex items-center space-x-2">
                  <Settings size={16} />
                  <span>Basic Config</span>
                </TabsTrigger>
                <TabsTrigger value="advanced" className="flex items-center space-x-2">
                  <Wrench size={16} />
                  <span>Advanced</span>
                </TabsTrigger>
                <TabsTrigger value="hubtrack" className="flex items-center space-x-2">
                  <Rocket size={16} />
                  <span>HubTrack Pro</span>
                </TabsTrigger>
                <TabsTrigger value="goku" className="flex items-center space-x-2">
                  <Zap size={16} />
                  <span>GOKU</span>
                </TabsTrigger>
                <TabsTrigger value="gama" className="flex items-center space-x-2">
                  <Sparkles size={16} />
                  <span>GAMA</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                
                {activeTab === 'sidebar' && (
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-bold text-gray-900">Basic Sidebar Configuration</h2>
                      <p className="text-gray-600">Enable or disable tools in your sidebar for a personalized experience</p>
                    </div>
                    
                    <SidebarCustomizer 
                      availableTools={availableTools}
                      installedTools={installedTools}
                      sidebarConfig={sidebarConfig}
                      onInstall={installTool}
                      onUninstall={uninstallTool}
                      onConfigUpdate={(config) => updateSidebarConfig(config)}
                      isProcessing={isProcessing}
                    />
                  </div>
                )}

                {activeTab === 'advanced' && (
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-bold text-gray-900">Advanced Sidebar Customization</h2>
                      <p className="text-gray-600">Customize individual sections and sub-options within each tool&apos;s secondary sidebar</p>
                    </div>
                    
                    <AdvancedSidebarCustomizer 
                      availableTools={availableTools}
                      installedTools={installedTools}
                      sidebarConfig={sidebarConfig}
                      onInstall={installTool}
                      onUninstall={uninstallTool}
                      onConfigUpdate={(config) => updateSidebarConfig(config)}
                      isProcessing={isProcessing}
                    />
                  </div>
                )}

                {(activeTab === 'hubtrack' || activeTab === 'goku' || activeTab === 'gama') && (
                  <div className="space-y-6">
                    {/* Suite Header */}
                    <div className="text-center space-y-4">
                      <div className="flex items-center justify-center space-x-3">
                        {activeTab === 'hubtrack' && (
                          <>
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl">
                              <Rocket size={28} className="text-white" />
                            </div>
                            <div>
                              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">HubTrack Pro</h2>
                              <p className="text-gray-600">Advanced project management and collaboration tools</p>
                            </div>
                          </>
                        )}
                        {activeTab === 'goku' && (
                          <>
                            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl">
                              <Zap size={28} className="text-white" />
                            </div>
                            <div>
                              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">GOKU</h2>
                              <p className="text-gray-600">Powerful automation and AI-driven business intelligence</p>
                            </div>
                          </>
                        )}
                        {activeTab === 'gama' && (
                          <>
                            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                              <Sparkles size={28} className="text-white" />
                            </div>
                            <div>
                              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">GAMA</h2>
                              <p className="text-gray-600">Advanced analytics and machine learning solutions</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                      <div className="flex gap-4 items-center">
                        <div className="relative">
                          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <Input placeholder="Search tools..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-64" />
                        </div>
                        
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="w-40">
                            <Filter size={16} className="mr-2" />
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>
                                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {cart.length > 0 && (
                        <div className="flex items-center space-x-4">
                          <div className="text-sm text-gray-600">
                            Total: <span className="font-bold text-lg">₹{getTotalCartPrice()}</span>
                          </div>
                          <Button onClick={() => setShowPurchaseDialog(true)} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                            <ShoppingCart size={16} className="mr-2" />
                            Checkout ({cart.length})
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Tools Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredTools
                        .filter(tool => {
                          if (activeTab === 'hubtrack') return tool.suite === 'HubTrack Pro';
                          if (activeTab === 'goku') return tool.suite === 'GOKU';
                          if (activeTab === 'gama') return tool.suite === 'GAMA';
                          return false;
                        })
                        .map((tool, index) => (
                          <ToolCard
                            key={tool.id}
                            tool={tool}
                            isInstalled={installedTools.includes(tool.id)}
                            isInCart={cart.includes(tool.id)}
                            price={getToolPrice(tool.id)}
                            onAddToCart={() => addToCart(tool.id)}
                            onRemoveFromCart={() => removeFromCart(tool.id)}
                            onViewDetails={() => setSelectedTool(tool)}
                            onInstall={() => installTool(tool.id)}
                            onUninstall={() => uninstallTool(tool.id)}
                            index={index}
                            isProcessing={isProcessing}
                          />
                        ))}
                    </div>

                    {filteredTools.filter(tool => {
                      if (activeTab === 'hubtrack') return tool.suite === 'HubTrack Pro';
                      if (activeTab === 'goku') return tool.suite === 'GOKU';
                      if (activeTab === 'gama') return tool.suite === 'GAMA';
                      return false;
                    }).length === 0 && (
                      <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                          <Package size={48} className="mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No tools found</h3>
                        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                      </div>
                    )}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Subscription Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Crown size={32} className="text-yellow-300" />
                  <div>
                    <h3 className="text-xl font-bold">Current Subscription: {subscription.plan}</h3>
                    <p className="text-blue-100">Credits remaining: ₹{subscription.credits} | Expires: {subscription.expiryDate}</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                    <CreditCard size={16} className="mr-2" />
                    Add Credits
                  </Button>
                  <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                    <Crown size={16} className="mr-2" />
                    Upgrade Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Purchase Dialog */}
      <PurchaseDialog
        isOpen={showPurchaseDialog}
        onClose={() => setShowPurchaseDialog(false)}
        cartItems={getCartItems()}
        totalPrice={getTotalCartPrice()}
        onPurchase={handleToolPurchase}
        userCredits={subscription.credits}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default ToolsMarketplacePage;