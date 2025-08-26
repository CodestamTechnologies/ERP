'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  DashboardIcon, SalesIcon, InventoryIcon, CustomersIcon, SuppliersIcon, 
  FinanceIcon, ReportsIcon, AIInsightsIcon, SettingsIcon, NotificationIcon,
  OrderIcon, PaymentIcon, WarningIcon, UserIcon
} from '../Icons';
import { Mail, Calendar, CheckSquare, Globe } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useAuth } from '@/context/authContext';
import SecondarySidebar, { SecondarySidebarConfig } from './SecondarySidebar';
import { emailServicesConfig, messagingServicesConfig, reportsServicesConfig } from '@/lib/sidebar-configs';

// Types
interface MenuItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  badge: string | null;
  href: string;
  hasSecondary?: boolean;
  onClick?: () => void;
}

interface Tool {
  id: string;
  name: string;
  icon: string;
  color: string;
  href?: string;
}

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  icon: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
  read: boolean;
  department: string;
}

// Constants
const BUILTIN_IDS = ['dashboard', 'sales', 'inventory', 'customers', 'suppliers', 'finance', 'documents', 'ai-insights'];

const AVAILABLE_TOOLS: Tool[] = [
  { id: 'hub-track-pro', name: 'Hub track pro', icon: 'H', color: 'from-purple-500 to-pink-500' },
  { id: 'goku', name: 'GOKU', icon: 'G', color: 'from-orange-500 to-red-500' },
  { id: 'gama', name: 'GAMA', icon: 'G', color: 'from-green-500 to-teal-500' },
  { id: 'x-tool', name: 'X Tool', icon: 'X', color: 'from-blue-500 to-cyan-500' },
  { id: 'alpha-tool', name: 'Alpha Tool', icon: 'A', color: 'from-yellow-500 to-orange-500' },
];

const CUSTOM_TOOLS: (Tool & { href: string })[] = [
  { id: 'hub-track-pro', name: 'Hub track pro', icon: 'H', color: 'from-purple-500 to-pink-500', href: '/tools/hub-track-pro' },
  { id: 'goku', name: 'GOKU', icon: 'G', color: 'from-orange-500 to-red-500', href: '/tools/goku' },
  { id: 'gama', name: 'GAMA', icon: 'G', color: 'from-green-500 to-teal-500', href: '/tools/gama' },
  { id: 'alpha-tool-custom', name: 'Alpha Tool', icon: 'A', color: 'from-blue-500 to-cyan-500', href: '/tools/alpha' },
  { id: 'beta-tool', name: 'Beta Tool', icon: 'B', color: 'from-yellow-500 to-orange-500', href: '/tools/beta' },
  { id: 'gamma-tool', name: 'Gamma Tool', icon: 'G', color: 'from-indigo-500 to-purple-500', href: '/tools/gamma' },
  { id: 'delta-tool', name: 'Delta Tool', icon: 'D', color: 'from-pink-500 to-rose-500', href: '/tools/delta' },
  { id: 'epsilon-tool', name: 'Epsilon Tool', icon: 'E', color: 'from-teal-500 to-green-500', href: '/tools/epsilon' },
  { id: 'zeta-tool', name: 'Zeta Tool', icon: 'Z', color: 'from-red-500 to-pink-500', href: '/tools/zeta' },
  { id: 'theta-tool', name: 'Theta Tool', icon: 'T', color: 'from-cyan-500 to-blue-500', href: '/tools/theta' },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1, type: 'alert', title: 'Low Stock Alert', message: 'MacBook Pro inventory is running low (5 units remaining)', time: '5 minutes ago', icon: <WarningIcon size={16} />, priority: 'high', read: false, department: 'inventory' },
  { id: 2, type: 'order', title: 'New Order Received', message: 'Order #ORD-2024-001 from TechCorp Solutions (₹1,25,000)', time: '15 minutes ago', icon: <OrderIcon size={16} />, priority: 'medium', read: false, department: 'sales' },
  { id: 3, type: 'payment', title: 'Payment Received', message: 'Payment of ₹2,50,000 received from Global Enterprises', time: '1 hour ago', icon: <PaymentIcon size={16} />, priority: 'medium', read: true, department: 'finance' },
  { id: 4, type: 'customer', title: 'New Customer Registration', message: 'Innovation Labs has registered as a new customer', time: '2 hours ago', icon: <UserIcon size={16} />, priority: 'low', read: true, department: 'sales' },
  { id: 5, type: 'system', title: 'AI Insights Updated', message: 'New AI insights available for Q1 sales forecast', time: '3 hours ago', icon: <AIInsightsIcon size={16} />, priority: 'medium', read: true, department: 'analytics' },
];

