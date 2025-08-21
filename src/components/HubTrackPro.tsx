'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ChartIcon, 
  AIInsightsIcon, 
  DashboardIcon, 
  InventoryIcon, 
  OrderIcon, 
  UserIcon,
  SettingsIcon,
  ReportsIcon,
  NotificationIcon
} from './Icons';

const HubTrackPro = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isExporting, setIsExporting] = useState(false);

  // Mock data for Hub Track Pro
  const performanceStats = [
    {
      name: 'Total Hubs',
      value: '24',
      change: '+3 this month',
      changeType: 'positive',
      target: '30',
      progress: 80,
      icon: <DashboardIcon size={20} className="text-blue-600" />
    },
    {
      name: 'Active Shipments',
      value: '1,847',
      change: '+12.5%',
      changeType: 'positive',
      target: '2000',
      progress: 92.35,
      icon: <OrderIcon size={20} className="text-green-600" />
    },
    {
      name: 'On-Time Delivery',
      value: '94.2%',
      change: '+2.1%',
      changeType: 'positive',
      target: '95%',
      progress: 94.2,
      icon: <ChartIcon size={20} className="text-purple-600" />
    },
    {
      name: 'Hub Efficiency',
      value: '87.8%',
      change: '-1.2%',
      changeType: 'negative',
      target: '90%',
      progress: 87.8,
      icon: <AIInsightsIcon size={20} className="text-orange-600" />
    }
  ];

  const hubLocations = [
    {
      id: 'HUB-001',
      name: 'Mumbai Central Hub',
      location: 'Mumbai, Maharashtra',
      status: 'active',
      capacity: 85,
      shipments: 342,
      efficiency: 92.5,
      manager: 'Rajesh Kumar',
      lastUpdate: '2 mins ago'
    },
    {
      id: 'HUB-002',
      name: 'Delhi North Hub',
      location: 'New Delhi, Delhi',
      status: 'active',
      capacity: 78,
      shipments: 298,
      efficiency: 89.2,
      manager: 'Priya Sharma',
      lastUpdate: '5 mins ago'
    },
    {
      id: 'HUB-003',
      name: 'Bangalore Tech Hub',
      location: 'Bangalore, Karnataka',
      status: 'maintenance',
      capacity: 45,
      shipments: 156,
      efficiency: 76.8,
      manager: 'Arjun Reddy',
      lastUpdate: '1 hour ago'
    },
    {
      id: 'HUB-004',
      name: 'Chennai Express Hub',
      location: 'Chennai, Tamil Nadu',
      status: 'active',
      capacity: 92,
      shipments: 387,
      efficiency: 94.1,
      manager: 'Lakshmi Iyer',
      lastUpdate: '3 mins ago'
    },
    {
      id: 'HUB-005',
      name: 'Kolkata East Hub',
      location: 'Kolkata, West Bengal',
      status: 'active',
      capacity: 67,
      shipments: 234,
      efficiency: 88.7,
      manager: 'Amit Ghosh',
      lastUpdate: '8 mins ago'
    }
  ];

  const recentShipments = [
    {
      id: 'SHP-2024-001',
      origin: 'Mumbai Central Hub',
      destination: 'Pune Distribution Center',
      status: 'in-transit',
      priority: 'high',
      estimatedDelivery: '2024-01-15 14:30',
      trackingCode: 'HTP001234567',
      items: 45,
      weight: '2.3 tons'
    },
    {
      id: 'SHP-2024-002',
      origin: 'Delhi North Hub',
      destination: 'Gurgaon Warehouse',
      status: 'delivered',
      priority: 'medium',
      estimatedDelivery: '2024-01-14 16:45',
      trackingCode: 'HTP001234568',
      items: 28,
      weight: '1.8 tons'
    },
    {
      id: 'SHP-2024-003',
      origin: 'Bangalore Tech Hub',
      destination: 'Hyderabad Center',
      status: 'delayed',
      priority: 'high',
      estimatedDelivery: '2024-01-15 10:15',
      trackingCode: 'HTP001234569',
      items: 67,
      weight: '3.1 tons'
    }
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <DashboardIcon size={16} /> },
    { id: 'hubs', name: 'Hub Management', icon: <InventoryIcon size={16} /> },
    { id: 'shipments', name: 'Shipments', icon: <OrderIcon size={16} /> },
    { id: 'analytics', name: 'Analytics', icon: <ChartIcon size={16} /> },
    { id: 'settings', name: 'Settings', icon: <SettingsIcon size={16} /> }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'delayed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExporting(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Hub Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Hub Performance Overview</CardTitle>
                <CardDescription>Real-time performance metrics across all hub locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {hubLocations.slice(0, 4).map((hub) => (
                    <motion.div
                      key={hub.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900 text-sm">{hub.name}</h4>
                            <Badge variant="outline" className={getStatusColor(hub.status)}>
                              {hub.status}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Capacity:</span>
                              <span className="font-medium">{hub.capacity}%</span>
                            </div>
                            <Progress value={hub.capacity} className="w-full" />
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Shipments:</span>
                              <span className="font-medium">{hub.shipments}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Efficiency:</span>
                              <span className="font-medium">{hub.efficiency}%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Chart */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Hub Performance Trends</CardTitle>
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
                    <p className="text-gray-700 font-medium">Hub Performance Analytics</p>
                    <p className="text-sm text-gray-500 mt-1">Efficiency trends over {selectedPeriod}</p>
                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">89.2%</div>
                        <div className="text-xs text-gray-500">Avg Efficiency</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">94.2%</div>
                        <div className="text-xs text-gray-500">On-Time Rate</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">1,847</div>
                        <div className="text-xs text-gray-500">Active Shipments</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'hubs':
        return (
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <CardTitle>Hub Management</CardTitle>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search hubs..."
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
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
                      <TableHead>Hub Details</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Capacity & Status</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Manager</TableHead>
                      <TableHead>Last Update</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hubLocations.map((hub) => (
                      <TableRow key={hub.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="font-medium">{hub.id}</div>
                            <div className="text-sm text-gray-900">{hub.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">{hub.location}</div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className={getStatusColor(hub.status)}>
                                {hub.status}
                              </Badge>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Capacity: {hub.capacity}%</div>
                              <Progress value={hub.capacity} className="w-full mt-1" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm font-medium">Efficiency: {hub.efficiency}%</div>
                            <div className="text-sm text-gray-500">Shipments: {hub.shipments}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">{hub.manager}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-500">{hub.lastUpdate}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Edit</Button>
                            <Button variant="ghost" size="sm">Monitor</Button>
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

      case 'shipments':
        return (
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <CardTitle>Active Shipments</CardTitle>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search shipments..."
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
                      <SelectItem value="in-transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="delayed">Delayed</SelectItem>
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
                      <TableHead>Shipment Details</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Status & Priority</TableHead>
                      <TableHead>Delivery Info</TableHead>
                      <TableHead>Cargo Details</TableHead>
                      <TableHead>Tracking</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentShipments.map((shipment) => (
                      <TableRow key={shipment.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="font-medium">{shipment.id}</div>
                            <div className="text-sm text-gray-500">{shipment.trackingCode}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm font-medium">From: {shipment.origin}</div>
                            <div className="text-sm text-gray-500">To: {shipment.destination}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="outline" className={getStatusColor(shipment.status)}>
                              {shipment.status}
                            </Badge>
                            <div>
                              <Badge variant="outline" className={getPriorityColor(shipment.priority)}>
                                {shipment.priority} priority
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">ETA: {shipment.estimatedDelivery}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm">Items: {shipment.items}</div>
                            <div className="text-sm text-gray-500">Weight: {shipment.weight}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-mono text-blue-600">{shipment.trackingCode}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">Track</Button>
                            <Button variant="ghost" size="sm">Update</Button>
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

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hub Efficiency Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                    <div className="text-center">
                      <ChartIcon size={48} className="mx-auto mb-4 text-blue-500" />
                      <p className="text-gray-700 font-medium">Efficiency Analytics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Delivery Performance Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
                    <div className="text-center">
                      <AIInsightsIcon size={48} className="mx-auto mb-4 text-green-500" />
                      <p className="text-gray-700 font-medium">AI-Powered Predictions</p>
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
                    <div className="text-3xl font-bold text-blue-600">2.4 hrs</div>
                    <div className="text-sm text-gray-500">Average Processing Time</div>
                    <div className="text-xs text-green-600 mt-1">-15 mins vs last month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">98.7%</div>
                    <div className="text-sm text-gray-500">Package Accuracy</div>
                    <div className="text-xs text-green-600 mt-1">+0.3% vs last month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">₹2,847</div>
                    <div className="text-sm text-gray-500">Cost per Shipment</div>
                    <div className="text-xs text-red-600 mt-1">+₹47 vs last month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">4.8/5</div>
                    <div className="text-sm text-gray-500">Customer Satisfaction</div>
                    <div className="text-xs text-green-600 mt-1">+0.2 vs last month</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hub Track Pro Settings</CardTitle>
                <CardDescription>Configure your hub tracking and management preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Notification Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Hub capacity alerts</span>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Delivery delay notifications</span>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Performance threshold alerts</span>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Integration Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">API Configuration</span>
                        <Button variant="outline" size="sm">Manage</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Third-party logistics</span>
                        <Button variant="outline" size="sm">Connect</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Tracking systems</span>
                        <Button variant="outline" size="sm">Setup</Button>
                      </div>
                    </div>
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
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-sm font-bold">H</span>
            </div>
            Hub Track Pro
          </h1>
          <p className="text-gray-600 mt-1">Advanced hub management and shipment tracking system</p>
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
            Add Hub
          </Button>
          <Button>
            Track Shipment
          </Button>
        </div>
      </div>

      {/* Overall Performance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceStats.map((stat) => (
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
              {tabs.map((tab) => (
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
    </div>
  );
};

export default HubTrackPro;