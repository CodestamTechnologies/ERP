// lib/constants/sales.ts
import {
  SalesIcon,
  ChartIcon,
  CustomersIcon,
  OrderIcon,
  PaymentIcon,
  InventoryIcon,
  UserIcon,
  SettingsIcon,
  WarningIcon,
  AIInsightsIcon,
  DashboardIcon,
  InvoiceIcon
} from '@/components/Icons';

export const QUICK_ACTIONS = [
  { name: 'New Quote', icon: <OrderIcon size={24} />, color: 'blue' },
  { name: 'Follow Up', icon: <UserIcon size={24} />, color: 'green' },
  { name: 'Sales Report', icon: <ChartIcon size={24} />, color: 'purple' },
  { name: 'Customer Call', icon: <CustomersIcon size={24} />, color: 'yellow' },
  { name: 'Pipeline Review', icon: <AIInsightsIcon size={24} />, color: 'indigo' },
  { name: 'Settings', icon: <SettingsIcon size={24} />, color: 'gray' },
  { name: 'Create Invoice', icon: <InvoiceIcon size={24} />, color: 'orange' },
  { name: 'Track Shipment', icon: <InventoryIcon size={24} />, color: 'pink' },
  { name: 'Schedule Meeting', icon: <UserIcon size={24} />, color: 'teal' },
  { name: 'Generate Contract', icon: <InvoiceIcon size={24} />, color: 'cyan' },
  { name: 'Process Payment', icon: <PaymentIcon size={24} />, color: 'amber' },
  { name: 'View Analytics', icon: <ChartIcon size={24} />, color: 'violet' }
];

export const TABS = [
  { id: 'overview', name: 'Overview', icon: <DashboardIcon size={16} /> },
  { id: 'orders', name: 'Orders', icon: <OrderIcon size={16} /> },
  { id: 'team', name: 'Sales Team', icon: <UserIcon size={16} /> },
  { id: 'analytics', name: 'Analytics', icon: <ChartIcon size={16} /> },
  { id: 'customers', name: 'Customers', icon: <CustomersIcon size={16} /> },
  { id: 'reports', name: 'Reports', icon: <AIInsightsIcon size={16} /> }
];