// Utility functions
const getColorClasses = {
  priority: (priority: string) => ({
    high: 'border-l-red-500 bg-red-50',
    medium: 'border-l-yellow-500 bg-yellow-50',
    low: 'border-l-green-500 bg-green-50',
  }[priority] || 'border-l-gray-500 bg-gray-50'),
  
  type: (type: string) => ({
    alert: 'text-red-600',
    order: 'text-blue-600',
    payment: 'text-green-600',
    customer: 'text-purple-600',
    system: 'text-indigo-600',
  }[type] || 'text-gray-600'),
};

// Custom hooks
const useClickOutside = (ref: React.RefObject<HTMLElement>, callback: () => void, active = true) => {
  useEffect(() => {
    if (!active) return;
    
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element;
      if (target.tagName === 'SELECT' || target.tagName === 'OPTION') return;
      
      const notificationDropdown = document.querySelector('[data-notification-dropdown]');
      if (notificationDropdown?.contains(target)) return;
      
      if (ref.current && !ref.current.contains(target)) callback();
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, callback, active]);
};

const useRouteActive = () => {
  const pathname = usePathname();
  
  return (href: string) => {
    if (pathname === href) return true;
    
    const excludeParentRoutes = ['/sales', '/inventory', '/finance', '/tools'];
    if (excludeParentRoutes.some(route => route === href && pathname.startsWith(`${href}/`))) {
      return false;
    }
    
    return pathname.startsWith(`${href}/`);
  };
};

// Components
const FilterSelect = ({ value, onChange, options, placeholder }: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
  >
    {placeholder && <option value="all">{placeholder}</option>}
    {options.map(option => (
      <option key={option.value} value={option.value}>{option.label}</option>
    ))}
  </select>
);

