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

// 📊 STATS (spread across multiple time ranges)
export const STATS: StatItem[] = [
  { name: 'Total Revenue', value: '₹2,84,73,920', change: '+12.5%', changeType: 'positive', icon: <SalesIcon size={20} />, date: '2025-09-10T08:30:00Z' }, // today
  { name: 'Active Orders', value: '1,247', change: '+8.2%', changeType: 'positive', icon: <OrderIcon size={20} />, date: '2025-09-07T11:15:00Z' }, // 3 days ago
  { name: 'Inventory Items', value: '8,432', change: '-2.1%', changeType: 'negative', icon: <InventoryIcon size={20} />, date: '2025-08-25T09:45:00Z' }, // ~15 days ago
  { name: 'Active Customers', value: '2,847', change: '+15.3%', changeType: 'positive', icon: <CustomersIcon size={20} />, date: '2025-07-22T14:20:00Z' }, // ~50 days ago
  { name: 'Total Revenue', value: '₹2,12,45,700', change: '+10.1%', changeType: 'positive', icon: <SalesIcon size={20} />, date: '2025-06-12T10:00:00Z' }, // ~90 days ago
];

// 📝 RECENT ACTIVITIES (more spread out)
export const RECENT_ACTIVITIES: ActivityItem[] = [
  { id: 1, type: 'order', message: 'New order #ORD-2024-001 received from TechCorp', time: '2 minutes ago', icon: <OrderIcon size={20} />, date: '2025-09-10T08:41:00Z' },
  { id: 2, type: 'payment', message: 'Payment of ₹12,50,000 received from GlobalTech', time: '15 minutes ago', icon: <PaymentIcon size={20} />, date: '2025-09-08T08:28:00Z' },
  { id: 3, type: 'inventory', message: 'Low stock alert: MacBook Pro (5 units remaining)', time: '1 day ago', icon: <WarningIcon size={20} />, date: '2025-09-05T07:45:00Z' },
  { id: 4, type: 'customer', message: 'New customer registration: Innovation Labs', time: '5 days ago', icon: <UserIcon size={20} />, date: '2025-09-01T06:45:00Z' },
  { id: 5, type: 'ai', message: 'AI detected potential sales opportunity with existing customer', time: '2 weeks ago', icon: <AIInsightsIcon size={20} />, date: '2025-08-20T05:45:00Z' },
  { id: 6, type: 'order', message: 'Order #ORD-2024-002 shipped successfully', time: '1 month ago', icon: <OrderIcon size={20} />, date: '2025-08-01T04:45:00Z' },
  { id: 7, type: 'payment', message: 'Payment reminder sent to 3 customers', time: '2 months ago', icon: <PaymentIcon size={20} />, date: '2025-07-05T03:45:00Z' }
];

// 🤖 AI INSIGHTS (different days for trend filtering)
export const AI_INSIGHTS: AIInsight[] = [
  { title: 'Sales Forecast', description: 'Based on current trends, expect 18% increase in Q4 sales', confidence: 92, type: 'positive', date: '2025-09-09T12:00:00Z' },
  { title: 'Inventory Optimization', description: 'Consider restocking 12 items to avoid stockouts', confidence: 87, type: 'warning', date: '2025-09-03T10:00:00Z' },
  { title: 'Customer Retention', description: '3 high-value customers at risk of churning', confidence: 78, type: 'negative', date: '2025-08-18T18:00:00Z' },
  { title: 'Revenue Opportunity', description: 'Potential ₹5.2L revenue from upselling to existing customers', confidence: 85, type: 'positive', date: '2025-07-28T15:00:00Z' },
  { title: 'Churn Risk Prediction', description: '5 medium-value customers may churn within 60 days', confidence: 70, type: 'warning', date: '2025-06-15T09:00:00Z' }
];

// 📦 INVENTORY STATUS (tracked over time)
export const INVENTORY_STATUS: InventoryStatus[] = [
  { label: 'In Stock', count: 7234, color: 'green', date: '2025-09-10T08:00:00Z' },
  { label: 'Low Stock', count: 892, color: 'yellow', date: '2025-09-05T08:00:00Z' },
  { label: 'Out of Stock', count: 306, color: 'red', date: '2025-08-15T08:00:00Z' },
  { label: 'In Stock', count: 6543, color: 'green', date: '2025-07-10T08:00:00Z' },
  { label: 'Out of Stock', count: 502, color: 'red', date: '2025-06-20T08:00:00Z' }
];

// ⚡ QUICK ACTIONS (time-distributed)
export const QUICK_ACTIONS: QuickAction[] = [
  { name: 'New Order', icon: <OrderIcon size={24} />, description: 'Create new customer order', date: '2025-09-10T08:40:00Z' },
  { name: 'Add Customer', icon: <UserIcon size={24} />, description: 'Register new customer', date: '2025-09-06T08:35:00Z' },
  { name: 'Update Inventory', icon: <InventoryIcon size={24} />, description: 'Manage stock levels', date: '2025-08-25T08:25:00Z' },
  { name: 'Generate Invoice', icon: <InvoiceIcon size={24} />, description: 'Create new invoice', date: '2025-08-01T08:15:00Z' },
  { name: 'View Reports', icon: <DashboardIcon size={24} />, description: 'Access analytics', date: '2025-07-05T08:10:00Z' },
  { name: 'AI Analysis', icon: <AIInsightsIcon size={24} />, description: 'Run AI insights', date: '2025-06-12T08:05:00Z' }
];
