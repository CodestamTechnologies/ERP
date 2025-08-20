'use client';

import { useState } from 'react';
import { 
  SuppliersIcon, 
  UserIcon, 
  OrderIcon, 
  PaymentIcon,
  ChartIcon,
  SettingsIcon,
  WarningIcon,
  InventoryIcon
} from './Icons';

const Suppliers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  const supplierStats = [
    { name: 'Total Suppliers', value: '456', change: '+8.2%', changeType: 'positive', icon: <SuppliersIcon size={24} /> },
    { name: 'Active Suppliers', value: '389', change: '+5.1%', changeType: 'positive', icon: <UserIcon size={24} /> },
    { name: 'Pending Orders', value: '23', change: '-12.3%', changeType: 'positive', icon: <OrderIcon size={24} /> },
    { name: 'Total Payable', value: '₹45.2L', change: '+18.7%', changeType: 'negative', icon: <PaymentIcon size={24} /> },
  ];

  const supplierCategories = [
    { id: 'all', name: 'All Suppliers', count: 456, color: 'blue' },
    { id: 'electronics', name: 'Electronics', count: 123, color: 'purple' },
    { id: 'furniture', name: 'Furniture', count: 87, color: 'green' },
    { id: 'software', name: 'Software', count: 45, color: 'indigo' },
    { id: 'office-supplies', name: 'Office Supplies', count: 98, color: 'yellow' },
    { id: 'services', name: 'Services', count: 103, color: 'pink' },
  ];

  const suppliers = [
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
    }
  ];

  const recentActivities = [
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
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'pending':
        return 'Pending';
      case 'suspended':
        return 'Suspended';
      default:
        return 'Unknown';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'electronics':
        return 'bg-purple-100 text-purple-800';
      case 'furniture':
        return 'bg-green-100 text-green-800';
      case 'software':
        return 'bg-indigo-100 text-indigo-800';
      case 'office supplies':
        return 'bg-yellow-100 text-yellow-800';
      case 'services':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           supplier.category.toLowerCase().replace(' ', '-') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <SuppliersIcon size={28} className="mr-3" />
            Supplier Management
          </h1>
          <p className="text-gray-600 mt-1">Manage your supplier relationships and procurement</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Export Data
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add New Supplier
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {supplierStats.map((stat) => (
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
        {/* Supplier Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {supplierCategories.map((category) => (
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
                        <span>{activity.supplier}</span>
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

        {/* Supplier Table */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Table Header with Search and Filters */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <h2 className="text-lg font-semibold text-gray-900">Supplier List</h2>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search suppliers..."
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
                    <option value="totalPaid">Sort by Total Paid</option>
                    <option value="totalOrders">Sort by Orders</option>
                    <option value="rating">Sort by Rating</option>
                  </select>
                  <div className="flex border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode('table')}
                      className={`px-3 py-2 text-sm ${viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                    >
                      Table
                    </button>
                    <button
                      onClick={() => setViewMode('cards')}
                      className={`px-3 py-2 text-sm ${viewMode === 'cards' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                    >
                      Cards
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Content */}
            {viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Supplier
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Orders
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Paid
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pending
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
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
                    {filteredSuppliers.map((supplier) => (
                      <tr key={supplier.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <div className="h-12 w-12 bg-indigo-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {getInitials(supplier.name)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                              <div className="text-sm text-gray-500">{supplier.contactPerson}</div>
                              <div className="text-xs text-gray-400">{supplier.location}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{supplier.email}</div>
                          <div className="text-sm text-gray-500">{supplier.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(supplier.category)}`}>
                            {supplier.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{supplier.totalOrders}</div>
                          <div className="text-xs text-gray-500">Last: {supplier.lastOrder}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatIndianCurrency(supplier.totalPaid)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${supplier.pendingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {supplier.pendingAmount > 0 ? formatIndianCurrency(supplier.pendingAmount) : 'Nil'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${getRatingColor(supplier.rating)}`}>
                            ★ {supplier.rating}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(supplier.status)}`}>
                            {getStatusText(supplier.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">View</button>
                            <button className="text-green-600 hover:text-green-900">Order</button>
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
            ) : (
              /* Cards View */
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredSuppliers.map((supplier) => (
                    <div key={supplier.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 bg-indigo-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-medium">
                              {getInitials(supplier.name)}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{supplier.name}</h3>
                            <p className="text-xs text-gray-500">{supplier.contactPerson}</p>
                          </div>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(supplier.status)}`}>
                          {getStatusText(supplier.status)}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Category:</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(supplier.category)}`}>
                            {supplier.category}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Total Orders:</span>
                          <span className="text-gray-900 font-medium">{supplier.totalOrders}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Total Paid:</span>
                          <span className="text-gray-900 font-medium">{formatIndianCurrency(supplier.totalPaid)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Pending:</span>
                          <span className={`font-medium ${supplier.pendingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {supplier.pendingAmount > 0 ? formatIndianCurrency(supplier.pendingAmount) : 'Nil'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Rating:</span>
                          <span className={`font-medium ${getRatingColor(supplier.rating)}`}>
                            ★ {supplier.rating}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Location:</span>
                          <span className="text-gray-900">{supplier.location}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded text-sm hover:bg-blue-100">
                          View Details
                        </button>
                        <button className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded text-sm hover:bg-green-100">
                          Create Order
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredSuppliers.length}</span> of{' '}
                  <span className="font-medium">{filteredSuppliers.length}</span> results
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
              { name: 'Import Suppliers', icon: <SuppliersIcon size={24} />, color: 'blue' },
              { name: 'Create PO', icon: <OrderIcon size={24} />, color: 'green' },
              { name: 'Payment Report', icon: <PaymentIcon size={24} />, color: 'purple' },
              { name: 'Performance Review', icon: <ChartIcon size={24} />, color: 'yellow' },
              { name: 'Vendor Audit', icon: <UserIcon size={24} />, color: 'indigo' },
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

export default Suppliers;