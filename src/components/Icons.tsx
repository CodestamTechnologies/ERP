import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell,
  faTachometerAlt,
  faChartLine,
  faBoxes,
  faUsers,
  faTruck,
  faMoneyBillWave,
  faFileAlt,
  faRobot,
  faCog,
  faClipboardList,
  faCreditCard,
  faExclamationTriangle,
  faUser,
  faSun,
  faMoon,
  faFileInvoice
} from '@fortawesome/free-solid-svg-icons';

interface IconProps {
  className?: string;
  size?: number;
}

export const DashboardIcon = ({ className = "", size = 24 }: IconProps) => (
  <FontAwesomeIcon 
    icon={faTachometerAlt} 
    className={className}
    style={{ 
      fontSize: `${size}px`,
      color: '#3B82F6',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

export const SalesIcon = ({ className = "", size = 24 }: IconProps) => (
  <FontAwesomeIcon 
    icon={faChartLine} 
    className={className}
    style={{ 
      fontSize: `${size}px`,
      color: '#10B981',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

export const InventoryIcon = ({ className = "", size = 24 }: IconProps) => (
  <FontAwesomeIcon 
    icon={faBoxes} 
    className={className}
    style={{ 
      fontSize: `${size}px`,
      color: '#8B5CF6',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

export const CustomersIcon = ({ className = "", size = 24 }: IconProps) => (
  <FontAwesomeIcon 
    icon={faUsers} 
    className={className}
    style={{ 
      fontSize: `${size}px`,
      color: '#F59E0B',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

export const SuppliersIcon = ({ className = "", size = 24 }: IconProps) => (
  <FontAwesomeIcon 
    icon={faTruck} 
    className={className}
    style={{ 
      fontSize: `${size}px`,
      color: '#6366F1',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

export const FinanceIcon = ({ className = "", size = 24 }: IconProps) => (
  <FontAwesomeIcon 
    icon={faMoneyBillWave} 
    className={className}
    style={{ 
      fontSize: `${size}px`,
      color: '#EC4899',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

export const ReportsIcon = ({ className = "", size = 24 }: IconProps) => (
  <FontAwesomeIcon 
    icon={faFileAlt} 
    className={className}
    style={{ 
      fontSize: `${size}px`,
      color: '#06B6D4',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

export const AIInsightsIcon = ({ className = "", size = 24 }: IconProps) => (
  <FontAwesomeIcon 
    icon={faRobot} 
    className={className}
    style={{ 
      fontSize: `${size}px`,
      color: '#8B5CF6',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

export const SettingsIcon = ({ className = "", size = 24 }: IconProps) => (
  <FontAwesomeIcon 
    icon={faCog} 
    className={className}
    style={{ 
      fontSize: `${size}px`,
      color: '#6B7280',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

export const OrderIcon = ({ className = "", size = 24 }: IconProps) => (
  <FontAwesomeIcon 
    icon={faClipboardList} 
    className={className}
    style={{ 
      fontSize: `${size}px`,
      color: '#3B82F6',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

export const PaymentIcon = ({ className = "", size = 24 }: IconProps) => (
  <FontAwesomeIcon 
    icon={faCreditCard} 
    className={className}
    style={{ 
      fontSize: `${size}px`,
      color: '#10B981',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

export const WarningIcon = ({ className = "", size = 24 }: IconProps) => (
  <FontAwesomeIcon 
    icon={faExclamationTriangle} 
    className={className}
    style={{ 
      fontSize: `${size}px`,
      color: '#F59E0B',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

export const UserIcon = ({ className = "", size = 24 }: IconProps) => (
  <FontAwesomeIcon 
    icon={faUser} 
    className={className}
    style={{ 
      fontSize: `${size}px`,
      color: '#8B5CF6',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }}
  />
);

export const ChartIcon = ({ className = "", size = 24 }: IconProps) => (
  <FontAwesomeIcon 
    icon={faChartLine} 
    className={className}
    style={{ 
      fontSize: `${size}px`,
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

export const NotificationIcon = ({ className = "", size = 24 }: IconProps) => (
  <FontAwesomeIcon 
    icon={faBell} 
    className={className}
    style={{ 
      fontSize: `${size}px`,
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