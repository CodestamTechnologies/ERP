import {
  InventoryStat,
  Category,
  InventoryItem,
  Activity,
  QuickAction
} from '@/types/inventory';
import {
  InventoryIcon,
  WarningIcon,
  OrderIcon,
  ChartIcon,
  SettingsIcon,
  UserIcon
} from '@/components/Icons';

export const INVENTORY_STATS: InventoryStat[] = [
  { 
    name: 'Total Items', 
    value: '8,432', 
    change: '+2.3%', 
    changeType: 'positive', 
    icon: <InventoryIcon size={24} /> 
  },
  { 
    name: 'Low Stock Items', 
    value: '127', 
    change: '+15.2%', 
    changeType: 'negative', 
    icon: <WarningIcon size={24} /> 
  },
  { 
    name: 'Out of Stock', 
    value: '23', 
    change: '-8.1%', 
    changeType: 'positive', 
    icon: <WarningIcon size={24} /> 
  },
  { 
    name: 'Total Value', 
    value: '₹20.0Cr', 
    change: '+5.7%', 
    changeType: 'positive', 
    icon: <ChartIcon size={24} /> 
  },
];

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'All Categories', count: 8432 },
  { id: 'electronics', name: 'Electronics', count: 2341 },
  { id: 'office', name: 'Office Supplies', count: 1876 },
  { id: 'furniture', name: 'Furniture', count: 987 },
  { id: 'software', name: 'Software', count: 654 },
  { id: 'accessories', name: 'Accessories', count: 2574 },
  { id: 'hardware', name: 'Hardware', count: 1234 },
  { id: 'networking', name: 'Networking', count: 876 },
  { id: 'peripherals', name: 'Peripherals', count: 1567 },
  { id: 'storage', name: 'Storage', count: 789 },
];

export const INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'INV-001',
    name: 'MacBook Pro 16" M3',
    category: 'Electronics',
    sku: 'MBP-16-M3-512',
    quantity: 45,
    minStock: 10,
    price: 208250.00,
    supplier: 'Apple Inc.',
    lastUpdated: '2024-01-15',
    status: 'in-stock',
    image: '/api/placeholder/60/60'
  },
  {
    id: 'INV-002',
    name: 'Dell UltraSharp 27" Monitor',
    category: 'Electronics',
    sku: 'DELL-US27-4K',
    quantity: 8,
    minStock: 15,
    price: 49999.00,
    supplier: 'Dell Technologies',
    lastUpdated: '2024-01-14',
    status: 'low-stock',
    image: '/api/placeholder/60/60'
  },
  {
    id: 'INV-003',
    name: 'Ergonomic Office Chair',
    category: 'Furniture',
    sku: 'CHAIR-ERG-001',
    quantity: 0,
    minStock: 5,
    price: 24999.00,
    supplier: 'Herman Miller',
    lastUpdated: '2024-01-13',
    status: 'out-of-stock',
    image: '/api/placeholder/60/60'
  },
  {
    id: 'INV-004',
    name: 'Wireless Mouse',
    category: 'Accessories',
    sku: 'MOUSE-WL-001',
    quantity: 156,
    minStock: 25,
    price: 6659.00,
    supplier: 'Logitech',
    lastUpdated: '2024-01-15',
    status: 'in-stock',
    image: '/api/placeholder/60/60'
  },
  {
    id: 'INV-005',
    name: 'Adobe Creative Suite License',
    category: 'Software',
    sku: 'ADOBE-CS-2024',
    quantity: 12,
    minStock: 20,
    price: 49999.00,
    supplier: 'Adobe Systems',
    lastUpdated: '2024-01-12',
    status: 'low-stock',
    image: '/api/placeholder/60/60'
  },
  {
    id: 'INV-006',
    name: 'Standing Desk Converter',
    category: 'Furniture',
    sku: 'DESK-STAND-001',
    quantity: 34,
    minStock: 8,
    price: 16659.00,
    supplier: 'Varidesk',
    lastUpdated: '2024-01-14',
    status: 'in-stock',
    image: '/api/placeholder/60/60'
  },
  {
    id: 'INV-007',
    name: 'Network Switch 24-Port',
    category: 'Networking',
    sku: 'NET-SW-24P',
    quantity: 18,
    minStock: 10,
    price: 18999.00,
    supplier: 'Cisco Systems',
    lastUpdated: '2024-01-11',
    status: 'in-stock',
    image: '/api/placeholder/60/60'
  },
  {
    id: 'INV-008',
    name: 'External SSD 1TB',
    category: 'Storage',
    sku: 'SSD-EXT-1TB',
    quantity: 6,
    minStock: 15,
    price: 8999.00,
    supplier: 'Samsung',
    lastUpdated: '2024-01-10',
    status: 'low-stock',
    image: '/api/placeholder/60/60'
  },
  {
    id: 'INV-009',
    name: 'Mechanical Keyboard',
    category: 'Peripherals',
    sku: 'KB-MECH-001',
    quantity: 0,
    minStock: 12,
    price: 7499.00,
    supplier: 'Corsair',
    lastUpdated: '2024-01-09',
    status: 'out-of-stock',
    image: '/api/placeholder/60/60'
  },
  {
    id: 'INV-010',
    name: 'Office Desk Lamp',
    category: 'Office',
    sku: 'LAMP-DESK-001',
    quantity: 67,
    minStock: 20,
    price: 2999.00,
    supplier: 'IKEA',
    lastUpdated: '2024-01-08',
    status: 'in-stock',
    image: '/api/placeholder/60/60'
  }
];

