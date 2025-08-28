'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  Filter, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Info, 
  Trash2,
  MoreHorizontal,
  Eye,
  EyeOff,
  Settings,
  Archive,
  Star,
  StarOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  starred: boolean;
  department: string;
  priority: 'high' | 'medium' | 'low';
  actionUrl?: string;
  metadata?: Record<string, any>;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onStar: (id: string) => void;
  onAction: (notification: Notification) => void;
  className?: string;
}

const getNotificationIcon = (type: Notification['type']) => {
  const iconProps = { size: 16, className: "flex-shrink-0" };
  
  switch (type) {
    case 'success':
      return <CheckCircle2 {...iconProps} className="text-green-500" />;
    case 'warning':
      return <AlertTriangle {...iconProps} className="text-yellow-500" />;
    case 'error':
      return <AlertTriangle {...iconProps} className="text-red-500" />;
    case 'info':
    default:
      return <Info {...iconProps} className="text-blue-500" />;
  }
};

const getPriorityColor = (priority: Notification['priority']) => {
  switch (priority) {
    case 'high':
      return 'border-l-red-500 bg-red-50/50';
    case 'medium':
      return 'border-l-yellow-500 bg-yellow-50/50';
    case 'low':
      return 'border-l-green-500 bg-green-50/50';
    default:
      return 'border-l-gray-300 bg-gray-50/50';
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
};

// Simple Dropdown Menu Component
const SimpleDropdown: React.FC<{
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
}> = ({ trigger, children, align = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div className={cn(
          "absolute z-50 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1",
          align === 'right' ? 'right-0' : 'left-0'
        )}>
          {children}
        </div>
      )}
    </div>
  );
};

const DropdownItem: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ children, onClick, className }) => (
  <div
    onClick={onClick}
    className={cn(
      "px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center",
      className
    )}
  >
    {children}
  </div>
);

const NotificationItem: React.FC<{
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onStar: (id: string) => void;
  onAction: (notification: Notification) => void;
}> = ({ notification, onMarkAsRead, onDelete, onStar, onAction }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "group relative p-4 border-l-4 transition-all duration-200 hover:shadow-sm cursor-pointer",
        getPriorityColor(notification.priority),
        !notification.read && "bg-blue-50/30 border-l-blue-500"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onAction(notification)}
    >
      <div className="flex items-start gap-3">
        {getNotificationIcon(notification.type)}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className={cn(
              "text-sm font-medium truncate",
              !notification.read && "font-semibold"
            )}>
              {notification.title}
            </h4>
            
            <div className="flex items-center gap-1 ml-2">
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              )}
              
              <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                {notification.department}
              </Badge>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={12} className="text-gray-400" />
              <span className="text-xs text-gray-500">
                {formatTimeAgo(notification.timestamp)}
              </span>
              
              <Badge 
                variant={notification.priority === 'high' ? 'destructive' : 'secondary'}
                className="text-xs px-1.5 py-0.5"
              >
                {notification.priority}
              </Badge>
            </div>
            
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => onStar(notification.id)}
                  >
                    {notification.starred ? (
                      <Star size={12} className="text-yellow-500 fill-current" />
                    ) : (
                      <StarOff size={12} className="text-gray-400" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    {notification.read ? (
                      <EyeOff size={12} className="text-gray-400" />
                    ) : (
                      <Eye size={12} className="text-blue-500" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    onClick={() => onDelete(notification.id)}
                  >
                    <Trash2 size={12} />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onStar,
  onAction,
  className
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  const departments = useMemo(() => {
    const depts = Array.from(new Set(notifications.map(n => n.department)));
    return depts.sort();
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      const matchesSearch = searchTerm === '' || 
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = selectedDepartment === 'all' || 
        notification.department === selectedDepartment;
      
      const matchesPriority = selectedPriority === 'all' || 
        notification.priority === selectedPriority;
      
      const matchesTab = activeTab === 'all' || 
        (activeTab === 'unread' && !notification.read) ||
        (activeTab === 'starred' && notification.starred);
      
      return matchesSearch && matchesDepartment && matchesPriority && matchesTab;
    });
  }, [notifications, searchTerm, selectedDepartment, selectedPriority, activeTab]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const starredCount = notifications.filter(n => n.starred).length;

  return (
    <div className={cn("w-96 bg-white border border-gray-200 rounded-lg shadow-lg", className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {unreadCount} unread
            </Badge>
            
            <SimpleDropdown
              trigger={
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal size={16} />
                </Button>
              }
            >
              <DropdownItem onClick={onMarkAllAsRead}>
                <CheckCircle2 size={16} className="mr-2" />
                Mark all as read
              </DropdownItem>
              <DropdownItem>
                <Archive size={16} className="mr-2" />
                Archive all
              </DropdownItem>
              <div className="border-t border-gray-200 my-1"></div>
              <DropdownItem>
                <Settings size={16} className="mr-2" />
                Notification settings
              </DropdownItem>
            </SimpleDropdown>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
        
        {/* Filters */}
        <div className="flex gap-2">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="flex-1 text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="flex-1 text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-none border-b">
          <TabsTrigger value="all" className="text-xs">
            All ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread" className="text-xs">
            Unread ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="starred" className="text-xs">
            Starred ({starredCount})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <ScrollArea className="h-96">
            <AnimatePresence>
              {filteredNotifications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-64 text-center p-4"
                >
                  <Bell size={48} className="text-gray-300 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No notifications</h4>
                  <p className="text-sm text-gray-500">
                    {searchTerm || selectedDepartment !== 'all' || selectedPriority !== 'all'
                      ? 'Try adjusting your filters'
                      : 'You\'re all caught up!'}
                  </p>
                </motion.div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={onMarkAsRead}
                      onDelete={onDelete}
                      onStar={onStar}
                      onAction={onAction}
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      {/* Footer */}
      {filteredNotifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Showing {filteredNotifications.length} of {notifications.length}</span>
            <Button variant="link" className="h-auto p-0 text-xs">
              View all notifications
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};