import {
  StatItem,
  ActivityItem,
  AIInsight,
  InventoryStatus,
  QuickAction
} from '@/types/dashboard';
import {
  OrderIcon,
  PaymentIcon,
  WarningIcon,
  UserIcon,
  AIInsightsIcon,
  ChartIcon,
  InventoryIcon,
  InvoiceIcon,
  DashboardIcon,
  CustomersIcon,
  SalesIcon
} from '@/components/Icons';

export const STATS: StatItem[] = [
  { 
    name: 'Total Revenue', 
    value: '₹2,84,73,920', 
    change: '+12.5%', 
    changeType: 'positive',
    icon: <SalesIcon size={20} />
  },
  { 
    name: 'Active Orders', 
    value: '1,247', 
    change: '+8.2%', 
    changeType: 'positive',
    icon: <OrderIcon size={20} />
  },
  { 
    name: 'Inventory Items', 
    value: '8,432', 
    change: '-2.1%', 
    changeType: 'negative',
    icon: <InventoryIcon size={20} />
  },
  { 
    name: 'Active Customers', 
    value: '2,847', 
    change: '+15.3%', 
    changeType: 'positive',
    icon: <CustomersIcon size={20} />
  },
];

export const RECENT_ACTIVITIES: ActivityItem[] = [
  { id: 1, type: 'order', message: 'New order #ORD-2024-001 received from TechCorp', time: '2 minutes ago', icon: <OrderIcon size={20} /> },
  { id: 2, type: 'payment', message: 'Payment of ₹12,50,000 received from GlobalTech', time: '15 minutes ago', icon: <PaymentIcon size={20} /> },
  { id: 3, type: 'inventory', message: 'Low stock alert: MacBook Pro (5 units remaining)', time: '1 hour ago', icon: <WarningIcon size={20} /> },
  { id: 4, type: 'customer', message: 'New customer registration: Innovation Labs', time: '2 hours ago', icon: <UserIcon size={20} /> },
  { id: 5, type: 'ai', message: 'AI detected potential sales opportunity with existing customer', time: '3 hours ago', icon: <AIInsightsIcon size={20} /> },
  { id: 6, type: 'order', message: 'Order #ORD-2024-002 shipped successfully', time: '4 hours ago', icon: <OrderIcon size={20} /> },
  { id: 7, type: 'payment', message: 'Payment reminder sent to 3 customers', time: '5 hours ago', icon: <PaymentIcon size={20} /> }
];

export const AI_INSIGHTS: AIInsight[] = [
  {
    title: 'Sales Forecast',
    description: 'Based on current trends, expect 18% increase in Q4 sales',
    confidence: 92,
    type: 'positive'
  },
  {
    title: 'Inventory Optimization',
    description: 'Consider restocking 12 items to avoid stockouts',
    confidence: 87,
    type: 'warning'
  },
  {
    title: 'Customer Retention',
    description: '3 high-value customers at risk of churning',
    confidence: 78,
    type: 'negative'
  },
  {
    title: 'Revenue Opportunity',
    description: 'Potential ₹5.2L revenue from upselling to existing customers',
    confidence: 85,
    type: 'positive'
  }
];

export const INVENTORY_STATUS: InventoryStatus[] = [
  { label: 'In Stock', count: 7234, color: 'green' },
  { label: 'Low Stock', count: 892, color: 'yellow' },
  { label: 'Out of Stock', count: 306, color: 'red' }
];

export const QUICK_ACTIONS: QuickAction[] = [
  { name: 'New Order', icon: <OrderIcon size={24} />, description: 'Create new customer order' },
  { name: 'Add Customer', icon: <UserIcon size={24} />, description: 'Register new customer' },
  { name: 'Update Inventory', icon: <InventoryIcon size={24} />, description: 'Manage stock levels' },
  { name: 'Generate Invoice', icon: <InvoiceIcon size={24} />, description: 'Create new invoice' },
  { name: 'View Reports', icon: <DashboardIcon size={24} />, description: 'Access analytics' },
  { name: 'AI Analysis', icon: <AIInsightsIcon size={24} />, description: 'Run AI insights' },
  { name: 'Process Payment', icon: <PaymentIcon size={24} />, description: 'Record payment' },
  { name: 'Check Sales', icon: <ChartIcon size={24} />, description: 'View sales data' }
];