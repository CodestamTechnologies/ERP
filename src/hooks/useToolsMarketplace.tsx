import { useState, useEffect, useCallback } from 'react';
import React from 'react';
import { 
  Users, Building2, Package, DollarSign, User, FolderKanban,
  BarChart3, Zap, MessageSquare, Smartphone, Bot, Pickaxe,
  Target, Mic, Brain, Gem, Database, TrendingUp, FileText
} from 'lucide-react';

interface Tool {
  id: string; name: string; description: string; category: string; icon: React.ReactNode;
  features: string[]; rating: number; downloads: number; size: string;
  version: string; developer: string; screenshots: string[];
  isPopular?: boolean; isNew?: boolean; isPremium?: boolean;
}

interface SidebarConfig {
  enabledTools: string[]; 
  toolOrder: string[]; 
  customSections: any[];
  sectionConfigs: Record<string, {
    enabledSections: string[];
    sectionOrder: string[];
    subOptionConfigs: Record<string, string[]>;
  }>;
}

interface Subscription {
  plan: 'Free' | 'Pro' | 'Enterprise'; credits: number; expiryDate: string;
  maxTools: number; features: string[];
}

// Primary Sidebar Tools (Main Navigation)
const mockAvailableTools: Tool[] = [
  { id: 'dashboard', name: 'Dashboard', description: 'Main dashboard with overview and analytics', category: 'Core', icon: <BarChart3 size={20} />, features: ['Real-time Analytics', 'KPI Tracking', 'Custom Widgets'], rating: 4.9, downloads: 25000, size: '1.2 MB', version: '3.0.0', developer: 'ERP Core', screenshots: [] },
  { id: 'customers', name: 'Customers', description: 'Customer relationship management', category: 'CRM', icon: <Users size={20} />, features: ['Contact Management', 'Lead Tracking', 'Customer Analytics'], rating: 4.8, downloads: 15420, size: '2.3 MB', version: '2.1.0', developer: 'ERP Core', screenshots: [] },
  { id: 'finance', name: 'Finance', description: 'Financial management and accounting', category: 'Finance', icon: <DollarSign size={20} />, features: ['Accounting', 'Invoicing', 'Financial Reports'], rating: 4.9, downloads: 22000, size: '3.5 MB', version: '2.8.0', developer: 'ERP Core', screenshots: [] },
  { id: 'inventory', name: 'Inventory', description: 'Inventory and stock management', category: 'Operations', icon: <Package size={20} />, features: ['Stock Tracking', 'Reorder Alerts', 'Warehouse Management'], rating: 4.7, downloads: 18750, size: '2.8 MB', version: '2.5.1', developer: 'ERP Core', screenshots: [] },
  { id: 'documents', name: 'Documents', description: 'Document management and reports', category: 'Documents', icon: <FileText size={20} />, features: ['Document Storage', 'Report Generation', 'Template Management'], rating: 4.6, downloads: 12500, size: '2.1 MB', version: '1.9.0', developer: 'ERP Core', screenshots: [] },
  { id: 'whatsapp', name: 'WhatsApp', description: 'WhatsApp business integration', category: 'Communication', icon: <MessageSquare size={20} />, features: ['Business API', 'Automated Messages', 'Contact Sync'], rating: 4.5, downloads: 8900, size: '1.8 MB', version: '1.5.2', developer: 'ERP Core', screenshots: [] },
  { id: 'email', name: 'Email', description: 'Email management and integration', category: 'Communication', icon: <Building2 size={20} />, features: ['Email Templates', 'Campaign Management', 'Analytics'], rating: 4.4, downloads: 7800, size: '2.2 MB', version: '1.7.1', developer: 'ERP Core', screenshots: [] },
  { id: 'todo', name: 'TODO', description: 'Task and project management', category: 'Productivity', icon: <FolderKanban size={20} />, features: ['Task Management', 'Project Tracking', 'Team Collaboration'], rating: 4.6, downloads: 11200, size: '1.9 MB', version: '2.0.3', developer: 'ERP Core', screenshots: [] },
  { id: 'ai-insights', name: 'AI Insights', description: 'AI-powered business insights', category: 'AI', icon: <Brain size={20} />, features: ['Predictive Analytics', 'Smart Recommendations', 'Data Mining'], rating: 4.8, downloads: 6500, size: '4.2 MB', version: '1.2.0', developer: 'ERP Core', screenshots: [], isNew: true }
];

