'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import Inventory from '@/components/Inventory';
import Customers from '@/components/Customers';
import Suppliers from '@/components/Suppliers';
import Sales from '@/components/Sales';
import AIInsights from '@/components/AIInsights';
import HubTrackPro from '@/components/HubTrackPro';
import WhatsApp from '@/components/WhatsApp';
import RightStickyPanel from '@/components/RightStickyPanel';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  const handleSettingsClick = () => {
    setActiveView('settings');
  };

  const handleThemeToggle = () => {
    // Theme toggle logic can be implemented here
    console.log('Theme toggled');
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <Inventory />;
      case 'sales':
        return <Sales />;
      case 'customers':
        return <Customers />;
      case 'suppliers':
        return <Suppliers />;
      case 'finance':
        return <div className="p-6"><h1 className="text-2xl font-bold">Finance - Coming Soon</h1></div>;
      case 'reports':
        return <div className="p-6"><h1 className="text-2xl font-bold">Reports - Coming Soon</h1></div>;
      case 'ai-insights':
        return <AIInsights />;
      case 'hub-track-pro':
        return <HubTrackPro />;
      case 'whatsapp':
        return <WhatsApp />;
      case 'gmail':
        return (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <svg className="w-8 h-8 text-red-500 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819l6.545 4.91 6.545-4.91h3.819A1.636 1.636 0 0 1 24 5.457z"/>
                  </svg>
                  <h1 className="text-3xl font-bold text-gray-900">Gmail Integration</h1>
                </div>
                <p className="text-gray-600">Email marketing and communication management</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819l6.545 4.91 6.545-4.91h3.819A1.636 1.636 0 0 1 24 5.457z"/>
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Gmail Integration Coming Soon</h2>
                <p className="text-gray-600 mb-6">
                  We're working on integrating Gmail functionality to help you manage your email communications, 
                  track email campaigns, and analyze email performance metrics.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Email Campaigns</h3>
                    <p className="text-sm text-gray-600">Create and manage email marketing campaigns</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
                    <p className="text-sm text-gray-600">Track open rates, click rates, and engagement</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Contact Management</h3>
                    <p className="text-sm text-gray-600">Organize and segment your email contacts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return <div className="p-6"><h1 className="text-2xl font-bold">Settings - Coming Soon</h1></div>;
      default:
        return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Dashboard';
      case 'inventory':
        return 'Inventory Management';
      case 'sales':
        return 'Sales';
      case 'customers':
        return 'Customers';
      case 'suppliers':
        return 'Suppliers';
      case 'finance':
        return 'Finance';
      case 'reports':
        return 'Reports';
      case 'ai-insights':
        return 'AI Insights';
      case 'hub-track-pro':
        return 'Hub Track Pro';
      case 'whatsapp':
        return 'WhatsApp Business';
      case 'gmail':
        return 'Gmail Integration';
      case 'settings':
        return 'Settings';
      default:
        return 'Codestam ERP';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        activeView={activeView}
        onViewChange={setActiveView}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">{getPageTitle()}</h1>
            <div className="w-6"></div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Right Sticky Panel */}
      <RightStickyPanel 
        onSettingsClick={handleSettingsClick}
        onThemeToggle={handleThemeToggle}
      />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}