'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAIInsights } from '@/hooks/useAiInsights';
import { 
  DashboardStatsSkeleton,
  CardGridSkeleton,
  ListSkeleton,
  PageHeaderSkeleton,
  CardSkeleton
} from '@/components/ui/skeletons';
import { 
  AI_METRICS, 
  AI_INSIGHTS, 
  AI_MODELS, 
  AI_REPORTS, 
  CHAT_HISTORY, 
  AI_ACTIONS, 
  TABS 
} from '@/lib/components-Data/aiInsights/constent';
import { 
  getConfidenceColor, 
  getImpactColor, 
  getStatusColor 
} from '@/lib/components-imp-utils/aiInsights';
import { AIInsightsIcon } from '@/components/Icons';

export default function AIInsightsPage() {
  const {
    activeTab,
    setActiveTab,
    selectedTimeframe,
    setSelectedTimeframe,
    selectedModel,
    setSelectedModel,
    isAnalyzing,
    isLoading,
    handleAnalyze
  } = useAIInsights();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        {/* Header Skeleton */}
        <PageHeaderSkeleton />
        
        {/* Stats Skeleton */}
        <DashboardStatsSkeleton />
        
        {/* Main Content Skeleton */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle>AI Insights & Analytics</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <CardGridSkeleton count={4} />
          </CardContent>
        </Card>
        
        {/* Quick Actions Skeleton */}
        <CardSkeleton />
        
        {/* Bottom Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Latest AI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ListSkeleton items={3} />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* AI Insights Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {AI_INSIGHTS.slice(0, 4).map((insight) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-50 rounded-lg mr-3">
                          {insight.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{insight.title}</CardTitle>
                          <CardDescription>{insight.category}</CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge variant="outline" className={getStatusColor(insight.status)}>
                          {insight.status}
                        </Badge>
                        <Badge variant="outline" className={getImpactColor(insight.impact)}>
                          {insight.impact} impact
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{insight.description}</p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Confidence</span>
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                              <Progress value={insight.confidence} className="h-2" />
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
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* AI Performance Chart */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>AI Performance Trends</CardTitle>
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                    <SelectItem value="1year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>
        );

      case 'models':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {AI_MODELS.map((model) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>{model.name}</CardTitle>
                        <CardDescription>{model.description}</CardDescription>
                      </div>
                      <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                        {model.status}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">Accuracy</span>
                          <span className="font-medium">{model.accuracy}%</span>
                        </div>
                        <Progress value={model.accuracy} className="w-full" />
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
                        <Button variant="outline" className="flex-1">
                          View Details
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Retrain Model
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {AI_REPORTS.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div>
                        <CardTitle>{report.title}</CardTitle>
                        <CardDescription className="mt-1">{report.description}</CardDescription>
                      </div>
                      <Badge variant={report.status === 'ready' ? 'default' : 'secondary'}>
                        {report.status}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
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
                        <Button className="flex-1">
                          Download Report
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Schedule
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'chat':
        return (
          <Card>
            <CardHeader className="border-b">
              <CardTitle>AI Assistant Chat</CardTitle>
              <CardDescription>Ask me anything about your business data and insights</CardDescription>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="h-96 overflow-y-auto p-6 space-y-4">
                {CHAT_HISTORY.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, x: message.type === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
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
                  </motion.div>
                ))}
              </div>
              
              <div className="p-6 border-t">
                <div className="flex space-x-3">
                  <Input
                    type="text"
                    placeholder="Ask AI about your business insights..."
                    className="flex-1"
                  />
                  <Button>
                    Send
                  </Button>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    'Show revenue forecast',
                    'Identify at-risk customers',
                    'Optimize inventory levels',
                    'Analyze market trends'
                  ].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
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
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select AI model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic AI</SelectItem>
              <SelectItem value="advanced">Advanced AI</SelectItem>
              <SelectItem value="enterprise">Enterprise AI</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            {isAnalyzing ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing...
              </div>
            ) : (
              'Run AI Analysis'
            )}
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {AI_METRICS.map((metric) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-white to-blue-50">
              <CardContent className="p-6">
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
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content with Tabs */}
      <Card>
        <CardHeader className="border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start">
              {TABS.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center space-x-2">
                  {tab.icon}
                  <span>{tab.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* AI Quick Actions */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader className="border-b">
          <CardTitle>AI-Powered Quick Actions</CardTitle>
          <CardDescription>Intelligent actions powered by machine learning</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {AI_ACTIONS.map((action) => (
              <motion.button
                key={action.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 group"
              >
                <div className={`p-3 rounded-lg mb-2 bg-${action.color}-50 group-hover:bg-${action.color}-100 transition-colors`}>
                  {action.icon}
                </div>
                <span className="text-sm font-medium text-gray-900 text-center">{action.name}</span>
                <span className="text-xs text-gray-500 text-center mt-1">{action.description}</span>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Latest AI Insights</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {AI_INSIGHTS.slice(0, 3).map((insight) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
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
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>AI Performance</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
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
              
              <Button className="w-full">
                View Detailed Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}