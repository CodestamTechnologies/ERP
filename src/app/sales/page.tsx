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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useSalesFirestore } from '@/hooks/useSalesFirestore';
import { 
  QUICK_ACTIONS, 
  TABS 
} from '@/lib/components-Data/sales/constent';
import { 
  getStatusColor, 
  getPaymentStatusColor, 
  getPriorityColor, 
  formatIndianCurrency, 
  getInitials 
} from '@/lib/components-imp-utils/sales';
import { SalesIcon, ChartIcon, OrderIcon, CustomersIcon } from '@/components/Icons';
import RecentActivities from '@/components/RecentActivities';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { SalesOrder, SalesTeamMember, Activity } from '@/types/Sales';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

// Define colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

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
    orders,
    teamMembers,
    activities,
    loading,
    salesStats,
    handleExport,
    handleAddOrder,
    handleUpdateOrder,
    handleDeleteOrder,
    handleAddTeamMember,
    handleUpdateTeamMember,
    handleDeleteTeamMember,
    connectionStatus,
    getConnectionStatusColor,
    getConnectionStatusText
  } = useSalesFirestore();

  // All useState hooks
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
  const [isOrderDetailDialogOpen, setIsOrderDetailDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [editingOrder, setEditingOrder] = useState<SalesOrder | null>(null);
  const [editingMember, setEditingMember] = useState<SalesTeamMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // useEffect hooks
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // useMemo hooks
  const salesChannelsData = useMemo(() => {
    const channels = [
      { id: 'online', name: 'Online Store', color: 'blue' },
      { id: 'retail', name: 'Retail Store', color: 'green' },
      { id: 'wholesale', name: 'Wholesale', color: 'purple' },
      { id: 'b2b', name: 'B2B Sales', color: 'orange' },
    ];

    return channels.map(channel => {
      const channelOrders = orders.filter(order => order.channel === channel.id);
      const revenue = channelOrders.reduce((sum, order) => sum + order.amount, 0);
      const orderCount = channelOrders.length;
      const avgOrderValue = orderCount > 0 ? revenue / orderCount : 0;
      const growth = channelOrders.length > 0 ? '+12.5%' : '+0%';

      return {
        ...channel,
        revenue,
        orders: orderCount,
        growth,
        avgOrderValue
      };
    });
  }, [orders]);

  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    
    orders.forEach(order => {
      if (!categories[order.category]) {
        categories[order.category] = 0;
      }
      categories[order.category] += order.amount;
    });

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value
    }));
  }, [orders]);

  const forecastData = useMemo(() => {
    const projectedRevenue = salesStats.totalRevenue * 1.3;
    const projectedOrders = salesStats.totalOrders * 1.25;
    
    return {
      currentRevenue: salesStats.totalRevenue,
      projectedRevenue,
      growthPercentage: '30%',
      projectedOrders
    };
  }, [salesStats]);

  const salesTrendData = useMemo(() => {
    const days = selectedPeriod === '7days' ? 7 : selectedPeriod === '30days' ? 30 : 
                selectedPeriod === '90days' ? 90 : 365;
    
    const data = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const dateString = date.toISOString().split('T')[0];
      const dayOrders = orders.filter(order => order.date === dateString);
      const revenue = dayOrders.reduce((sum, order) => sum + order.amount, 0);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue,
        orders: dayOrders.length
      });
    }
    
    return data;
  }, [orders, selectedPeriod]);

  const sortedOrders = useMemo(() => {
    const filtered = orders.filter(order => {
      const matchesSearch = debouncedSearchTerm === '' || 
                           order.customer.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           order.id.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           order.salesRep.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount;
        case 'customer':
          return a.customer.localeCompare(b.customer);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'date':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
  }, [orders, debouncedSearchTerm, selectedStatus, sortBy]);

  // useCallback hooks
  const handleTabChange = useCallback((newTab: string) => {
    setTimeout(() => {
      setActiveTab(newTab);
    }, 50);
  }, [setActiveTab]);

  // Stats data
  const SALES_STATS = [
    { 
      name: 'Total Revenue', 
      value: formatIndianCurrency(salesStats.totalRevenue), 
      change: salesStats.revenueChange, 
      changeType: 'positive', 
      icon: <SalesIcon size={24} />,
      target: formatIndianCurrency(salesStats.totalRevenue * 1.15),
      progress: Math.min(100, (salesStats.totalRevenue / (salesStats.totalRevenue * 1.15)) * 100)
    },
    { 
      name: 'Orders This Period', 
      value: salesStats.totalOrders.toString(), 
      change: salesStats.ordersChange, 
      changeType: 'positive', 
      icon: <OrderIcon size={24} />,
      target: Math.round(salesStats.totalOrders * 1.1).toString(),
      progress: Math.min(100, (salesStats.totalOrders / (salesStats.totalOrders * 1.1)) * 100)
    },
    { 
      name: 'Avg Order Value', 
      value: formatIndianCurrency(salesStats.avgOrderValue), 
      change: salesStats.avgOrderValueChange, 
      changeType: 'positive', 
      icon: <ChartIcon size={24} />,
      target: formatIndianCurrency(salesStats.avgOrderValue * 1.1),
      progress: Math.min(100, (salesStats.avgOrderValue / (salesStats.avgOrderValue * 1.1)) * 100)
    },
    { 
      name: 'Conversion Rate', 
      value: `${salesStats.conversionRate}%`, 
      change: salesStats.conversionRateChange, 
      changeType: 'positive', 
      icon: <CustomersIcon size={24} />,
      target: '4.2%',
      progress: Math.min(100, (salesStats.conversionRate / 4.2) * 100)
    },
  ];

  // Event handlers
  const handleViewOrderDetails = (order: SalesOrder) => {
    setSelectedOrder(order);
    setIsOrderDetailDialogOpen(true);
  };

  const handleActivityClick = (activity: Activity) => {
    const relatedOrder = orders.find(order => 
      activity.message.includes(order.id) || 
      activity.message.includes(order.customer)
    );
    
    if (relatedOrder) {
      setSelectedOrder(relatedOrder);
      setIsOrderDetailDialogOpen(true);
    }
  };

  const handleEditOrder = (order: SalesOrder) => {
    setEditingOrder(order);
    setIsOrderDialogOpen(true);
  };

  const handleEditTeamMember = (member: SalesTeamMember) => {
    setEditingMember(member);
    setIsTeamDialogOpen(true);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      
      const orderData = {
        customer: formData.get('customer') as string,
        customerEmail: formData.get('customerEmail') as string,
        amount: Number(formData.get('amount')),
        items: Number(formData.get('items')),
        status: formData.get('status') as string,
        priority: formData.get('priority') as string,
        channel: formData.get('channel') as string,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        paymentStatus: formData.get('paymentStatus') as string,
        salesRep: formData.get('salesRep') as string,
        region: formData.get('region') as string,
        category: formData.get('category') as string,
        profit: Number(formData.get('profit')),
        discount: Number(formData.get('discount')),
        tax: Number(formData.get('tax')),
        shippingCost: Number(formData.get('shippingCost'))
      };

      if (editingOrder) {
        await handleUpdateOrder(editingOrder.id, orderData);
      } else {
        await handleAddOrder(orderData);
      }
      
      setIsOrderDialogOpen(false);
      setEditingOrder(null);
    } catch (error) {
      console.error('Error saving order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateOrderClick = () => {
    setEditingOrder(null);
    setIsOrderDialogOpen(true);
  };

  const handleSubmitTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const memberData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      region: formData.get('region') as string,
      target: Number(formData.get('target')),
      achieved: Number(formData.get('achieved')),
      orders: Number(formData.get('orders')),
      conversion: Number(formData.get('conversion')),
      rating: Number(formData.get('rating')),
      status: formData.get('status') as string
    };

    try {
      if (editingMember) {
        await handleUpdateTeamMember(editingMember.id, memberData);
      } else {
        await handleAddTeamMember(memberData);
      }
      setIsTeamDialogOpen(false);
      setEditingMember(null);
    } catch (error) {
      console.error('Error saving team member:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Sales Channels */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Channels Performance</CardTitle>
                <CardDescription>Revenue distribution across different sales channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {salesChannelsData.map((channel) => (
                    <motion.div
                      key={channel.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="h-full">
                        <CardContent className="p-4">
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
                              <span className="font-medium">{formatIndianCurrency(channel.avgOrderValue)}</span>
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
                <div>
                  <CardTitle>Sales Trend</CardTitle>
                  <CardDescription>Revenue performance over time</CardDescription>
                </div>
                <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value)}>
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
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={salesTrendData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis 
                        yAxisId="left"
                        tickFormatter={(value) => `₹${value/1000}k`}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right"
                        tickFormatter={(value) => `${value}`}
                      />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'revenue' ? `₹${value}` : value,
                          name === 'revenue' ? 'Revenue' : 'Orders'
                        ]}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                        name="Revenue"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="orders"
                        stroke="#82ca9d"
                        name="Orders"
                      />
                    </LineChart>
                  </ResponsiveContainer>
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
                <div>
                  <CardTitle>Sales Orders</CardTitle>
                  <CardDescription>Manage and track all sales orders</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-[200px]"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value)}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="all" value="all">All Status</SelectItem>
                      <SelectItem key="completed" value="completed">Completed</SelectItem>
                      <SelectItem key="processing" value="processing">Processing</SelectItem>
                      <SelectItem key="shipped" value="shipped">Shipped</SelectItem>
                      <SelectItem key="confirmed" value="confirmed">Confirmed</SelectItem>
                      <SelectItem key="cancelled" value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="date" value="date">Date</SelectItem>
                      <SelectItem key="amount" value="amount">Amount</SelectItem>
                      <SelectItem key="customer" value="customer">Customer</SelectItem>
                      <SelectItem key="status" value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="default" onClick={() => setEditingOrder(null)} className="whitespace-nowrap">
                        Add Order
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingOrder ? 'Edit Order' : 'Create New Order'}</DialogTitle>
                        <DialogDescription>
                          {editingOrder ? 'Update the order details below.' : 'Fill in the details to create a new order.'}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="customer">Customer</Label>
                          <Input 
                            id="customer" 
                            name="customer" 
                            defaultValue={editingOrder?.customer || ''} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="customerEmail">Customer Email</Label>
                          <Input 
                            id="customerEmail" 
                            name="customerEmail" 
                            type="email" 
                            defaultValue={editingOrder?.customerEmail || ''} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount (₹)</Label>
                          <Input 
                            id="amount" 
                            name="amount" 
                            type="number" 
                            defaultValue={editingOrder?.amount || ''} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="items">Number of Items</Label>
                          <Input 
                            id="items" 
                            name="items" 
                            type="number" 
                            defaultValue={editingOrder?.items || ''} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select name="status" defaultValue={editingOrder?.status || 'confirmed'}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="priority">Priority</Label>
                          <Select name="priority" defaultValue={editingOrder?.priority || 'medium'}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="channel">Channel</Label>
                          <Select name="channel" defaultValue={editingOrder?.channel || 'online'}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select channel" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="online">Online Store</SelectItem>
                              <SelectItem value="retail">Retail Store</SelectItem>
                              <SelectItem value="wholesale">Wholesale</SelectItem>
                              <SelectItem value="b2b">B2B Sales</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="paymentStatus">Payment Status</Label>
                          <Select name="paymentStatus" defaultValue={editingOrder?.paymentStatus || 'pending'}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="partial">Partial</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="refunded">Refunded</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="salesRep">Sales Representative</Label>
                          <Input 
                            id="salesRep" 
                            name="salesRep" 
                            defaultValue={editingOrder?.salesRep || ''} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="region">Region</Label>
                          <Input 
                            id="region" 
                            name="region" 
                            defaultValue={editingOrder?.region || ''} 
                            required 
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="category">Category</Label>
                          <Input 
                            id="category" 
                            name="category" 
                            defaultValue={editingOrder?.category || ''} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="profit">Profit (₹)</Label>
                          <Input 
                            id="profit" 
                            name="profit" 
                            type="number" 
                            defaultValue={editingOrder?.profit || ''} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="discount">Discount (₹)</Label>
                          <Input 
                            id="discount" 
                            name="discount" 
                            type="number" 
                            defaultValue={editingOrder?.discount || ''} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tax">Tax (₹)</Label>
                          <Input 
                            id="tax" 
                            name="tax" 
                            type="number" 
                            defaultValue={editingOrder?.tax || ''} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="shippingCost">Shipping Cost (₹)</Label>
                          <Input 
                            id="shippingCost" 
                            name="shippingCost" 
                            type="number" 
                            defaultValue={editingOrder?.shippingCost || ''} 
                            required 
                          />
                        </div>
                        <DialogFooter className="md:col-span-2 mt-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsOrderDialogOpen(false)}
                            disabled={isSubmitting}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                              <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                {editingOrder ? 'Updating...' : 'Creating...'}
                              </div>
                            ) : (
                              editingOrder ? 'Update Order' : 'Create Order'
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading.orders ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : sortedOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <OrderIcon size={32} className="text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
                  <p className="text-sm text-gray-500">
                    {searchTerm || selectedStatus !== 'all' 
                      ? 'Try adjusting your search or filter criteria.' 
                      : 'Get started by creating your first order.'}
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order Details</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Amount & Items</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Sales Rep</TableHead>
                          <TableHead>Profit</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedOrders.map((order) => (
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
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleViewOrderDetails(order)}
                                >
                                  View
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleEditOrder(order)}>Edit</Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'team':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Sales Team Performance</CardTitle>
                  <CardDescription>Track your sales team performance and targets</CardDescription>
                </div>
                <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="default" onClick={() => setEditingMember(null)}>
                      Add Team Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingMember ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
                      <DialogDescription>
                        {editingMember ? 'Update the team member details below.' : 'Fill in the details to add a new team member.'}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitTeamMember} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          defaultValue={editingMember?.name || ''} 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          defaultValue={editingMember?.email || ''} 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="region">Region</Label>
                        <Input 
                          id="region" 
                          name="region" 
                          defaultValue={editingMember?.region || ''} 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="target">Target (₹)</Label>
                        <Input 
                          id="target" 
                          name="target" 
                          type="number" 
                          defaultValue={editingMember?.target || ''} 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="achieved">Achieved (₹)</Label>
                        <Input 
                          id="achieved" 
                          name="achieved" 
                          type="number" 
                          defaultValue={editingMember?.achieved || ''} 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="orders">Orders</Label>
                        <Input 
                          id="orders" 
                          name="orders" 
                          type="number" 
                          defaultValue={editingMember?.orders || ''} 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="conversion">Conversion Rate (%)</Label>
                        <Input 
                          id="conversion" 
                          name="conversion" 
                          type="number" 
                          step="0.1" 
                          defaultValue={editingMember?.conversion || ''} 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rating">Rating</Label>
                        <Input 
                          id="rating" 
                          name="rating" 
                          type="number" 
                          step="0.1" 
                          min="0" 
                          max="5" 
                          defaultValue={editingMember?.rating || ''} 
                          required 
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue={editingMember?.status || 'active'}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <DialogFooter className="md:col-span-2 mt-4">
                        <Button type="button" variant="outline" onClick={() => setIsTeamDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingMember ? 'Update Member' : 'Add Member'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {loading.team ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : teamMembers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                      <CustomersIcon size={32} className="text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No team members found</h3>
                    <p className="text-sm text-gray-500">Get started by adding your first team member.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {teamMembers.map((rep) => (
                      <motion.div
                        key={rep.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="h-full">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
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
                              <div className="flex space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleEditTeamMember(rep)}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDeleteTeamMember(rep.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  Delete
                                </Button>
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
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue by Category Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Category</CardTitle>
                  <CardDescription>Distribution of revenue across product categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    {categoryData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent = 0 }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [`₹${value}`, 'Revenue']}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center">
                        <ChartIcon size={48} className="mb-4 text-blue-500" />
                        <p className="text-gray-700 font-medium">No category data available</p>
                        <p className="text-sm text-gray-500 mt-1">Add orders to see revenue distribution</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Sales Forecast Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales Forecast</CardTitle>
                  <CardDescription>AI-powered sales predictions for next period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Current', value: forecastData.currentRevenue },
                          { name: 'Projected', value: forecastData.projectedRevenue },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `₹${value/1000}k`} />
                        <Tooltip 
                          formatter={(value) => [`₹${value}`, 'Revenue']}
                        />
                        <Legend />
                        <Bar 
                          dataKey="value" 
                          name="Revenue" 
                          fill="#8884d8"
                        >
                          {[
                            { name: 'Current', value: forecastData.currentRevenue },
                            { name: 'Projected', value: forecastData.projectedRevenue },
                          ].map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={index === 0 ? '#0088FE' : '#00C49F'} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
                <CardDescription>Important metrics measuring sales performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{formatIndianCurrency(salesStats.avgOrderValue)}</div>
                    <div className="text-sm text-gray-600">Average Order Value</div>
                    <div className="text-xs text-green-600 mt-1">{salesStats.avgOrderValueChange} vs last period</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{salesStats.conversionRate}%</div>
                    <div className="text-sm text-gray-600">Conversion Rate</div>
                    <div className="text-xs text-green-600 mt-1">{salesStats.conversionRateChange} vs last period</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">18.2</div>
                    <div className="text-sm text-gray-600">Days Sales Cycle</div>
                    <div className="text-xs text-red-600 mt-1">+2.1 days vs last period</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">92%</div>
                    <div className="text-sm text-gray-600">Customer Satisfaction</div>
                    <div className="text-xs text-green-600 mt-1">+3% vs last period</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>This section is under development</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <SalesIcon size={32} className="text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Feature in Progress</h3>
                <p className="text-sm text-gray-500">This tab is currently being developed and will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <SalesIcon size={28} className="mr-3" />
            Sales Management
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-600">Comprehensive sales analytics and order management</p>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`}></div>
              <span className={`text-xs ${getConnectionStatusColor()}`}>
                {getConnectionStatusText()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline"
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 sm:flex-none"
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
          <Button 
            variant="default" 
            onClick={handleCreateOrderClick}
            className="flex-1 sm:flex-none"
          >
            Create Order
          </Button>
          <Button className="flex-1 sm:flex-none">
            Sales Forecast
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SALES_STATS.map((stat) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-50 rounded-lg mr-3">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
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
        <CardHeader className="border-b p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full overflow-x-auto flex justify-start">
              {TABS.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id} 
                  className="flex items-center space-x-2 whitespace-nowrap"
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used actions for sales management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {QUICK_ACTIONS.map((action) => (
                  <motion.button
                    key={action.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className={`p-2 rounded-lg mb-2 bg-${action.color}-50 group-hover:bg-${action.color}-100 transition-colors`}>
                      {action.icon}
                    </div>
                    <span className="text-xs text-gray-700 text-center">{action.name}</span>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <RecentActivities
            activities={activities}
            loading={loading.activities}
            onActivityClick={handleActivityClick}
            title="Recent Activities"
            description="Latest activities in the sales system"
            emptyStateTitle="No activities yet"
            emptyStateDescription="Activities will appear here as they occur"
            maxHeight="max-h-96"
            showPriority={true}
          />
        </div>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={isOrderDetailDialogOpen} onOpenChange={setIsOrderDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Order Details - {selectedOrder.id}</DialogTitle>
                <DialogDescription>
                  Complete information for this sales order
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Customer Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Customer:</span>
                        <span className="font-medium">{selectedOrder.customer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email:</span>
                        <span className="font-medium">{selectedOrder.customerEmail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Region:</span>
                        <span className="font-medium">{selectedOrder.region}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Order Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Order Date:</span>
                        <span className="font-medium">{selectedOrder.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Due Date:</span>
                        <span className="font-medium">{selectedOrder.dueDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Category:</span>
                        <span className="font-medium">{selectedOrder.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Items:</span>
                        <span className="font-medium">{selectedOrder.items}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Financial Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Amount:</span>
                        <span className="font-medium">{formatIndianCurrency(selectedOrder.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Profit:</span>
                        <span className="font-medium text-green-600">{formatIndianCurrency(selectedOrder.profit)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Discount:</span>
                        <span className="font-medium">{formatIndianCurrency(selectedOrder.discount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tax:</span>
                        <span className="font-medium">{formatIndianCurrency(selectedOrder.tax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Shipping Cost:</span>
                        <span className="font-medium">{formatIndianCurrency(selectedOrder.shippingCost)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Status & Priority</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Status:</span>
                        <Badge variant="outline" className={getStatusColor(selectedOrder.status)}>
                          {selectedOrder.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Payment Status:</span>
                        <Badge variant="outline" className={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                          {selectedOrder.paymentStatus}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Priority:</span>
                        <Badge variant="outline" className={getPriorityColor(selectedOrder.priority)}>
                          {selectedOrder.priority}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Channel:</span>
                        <span className="font-medium">{selectedOrder.channel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Sales Rep:</span>
                        <span className="font-medium">{selectedOrder.salesRep}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOrderDetailDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setIsOrderDetailDialogOpen(false);
                  handleEditOrder(selectedOrder);
                }}>
                  Edit Order
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sales;