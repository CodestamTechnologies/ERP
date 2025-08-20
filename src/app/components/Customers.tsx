'use client';

import { useState } from 'react';
import { 
  CustomersIcon, 
  UserIcon, 
  OrderIcon, 
  PaymentIcon,
  ChartIcon,
  SettingsIcon,
  WarningIcon,
  AIInsightsIcon
} from './Icons';

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  const customerStats = [
    { name: 'Total Customers', value: '2,847', change: '+15.3%', changeType: 'positive', icon: <CustomersIcon size={24} /> },
    { name: 'Active Customers', value: '2,234', change: '+8.7%', changeType: 'positive', icon: <UserIcon size={24} /> },
    { name: 'New This Month', value: '156', change: '+23.1%', changeType: 'positive', icon: <UserIcon size={24} /> },
    { name: 'Total Revenue', value: '₹1.2Cr', change: '+12.4%', changeType: 'positive', icon: <ChartIcon size={24} /> },
  ];

  const customerSegments = [
    { id: 'all', name: 'All Customers', count: 2847, color: 'blue' },
    { id: 'enterprise', name: 'Enterprise', count: 234, color: 'purple' },
    { id: 'business', name: 'Business', count: 876, color: 'green' },
    { id: 'individual', name: 'Individual', count: 1456, color: 'yellow' },
    { id: 'inactive', name: 'Inactive', count: 281, color: 'red' },
  ];

  const customers = [
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
    }
  ];

  const recentActivities = [
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
      default:
        return 'Unknown';
    }
  };

  const getSegmentColor = (segment: string) => {
    switch (segment.toLowerCase()) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-800';
      case 'business':
        return 'bg-green-100 text-green-800';
      case 'individual':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = selectedSegment === 'all' || 
                          customer.segment.toLowerCase() === selectedSegment ||
                          (selectedSegment === 'inactive' && customer.status === 'inactive');
    return matchesSearch && matchesSegment;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <CustomersIcon size={28} className="mr-3" />
            Customer Management
          </h1>
          <p className="text-gray-600 mt-1">Manage and track your customer relationships</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Export Data
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add New Customer
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {customerStats.map((stat) => (
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
        {/* Customer Segments Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Customer Segments</h2>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {customerSegments.map((segment) => (
                  <button
                    key={segment.id}
                    onClick={() => setSelectedSegment(segment.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                      selectedSegment === segment.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{segment.name}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {segment.count}
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
                        <span>{activity.customer}</span>
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

        {/* Customer Table */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Table Header with Search and Filters */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <h2 className="text-lg font-semibold text-gray-900">Customer List</h2>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search customers..."
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
                    <option value="totalSpent">Sort by Total Spent</option>
                    <option value="totalOrders">Sort by Orders</option>
                    <option value="joinDate">Sort by Join Date</option>
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
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Segment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Orders
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Spent
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
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {getInitials(customer.name)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                              <div className="text-sm text-gray-500">{customer.company}</div>
                              <div className="text-xs text-gray-400">{customer.location}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{customer.email}</div>
                          <div className="text-sm text-gray-500">{customer.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSegmentColor(customer.segment)}`}>
                            {customer.segment}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{customer.totalOrders}</div>
                          <div className="text-xs text-gray-500">Last: {customer.lastOrder}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatIndianCurrency(customer.totalSpent)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                            {getStatusText(customer.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">View</button>
                            <button className="text-green-600 hover:text-green-900">Edit</button>
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
                  {filteredCustomers.map((customer) => (
                    <div key={customer.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-medium">
                              {getInitials(customer.name)}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{customer.name}</h3>
                            <p className="text-xs text-gray-500">{customer.company}</p>
                          </div>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                          {getStatusText(customer.status)}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Segment:</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getSegmentColor(customer.segment)}`}>
                            {customer.segment}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Total Orders:</span>
                          <span className="text-gray-900 font-medium">{customer.totalOrders}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Total Spent:</span>
                          <span className="text-gray-900 font-medium">{formatIndianCurrency(customer.totalSpent)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Location:</span>
                          <span className="text-gray-900">{customer.location}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded text-sm hover:bg-blue-100">
                          View Details
                        </button>
                        <button className="flex-1 bg-gray-50 text-gray-600 px-3 py-2 rounded text-sm hover:bg-gray-100">
                          Contact
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
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCustomers.length}</span> of{' '}
                  <span className="font-medium">{filteredCustomers.length}</span> results
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
              { name: 'Import Customers', icon: <UserIcon size={24} />, color: 'blue' },
              { name: 'Send Newsletter', icon: <PaymentIcon size={24} />, color: 'green' },
              { name: 'Customer Survey', icon: <ChartIcon size={24} />, color: 'purple' },
              { name: 'Loyalty Program', icon: <CustomersIcon size={24} />, color: 'yellow' },
              { name: 'AI Insights', icon: <AIInsightsIcon size={24} />, color: 'indigo' },
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

export default Customers;