// hooks/useSales.ts
import { useState, useEffect } from 'react';
import { 
  getOrders, 
  getSalesTeam, 
  getActivities, 
  addOrder, 
  updateOrder, 
  deleteOrder,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  addActivity
} from '@/lib/firebase/database/useSales';
import { SalesOrder, SalesTeamMember, Activity } from '@/types/Sales';

export const useSales = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isExporting, setIsExporting] = useState(false);
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [teamMembers, setTeamMembers] = useState<SalesTeamMember[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState({
    orders: true,
    team: true,
    activities: true
  });

  // Load orders
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(prev => ({ ...prev, orders: true }));
        const ordersData = await getOrders({
          status: selectedStatus === 'all' ? undefined : selectedStatus
        });
        setOrders(ordersData || []);
      } catch (error) {
        console.error('Error loading orders:', error);
        setOrders([]);
      } finally {
        setLoading(prev => ({ ...prev, orders: false }));
      }
    };

    loadOrders();
  }, [selectedStatus]);

  // Load team members
  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        setLoading(prev => ({ ...prev, team: true }));
        const teamData = await getSalesTeam();
        setTeamMembers(teamData || []);
      } catch (error) {
        console.error('Error loading team members:', error);
        setTeamMembers([]);
      } finally {
        setLoading(prev => ({ ...prev, team: false }));
      }
    };

    loadTeamMembers();
  }, []);

  // Load activities (realtime)
  useEffect(() => {
    try {
      const unsubscribe = getActivities((activitiesData) => {
        setActivities(activitiesData || []);
        setLoading(prev => ({ ...prev, activities: false }));
      });

      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    } catch (error) {
      console.error('Error setting up activities listener:', error);
      setActivities([]);
      setLoading(prev => ({ ...prev, activities: false }));
    }
  }, []);

  // Filter orders based on search term
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.salesRep.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Calculate sales stats based on orders data
  const calculateSalesStats = () => {
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
    
    const periodOrders = orders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate >= startDate && orderDate <= now;
    });
    
    const totalRevenue = periodOrders.reduce((sum, order) => sum + order.amount, 0);
    const totalOrders = periodOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Calculate conversion rate (this would normally come from leads data)
    // For demo purposes, we'll use a fixed value or calculate from some other metric
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
  };

  const salesStats = calculateSalesStats();

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
    }, 2000);
  };

  const handleAddOrder = async (orderData: Omit<SalesOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addOrder(orderData);
      // Refresh orders
      const updatedOrders = await getOrders({
        status: selectedStatus === 'all' ? undefined : selectedStatus
      });
      setOrders(updatedOrders || []);
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  };

  const handleUpdateOrder = async (id: string, updates: Partial<SalesOrder>) => {
    try {
      await updateOrder(id, updates);
      // Refresh orders
      const updatedOrders = await getOrders({
        status: selectedStatus === 'all' ? undefined : selectedStatus
      });
      setOrders(updatedOrders || []);
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      await deleteOrder(id);
      // Refresh orders
      const updatedOrders = await getOrders({
        status: selectedStatus === 'all' ? undefined : selectedStatus
      });
      setOrders(updatedOrders || []);
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  };

  const handleAddTeamMember = async (memberData: Omit<SalesTeamMember, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addTeamMember(memberData);
      // Refresh team members
      const updatedTeam = await getSalesTeam();
      setTeamMembers(updatedTeam || []);
    } catch (error) {
      console.error('Error adding team member:', error);
      throw error;
    }
  };

  const handleUpdateTeamMember = async (id: string, updates: Partial<SalesTeamMember>) => {
    try {
      await updateTeamMember(id, updates);
      // Refresh team members
      const updatedTeam = await getSalesTeam();
      setTeamMembers(updatedTeam || []);
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    try {
      await deleteTeamMember(id);
      // Refresh team members
      const updatedTeam = await getSalesTeam();
      setTeamMembers(updatedTeam || []);
    } catch (error) {
      console.error('Error deleting team member:', error);
      throw error;
    }
  };

  const handleAddActivity = async (activityData: Omit<Activity, 'id' | 'createdAt'>) => {
    try {
      await addActivity(activityData);
      // Activities will update automatically via realtime listener
    } catch (error) {
      console.error('Error adding activity:', error);
      throw error;
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
    loading,
    salesStats,
    handleExport,
    handleAddOrder,
    handleUpdateOrder,
    handleDeleteOrder,
    handleAddTeamMember,
    handleUpdateTeamMember,
    handleDeleteTeamMember,
    handleAddActivity
  };
};