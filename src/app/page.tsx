'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/pages/Dashboard';
import Inventory from '@/pages/Inventory';
import Customers from '@/pages/Customers';
import Suppliers from '@/pages/Suppliers';
import Sales from '@/pages/Sales';
import AIInsights from '@/pages/AIInsights';
import HubTrackPro from '@/pages/HubTrackPro';
import WhatsApp from '@/pages/WhatsApp';
import Todo from '@/pages/Todo';
import Calendar from '@/pages/Calendar';
import Reports from '@/pages/Reports';
import Gmail from '@/pages/Gmail';
import Finance from '@/pages/Finance';
import Settings from '@/pages/Settings';
import ConnectDomain from '@/pages/ConnectDomain';
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
        return <Finance />;
      case 'reports':
        return <Reports />;
      case 'ai-insights':
        return <AIInsights />;
      case 'hub-track-pro':
        return <HubTrackPro />;
      case 'whatsapp':
        return <WhatsApp />;
      case 'todo':
        return <Todo />;
      case 'calendar':
        return <Calendar />;
      case 'gmail':
        return <Gmail />;
      case 'settings':
        return <Settings />;
      case 'connect-domain':
        return <ConnectDomain />;
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
        return 'Business Reports & Analytics';
      case 'ai-insights':
        return 'AI Insights';
      case 'hub-track-pro':
        return 'Hub Track Pro';
      case 'whatsapp':
        return 'WhatsApp Business';
      case 'todo':
        return 'Task Management';
      case 'calendar':
        return 'Business Calendar';
      case 'gmail':
        return 'Gmail Integration';
      case 'settings':
        return 'Settings';
      case 'connect-domain':
        return 'Connect Domain';
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