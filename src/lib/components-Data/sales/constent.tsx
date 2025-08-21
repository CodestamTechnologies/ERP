import {
  SalesStat,
  SalesChannel,
  SalesOrder,
  SalesTeamMember,
  Activity,
  QuickAction
} from '@/types/Sales'
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

export const SALES_STATS: SalesStat[] = [
  { 
    name: 'Total Revenue', 
    value: '₹2.84Cr', 
    change: '+12.5%', 
    changeType: 'positive', 
    icon: <SalesIcon size={24} />,
    target: '₹3.2Cr',
    progress: 88.75
  },
  { 
    name: 'Orders This Month', 
    value: '1,247', 
    change: '+8.2%', 
    changeType: 'positive', 
    icon: <OrderIcon size={24} />,
    target: '1,400',
    progress: 89.07
  },
  { 
    name: 'Avg Order Value', 
    value: '₹22,785', 
    change: '+15.3%', 
    changeType: 'positive', 
    icon: <ChartIcon size={24} />,
    target: '₹25,000',
    progress: 91.14
  },
  { 
    name: 'Conversion Rate', 
    value: '3.8%', 
    change: '+0.5%', 
    changeType: 'positive', 
    icon: <CustomersIcon size={24} />,
    target: '4.2%',
    progress: 90.48
  },
];

export const SALES_CHANNELS: SalesChannel[] = [
  { id: 'online', name: 'Online Store', revenue: 1850000, orders: 756, growth: '+18.2%', color: 'blue' },
  { id: 'retail', name: 'Retail Store', revenue: 680000, orders: 234, growth: '+5.8%', color: 'green' },
  { id: 'wholesale', name: 'Wholesale', revenue: 310000, orders: 89, growth: '+22.1%', color: 'purple' },
  { id: 'b2b', name: 'B2B Sales', revenue: 890000, orders: 168, growth: '+12.4%', color: 'orange' },
];

