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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ReportsIcon, ChartIcon, AIInsightsIcon, OrderIcon, CustomersIcon, SalesIcon } from '@/components/Icons';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

// Define colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

interface ReportData {
  id: string;
  title: string;
  description: string;
  department: string;
  type: 'financial' | 'sales' | 'operational' | 'hr' | 'marketing' | 'inventory' | 'customer' | 'performance';
  period: string;
  generatedBy: string;
  generatedAt: string;
  status: 'draft' | 'completed' | 'scheduled' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  format: 'pdf' | 'excel' | 'csv' | 'powerpoint';
  recipients: string[];
  metrics: {
    revenue?: number;
    growth?: number;
    efficiency?: number;
    satisfaction?: number;
  };
  tags: string[];
}

interface DepartmentMetrics {
  department: string;
  totalReports: number;
  completedReports: number;
  pendingReports: number;
  avgCompletionTime: number;
  lastGenerated: string;
  keyMetrics: {
    revenue?: number;
    growth?: string;
    efficiency?: string;
    satisfaction?: string;
  };
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  // Sample comprehensive reports data
  const [reports] = useState<ReportData[]>([
    {
      id: 'RPT-2024-001',
      title: 'Q1 Financial Performance Analysis',
      description: 'Comprehensive quarterly financial analysis including revenue breakdown, profit margins, expense analysis, cash flow statements, and budget variance reports with detailed insights into departmental spending patterns.',
      department: 'Finance',
      type: 'financial',
      period: 'Q1 2024',
      generatedBy: 'David Kumar',
      generatedAt: '2024-01-28',
      status: 'completed',
      priority: 'high',
      format: 'pdf',
      recipients: ['CEO', 'CFO', 'Board Members', 'Department Heads'],
      metrics: {
        revenue: 2840000,
        growth: 12.5,
        efficiency: 87.3,
        satisfaction: 4.2
      },
      tags: ['quarterly', 'financial', 'analysis', 'budget', 'variance']
    },
    {
      id: 'RPT-2024-002',
      title: 'Sales Performance Dashboard - January',
      description: 'Monthly sales performance report covering lead generation, conversion rates, pipeline analysis, territory performance, customer acquisition costs, and revenue forecasting with competitive analysis.',
      department: 'Sales',
      type: 'sales',
      period: 'January 2024',
      generatedBy: 'Sarah Johnson',
      generatedAt: '2024-01-30',
      status: 'completed',
      priority: 'high',
      format: 'excel',
      recipients: ['Sales Team', 'VP Sales', 'Marketing Team', 'CEO'],
      metrics: {
        revenue: 1250000,
        growth: 18.7,
        efficiency: 92.1,
        satisfaction: 4.5
      },
      tags: ['monthly', 'sales', 'performance', 'pipeline', 'conversion']
    },
    {
      id: 'RPT-2024-003',
      title: 'Employee Engagement & Performance Review',
      description: 'Comprehensive HR analytics report including employee satisfaction surveys, performance ratings, retention analysis, training effectiveness, compensation benchmarking, and workforce diversity metrics.',
      department: 'Human Resources',
      type: 'hr',
      period: 'Q1 2024',
      generatedBy: 'Emily Rodriguez',
      generatedAt: '2024-01-25',
      status: 'completed',
      priority: 'medium',
      format: 'powerpoint',
      recipients: ['HR Team', 'Department Managers', 'CEO', 'Executive Team'],
      metrics: {
        satisfaction: 4.1,
        efficiency: 78.9,
        growth: 8.3
      },
      tags: ['quarterly', 'hr', 'engagement', 'performance', 'retention']
    },
    {
      id: 'RPT-2024-004',
      title: 'Marketing Campaign ROI Analysis',
      description: 'Detailed analysis of marketing campaign performance across all channels including digital marketing ROI, brand awareness metrics, lead quality assessment, customer journey analysis, and attribution modeling.',
      department: 'Marketing',
      type: 'marketing',
      period: 'January 2024',
      generatedBy: 'Michael Chen',
      generatedAt: '2024-01-29',
      status: 'completed',
      priority: 'high',
      format: 'pdf',
      recipients: ['Marketing Team', 'VP Marketing', 'Sales Team', 'CEO'],
      metrics: {
        revenue: 890000,
        growth: 24.1,
        efficiency: 85.7,
        satisfaction: 4.3
      },
      tags: ['monthly', 'marketing', 'roi', 'campaigns', 'digital']
    },
    {
      id: 'RPT-2024-005',
      title: 'Inventory Management & Supply Chain Report',
      description: 'Comprehensive inventory analysis including stock levels, turnover rates, supplier performance, demand forecasting, cost optimization opportunities, and supply chain risk assessment.',
      department: 'Operations',
      type: 'inventory',
      period: 'January 2024',
      generatedBy: 'Robert Wilson',
      generatedAt: '2024-01-27',
      status: 'completed',
      priority: 'medium',
      format: 'excel',
      recipients: ['Operations Team', 'Procurement', 'Finance', 'CEO'],
      metrics: {
        efficiency: 91.4,
        growth: 6.8,
        satisfaction: 4.0
      },
      tags: ['monthly', 'inventory', 'supply-chain', 'optimization', 'forecasting']
    },
    {
      id: 'RPT-2024-006',
      title: 'Customer Satisfaction & Experience Analysis',
      description: 'In-depth customer experience report including satisfaction scores, Net Promoter Score analysis, customer journey mapping, support ticket analysis, and retention strategy recommendations.',
      department: 'Customer Success',
      type: 'customer',
      period: 'Q1 2024',
      generatedBy: 'Lisa Thompson',
      generatedAt: '2024-01-26',
      status: 'draft',
      priority: 'high',
      format: 'pdf',
      recipients: ['Customer Success Team', 'Sales Team', 'Product Team', 'CEO'],
      metrics: {
        satisfaction: 4.4,
        efficiency: 88.2,
        growth: 15.6
      },
      tags: ['quarterly', 'customer', 'satisfaction', 'nps', 'experience']
    },
    {
      id: 'RPT-2024-007',
      title: 'IT Infrastructure Performance Report',
      description: 'Technical performance analysis covering system uptime, security metrics, infrastructure costs, technology adoption rates, and digital transformation progress with future recommendations.',
      department: 'IT',
      type: 'operational',
      period: 'January 2024',
      generatedBy: 'Alex Park',
      generatedAt: '2024-01-24',
      status: 'scheduled',
      priority: 'medium',
      format: 'powerpoint',
      recipients: ['IT Team', 'CTO', 'Department Heads', 'CEO'],
      metrics: {
        efficiency: 96.7,
        satisfaction: 4.1,
        growth: 11.2
      },
      tags: ['monthly', 'it', 'infrastructure', 'performance', 'security']
    },
    {
      id: 'RPT-2024-008',
      title: 'Executive Dashboard - Business Intelligence',
      description: 'High-level executive summary combining key metrics from all departments, strategic KPI tracking, competitive analysis, market trends, and actionable insights for strategic decision making.',
      department: 'Executive',
      type: 'performance',
      period: 'January 2024',
      generatedBy: 'Jennifer Lee',
      generatedAt: '2024-01-31',
      status: 'completed',
      priority: 'urgent',
      format: 'pdf',
      recipients: ['CEO', 'Executive Team', 'Board Members'],
      metrics: {
        revenue: 2840000,
        growth: 16.3,
        efficiency: 89.5,
        satisfaction: 4.3
      },
      tags: ['monthly', 'executive', 'kpi', 'strategic', 'intelligence']
    }
  ]);

