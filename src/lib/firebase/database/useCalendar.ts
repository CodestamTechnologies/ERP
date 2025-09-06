// lib/firebase/database/useCalendar.ts
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

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  type: 'meeting' | 'deadline' | 'reminder' | 'appointment' | 'training' | 'review' | 'presentation' | 'conference';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'postponed';
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  attendees: string[];
  organizer: string;
  department: string;
  tags: string[];
  isRecurring: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  reminderMinutes: number;
  createdAt: Timestamp | Date | string;
  updatedAt: Timestamp | Date | string;
}

export interface CalendarActivity {
  id: string;
  type: 'event-created' | 'event-updated' | 'event-completed' | 'event-cancelled' | 'reminder';
  message: string;
  eventId: string;
  eventTitle: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Timestamp | Date | string;
}

// Firestore Collections
const EVENTS_COLLECTION = 'calendarEvents';
const ACTIVITIES_COLLECTION = 'calendarActivities';

// Calendar Events Operations
export const getCalendarEvents = async (filters?: {
  startDate?: Date;
  endDate?: Date;
  type?: string;
  department?: string;
  priority?: string;
  status?: string;
}): Promise<CalendarEvent[]> => {
  try {
    let q = firestoreQuery(collection(firestore, EVENTS_COLLECTION));
    
    if (filters?.type && filters.type !== 'all') {
      q = firestoreQuery(q, where('type', '==', filters.type));
    }
    
    if (filters?.department && filters.department !== 'all') {
      q = firestoreQuery(q, where('department', '==', filters.department));
    }
    
    if (filters?.priority && filters.priority !== 'all') {
      q = firestoreQuery(q, where('priority', '==', filters.priority));
    }
    
    if (filters?.status && filters.status !== 'all') {
      q = firestoreQuery(q, where('status', '==', filters.status));
    }
    
    if (filters?.startDate && filters?.endDate) {
      q = firestoreQuery(
        q, 
        where('startDate', '>=', filters.startDate.toISOString().split('T')[0]),
        where('startDate', '<=', filters.endDate.toISOString().split('T')[0])
      );
    }
    
    q = firestoreQuery(q, orderBy('startDate', 'asc'));
    
    const querySnapshot = await getDocs(q);
    const events: CalendarEvent[] = [];
    
    querySnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data()
      } as CalendarEvent);
    });
    
    return events;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
};

export const addCalendarEvent = async (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(firestore, EVENTS_COLLECTION), {
      ...event,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    // Add activity for new event
    try {
      await addCalendarActivity({
        type: 'event-created',
        message: `New ${event.type} "${event.title}" scheduled for ${new Date(event.startDate).toLocaleDateString()}`,
        eventId: docRef.id,
        eventTitle: event.title,
        time: 'Just now',
        priority: event.priority === 'urgent' || event.priority === 'high' ? 'high' : 'medium'
      });
    } catch (activityError) {
      console.error('Error adding activity for new event:', activityError);
    }
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding calendar event:', error);
    throw error;
  }
};

