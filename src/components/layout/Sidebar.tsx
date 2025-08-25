'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  UserIcon
} from '../Icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faGoogle } from '@fortawesome/free-brands-svg-icons';

const Sidebar = () => {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showMyTools, setShowMyTools] = useState(false);
  const [showAddToolModal, setShowAddToolModal] = useState(false);
  const [selectedToolId, setSelectedToolId] = useState<string>('hub-track-pro');

  // Define available tool presets
  const availableTools = [
    {
      id: 'hub-track-pro',
      name: 'Hub track pro',
      icon: 'H',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'goku',
      name: 'GOKU',
      icon: 'G',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'gama',
      name: 'GAMA',
      icon: 'G',
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'x-tool',
      name: 'X Tool',
      icon: 'X',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'alpha-tool',
      name: 'Alpha Tool',
      icon: 'A',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const [menuItems, setMenuItems] = useState([
    { id: 'dashboard', name: 'Dashboard', icon: <DashboardIcon size={20} />, badge: null, href: '/dashboard' },
    { id: 'sales', name: 'Sales', icon: <SalesIcon size={20} />, badge: '12', href: '/sales' },
    { id: 'inventory', name: 'Inventory', icon: <InventoryIcon size={20} />, badge: null, href: '/inventory' },
    { id: 'customers', name: 'Customers', icon: <CustomersIcon size={20} />, badge: '3', href: '/sales/customers' },
    { id: 'suppliers', name: 'Suppliers', icon: <SuppliersIcon size={20} />, badge: null, href: '/inventory/suppliers' },
    { id: 'finance', name: 'Finance', icon: <FinanceIcon size={20} />, badge: null, href: '/finance' },
    { id: 'reports', name: 'Reports', icon: <ReportsIcon size={20} />, badge: null, href: '/finance/reports' },
    { id: 'ai-insights', name: 'AI Insights', icon: <AIInsightsIcon size={20} />, badge: 'NEW', href: '/ai-insights' },
  ]);

  const [toolMenu, setToolMenu] = useState<string | null>(null);
  const [toolMenuPosition, setToolMenuPosition] = useState<{top: number, left: number} | null>(null);
  const builtinIds = ['dashboard','sales','inventory','customers','suppliers','finance','reports','ai-insights'];
  const buttonRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Close overlay on outside click
  useEffect(() => {
    if (!toolMenu) return;
    function onClick(e: MouseEvent) {
      // if click happens outside dropdown
      const dropdown = document.getElementById('overlay-tool-dropdown');
      if (dropdown && !dropdown.contains(e.target as Node)) {
        setToolMenu(null);
      }
    }
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, [toolMenu]);
  
  const [customTools] = useState([
    {
      id: 'hub-track-pro',
      name: 'Hub track pro',
      icon: 'H',
      color: 'from-purple-500 to-pink-500',
      href: '/tools/hub-track-pro'
    },
    {
      id: 'goku',
      name: 'GOKU',
      icon: 'G',
      color: 'from-orange-500 to-red-500',
      href: '/tools/goku'
    },
    {
      id: 'gama',
      name: 'GAMA',
      icon: 'G',
      color: 'from-green-500 to-teal-500',
      href: '/tools/gama'
    },
    {
      id: 'alpha-tool-custom',
      name: 'Alpha Tool',
      icon: 'A',
      color: 'from-blue-500 to-cyan-500',
      href: '/tools/alpha'
    },
    {
      id: 'beta-tool',
      name: 'Beta Tool',
      icon: 'B',
      color: 'from-yellow-500 to-orange-500',
      href: '/tools/beta'
    },
    {
      id: 'gamma-tool',
      name: 'Gamma Tool',
      icon: 'G',
      color: 'from-indigo-500 to-purple-500',
      href: '/tools/gamma'
    },
    {
      id: 'delta-tool',
      name: 'Delta Tool',
      icon: 'D',
      color: 'from-pink-500 to-rose-500',
      href: '/tools/delta'
    },
    {
      id: 'epsilon-tool',
      name: 'Epsilon Tool',
      icon: 'E',
      color: 'from-teal-500 to-green-500',
      href: '/tools/epsilon'
    },
    {
      id: 'zeta-tool',
      name: 'Zeta Tool',
      icon: 'Z',
      color: 'from-red-500 to-pink-500',
      href: '/tools/zeta'
    },
    {
      id: 'theta-tool',
      name: 'Theta Tool',
      icon: 'T',
      color: 'from-cyan-500 to-blue-500',
      href: '/tools/theta'
    }
  ]);
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

  const handleAddTool = () => {
    const tool = availableTools.find((item) => item.id === selectedToolId);
    if (tool && !menuItems.some(item => item.id === tool.id)) {
      const newTool = {
        id: tool.id,
        name: tool.name,
        icon: (
          <div className={`w-5 h-5 bg-gradient-to-r ${tool.color} rounded flex items-center justify-center`}>
            <span className="text-white text-xs font-bold">{tool.icon}</span>
          </div>
        ),
        badge: null,
        href: `/tools/${tool.id}`
      };
      setMenuItems([...menuItems, newTool]);
      setShowAddToolModal(false);
    }
  };

  const isActive = (href: string) => {
    // Exact match first
    if (pathname === href) {
      return true;
    }
    
    // Special handling for nested routes to prevent parent activation
    // when child routes are active
    
    // If we're checking /sales and current path is /sales/customers, don't activate /sales
    if (href === '/sales' && pathname.startsWith('/sales/')) {
      return false;
    }
    
    // If we're checking /inventory and current path is /inventory/suppliers, don't activate /inventory
    if (href === '/inventory' && pathname.startsWith('/inventory/')) {
      return false;
    }
    
    // If we're checking /finance and current path is /finance/reports, don't activate /finance
    if (href === '/finance' && pathname.startsWith('/finance/')) {
      return false;
    }
    
    // If we're checking /tools and current path is /tools/something, don't activate /tools
    if (href === '/tools' && pathname.startsWith('/tools/')) {
      return false;
    }
    
    // For all other cases, check if pathname starts with href
    return pathname.startsWith(href + '/');
  };

  return (
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
                          <p className="text-sm text-gray-600 mt-1 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
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
              onClick={() => setShowAddToolModal(true)}
              className="p-1 text-white/40 hover:text-white/80 hover:bg-white/10 rounded transition-colors"
              title="Add new tool"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          {/* Main Menu Items with Scroll */}
          <div className="max-h-64 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {menuItems.map((item) => {
              const isCustom = !builtinIds.includes(item.id);
              const active = isActive(item.href);
              return (
                <div key={item.id} className="relative group flex items-center">
                  <Link
                    href={item.href}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      active
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
                  </Link>
                  {isCustom && (
                    <div
                      className="ml-1 mr-2"
                      ref={el => { buttonRefs.current[item.id] = el; }}
                    >
                      <button
                        tabIndex={0}
                        className="p-1 rounded-full hover:bg-white/15 focus:bg-white/20 focus:outline-none"
                        aria-label="Tool actions"
                        onClick={e => {
                          e.stopPropagation();
                          const el = buttonRefs.current[item.id];
                          if (el) {
                            const rect = el.getBoundingClientRect();
                            setToolMenu(item.id);
                            setToolMenuPosition({ top: rect.bottom + 4, left: rect.left });
                          } else {
                            setToolMenu(item.id);
                          }
                        }}
                      >
                        <svg className="w-4 h-4 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                          <circle cx="4" cy="10" r="1.2"/>
                          <circle cx="10" cy="10" r="1.2"/>
                          <circle cx="16" cy="10" r="1.2"/>
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* My Tools Dropdown Section */}
          <div className="pt-4 mt-4 border-t border-white/20">
            <button
              onClick={e => {
                setShowMyTools(!showMyTools);
                if (!showMyTools) {
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  setToolMenuPosition({ top: rect.bottom + 4, left: rect.left });
                }
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/5 hover:text-white transition-colors rounded-lg"
              id="my-tools-toggle-btn"
            >
              <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">My Tools</span>
              <svg 
                className={`w-4 h-4 transition-transform ${showMyTools ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {/* Use Portal for My Tools dropdown on desktop */}
            {showMyTools && toolMenuPosition && typeof window !== 'undefined' && createPortal(
              <div
                className="fixed z-[9999] mt-2 pl-4 h-40 overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent bg-white border border-gray-300 rounded shadow"
                style={{
                  top: toolMenuPosition.top,
                  left: toolMenuPosition.left,
                  width: '230px',
                }}
              >
                {customTools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    onClick={() => setShowMyTools(false)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive(tool.href)
                        ? 'bg-white/10 text-blue-800 border-r-2 border-blue-800'
                        : 'text-gray-900 hover:bg-blue-50 hover:text-blue-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 bg-gradient-to-r ${tool.color} rounded flex items-center justify-center`}>
                        <span className="text-white text-xs font-bold">{tool.icon}</span>
                      </div>
                      <span>{tool.name}</span>
                    </div>
                  </Link>
                ))}
              </div>,
              document.body
            )}
          </div>

          {/* Socials Section */}
          <div className="pt-4 mt-4 border-t border-white/20">
            <div className="flex items-center justify-between px-3 mb-3">
              <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                Socials
              </h3>
            </div>
            
            <div className="space-y-2 px-3">
              <Link
                href="/whatsapp"
                className={`w-full flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                  isActive('/whatsapp')
                    ? 'bg-white/10 text-white border-r-2 border-white'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4 text-green-400" />
                  <span>WhatsApp</span>
                </div>
              </Link>
              
              <Link
                href="/gmail"
                className={`w-full flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                  isActive('/gmail')
                    ? 'bg-white/10 text-white border-r-2 border-white'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={faGoogle} className="w-4 h-4 text-red-400" />
                  <span>Gmail</span>
                </div>
              </Link>
            </div>
          </div>
        </nav>

        {/* TODO and Calendar Buttons */}
        <div className="px-4 pt-3" style={{ backgroundColor: '#1e2155' }}>
          <div className="flex space-x-2 mb-3">
            <Link
              href="/todo"
              className={`flex-1 py-2 text-white text-sm font-semibold rounded transition-colors shadow text-center ${
                isActive('/todo')
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-purple-500 hover:bg-purple-600'
              }`}
            >
              TODO
            </Link>
            <Link
              href="/calendar"
              className={`flex-1 py-2 text-white text-sm font-semibold rounded transition-colors shadow text-center ${
                isActive('/calendar')
                  ? 'bg-orange-600 hover:bg-orange-700'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              Calendar
            </Link>
          </div>
        </div>

        {/* Connect Your Domain Button */}
        <div className="px-4" style={{ backgroundColor: '#1e2155' }}>
          <Link
            href="/settings/domain"
            className="w-full mb-3 py-2 bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold rounded transition-colors shadow block text-center"
          >
            Connect your domain
          </Link>
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

      {/* Add Tool Modal */}
      {showAddToolModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add New Tool</h3>
                <button
                  onClick={() => {
                    setShowAddToolModal(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select a Tool
                </label>
                <div className="grid gap-2">
                  {availableTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setSelectedToolId(tool.id)}
                      className={`flex items-center px-3 py-2 rounded border transition-colors w-full text-left ${selectedToolId === tool.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                    >
                      <div className={`w-5 h-5 bg-gradient-to-r ${tool.color} rounded flex items-center justify-center mr-3`}>
                        <span className="text-white text-xs font-bold">{tool.icon}</span>
                      </div>
                      <span className="font-medium">{tool.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAddToolModal(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTool}
                  disabled={!selectedToolId || menuItems.some(item => item.id === selectedToolId)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-md transition-colors"
                >
                  Add Tool
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {toolMenu && toolMenuPosition && createPortal(
        <div
          id="overlay-tool-dropdown"
          className="fixed z-[9999] w-40 bg-white rounded shadow border border-gray-200 py-1"
          style={{ top: toolMenuPosition.top, left: toolMenuPosition.left, minWidth: 160 }}
        >
          <button
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => { alert('Option 1'); setToolMenu(null); }}
          >Option 1</button>
          <button
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => { alert('Option 2'); setToolMenu(null); }}
          >Option 2</button>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Sidebar;