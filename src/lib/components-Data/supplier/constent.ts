import React from 'react';
import { 
  SuppliersIcon, 
  UserIcon, 
  FinanceIcon,
  ReportsIcon,
  PaymentIcon
} from '@/components/Icons';
import { 
  CheckCircle,
  Package,
  Star,
  Phone,
  Mail,
  Building,
  Truck,
  TrendingUp
} from 'lucide-react';
import { SupplierStat, SupplierCategory, Supplier, Activity, QuickAction } from '@/types/supplier';

export const SUPPLIER_STATS: SupplierStat[] = [
  {
    name: 'Total Suppliers',
    value: '156',
    change: '+12%',
    changeType: 'positive',
    icon: React.createElement(SuppliersIcon, { size: 20, className: "text-blue-600" })
  },
  {
    name: 'Active Suppliers',
    value: '142',
    change: '+8%',
    changeType: 'positive',
    icon: React.createElement(CheckCircle, { size: 20, className: "text-green-600" })
  },
  {
    name: 'Total Capacity',
    value: '2.5M units',
    change: '+15%',
    changeType: 'positive',
    icon: React.createElement(Package, { size: 20, className: "text-purple-600" })
  },
  {
    name: 'Avg Rating',
    value: '4.2',
    change: '+0.3',
    changeType: 'positive',
    icon: React.createElement(Star, { size: 20, className: "text-yellow-600" })
  }
];

export const SUPPLIER_CATEGORIES: SupplierCategory[] = [
  { id: 'all', name: 'All Suppliers', count: 156, color: 'blue' },
  { id: 'raw-materials', name: 'Raw Materials', count: 45, color: 'green' },
  { id: 'electronics', name: 'Electronics', count: 32, color: 'purple' },
  { id: 'packaging', name: 'Packaging', count: 28, color: 'orange' },
  { id: 'logistics', name: 'Logistics', count: 24, color: 'blue' },
  { id: 'services', name: 'Services', count: 18, color: 'indigo' },
  { id: 'machinery', name: 'Machinery', count: 9, color: 'red' }
];

export const SUPPLIERS: Supplier[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    contactPerson: 'John Smith',
    email: 'john.smith@techcorp.com',
    phone: '+91 98765 43210',
    category: 'Electronics',
    location: 'Mumbai, Maharashtra',
    totalOrders: 145,
    totalPaid: 2850000,
    pendingAmount: 125000,
    lastOrder: '2024-01-15',
    status: 'active',
    rating: 4.5,
    joinDate: '2022-03-15',
    paymentTerms: '30 days',
    tags: ['Reliable', 'Fast Delivery'],
    // New fields as requested
    company: 'TechCorp Solutions Pvt Ltd',
    number: 'SUP001',
    capacity: '50,000 units/month',
    activeHours: '9:00 AM - 6:00 PM IST',
    market: 'Electronics & Components'
  },
  {
    id: '2',
    name: 'Global Materials Inc',
    contactPerson: 'Sarah Johnson',
    email: 'sarah.j@globalmaterials.com',
    phone: '+91 87654 32109',
    category: 'Raw Materials',
    location: 'Chennai, Tamil Nadu',
    totalOrders: 89,
    totalPaid: 1750000,
    pendingAmount: 0,
    lastOrder: '2024-01-12',
    status: 'active',
    rating: 4.2,
    joinDate: '2021-08-20',
    paymentTerms: '45 days',
    tags: ['Quality', 'Bulk Orders'],
    company: 'Global Materials Inc',
    number: 'SUP002',
    capacity: '100 tons/month',
    activeHours: '8:00 AM - 7:00 PM IST',
    market: 'Raw Materials & Chemicals'
  },
  {
    id: '3',
    name: 'PackPro Industries',
    contactPerson: 'Mike Chen',
    email: 'mike.chen@packpro.com',
    phone: '+91 76543 21098',
    category: 'Packaging',
    location: 'Pune, Maharashtra',
    totalOrders: 67,
    totalPaid: 980000,
    pendingAmount: 45000,
    lastOrder: '2024-01-10',
    status: 'active',
    rating: 4.0,
    joinDate: '2022-11-05',
    paymentTerms: '30 days',
    tags: ['Eco-friendly', 'Custom Design'],
    company: 'PackPro Industries Ltd',
    number: 'SUP003',
    capacity: '25,000 packages/day',
    activeHours: '7:00 AM - 8:00 PM IST',
    market: 'Packaging & Printing'
  },
  {
    id: '4',
    name: 'Swift Logistics',
    contactPerson: 'Emma Wilson',
    email: 'emma.w@swiftlogistics.com',
    phone: '+91 65432 10987',
    category: 'Logistics',
    location: 'Delhi, NCR',
    totalOrders: 234,
    totalPaid: 1250000,
    pendingAmount: 75000,
    lastOrder: '2024-01-14',
    status: 'active',
    rating: 4.3,
    joinDate: '2021-05-12',
    paymentTerms: '15 days',
    tags: ['Fast', '24/7 Service'],
    company: 'Swift Logistics Pvt Ltd',
    number: 'SUP004',
    capacity: '500 deliveries/day',
    activeHours: '24/7',
    market: 'Transportation & Logistics'
  },
  {
    id: '5',
    name: 'MachineWorks Ltd',
    contactPerson: 'David Brown',
    email: 'david.b@machineworks.com',
    phone: '+91 54321 09876',
    category: 'Machinery',
    location: 'Bangalore, Karnataka',
    totalOrders: 23,
    totalPaid: 4500000,
    pendingAmount: 250000,
    lastOrder: '2024-01-08',
    status: 'active',
    rating: 4.7,
    joinDate: '2020-09-18',
    paymentTerms: '60 days',
    tags: ['High Quality', 'Technical Support'],
    company: 'MachineWorks Ltd',
    number: 'SUP005',
    capacity: '10 machines/month',
    activeHours: '9:00 AM - 5:00 PM IST',
    market: 'Industrial Machinery'
  },
  {
    id: '6',
    name: 'ServicePro Solutions',
    contactPerson: 'Lisa Garcia',
    email: 'lisa.g@servicepro.com',
    phone: '+91 43210 98765',
    category: 'Services',
    location: 'Hyderabad, Telangana',
    totalOrders: 156,
    totalPaid: 890000,
    pendingAmount: 0,
    lastOrder: '2024-01-13',
    status: 'active',
    rating: 4.1,
    joinDate: '2022-01-30',
    paymentTerms: '30 days',
    tags: ['Professional', 'Certified'],
    company: 'ServicePro Solutions',
    number: 'SUP006',
    capacity: '20 projects/month',
    activeHours: '9:00 AM - 6:00 PM IST',
    market: 'Professional Services'
  },
  {
    id: '7',
    name: 'ElectroMax Components',
    contactPerson: 'Robert Taylor',
    email: 'robert.t@electromax.com',
    phone: '+91 32109 87654',
    category: 'Electronics',
    location: 'Kolkata, West Bengal',
    totalOrders: 78,
    totalPaid: 1650000,
    pendingAmount: 95000,
    lastOrder: '2024-01-11',
    status: 'pending',
    rating: 3.9,
    joinDate: '2023-02-14',
    paymentTerms: '45 days',
    tags: ['Components', 'Bulk Supply'],
    company: 'ElectroMax Components Pvt Ltd',
    number: 'SUP007',
    capacity: '75,000 components/month',
    activeHours: '8:30 AM - 6:30 PM IST',
    market: 'Electronic Components'
  },
  {
    id: '8',
    name: 'GreenPack Eco',
    contactPerson: 'Jennifer Lee',
    email: 'jennifer.l@greenpack.com',
    phone: '+91 21098 76543',
    category: 'Packaging',
    location: 'Ahmedabad, Gujarat',
    totalOrders: 45,
    totalPaid: 560000,
    pendingAmount: 0,
    lastOrder: '2024-01-09',
    status: 'active',
    rating: 4.4,
    joinDate: '2023-06-22',
    paymentTerms: '30 days',
    tags: ['Sustainable', 'Biodegradable'],
    company: 'GreenPack Eco Solutions',
    number: 'SUP008',
    capacity: '15,000 eco-packages/day',
    activeHours: '8:00 AM - 7:00 PM IST',
    market: 'Sustainable Packaging'
  }
];

