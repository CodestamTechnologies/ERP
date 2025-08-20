'use client';

import { 
  OrderIcon, 
  PaymentIcon, 
  WarningIcon, 
  UserIcon, 
  AIInsightsIcon, 
  ChartIcon, 
  InventoryIcon, 
  InvoiceIcon, 
  DashboardIcon 
} from './Icons';

const Dashboard = () => {
  const stats = [
    { name: 'Total Revenue', value: '₹2,84,73,920', change: '+12.5%', changeType: 'positive' },
    { name: 'Active Orders', value: '1,247', change: '+8.2%', changeType: 'positive' },
    { name: 'Inventory Items', value: '8,432', change: '-2.1%', changeType: 'negative' },
    { name: 'Active Customers', value: '2,847', change: '+15.3%', changeType: 'positive' },
  ];

  const recentActivities = [
    { id: 1, type: 'order', message: 'New order #ORD-2024-001 received from TechCorp', time: '2 minutes ago', icon: <OrderIcon size={20} /> },
    { id: 2, type: 'payment', message: 'Payment of ₹12,50,000 received from GlobalTech', time: '15 minutes ago', icon: <PaymentIcon size={20} /> },
    { id: 3, type: 'inventory', message: 'Low stock alert: MacBook Pro (5 units remaining)', time: '1 hour ago', icon: <WarningIcon size={20} /> },
    { id: 4, type: 'customer', message: 'New customer registration: Innovation Labs', time: '2 hours ago', icon: <UserIcon size={20} /> },
    { id: 5, type: 'ai', message: 'AI detected potential sales opportunity with existing customer', time: '3 hours ago', icon: <AIInsightsIcon size={20} /> },
  ];

  const aiInsights = [
    {
      title: 'Sales Forecast',
      description: 'Based on current trends, expect 18% increase in Q4 sales',
      confidence: 92,
      type: 'positive'
    },
    {
      title: 'Inventory Optimization',
      description: 'Consider restocking 12 items to avoid stockouts',
      confidence: 87,
      type: 'warning'
    },
    {
      title: 'Customer Retention',
      description: '3 high-value customers at risk of churning',
      confidence: 78,
      type: 'negative'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here&apos;s what&apos;s happening with your business.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <span>{activity.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="mr-2"><AIInsightsIcon size={20} /></span>
              AI Insights
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {aiInsights.map((insight, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-sm font-medium text-gray-900">{insight.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                  <div className="flex items-center mt-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          insight.type === 'positive' ? 'bg-green-500' :
                          insight.type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${insight.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">{insight.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Sales Overview</h2>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="mb-4"><ChartIcon size={48} /></div>
                <p className="text-gray-600">Sales chart will be displayed here</p>
                <p className="text-sm text-gray-500 mt-1">Integration with charting library needed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Inventory Status</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">In Stock</span>
                <span className="text-sm font-medium text-green-600">7,234 items</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Low Stock</span>
                <span className="text-sm font-medium text-yellow-600">892 items</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Out of Stock</span>
                <span className="text-sm font-medium text-red-600">306 items</span>
              </div>
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Stock Health</span>
                  <span>85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
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
              { name: 'New Order', icon: <OrderIcon size={24} /> },
              { name: 'Add Customer', icon: <UserIcon size={24} /> },
              { name: 'Update Inventory', icon: <InventoryIcon size={24} /> },
              { name: 'Generate Invoice', icon: <InvoiceIcon size={24} /> },
              { name: 'View Reports', icon: <DashboardIcon size={24} /> },
              { name: 'AI Analysis', icon: <AIInsightsIcon size={24} /> },
            ].map((action) => (
              <button
                key={action.name}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="mb-2">{action.icon}</span>
                <span className="text-sm text-gray-700 text-center">{action.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;