export const SALES_ORDERS: SalesOrder[] = [
  {
    id: 'ORD-2024-001',
    customer: 'TechCorp Solutions',
    customerEmail: 'contact@techcorp.com',
    amount: 125000,
    items: 15,
    status: 'completed',
    priority: 'high',
    channel: 'B2B Sales',
    date: '2024-01-15',
    dueDate: '2024-01-20',
    paymentStatus: 'paid',
    salesRep: 'Rajesh Kumar',
    region: 'Mumbai',
    category: 'Electronics',
    profit: 25000,
    discount: 5000,
    tax: 22500,
    shippingCost: 2500
  },
  {
    id: 'ORD-2024-002',
    customer: 'Innovation Labs',
    customerEmail: 'hello@innovationlabs.in',
    amount: 89500,
    items: 8,
    status: 'processing',
    priority: 'medium',
    channel: 'Online Store',
    date: '2024-01-14',
    dueDate: '2024-01-18',
    paymentStatus: 'pending',
    salesRep: 'Priya Sharma',
    region: 'Bangalore',
    category: 'Software',
    profit: 18900,
    discount: 2500,
    tax: 16110,
    shippingCost: 1500
  },
  {
    id: 'ORD-2024-003',
    customer: 'Global Enterprises',
    customerEmail: 'procurement@globalent.com',
    amount: 234000,
    items: 25,
    status: 'shipped',
    priority: 'high',
    channel: 'Wholesale',
    date: '2024-01-13',
    dueDate: '2024-01-17',
    paymentStatus: 'partial',
    salesRep: 'Amit Singh',
    region: 'Delhi',
    category: 'Furniture',
    profit: 46800,
    discount: 8000,
    tax: 42120,
    shippingCost: 5000
  },
  {
    id: 'ORD-2024-004',
    customer: 'StartupHub',
    customerEmail: 'orders@startuphub.co',
    amount: 67800,
    items: 12,
    status: 'cancelled',
    priority: 'low',
    channel: 'Online Store',
    date: '2024-01-12',
    dueDate: '2024-01-16',
    paymentStatus: 'refunded',
    salesRep: 'Neha Patel',
    region: 'Hyderabad',
    category: 'Office Supplies',
    profit: 0,
    discount: 3400,
    tax: 0,
    shippingCost: 0
  },
  {
    id: 'ORD-2024-005',
    customer: 'Digital Solutions Hub',
    customerEmail: 'kavya@digitalhub.com',
    amount: 156000,
    items: 20,
    status: 'confirmed',
    priority: 'high',
    channel: 'B2B Sales',
    date: '2024-01-11',
    dueDate: '2024-01-15',
    paymentStatus: 'paid',
    salesRep: 'Vikram Reddy',
    region: 'Chennai',
    category: 'Electronics',
    profit: 31200,
    discount: 6000,
    tax: 28080,
    shippingCost: 3000
  },
  {
    id: 'ORD-2024-006',
    customer: 'Enterprise Solutions Ltd',
    customerEmail: 'accounts@enterprisesolutions.com',
    amount: 345000,
    items: 32,
    status: 'processing',
    priority: 'high',
    channel: 'B2B Sales',
    date: '2024-01-10',
    dueDate: '2024-01-14',
    paymentStatus: 'pending',
    salesRep: 'Rajesh Kumar',
    region: 'Mumbai',
    category: 'Enterprise Software',
    profit: 69000,
    discount: 12000,
    tax: 62100,
    shippingCost: 4500
  },
  {
    id: 'ORD-2024-007',
    customer: 'Retail Chain India',
    customerEmail: 'purchasing@retailchain.in',
    amount: 89000,
    items: 18,
    status: 'shipped',
    priority: 'medium',
    channel: 'Retail Store',
    date: '2024-01-09',
    dueDate: '2024-01-13',
    paymentStatus: 'paid',
    salesRep: 'Amit Singh',
    region: 'Delhi',
    category: 'Retail Goods',
    profit: 17800,
    discount: 3500,
    tax: 16020,
    shippingCost: 2000
  },
  {
    id: 'ORD-2024-008',
    customer: 'Tech Startup Inc',
    customerEmail: 'founder@techstartup.io',
    amount: 56700,
    items: 10,
    status: 'completed',
    priority: 'medium',
    channel: 'Online Store',
    date: '2024-01-08',
    dueDate: '2024-01-12',
    paymentStatus: 'paid',
    salesRep: 'Priya Sharma',
    region: 'Bangalore',
    category: 'Development Tools',
    profit: 11340,
    discount: 2000,
    tax: 10206,
    shippingCost: 1200
  },
  {
    id: 'ORD-2024-009',
    customer: 'Manufacturing Corp',
    customerEmail: 'operations@mfgcorp.com',
    amount: 198000,
    items: 22,
    status: 'confirmed',
    priority: 'high',
    channel: 'Wholesale',
    date: '2024-01-07',
    dueDate: '2024-01-11',
    paymentStatus: 'partial',
    salesRep: 'Vikram Reddy',
    region: 'Chennai',
    category: 'Industrial Equipment',
    profit: 39600,
    discount: 8000,
    tax: 35640,
    shippingCost: 4000
  },
  {
    id: 'ORD-2024-010',
    customer: 'E-commerce Ventures',
    customerEmail: 'support@ecomventures.com',
    amount: 123500,
    items: 15,
    status: 'processing',
    priority: 'medium',
    channel: 'Online Store',
    date: '2024-01-06',
    dueDate: '2024-01-10',
    paymentStatus: 'pending',
    salesRep: 'Neha Patel',
    region: 'Hyderabad',
    category: 'E-commerce Platform',
    profit: 24700,
    discount: 4500,
    tax: 22230,
    shippingCost: 1800
  }
];

