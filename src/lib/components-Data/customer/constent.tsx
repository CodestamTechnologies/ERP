import {
  CustomerStat,
  CustomerSegment,
  Customer,
  Activity,
  QuickAction
} from '@/types/customer';
import {
  CustomersIcon,
  UserIcon,
  OrderIcon,
  PaymentIcon,
  ChartIcon,
  SettingsIcon,
  WarningIcon,
  AIInsightsIcon
} from '@/components/Icons';

export const CUSTOMER_STATS: CustomerStat[] = [
  { 
    name: 'Total Customers', 
    value: '2,847', 
    change: '+15.3%', 
    changeType: 'positive', 
    icon: <CustomersIcon size={24} /> 
  },
  { 
    name: 'Active Customers', 
    value: '2,234', 
    change: '+8.7%', 
    changeType: 'positive', 
    icon: <UserIcon size={24} /> 
  },
  { 
    name: 'New This Month', 
    value: '156', 
    change: '+23.1%', 
    changeType: 'positive', 
    icon: <UserIcon size={24} /> 
  },
  { 
    name: 'Total Revenue', 
    value: '₹1.2Cr', 
    change: '+12.4%', 
    changeType: 'positive', 
    icon: <ChartIcon size={24} /> 
  },
];

export const CUSTOMER_SEGMENTS: CustomerSegment[] = [
  { id: 'all', name: 'All Customers', count: 2847, color: 'blue' },
  { id: 'enterprise', name: 'Enterprise', count: 234, color: 'purple' },
  { id: 'business', name: 'Business', count: 876, color: 'green' },
  { id: 'individual', name: 'Individual', count: 1456, color: 'yellow' },
  { id: 'inactive', name: 'Inactive', count: 281, color: 'red' },
  { id: 'vip', name: 'VIP Customers', count: 89, color: 'amber' },
  { id: 'new', name: 'New Customers', count: 156, color: 'cyan' },
  { id: 'at-risk', name: 'At Risk', count: 67, color: 'orange' },
];

export const CUSTOMERS: Customer[] = [
  {
    id: 'CUST-001',
    name: 'TechCorp Solutions',
    email: 'contact@techcorp.com',
    phone: '+91 98765 43210',
    company: 'TechCorp Solutions Pvt Ltd',
    segment: 'Enterprise',
    location: 'Mumbai, Maharashtra',
    totalOrders: 45,
    totalSpent: 1250000,
    lastOrder: '2024-01-15',
    status: 'active',
    joinDate: '2022-03-15',
    avatar: null,
    tags: ['VIP', 'High Value']
  },
  {
    id: 'CUST-002',
    name: 'Innovation Labs',
    email: 'hello@innovationlabs.in',
    phone: '+91 87654 32109',
    company: 'Innovation Labs India',
    segment: 'Business',
    location: 'Bangalore, Karnataka',
    totalOrders: 28,
    totalSpent: 675000,
    lastOrder: '2024-01-12',
    status: 'active',
    joinDate: '2022-08-22',
    avatar: null,
    tags: ['Regular']
  },
  {
    id: 'CUST-003',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91 76543 21098',
    company: 'Freelancer',
    segment: 'Individual',
    location: 'Delhi, NCR',
    totalOrders: 12,
    totalSpent: 89500,
    lastOrder: '2024-01-10',
    status: 'active',
    joinDate: '2023-01-10',
    avatar: null,
    tags: ['Frequent Buyer']
  },
  {
    id: 'CUST-004',
    name: 'Global Enterprises',
    email: 'procurement@globalent.com',
    phone: '+91 65432 10987',
    company: 'Global Enterprises Ltd',
    segment: 'Enterprise',
    location: 'Pune, Maharashtra',
    totalOrders: 67,
    totalSpent: 2340000,
    lastOrder: '2024-01-14',
    status: 'active',
    joinDate: '2021-11-05',
    avatar: null,
    tags: ['VIP', 'Bulk Orders']
  },
  {
    id: 'CUST-005',
    name: 'StartupHub',
    email: 'orders@startuphub.co',
    phone: '+91 54321 09876',
    company: 'StartupHub Technologies',
    segment: 'Business',
    location: 'Hyderabad, Telangana',
    totalOrders: 19,
    totalSpent: 345000,
    lastOrder: '2023-12-28',
    status: 'inactive',
    joinDate: '2023-05-18',
    avatar: null,
    tags: ['At Risk']
  },
  {
    id: 'CUST-006',
    name: 'Priya Sharma',
    email: 'priya.sharma@gmail.com',
    phone: '+91 43210 98765',
    company: 'Individual',
    segment: 'Individual',
    location: 'Chennai, Tamil Nadu',
    totalOrders: 8,
    totalSpent: 45600,
    lastOrder: '2024-01-08',
    status: 'active',
    joinDate: '2023-09-12',
    avatar: null,
    tags: ['New Customer']
  },
  {
    id: 'CUST-007',
    name: 'Enterprise Solutions Ltd',
    email: 'info@enterprisesolutions.com',
    phone: '+91 32109 87654',
    company: 'Enterprise Solutions Ltd',
    segment: 'Enterprise',
    location: 'Gurgaon, Haryana',
    totalOrders: 92,
    totalSpent: 3450000,
    lastOrder: '2024-01-16',
    status: 'active',
    joinDate: '2020-08-12',
    avatar: null,
    tags: ['VIP', 'Strategic']
  },
  {
    id: 'CUST-008',
    name: 'Digital Creations',
    email: 'contact@digitalcreations.in',
    phone: '+91 21098 76543',
    company: 'Digital Creations Studio',
    segment: 'Business',
    location: 'Ahmedabad, Gujarat',
    totalOrders: 23,
    totalSpent: 278000,
    lastOrder: '2024-01-11',
    status: 'active',
    joinDate: '2023-03-20',
    avatar: null,
    tags: ['Growing']
  },
  {
    id: 'CUST-009',
    name: 'Amit Singh',
    email: 'amit.singh@email.com',
    phone: '+91 10987 65432',
    company: 'Independent Consultant',
    segment: 'Individual',
    location: 'Lucknow, Uttar Pradesh',
    totalOrders: 15,
    totalSpent: 123500,
    lastOrder: '2024-01-09',
    status: 'active',
    joinDate: '2023-07-15',
    avatar: null,
    tags: ['Professional']
  },
  {
    id: 'CUST-010',
    name: 'TechNova Systems',
    email: 'sales@technovasystems.com',
    phone: '+91 09876 54321',
    company: 'TechNova Systems Pvt Ltd',
    segment: 'Enterprise',
    location: 'Kolkata, West Bengal',
    totalOrders: 34,
    totalSpent: 1567000,
    lastOrder: '2024-01-13',
    status: 'active',
    joinDate: '2022-12-01',
    avatar: null,
    tags: ['VIP', 'Enterprise']
  }
];

