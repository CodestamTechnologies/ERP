'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useWhatsApp } from '@/hooks/useWhatsApp';
import { 
  WHATSAPP_STATS, 
  WHATSAPP_CHANNELS, 
  WHATSAPP_MESSAGES, 
  WHATSAPP_TEAM, 
  RECENT_ACTIVITIES, 
  QUICK_ACTIONS
} from '@/lib/components-Data/whatsapp/constent';
import { 
  getStatusColor, 
  getTypeColor, 
  getPriorityColor, 
  getActivityPriorityColor, 
  getActivityBgColor, 
  getInitials,
  formatResponseTime
} from '@/lib/components-imp-utils/whatsapp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { 
  faEye,
  faPaperPlane,
  faReply,
  faUserPlus,
  faUsers,
  faComments,
  faChartLine,
  faClock,
  faEnvelope,
  faBullhorn,
  faPhone
} from '@fortawesome/free-solid-svg-icons';
import { ChartIcon, AIInsightsIcon } from '@/components/Icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ReactNode } from 'react';

// Define interfaces for type safety
interface TabItem {
  id: string;
  name: string;
  icon: ReactNode;
}

interface EnhancedStat {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  target: string;
  progress: number;
  icon: ReactNode;
}

interface EnhancedQuickAction {
  name: string;
  color: string;
  icon: ReactNode;
}

interface EnhancedRecentActivity {
  id: string;
  message: string;
  time: string;
  priority: string;
  icon: ReactNode;
}

