// components/Todo.tsx
'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskDialog } from '../Dialogs/taskDialog';
import { TaskDetailDialog } from '../Dialogs/taskDeatailDialog';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/context/authContext';
import { Task, TaskType, TaskPriority, TaskStatus, UserRole } from '@/types/todos';

// Define interfaces for task data
interface TaskFormData {
  title: string;
  description: string;
  category: string;
  priority: TaskPriority;
  assignedTo?: string;
  department?: string;
  dueDate: string;
  tags?: string;
  estimatedHours?: string;
}

const Todo = () => {
  const [activeTab, setActiveTab] = useState<TaskType>('business');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  
  const { user: currentUser } = useAuth();
  const { tasks, users, loading, error, addTask, updateTask, deleteTask, updateTaskProgress } = useTasks(activeTab);

  // Check if user is admin
  const isAdmin = currentUser?.role === 'admin';
  
  // Filter tasks based on selected filters
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const categoryMatch = selectedCategory === 'all' || task.category === selectedCategory;
      const priorityMatch = selectedPriority === 'all' || task.priority === selectedPriority;
      const statusMatch = selectedStatus === 'all' || task.status === selectedStatus;
      const searchMatch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignedToName.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && priorityMatch && statusMatch && searchMatch;
    });
  }, [tasks, selectedCategory, selectedPriority, selectedStatus, searchTerm]);

  // Calculate statistics for current tab
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    onHold: tasks.filter(t => t.status === 'on-hold').length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length
  };

  // Get unique categories for current tab
  const categories = ['all', ...Array.from(new Set(tasks.map(task => task.category)))];

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
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '🔄';
      case 'pending': return '⏳';
      case 'on-hold': return '⏸️';
      default: return '📋';
    }
  };

  const handleAddTask = async (taskData: TaskFormData) => {
    try {
      if (!currentUser) throw new Error('User not authenticated');

      const newTask = {
        title: taskData.title,
        description: taskData.description,
        category: taskData.category,
        priority: taskData.priority as TaskPriority,
        status: 'pending' as TaskStatus,
        assignedTo: taskData.assignedTo || currentUser.uid,
        assignedToName: '',
        department: taskData.department || 'Personal',
        dueDate: taskData.dueDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: taskData.tags ? taskData.tags.split(',').map((tag: string) => tag.trim()) : [],
        progress: 0,
        estimatedHours: parseInt(taskData.estimatedHours || '1') || 1,
        type: activeTab,
        createdBy: currentUser.uid,
        createdByName: currentUser.displayName || 'Unknown'
      };

      await addTask(newTask);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleEditTask = async (taskData: TaskFormData, taskId?: string) => {
    if (!taskId) return;
    
    try {
      const updatedTask = {
        title: taskData.title,
        description: taskData.description,
        category: taskData.category,
        priority: taskData.priority as TaskPriority,
        assignedTo: taskData.assignedTo,
        department: taskData.department,
        dueDate: taskData.dueDate,
        updatedAt: new Date().toISOString(),
        tags: taskData.tags ? taskData.tags.split(',').map((tag: string) => tag.trim()) : [],
        estimatedHours: parseInt(taskData.estimatedHours || '1') || 1,
      };

      await updateTask(taskId, updatedTask);
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleUpdateTaskProgress = async (taskId: string, newProgress: number) => {
    try {
      await updateTaskProgress(taskId, newProgress);
    } catch (error) {
      console.error('Error updating task progress:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Management Center</h1>
          <p className="text-gray-600 mt-1">Manage business tasks and personal development goals efficiently</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="outline">
            📊 Task Analytics
          </Button>
          {(activeTab === 'personal' || isAdmin) && (
            <Button onClick={() => setShowAddModal(true)} variant="default">
              ➕ Add {activeTab === 'business' ? 'Business' : 'Personal'} Task
            </Button>
          )}
          <Button variant="outline">
            📈 Progress Report
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <Card>
        <CardHeader className="border-b">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TaskType)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="business" className="flex items-center space-x-2">
                <span>🏢</span>
                <span>Business Tasks</span>
                <Badge variant="secondary" className="ml-2">
                  {stats.total}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="personal" className="flex items-center space-x-2">
                <span>👤</span>
                <span>Personal Tasks</span>
                <Badge variant="secondary" className="ml-2">
                  {stats.total}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
     <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="text-2xl">📋</div>
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
            <CardContent className="p-4">
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
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{stats.inProgress}</p>
                </div>
                <div className="text-2xl">🔄</div>
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
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-600 mt-1">{stats.pending}</p>
                </div>
                <div className="text-2xl">⏳</div>
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
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">On Hold</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.onHold}</p>
                </div>
                <div className="text-2xl">⏸️</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{stats.overdue}</p>
                </div>
                <div className="text-2xl">🚨</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <CardTitle>
              {activeTab === 'business' ? 'Business Tasks' : 'Personal Tasks'}
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-[200px]"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <span className="text-2xl">
                  {activeTab === 'business' ? '🏢' : '👤'}
                </span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {searchTerm || selectedCategory !== 'all' || selectedPriority !== 'all' || selectedStatus !== 'all'
                  ? 'No tasks match your filters'
                  : `No ${activeTab} tasks found`}
              </h3>
              <p className="text-sm text-gray-500">
                {!searchTerm && selectedCategory === 'all' && selectedPriority === 'all' && selectedStatus === 'all'
                  ? 'Create your first task to get started.'
                  : 'Try adjusting your search or filter criteria.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-lg">{getStatusIcon(task.status)}</span>
                          <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                          <Badge className={getPriorityColor(task.priority)}>
                            {getPriorityIcon(task.priority)} {task.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge className={getStatusColor(task.status)}>
                            {task.status.replace('-', ' ').toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {task.category}
                          </Badge>
                          <Badge variant="outline">
                            {task.assignedToName}
                          </Badge>
                          {task.type === 'personal' && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              Personal
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                          <div>
                            <span className="font-medium">Due Date:</span>
                            <p className={new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'text-red-600 font-medium' : ''}>
                              {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium">Department:</span>
                            <p>{task.department}</p>
                          </div>
                          <div>
                            <span className="font-medium">Estimated:</span>
                            <p>{task.estimatedHours}h</p>
                          </div>
                          <div>
                            <span className="font-medium">Actual:</span>
                            <p>{task.actualHours || 0}h</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium">Progress</span>
                            <span>{task.progress}%</span>
                          </div>
                          <Progress value={task.progress} className="w-full" />
                          {task.status !== 'completed' && (
                            <div className="flex items-center space-x-2 mt-2">
                              <Input
                                type="range"
                                min="0"
                                max="100"
                                value={task.progress}
                                onChange={(e) => handleUpdateTaskProgress(task.id, parseInt(e.target.value))}
                                className="flex-1"
                              />
                              <span className="text-sm text-gray-500 w-12">{task.progress}%</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {task.tags.map((tag) => (
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
                            onClick={() => setViewingTask(task)}
                          >
                            👁️ View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingTask(task)}
                          >
                            ✏️ Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            🗑️ Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Task Dialog */}
      <TaskDialog
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSubmit={handleAddTask}
        type={activeTab}
        users={users}
        currentUser={currentUser}
      />

      {/* Edit Task Dialog */}
      <TaskDialog
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        onSubmit={handleEditTask}
        type={activeTab}
        task={editingTask}
        users={users}
        currentUser={currentUser}
      />

      {/* Task Detail Dialog */}
      <TaskDetailDialog
        open={!!viewingTask}
        onOpenChange={(open) => !open && setViewingTask(null)}
        task={viewingTask}
        currentUser={currentUser}
      />
    </div>
  );
};

export default Todo;