'use client';

import { useState } from 'react';
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
  DashboardIcon
} from './Icons';

const Sales = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const salesStats = [
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

  const salesChannels = [
    { id: 'online', name: 'Online Store', revenue: 1850000, orders: 756, growth: '+18.2%', color: 'blue' },
    { id: 'retail', name: 'Retail Store', revenue: 680000, orders: 234, growth: '+5.8%', color: 'green' },
    { id: 'wholesale', name: 'Wholesale', revenue: 310000, orders: 89, growth: '+22.1%', color: 'purple' },
    { id: 'b2b', name: 'B2B Sales', revenue: 890000, orders: 168, growth: '+12.4%', color: 'orange' },
  ];

  const salesOrders = [
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
    }
  ];

  const salesTeam = [
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
    }
  ];

  const recentActivities = [
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
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'partial':
        return 'bg-orange-100 text-orange-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
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

  const filteredOrders = salesOrders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.salesRep.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Sales Channels */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Sales Channels Performance</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {salesChannels.map((channel) => (
                    <div key={channel.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{channel.name}</h4>
                        <span className={`text-sm font-medium text-${channel.color}-600`}>
                          {channel.growth}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Revenue:</span>
                          <span className="font-medium">{formatIndianCurrency(channel.revenue)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Orders:</span>
                          <span className="font-medium">{channel.orders}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Avg Order:</span>
                          <span className="font-medium">{formatIndianCurrency(channel.revenue / channel.orders)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sales Chart Placeholder */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                    <option value="1year">Last Year</option>
                  </select>
                </div>
              </div>
              <div className="p-6">
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <ChartIcon size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Interactive Sales Chart</p>
                    <p className="text-sm text-gray-500 mt-1">Revenue trend over {selectedPeriod}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <h3 className="text-lg font-semibold text-gray-900">Sales Orders</h3>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search orders..."
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
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="amount">Sort by Amount</option>
                    <option value="customer">Sort by Customer</option>
                    <option value="status">Sort by Status</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount & Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sales Rep
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.id}</div>
                          <div className="text-sm text-gray-500">{order.date}</div>
                          <div className="text-xs text-gray-400">Due: {order.dueDate}</div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getPriorityColor(order.priority)}`}>
                            {order.priority} priority
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                          <div className="text-sm text-gray-500">{order.customerEmail}</div>
                          <div className="text-xs text-gray-400">{order.region}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{formatIndianCurrency(order.amount)}</div>
                          <div className="text-sm text-gray-500">{order.items} items</div>
                          <div className="text-xs text-gray-400">{order.category}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <div>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                              {order.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.salesRep}</div>
                        <div className="text-sm text-gray-500">{order.channel}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-green-600">{formatIndianCurrency(order.profit)}</div>
                          <div className="text-xs text-gray-500">
                            {((order.profit / (order.amount - order.tax)) * 100).toFixed(1)}% margin
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">View</button>
                          <button className="text-green-600 hover:text-green-900">Edit</button>
                          <button className="text-purple-600 hover:text-purple-900">Invoice</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Sales Team Performance</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {salesTeam.map((rep) => (
                    <div key={rep.id} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                          <span className="text-white text-sm font-medium">
                            {getInitials(rep.name)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{rep.name}</h4>
                          <p className="text-sm text-gray-500">{rep.region}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm text-gray-600 ml-1">{rep.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">Target Achievement</span>
                            <span className="font-medium">{((rep.achieved / rep.target) * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(rep.achieved / rep.target) * 100}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{formatIndianCurrency(rep.achieved)}</span>
                            <span>{formatIndianCurrency(rep.target)}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Orders:</span>
                            <div className="font-medium">{rep.orders}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Conversion:</span>
                            <div className="font-medium">{rep.conversion}%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            {/* Advanced Analytics Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Revenue by Category</h3>
                </div>
                <div className="p-6">
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <ChartIcon size={48} className="mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">Pie Chart - Revenue Distribution</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Sales Forecast</h3>
                </div>
                <div className="p-6">
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <AIInsightsIcon size={48} className="mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">AI-Powered Sales Prediction</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Key Performance Indicators</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">₹22,785</div>
                    <div className="text-sm text-gray-500">Average Order Value</div>
                    <div className="text-xs text-green-600 mt-1">+15.3% vs last month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">3.8%</div>
                    <div className="text-sm text-gray-500">Conversion Rate</div>
                    <div className="text-xs text-green-600 mt-1">+0.5% vs last month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">18.2</div>
                    <div className="text-sm text-gray-500">Days Sales Cycle</div>
                    <div className="text-xs text-red-600 mt-1">+2.1 days vs last month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">92%</div>
                    <div className="text-sm text-gray-500">Customer Satisfaction</div>
                    <div className="text-xs text-green-600 mt-1">+3% vs last month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <SalesIcon size={28} className="mr-3" />
            Sales Management
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive sales analytics and order management</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Export Report
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Create Order
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Sales Forecast
          </button>
        </div>
      </div>

      {/* Enhanced Stats Grid with Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {salesStats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
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
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Target: {stat.target}</span>
                <span>{stat.progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${stat.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content with Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview', icon: <DashboardIcon size={16} /> },
              { id: 'orders', name: 'Orders', icon: <OrderIcon size={16} /> },
              { id: 'team', name: 'Sales Team', icon: <UserIcon size={16} /> },
              { id: 'analytics', name: 'Analytics', icon: <ChartIcon size={16} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Sidebar with Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                  { name: 'New Quote', icon: <OrderIcon size={24} />, color: 'blue' },
                  { name: 'Follow Up', icon: <UserIcon size={24} />, color: 'green' },
                  { name: 'Sales Report', icon: <ChartIcon size={24} />, color: 'purple' },
                  { name: 'Customer Call', icon: <CustomersIcon size={24} />, color: 'yellow' },
                  { name: 'Pipeline Review', icon: <AIInsightsIcon size={24} />, color: 'indigo' },
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

        <div className="lg:col-span-1">
          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 p-1 rounded ${
                      activity.priority === 'high' ? 'bg-red-100' :
                      activity.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                    }`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span>{activity.time}</span>
                        <span className="mx-1">•</span>
                        <span className={`font-medium ${
                          activity.priority === 'high' ? 'text-red-600' :
                          activity.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {activity.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;