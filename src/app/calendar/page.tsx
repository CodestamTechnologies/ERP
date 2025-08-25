'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar as ShadcnCalendar } from '@/components/ui/calendar';
import { useCalendar } from '@/hooks/useCalendar';
import { CalendarEvent } from '@/lib/firebase/database/useCalendar';

export default function CalendarPage() {
  const {
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
    events,
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
  } = useCalendar();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'deadline': return 'bg-red-100 text-red-800 border-red-200';
      case 'reminder': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'appointment': return 'bg-green-100 text-green-800 border-green-200';
      case 'training': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'review': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'presentation': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'conference': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'scheduled': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'postponed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return '🤝';
      case 'deadline': return '⏰';
      case 'reminder': return '🔔';
      case 'appointment': return '📅';
      case 'training': return '🎓';
      case 'review': return '📋';
      case 'presentation': return '📊';
      case 'conference': return '🏢';
      default: return '📌';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'event-created': return '➕';
      case 'event-updated': return '✏️';
      case 'event-completed': return '✅';
      case 'event-cancelled': return '❌';
      case 'reminder': return '🔔';
      default: return '📌';
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const attendeesString = formData.get('attendees') as string;
    const tagsString = formData.get('tags') as string;
    
    const eventData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as CalendarEvent['type'],
      priority: formData.get('priority') as CalendarEvent['priority'],
      status: 'scheduled' as CalendarEvent['status'],
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      location: formData.get('location') as string,
      attendees: attendeesString ? attendeesString.split(',').map(a => a.trim()) : [],
      organizer: formData.get('organizer') as string,
      department: formData.get('department') as string,
      tags: tagsString ? tagsString.split(',').map(t => t.trim()) : [],
      isRecurring: formData.get('isRecurring') === 'on',
      recurringType: formData.get('recurringType') as CalendarEvent['recurringType'],
      reminderMinutes: Number(formData.get('reminderMinutes'))
    };

    try {
      if (editingEvent) {
        await handleUpdateEvent(editingEvent.id, eventData);
      } else {
        await handleAddEvent(eventData);
      }
      setShowAddModal(false);
      setEditingEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setShowAddModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Calendar</h1>
          <p className="text-gray-600 mt-1">Manage meetings, deadlines, and important business events efficiently.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Select value={selectedView} onValueChange={setSelectedView}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="agenda">Agenda</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingEvent(null)}>
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
                <DialogDescription>
                  {editingEvent ? 'Update the event details below.' : 'Fill in the details to create a new event.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    defaultValue={editingEvent?.title || ''} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Event Type</Label>
                  <Select name="type" defaultValue={editingEvent?.type || 'meeting'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                      <SelectItem value="reminder">Reminder</SelectItem>
                      <SelectItem value="appointment">Appointment</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="presentation">Presentation</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    defaultValue={editingEvent?.description || ''} 
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input 
                    id="startDate" 
                    name="startDate" 
                    type="date" 
                    defaultValue={editingEvent?.startDate || ''} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input 
                    id="endDate" 
                    name="endDate" 
                    type="date" 
                    defaultValue={editingEvent?.endDate || ''} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input 
                    id="startTime" 
                    name="startTime" 
                    type="time" 
                    defaultValue={editingEvent?.startTime || ''} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input 
                    id="endTime" 
                    name="endTime" 
                    type="time" 
                    defaultValue={editingEvent?.endTime || ''} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    name="location" 
                    defaultValue={editingEvent?.location || ''} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organizer">Organizer</Label>
                  <Input 
                    id="organizer" 
                    name="organizer" 
                    defaultValue={editingEvent?.organizer || ''} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select name="department" defaultValue={editingEvent?.department || 'Executive'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Executive">Executive</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Human Resources">Human Resources</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select name="priority" defaultValue={editingEvent?.priority || 'medium'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="attendees">Attendees (comma-separated)</Label>
                  <Input 
                    id="attendees" 
                    name="attendees" 
                    defaultValue={editingEvent?.attendees?.join(', ') || ''} 
                    placeholder="John Doe, Jane Smith, Team Lead"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input 
                    id="tags" 
                    name="tags" 
                    defaultValue={editingEvent?.tags?.join(', ') || ''} 
                    placeholder="important, quarterly, planning"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reminderMinutes">Reminder (minutes before)</Label>
                  <Select name="reminderMinutes" defaultValue={editingEvent?.reminderMinutes?.toString() || '30'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reminder" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="1440">1 day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="isRecurring" 
                      name="isRecurring" 
                      defaultChecked={editingEvent?.isRecurring || false}
                    />
                    <Label htmlFor="isRecurring">Recurring Event</Label>
                  </div>
                </div>
                <DialogFooter className="md:col-span-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Events</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="text-2xl">📅</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Scheduled</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{stats.scheduled}</p>
                </div>
                <div className="text-2xl">📋</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
                </div>
                <div className="text-2xl">✅</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">{stats.inProgress}</p>
                </div>
                <div className="text-2xl">🔄</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">{stats.upcoming}</p>
                </div>
                <div className="text-2xl">⏳</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle>
                  {selectedView === 'month' && `${monthNames[currentMonth]} ${currentYear}`}
                  {selectedView === 'week' && 'Week View'}
                  {selectedView === 'day' && selectedDate.toLocaleDateString()}
                  {selectedView === 'agenda' && 'Event Agenda'}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {selectedView === 'month' && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}>
                        ←
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
                        Today
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigateMonth(1)}>
                        →
                      </Button>
                    </>
                  )}
                  <div className="flex space-x-2">
                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="meeting">Meetings</SelectItem>
                        <SelectItem value="deadline">Deadlines</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                        <SelectItem value="presentation">Presentations</SelectItem>
                        <SelectItem value="conference">Conferences</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="Executive">Executive</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Human Resources">HR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {loading.events ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : selectedView === 'month' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Shadcn Calendar */}
                  <div className="lg:col-span-1">
                    <ShadcnCalendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      className="rounded-md border shadow-sm"
                      captionLayout="dropdown"
                    />
                  </div>
                  
                  {/* Events for Selected Date */}
                  <div className="lg:col-span-2">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Events for {selectedDate.toLocaleDateString()}
                        </h3>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowAddModal(true)}
                        >
                          Add Event
                        </Button>
                      </div>
                      
                      {/* Events List for Selected Date */}
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {events
                          .filter(event => {
                            const eventDate = new Date(event.startDate);
                            return eventDate.toDateString() === selectedDate.toDateString();
                          })
                          .map((event) => (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => {
                                setSelectedEvent(event);
                                setShowEventModal(true);
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <span className="text-lg">{getTypeIcon(event.type)}</span>
                                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                                  
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Badge className={getTypeColor(event.type)}>
                                      {event.type}
                                    </Badge>
                                    <Badge className={getPriorityColor(event.priority)}>
                                      {event.priority}
                                    </Badge>
                                    <Badge className={getStatusColor(event.status)}>
                                      {event.status}
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span>⏰ {event.startTime} - {event.endTime}</span>
                                    <span>📍 {event.location}</span>
                                    <span>👤 {event.organizer}</span>
                                  </div>
                                </div>
                                
                                <div className="flex space-x-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditEvent(event);
                                    }}
                                  >
                                    Edit
                                  </Button>
                                  {event.status !== 'completed' && (
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleMarkAsCompleted(event.id);
                                      }}
                                      className="text-green-600 hover:text-green-800"
                                    >
                                      Done
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        
                        {events.filter(event => {
                          const eventDate = new Date(event.startDate);
                          return eventDate.toDateString() === selectedDate.toDateString();
                        }).length === 0 && (
                          <div className="flex flex-col items-center justify-center h-32 text-center">
                            <div className="bg-gray-100 p-3 rounded-full mb-3">
                              <span className="text-xl">📅</span>
                            </div>
                            <h4 className="text-sm font-medium text-gray-900 mb-1">No events for this date</h4>
                            <p className="text-xs text-gray-500">Click "Add Event" to create one</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectedView === 'agenda' ? (
                <div className="space-y-4">
                  {events.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <div className="bg-gray-100 p-4 rounded-full mb-4">
                        <span className="text-2xl">📅</span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No events found</h3>
                      <p className="text-sm text-gray-500">Create your first event to get started.</p>
                    </div>
                  ) : (
                    events.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-lg">{getTypeIcon(event.type)}</span>
                              <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge className={getTypeColor(event.type)}>
                                {event.type.toUpperCase()}
                              </Badge>
                              <Badge className={getPriorityColor(event.priority)}>
                                {event.priority.toUpperCase()}
                              </Badge>
                              <Badge className={getStatusColor(event.status)}>
                                {event.status.replace('-', ' ').toUpperCase()}
                              </Badge>
                              <Badge variant="outline">
                                {event.department}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                              <div>
                                <span className="font-medium">Date:</span>
                                <p>{new Date(event.startDate).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <span className="font-medium">Time:</span>
                                <p>{event.startTime} - {event.endTime}</p>
                              </div>
                              <div>
                                <span className="font-medium">Location:</span>
                                <p>{event.location}</p>
                              </div>
                              <div>
                                <span className="font-medium">Organizer:</span>
                                <p>{event.organizer}</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-3">
                              {event.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>

                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  setSelectedEvent(event);
                                  setShowEventModal(true);
                                }}
                              >
                                View Details
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEditEvent(event)}
                              >
                                Edit
                              </Button>
                              {event.status !== 'completed' && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleMarkAsCompleted(event.id)}
                                  className="text-green-600 hover:text-green-800"
                                >
                                  Mark Done
                                </Button>
                              )}
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDeleteEvent(event.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <span className="text-2xl">🚧</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">View Coming Soon</h3>
                  <p className="text-sm text-gray-500">This view is currently being developed.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {loading.upcoming ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : upcomingEvents.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-2xl mb-2">📅</div>
                  <p className="text-sm text-gray-500">No upcoming events</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                      <div className="text-lg">{getTypeIcon(event.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(event.startDate).toLocaleDateString()} at {event.startTime}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={`${getPriorityColor(event.priority)} text-xs`}>
                            {event.priority}
                          </Badge>
                          {event.status !== 'completed' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleMarkAsCompleted(event.id)}
                              className="text-xs h-6 px-2 text-green-600 hover:text-green-800"
                            >
                              Done
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {loading.activities ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-2xl mb-2">📋</div>
                  <p className="text-sm text-gray-500">No recent activities</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {activities.slice(0, 10).map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                      <div className="text-sm">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  📊 Generate Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  📧 Send Reminders
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  📅 Sync Calendar
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  📈 View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Detail Modal */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <span>{getTypeIcon(selectedEvent.type)}</span>
                  <span>{selectedEvent.title}</span>
                </DialogTitle>
                <DialogDescription>
                  Event details and information
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Event Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Type:</span>
                        <Badge className={getTypeColor(selectedEvent.type)}>
                          {selectedEvent.type}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Priority:</span>
                        <Badge className={getPriorityColor(selectedEvent.priority)}>
                          {selectedEvent.priority}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <Badge className={getStatusColor(selectedEvent.status)}>
                          {selectedEvent.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Department:</span>
                        <span className="font-medium">{selectedEvent.department}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Schedule</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date:</span>
                        <span className="font-medium">{new Date(selectedEvent.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Time:</span>
                        <span className="font-medium">{selectedEvent.startTime} - {selectedEvent.endTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Location:</span>
                        <span className="font-medium">{selectedEvent.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Organizer:</span>
                        <span className="font-medium">{selectedEvent.organizer}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Description</h3>
                    <p className="text-sm text-gray-600">{selectedEvent.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Attendees</h3>
                    <div className="space-y-1">
                      {selectedEvent.attendees.map((attendee, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          • {attendee}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedEvent.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEventModal(false)}>
                  Close
                </Button>
                {selectedEvent.status !== 'completed' && (
                  <Button 
                    onClick={() => {
                      handleMarkAsCompleted(selectedEvent.id);
                      setShowEventModal(false);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Mark as Done
                  </Button>
                )}
                <Button onClick={() => {
                  setShowEventModal(false);
                  handleEditEvent(selectedEvent);
                }}>
                  Edit Event
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}