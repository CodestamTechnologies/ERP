 // hooks/useCalendar.ts
import { useState, useEffect } from 'react';
import { 
  getCalendarEvents, 
  addCalendarEvent, 
  updateCalendarEvent, 
  deleteCalendarEvent,
  markEventAsCompleted,
  getCalendarActivities,
  getUpcomingEvents,
  getEventsForDate,
  CalendarEvent,
  CalendarActivity
} from '@/lib/firebase/database/useCalendar';

export const useCalendar = () => {
  const [selectedView, setSelectedView] = useState('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [activities, setActivities] = useState<CalendarActivity[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState({
    events: true,
    activities: true,
    upcoming: true
  });

  // Load events
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(prev => ({ ...prev, events: true }));
        const eventsData = await getCalendarEvents({
          type: selectedFilter === 'all' ? undefined : selectedFilter,
          department: selectedDepartment === 'all' ? undefined : selectedDepartment,
          priority: selectedPriority === 'all' ? undefined : selectedPriority
        });
        setEvents(eventsData || []);
      } catch (error) {
        console.error('Error loading events:', error);
        setEvents([]);
      } finally {
        setLoading(prev => ({ ...prev, events: false }));
      }
    };

    loadEvents();
  }, [selectedFilter, selectedDepartment, selectedPriority]);

  // Load upcoming events
  useEffect(() => {
    const loadUpcomingEvents = async () => {
      try {
        setLoading(prev => ({ ...prev, upcoming: true }));
        const upcomingData = await getUpcomingEvents();
        setUpcomingEvents(upcomingData || []);
      } catch (error) {
        console.error('Error loading upcoming events:', error);
        setUpcomingEvents([]);
      } finally {
        setLoading(prev => ({ ...prev, upcoming: false }));
      }
    };

    loadUpcomingEvents();
  }, []);

  // Load activities (realtime)
  useEffect(() => {
    try {
      const unsubscribe = getCalendarActivities((activitiesData) => {
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

  // Get current month and year
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  // Filter events based on selected view and date
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.startDate);
    let dateMatch = true;
    
    if (selectedView === 'month') {
      dateMatch = eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
    } else if (selectedView === 'week') {
      const weekStart = new Date(selectedDate);
      weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      dateMatch = eventDate >= weekStart && eventDate <= weekEnd;
    } else if (selectedView === 'day') {
      dateMatch = eventDate.toDateString() === selectedDate.toDateString();
    }
    
    return dateMatch;
  });

  // Calculate statistics
  const stats = {
    total: events.length,
    scheduled: events.filter(e => e.status === 'scheduled').length,
    completed: events.filter(e => e.status === 'completed').length,
    inProgress: events.filter(e => e.status === 'in-progress').length,
    upcoming: upcomingEvents.length
  };

  // Generate calendar grid for month view
  const generateCalendarGrid = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dayEvents = events.filter(event => 
        new Date(event.startDate).toDateString() === current.toDateString()
      );
      
      days.push({
        date: new Date(current),
        events: dayEvents,
        isCurrentMonth: current.getMonth() === currentMonth,
        isToday: current.toDateString() === new Date().toDateString()
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateCalendarGrid();

  const handleAddEvent = async (eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addCalendarEvent(eventData);
      // Refresh events
      const updatedEvents = await getCalendarEvents({
        type: selectedFilter === 'all' ? undefined : selectedFilter,
        department: selectedDepartment === 'all' ? undefined : selectedDepartment,
        priority: selectedPriority === 'all' ? undefined : selectedPriority
      });
      setEvents(updatedEvents || []);
      
      // Refresh upcoming events
      const updatedUpcoming = await getUpcomingEvents();
      setUpcomingEvents(updatedUpcoming || []);
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  };

  const handleUpdateEvent = async (id: string, updates: Partial<CalendarEvent>) => {
    try {
      await updateCalendarEvent(id, updates);
      // Refresh events
      const updatedEvents = await getCalendarEvents({
        type: selectedFilter === 'all' ? undefined : selectedFilter,
        department: selectedDepartment === 'all' ? undefined : selectedDepartment,
        priority: selectedPriority === 'all' ? undefined : selectedPriority
      });
      setEvents(updatedEvents || []);
      
      // Refresh upcoming events
      const updatedUpcoming = await getUpcomingEvents();
      setUpcomingEvents(updatedUpcoming || []);
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteCalendarEvent(id);
      // Refresh events
      const updatedEvents = await getCalendarEvents({
        type: selectedFilter === 'all' ? undefined : selectedFilter,
        department: selectedDepartment === 'all' ? undefined : selectedDepartment,
        priority: selectedPriority === 'all' ? undefined : selectedPriority
      });
      setEvents(updatedEvents || []);
      
      // Refresh upcoming events
      const updatedUpcoming = await getUpcomingEvents();
      setUpcomingEvents(updatedUpcoming || []);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  };

  const handleMarkAsCompleted = async (id: string) => {
    try {
      await markEventAsCompleted(id);
      // Refresh events
      const updatedEvents = await getCalendarEvents({
        type: selectedFilter === 'all' ? undefined : selectedFilter,
        department: selectedDepartment === 'all' ? undefined : selectedDepartment,
        priority: selectedPriority === 'all' ? undefined : selectedPriority
      });
      setEvents(updatedEvents || []);
      
      // Refresh upcoming events
      const updatedUpcoming = await getUpcomingEvents();
      setUpcomingEvents(updatedUpcoming || []);
    } catch (error) {
      console.error('Error marking event as completed:', error);
      throw error;
    }
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  return {
    selectedView,
    setSelectedView,
    selectedDate,
    setSelectedDate,
    selectedFilter,
    setSelectedFilter,
    selectedDepartment,
    setSelectedDepartment,
    selectedPriority,
    setSelectedPriority,
    events: filteredEvents,
    activities,
    upcomingEvents,
    loading,
    stats,
    calendarDays,
    currentMonth,
    currentYear,
    handleAddEvent,
    handleUpdateEvent,
    handleDeleteEvent,
    handleMarkAsCompleted,
    navigateMonth
  };
};