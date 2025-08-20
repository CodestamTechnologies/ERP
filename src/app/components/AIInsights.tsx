'use client';

import { useState } from 'react';
import { 
  AIInsightsIcon, 
  ChartIcon, 
  CustomersIcon, 
  OrderIcon,
  PaymentIcon,
  InventoryIcon,
  UserIcon,
  SettingsIcon,
  WarningIcon,
  SalesIcon,
  DashboardIcon,
  SuppliersIcon,
  FinanceIcon,
  ReportsIcon
} from './Icons';

const AIInsights = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30days');
  const [selectedModel, setSelectedModel] = useState('advanced');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const aiMetrics = [
    { 
      name: 'AI Accuracy Score', 
      value: '94.8%', 
      change: '+2.3%', 
      changeType: 'positive', 
      icon: <AIInsightsIcon size={24} />,
      description: 'Overall AI prediction accuracy'
    },
    { 
      name: 'Insights Generated', 
      value: '1,247', 
      change: '+18.5%', 
      changeType: 'positive', 
      icon: <ChartIcon size={24} />,
      description: 'AI insights generated this month'
    },
    { 
      name: 'Automated Actions', 
      value: '89', 
      change: '+12.1%', 
      changeType: 'positive', 
      icon: <SettingsIcon size={24} />,
      description: 'Actions automated by AI'
    },
    { 
      name: 'Cost Savings', 
      value: '₹12.4L', 
      change: '+25.7%', 
      changeType: 'positive', 
      icon: <PaymentIcon size={24} />,
      description: 'Cost saved through AI optimization'
    },
  ];

  const aiInsights = [
    {
      id: 1,
      type: 'revenue_forecast',
      title: 'Revenue Forecast Alert',
      description: 'AI predicts 23% revenue increase in Q2 based on current sales patterns and market trends.',
      confidence: 92,
      impact: 'high',
      category: 'Sales',
      icon: <SalesIcon size={20} />,
      recommendation: 'Increase inventory for top-selling products by 30%',
      timeframe: 'Next 90 days',
      status: 'active',
      createdAt: '2 hours ago'
    },
    {
      id: 2,
      type: 'customer_churn',
      title: 'Customer Churn Risk',
      description: '15 high-value customers show signs of potential churn based on engagement patterns.',
      confidence: 87,
      impact: 'high',
      category: 'Customer',
      icon: <CustomersIcon size={20} />,
      recommendation: 'Launch targeted retention campaign with personalized offers',
      timeframe: 'Immediate action required',
      status: 'urgent',
      createdAt: '4 hours ago'
    },
    {
      id: 3,
      type: 'inventory_optimization',
      title: 'Inventory Optimization',
      description: 'AI identified ₹8.5L worth of slow-moving inventory that can be optimized.',
      confidence: 95,
      impact: 'medium',
      category: 'Inventory',
      icon: <InventoryIcon size={20} />,
      recommendation: 'Implement dynamic pricing for 23 slow-moving items',
      timeframe: 'Next 30 days',
      status: 'active',
      createdAt: '6 hours ago'
    },
    {
      id: 4,
      type: 'supplier_risk',
      title: 'Supplier Risk Assessment',
      description: '3 suppliers show delivery delay patterns that may impact operations.',
      confidence: 78,
      impact: 'medium',
      category: 'Supply Chain',
      icon: <SuppliersIcon size={20} />,
      recommendation: 'Diversify supplier base and negotiate backup agreements',
      timeframe: 'Next 60 days',
      status: 'monitoring',
      createdAt: '8 hours ago'
    },
    {
      id: 5,
      type: 'market_opportunity',
      title: 'Market Opportunity Detected',
      description: 'AI identified emerging demand for eco-friendly products in your market segment.',
      confidence: 89,
      impact: 'high',
      category: 'Market',
      icon: <ChartIcon size={20} />,
      recommendation: 'Explore partnerships with sustainable product suppliers',
      timeframe: 'Next 120 days',
      status: 'opportunity',
      createdAt: '12 hours ago'
    }
  ];

  const aiModels = [
    {
      id: 'sales_predictor',
      name: 'Sales Predictor',
      description: 'Advanced ML model for sales forecasting',
      accuracy: 94.2,
      status: 'active',
      lastTrained: '2024-01-15',
      predictions: 1247
    },
    {
      id: 'customer_behavior',
      name: 'Customer Behavior Analyzer',
      description: 'Deep learning model for customer insights',
      accuracy: 91.8,
      status: 'active',
      lastTrained: '2024-01-14',
      predictions: 892
    },
    {
      id: 'inventory_optimizer',
      name: 'Inventory Optimizer',
      description: 'AI model for inventory management',
      accuracy: 96.5,
      status: 'active',
      lastTrained: '2024-01-13',
      predictions: 567
    },
    {
      id: 'risk_assessor',
      name: 'Risk Assessor',
      description: 'Predictive model for business risk analysis',
      accuracy: 88.7,
      status: 'training',
      lastTrained: '2024-01-12',
      predictions: 234
    }
  ];

  const aiReports = [
    {
      id: 'weekly_insights',
      title: 'Weekly AI Insights Report',
      description: 'Comprehensive weekly analysis with AI-generated insights',
      type: 'automated',
      frequency: 'Weekly',
      lastGenerated: '2024-01-15',
      size: '2.4 MB',
      insights: 45,
      status: 'ready'
    },
    {
      id: 'customer_analysis',
      title: 'Customer Behavior Analysis',
      description: 'Deep dive into customer patterns and preferences',
      type: 'on-demand',
      frequency: 'Monthly',
      lastGenerated: '2024-01-10',
      size: '5.7 MB',
      insights: 78,
      status: 'ready'
    },
    {
      id: 'market_trends',
      title: 'Market Trends Forecast',
      description: 'AI-powered market trend analysis and predictions',
      type: 'automated',
      frequency: 'Bi-weekly',
      lastGenerated: '2024-01-08',
      size: '3.2 MB',
      insights: 32,
      status: 'generating'
    },
    {
      id: 'risk_assessment',
      title: 'Business Risk Assessment',
      description: 'Comprehensive risk analysis across all business areas',
      type: 'on-demand',
      frequency: 'Quarterly',
      lastGenerated: '2024-01-05',
      size: '8.1 MB',
      insights: 156,
      status: 'ready'
    }
  ];

  const chatHistory = [
    {
      id: 1,
      type: 'user',
      message: 'What are the top 3 risks to our business this quarter?',
      timestamp: '10:30 AM'
    },
    {
      id: 2,
      type: 'ai',
      message: 'Based on my analysis, the top 3 risks are: 1) Customer churn risk (15 high-value customers), 2) Supply chain delays from 3 key suppliers, 3) Inventory overstock in electronics category (₹8.5L at risk). Would you like detailed mitigation strategies?',
      timestamp: '10:31 AM'
    },
    {
      id: 3,
      type: 'user',
      message: 'Yes, provide mitigation strategies for customer churn',
      timestamp: '10:32 AM'
    },
    {
      id: 4,
      type: 'ai',
      message: 'For customer churn mitigation: 1) Launch personalized retention campaigns for at-risk customers, 2) Implement loyalty rewards program, 3) Proactive customer success outreach, 4) Analyze feedback patterns to address pain points. Estimated impact: 60% churn reduction, ₹18L revenue protection.',
      timestamp: '10:33 AM'
    }
  ];

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100';
    if (confidence >= 80) return 'text-blue-600 bg-blue-100';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'monitoring':
        return 'bg-yellow-100 text-yellow-800';
      case 'opportunity':
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

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* AI Insights Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {aiInsights.slice(0, 4).map((insight) => (
                <div key={insight.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-50 rounded-lg mr-3">
                        {insight.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                        <p className="text-sm text-gray-500">{insight.category}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(insight.status)}`}>
                        {insight.status}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getImpactColor(insight.impact)}`}>
                        {insight.impact} impact
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{insight.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Confidence</span>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${getConfidenceColor(insight.confidence).includes('green') ? 'bg-green-500' : 
                              getConfidenceColor(insight.confidence).includes('blue') ? 'bg-blue-500' : 
                              getConfidenceColor(insight.confidence).includes('yellow') ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${insight.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{insight.confidence}%</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-900 mb-1">AI Recommendation:</p>
                      <p className="text-sm text-gray-700">{insight.recommendation}</p>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Timeline: {insight.timeframe}</span>
                      <span>{insight.createdAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Performance Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">AI Performance Trends</h3>
                  <select
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value)}
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
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                  <div className="text-center">
                    <AIInsightsIcon size={48} className="mx-auto mb-4 text-blue-500" />
                    <p className="text-gray-700 font-medium">AI Performance Analytics</p>
                    <p className="text-sm text-gray-500 mt-1">Interactive performance metrics over {selectedTimeframe}</p>
                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">94.8%</div>
                        <div className="text-xs text-gray-500">Accuracy</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">1,247</div>
                        <div className="text-xs text-gray-500">Predictions</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">89</div>
                        <div className="text-xs text-gray-500">Actions</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'models':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {aiModels.map((model) => (
                <div key={model.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{model.name}</h3>
                      <p className="text-sm text-gray-500">{model.description}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      model.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {model.status}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">Accuracy</span>
                        <span className="font-medium">{model.accuracy}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${model.accuracy}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Last Trained:</span>
                        <div className="font-medium">{model.lastTrained}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Predictions:</span>
                        <div className="font-medium">{model.predictions.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded text-sm hover:bg-blue-100">
                        View Details
                      </button>
                      <button className="flex-1 bg-gray-50 text-gray-600 px-3 py-2 rounded text-sm hover:bg-gray-100">
                        Retrain Model
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {aiReports.map((report) => (
                <div key={report.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      report.status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <div className="font-medium capitalize">{report.type}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Frequency:</span>
                        <div className="font-medium">{report.frequency}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Generated:</span>
                        <div className="font-medium">{report.lastGenerated}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Size:</span>
                        <div className="font-medium">{report.size}</div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-900">AI Insights Generated</span>
                        <span className="text-lg font-bold text-blue-600">{report.insights}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">
                        Download Report
                      </button>
                      <button className="flex-1 bg-gray-50 text-gray-600 px-3 py-2 rounded text-sm hover:bg-gray-100">
                        Schedule
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'chat':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">AI Assistant Chat</h3>
              <p className="text-sm text-gray-500 mt-1">Ask me anything about your business data and insights</p>
            </div>
            
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {chatHistory.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Ask AI about your business insights..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Send
                </button>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  'Show revenue forecast',
                  'Identify at-risk customers',
                  'Optimize inventory levels',
                  'Analyze market trends'
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-200"
                  >
                    {suggestion}
                  </button>
                ))}
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
            <AIInsightsIcon size={28} className="mr-3" />
            AI Insights & Analytics
          </h1>
          <p className="text-gray-600 mt-1">Advanced AI-powered business intelligence and predictive analytics</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="basic">Basic AI</option>
            <option value="advanced">Advanced AI</option>
            <option value="enterprise">Enterprise AI</option>
          </select>
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing...
              </div>
            ) : (
              'Run AI Analysis'
            )}
          </button>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {aiMetrics.map((metric) => (
          <div key={metric.name} className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  {metric.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                </div>
              </div>
              <div className={`text-sm font-medium ${
                metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </div>
            </div>
            <p className="text-xs text-gray-500">{metric.description}</p>
          </div>
        ))}
      </div>

      {/* Main Content with Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'overview', name: 'AI Overview', icon: <DashboardIcon size={16} /> },
              { id: 'models', name: 'AI Models', icon: <SettingsIcon size={16} /> },
              { id: 'reports', name: 'AI Reports', icon: <ReportsIcon size={16} /> },
              { id: 'chat', name: 'AI Assistant', icon: <AIInsightsIcon size={16} /> },
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

      {/* AI Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">AI-Powered Quick Actions</h2>
          <p className="text-sm text-gray-600 mt-1">Intelligent actions powered by machine learning</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Predict Sales', icon: <SalesIcon size={24} />, color: 'blue', description: 'AI sales forecasting' },
              { name: 'Risk Analysis', icon: <WarningIcon size={24} />, color: 'red', description: 'Business risk assessment' },
              { name: 'Customer Insights', icon: <CustomersIcon size={24} />, color: 'green', description: 'Behavior analysis' },
              { name: 'Inventory AI', icon: <InventoryIcon size={24} />, color: 'purple', description: 'Smart inventory optimization' },
              { name: 'Market Trends', icon: <ChartIcon size={24} />, color: 'yellow', description: 'Trend prediction' },
              { name: 'AI Settings', icon: <SettingsIcon size={24} />, color: 'gray', description: 'Configure AI models' },
            ].map((action) => (
              <button
                key={action.name}
                className="flex flex-col items-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 group"
              >
                <div className={`p-3 rounded-lg mb-2 bg-${action.color}-50 group-hover:bg-${action.color}-100 transition-colors`}>
                  {action.icon}
                </div>
                <span className="text-sm font-medium text-gray-900 text-center">{action.name}</span>
                <span className="text-xs text-gray-500 text-center mt-1">{action.description}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Latest AI Insights</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {aiInsights.slice(0, 3).map((insight) => (
                  <div key={insight.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      {insight.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{insight.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor(insight.confidence)}`}>
                          {insight.confidence}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{insight.category}</span>
                        <span>{insight.createdAt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">AI Performance</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">94.8%</div>
                <div className="text-sm text-gray-500">Overall AI Accuracy</div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Predictions Made:</span>
                  <span className="font-medium">2,847</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Actions Automated:</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Cost Savings:</span>
                  <span className="font-medium text-green-600">₹12.4L</span>
                </div>
              </div>
              
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                View Detailed Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;