const mockHubTrackTools: Tool[] = [
  { id: 'hubtrack-advanced-analytics', name: 'Advanced Analytics', description: 'Deep business intelligence and reporting', category: 'Analytics', icon: <BarChart3 size={20} />, features: ['Custom Dashboards', 'Predictive Analytics', 'Real-time Reporting'], rating: 4.9, downloads: 8500, size: '4.2 MB', version: '1.5.0', developer: 'HubTrack Pro', screenshots: [], isPremium: true },
  { id: 'hubtrack-workflow-automation', name: 'Workflow Automation', description: 'Automate business processes and workflows', category: 'Automation', icon: <Zap size={20} />, features: ['Process Builder', 'Trigger Management', 'Integration Hub'], rating: 4.8, downloads: 7200, size: '3.8 MB', version: '2.1.0', developer: 'HubTrack Pro', screenshots: [], isPopular: true },
  { id: 'hubtrack-team-collaboration', name: 'Team Collaboration', description: 'Enhanced team communication and collaboration', category: 'Collaboration', icon: <MessageSquare size={20} />, features: ['Team Chat', 'File Sharing', 'Video Conferencing'], rating: 4.7, downloads: 9800, size: '5.1 MB', version: '1.8.2', developer: 'HubTrack Pro', screenshots: [] },
  { id: 'hubtrack-mobile-app', name: 'Mobile App Suite', description: 'Native mobile applications for iOS and Android', category: 'Mobile', icon: <Smartphone size={20} />, features: ['Offline Access', 'Push Notifications', 'Mobile Dashboard'], rating: 4.6, downloads: 12400, size: '15.2 MB', version: '3.0.0', developer: 'HubTrack Pro', screenshots: [], isNew: true }
];

const mockGokuTools: Tool[] = [
  { id: 'goku-ai-assistant', name: 'AI Business Assistant', description: 'AI-powered business intelligence and automation', category: 'AI', icon: <Bot size={20} />, features: ['Natural Language Processing', 'Predictive Insights', 'Smart Recommendations'], rating: 4.9, downloads: 5600, size: '6.8 MB', version: '1.2.0', developer: 'GOKU AI', screenshots: [], isPremium: true, isNew: true },
  { id: 'goku-data-mining', name: 'Data Mining Engine', description: 'Advanced data analysis and pattern recognition', category: 'Analytics', icon: <Pickaxe size={20} />, features: ['Pattern Recognition', 'Data Visualization', 'Machine Learning'], rating: 4.8, downloads: 4200, size: '8.1 MB', version: '2.0.1', developer: 'GOKU AI', screenshots: [], isPremium: true },
  { id: 'goku-automation-studio', name: 'Automation Studio', description: 'Visual automation builder with AI capabilities', category: 'Automation', icon: <Target size={20} />, features: ['Visual Builder', 'AI Triggers', 'Smart Workflows'], rating: 4.7, downloads: 3800, size: '7.3 MB', version: '1.6.0', developer: 'GOKU AI', screenshots: [], isPopular: true },
  { id: 'goku-voice-commands', name: 'Voice Command Center', description: 'Voice-controlled business operations', category: 'Voice', icon: <Mic size={20} />, features: ['Voice Recognition', 'Command Execution', 'Multi-language Support'], rating: 4.5, downloads: 2900, size: '4.9 MB', version: '1.1.2', developer: 'GOKU AI', screenshots: [], isNew: true }
];

const mockGamaTools: Tool[] = [
  { id: 'gama-ml-platform', name: 'Machine Learning Platform', description: 'Enterprise-grade ML model development and deployment', category: 'Machine Learning', icon: <Brain size={20} />, features: ['Model Training', 'Auto ML', 'Model Deployment'], rating: 4.9, downloads: 3200, size: '12.5 MB', version: '1.0.8', developer: 'GAMA Analytics', screenshots: [], isPremium: true },
  { id: 'gama-predictive-analytics', name: 'Predictive Analytics Suite', description: 'Advanced forecasting and trend analysis', category: 'Analytics', icon: <Gem size={20} />, features: ['Demand Forecasting', 'Risk Analysis', 'Trend Prediction'], rating: 4.8, downloads: 2800, size: '9.7 MB', version: '2.2.0', developer: 'GAMA Analytics', screenshots: [], isPremium: true },
  { id: 'gama-data-warehouse', name: 'Data Warehouse Manager', description: 'Centralized data storage and management', category: 'Data Management', icon: <Database size={20} />, features: ['Data Integration', 'ETL Processes', 'Data Governance'], rating: 4.6, downloads: 2100, size: '11.2 MB', version: '1.5.1', developer: 'GAMA Analytics', screenshots: [] },
  { id: 'gama-visualization', name: 'Advanced Visualization', description: 'Interactive data visualization and storytelling', category: 'Visualization', icon: <TrendingUp size={20} />, features: ['Interactive Charts', 'Dashboard Builder', 'Story Mode'], rating: 4.7, downloads: 3600, size: '6.4 MB', version: '1.8.0', developer: 'GAMA Analytics', screenshots: [], isPopular: true }
];

