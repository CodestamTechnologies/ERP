import {
  SupplierStat,
  SupplierCategory,
  Supplier,
  Activity,
  QuickAction
} from '@/types/supplier';
import {
  SuppliersIcon,
  UserIcon,
  OrderIcon,
  PaymentIcon,
  ChartIcon,
  SettingsIcon,
  WarningIcon,
  InventoryIcon
} from '@/components/Icons';

export const SUPPLIER_STATS: SupplierStat[] = [
  { 
    name: 'Total Suppliers', 
    value: '456', 
    change: '+8.2%', 
    changeType: 'positive', 
    icon: <SuppliersIcon size={24} /> 
  },
  { 
    name: 'Active Suppliers', 
    value: '389', 
    change: '+5.1%', 
    changeType: 'positive', 
    icon: <UserIcon size={24} /> 
  },
  { 
    name: 'Pending Orders', 
    value: '23', 
    change: '-12.3%', 
    changeType: 'positive', 
    icon: <OrderIcon size={24} /> 
  },
  { 
    name: 'Total Payable', 
    value: '₹45.2L', 
    change: '+18.7%', 
    changeType: 'negative', 
    icon: <PaymentIcon size={24} /> 
  },
];

export const SUPPLIER_CATEGORIES: SupplierCategory[] = [
  { id: 'all', name: 'All Suppliers', count: 456, color: 'blue' },
  { id: 'electronics', name: 'Electronics', count: 123, color: 'purple' },
  { id: 'furniture', name: 'Furniture', count: 87, color: 'green' },
  { id: 'software', name: 'Software', count: 45, color: 'indigo' },
  { id: 'office-supplies', name: 'Office Supplies', count: 98, color: 'yellow' },
  { id: 'services', name: 'Services', count: 103, color: 'pink' },
  { id: 'raw-materials', name: 'Raw Materials', count: 67, color: 'orange' },
  { id: 'logistics', name: 'Logistics', count: 34, color: 'cyan' },
];

export const SUPPLIERS: Supplier[] = [
  {
    id: 'SUP-001',
    name: 'TechSource India Pvt Ltd',
    contactPerson: 'Rajesh Gupta',
    email: 'rajesh@techsource.in',
    phone: '+91 98765 43210',
    category: 'Electronics',
    location: 'Mumbai, Maharashtra',
    totalOrders: 156,
    totalPaid: 2850000,
    pendingAmount: 125000,
    lastOrder: '2024-01-15',
    status: 'active',
    rating: 4.8,
    joinDate: '2021-06-15',
    paymentTerms: '30 Days',
    tags: ['Preferred', 'Bulk Supplier']
  },
  {
    id: 'SUP-002',
    name: 'Global Furniture Solutions',
    contactPerson: 'Priya Sharma',
    email: 'priya@globalfurniture.com',
    phone: '+91 87654 32109',
    category: 'Furniture',
    location: 'Bangalore, Karnataka',
    totalOrders: 89,
    totalPaid: 1650000,
    pendingAmount: 85000,
    lastOrder: '2024-01-12',
    status: 'active',
    rating: 4.5,
    joinDate: '2022-02-20',
    paymentTerms: '45 Days',
    tags: ['Quality Assured']
  },
  {
    id: 'SUP-003',
    name: 'Office Mart Supplies',
    contactPerson: 'Amit Kumar',
    email: 'amit@officemart.in',
    phone: '+91 76543 21098',
    category: 'Office Supplies',
    location: 'Delhi, NCR',
    totalOrders: 234,
    totalPaid: 890000,
    pendingAmount: 45000,
    lastOrder: '2024-01-14',
    status: 'active',
    rating: 4.2,
    joinDate: '2020-11-10',
    paymentTerms: '15 Days',
    tags: ['Fast Delivery']
  },
  {
    id: 'SUP-004',
    name: 'SoftTech Licensing',
    contactPerson: 'Neha Patel',
    email: 'neha@softtech.co.in',
    phone: '+91 65432 10987',
    category: 'Software',
    location: 'Pune, Maharashtra',
    totalOrders: 67,
    totalPaid: 3450000,
    pendingAmount: 250000,
    lastOrder: '2024-01-10',
    status: 'active',
    rating: 4.9,
    joinDate: '2021-09-05',
    paymentTerms: '60 Days',
    tags: ['Premium Partner']
  },
  {
    id: 'SUP-005',
    name: 'Industrial Services Co',
    contactPerson: 'Vikram Singh',
    email: 'vikram@industrialservices.in',
    phone: '+91 54321 09876',
    category: 'Services',
    location: 'Chennai, Tamil Nadu',
    totalOrders: 45,
    totalPaid: 567000,
    pendingAmount: 0,
    lastOrder: '2023-12-20',
    status: 'inactive',
    rating: 3.8,
    joinDate: '2022-07-18',
    paymentTerms: '30 Days',
    tags: ['Maintenance']
  },
  {
    id: 'SUP-006',
    name: 'Digital Solutions Hub',
    contactPerson: 'Kavya Reddy',
    email: 'kavya@digitalhub.com',
    phone: '+91 43210 98765',
    category: 'Electronics',
    location: 'Hyderabad, Telangana',
    totalOrders: 78,
    totalPaid: 1230000,
    pendingAmount: 95000,
    lastOrder: '2024-01-13',
    status: 'active',
    rating: 4.6,
    joinDate: '2023-01-25',
    paymentTerms: '30 Days',
    tags: ['New Partner']
  },
  {
    id: 'SUP-007',
    name: 'Material Source India',
    contactPerson: 'Sanjay Mehta',
    email: 'sanjay@materialsource.in',
    phone: '+91 32109 87654',
    category: 'Raw Materials',
    location: 'Ahmedabad, Gujarat',
    totalOrders: 112,
    totalPaid: 890000,
    pendingAmount: 67000,
    lastOrder: '2024-01-11',
    status: 'active',
    rating: 4.3,
    joinDate: '2021-03-15',
    paymentTerms: '30 Days',
    tags: ['Bulk Supplier']
  },
  {
    id: 'SUP-008',
    name: 'Logistics Express',
    contactPerson: 'Rahul Verma',
    email: 'rahul@logisticsexpress.com',
    phone: '+91 21098 76543',
    category: 'Logistics',
    location: 'Kolkata, West Bengal',
    totalOrders: 56,
    totalPaid: 345000,
    pendingAmount: 0,
    lastOrder: '2024-01-09',
    status: 'active',
    rating: 4.7,
    joinDate: '2022-09-10',
    paymentTerms: '15 Days',
    tags: ['Nationwide']
  },
  {
    id: 'SUP-009',
    name: 'Tech Components Ltd',
    contactPerson: 'Nisha Desai',
    email: 'nisha@techcomponents.com',
    phone: '+91 10987 65432',
    category: 'Electronics',
    location: 'Bengaluru, Karnataka',
    totalOrders: 134,
    totalPaid: 2345000,
    pendingAmount: 185000,
    lastOrder: '2024-01-08',
    status: 'active',
    rating: 4.4,
    joinDate: '2020-12-01',
    paymentTerms: '45 Days',
    tags: ['Components']
  },
  {
    id: 'SUP-010',
    name: 'Office Essentials',
    contactPerson: 'Mohan Kumar',
    email: 'mohan@officeessentials.in',
    phone: '+91 09876 54321',
    category: 'Office Supplies',
    location: 'Pune, Maharashtra',
    totalOrders: 98,
    totalPaid: 456000,
    pendingAmount: 23000,
    lastOrder: '2024-01-07',
    status: 'active',
    rating: 4.1,
    joinDate: '2023-02-14',
    paymentTerms: '30 Days',
    tags: ['Stationery']
  }
];

