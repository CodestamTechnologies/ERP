// lib/firebase/database/useSalesFirestore.ts
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  QueryConstraint
} from 'firebase/firestore';
import { firestore } from '../firebase-main';
import { SalesOrder, SalesTeamMember } from '@/types/Sales';
import { addActivityRealtime } from './useSalesRealtime';

// Firestore Collections
const ORDERS_COLLECTION = 'salesOrders';
const TEAM_COLLECTION = 'salesTeam';

// Utility function for currency formatting
export const formatIndianCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Convert Firestore timestamp to date string
const timestampToDateString = (timestamp: Timestamp | Date | string | null | undefined): string => {
  if (!timestamp) return new Date().toISOString().split('T')[0];
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toISOString().split('T')[0];
  }
  if (timestamp instanceof Date) {
    return timestamp.toISOString().split('T')[0];
  }
  return new Date(timestamp).toISOString().split('T')[0];
};

// Orders Operations (Firestore)
export const getOrdersFirestore = (callback: (orders: SalesOrder[]) => void, filters?: {
  status?: string;
  startDate?: Date;
  endDate?: Date;
}) => {
  try {
    // Simplified query to avoid complex index requirements
    // We'll filter by status if provided, otherwise get all orders
    let constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
    
    // Only add status filter if provided to avoid complex queries
    if (filters?.status && filters.status !== 'all') {
      constraints = [where('status', '==', filters.status), orderBy('createdAt', 'desc')];
    }
    
    const ordersQuery = query(collection(firestore, ORDERS_COLLECTION), ...constraints);
    
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData: SalesOrder[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const order = {
          id: doc.id,
          ...data,
          // Ensure date is properly formatted
          date: timestampToDateString(data.date),
          dueDate: timestampToDateString(data.dueDate),
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        } as SalesOrder;
        
        // Apply date filters client-side to avoid complex index requirements
        if (filters?.startDate || filters?.endDate) {
          const orderDate = new Date(order.date);
          
          if (filters.startDate && orderDate < filters.startDate) {
            return; // Skip this order
          }
          if (filters.endDate && orderDate > filters.endDate) {
            return; // Skip this order
          }
        }
        
        ordersData.push(order);
      });
      
      // Sort by date descending (client-side sorting for filtered results)
      ordersData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      callback(ordersData);
    }, (error) => {
      console.error('Error fetching orders:', error);
      callback([]);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up orders listener:', error);
    callback([]);
    return () => {};
  }
};

export const addOrderFirestore = async (order: Omit<SalesOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const orderData = {
      ...order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(firestore, ORDERS_COLLECTION), orderData);
    
    // Add activity for new order using realtime database
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
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding order:', error);
    throw error;
  }
};

export const updateOrderFirestore = async (id: string, updates: Partial<SalesOrder>) => {
  try {
    const orderRef = doc(firestore, ORDERS_COLLECTION, id);
    
    // First get the current order data to compare changes
    let currentOrder: SalesOrder | null = null;
    try {
      const docSnap = await getDoc(orderRef);
      if (docSnap.exists()) {
        currentOrder = { id: docSnap.id, ...docSnap.data() } as SalesOrder;
      }
    } catch (error) {
      console.error('Error fetching current order for comparison:', error);
    }
    
    // Update the order
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(orderRef, updateData);
    
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
      
      // Add activity for order update using realtime database
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

export const deleteOrderFirestore = async (id: string) => {
  try {
    const orderRef = doc(firestore, ORDERS_COLLECTION, id);
    await deleteDoc(orderRef);
    
    // Add activity for order deletion using realtime database
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

// Sales Team Operations (Firestore)
export const getSalesTeamFirestore = (callback: (team: SalesTeamMember[]) => void) => {
  try {
    const teamQuery = query(collection(firestore, TEAM_COLLECTION), orderBy('name', 'asc'));
    
    const unsubscribe = onSnapshot(teamQuery, (snapshot) => {
      const teamData: SalesTeamMember[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        teamData.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        } as SalesTeamMember);
      });
      
      callback(teamData);
    }, (error) => {
      console.error('Error fetching sales team:', error);
      callback([]);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up team listener:', error);
    callback([]);
    return () => {};
  }
};

export const addTeamMemberFirestore = async (member: Omit<SalesTeamMember, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const memberData = {
      ...member,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(firestore, TEAM_COLLECTION), memberData);
    
    // Add activity for new team member using realtime database
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
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding team member:', error);
    throw error;
  }
};

export const updateTeamMemberFirestore = async (id: string, updates: Partial<SalesTeamMember>) => {
  try {
    const memberRef = doc(firestore, TEAM_COLLECTION, id);
    
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(memberRef, updateData);
    
    return;
  } catch (error) {
    console.error('Error updating team member:', error);
    throw error;
  }
};

export const deleteTeamMemberFirestore = async (id: string) => {
  try {
    const memberRef = doc(firestore, TEAM_COLLECTION, id);
    await deleteDoc(memberRef);
    
    return;
  } catch (error) {
    console.error('Error deleting team member:', error);
    throw error;
  }
};

// Batch operations for better performance
export const batchUpdateOrdersFirestore = async (updates: { [orderId: string]: Partial<SalesOrder> }) => {
  try {
    const updatePromises = Object.entries(updates).map(([orderId, updateData]) => 
      updateOrderFirestore(orderId, updateData)
    );
    
    await Promise.all(updatePromises);
    
    return;
  } catch (error) {
    console.error('Error batch updating orders:', error);
    throw error;
  }
};

// Define interface for analytics data
interface OrdersAnalytics {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  statusCounts: Record<string, number>;
  channelRevenue: Record<string, number>;
  lastUpdated: number;
}

// Analytics helpers for Firestore data
export const getOrdersAnalyticsFirestore = (callback: (analytics: OrdersAnalytics) => void) => {
  try {
    const ordersQuery = query(collection(firestore, ORDERS_COLLECTION));
    
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const orders: SalesOrder[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        orders.push({
          id: doc.id,
          ...data,
          date: timestampToDateString(data.date)
        } as SalesOrder);
      });
      
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
    
    return unsubscribe;
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