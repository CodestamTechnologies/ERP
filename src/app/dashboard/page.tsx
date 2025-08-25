'use client';

import { motion, } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDashboard } from '@/hooks/useDashboard';
import { 
  DashboardStatsSkeleton,
  DashboardActivitiesSkeleton,
  DashboardInsightsSkeleton,
  DashboardChartSkeleton,
  PageHeaderSkeleton
} from '@/components/ui/skeletons';
import { 
  STATS, 
  RECENT_ACTIVITIES, 
  AI_INSIGHTS, 
  INVENTORY_STATUS, 
  QUICK_ACTIONS 
} from '@/lib/components-Data/dashboard/constent';
import { 
  getChangeColor, 
  getInsightColor, 
  getStatusColor, 
  getActivityIconColor 
} from '@/lib/components-imp-utils/dashboard';
import { AIInsightsIcon, ChartIcon } from '@/components/Icons';

const Dashboard = () => {
  const {
    selectedTimeRange,
    setSelectedTimeRange,
    isGeneratingReport,
    isLoading,
    handleGenerateReport
  } = useDashboard();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        {/* Header Skeleton */}
        <PageHeaderSkeleton />
        
        {/* Stats Skeleton */}
        <DashboardStatsSkeleton />
        
        {/* Main Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activities Skeleton */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <DashboardActivitiesSkeleton />
              </CardContent>
            </Card>
          </div>
          
          {/* Insights Skeleton */}
          <div>
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="flex items-center">
                  <AIInsightsIcon size={20} className="mr-2" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <DashboardInsightsSkeleton />
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <DashboardChartSkeleton />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Inventory Status</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <DashboardChartSkeleton />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here&apos;s what&apos;s happening with your business.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Select value={selectedTimeRange} onValueChange={(value) => setSelectedTimeRange(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="7days" value="7days">Last 7 Days</SelectItem>
              <SelectItem key="30days" value="30days">Last 30 Days</SelectItem>
              <SelectItem key="90days" value="90days">Last 90 Days</SelectItem>
              <SelectItem key="1year" value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handleGenerateReport}
            disabled={isGeneratingReport}
          >
            {isGeneratingReport ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </div>
            ) : (
              'Generate Report'
            )}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      {stat.icon && (
                        <div className="mr-2 text-gray-400">
                          {stat.icon}
                        </div>
                      )}
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={getChangeColor(stat.changeType)}>
                    {stat.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {RECENT_ACTIVITIES.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start space-x-3"
                  >
                    <div className={`flex-shrink-0 ${getActivityIconColor(activity.type)}`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <div>
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center">
                <AIInsightsIcon size={20} className="mr-2" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {AI_INSIGHTS.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-l-4 border-blue-500 pl-4"
                  >
                    <h3 className="text-sm font-medium text-gray-900">{insight.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                    <div className="flex items-center mt-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={getInsightColor(insight.type)}
                          style={{ width: `${insight.confidence}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">{insight.confidence}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Revenue trends for {selectedTimeRange}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
              <div className="text-center">
                <ChartIcon size={48} className="mx-auto mb-4 text-blue-500" />
                <p className="text-gray-700 font-medium">Sales Analytics</p>
                <p className="text-sm text-gray-500 mt-1">Interactive chart showing revenue trends</p>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">₹2.84Cr</div>
                    <div className="text-xs text-gray-500">Total Revenue</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">+12.5%</div>
                    <div className="text-xs text-gray-500">Growth</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">1,247</div>
                    <div className="text-xs text-gray-500">Orders</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Status */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Inventory Status</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {INVENTORY_STATUS.map((status, index) => (
                <motion.div
                  key={status.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-gray-600">{status.label}</span>
                  <span className={getStatusColor(status.color)}>
                    {status.count.toLocaleString()} items
                  </span>
                </motion.div>
              ))}
              
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Stock Health</span>
                  <span>85%</span>
                </div>
                <Progress value={85} className="w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used actions for quick access</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {QUICK_ACTIONS.map((action) => (
              <motion.button
                key={action.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="p-2 bg-blue-50 rounded-lg mb-2 group-hover:bg-blue-100 transition-colors">
                  {action.icon}
                </div>
                <span className="text-sm text-gray-700 text-center font-medium">{action.name}</span>
                {action.description && (
                  <span className="text-xs text-gray-500 text-center mt-1">{action.description}</span>
                )}
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;