export const RECENT_ACTIVITIES: Activity[] = [
  {
    id: 1,
    type: 'new-supplier',
    message: 'New supplier registered: Advanced Tech Solutions',
    time: '2 hours ago',
    icon: <SuppliersIcon size={16} />,
    supplier: 'Advanced Tech Solutions'
  },
  {
    id: 2,
    type: 'order',
    message: 'Purchase order sent to TechSource India (₹1,25,000)',
    time: '4 hours ago',
    icon: <OrderIcon size={16} />,
    supplier: 'TechSource India'
  },
  {
    id: 3,
    type: 'payment',
    message: 'Payment made to Global Furniture Solutions (₹85,000)',
    time: '6 hours ago',
    icon: <PaymentIcon size={16} />,
    supplier: 'Global Furniture Solutions'
  },
  {
    id: 4,
    type: 'delivery',
    message: 'Delivery received from Office Mart Supplies',
    time: '8 hours ago',
    icon: <InventoryIcon size={16} />,
    supplier: 'Office Mart Supplies'
  },
  {
    id: 5,
    type: 'overdue',
    message: 'Payment overdue alert: Industrial Services Co',
    time: '1 day ago',
    icon: <WarningIcon size={16} />,
    supplier: 'Industrial Services Co'
  },
  {
    id: 6,
    type: 'rating',
    message: 'New rating received for Digital Solutions Hub (4.6 stars)',
    time: '2 days ago',
    icon: <ChartIcon size={16} />,
    supplier: 'Digital Solutions Hub'
  },
  {
    id: 7,
    type: 'contract',
    message: 'Contract renewed with Material Source India',
    time: '3 days ago',
    icon: <SettingsIcon size={16} />,
    supplier: 'Material Source India'
  },
  {
    id: 8,
    type: 'delayed',
    message: 'Delivery delayed from Logistics Express',
    time: '4 days ago',
    icon: <WarningIcon size={16} />,
    supplier: 'Logistics Express'
  }
];

export const QUICK_ACTIONS: QuickAction[] = [
  { name: 'Import Suppliers', icon: <SuppliersIcon size={24} />, color: 'blue' },
  { name: 'Create PO', icon: <OrderIcon size={24} />, color: 'green' },
  { name: 'Payment Report', icon: <PaymentIcon size={24} />, color: 'purple' },
  { name: 'Performance Review', icon: <ChartIcon size={24} />, color: 'yellow' },
  { name: 'Vendor Audit', icon: <UserIcon size={24} />, color: 'indigo' },
  { name: 'Settings', icon: <SettingsIcon size={24} />, color: 'gray' },
  { name: 'Track Delivery', icon: <InventoryIcon size={24} />, color: 'orange' },
  { name: 'Supplier Portal', icon: <SuppliersIcon size={24} />, color: 'pink' }
];