  // Department metrics data
  const [departmentMetrics] = useState<DepartmentMetrics[]>([
    {
      department: 'Finance',
      totalReports: 12,
      completedReports: 10,
      pendingReports: 2,
      avgCompletionTime: 3.2,
      lastGenerated: '2024-01-28',
      keyMetrics: {
        revenue: 2840000,
        growth: '+12.5%',
        efficiency: '87.3%',
        satisfaction: '4.2/5'
      }
    },
    {
      department: 'Sales',
      totalReports: 18,
      completedReports: 16,
      pendingReports: 2,
      avgCompletionTime: 2.1,
      lastGenerated: '2024-01-30',
      keyMetrics: {
        revenue: 1250000,
        growth: '+18.7%',
        efficiency: '92.1%',
        satisfaction: '4.5/5'
      }
    },
    {
      department: 'Marketing',
      totalReports: 15,
      completedReports: 13,
      pendingReports: 2,
      avgCompletionTime: 2.8,
      lastGenerated: '2024-01-29',
      keyMetrics: {
        revenue: 890000,
        growth: '+24.1%',
        efficiency: '85.7%',
        satisfaction: '4.3/5'
      }
    },
    {
      department: 'Human Resources',
      totalReports: 8,
      completedReports: 7,
      pendingReports: 1,
      avgCompletionTime: 4.5,
      lastGenerated: '2024-01-25',
      keyMetrics: {
        growth: '+8.3%',
        efficiency: '78.9%',
        satisfaction: '4.1/5'
      }
    },
    {
      department: 'Operations',
      totalReports: 14,
      completedReports: 12,
      pendingReports: 2,
      avgCompletionTime: 3.7,
      lastGenerated: '2024-01-27',
      keyMetrics: {
        growth: '+6.8%',
        efficiency: '91.4%',
        satisfaction: '4.0/5'
      }
    },
    {
      department: 'IT',
      totalReports: 10,
      completedReports: 8,
      pendingReports: 2,
      avgCompletionTime: 3.1,
      lastGenerated: '2024-01-24',
      keyMetrics: {
        growth: '+11.2%',
        efficiency: '96.7%',
        satisfaction: '4.1/5'
      }
    }
  ]);

