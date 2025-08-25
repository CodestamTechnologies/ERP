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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';


interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'on-hold';
  assignedTo: string;
  department: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  progress: number;
  estimatedHours: number;
  actualHours?: number;
  type: 'business' | 'personal';
  createdBy?: string;
}

export default function TodoPage() {
  const [activeTab, setActiveTab] = useState('business');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentUser] = useState('John Doe'); // This would come from auth context

  // Business tasks (existing comprehensive data)
  const [businessTasks] = useState<Task[]>([
    {
      id: 'TSK-2024-001',
      title: 'Q1 Financial Audit Preparation',
      description: 'Prepare comprehensive financial documentation for the quarterly audit including balance sheets, income statements, cash flow reports, and supporting documentation. Coordinate with external auditors and ensure all compliance requirements are met.',
      category: 'Finance',
      priority: 'urgent',
      status: 'in-progress',
      assignedTo: 'David Kumar',
      department: 'Finance',
      dueDate: '2024-02-15',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-28',
      tags: ['audit', 'compliance', 'financial', 'quarterly'],
      progress: 75,
      estimatedHours: 40,
      actualHours: 32,
      type: 'business'
    },
    {
      id: 'TSK-2024-002',
      title: 'Product Launch Campaign Strategy',
      description: 'Develop comprehensive go-to-market strategy for the new product line including market research, competitive analysis, pricing strategy, promotional campaigns, and launch timeline coordination across all departments.',
      category: 'Marketing',
      priority: 'high',
      status: 'in-progress',
      assignedTo: 'Sarah Johnson',
      department: 'Marketing',
      dueDate: '2024-02-20',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-29',
      tags: ['product-launch', 'strategy', 'marketing', 'campaign'],
      progress: 60,
      estimatedHours: 35,
      actualHours: 28,
      type: 'business'
    },
    {
      id: 'TSK-2024-003',
      title: 'Employee Performance Review System Implementation',
      description: 'Design and implement a comprehensive performance review system including evaluation criteria, feedback mechanisms, goal-setting frameworks, and integration with existing HR systems for better employee development tracking.',
      category: 'Human Resources',
      priority: 'high',
      status: 'pending',
      assignedTo: 'Emily Rodriguez',
      department: 'Human Resources',
      dueDate: '2024-03-01',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-25',
      tags: ['hr', 'performance', 'evaluation', 'system'],
      progress: 25,
      estimatedHours: 50,
      type: 'business'
    },
    {
      id: 'TSK-2024-004',
      title: 'Customer Support Portal Enhancement',
      description: 'Upgrade the customer support portal with new features including AI-powered chatbot, knowledge base search, ticket prioritization system, and customer satisfaction tracking to improve overall support experience.',
      category: 'Technology',
      priority: 'medium',
      status: 'in-progress',
      assignedTo: 'Michael Chen',
      department: 'IT',
      dueDate: '2024-02-28',
      createdAt: '2024-01-12',
      updatedAt: '2024-01-30',
      tags: ['customer-support', 'portal', 'enhancement', 'ai'],
      progress: 45,
      estimatedHours: 60,
      actualHours: 35,
      type: 'business'
    },
    {
      id: 'TSK-2024-005',
      title: 'Supply Chain Optimization Analysis',
      description: 'Conduct comprehensive analysis of current supply chain processes, identify bottlenecks, cost optimization opportunities, and develop recommendations for improving efficiency and reducing operational costs.',
      category: 'Operations',
      priority: 'medium',
      status: 'completed',
      assignedTo: 'Robert Wilson',
      department: 'Operations',
      dueDate: '2024-01-31',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-31',
      tags: ['supply-chain', 'optimization', 'analysis', 'efficiency'],
      progress: 100,
      estimatedHours: 30,
      actualHours: 28,
      type: 'business'
    },
    {
      id: 'TSK-2024-006',
      title: 'Sales Team Training Program Development',
      description: 'Create comprehensive training program for sales team including product knowledge sessions, sales techniques workshops, CRM system training, and customer relationship management best practices.',
      category: 'Sales',
      priority: 'high',
      status: 'pending',
      assignedTo: 'Jennifer Lee',
      department: 'Sales',
      dueDate: '2024-02-25',
      createdAt: '2024-01-18',
      updatedAt: '2024-01-26',
      tags: ['sales', 'training', 'development', 'crm'],
      progress: 15,
      estimatedHours: 25,
      type: 'business'
    },
    {
      id: 'TSK-2024-007',
      title: 'Data Security Compliance Audit',
      description: 'Perform comprehensive security audit to ensure compliance with data protection regulations, implement necessary security measures, and develop incident response procedures for data breach scenarios.',
      category: 'Security',
      priority: 'urgent',
      status: 'on-hold',
      assignedTo: 'Alex Park',
      department: 'IT',
      dueDate: '2024-02-10',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-27',
      tags: ['security', 'compliance', 'audit', 'data-protection'],
      progress: 30,
      estimatedHours: 45,
      actualHours: 15,
      type: 'business'
    },
    {
      id: 'TSK-2024-008',
      title: 'Customer Feedback Integration System',
      description: 'Develop integrated system for collecting, analyzing, and acting on customer feedback across all touchpoints including surveys, reviews, support tickets, and social media mentions.',
      category: 'Customer Experience',
      priority: 'medium',
      status: 'in-progress',
      assignedTo: 'Lisa Thompson',
      department: 'Customer Success',
      dueDate: '2024-03-15',
      createdAt: '2024-01-22',
      updatedAt: '2024-01-29',
      tags: ['customer-feedback', 'integration', 'analysis', 'experience'],
      progress: 40,
      estimatedHours: 35,
      actualHours: 18,
      type: 'business'
    }
  ]);

  // Personal tasks (user-specific tasks)
  const [personalTasks, setPersonalTasks] = useState<Task[]>([
    {
      id: 'PER-2024-001',
      title: 'Complete React Advanced Course',
      description: 'Finish the advanced React course on Udemy including hooks, context API, performance optimization, and testing. Apply learnings to current projects.',
      category: 'Learning',
      priority: 'medium',
      status: 'in-progress',
      assignedTo: currentUser,
      department: 'Personal Development',
      dueDate: '2024-02-20',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-30',
      tags: ['learning', 'react', 'development', 'course'],
      progress: 65,
      estimatedHours: 20,
      actualHours: 13,
      type: 'personal',
      createdBy: currentUser
    },
    {
      id: 'PER-2024-002',
      title: 'Prepare Quarterly Performance Review',
      description: 'Gather achievements, set goals for next quarter, prepare self-assessment, and collect feedback from team members and stakeholders.',
      category: 'Career',
      priority: 'high',
      status: 'pending',
      assignedTo: currentUser,
      department: 'Personal Development',
      dueDate: '2024-02-10',
      createdAt: '2024-01-25',
      updatedAt: '2024-01-30',
      tags: ['performance', 'review', 'career', 'goals'],
      progress: 20,
      estimatedHours: 8,
      actualHours: 2,
      type: 'personal',
      createdBy: currentUser
    },
    {
      id: 'PER-2024-003',
      title: 'Update Professional Portfolio',
      description: 'Refresh portfolio website with recent projects, update resume, add new skills and certifications, and optimize for better visibility.',
      category: 'Career',
      priority: 'medium',
      status: 'completed',
      assignedTo: currentUser,
      department: 'Personal Development',
      dueDate: '2024-01-31',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-31',
      tags: ['portfolio', 'resume', 'career', 'projects'],
      progress: 100,
      estimatedHours: 12,
      actualHours: 14,
      type: 'personal',
      createdBy: currentUser
    },
    {
      id: 'PER-2024-004',
      title: 'Learn TypeScript Fundamentals',
      description: 'Master TypeScript basics including types, interfaces, generics, and advanced features. Practice with real-world examples and integrate into current workflow.',
      category: 'Learning',
      priority: 'medium',
      status: 'in-progress',
      assignedTo: currentUser,
      department: 'Personal Development',
      dueDate: '2024-03-01',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-29',
      tags: ['typescript', 'learning', 'programming', 'skills'],
      progress: 35,
      estimatedHours: 15,
      actualHours: 6,
      type: 'personal',
      createdBy: currentUser
    },
    {
      id: 'PER-2024-005',
      title: 'Organize Home Office Setup',
      description: 'Reorganize home office for better productivity including ergonomic setup, lighting improvements, cable management, and creating a dedicated workspace.',
      category: 'Personal',
      priority: 'low',
      status: 'pending',
      assignedTo: currentUser,
      department: 'Personal Development',
      dueDate: '2024-02-15',
      createdAt: '2024-01-28',
      updatedAt: '2024-01-30',
      tags: ['office', 'organization', 'productivity', 'workspace'],
      progress: 10,
      estimatedHours: 6,
      type: 'personal',
      createdBy: currentUser
    }
  ]);

  // Get current tasks based on active tab
  const currentTasks = activeTab === 'business' ? businessTasks : personalTasks;

  // Filter tasks based on selected filters
  const filteredTasks = useMemo(() => {
    return currentTasks.filter(task => {
      const categoryMatch = selectedCategory === 'all' || task.category === selectedCategory;
      const priorityMatch = selectedPriority === 'all' || task.priority === selectedPriority;
      const statusMatch = selectedStatus === 'all' || task.status === selectedStatus;
      const searchMatch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && priorityMatch && statusMatch && searchMatch;
    });
  }, [currentTasks, selectedCategory, selectedPriority, selectedStatus, searchTerm]);

  // Calculate statistics for current tab
  const stats = {
    total: currentTasks.length,
    completed: currentTasks.filter(t => t.status === 'completed').length,
    inProgress: currentTasks.filter(t => t.status === 'in-progress').length,
    pending: currentTasks.filter(t => t.status === 'pending').length,
    onHold: currentTasks.filter(t => t.status === 'on-hold').length,
    overdue: currentTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length
  };

  // Get unique categories for current tab
  const categories = ['all', ...Array.from(new Set(currentTasks.map(task => task.category)))];

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

  const handleAddPersonalTask = (taskData: any) => {
    const newTask: Task = {
      id: `PER-2024-${String(personalTasks.length + 1).padStart(3, '0')}`,
      title: taskData.title,
      description: taskData.description,
      category: taskData.category,
      priority: taskData.priority,
      status: 'pending',
      assignedTo: currentUser,
      department: 'Personal Development',
      dueDate: taskData.dueDate,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      tags: taskData.tags ? taskData.tags.split(',').map((tag: string) => tag.trim()) : [],
      progress: 0,
      estimatedHours: parseInt(taskData.estimatedHours) || 1,
      type: 'personal',
      createdBy: currentUser
    };

    setPersonalTasks(prev => [...prev, newTask]);
    setShowAddModal(false);
  };

  const handleUpdateTaskProgress = (taskId: string, newProgress: number) => {
    if (activeTab === 'personal') {
      setPersonalTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              progress: newProgress, 
              status: newProgress === 100 ? 'completed' : newProgress > 0 ? 'in-progress' : 'pending',
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : task
      ));
    }
  };

  const handleDeletePersonalTask = (taskId: string) => {
    if (activeTab === 'personal') {
      setPersonalTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };

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
          {activeTab === 'personal' && (
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
              <DialogTrigger asChild>
                <Button variant="default">
                  ➕ Add Personal Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Personal Task</DialogTitle>
                  <DialogDescription>
                    Add a new personal task to track your individual goals and development.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  handleAddPersonalTask({
                    title: formData.get('title'),
                    description: formData.get('description'),
                    category: formData.get('category'),
                    priority: formData.get('priority'),
                    dueDate: formData.get('dueDate'),
                    estimatedHours: formData.get('estimatedHours'),
                    tags: formData.get('tags')
                  });
                }} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="title">Task Title</Label>
                    <Input id="title" name="title" placeholder="Enter task title" required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" placeholder="Describe your task..." rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" defaultValue="Personal">
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Learning">Learning</SelectItem>
                        <SelectItem value="Career">Career</SelectItem>
                        <SelectItem value="Personal">Personal</SelectItem>
                        <SelectItem value="Health">Health</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Skills">Skills</SelectItem>
                        <SelectItem value="Projects">Projects</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select name="priority" defaultValue="medium">
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
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input id="dueDate" name="dueDate" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedHours">Estimated Hours</Label>
                    <Input id="estimatedHours" name="estimatedHours" type="number" min="1" defaultValue="1" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input id="tags" name="tags" placeholder="learning, development, skills" />
                  </div>
                  <DialogFooter className="md:col-span-2">
                    <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Create Task
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
          <Button variant="outline">
            📈 Progress Report
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <Card>
        <CardHeader className="border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="business" className="flex items-center space-x-2">
                <span>🏢</span>
                <span>Business Tasks</span>
                <Badge variant="secondary" className="ml-2">
                  {businessTasks.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="personal" className="flex items-center space-x-2">
                <span>👤</span>
                <span>Personal Tasks</span>
                <Badge variant="secondary" className="ml-2">
                  {personalTasks.length}
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
                {activeTab === 'personal' && !searchTerm && selectedCategory === 'all' && selectedPriority === 'all' && selectedStatus === 'all'
                  ? 'Create your first personal task to get started.'
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
                            {task.assignedTo}
                          </Badge>
                          {activeTab === 'personal' && (
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
                          {activeTab === 'personal' && task.status !== 'completed' && (
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
                          <Button variant="outline" size="sm">
                            👁️ View Details
                          </Button>
                          {activeTab === 'personal' && (
                            <>
                              <Button variant="outline" size="sm">
                                ✏️ Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeletePersonalTask(task.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                🗑️ Delete
                              </Button>
                            </>
                          )}
                          <Button variant="outline" size="sm">
                            💬 Comments
                          </Button>
                          <Button variant="outline" size="sm">
                            📎 Attachments
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
    </div>
  );
}