const mockSubscription: Subscription = {
  plan: 'Pro', credits: 15000, expiryDate: '2024-12-31',
  maxTools: 25, features: ['Premium Support', 'Advanced Analytics', 'Custom Integrations']
};

const toolPrices: Record<string, number> = {
  // HubTrack Pro Tools
  'hubtrack-advanced-analytics': 2999,
  'hubtrack-workflow-automation': 1999,
  'hubtrack-team-collaboration': 1499,
  'hubtrack-mobile-app': 999,
  
  // GOKU Tools
  'goku-ai-assistant': 4999,
  'goku-data-mining': 3999,
  'goku-automation-studio': 2999,
  'goku-voice-commands': 1999,
  
  // GAMA Tools
  'gama-ml-platform': 7999,
  'gama-predictive-analytics': 5999,
  'gama-data-warehouse': 3999,
  'gama-visualization': 2499
};

export const useToolsMarketplace = () => {
  const [availableTools] = useState<Tool[]>(mockAvailableTools);
  const [installedTools, setInstalledTools] = useState<string[]>(['dashboard', 'customers', 'finance', 'inventory', 'documents', 'whatsapp', 'email', 'todo', 'ai-insights']);
  const [sidebarConfig, setSidebarConfig] = useState<SidebarConfig>({
    enabledTools: ['dashboard', 'customers', 'finance', 'inventory', 'documents', 'todo'],
    toolOrder: ['dashboard', 'customers', 'finance', 'inventory', 'documents', 'whatsapp', 'email', 'todo', 'ai-insights'],
    customSections: [],
    sectionConfigs: {}
  });
  const [hubTrackTools] = useState<Tool[]>(mockHubTrackTools);
  const [gokuTools] = useState<Tool[]>(mockGokuTools);
  const [gamaTools] = useState<Tool[]>(mockGamaTools);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error loading marketplace data:', error);
      } finally {
        setLoading(false);
      }
    };
    initializeData();
  }, []);

  const installTool = useCallback(async (toolId: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setInstalledTools(prev => prev.includes(toolId) ? prev : [...prev, toolId]);
      setSidebarConfig(prev => ({
        ...prev,
        enabledTools: prev.enabledTools.includes(toolId) ? prev.enabledTools : [...prev.enabledTools, toolId],
        toolOrder: prev.toolOrder.includes(toolId) ? prev.toolOrder : [...prev.toolOrder, toolId]
      }));
    } catch (error) {
      console.error('Error installing tool:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const uninstallTool = useCallback(async (toolId: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInstalledTools(prev => prev.filter(id => id !== toolId));
      setSidebarConfig(prev => ({
        ...prev,
        enabledTools: prev.enabledTools.filter(id => id !== toolId),
        toolOrder: prev.toolOrder.filter(id => id !== toolId)
      }));
    } catch (error) {
      console.error('Error uninstalling tool:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const updateSidebarConfig = useCallback(async (newConfig: Partial<SidebarConfig>) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSidebarConfig(prev => ({ ...prev, ...newConfig }));
    } catch (error) {
      console.error('Error updating sidebar config:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const purchaseTool = useCallback(async (toolId: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Simulate purchase process
      await installTool(toolId);
      console.log(`Tool ${toolId} purchased and installed successfully`);
    } catch (error) {
      console.error('Error purchasing tool:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [installTool]);

  const getToolPrice = useCallback((toolId: string): number => {
    return toolPrices[toolId] || 0;
  }, []);

  const getUserSubscription = useCallback((): Subscription => {
    return mockSubscription;
  }, []);

  return {
    availableTools, installedTools, sidebarConfig, hubTrackTools, gokuTools, gamaTools,
    loading, isProcessing, installTool, uninstallTool, updateSidebarConfig,
    purchaseTool, getToolPrice, getUserSubscription
  };
};