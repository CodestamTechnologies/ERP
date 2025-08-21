import {
  AIMetric,
  AIInsight,
  AIModel,
  AIReport,
  ChatMessage,
  AIAction
} from '@/types/aiInsights';
import {
  AIInsightsIcon,
  ChartIcon,
  CustomersIcon,
  SettingsIcon,
  PaymentIcon,
  SalesIcon,
  InventoryIcon,
  SuppliersIcon,
  WarningIcon,
  DashboardIcon,
  ReportsIcon,
  UserIcon,
  OrderIcon,
  FinanceIcon
} from '@/components/Icons'

export const AI_METRICS: AIMetric[] = [
  { 
    name: 'AI Accuracy Score', 
    value: '94.8%', 
    change: '+2.3%', 
    changeType: 'positive', 
    icon: <AIInsightsIcon size={24} />,
    description: 'Overall AI prediction accuracy',
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

export const AI_INSIGHTS: AIInsight[] = [
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
  },
  {
    id: 6,
    type: 'employee_productivity',
    title: 'Productivity Insights',
    description: 'AI detected patterns showing 35% higher productivity during morning hours.',
    confidence: 82,
    impact: 'medium',
    category: 'Operations',
    icon: <UserIcon size={20} />,
    recommendation: 'Schedule critical tasks between 9 AM - 12 PM for optimal output',
    timeframe: 'Next 14 days',
    status: 'active',
    createdAt: '1 day ago'
  },
  {
    id: 7,
    type: 'cash_flow_forecast',
    title: 'Cash Flow Prediction',
    description: 'AI forecasts positive cash flow of ₹25.7L in next quarter based on current trends.',
    confidence: 91,
    impact: 'high',
    category: 'Finance',
    icon: <FinanceIcon size={20} />,
    recommendation: 'Consider strategic investments in marketing and expansion',
    timeframe: 'Next 90 days',
    status: 'opportunity',
    createdAt: '1 day ago'
  },
  {
    id: 8,
    type: 'fraud_detection',
    title: 'Suspicious Activity Detected',
    description: 'AI identified 3 transactions with potential fraud patterns requiring review.',
    confidence: 96,
    impact: 'high',
    category: 'Security',
    icon: <WarningIcon size={20} />,
    recommendation: 'Immediately review transactions and contact customers for verification',
    timeframe: 'Immediate action required',
    status: 'urgent',
    createdAt: '2 days ago'
  }
];

export const AI_MODELS: AIModel[] = [
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
  },
  {
    id: 'demand_forecaster',
    name: 'Demand Forecaster',
    description: 'Neural network for product demand prediction',
    accuracy: 93.1,
    status: 'active',
    lastTrained: '2024-01-11',
    predictions: 678
  },
  {
    id: 'price_optimizer',
    name: 'Price Optimization Engine',
    description: 'AI model for dynamic pricing strategies',
    accuracy: 95.3,
    status: 'active',
    lastTrained: '2024-01-10',
    predictions: 432
  }
];

export const AI_REPORTS: AIReport[] = [
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
  },
  {
    id: 'performance_analytics',
    title: 'AI Performance Analytics',
    description: 'Detailed analysis of AI model performance and accuracy',
    type: 'automated',
    frequency: 'Monthly',
    lastGenerated: '2024-01-03',
    size: '4.2 MB',
    insights: 67,
    status: 'ready'
  },
  {
    id: 'competitor_analysis',
    title: 'Competitor Intelligence Report',
    description: 'AI-driven analysis of competitor strategies and market position',
    type: 'on-demand',
    frequency: 'Quarterly',
    lastGenerated: '2023-12-28',
    size: '6.8 MB',
    insights: 89,
    status: 'ready'
  }
];

export const CHAT_HISTORY: ChatMessage[] = [
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
  },
  {
    id: 5,
    type: 'user',
    message: 'How can we optimize our inventory levels?',
    timestamp: '10:35 AM'
  },
  {
    id: 6,
    type: 'ai',
    message: 'Inventory optimization strategies: 1) Implement dynamic pricing for 23 slow-moving items, 2) Create bundled offers for complementary products, 3) Run targeted promotions for overstocked items, 4) Adjust reorder points based on predictive demand patterns. Potential savings: ₹8.5L in tied-up capital.',
    timestamp: '10:36 AM'
  },
  {
    id: 7,
    type: 'user',
    message: 'Show me the sales forecast for next quarter',
    timestamp: '10:38 AM'
  },
  {
    id: 8,
    type: 'ai',
    message: 'Q2 Sales Forecast: Expected revenue increase of 23% based on current trends. Top performing categories: Electronics (+35%), Home Appliances (+28%), Fashion (+19%). Recommendation: Increase inventory for top-selling products by 30% to meet anticipated demand.',
    timestamp: '10:39 AM'
  }
];

export const AI_ACTIONS: AIAction[] = [
  { name: 'Predict Sales', icon: <SalesIcon size={24} />, color: 'blue', description: 'AI sales forecasting' },
  { name: 'Risk Analysis', icon: <WarningIcon size={24} />, color: 'red', description: 'Business risk assessment' },
  { name: 'Customer Insights', icon: <CustomersIcon size={24} />, color: 'green', description: 'Behavior analysis' },
  { name: 'Inventory AI', icon: <InventoryIcon size={24} />, color: 'purple', description: 'Smart inventory optimization' },
  { name: 'Market Trends', icon: <ChartIcon size={24} />, color: 'yellow', description: 'Trend prediction' },
  { name: 'AI Settings', icon: <SettingsIcon size={24} />, color: 'gray', description: 'Configure AI models' },
  { name: 'Order Analysis', icon: <OrderIcon size={24} />, color: 'orange', description: 'Order pattern insights' },
  { name: 'Financial Forecast', icon: <FinanceIcon size={24} />, color: 'indigo', description: 'Revenue predictions' },
  { name: 'Supplier Analytics', icon: <SuppliersIcon size={24} />, color: 'pink', description: 'Vendor performance' },
  { name: 'Employee Productivity', icon: <UserIcon size={24} />, color: 'teal', description: 'Team performance insights' },
  { name: 'Generate Report', icon: <ReportsIcon size={24} />, color: 'cyan', description: 'Create custom reports' },
  { name: 'AI Recommendations', icon: <AIInsightsIcon size={24} />, color: 'amber', description: 'Get AI suggestions' }
];

export const TABS = [
  { id: 'overview', name: 'AI Overview', icon: <DashboardIcon size={16} /> },
  { id: 'models', name: 'AI Models', icon: <SettingsIcon size={16} /> },
  { id: 'reports', name: 'AI Reports', icon: <ReportsIcon size={16} /> },
  { id: 'chat', name: 'AI Assistant', icon: <AIInsightsIcon size={16} /> },
];