export const RECENT_ACTIVITIES: Activity[] = [
  {
    id: 1,
    type: 'new-customer',
    message: 'New customer registration: TechStart Solutions',
    time: '1 hour ago',
    icon: <UserIcon size={16} />,
    customer: 'TechStart Solutions'
  },
  {
    id: 2,
    type: 'order',
    message: 'Large order placed by Global Enterprises (₹2,50,000)',
    time: '3 hours ago',
    icon: <OrderIcon size={16} />,
    customer: 'Global Enterprises'
  },
  {
    id: 3,
    type: 'payment',
    message: 'Payment received from TechCorp Solutions (₹1,25,000)',
    time: '5 hours ago',
    icon: <PaymentIcon size={16} />,
    customer: 'TechCorp Solutions'
  },
  {
    id: 4,
    type: 'inactive',
    message: 'Customer marked as inactive: StartupHub',
    time: '1 day ago',
    icon: <WarningIcon size={16} />,
    customer: 'StartupHub'
  },
  {
    id: 5,
    type: 'milestone',
    message: 'Innovation Labs reached 25 orders milestone',
    time: '2 days ago',
    icon: <ChartIcon size={16} />,
    customer: 'Innovation Labs'
  },
  {
    id: 6,
    type: 'support-ticket',
    message: 'New support ticket from Priya Sharma',
    time: '3 days ago',
    icon: <WarningIcon size={16} />,
    customer: 'Priya Sharma'
  },
  {
    id: 7,
    type: 'contract-renewal',
    message: 'Contract renewed with Enterprise Solutions Ltd',
    time: '4 days ago',
    icon: <PaymentIcon size={16} />,
    customer: 'Enterprise Solutions Ltd'
  },
  {
    id: 8,
    type: 'feedback',
    message: 'Positive feedback received from Rajesh Kumar',
    time: '5 days ago',
    icon: <UserIcon size={16} />,
    customer: 'Rajesh Kumar'
  }
];

export const QUICK_ACTIONS: QuickAction[] = [
  { name: 'Import Customers', icon: <UserIcon size={24} />, color: 'blue' },
  { name: 'Send Newsletter', icon: <PaymentIcon size={24} />, color: 'green' },
  { name: 'Customer Survey', icon: <ChartIcon size={24} />, color: 'purple' },
  { name: 'Loyalty Program', icon: <CustomersIcon size={24} />, color: 'yellow' },
  { name: 'AI Insights', icon: <AIInsightsIcon size={24} />, color: 'indigo' },
  { name: 'Settings', icon: <SettingsIcon size={24} />, color: 'gray' },
  { name: 'Create Campaign', icon: <ChartIcon size={24} />, color: 'orange' },
  { name: 'Export Data', icon: <SettingsIcon size={24} />, color: 'pink' }
];