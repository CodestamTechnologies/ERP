'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Mail, Calendar, CheckSquare, Globe } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

import { 
  DashboardIcon, SalesIcon, InventoryIcon, CustomersIcon, SuppliersIcon, 
  FinanceIcon, ReportsIcon, AIInsightsIcon, NotificationIcon, WebsiteIcon
} from '../Icons';
import { useAuth } from '@/context/authContext';
import SecondarySidebar, { SecondarySidebarConfig } from './SecondarySidebar';
import { emailServicesConfig, messagingServicesConfig, reportsServicesConfig, financeServicesConfig } from '@/lib/sidebar-configs';
import { NotificationPanel, type Notification } from '@/components/ui/notification-panel';

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

interface SidebarState {
  showNotifications: boolean;
  showMyTools: boolean;
  showAddToolModal: boolean;
  selectedToolId: string;
  showProfileMenu: boolean;
  showSecondarySidebar: boolean;
  toolMenuPosition: { top: number; left: number } | null;
}

// Constants
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
];

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1', type: 'warning', title: 'Low Stock Alert',
    message: 'MacBook Pro inventory is running low (5 units remaining).',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), read: false, starred: false,
    department: 'inventory', priority: 'high', actionUrl: '/inventory/products/macbook-pro'
  },
  {
    id: '2', type: 'success', title: 'New Order Received',
    message: 'Order #ORD-2024-001 from TechCorp Solutions worth ₹1,25,000.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), read: false, starred: true,
    department: 'sales', priority: 'medium', actionUrl: '/sales/orders/ORD-2024-001'
  },
  {
    id: '3', type: 'success', title: 'Payment Received',
    message: 'Payment of ₹2,50,000 received from Global Enterprises.',
    timestamp: new Date(Date.now() - 60 * 60 * 1000), read: true, starred: false,
    department: 'finance', priority: 'medium', actionUrl: '/finance/payments/PAY-2024-089'
  },
  {
    id: '4', type: 'error', title: 'System Backup Failed',
    message: 'Automated system backup failed. Manual intervention required.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), read: false, starred: false,
    department: 'it', priority: 'high', actionUrl: '/settings/backup'
  }
];

// Custom Hooks
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

const useSmartPosition = (triggerRef: React.RefObject<HTMLElement>, isOpen: boolean) => {
  const [position, setPosition] = useState({ top: 0, left: 0, right: 'auto' });

  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const updatePosition = () => {
      const triggerRect = triggerRef.current!.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const panelWidth = 384;
      const panelHeight = 500;

      let top = triggerRect.bottom + 8;
      let left = triggerRect.left;
      let right = 'auto';

      // Handle horizontal overflow
      if (left + panelWidth > viewportWidth - 20) {
        right = viewportWidth - triggerRect.right;
        left = 'auto' as any;
      }
      if (typeof left === 'number' && left < 20) left = 20;

      // Handle vertical overflow
      if (top + panelHeight > viewportHeight - 20) {
        top = triggerRect.top - panelHeight - 8;
        if (top < 20) top = 20;
      }

      setPosition({ top, left: left as number, right: right as string });
    };

    updatePosition();
    const cleanup = () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
    
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    return cleanup;
  }, [isOpen, triggerRef]);

  return position;
};

// Components
const ToolIcon = ({ tool }: { tool: Tool }) => (
  <div className={`w-5 h-5 bg-gradient-to-r ${tool.color} rounded flex items-center justify-center`}>
    <span className="text-white text-xs font-bold">{tool.icon}</span>
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
    return <button onClick={(e) => onSecondaryClick?.(item, e)} className={`${baseClasses} ${activeClasses}`}>{content}</button>;
  }
  if (item.onClick) {
    return <button onClick={item.onClick} className={`${baseClasses} ${activeClasses}`}>{content}</button>;
  }
  return <Link href={item.href} className={`${baseClasses} ${activeClasses}`}>{content}</Link>;
};