const NotificationItem = ({ notification }: { notification: Notification }) => (
  <div className={`p-4 border-l-4 hover:bg-gray-50 transition-colors ${getColorClasses.priority(notification.priority)} ${!notification.read ? 'bg-blue-50' : ''}`}>
    <div className="flex items-start space-x-3">
      <div className={`p-1 rounded ${getColorClasses.type(notification.type)}`}>
        {notification.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900 truncate">{notification.title}</h4>
          {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>}
        </div>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
        <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
      </div>
    </div>
  </div>
);

const MenuItemComponent = ({ item, isActive, onSecondaryClick }: {
  item: MenuItem;
  isActive: boolean;
  onSecondaryClick?: (item: MenuItem, e: React.MouseEvent) => void;
}) => {
  const baseClasses = "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors";
  const activeClasses = isActive ? "bg-white/10 text-white border-r-2 border-white" : "text-white/80 hover:bg-white/5 hover:text-white";
  
  const content = (
    <>
      <div className="flex items-center space-x-3">
        <span>{item.icon}</span>
        <span>{item.name}</span>
      </div>
      {item.badge && (
        <span className={`px-2 py-1 text-xs rounded-full ${item.badge === 'NEW' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {item.badge}
        </span>
      )}
    </>
  );

  if (item.hasSecondary) {
    return (
      <button onClick={(e) => onSecondaryClick?.(item, e)} className={`${baseClasses} ${activeClasses}`}>
        {content}
      </button>
    );
  }

  if (item.onClick) {
    return (
      <button onClick={item.onClick} className={`${baseClasses} ${activeClasses}`}>
        {content}
      </button>
    );
  }

  return (
    <Link href={item.href} className={`${baseClasses} ${activeClasses}`}>
      {content}
    </Link>
  );
};

const ToolIcon = ({ tool }: { tool: Tool }) => (
  <div className={`w-5 h-5 bg-gradient-to-r ${tool.color} rounded flex items-center justify-center`}>
    <span className="text-white text-xs font-bold">{tool.icon}</span>
  </div>
);

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const isActive = useRouteActive();
  
  // State
  const [state, setState] = useState({
    showNotifications: false,
    notificationFilter: 'all',
    departmentFilter: 'all',
    priorityFilter: 'all',
    showMyTools: false,
    showAddToolModal: false,
    selectedToolId: 'hub-track-pro',
    showProfileMenu: false,
    showSecondarySidebar: false,
    toolMenuPosition: null as { top: number; left: number } | null,
  });
  
  const [secondarySidebarConfig, setSecondarySidebarConfig] = useState<SecondarySidebarConfig | null>(null);
  
  // Refs
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Event handlers
  const updateState = (updates: Partial<typeof state>) => setState(prev => ({ ...prev, ...updates }));

  const handleOpenSecondarySidebar = (config: SecondarySidebarConfig) => {
    setSecondarySidebarConfig(config);
    updateState({ showSecondarySidebar: true });
  };

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: 'dashboard', name: 'Dashboard', icon: <DashboardIcon size={20} />, badge: null, href: '/dashboard' },
    { id: 'sales', name: 'Sales', icon: <SalesIcon size={20} />, badge: '12', href: '/sales' },
    { id: 'inventory', name: 'Inventory', icon: <InventoryIcon size={20} />, badge: null, href: '/inventory' },
    { id: 'customers', name: 'Customers', icon: <CustomersIcon size={20} />, badge: '3', href: '/customers' },
    { id: 'suppliers', name: 'Suppliers', icon: <SuppliersIcon size={20} />, badge: null, href: '/suppliers' },
    { id: 'finance', name: 'Finance', icon: <FinanceIcon size={20} />, badge: null, href: '/finance' },
    { id: 'documents', name: 'Documents', icon: <ReportsIcon size={20} />, badge: null, href: '/documents', hasSecondary: true },
    { id: 'ai-insights', name: 'AI Insights', icon: <AIInsightsIcon size={20} />, badge: 'NEW', href: '/ai-insights' },
    // Socials options merged
    { id: 'whatsapp', name: 'WhatsApp', icon: <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5 text-green-400" />, badge: null, href: '#', onClick: () => handleOpenSecondarySidebar(messagingServicesConfig) },
    { id: 'email', name: 'Email', icon: <Mail className="w-5 h-5 text-red-400" />, badge: null, href: '#', onClick: () => handleOpenSecondarySidebar(emailServicesConfig) },
    // Others options merged
    { id: 'todo', name: 'TODO', icon: <CheckSquare className="w-5 h-5 text-purple-400" />, badge: null, href: '/todo' },
    { id: 'calendar', name: 'Calendar', icon: <Calendar className="w-5 h-5 text-orange-400" />, badge: null, href: '/calendar' },
    { id: 'connect-domain', name: 'Connect Domain', icon: <Globe className="w-5 h-5 text-blue-400" />, badge: null, href: '/settings/domain' },
  ]);

  // Computed values
  const filteredNotifications = useMemo(() => 
    MOCK_NOTIFICATIONS.filter(notification => {
      const matchesType = state.notificationFilter === 'all' || notification.type === state.notificationFilter;
      const matchesDepartment = state.departmentFilter === 'all' || notification.department === state.departmentFilter;
      const matchesPriority = state.priorityFilter === 'all' || notification.priority === state.priorityFilter;
      return matchesType && matchesDepartment && matchesPriority;
    }), 
    [state.notificationFilter, state.departmentFilter, state.priorityFilter]
  );

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleMenuItemClick = (item: MenuItem, e: React.MouseEvent) => {
    if (item.hasSecondary) {
      e.preventDefault();
      if (item.id === 'documents') {
        handleOpenSecondarySidebar(reportsServicesConfig);
      }
    }
  };

  const handleAddTool = () => {
    const tool = AVAILABLE_TOOLS.find(item => item.id === state.selectedToolId);
    if (tool && !menuItems.some(item => item.id === tool.id)) {
      const newTool: MenuItem = {
        id: tool.id,
        name: tool.name,
        icon: <ToolIcon tool={tool} />,
        badge: null,
        href: `/tools/${tool.id}`
      };
      setMenuItems([...menuItems, newTool]);
      updateState({ showAddToolModal: false });
    }
  };

  const clearFilters = () => updateState({
    departmentFilter: 'all',
    priorityFilter: 'all',
    notificationFilter: 'all'
  });

  // Click outside handlers
  useClickOutside(profileMenuRef, () => updateState({ showProfileMenu: false }), state.showProfileMenu);
  useClickOutside(notificationRef, () => updateState({ showNotifications: false }), state.showNotifications);

  // Filter options
  const filterOptions = {
    departments: [
      { value: 'sales', label: 'Sales' },
      { value: 'finance', label: 'Finance' },
      { value: 'inventory', label: 'Inventory' },
      { value: 'hr', label: 'HR' },
      { value: 'it', label: 'IT' },
      { value: 'procurement', label: 'Procurement' },
      { value: 'analytics', label: 'Analytics' },
      { value: 'customer-service', label: 'Customer Service' },
    ],
    priorities: [
      { value: 'high', label: 'High' },
      { value: 'medium', label: 'Medium' },
      { value: 'low', label: 'Low' },
    ],
    types: [
      { value: 'alert', label: 'Alerts' },
      { value: 'order', label: 'Orders' },
      { value: 'payment', label: 'Payments' },
      { value: 'customer', label: 'Customers' },
      { value: 'system', label: 'System' },
      { value: 'hr', label: 'HR' },
      { value: 'finance', label: 'Finance' },
      { value: 'it', label: 'IT' },
    ],
  };

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 relative z-40" style={{ backgroundColor: '#1e2155' }}>
        {/* Header */}
        <div className="flex items-center h-16 px-4" style={{ backgroundColor: '#1e2155' }}>
          <div className="flex items-center space-x-2 flex-1">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1">
              <img src="/images/logo.png" alt="Codestam Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-white font-bold text-xl">Codestam</span>
          </div>
          
          <div className="h-8 w-px bg-white/30 mx-3"></div>
          
          {/* Notification Bell */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => updateState({ showNotifications: !state.showNotifications })}
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
            {state.showNotifications && (
              <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                    <span className="text-sm text-gray-500">{unreadCount} unread</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <FilterSelect
                        value={state.departmentFilter}
                        onChange={(value) => updateState({ departmentFilter: value })}
                        options={filterOptions.departments}
                        placeholder="All Departments"
                      />
                      <FilterSelect
                        value={state.priorityFilter}
                        onChange={(value) => updateState({ priorityFilter: value })}
                        options={filterOptions.priorities}
                        placeholder="All Priority"
                      />
                      <FilterSelect
                        value={state.notificationFilter}
                        onChange={(value) => updateState({ notificationFilter: value })}
                        options={filterOptions.types}
                        placeholder="All Types"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Showing {filteredNotifications.length} of {MOCK_NOTIFICATIONS.length} notifications</span>
                      {(state.departmentFilter !== 'all' || state.priorityFilter !== 'all' || state.notificationFilter !== 'all') && (
                        <button onClick={clearFilters} className="text-blue-600 hover:text-blue-800">
                          Clear filters
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {filteredNotifications.map(notification => (
                    <NotificationItem key={notification.id} notification={notification} />
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
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">Tools</h3>
            <button
              onClick={() => updateState({ showAddToolModal: true })}
              className="p-1 text-white/40 hover:text-white/80 hover:bg-white/10 rounded transition-colors"
              title="Add new tool"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          {/* All Menu Items - Increased Height */}
          <div className="h-96 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {menuItems.map((item) => {
              let active = false;
              
              // Handle different types of active states
              if (item.hasSecondary && item.id === 'documents') {
                active = state.showSecondarySidebar && secondarySidebarConfig?.title === 'Document Types';
              } else if (item.onClick && (item.id === 'whatsapp' || item.id === 'email')) {
                // WhatsApp and Email are active when their respective secondary sidebars are open
                active = state.showSecondarySidebar && (
                  (item.id === 'whatsapp' && secondarySidebarConfig?.title === 'Messaging Services') ||
                  (item.id === 'email' && secondarySidebarConfig?.title === 'Email Services')
                );
              } else if (item.href && item.href !== '' && item.href !== '#') {
                active = isActive(item.href);
              }
              
              return (
                <MenuItemComponent
                  key={item.id}
                  item={item}
                  isActive={active}
                  onSecondaryClick={handleMenuItemClick}
                />
              );
            })}
          </div>
        </nav>

        {/* My Tools Section - Moved to Bottom */}
        <div className="px-4 pb-4 border-t border-white/20" style={{ backgroundColor: '#1e2155' }}>
          <button
            onClick={e => {
              const newShowMyTools = !state.showMyTools;
              updateState({ showMyTools: newShowMyTools });
              if (newShowMyTools) {
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                updateState({ toolMenuPosition: { top: rect.top - 160, left: rect.left } });
              }
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/5 hover:text-white transition-colors rounded-lg mt-4"
          >
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">My Tools</span>
            <svg className={`w-4 h-4 transition-transform ${state.showMyTools ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {state.showMyTools && state.toolMenuPosition && typeof window !== 'undefined' && createPortal(
            <div
              className="fixed z-[9999] mt-2 pl-4 h-40 overflow-y-auto space-y-1 pr-2 bg-white border border-gray-300 rounded shadow"
              style={{ top: state.toolMenuPosition.top, left: state.toolMenuPosition.left, width: '230px' }}
            >
              {CUSTOM_TOOLS.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.href}
                  onClick={() => updateState({ showMyTools: false })}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(tool.href) ? 'bg-white/10 text-blue-800 border-r-2 border-blue-800' : 'text-gray-900 hover:bg-blue-50 hover:text-blue-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <ToolIcon tool={tool} />
                    <span>{tool.name}</span>
                  </div>
                </Link>
              ))}
            </div>,
            document.body
          )}
        </div>
        
        {/* User Profile */}
        <div className="p-4 border-t border-white/20 relative" style={{ backgroundColor: '#1e2155' }} ref={profileMenuRef}>
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => updateState({ showProfileMenu: !state.showProfileMenu })}>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
              ) : (
                <span className="text-white text-sm font-medium">
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.displayName || 'User'}</p>
              <p className="text-xs text-white/60 truncate">{user?.email || 'No email'}</p>
            </div>
            <svg className={`w-4 h-4 text-white/60 transition-transform ${state.showProfileMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {state.showProfileMenu && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-md shadow-lg overflow-hidden z-50">
              {[
                { href: '/profile', label: 'Profile Settings' },
                { href: '/settings', label: 'Account Settings' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => updateState({ showProfileMenu: false })}
                >
                  {label}
                </Link>
              ))}
              <button
                onClick={() => {
                  updateState({ showProfileMenu: false });
                  handleSignOut();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals and Portals */}
      {state.showAddToolModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add New Tool</h3>
                <button onClick={() => updateState({ showAddToolModal: false })} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select a Tool</label>
                <div className="grid gap-2">
                  {AVAILABLE_TOOLS.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => updateState({ selectedToolId: tool.id })}
                      className={`flex items-center px-3 py-2 rounded border transition-colors w-full text-left ${
                        state.selectedToolId === tool.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <ToolIcon tool={tool} />
                      <span className="font-medium ml-3">{tool.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => updateState({ showAddToolModal: false })}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTool}
                  disabled={!state.selectedToolId || menuItems.some(item => item.id === state.selectedToolId)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-md transition-colors"
                >
                  Add Tool
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {secondarySidebarConfig && typeof window !== 'undefined' && createPortal(
        <SecondarySidebar
          isOpen={state.showSecondarySidebar}
          onClose={() => updateState({ showSecondarySidebar: false, secondarySidebarConfig: null })}
          config={secondarySidebarConfig}
        />,
        document.body
      )}
    </div>
  );
};

export default Sidebar;