export const updateCalendarEvent = async (id: string, updates: Partial<CalendarEvent>) => {
  try {
    const eventRef = doc(firestore, EVENTS_COLLECTION, id);
    
    // Get current event data for comparison
    let currentEvent: CalendarEvent | null = null;
    try {
      const eventDoc = await getDoc(eventRef);
      if (eventDoc.exists()) {
        currentEvent = { id: eventDoc.id, ...eventDoc.data() } as CalendarEvent;
      }
    } catch (error) {
      console.error('Error fetching current event for comparison:', error);
    }
    
    // Update the event
    await updateDoc(eventRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
    
    // Generate activity based on what changed
    if (currentEvent) {
      let activityMessage = '';
      let activityType: CalendarActivity['type'] = 'event-updated';
      let priority: 'low' | 'medium' | 'high' = 'medium';
      
      if (updates.status && updates.status !== currentEvent.status) {
        if (updates.status === 'completed') {
          activityMessage = `Event "${currentEvent.title}" marked as completed`;
          activityType = 'event-completed';
          priority = 'high';
        } else if (updates.status === 'cancelled') {
          activityMessage = `Event "${currentEvent.title}" was cancelled`;
          activityType = 'event-cancelled';
          priority = 'high';
        } else {
          activityMessage = `Event "${currentEvent.title}" status changed to ${updates.status}`;
        }
      } else if (updates.startDate && updates.startDate !== currentEvent.startDate) {
        activityMessage = `Event "${currentEvent.title}" rescheduled to ${new Date(updates.startDate).toLocaleDateString()}`;
      } else if (updates.priority && updates.priority !== currentEvent.priority) {
        activityMessage = `Event "${currentEvent.title}" priority changed to ${updates.priority}`;
        priority = updates.priority as 'low' | 'medium' | 'high';
      } else {
        activityMessage = `Event "${currentEvent.title}" was updated`;
      }
      
      // Add activity for event update
      try {
        await addCalendarActivity({
          type: activityType,
          message: activityMessage,
          eventId: id,
          eventTitle: currentEvent.title,
          time: 'Just now',
          priority: priority
        });
      } catch (activityError) {
        console.error('Error adding activity for event update:', activityError);
      }
    }
    
    return;
  } catch (error) {
    console.error('Error updating calendar event:', error);
    throw error;
  }
};

export const deleteCalendarEvent = async (id: string) => {
  try {
    const eventRef = doc(firestore, EVENTS_COLLECTION, id);
    return await deleteDoc(eventRef);
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    throw error;
  }
};

export const markEventAsCompleted = async (id: string) => {
  try {
    await updateCalendarEvent(id, { 
      status: 'completed',
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error marking event as completed:', error);
    throw error;
  }
};

// Calendar Activities Operations
export const getCalendarActivities = (callback: (activities: CalendarActivity[]) => void) => {
  try {
    const activitiesQuery = firestoreQuery(
      collection(firestore, ACTIVITIES_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    
    return onSnapshot(activitiesQuery, (snapshot) => {
      const activitiesData: CalendarActivity[] = [];
      snapshot.forEach((doc) => {
        activitiesData.push({
          id: doc.id,
          ...doc.data()
        } as CalendarActivity);
      });
      callback(activitiesData);
    }, (error) => {
      console.error('Error fetching calendar activities:', error);
      callback([]);
    });
  } catch (error) {
    console.error('Error setting up calendar activities listener:', error);
    callback([]);
    return () => {}; // Return empty unsubscribe function
  }
};

export const addCalendarActivity = async (activity: Omit<CalendarActivity, 'id' | 'createdAt'>) => {
  try {
    return await addDoc(collection(firestore, ACTIVITIES_COLLECTION), {
      ...activity,
      createdAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error adding calendar activity:', error);
    throw error;
  }
};

// Get upcoming events (next 7 days) - Fixed to avoid multiple != filters
export const getUpcomingEvents = async (): Promise<CalendarEvent[]> => {
  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    const q = firestoreQuery(
      collection(firestore, EVENTS_COLLECTION),
      where('startDate', '>=', today.toISOString().split('T')[0]),
      where('startDate', '<=', nextWeek.toISOString().split('T')[0]),
      orderBy('startDate', 'asc'),
      limit(15) // Get more to account for filtering
    );
    
    const querySnapshot = await getDocs(q);
    const events: CalendarEvent[] = [];
    
    querySnapshot.forEach((doc) => {
      const eventData = { id: doc.id, ...doc.data() } as CalendarEvent;
      // Filter out completed and cancelled events in JavaScript
      if (eventData.status !== 'completed' && eventData.status !== 'cancelled') {
        events.push(eventData);
      }
    });
    
    // Return only the first 10 after filtering
    return events.slice(0, 10);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
};

// Get events for a specific date
export const getEventsForDate = async (date: Date): Promise<CalendarEvent[]> => {
  try {
    const dateString = date.toISOString().split('T')[0];
    
    const q = firestoreQuery(
      collection(firestore, EVENTS_COLLECTION),
      where('startDate', '==', dateString),
      orderBy('startTime', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const events: CalendarEvent[] = [];
    
    querySnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data()
      } as CalendarEvent);
    });
    
    return events;
  } catch (error) {
    console.error('Error fetching events for date:', error);
    return [];
  }
};