export const RECENT_ACTIVITIES: Activity[] = [
  {
    id: 1,
    type: 'stock-in',
    message: 'Received 50 units of MacBook Pro 16" M3',
    time: '2 hours ago',
    icon: <OrderIcon size={16} />,
    user: 'John Doe'
  },
  {
    id: 2,
    type: 'stock-out',
    message: 'Sold 15 units of Wireless Mouse',
    time: '4 hours ago',
    icon: <InventoryIcon size={16} />,
    user: 'Sarah Wilson'
  },
  {
    id: 3,
    type: 'low-stock',
    message: 'Low stock alert: Dell UltraSharp Monitor (8 units)',
    time: '6 hours ago',
    icon: <WarningIcon size={16} />,
    user: 'System'
  },
  {
    id: 4,
    type: 'reorder',
    message: 'Reorder request sent for Ergonomic Office Chair',
    time: '1 day ago',
    icon: <OrderIcon size={16} />,
    user: 'Mike Johnson'
  },
  {
    id: 5,
    type: 'stock-in',
    message: 'Received 25 units of Network Switch',
    time: '2 days ago',
    icon: <OrderIcon size={16} />,
    user: 'Lisa Chen'
  },
  {
    id: 6,
    type: 'stock-adjustment',
    message: 'Quantity adjusted for External SSD (damaged units)',
    time: '3 days ago',
    icon: <SettingsIcon size={16} />,
    user: 'David Kumar'
  }
];

export const QUICK_ACTIONS: QuickAction[] = [
  { name: 'Bulk Import', icon: <OrderIcon size={24} />, color: 'blue' },
  { name: 'Generate Report', icon: <ChartIcon size={24} />, color: 'green' },
  { name: 'Stock Audit', icon: <InventoryIcon size={24} />, color: 'purple' },
  { name: 'Low Stock Alert', icon: <WarningIcon size={24} />, color: 'yellow' },
  { name: 'Supplier Orders', icon: <UserIcon size={24} />, color: 'indigo' },
  { name: 'Settings', icon: <SettingsIcon size={24} />, color: 'gray' },
  { name: 'Add Item', icon: <InventoryIcon size={24} />, color: 'orange' },
  { name: 'Export Data', icon: <ChartIcon size={24} />, color: 'pink' }
];