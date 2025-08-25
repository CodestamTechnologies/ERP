// lib/firebase/database/useSalesRealtime.ts
import {
  ref,
  push,
  set,
  update,
  remove,
  onValue,
  off,
  query,
  orderByChild,
  equalTo,
  limitToLast,
  serverTimestamp,
  get
} from 'firebase/database';
import { realtimeDb } from '../firebase-main';
import { SalesOrder, SalesTeamMember, Activity } from '@/types/Sales';

// Realtime Database paths
const ORDERS_PATH = 'sales/orders';
const TEAM_PATH = 'sales/team';
const ACTIVITIES_PATH = 'sales/activities';

// Utility function for currency formatting
export const formatIndianCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Orders Operations (Realtime Database)
export const getOrdersRealtime = (callback: (orders: SalesOrder[]) => void, filters?: {
  status?: string;
  startDate?: Date;
  endDate?: Date;
}) => {
  try {
    let ordersRef = ref(realtimeDb, ORDERS_PATH);
    
    // If filtering by status, use query
    if (filters?.status && filters.status !== 'all') {
      ordersRef = query(ref(realtimeDb, ORDERS_PATH), orderByChild('status'), equalTo(filters.status));
    } else {
      ordersRef = query(ref(realtimeDb, ORDERS_PATH), orderByChild('date'));
    }
    
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const ordersData: SalesOrder[] = [];
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        Object.keys(data).forEach((key) => {
          const order = {
            id: key,
            ...data[key]
          } as SalesOrder;
          
          // Apply date filters if provided
          if (filters?.startDate && filters?.endDate) {
            const orderDate = new Date(order.date);
            if (orderDate >= filters.startDate && orderDate <= filters.endDate) {
              ordersData.push(order);
            }
          } else {
            ordersData.push(order);
          }
        });
      }
      
      // Sort by date descending
      ordersData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      callback(ordersData);
    }, (error) => {
      console.error('Error fetching orders:', error);
      callback([]);
    });
    
    return () => off(ordersRef, 'value', unsubscribe);
  } catch (error) {
    console.error('Error setting up orders listener:', error);
    callback([]);
    return () => {};
  }
};

export const addOrderRealtime = async (order: Omit<SalesOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const ordersRef = ref(realtimeDb, ORDERS_PATH);
    const newOrderRef = push(ordersRef);
    const orderId = newOrderRef.key;
    
    if (!orderId) {
      throw new Error('Failed to generate order ID');
    }
    
    const orderData = {
      ...order,
      id: orderId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await set(newOrderRef, orderData);
    
    // Add activity for new order
    try {
      await addActivityRealtime({
        type: 'order-placed',
        message: `New order placed by ${order.customer} (${formatIndianCurrency(order.amount)})`,
        time: 'Just now',
        icon: '📦',
        priority: order.priority === 'high' ? 'high' : 'medium'
      });
    } catch (activityError) {
      console.error('Error adding activity for new order:', activityError);
      // Don't throw - order was created successfully
    }
    
    return orderId;
  } catch (error) {
    console.error('Error adding order:', error);
    throw error;
  }
};

