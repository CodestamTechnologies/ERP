import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell,
  faClipboardList,
  faCreditCard,
  faExclamationTriangle,
  faUser,
  faSun,
  faMoon,
  faFileInvoice,
  faCog,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';
import {
  LayoutDashboard,
  TrendingUp,
  Package,
  Users,
  Truck,
  DollarSign,
  FileText,
  Brain,
  Settings,
  BarChart3,
  Globe,
  Bell,
  ShoppingCart,
  CreditCard,
  AlertTriangle,
  User,
  TrendingDown
} from 'lucide-react';

interface IconProps {
  className?: string;
  size?: number;
}

export const DashboardIcon = ({ className = "", size = 24 }: IconProps) => (
  <LayoutDashboard 
    className={className}
    size={size}
    style={{ 
      color: '#3B82F6',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

export const SalesIcon = ({ className = "", size = 24 }: IconProps) => (
  <TrendingUp 
    className={className}
    size={size}
    style={{ 
      color: '#10B981',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

export const InventoryIcon = ({ className = "", size = 24 }: IconProps) => (
  <Package 
    className={className}
    size={size}
    style={{ 
      color: '#8B5CF6',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

export const CustomersIcon = ({ className = "", size = 24 }: IconProps) => (
  <Users 
    className={className}
    size={size}
    style={{ 
      color: '#F59E0B',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

export const SuppliersIcon = ({ className = "", size = 24 }: IconProps) => (
  <Truck 
    className={className}
    size={size}
    style={{ 
      color: '#6366F1',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

export const FinanceIcon = ({ className = "", size = 24 }: IconProps) => (
  <DollarSign 
    className={className}
    size={size}
    style={{ 
      color: '#EC4899',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

export const ReportsIcon = ({ className = "", size = 24 }: IconProps) => (
  <FileText 
    className={className}
    size={size}
    style={{ 
      color: '#06B6D4',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

export const AIInsightsIcon = ({ className = "", size = 24 }: IconProps) => (
  <Brain 
    className={className}
    size={size}
    style={{ 
      color: '#8B5CF6',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

export const SettingsIcon = ({ className = "", size = 24 }: IconProps) => (
  <Settings 
    className={className}
    size={size}
    style={{ 
      color: '#6B7280',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

export const OrderIcon = ({ className = "", size = 24 }: IconProps) => (
  <ShoppingCart 
    className={className}
    size={size}
    style={{ 
      color: '#3B82F6',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

export const PaymentIcon = ({ className = "", size = 24 }: IconProps) => (
  <CreditCard 
    className={className}
    size={size}
    style={{ 
      color: '#10B981',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

export const WarningIcon = ({ className = "", size = 24 }: IconProps) => (
  <AlertTriangle 
    className={className}
    size={size}
    style={{ 
      color: '#F59E0B',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

export const UserIcon = ({ className = "", size = 24 }: IconProps) => (
  <User 
    className={className}
    size={size}
    style={{ 
      color: '#8B5CF6',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

export const ChartIcon = ({ className = "", size = 24 }: IconProps) => (
  <BarChart3 
    className={className}
    size={size}
    style={{ 
      color: '#06B6D4',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

export const InvoiceIcon = ({ className = "", size = 24 }: IconProps) => (
  <FontAwesomeIcon 
    icon={faFileInvoice} 
    className={className}
    style={{ 
      fontSize: `${size}px`,
      color: '#EC4899',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

// Updated to use Shadcn Bell icon
export const NotificationIcon = ({ className = "", size = 24 }: IconProps) => (
  <Bell 
    className={className}
    size={size}
    style={{ 
      color: '#F59E0B',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

export const ThemeIcon = ({ className = "", size = 24 }: IconProps) => (
  <FontAwesomeIcon 
    icon={faSun} 
    className={className}
    style={{ 
      fontSize: `${size}px`,
      color: '#F59E0B',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

export const WebsiteIcon = ({ className = "", size = 24 }: IconProps) => (
  <Globe 
    className={className}
    size={size}
    style={{ 
      color: '#10B981',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);