export default function WhatsAppPage() {
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
  } = useWhatsApp();

  // Colorful Icon Components (matching Sales component style)
  const WhatsAppIcon = ({ size = 24 }: { size?: number }) => (
    <FontAwesomeIcon 
      icon={faWhatsapp} 
      style={{ 
        fontSize: `${size}px`,
        color: '#25D366',
        filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
      }}
    />
  );

  const EyeIcon = ({ size = 16 }: { size?: number }) => (
    <FontAwesomeIcon 
      icon={faEye} 
      style={{ 
        fontSize: `${size}px`,
        color: '#3B82F6',
        filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
      }}
    />
  );

  const MessagesIcon = ({ size = 16 }: { size?: number }) => (
    <FontAwesomeIcon 
      icon={faComments} 
      style={{ 
        fontSize: `${size}px`,
        color: '#10B981',
        filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
      }}
    />
  );

  const TeamIcon = ({ size = 16 }: { size?: number }) => (
    <FontAwesomeIcon 
      icon={faUsers} 
      style={{ 
        fontSize: `${size}px`,
        color: '#8B5CF6',
        filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
      }}
    />
  );

  const AnalyticsIcon = ({ size = 16 }: { size?: number }) => (
    <FontAwesomeIcon 
      icon={faChartLine} 
      style={{ 
        fontSize: `${size}px`,
        color: '#F59E0B',
        filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
      }}
    />
  );

  // Icon mapping function for stats
  const getStatsIcon = (iconType: string): ReactNode => {
    const iconMap: { [key: string]: ReactNode } = {
      eye: <FontAwesomeIcon icon={faEye} className="w-5 h-5" style={{ color: '#3B82F6' }} />,
      paperPlane: <FontAwesomeIcon icon={faPaperPlane} className="w-5 h-5" style={{ color: '#10B981' }} />,
      reply: <FontAwesomeIcon icon={faReply} className="w-5 h-5" style={{ color: '#8B5CF6' }} />,
      userPlus: <FontAwesomeIcon icon={faUserPlus} className="w-5 h-5" style={{ color: '#F59E0B' }} />
    };
    return iconMap[iconType] || <FontAwesomeIcon icon={faEye} className="w-5 h-5" style={{ color: '#3B82F6' }} />;
  };

  // Icon mapping function for quick actions
  const getQuickActionIcon = (iconType: string, color: string): ReactNode => {
    const iconMap: { [key: string]: IconDefinition } = {
      bullhorn: faBullhorn,
      envelope: faEnvelope,
      userPlus: faUserPlus,
      comments: faComments,
      chartLine: faChartLine,
      phone: faPhone
    };

    const icon = iconMap[iconType];
    if (!icon) {
      return <FontAwesomeIcon icon={faComments} className={`w-5 h-5 text-${color}-600`} />;
    }

    return <FontAwesomeIcon icon={icon} className={`w-5 h-5 text-${color}-600`} />;
  };

  // Icon mapping function for activities
  const getActivityIcon = (iconType: string): ReactNode => {
    const iconMap: { [key: string]: IconDefinition } = {
      comments: faComments,
      bullhorn: faBullhorn,
      userPlus: faUserPlus,
      clock: faClock
    };

    const icon = iconMap[iconType];
    if (!icon) {
      return <FontAwesomeIcon icon={faComments} className="w-4 h-4" />;
    }

    return <FontAwesomeIcon icon={icon} className="w-4 h-4" />;
  };

  // Enhanced stats with icons
  const enhancedStats = WHATSAPP_STATS.map(stat => ({
    ...stat,
    icon: getStatsIcon(stat.iconType)
  }));

  // Enhanced quick actions with icons
  const enhancedQuickActions = QUICK_ACTIONS.map(action => ({
    ...action,
    icon: getQuickActionIcon(action.iconType, action.color)
  }));

  // Enhanced recent activities with icons
  const enhancedRecentActivities = RECENT_ACTIVITIES.map(activity => ({
    ...activity,
    icon: getActivityIcon(activity.iconType)
  }));

  // Enhanced tabs with colorful icons (matching Sales component)
  const enhancedTabs = [
    { id: 'overview', name: 'Overview', icon: <EyeIcon size={16} /> },
    { id: 'messages', name: 'Messages', icon: <MessagesIcon size={16} /> },
    { id: 'team', name: 'Team', icon: <TeamIcon size={16} /> },
    { id: 'analytics', name: 'Analytics', icon: <AnalyticsIcon size={16} /> }
  ];

  const filteredMessages = WHATSAPP_MESSAGES.filter(message => {
    const matchesSearch = message.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || message.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* WhatsApp Channels */}
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Channels Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {WHATSAPP_CHANNELS.map((channel) => (
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
                              <span className="text-gray-500">Messages:</span>
                              <span className="font-medium">{channel.messages.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Responses:</span>
                              <span className="font-medium">{channel.responses.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Avg Response:</span>
                              <span className="font-medium">{channel.avgResponseTime}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Satisfaction:</span>
                              <span className="font-medium">{channel.satisfaction}%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp Chart */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Message Trend</CardTitle>
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
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
                  <div className="text-center">
                    <ChartIcon size={48} className="mx-auto mb-4 text-green-500" />
                    <p className="text-gray-700 font-medium">Interactive WhatsApp Analytics</p>
                    <p className="text-sm text-gray-500 mt-1">Message trends over {selectedPeriod}</p>
                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">8,934</div>
                        <div className="text-xs text-gray-500">Total Messages</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">87.5%</div>
                        <div className="text-xs text-gray-500">Response Rate</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">2.3 min</div>
                        <div className="text-xs text-gray-500">Avg Response</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'messages':
        return (
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <CardTitle>WhatsApp Messages</CardTitle>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search messages..."
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
                      <SelectItem value="unread">Unread</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="replied">Replied</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="contact">Contact</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
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
                      <TableHead>Message Details</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Message & Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Agent</TableHead>
                      <TableHead>Response Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMessages.map((message) => (
                      <TableRow key={message.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="font-medium">{message.id}</div>
                            <div className="text-sm text-gray-500">{message.date}</div>
                            <div className="text-xs text-gray-400">{message.time}</div>
                            <Badge variant="outline" className={getPriorityColor(message.priority)}>
                              {message.priority} priority
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{message.contact}</div>
                            <div className="text-sm text-gray-500">{message.contactEmail}</div>
                            <div className="text-xs text-gray-400">{message.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm text-gray-900 max-w-xs truncate">{message.message}</div>
                            <div className="text-sm text-gray-500">{message.category}</div>
                            <div className="text-xs text-gray-400">
                              <Badge variant="outline" className={getTypeColor(message.type)}>
                                {message.type}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="outline" className={getStatusColor(message.status)}>
                              {message.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">{message.agent}</div>
                          <div className="text-sm text-gray-500">{message.category}</div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-green-600">{formatResponseTime(message.responseTime)}</div>
                            {message.responseTime && (
                              <div className="text-xs text-gray-500">
                                Responded
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">Reply</Button>
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Forward</Button>
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
                <CardTitle>WhatsApp Team Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {WHATSAPP_TEAM.map((rep) => (
                    <motion.div
                      key={rep.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center mb-4">
                            <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                              <span className="text-white text-sm font-medium">
                                {getInitials(rep.name)}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium">{rep.name}</h4>
                              <p className="text-sm text-gray-500">{rep.role}</p>
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
                                <span>{rep.achieved.toLocaleString()}</span>
                                <span>{rep.target.toLocaleString()}</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Avg Response:</span>
                                <div className="font-medium">{rep.avgResponseTime}</div>
                              </div>
                              <div>
                                <span className="text-gray-500">Satisfaction:</span>
                                <div className="font-medium">{rep.satisfaction}%</div>
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
                  <CardTitle>Messages by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
                    <div className="text-center">
                      <ChartIcon size={48} className="mx-auto mb-4 text-green-500" />
                      <p className="text-gray-700 font-medium">Pie Chart - Message Distribution</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Time Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                    <div className="text-center">
                      <AIInsightsIcon size={48} className="mx-auto mb-4 text-blue-500" />
                      <p className="text-gray-700 font-medium">AI-Powered Response Prediction</p>
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
                    <div className="text-3xl font-bold text-green-600">2.3 min</div>
                    <div className="text-sm text-gray-500">Average Response Time</div>
                    <div className="text-xs text-green-600 mt-1">-15.3% vs last month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">87.5%</div>
                    <div className="text-sm text-gray-500">Response Rate</div>
                    <div className="text-xs text-green-600 mt-1">+2.1% vs last month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">94%</div>
                    <div className="text-sm text-gray-500">Customer Satisfaction</div>
                    <div className="text-xs text-green-600 mt-1">+3.2% vs last month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">156</div>
                    <div className="text-sm text-gray-500">Active Conversations</div>
                    <div className="text-xs text-green-600 mt-1">+8.7% vs last month</div>
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
            <WhatsAppIcon size={28} />
            <span className="ml-3">WhatsApp Business</span>
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive WhatsApp analytics and message management</p>
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
            Send Broadcast
          </Button>
          <Button>
            New Campaign
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {enhancedStats.map((stat) => (
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
                    <div className="p-2 bg-green-50 rounded-lg mr-3">
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
              {enhancedTabs.map((tab) => (
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
                {enhancedQuickActions.map((action) => (
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
                {enhancedRecentActivities.map((activity) => (
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
}