export const updateOrderRealtime = async (id: string, updates: Partial<SalesOrder>) => {
  try {
    const orderRef = ref(realtimeDb, `${ORDERS_PATH}/${id}`);
    
    // First get the current order data to compare changes
    let currentOrder: SalesOrder | null = null;
    try {
      const snapshot = await get(orderRef);
      if (snapshot.exists()) {
        currentOrder = snapshot.val() as SalesOrder;
      }
    } catch (error) {
      console.error('Error fetching current order for comparison:', error);
    }
    
    // Update the order
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    
    await update(orderRef, updateData);
    
    // Generate activity message based on what changed
    if (currentOrder) {
      let activityMessage = '';
      let activityType = 'order-updated';
      let priority: 'low' | 'medium' | 'high' = 'medium';
      
      if (updates.status && updates.status !== currentOrder.status) {
        activityMessage = `Order status changed from ${currentOrder.status} to ${updates.status} for order ${id}`;
        if (updates.status === 'completed') {
          activityType = 'order-completed';
          priority = 'high';
        } else if (updates.status === 'cancelled') {
          activityType = 'order-cancelled';
          priority = 'high';
        }
      } else if (updates.priority && updates.priority !== currentOrder.priority) {
        activityMessage = `Order priority changed from ${currentOrder.priority} to ${updates.priority} for order ${id}`;
        priority = updates.priority as 'low' | 'medium' | 'high';
      } else if (updates.amount && updates.amount !== currentOrder.amount) {
        activityMessage = `Order amount updated from ${formatIndianCurrency(currentOrder.amount)} to ${formatIndianCurrency(updates.amount)} for order ${id}`;
      } else if (updates.paymentStatus && updates.paymentStatus !== currentOrder.paymentStatus) {
        activityMessage = `Payment status changed from ${currentOrder.paymentStatus} to ${updates.paymentStatus} for order ${id}`;
        if (updates.paymentStatus === 'paid') {
          activityType = 'payment-received';
          priority = 'high';
        }
      } else {
        activityMessage = `Order ${id} was updated`;
      }
      
      // Add activity for order update
      try {
        await addActivityRealtime({
          type: activityType,
          message: activityMessage,
          time: 'Just now',
          icon: '✏️',
          priority: priority
        });
      } catch (activityError) {
        console.error('Error adding activity for order update:', activityError);
        // Don't throw - order was updated successfully
      }
    }
    
    return;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

export const deleteOrderRealtime = async (id: string) => {
  try {
    const orderRef = ref(realtimeDb, `${ORDERS_PATH}/${id}`);
    await remove(orderRef);
    
    // Add activity for order deletion
    try {
      await addActivityRealtime({
        type: 'order-deleted',
        message: `Order ${id} was deleted`,
        time: 'Just now',
        icon: '🗑️',
        priority: 'medium'
      });
    } catch (activityError) {
      console.error('Error adding activity for order deletion:', activityError);
      // Don't throw - order was deleted successfully
    }
    
    return;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

// Sales Team Operations (Realtime Database)
export const getSalesTeamRealtime = (callback: (team: SalesTeamMember[]) => void) => {
  try {
    const teamRef = query(ref(realtimeDb, TEAM_PATH), orderByChild('name'));
    
    const unsubscribe = onValue(teamRef, (snapshot) => {
      const teamData: SalesTeamMember[] = [];
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        Object.keys(data).forEach((key) => {
          teamData.push({
            id: key,
            ...data[key]
          } as SalesTeamMember);
        });
      }
      
      callback(teamData);
    }, (error) => {
      console.error('Error fetching sales team:', error);
      callback([]);
    });
    
    return () => off(teamRef, 'value', unsubscribe);
  } catch (error) {
    console.error('Error setting up team listener:', error);
    callback([]);
    return () => {};
  }
};

export const addTeamMemberRealtime = async (member: Omit<SalesTeamMember, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const teamRef = ref(realtimeDb, TEAM_PATH);
    const newMemberRef = push(teamRef);
    const memberId = newMemberRef.key;
    
    if (!memberId) {
      throw new Error('Failed to generate member ID');
    }
    
    const memberData = {
      ...member,
      id: memberId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await set(newMemberRef, memberData);
    
    // Add activity for new team member
    try {
      await addActivityRealtime({
        type: 'team-member-added',
        message: `New team member ${member.name} added to ${member.region} region`,
        time: 'Just now',
        icon: '👤',
        priority: 'medium'
      });
    } catch (activityError) {
      console.error('Error adding activity for new team member:', activityError);
    }
    
    return memberId;
  } catch (error) {
    console.error('Error adding team member:', error);
    throw error;
  }
};

export const updateTeamMemberRealtime = async (id: string, updates: Partial<SalesTeamMember>) => {
  try {
    const memberRef = ref(realtimeDb, `${TEAM_PATH}/${id}`);
    
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    
    await update(memberRef, updateData);
    
    return;
  } catch (error) {
    console.error('Error updating team member:', error);
    throw error;
  }
};

export const deleteTeamMemberRealtime = async (id: string) => {
  try {
    const memberRef = ref(realtimeDb, `${TEAM_PATH}/${id}`);
    await remove(memberRef);
    
    return;
  } catch (error) {
    console.error('Error deleting team member:', error);
    throw error;
  }
};

// Activities Operations (Realtime Database)
export const getActivitiesRealtime = (callback: (activities: Activity[]) => void) => {
  try {
    const activitiesRef = query(
      ref(realtimeDb, ACTIVITIES_PATH),
      orderByChild('timestamp'),
      limitToLast(20)
    );
    
    const unsubscribe = onValue(activitiesRef, (snapshot) => {
      const activitiesData: Activity[] = [];
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        Object.keys(data).forEach((key) => {
          activitiesData.push({
            id: key,
            ...data[key]
          } as Activity);
        });
      }
      
      // Sort by timestamp descending (most recent first)
      activitiesData.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      
      callback(activitiesData);
    }, (error) => {
      console.error('Error fetching activities:', error);
      callback([]);
    });
    
    return () => off(activitiesRef, 'value', unsubscribe);
  } catch (error) {
    console.error('Error setting up activities listener:', error);
    callback([]);
    return () => {};
  }
};

export const addActivityRealtime = async (activity: Omit<Activity, 'id' | 'createdAt' | 'timestamp'>) => {
  try {
    const activitiesRef = ref(realtimeDb, ACTIVITIES_PATH);
    const newActivityRef = push(activitiesRef);
    const activityId = newActivityRef.key;
    
    if (!activityId) {
      throw new Error('Failed to generate activity ID');
    }
    
    const activityData = {
      ...activity,
      id: activityId,
      createdAt: serverTimestamp(),
      timestamp: Date.now()
    };
    
    await set(newActivityRef, activityData);
    
    return activityId;
  } catch (error) {
    console.error('Error adding activity:', error);
    throw error;
  }
};

export const updateActivityRealtime = async (id: string, updates: Partial<Activity>) => {
  try {
    const activityRef = ref(realtimeDb, `${ACTIVITIES_PATH}/${id}`);
    
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    
    await update(activityRef, updateData);
    
    return;
  } catch (error) {
    console.error('Error updating activity:', error);
    throw error;
  }
};

export const deleteActivityRealtime = async (id: string) => {
  try {
    const activityRef = ref(realtimeDb, `${ACTIVITIES_PATH}/${id}`);
    await remove(activityRef);
    
    return;
  } catch (error) {
    console.error('Error deleting activity:', error);
    throw error;
  }
};

// Batch operations for better performance
export const batchUpdateOrdersRealtime = async (updates: { [orderId: string]: Partial<SalesOrder> }) => {
  try {
    const updatePromises = Object.entries(updates).map(([orderId, updateData]) => 
      updateOrderRealtime(orderId, updateData)
    );
    
    await Promise.all(updatePromises);
    
    return;
  } catch (error) {
    console.error('Error batch updating orders:', error);
    throw error;
  }
};

// Analytics helpers for realtime data
export const getOrdersAnalyticsRealtime = (callback: (analytics: any) => void) => {
  try {
    const ordersRef = ref(realtimeDb, ORDERS_PATH);
    
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const orders = Object.values(data) as SalesOrder[];
        
        // Calculate analytics
        const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
        const totalOrders = orders.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        
        // Status distribution
        const statusCounts = orders.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        // Channel distribution
        const channelRevenue = orders.reduce((acc, order) => {
          acc[order.channel] = (acc[order.channel] || 0) + order.amount;
          return acc;
        }, {} as Record<string, number>);
        
        const analytics = {
          totalRevenue,
          totalOrders,
          avgOrderValue,
          statusCounts,
          channelRevenue,
          lastUpdated: Date.now()
        };
        
        callback(analytics);
      } else {
        callback({
          totalRevenue: 0,
          totalOrders: 0,
          avgOrderValue: 0,
          statusCounts: {},
          channelRevenue: {},
          lastUpdated: Date.now()
        });
      }
    }, (error) => {
      console.error('Error fetching orders analytics:', error);
      callback({
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        statusCounts: {},
        channelRevenue: {},
        lastUpdated: Date.now()
      });
    });
    
    return () => off(ordersRef, 'value', unsubscribe);
  } catch (error) {
    console.error('Error setting up analytics listener:', error);
    callback({
      totalRevenue: 0,
      totalOrders: 0,
      avgOrderValue: 0,
      statusCounts: {},
      channelRevenue: {},
      lastUpdated: Date.now()
    });
    return () => {};
  }
};