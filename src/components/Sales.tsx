'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSales } from '@/hooks/useSales';
import { 
  SALES_STATS, 
  SALES_CHANNELS, 
  SALES_ORDERS, 
  SALES_TEAM, 
  RECENT_ACTIVITIES, 
  QUICK_ACTIONS, 
  TABS 
} from '@/lib/components-Data/sales/constent';
import { 
  getStatusColor, 
  getPaymentStatusColor, 
  getPriorityColor, 
  getActivityPriorityColor, 
  getActivityBgColor, 
  formatIndianCurrency, 
  getInitials 
} from '@/lib/components-imp-utils/sales';
import { SalesIcon, ChartIcon, AIInsightsIcon } from './Icons';

const Sales = () => {
  const {
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    selectedPeriod,
    setSelectedPeriod,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    setSortBy,
    isExporting,
    handleExport
  } = useSales();

  const filteredOrders = SALES_ORDERS.filter(order => {
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
            <Card>
              <CardHeader>
                <CardTitle>Sales Channels Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {SALES_CHANNELS.map((channel) => (
                    <motion.div
                      key={channel.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card>
                        <CardContent className="p-6">
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
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sales Chart */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Sales Trend</CardTitle>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Time range" />
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
                    <ChartIcon size={48} className="mx-auto mb-4 text-blue-500" />
                    <p className="text-gray-700 font-medium">Interactive Sales Chart</p>
                    <p className="text-sm text-gray-500 mt-1">Revenue trend over {selectedPeriod}</p>
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
          </div>
        );

      case 'orders':
        return (
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <CardTitle>Sales Orders</CardTitle>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="amount">Amount</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order Details</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount & Items</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sales Rep</TableHead>
                      <TableHead>Profit</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.id}</div>
                            <div className="text-sm text-gray-500">{order.date}</div>
                            <div className="text-xs text-gray-400">Due: {order.dueDate}</div>
                            <Badge variant="outline" className={getPriorityColor(order.priority)}>
                              {order.priority} priority
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.customer}</div>
                            <div className="text-sm text-gray-500">{order.customerEmail}</div>
                            <div className="text-xs text-gray-400">{order.region}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{formatIndianCurrency(order.amount)}</div>
                            <div className="text-sm text-gray-500">{order.items} items</div>
                            <div className="text-xs text-gray-400">{order.category}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="outline" className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                            <div>
                              <Badge variant="outline" className={getPaymentStatusColor(order.paymentStatus)}>
                                {order.paymentStatus}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">{order.salesRep}</div>
                          <div className="text-sm text-gray-500">{order.channel}</div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-green-600">{formatIndianCurrency(order.profit)}</div>
                            <div className="text-xs text-gray-500">
                              {((order.profit / (order.amount - order.tax)) * 100).toFixed(1)}% margin
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Edit</Button>
                            <Button variant="ghost" size="sm">Invoice</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        );

      case 'team':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Team Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {SALES_TEAM.map((rep) => (
                    <motion.div
                      key={rep.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center mb-4">
                            <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                              <span className="text-white text-sm font-medium">
                                {getInitials(rep.name)}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium">{rep.name}</h4>
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
                              <Progress value={(rep.achieved / rep.target) * 100} className="w-full" />
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
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                    <div className="text-center">
                      <ChartIcon size={48} className="mx-auto mb-4 text-blue-500" />
                      <p className="text-gray-700 font-medium">Pie Chart - Revenue Distribution</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sales Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
                    <div className="text-center">
                      <AIInsightsIcon size={48} className="mx-auto mb-4 text-green-500" />
                      <p className="text-gray-700 font-medium">AI-Powered Sales Prediction</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
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
          <Button 
            variant="outline"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                Exporting...
              </div>
            ) : (
              'Export Report'
            )}
          </Button>
          <Button variant="default">
            Create Order
          </Button>
          <Button>
            Sales Forecast
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SALES_STATS.map((stat) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
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
                  <Progress value={stat.progress} className="w-full" />
                </div>
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

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {QUICK_ACTIONS.map((action) => (
                  <motion.button
                    key={action.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className={`p-2 rounded-lg mb-2 bg-${action.color}-50 group-hover:bg-${action.color}-100 transition-colors`}>
                      {action.icon}
                    </div>
                    <span className="text-sm text-gray-700 text-center">{action.name}</span>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {RECENT_ACTIVITIES.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start space-x-3"
                  >
                    <div className={getActivityBgColor(activity.priority)}>
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span>{activity.time}</span>
                        <span className="mx-1">•</span>
                        <span className={getActivityPriorityColor(activity.priority)}>
                          {activity.priority}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Sales;