'use client';

import { useState } from 'react';
import { 
  InventoryIcon, 
  WarningIcon, 
  OrderIcon, 
  ChartIcon,
  SettingsIcon,
  UserIcon
} from './Icons';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const inventoryStats = [
    { name: 'Total Items', value: '8,432', change: '+2.3%', changeType: 'positive', icon: <InventoryIcon size={24} /> },
    { name: 'Low Stock Items', value: '127', change: '+15.2%', changeType: 'negative', icon: <WarningIcon size={24} /> },
    { name: 'Out of Stock', value: '23', change: '-8.1%', changeType: 'positive', icon: <WarningIcon size={24} /> },
    { name: 'Total Value', value: '₹20.0Cr', change: '+5.7%', changeType: 'positive', icon: <ChartIcon size={24} /> },
  ];

  const categories = [
    { id: 'all', name: 'All Categories', count: 8432 },
    { id: 'electronics', name: 'Electronics', count: 2341 },
    { id: 'office', name: 'Office Supplies', count: 1876 },
    { id: 'furniture', name: 'Furniture', count: 987 },
    { id: 'software', name: 'Software', count: 654 },
    { id: 'accessories', name: 'Accessories', count: 2574 },
  ];

  const inventoryItems = [
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
    }
  ];

  const recentActivities = [
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
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-100 text-green-800';
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'In Stock';
      case 'low-stock':
        return 'Low Stock';
      case 'out-of-stock':
        return 'Out of Stock';
      default:
        return 'Unknown';
    }
  };

  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           item.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <InventoryIcon size={28} className="mr-3" />
            Inventory Management
          </h1>
          <p className="text-gray-600 mt-1">Track and manage your inventory items efficiently</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Export Data
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add New Item
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {inventoryStats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg mr-3">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
              </div>
              <div className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 p-1 bg-gray-100 rounded">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <UserIcon size={12} className="mr-1" />
                        <span>{activity.user}</span>
                        <span className="mx-1">•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Table Header with Search and Filters */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <h2 className="text-lg font-semibold text-gray-900">Inventory Items</h2>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="quantity">Sort by Quantity</option>
                    <option value="price">Sort by Price</option>
                    <option value="updated">Sort by Last Updated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <InventoryIcon size={20} />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.supplier}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.quantity}</div>
                        <div className="text-xs text-gray-500">Min: {item.minStock}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatIndianCurrency(item.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                          {getStatusText(item.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">Edit</button>
                          <button className="text-green-600 hover:text-green-900">Restock</button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <SettingsIcon size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredItems.length}</span> of{' '}
                  <span className="font-medium">{filteredItems.length}</span> results
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-500 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                    1
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-500 hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Bulk Import', icon: <OrderIcon size={24} />, color: 'blue' },
              { name: 'Generate Report', icon: <ChartIcon size={24} />, color: 'green' },
              { name: 'Stock Audit', icon: <InventoryIcon size={24} />, color: 'purple' },
              { name: 'Low Stock Alert', icon: <WarningIcon size={24} />, color: 'yellow' },
              { name: 'Supplier Orders', icon: <UserIcon size={24} />, color: 'indigo' },
              { name: 'Settings', icon: <SettingsIcon size={24} />, color: 'gray' },
            ].map((action) => (
              <button
                key={action.name}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className={`p-2 rounded-lg mb-2 bg-${action.color}-50 group-hover:bg-${action.color}-100 transition-colors`}>
                  {action.icon}
                </div>
                <span className="text-sm text-gray-700 text-center">{action.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;