export const RECENT_ACTIVITIES: Activity[] = [
  {
    id: 1,
    type: 'new-order',
    message: 'New order placed for electronics components',
    time: '2 hours ago',
    icon: React.createElement(Package, { size: 16 }),
    supplier: 'TechCorp Solutions'
  },
  {
    id: 2,
    type: 'payment',
    message: 'Payment of ₹2,50,000 processed',
    time: '4 hours ago',
    icon: React.createElement(PaymentIcon, { size: 16 }),
    supplier: 'Global Materials Inc'
  },
  {
    id: 3,
    type: 'new-supplier',
    message: 'New supplier registered',
    time: '1 day ago',
    icon: React.createElement(UserIcon, { size: 16 }),
    supplier: 'EcoFriendly Pack'
  },
  {
    id: 4,
    type: 'delivery',
    message: 'Delivery completed successfully',
    time: '2 days ago',
    icon: React.createElement(Truck, { size: 16 }),
    supplier: 'Swift Logistics'
  }
];

export const QUICK_ACTIONS: QuickAction[] = [
  {
    name: 'Add Supplier',
    icon: React.createElement(UserIcon, { size: 20 }),
    color: 'blue'
  },
  {
    name: 'Import Data',
    icon: React.createElement(TrendingUp, { size: 20 }),
    color: 'green'
  },
  {
    name: 'Export Report',
    icon: React.createElement(ReportsIcon, { size: 20 }),
    color: 'purple'
  },
  {
    name: 'Send Email',
    icon: React.createElement(Mail, { size: 20 }),
    color: 'red'
  },
  {
    name: 'Schedule Call',
    icon: React.createElement(Phone, { size: 20 }),
    color: 'orange'
  },
  {
    name: 'View Analytics',
    icon: React.createElement(TrendingUp, { size: 20 }),
    color: 'indigo'
  },
  {
    name: 'Manage Orders',
    icon: React.createElement(Package, { size: 20 }),
    color: 'pink'
  },
  {
    name: 'Settings',
    icon: React.createElement(Building, { size: 20 }),
    color: 'gray'
  }
];