export const SALES_TEAM: SalesTeamMember[] = [
  {
    id: 'REP-001',
    name: 'Rajesh Kumar',
    email: 'rajesh@codestam.com',
    region: 'Mumbai',
    target: 500000,
    achieved: 425000,
    orders: 45,
    conversion: 4.2,
    rating: 4.8,
    status: 'active'
  },
  {
    id: 'REP-002',
    name: 'Priya Sharma',
    email: 'priya@codestam.com',
    region: 'Bangalore',
    target: 450000,
    achieved: 398000,
    orders: 38,
    conversion: 3.9,
    rating: 4.6,
    status: 'active'
  },
  {
    id: 'REP-003',
    name: 'Amit Singh',
    email: 'amit@codestam.com',
    region: 'Delhi',
    target: 600000,
    achieved: 567000,
    orders: 52,
    conversion: 4.5,
    rating: 4.9,
    status: 'active'
  },
  {
    id: 'REP-004',
    name: 'Neha Patel',
    email: 'neha@codestam.com',
    region: 'Hyderabad',
    target: 400000,
    achieved: 345000,
    orders: 32,
    conversion: 3.7,
    rating: 4.4,
    status: 'active'
  },
  {
    id: 'REP-005',
    name: 'Vikram Reddy',
    email: 'vikram@codestam.com',
    region: 'Chennai',
    target: 550000,
    achieved: 489000,
    orders: 41,
    conversion: 4.1,
    rating: 4.7,
    status: 'active'
  },
  {
    id: 'REP-006',
    name: 'Sanjay Gupta',
    email: 'sanjay@codestam.com',
    region: 'Kolkata',
    target: 350000,
    achieved: 298000,
    orders: 28,
    conversion: 3.5,
    rating: 4.3,
    status: 'active'
  }
];

export const RECENT_ACTIVITIES: Activity[] = [
  {
    id: 1,
    type: 'order-placed',
    message: 'New high-value order placed by TechCorp Solutions (₹1,25,000)',
    time: '15 minutes ago',
    icon: <OrderIcon size={16} />,
    priority: 'high'
  },
  {
    id: 2,
    type: 'payment-received',
    message: 'Payment received for Order #ORD-2024-005 (₹1,56,000)',
    time: '1 hour ago',
    icon: <PaymentIcon size={16} />,
    priority: 'medium'
  },
  {
    id: 3,
    type: 'order-shipped',
    message: 'Order #ORD-2024-003 shipped to Global Enterprises',
    time: '2 hours ago',
    icon: <InventoryIcon size={16} />,
    priority: 'medium'
  },
  {
    id: 4,
    type: 'target-achieved',
    message: 'Amit Singh achieved 95% of monthly target',
    time: '4 hours ago',
    icon: <UserIcon size={16} />,
    priority: 'low'
  },
  {
    id: 5,
    type: 'order-cancelled',
    message: 'Order #ORD-2024-004 cancelled by StartupHub',
    time: '6 hours ago',
    icon: <WarningIcon size={16} />,
    priority: 'high'
  },
  {
    id: 6,
    type: 'new-lead',
    message: 'New high-potential lead from Fortune 500 company',
    time: '8 hours ago',
    icon: <CustomersIcon size={16} />,
    priority: 'high'
  },
  {
    id: 7,
    type: 'meeting-scheduled',
    message: 'Product demo scheduled with Enterprise Solutions Ltd',
    time: '10 hours ago',
    icon: <UserIcon size={16} />,
    priority: 'medium'
  },
  {
    id: 8,
    type: 'contract-signed',
    message: 'Annual maintenance contract signed with Manufacturing Corp',
    time: '12 hours ago',
    icon: <InvoiceIcon size={16} />,
    priority: 'high'
  },
  {
    id: 9,
    type: 'follow-up-reminder',
    message: 'Follow-up reminder for Retail Chain India order',
    time: '1 day ago',
    icon: <WarningIcon size={16} />,
    priority: 'medium'
  },
  {
    id: 10,
    type: 'training-completed',
    message: 'Sales team completed new product training',
    time: '2 days ago',
    icon: <SettingsIcon size={16} />,
    priority: 'low'
  }
];

export const QUICK_ACTIONS: QuickAction[] = [
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