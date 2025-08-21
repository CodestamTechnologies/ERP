'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  DashboardIcon, 
  SalesIcon, 
  InventoryIcon, 
  CustomersIcon, 
  SuppliersIcon, 
  FinanceIcon, 
  ReportsIcon, 
  AIInsightsIcon, 
  SettingsIcon,
  NotificationIcon,
  OrderIcon,
  PaymentIcon,
  WarningIcon,
  UserIcon,
  ThemeIcon
} from './Icons';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
}

const Sidebar = ({ isOpen, onClose, activeView, onViewChange }: SidebarProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showMyTools, setShowMyTools] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Don't close if clicking on a select element or its options
      if (target.tagName === 'SELECT' || target.tagName === 'OPTION') {
        return;
      }
      
      // Don't close if clicking inside the notification dropdown
      const notificationDropdown = document.querySelector('[data-notification-dropdown]');
      if (notificationDropdown && notificationDropdown.contains(target)) {
        return;
      }
      
      if (notificationRef.current && !notificationRef.current.contains(target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const notifications = [
    {
      id: 1,
      type: 'alert',
      title: 'Low Stock Alert',
      message: 'MacBook Pro inventory is running low (5 units remaining)',
      time: '5 minutes ago',
      icon: <WarningIcon size={16} />,
      priority: 'high',
      read: false,
      department: 'inventory'
    },
    {
      id: 2,
      type: 'order',
      title: 'New Order Received',
      message: 'Order #ORD-2024-001 from TechCorp Solutions (₹1,25,000)',
      time: '15 minutes ago',
      icon: <OrderIcon size={16} />,
      priority: 'medium',
      read: false,
      department: 'sales'
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of ₹2,50,000 received from Global Enterprises',
      time: '1 hour ago',
      icon: <PaymentIcon size={16} />,
      priority: 'medium',
      read: true,
      department: 'finance'
    },
    {
      id: 4,
      type: 'customer',
      title: 'New Customer Registration',
      message: 'Innovation Labs has registered as a new customer',
      time: '2 hours ago',
      icon: <UserIcon size={16} />,
      priority: 'low',
      read: true,
      department: 'sales'
    },
    {
      id: 5,
      type: 'system',
      title: 'AI Insights Updated',
      message: 'New AI insights available for Q1 sales forecast',
      time: '3 hours ago',
      icon: <AIInsightsIcon size={16} />,
      priority: 'medium',
      read: true,
      department: 'analytics'
    },
    {
      id: 6,
      type: 'alert',
      title: 'Supplier Delay Warning',
      message: 'Delivery delay expected from TechSource India',
      time: '4 hours ago',
      icon: <WarningIcon size={16} />,
      priority: 'high',
      read: true,
      department: 'procurement'
    },
    {
      id: 7,
      type: 'hr',
      title: 'New Employee Onboarding',
      message: 'Sarah Johnson joined the Marketing team today',
      time: '5 hours ago',
      icon: <UserIcon size={16} />,
      priority: 'low',
      read: true,
      department: 'hr'
    },
    {
      id: 8,
      type: 'finance',
      title: 'Monthly Budget Alert',
      message: 'Marketing department has exceeded 80% of monthly budget',
      time: '6 hours ago',
      icon: <WarningIcon size={16} />,
      priority: 'medium',
      read: false,
      department: 'finance'
    },
    {
      id: 9,
      type: 'it',
      title: 'System Maintenance',
      message: 'Scheduled server maintenance tonight from 2 AM to 4 AM',
      time: '8 hours ago',
      icon: <SettingsIcon size={16} />,
      priority: 'medium',
      read: true,
      department: 'it'
    },
    {
      id: 10,
      type: 'customer',
      title: 'Customer Feedback',
      message: 'Received 5-star review from TechCorp Solutions',
      time: '1 day ago',
      icon: <CustomersIcon size={16} />,
      priority: 'low',
      read: true,
      department: 'customer-service'
    }
  ];

  // Filter notifications based on selected filters
  const filteredNotifications = notifications.filter(notification => {
    const matchesType = notificationFilter === 'all' || notification.type === notificationFilter;
    const matchesDepartment = departmentFilter === 'all' || notification.department === departmentFilter;
    const matchesPriority = priorityFilter === 'all' || notification.priority === priorityFilter;
    return matchesType && matchesDepartment && matchesPriority;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'alert':
        return 'text-red-600';
      case 'order':
        return 'text-blue-600';
      case 'payment':
        return 'text-green-600';
      case 'customer':
        return 'text-purple-600';
      case 'system':
        return 'text-indigo-600';
      default:
        return 'text-gray-600';
    }
  };

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <DashboardIcon size={20} />, badge: null },
    { id: 'sales', name: 'Sales', icon: <SalesIcon size={20} />, badge: '12' },
    { id: 'inventory', name: 'Inventory', icon: <InventoryIcon size={20} />, badge: null },
    { id: 'customers', name: 'Customers', icon: <CustomersIcon size={20} />, badge: '3' },
    { id: 'suppliers', name: 'Suppliers', icon: <SuppliersIcon size={20} />, badge: null },
    { id: 'finance', name: 'Finance', icon: <FinanceIcon size={20} />, badge: null },
    { id: 'reports', name: 'Reports', icon: <ReportsIcon size={20} />, badge: null },
    { id: 'ai-insights', name: 'AI Insights', icon: <AIInsightsIcon size={20} />, badge: 'NEW' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200" style={{ backgroundColor: '#1e2155' }}>
          {/* Logo */}
          <div className="flex items-center h-16 px-4" style={{ backgroundColor: '#1e2155' }}>
            <div className="flex items-center space-x-2 flex-1">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1">
                <img 
                  src="/images/logo.png" 
                  alt="Codestam Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-white font-bold text-xl">Codestam</span>
            </div>
            
            {/* Vertical Separator */}
            <div className="h-8 w-px bg-white/30 mx-3"></div>
            
            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-white hover:text-gray-200 transition-colors"
              >
                <NotificationIcon size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      <span className="text-sm text-gray-500">{unreadCount} unread</span>
                    </div>
                    
                    {/* Filter Options */}
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <select
                          value={departmentFilter}
                          onChange={(e) => setDepartmentFilter(e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                        >
                          <option value="all">All Departments</option>
                          <option value="sales">Sales</option>
                          <option value="finance">Finance</option>
                          <option value="inventory">Inventory</option>
                          <option value="hr">HR</option>
                          <option value="it">IT</option>
                          <option value="procurement">Procurement</option>
                          <option value="analytics">Analytics</option>
                          <option value="customer-service">Customer Service</option>
                        </select>
                        
                        <select
                          value={priorityFilter}
                          onChange={(e) => setPriorityFilter(e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                        >
                          <option value="all">All Priority</option>
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                        
                        <select
                          value={notificationFilter}
                          onChange={(e) => setNotificationFilter(e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                        >
                          <option value="all">All Types</option>
                          <option value="alert">Alerts</option>
                          <option value="order">Orders</option>
                          <option value="payment">Payments</option>
                          <option value="customer">Customers</option>
                          <option value="system">System</option>
                          <option value="hr">HR</option>
                          <option value="finance">Finance</option>
                          <option value="it">IT</option>
                        </select>
                      </div>
                      
                      {/* Filter Summary */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Showing {filteredNotifications.length} of {notifications.length} notifications</span>
                        {(departmentFilter !== 'all' || priorityFilter !== 'all' || notificationFilter !== 'all') && (
                          <button
                            onClick={() => {
                              setDepartmentFilter('all');
                              setPriorityFilter('all');
                              setNotificationFilter('all');
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Clear filters
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-l-4 hover:bg-gray-50 transition-colors ${getPriorityColor(notification.priority)} ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-1 rounded ${getTypeColor(notification.type)}`}>
                            {notification.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex space-x-2">
                      <button className="flex-1 text-sm bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors">
                        Mark All Read
                      </button>
                      <button className="flex-1 text-sm bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300 transition-colors">
                        View All
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6" style={{ backgroundColor: '#1e2155' }}>
            {/* Tools Section Header */}
            <div className="flex items-center justify-between px-3 mb-3">
              <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                Tools
              </h3>
              <button
                onClick={() => {
                  // Add new tool functionality
                  const newToolName = prompt('Enter new tool name:');
                  if (newToolName) {
                    // Here you would typically add the new tool to your state/data
                    console.log('Adding new tool:', newToolName);
                  }
                }}
                className="p-1 text-white/40 hover:text-white/80 hover:bg-white/10 rounded transition-colors"
                title="Add new tool"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            
            {/* Main Menu Items with Scroll */}
            <div className="max-h-64 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeView === item.id
                      ? 'bg-white/10 text-white border-r-2 border-white'
                      : 'text-white/80 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.badge === 'NEW' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
            
            {/* My Tools Dropdown Section */}
            <div className="pt-4 mt-4 border-t border-white/20">
              <button
                onClick={() => setShowMyTools(!showMyTools)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/5 hover:text-white transition-colors rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">T</span>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider">My Tools</span>
                </div>
                <svg 
                  className={`w-4 h-4 transition-transform ${showMyTools ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showMyTools && (
                <div className="mt-2 space-y-1 pl-4">
                  <button
                    onClick={() => onViewChange('hub-track-pro')}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeView === 'hub-track-pro'
                        ? 'bg-white/10 text-white border-r-2 border-white'
                        : 'text-white/80 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">H</span>
                      </div>
                      <span>Hub track pro</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => onViewChange('goku')}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeView === 'goku'
                        ? 'bg-white/10 text-white border-r-2 border-white'
                        : 'text-white/80 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-red-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">G</span>
                      </div>
                      <span>GOKU</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => onViewChange('gama')}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeView === 'gama'
                        ? 'bg-white/10 text-white border-r-2 border-white'
                        : 'text-white/80 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-teal-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">G</span>
                      </div>
                      <span>GAMA</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Connect Your Domain Button */}
          <div className="px-4 pt-3" style={{ backgroundColor: '#1e2155' }}>
            <button
              onClick={() => onViewChange('connect-domain')}
              className="w-full mb-3 py-2 bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold rounded transition-colors shadow"
            >
              Connect your domain
            </button>
          </div>
          {/* Settings and Theme Icons */}
          <div className="px-4 py-3 border-t border-white/20" style={{ backgroundColor: '#1e2155' }}>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => onViewChange('settings')}
                className={`p-2 rounded-lg transition-colors ${
                  activeView === 'settings'
                    ? 'bg-white/10 text-white'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
                title="Settings"
              >
                <SettingsIcon size={20} />
              </button>
              <button
                className="p-2 rounded-lg text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                title="Toggle Theme"
              >
                <ThemeIcon size={20} />
              </button>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-white/20" style={{ backgroundColor: '#1e2155' }}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Admin User</p>
                <p className="text-xs text-white/60 truncate">admin@codestam.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`} style={{ backgroundColor: '#1e2155' }}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-4" style={{ backgroundColor: '#1e2155' }}>
            <div className="flex items-center space-x-2 flex-1">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1">
                <img 
                  src="/images/logo.png" 
                  alt="Codestam Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-white font-bold text-xl">Codestam</span>
            </div>
            
            {/* Vertical Separator */}
            <div className="h-8 w-px bg-white/30 mx-2"></div>
            
            <div className="flex items-center space-x-2">
              {/* Notification Bell for Mobile */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-1 text-white hover:text-gray-200 transition-colors rounded"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 19V20H3V19L5 17V11C5 7.9 7 5.2 10 4.3V4C10 2.9 10.9 2 12 2S14 2.9 14 4V4.3C17 5.2 19 7.9 19 11V17L21 19ZM12 22C10.9 22 10 21.1 10 20H14C14 21.1 13.1 22 12 22Z"/>
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Mobile Notification Dropdown */}
                {showNotifications && (
                  <div 
                    data-notification-dropdown
                    className="fixed top-16 left-4 right-4 bg-white rounded-lg shadow-xl border border-gray-200 z-[70] max-h-96 overflow-hidden pointer-events-auto"
                    style={{ pointerEvents: 'auto' }}
                  >
                    <div className="p-3 border-b border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-semibold text-gray-900">Notifications</h3>
                        <span className="text-xs text-gray-500">{unreadCount} unread</span>
                      </div>
                      
                      {/* Mobile Filter Options */}
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                          >
                            <option value="all">All Departments</option>
                            <option value="sales">Sales</option>
                            <option value="finance">Finance</option>
                            <option value="inventory">Inventory</option>
                            <option value="hr">HR</option>
                            <option value="it">IT</option>
                            <option value="procurement">Procurement</option>
                            <option value="analytics">Analytics</option>
                            <option value="customer-service">Customer Service</option>
                          </select>
                          
                          <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                          >
                            <option value="all">All Priority</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </select>
                        </div>
                        
                        <select
                          value={notificationFilter}
                          onChange={(e) => setNotificationFilter(e.target.value)}
                          className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                        >
                          <option value="all">All Types</option>
                          <option value="alert">Alerts</option>
                          <option value="order">Orders</option>
                          <option value="payment">Payments</option>
                          <option value="customer">Customers</option>
                          <option value="system">System</option>
                          <option value="hr">HR</option>
                          <option value="finance">Finance</option>
                          <option value="it">IT</option>
                        </select>
                        
                        {/* Mobile Filter Summary */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{filteredNotifications.length} of {notifications.length}</span>
                          {(departmentFilter !== 'all' || priorityFilter !== 'all' || notificationFilter !== 'all') && (
                            <button
                              onClick={() => {
                                setDepartmentFilter('all');
                                setPriorityFilter('all');
                                setNotificationFilter('all');
                              }}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                      {filteredNotifications.slice(0, 6).map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 border-l-4 hover:bg-gray-50 transition-colors ${getPriorityColor(notification.priority)} ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            <div className={`p-1 rounded ${getTypeColor(notification.type)}`}>
                              {notification.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-medium text-gray-900 truncate">
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full ml-1"></div>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-3 border-t border-gray-200 bg-gray-50">
                      <div className="flex space-x-2">
                        <button className="flex-1 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors">
                          Mark All Read
                        </button>
                        <button className="flex-1 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 transition-colors">
                          View All
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6" style={{ backgroundColor: '#1e2155' }}>
            {/* Tools Section Header - Mobile */}
            <div className="flex items-center justify-between px-3 mb-3">
              <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                Tools
              </h3>
              <button
                onClick={() => {
                  // Add new tool functionality
                  const newToolName = prompt('Enter new tool name:');
                  if (newToolName) {
                    // Here you would typically add the new tool to your state/data
                    console.log('Adding new tool:', newToolName);
                  }
                }}
                className="p-1 text-white/40 hover:text-white/80 hover:bg-white/10 rounded transition-colors"
                title="Add new tool"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            
            {/* Main Menu Items with Scroll - Mobile */}
            <div className="max-h-64 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeView === item.id
                      ? 'bg-white/10 text-white'
                      : 'text-white/80 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.badge === 'NEW' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
            
            {/* My Tools Dropdown Section - Mobile */}
            <div className="pt-4 mt-4 border-t border-white/20">
              <button
                onClick={() => setShowMyTools(!showMyTools)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/5 hover:text-white transition-colors rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">T</span>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider">My Tools</span>
                </div>
                <svg 
                  className={`w-4 h-4 transition-transform ${showMyTools ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showMyTools && (
                <div className="mt-2 space-y-1 pl-4">
                  <button
                    onClick={() => {
                      onViewChange('hub-track-pro');
                      onClose();
                    }}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeView === 'hub-track-pro'
                        ? 'bg-white/10 text-white'
                        : 'text-white/80 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">H</span>
                      </div>
                      <span>Hub track pro</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      onViewChange('goku');
                      onClose();
                    }}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeView === 'goku'
                        ? 'bg-white/10 text-white'
                        : 'text-white/80 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-red-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">G</span>
                      </div>
                      <span>GOKU</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      onViewChange('gama');
                      onClose();
                    }}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeView === 'gama'
                        ? 'bg-white/10 text-white'
                        : 'text-white/80 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-teal-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">G</span>
                      </div>
                      <span>GAMA</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Connect Your Domain Button - Mobile */}
          <div className="px-4 pt-3" style={{ backgroundColor: '#1e2155' }}>
            <button
              onClick={() => {
                onViewChange('connect-domain');
                onClose();
              }}
              className="w-full mb-3 py-2 bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold rounded transition-colors shadow"
            >
              Connect your domain
            </button>
          </div>
          {/* Settings and Theme Icons */}
          <div className="px-4 py-3 border-t border-white/20" style={{ backgroundColor: '#1e2155' }}>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => {
                  onViewChange('settings');
                  onClose();
                }}
                className={`p-2 rounded-lg transition-colors ${
                  activeView === 'settings'
                    ? 'bg-white/10 text-white'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
                title="Settings"
              >
                <SettingsIcon size={20} />
              </button>
              <button
                className="p-2 rounded-lg text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                title="Toggle Theme"
              >
                <ThemeIcon size={20} />
              </button>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-white/20" style={{ backgroundColor: '#1e2155' }}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Admin User</p>
                <p className="text-xs text-white/60 truncate">admin@codestam.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;