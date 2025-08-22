// lib/firebaseService.ts
import { 
  ref, 
  onValue, 
  push, 
  update, 
  remove,
  query,
  orderByChild,
  limitToLast,
  DatabaseReference 
} from 'firebase/database';
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
  getDoc
} from 'firebase/firestore';
import { db, firestore } from '../firebase-main';
import { SalesOrder, SalesTeamMember, Activity } from '@/types/Sales';

// Realtime Database for Activities
const ACTIVITIES_REF = ref(db, 'activities');

// Firestore Collections
const ORDERS_COLLECTION = 'orders';
const TEAM_COLLECTION = 'salesTeam';

// Activities Operations
export const getActivities = (callback: (activities: Activity[]) => void) => {
  const activitiesQuery = query(ACTIVITIES_REF, orderByChild('createdAt'), limitToLast(10));
  
  return onValue(activitiesQuery, (snapshot) => {
    const activitiesData: Activity[] = [];
    snapshot.forEach((childSnapshot) => {
      activitiesData.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    callback(activitiesData.reverse());
  });
};

export const addActivity = (activity: Omit<Activity, 'id' | 'createdAt'>) => {
  return push(ACTIVITIES_REF, {
    ...activity,
    createdAt: Date.now()
  });
};

export const updateActivity = (id: string, updates: Partial<Activity>) => {
  const activityRef = ref(db, `activities/${id}`);
  return update(activityRef, {
    ...updates,
    updatedAt: Date.now()
  });
};

export const deleteActivity = (id: string) => {
  const activityRef = ref(db, `activities/${id}`);
  return remove(activityRef);
};

// Orders Operations (Firestore)
export const getOrders = async (filters?: {
  status?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<SalesOrder[]> => {
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
};

export const addOrder = async (order: Omit<SalesOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await addDoc(collection(firestore, ORDERS_COLLECTION), {
    ...order,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  
  // Add activity for new order
  await addActivity({
    type: 'order-placed',
    message: `New order placed by ${order.customer} (${formatIndianCurrency(order.amount)})`,
    time: 'Just now',
    icon: '📦',
    priority: order.priority === 'high' ? 'high' : 'medium'
  });
  
  return docRef.id;
};

// lib/firebase/sales.ts
export const updateOrder = async (id: string, updates: Partial<SalesOrder>) => {
  const orderRef = doc(firestore, ORDERS_COLLECTION, id);
  
  // First get the current order data to compare changes
  const orderDoc = await getDoc(orderRef);
  const currentOrder = orderDoc.data() as SalesOrder;
  
  // Update the order
  await updateDoc(orderRef, {
    ...updates,
    updatedAt: Timestamp.now()
  });
  
  // Generate activity message based on what changed
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
    // Generic update message if no specific changes are detected
    activityMessage = `Order ${id} was updated`;
  }
  
  // Add activity for order update
  await addActivity({
    type: activityType,
    message: activityMessage,
    time: 'Just now',
    icon: '✏️',
    priority: priority
  });
  
  return;
};

export const deleteOrder = async (id: string) => {
  const orderRef = doc(firestore, ORDERS_COLLECTION, id);
  return deleteDoc(orderRef);
};

// Sales Team Operations (Firestore)
export const getSalesTeam = async (): Promise<SalesTeamMember[]> => {
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
};

export const addTeamMember = async (member: Omit<SalesTeamMember, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await addDoc(collection(firestore, TEAM_COLLECTION), {
    ...member,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  
  return docRef.id;
};

export const updateTeamMember = async (id: string, updates: Partial<SalesTeamMember>) => {
  const memberRef = doc(firestore, TEAM_COLLECTION, id);
  return updateDoc(memberRef, {
    ...updates,
    updatedAt: Timestamp.now()
  });
};

export const deleteTeamMember = async (id: string) => {
  const memberRef = doc(firestore, TEAM_COLLECTION, id);
  return deleteDoc(memberRef);
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