// hooks/useSalesRealtime.ts
import { useState, useEffect, useCallback } from 'react';
import { 
  getOrdersRealtime, 
  getSalesTeamRealtime, 
  getActivitiesRealtime,
  getOrdersAnalyticsRealtime,
  addOrderRealtime, 
  updateOrderRealtime, 
  deleteOrderRealtime,
  addTeamMemberRealtime,
  updateTeamMemberRealtime,
  deleteTeamMemberRealtime,
  addActivityRealtime,
  formatIndianCurrency
} from '@/lib/firebase/database/useSalesRealtime';
import { SalesOrder, SalesTeamMember, Activity } from '@/types/Sales';

export const useSalesRealtime = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isExporting, setIsExporting] = useState(false);
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [teamMembers, setTeamMembers] = useState<SalesTeamMember[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [analytics, setAnalytics] = useState<{
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    statusCounts: Record<string, number>;
    channelRevenue: Record<string, number>;
    lastUpdated: number;
  }>({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    statusCounts: {},
    channelRevenue: {},
    lastUpdated: Date.now()
  });
  const [loading, setLoading] = useState({
    orders: true,
    team: true,
    activities: true,
    analytics: true
  });
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');

  // Calculate date range based on selected period
  const getDateRange = useCallback(() => {
    const now = new Date();
    let startDate: Date;
    
    switch (selectedPeriod) {
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '90days':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      case '30days':
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }
    
    return { startDate, endDate: now };
  }, [selectedPeriod]);

  // Load orders with realtime updates
  useEffect(() => {
    setLoading(prev => ({ ...prev, orders: true }));
    setConnectionStatus('connecting');
    
    const { startDate, endDate } = getDateRange();
    
    const unsubscribe = getOrdersRealtime((ordersData) => {
      setOrders(ordersData || []);
      setLoading(prev => ({ ...prev, orders: false }));
      setConnectionStatus('connected');
    }, {
      status: selectedStatus === 'all' ? undefined : selectedStatus,
      startDate,
      endDate
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [selectedStatus, getDateRange]);

  // Load team members with realtime updates
  useEffect(() => {
    setLoading(prev => ({ ...prev, team: true }));
    
    const unsubscribe = getSalesTeamRealtime((teamData) => {
      setTeamMembers(teamData || []);
      setLoading(prev => ({ ...prev, team: false }));
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Load activities with realtime updates
  useEffect(() => {
    setLoading(prev => ({ ...prev, activities: true }));
    
    const unsubscribe = getActivitiesRealtime((activitiesData) => {
      setActivities(activitiesData || []);
      setLoading(prev => ({ ...prev, activities: false }));
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Load analytics with realtime updates
  useEffect(() => {
    setLoading(prev => ({ ...prev, analytics: true }));
    
    const unsubscribe = getOrdersAnalyticsRealtime((analyticsData) => {
      setAnalytics(analyticsData);
      setLoading(prev => ({ ...prev, analytics: false }));
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Filter orders based on search term
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.salesRep.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Calculate sales stats based on filtered period data
  const calculateSalesStats = useCallback(() => {
    const { startDate, endDate } = getDateRange();
    
    const periodOrders = orders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate >= startDate && orderDate <= endDate;
    });
    
    const totalRevenue = periodOrders.reduce((sum, order) => sum + order.amount, 0);
    const totalOrders = periodOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Calculate conversion rate (this would normally come from leads data)
    const conversionRate = 3.8;
    
    // Calculate changes (this would normally compare with previous period)
    const revenueChange = '+12.5%';
    const ordersChange = '+8.2%';
    const avgOrderValueChange = '+15.3%';
    const conversionRateChange = '+0.5%';
    
    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      conversionRate,
      revenueChange,
      ordersChange,
      avgOrderValueChange,
      conversionRateChange
    };
  }, [orders, getDateRange]);

  const salesStats = calculateSalesStats();

  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      // Create CSV content
      const csvContent = [
        ['Order ID', 'Customer', 'Amount', 'Status', 'Date', 'Sales Rep'].join(','),
        ...filteredOrders.map(order => [
          order.id,
          order.customer,
          order.amount,
          order.status,
          order.date,
          order.salesRep
        ].join(','))
      ].join('\n');
      
      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      setIsExporting(false);
    }, 2000);
  };

  const handleAddOrder = async (orderData: Omit<SalesOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addOrderRealtime(orderData);
      // Orders will update automatically via realtime listener
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  };

  const handleUpdateOrder = async (id: string, updates: Partial<SalesOrder>) => {
    try {
      await updateOrderRealtime(id, updates);
      // Orders will update automatically via realtime listener
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      await deleteOrderRealtime(id);
      // Orders will update automatically via realtime listener
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  };

  const handleAddTeamMember = async (memberData: Omit<SalesTeamMember, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addTeamMemberRealtime(memberData);
      // Team members will update automatically via realtime listener
    } catch (error) {
      console.error('Error adding team member:', error);
      throw error;
    }
  };

  const handleUpdateTeamMember = async (id: string, updates: Partial<SalesTeamMember>) => {
    try {
      await updateTeamMemberRealtime(id, updates);
      // Team members will update automatically via realtime listener
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    try {
      await deleteTeamMemberRealtime(id);
      // Team members will update automatically via realtime listener
    } catch (error) {
      console.error('Error deleting team member:', error);
      throw error;
    }
  };

  const handleAddActivity = async (activityData: Omit<Activity, 'id' | 'createdAt' | 'timestamp'>) => {
    try {
      await addActivityRealtime(activityData);
      // Activities will update automatically via realtime listener
    } catch (error) {
      console.error('Error adding activity:', error);
      throw error;
    }
  };

  // Utility function to get real-time connection status
  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-500';
      case 'disconnected':
        return 'text-red-500';
      case 'connecting':
      default:
        return 'text-yellow-500';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'disconnected':
        return 'Disconnected';
      case 'connecting':
      default:
        return 'Connecting...';
    }
  };

  return {
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
    orders: filteredOrders,
    teamMembers,
    activities,
    analytics,
    loading,
    salesStats,
    connectionStatus,
    getConnectionStatusColor,
    getConnectionStatusText,
    handleExport,
    handleAddOrder,
    handleUpdateOrder,
    handleDeleteOrder,
    handleAddTeamMember,
    handleUpdateTeamMember,
    handleDeleteTeamMember,
    handleAddActivity,
    formatIndianCurrency
  };
};