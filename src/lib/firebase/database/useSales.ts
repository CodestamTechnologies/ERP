// lib/firebaseService.ts
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query as firestoreQuery,
  where,
  orderBy,
  Timestamp,
  getDoc,
  onSnapshot,
  limit
} from 'firebase/firestore';
import { firestore } from '../firebase-main';
import { SalesOrder, SalesTeamMember, Activity } from '@/types/Sales';

// Firestore Collections
const ORDERS_COLLECTION = 'orders';
const TEAM_COLLECTION = 'salesTeam';
const ACTIVITIES_COLLECTION = 'activities';

// Activities Operations (moved to Firestore)
export const getActivities = (callback: (activities: Activity[]) => void) => {
  try {
    const activitiesQuery = firestoreQuery(
      collection(firestore, ACTIVITIES_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    
    return onSnapshot(activitiesQuery, (snapshot) => {
      const activitiesData: Activity[] = [];
      snapshot.forEach((doc) => {
        activitiesData.push({
          id: doc.id,
          ...doc.data()
        } as Activity);
      });
      callback(activitiesData);
    }, (error) => {
      console.error('Error fetching activities:', error);
      callback([]);
    });
  } catch (error) {
    console.error('Error setting up activities listener:', error);
    callback([]);
    return () => {}; // Return empty unsubscribe function
  }
};

export const addActivity = async (activity: Omit<Activity, 'id' | 'createdAt'>) => {
  try {
    return await addDoc(collection(firestore, ACTIVITIES_COLLECTION), {
      ...activity,
      createdAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error adding activity:', error);
    throw error;
  }
};

export const updateActivity = async (id: string, updates: Partial<Activity>) => {
  try {
    const activityRef = doc(firestore, ACTIVITIES_COLLECTION, id);
    return await updateDoc(activityRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating activity:', error);
    throw error;
  }
};

export const deleteActivity = async (id: string) => {
  try {
    const activityRef = doc(firestore, ACTIVITIES_COLLECTION, id);
    return await deleteDoc(activityRef);
  } catch (error) {
    console.error('Error deleting activity:', error);
    throw error;
  }
};

// Orders Operations (Firestore)
export const getOrders = async (filters?: {
  status?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<SalesOrder[]> => {
  try {
    let q = firestoreQuery(collection(firestore, ORDERS_COLLECTION));
    
    if (filters?.status && filters.status !== 'all') {
      q = firestoreQuery(q, where('status', '==', filters.status));
    }
    
    if (filters?.startDate && filters?.endDate) {
      q = firestoreQuery(
        q, 
        where('date', '>=', filters.startDate.toISOString().split('T')[0]),
        where('date', '<=', filters.endDate.toISOString().split('T')[0])
      );
    }
    
    q = firestoreQuery(q, orderBy('date', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const orders: SalesOrder[] = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      } as SalesOrder);
    });
    
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const addOrder = async (order: Omit<SalesOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(firestore, ORDERS_COLLECTION), {
      ...order,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    // Add activity for new order
    try {
      await addActivity({
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

export const updateOrder = async (id: string, updates: Partial<SalesOrder>) => {
  try {
    const orderRef = doc(firestore, ORDERS_COLLECTION, id);
    
    // First get the current order data to compare changes
    let currentOrder: SalesOrder | null = null;
    try {
      const orderDoc = await getDoc(orderRef);
      if (orderDoc.exists()) {
        currentOrder = orderDoc.data() as SalesOrder;
      }
    } catch (error) {
      console.error('Error fetching current order for comparison:', error);
    }
    
    // Update the order
    await updateDoc(orderRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
    
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
        await addActivity({
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

export const deleteOrder = async (id: string) => {
  try {
    const orderRef = doc(firestore, ORDERS_COLLECTION, id);
    return await deleteDoc(orderRef);
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

// Sales Team Operations (Firestore)
export const getSalesTeam = async (): Promise<SalesTeamMember[]> => {
  try {
    const q = firestoreQuery(
      collection(firestore, TEAM_COLLECTION),
      orderBy('name')
    );
    
    const querySnapshot = await getDocs(q);
    const team: SalesTeamMember[] = [];
    
    querySnapshot.forEach((doc) => {
      team.push({
        id: doc.id,
        ...doc.data()
      } as SalesTeamMember);
    });
    
    return team;
  } catch (error) {
    console.error('Error fetching sales team:', error);
    return [];
  }
};

export const addTeamMember = async (member: Omit<SalesTeamMember, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(firestore, TEAM_COLLECTION), {
      ...member,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding team member:', error);
    throw error;
  }
};

export const updateTeamMember = async (id: string, updates: Partial<SalesTeamMember>) => {
  try {
    const memberRef = doc(firestore, TEAM_COLLECTION, id);
    return await updateDoc(memberRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    throw error;
  }
};

export const deleteTeamMember = async (id: string) => {
  try {
    const memberRef = doc(firestore, TEAM_COLLECTION, id);
    return await deleteDoc(memberRef);
  } catch (error) {
    console.error('Error deleting team member:', error);
    throw error;
  }
};

// Utility function for currency formatting
export const formatIndianCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};