const NotificationBell = ({ 
  unreadCount, 
  onClick, 
  triggerRef 
}: { 
  unreadCount: number; 
  onClick: () => void; 
  triggerRef: React.RefObject<HTMLButtonElement>; 
}) => (
  <button
    ref={triggerRef}
    onClick={onClick}
    className="relative p-2 text-white hover:text-gray-200 transition-colors rounded-lg hover:bg-white/10"
  >
    <NotificationIcon size={20} />
    {unreadCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse font-medium">
        {unreadCount > 9 ? '9+' : unreadCount}
      </span>
    )}
  </button>
);

const UserProfile = ({ 
  user, 
  showProfileMenu, 
  onToggleMenu, 
  onSignOut, 
  profileMenuRef 
}: {
  user: any;
  showProfileMenu: boolean;
  onToggleMenu: () => void;
  onSignOut: () => void;
  profileMenuRef: React.RefObject<HTMLDivElement>;
}) => (
  <div className="p-4 border-t border-white/20 relative" style={{ backgroundColor: '#1e2155' }} ref={profileMenuRef}>
    <div className="flex items-center space-x-3 cursor-pointer" onClick={onToggleMenu}>
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
      <svg className={`w-4 h-4 text-white/60 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    {showProfileMenu && (
      <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-md shadow-lg overflow-hidden z-50">
        <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={onToggleMenu}>
          Profile Settings
        </Link>
        <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={onToggleMenu}>
          Account Settings
        </Link>
        <button onClick={onSignOut} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
          Sign Out
        </button>
      </div>
    )}
  </div>
);

// Main Sidebar Component
const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const isActive = useRouteActive();
  
  // State
  const [state, setState] = useState<SidebarState>({
    showNotifications: false,
    showMyTools: false,
    showAddToolModal: false,
    selectedToolId: 'hub-track-pro',
    showProfileMenu: false,
    showSecondarySidebar: false,
    toolMenuPosition: null,
  });
  
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [secondarySidebarConfig, setSecondarySidebarConfig] = useState<SecondarySidebarConfig | null>(null);
  
  // Refs
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const notificationTriggerRef = useRef<HTMLButtonElement>(null);

  // Smart positioning for notification panel
  const notificationPosition = useSmartPosition(notificationTriggerRef, state.showNotifications);

  // Menu Items
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: 'dashboard', name: 'Dashboard', icon: <DashboardIcon size={20} />, badge: null, href: '/dashboard' },
    { id: 'sales', name: 'Sales', icon: <SalesIcon size={20} />, badge: '12', href: '/sales' },
    { id: 'inventory', name: 'Inventory', icon: <InventoryIcon size={20} />, badge: null, href: '/inventory' },
    { id: 'customers', name: 'Customers', icon: <CustomersIcon size={20} />, badge: '3', href: '/customers' },
    { id: 'suppliers', name: 'Suppliers', icon: <SuppliersIcon size={20} />, badge: null, href: '/suppliers' },
    { id: 'finance', name: 'Finance', icon: <FinanceIcon size={20} />, badge: null, href: '/finance', hasSecondary: true },
    { id: 'documents', name: 'Documents', icon: <ReportsIcon size={20} />, badge: null, href: '/documents', hasSecondary: true },
    { id: 'ai-insights', name: 'AI Insights', icon: <AIInsightsIcon size={20} />, badge: 'NEW', href: '/ai-insights' },
    { id: 'whatsapp', name: 'WhatsApp', icon: <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5 text-green-400" />, badge: null, href: '#', onClick: () => handleOpenSecondarySidebar(messagingServicesConfig) },
    { id: 'email', name: 'Email', icon: <Mail className="w-5 h-5 text-red-400" />, badge: null, href: '#', onClick: () => handleOpenSecondarySidebar(emailServicesConfig) },
    { id: 'todo', name: 'TODO', icon: <CheckSquare className="w-5 h-5 text-purple-400" />, badge: null, href: '/todo' },
    { id: 'calendar', name: 'Calendar', icon: <Calendar className="w-5 h-5 text-orange-400" />, badge: null, href: '/calendar' },
    { id: 'connect-domain', name: 'Connect Domain', icon: <Globe className="w-5 h-5 text-blue-400" />, badge: null, href: '/settings/domain' },
    { id: 'website', name: 'Website', icon: <WebsiteIcon size={20} />, badge: null, href: '/website' },
  ]);

  // Event Handlers
  const updateState = (updates: Partial<SidebarState>) => setState(prev => ({ ...prev, ...updates }));

  const handleOpenSecondarySidebar = (config: SecondarySidebarConfig) => {
    setSecondarySidebarConfig(config);
    updateState({ showSecondarySidebar: true });
  };

  const handleMenuItemClick = (item: MenuItem, e: React.MouseEvent) => {
    if (item.hasSecondary) {
      e.preventDefault();
      if (item.id === 'documents') handleOpenSecondarySidebar(reportsServicesConfig);
      else if (item.id === 'finance') handleOpenSecondarySidebar(financeServicesConfig);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Notification Handlers
  const handleMarkAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const handleMarkAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const handleDeleteNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));
  const handleStarNotification = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, starred: !n.starred } : n));
  const handleNotificationAction = (notification: Notification) => {
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
      updateState({ showNotifications: false });
      handleMarkAsRead(notification.id);
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

  // Computed Values
  const unreadCount = notifications.filter(n => !n.read).length;

  // Click outside handlers
  useClickOutside(profileMenuRef, () => updateState({ showProfileMenu: false }), state.showProfileMenu);
  useClickOutside(notificationRef, () => updateState({ showNotifications: false }), state.showNotifications);

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
          
          <div className="relative" ref={notificationRef}>
            <NotificationBell 
              unreadCount={unreadCount}
              onClick={() => updateState({ showNotifications: !state.showNotifications })}
              triggerRef={notificationTriggerRef}
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6" style={{ backgroundColor: '#1e2155' }}>
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
          
          <div className="h-96 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {menuItems.map((item) => {
              let active = false;
              
              if (item.hasSecondary && item.id === 'documents') {
                active = state.showSecondarySidebar && secondarySidebarConfig?.title === 'Document Types';
              } else if (item.hasSecondary && item.id === 'finance') {
                active = state.showSecondarySidebar && secondarySidebarConfig?.title === 'Finance Management';
              } else if (item.onClick && (item.id === 'whatsapp' || item.id === 'email')) {
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

        {/* My Tools Section */}
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
        <UserProfile
          user={user}
          showProfileMenu={state.showProfileMenu}
          onToggleMenu={() => updateState({ showProfileMenu: !state.showProfileMenu })}
          onSignOut={() => {
            updateState({ showProfileMenu: false });
            handleSignOut();
          }}
          profileMenuRef={profileMenuRef}
        />
      </div>

      {/* Notification Panel */}
      {state.showNotifications && typeof window !== 'undefined' && createPortal(
        <div 
          className="fixed z-[9999]"
          style={{
            top: `${notificationPosition.top}px`,
            left: notificationPosition.left !== 'auto' ? `${notificationPosition.left}px` : 'auto',
            right: notificationPosition.right !== 'auto' ? `${notificationPosition.right}px` : 'auto',
            maxHeight: 'calc(100vh - 100px)',
          }}
          data-notification-dropdown
        >
          <NotificationPanel
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDelete={handleDeleteNotification}
            onStar={handleStarNotification}
            onAction={handleNotificationAction}
            className="shadow-2xl border-2 border-gray-100"
          />
        </div>,
        document.body
      )}

      {/* Add Tool Modal */}
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

      {/* Secondary Sidebar */}
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