  // Filter reports based on selected filters
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const departmentMatch = selectedDepartment === 'all' || report.department === selectedDepartment;
      const typeMatch = selectedType === 'all' || report.type === selectedType;
      const searchMatch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.generatedBy.toLowerCase().includes(searchTerm.toLowerCase());
      return departmentMatch && typeMatch && searchMatch;
    });
  }, [reports, selectedDepartment, selectedType, searchTerm]);

  // Calculate statistics
  const stats = {
    total: reports.length,
    completed: reports.filter(r => r.status === 'completed').length,
    draft: reports.filter(r => r.status === 'draft').length,
    scheduled: reports.filter(r => r.status === 'scheduled').length,
    avgCompletionTime: 3.2
  };

  // Generate sample chart data
  const revenueData = [
    { month: 'Jan', Finance: 2840000, Sales: 1250000, Marketing: 890000, Operations: 650000 },
    { month: 'Feb', Finance: 3100000, Sales: 1380000, Marketing: 920000, Operations: 720000 },
    { month: 'Mar', Finance: 2950000, Sales: 1420000, Marketing: 1100000, Operations: 680000 },
    { month: 'Apr', Finance: 3200000, Sales: 1550000, Marketing: 1050000, Operations: 750000 },
    { month: 'May', Finance: 3350000, Sales: 1680000, Marketing: 1200000, Operations: 800000 },
    { month: 'Jun', Finance: 3180000, Sales: 1590000, Marketing: 1150000, Operations: 770000 }
  ];

  const departmentDistribution = departmentMetrics.map(dept => ({
    name: dept.department,
    value: dept.totalReports,
    completed: dept.completedReports,
    pending: dept.pendingReports
  }));

  const performanceData = [
    { department: 'Sales', efficiency: 92.1, satisfaction: 4.5, growth: 18.7 },
    { department: 'Marketing', efficiency: 85.7, satisfaction: 4.3, growth: 24.1 },
    { department: 'Finance', efficiency: 87.3, satisfaction: 4.2, growth: 12.5 },
    { department: 'IT', efficiency: 96.7, satisfaction: 4.1, growth: 11.2 },
    { department: 'Operations', efficiency: 91.4, satisfaction: 4.0, growth: 6.8 },
    { department: 'HR', efficiency: 78.9, satisfaction: 4.1, growth: 8.3 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'financial': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sales': return 'bg-green-100 text-green-800 border-green-200';
      case 'marketing': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'hr': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'operational': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'inventory': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'customer': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'performance': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowGenerateModal(false);
    }, 3000);
  };

  const TABS = [
    { id: 'overview', name: 'Overview', icon: <ChartIcon size={16} /> },
    { id: 'reports', name: 'Reports', icon: <ReportsIcon size={16} /> },
    { id: 'analytics', name: 'Analytics', icon: <AIInsightsIcon size={16} /> },
    { id: 'departments', name: 'Departments', icon: <CustomersIcon size={16} /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Department Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Department Performance Overview</CardTitle>
                <CardDescription>Key metrics and performance indicators across all departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'growth' ? `${value}%` : name === 'satisfaction' ? `${value}/5` : `${value}%`,
                          name === 'efficiency' ? 'Efficiency' : name === 'satisfaction' ? 'Satisfaction' : 'Growth'
                        ]}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="efficiency" fill="#8884d8" name="Efficiency %" />
                      <Bar yAxisId="right" dataKey="satisfaction" fill="#82ca9d" name="Satisfaction" />
                      <Bar yAxisId="left" dataKey="growth" fill="#ffc658" name="Growth %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends by Department</CardTitle>
                <CardDescription>Monthly revenue performance across key departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `₹${value/1000000}M`} />
                      <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                      <Legend />
                      <Area type="monotone" dataKey="Finance" stackId="1" stroke="#8884d8" fill="#8884d8" />
                      <Area type="monotone" dataKey="Sales" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                      <Area type="monotone" dataKey="Marketing" stackId="1" stroke="#ffc658" fill="#ffc658" />
                      <Area type="monotone" dataKey="Operations" stackId="1" stroke="#ff7300" fill="#ff7300" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'reports':
        return (
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                  <CardTitle>Generated Reports</CardTitle>
                  <CardDescription>Manage and track all business reports</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search reports..."
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
                  <Select value={selectedDepartment} onValueChange={(value) => setSelectedDepartment(value)}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="all" value="all">All Departments</SelectItem>
                      <SelectItem key="Finance" value="Finance">Finance</SelectItem>
                      <SelectItem key="Sales" value="Sales">Sales</SelectItem>
                      <SelectItem key="Marketing" value="Marketing">Marketing</SelectItem>
                      <SelectItem key="Human Resources" value="Human Resources">HR</SelectItem>
                      <SelectItem key="Operations" value="Operations">Operations</SelectItem>
                      <SelectItem key="IT" value="IT">IT</SelectItem>
                      <SelectItem key="Executive" value="Executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedType} onValueChange={(value) => setSelectedType(value)}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="all" value="all">All Types</SelectItem>
                      <SelectItem key="financial" value="financial">Financial</SelectItem>
                      <SelectItem key="sales" value="sales">Sales</SelectItem>
                      <SelectItem key="marketing" value="marketing">Marketing</SelectItem>
                      <SelectItem key="hr" value="hr">HR</SelectItem>
                      <SelectItem key="operational" value="operational">Operational</SelectItem>
                      <SelectItem key="inventory" value="inventory">Inventory</SelectItem>
                      <SelectItem key="customer" value="customer">Customer</SelectItem>
                      <SelectItem key="performance" value="performance">Performance</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog open={showGenerateModal} onOpenChange={setShowGenerateModal}>
                    <DialogTrigger asChild>
                      <Button variant="default" className="whitespace-nowrap">
                        Generate Report
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Generate New Report</DialogTitle>
                        <DialogDescription>
                          Configure your report settings and generate comprehensive business insights.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="reportTitle">Report Title</Label>
                          <Input id="reportTitle" placeholder="Enter report title" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reportDepartment">Department</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="sales">Sales</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                              <SelectItem value="hr">Human Resources</SelectItem>
                              <SelectItem value="operations">Operations</SelectItem>
                              <SelectItem value="it">IT</SelectItem>
                              <SelectItem value="executive">Executive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reportType">Report Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="financial">Financial</SelectItem>
                              <SelectItem value="sales">Sales</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                              <SelectItem value="hr">HR</SelectItem>
                              <SelectItem value="operational">Operational</SelectItem>
                              <SelectItem value="inventory">Inventory</SelectItem>
                              <SelectItem value="customer">Customer</SelectItem>
                              <SelectItem value="performance">Performance</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reportPeriod">Period</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select period" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                              <SelectItem value="yearly">Yearly</SelectItem>
                              <SelectItem value="custom">Custom Range</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reportFormat">Format</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pdf">PDF</SelectItem>
                              <SelectItem value="excel">Excel</SelectItem>
                              <SelectItem value="csv">CSV</SelectItem>
                              <SelectItem value="powerpoint">PowerPoint</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reportPriority">Priority</Label>
                          <Select>
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
                          <Label htmlFor="reportDescription">Description</Label>
                          <Textarea 
                            id="reportDescription" 
                            placeholder="Describe what this report should include..."
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="reportRecipients">Recipients (comma-separated)</Label>
                          <Input 
                            id="reportRecipients" 
                            placeholder="john@company.com, jane@company.com"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowGenerateModal(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleGenerateReport} disabled={isGenerating}>
                          {isGenerating ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Generating...
                            </div>
                          ) : (
                            'Generate Report'
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredReports.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <ReportsIcon size={32} className="text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No reports found</h3>
                  <p className="text-sm text-gray-500">
                    {searchTerm || selectedDepartment !== 'all' || selectedType !== 'all'
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Generate your first report to get started.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReports.map((report, index) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                            <Badge className={getStatusColor(report.status)}>
                              {report.status.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge className={getTypeColor(report.type)}>
                              {report.type.toUpperCase()}
                            </Badge>
                            <Badge className={getPriorityColor(report.priority)}>
                              {report.priority.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {report.department}
                            </Badge>
                            <Badge variant="outline">
                              {report.format.toUpperCase()}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                            <div>
                              <span className="font-medium">Period:</span>
                              <p>{report.period}</p>
                            </div>
                            <div>
                              <span className="font-medium">Generated By:</span>
                              <p>{report.generatedBy}</p>
                            </div>
                            <div>
                              <span className="font-medium">Generated At:</span>
                              <p>{new Date(report.generatedAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <span className="font-medium">Recipients:</span>
                              <p>{report.recipients.length} people</p>
                            </div>
                          </div>

                          {report.metrics && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              {report.metrics.revenue && (
                                <div className="bg-blue-50 p-3 rounded-lg text-center">
                                  <div className="text-lg font-bold text-blue-600">
                                    {formatCurrency(report.metrics.revenue)}
                                  </div>
                                  <div className="text-xs text-gray-600">Revenue</div>
                                </div>
                              )}
                              {report.metrics.growth && (
                                <div className="bg-green-50 p-3 rounded-lg text-center">
                                  <div className="text-lg font-bold text-green-600">
                                    +{report.metrics.growth}%
                                  </div>
                                  <div className="text-xs text-gray-600">Growth</div>
                                </div>
                              )}
                              {report.metrics.efficiency && (
                                <div className="bg-purple-50 p-3 rounded-lg text-center">
                                  <div className="text-lg font-bold text-purple-600">
                                    {report.metrics.efficiency}%
                                  </div>
                                  <div className="text-xs text-gray-600">Efficiency</div>
                                </div>
                              )}
                              {report.metrics.satisfaction && (
                                <div className="bg-orange-50 p-3 rounded-lg text-center">
                                  <div className="text-lg font-bold text-orange-600">
                                    {report.metrics.satisfaction}/5
                                  </div>
                                  <div className="text-xs text-gray-600">Satisfaction</div>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-1 mb-4">
                            {report.tags.map((tag) => (
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
                              📄 View Report
                            </Button>
                            <Button variant="outline" size="sm">
                              📧 Share
                            </Button>
                            <Button variant="outline" size="sm">
                              📊 Analytics
                            </Button>
                            <Button variant="outline" size="sm">
                              ⬇️ Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Reports Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Reports Distribution by Department</CardTitle>
                  <CardDescription>Total reports generated across departments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={departmentDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {departmentDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Completion Rates */}
              <Card>
                <CardHeader>
                  <CardTitle>Report Completion Rates</CardTitle>
                  <CardDescription>Completed vs pending reports by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={departmentDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
                        <Bar dataKey="pending" fill="#ffc658" name="Pending" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Performance Indicators */}
            <Card>
              <CardHeader>
                <CardTitle>Report Generation KPIs</CardTitle>
                <CardDescription>Key metrics for report generation and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.avgCompletionTime}</div>
                    <div className="text-sm text-gray-600">Avg Completion Time (days)</div>
                    <div className="text-xs text-green-600 mt-1">-0.5 days vs last month</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">94%</div>
                    <div className="text-sm text-gray-600">On-Time Delivery Rate</div>
                    <div className="text-xs text-green-600 mt-1">+2% vs last month</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">4.3</div>
                    <div className="text-sm text-gray-600">Report Quality Score</div>
                    <div className="text-xs text-green-600 mt-1">+0.2 vs last month</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">87%</div>
                    <div className="text-sm text-gray-600">Stakeholder Satisfaction</div>
                    <div className="text-xs text-green-600 mt-1">+3% vs last month</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'departments':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {departmentMetrics.map((dept, index) => (
                <motion.div
                  key={dept.department}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{dept.department}</span>
                        <Badge variant="outline">
                          {dept.totalReports} reports
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-500">Completion Rate</span>
                            <span className="font-medium">
                              {((dept.completedReports / dept.totalReports) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <Progress 
                            value={(dept.completedReports / dept.totalReports) * 100} 
                            className="w-full" 
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{dept.completedReports} completed</span>
                            <span>{dept.pendingReports} pending</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Avg Time:</span>
                            <div className="font-medium">{dept.avgCompletionTime} days</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Last Report:</span>
                            <div className="font-medium">
                              {new Date(dept.lastGenerated).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Key Metrics</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {dept.keyMetrics.revenue && (
                              <div className="bg-blue-50 p-2 rounded">
                                <div className="font-medium text-blue-600">
                                  {formatCurrency(dept.keyMetrics.revenue)}
                                </div>
                                <div className="text-gray-600">Revenue</div>
                              </div>
                            )}
                            {dept.keyMetrics.growth && (
                              <div className="bg-green-50 p-2 rounded">
                                <div className="font-medium text-green-600">
                                  {dept.keyMetrics.growth}
                                </div>
                                <div className="text-gray-600">Growth</div>
                              </div>
                            )}
                            {dept.keyMetrics.efficiency && (
                              <div className="bg-purple-50 p-2 rounded">
                                <div className="font-medium text-purple-600">
                                  {dept.keyMetrics.efficiency}
                                </div>
                                <div className="text-gray-600">Efficiency</div>
                              </div>
                            )}
                            {dept.keyMetrics.satisfaction && (
                              <div className="bg-orange-50 p-2 rounded">
                                <div className="font-medium text-orange-600">
                                  {dept.keyMetrics.satisfaction}
                                </div>
                                <div className="text-gray-600">Satisfaction</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>This section is under development</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <ReportsIcon size={32} className="text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Feature in Progress</h3>
                <p className="text-sm text-gray-500">This tab is currently being developed and will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <ReportsIcon size={28} className="mr-3" />
            Business Reports & Analytics
          </h1>
          <p className="text-gray-600 mt-1">Generate comprehensive reports and analyze business performance across all departments</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="7days" value="7days">Last 7 Days</SelectItem>
              <SelectItem key="30days" value="30days">Last 30 Days</SelectItem>
              <SelectItem key="90days" value="90days">Last 90 Days</SelectItem>
              <SelectItem key="1year" value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline"
            onClick={() => setShowGenerateModal(true)}
            className="flex-1 sm:flex-none"
          >
            📊 Generate Report
          </Button>
          <Button 
            variant="default" 
            className="flex-1 sm:flex-none"
          >
            📈 Analytics Dashboard
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="h-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-50 rounded-lg mr-3">
                    <ReportsIcon size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Reports</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{stats.total}</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-green-600">
                  +15%
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="h-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-50 rounded-lg mr-3">
                    <ChartIcon size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-xl font-bold text-green-600 mt-1">{stats.completed}</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-green-600">
                  +8%
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="h-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-50 rounded-lg mr-3">
                    <AIInsightsIcon size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-xl font-bold text-yellow-600 mt-1">{stats.draft + stats.scheduled}</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-yellow-600">
                  +3%
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="h-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-50 rounded-lg mr-3">
                    <CustomersIcon size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Time</p>
                    <p className="text-xl font-bold text-purple-600 mt-1">{stats.avgCompletionTime}d</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-green-600">
                  -0.5d
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content with Tabs */}
      <Card>
        <CardHeader className="border-b p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full overflow-x-auto flex justify-start">
              {TABS.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id} 
                  className="flex items-center space-x-2 whitespace-nowrap"
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}