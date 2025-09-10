'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSuppliers } from '@/hooks/useSupplier';
import { 
  DashboardStatsSkeleton,
  TableSkeleton,
  ListSkeleton,
  PageHeaderSkeleton,
  CardSkeleton
} from '@/components/ui/skeletons';
import { 
  SUPPLIER_STATS, 
  SUPPLIER_CATEGORIES, 
  SUPPLIERS, 
  RECENT_ACTIVITIES, 
  QUICK_ACTIONS 
} from '@/lib/components-Data/supplier/constent';
import { 
  getStatusColor, 
  getStatusText, 
  getCategoryColor, 
  getRatingColor, 
  formatIndianCurrency, 
  formatDate, 
  getInitials,
  getActivityIconColor 
} from '@/lib/components-imp-utils/supplier';
import { SuppliersIcon, UserIcon } from '@/components/Icons';
import SupplierDialog from '@/components/suppliers/SupplierDialog';
import { Supplier } from '@/types/supplier';

export default function SuppliersPage() {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    isExporting,
    isLoading,
    handleExport
  } = useSuppliers();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>(SUPPLIERS);

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           supplier.category.toLowerCase().replace(' ', '-') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Dialog handlers
  const handleAddSupplier = () => {
    setDialogMode('add');
    setSelectedSupplier(null);
    setDialogOpen(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setDialogMode('edit');
    setSelectedSupplier(supplier);
    setDialogOpen(true);
  };

  const handleViewSupplier = (supplier: Supplier) => {
    setDialogMode('view');
    setSelectedSupplier(supplier);
    setDialogOpen(true);
  };

  const handleSaveSupplier = (supplierData: Partial<Supplier>) => {
    if (dialogMode === 'add') {
      const newSupplier: Supplier = {
        ...supplierData as Supplier,
        id: Date.now().toString(),
        totalOrders: 0,
        totalPaid: 0,
        pendingAmount: 0,
        lastOrder: new Date().toISOString().split('T')[0],
        joinDate: new Date().toISOString().split('T')[0],
        rating: 0
      };
      setSuppliers(prev => [...prev, newSupplier]);
    } else if (dialogMode === 'edit' && selectedSupplier) {
      setSuppliers(prev => prev.map(supplier => 
        supplier.id === selectedSupplier.id 
          ? { ...supplier, ...supplierData }
          : supplier
      ));
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        {/* Header Skeleton */}
        <PageHeaderSkeleton />
        
        {/* Stats Skeleton */}
        <DashboardStatsSkeleton />
        
        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <ListSkeleton items={6} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <ListSkeleton items={4} />
              </CardContent>
            </Card>
          </div>
          
          {/* Table Skeleton */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Supplier List</CardTitle>
              </CardHeader>
              <CardContent>
                <TableSkeleton rows={8} columns={9} />
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Quick Actions Skeleton */}
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <SuppliersIcon size={28} className="mr-3" />
            Supplier Management
          </h1>
          <p className="text-gray-600 mt-1">Manage your supplier relationships and procurement</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button 
            variant="outline"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                Exporting...
              </div>
            ) : (
              'Export Data'
            )}
          </Button>
          <Button onClick={handleAddSupplier}>
            Add New Supplier
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SUPPLIER_STATS.map((stat) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-50 rounded-lg mr-3">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Supplier Categories Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {SUPPLIER_CATEGORIES.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{category.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {RECENT_ACTIVITIES.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start space-x-3"
                  >
                    <div className={getActivityIconColor(activity.type)}>
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span>{activity.supplier}</span>
                        <span className="mx-1">•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Supplier Table/Cards */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Supplier List</CardTitle>
              <div className="flex space-x-3">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search suppliers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-[250px] pl-10"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="name" value="name">Name</SelectItem>
                    <SelectItem key="totalPaid" value="totalPaid">Total Paid</SelectItem>
                    <SelectItem key="totalOrders" value="totalOrders">Orders</SelectItem>
                    <SelectItem key="rating" value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>
                <Tabs value={viewMode} onValueChange={setViewMode} className="w-auto">
                  <TabsList>
                    <TabsTrigger value="table">Table</TabsTrigger>
                    <TabsTrigger value="cards">Cards</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {viewMode === 'table' ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Number</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Capacity</TableHead>
                            <TableHead>Active Hours</TableHead>
                            <TableHead>Market</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredSuppliers.map((supplier) => (
                            <TableRow key={supplier.id} className="hover:bg-gray-50">
                              <TableCell>
                                <div className="flex items-center">
                                  <div className="h-10 w-10 bg-indigo-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-sm font-medium">
                                      {getInitials(supplier.name)}
                                    </span>
                                  </div>
                                  <div className="font-medium">{supplier.name}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="font-medium text-blue-600">{supplier.number}</span>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm text-gray-900">{supplier.email}</div>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">{supplier.company}</div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm text-gray-900">{supplier.location}</div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm font-medium text-green-600">{supplier.capacity}</div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm text-gray-900">{supplier.activeHours}</div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-purple-700 border-purple-200 bg-purple-50">
                                  {supplier.market}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleViewSupplier(supplier)}
                                  >
                                    View
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleEditSupplier(supplier)}
                                  >
                                    Edit
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredSuppliers.map((supplier) => (
                        <motion.div
                          key={supplier.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <div className="h-12 w-12 bg-indigo-500 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white text-sm font-medium">
                                  {getInitials(supplier.name)}
                                </span>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium">{supplier.name}</h3>
                                <p className="text-xs text-blue-600 font-medium">{supplier.number}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-purple-700 border-purple-200 bg-purple-50">
                              {supplier.market}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Email:</span>
                              <span className="font-medium text-gray-900">{supplier.email}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Company:</span>
                              <span className="font-medium">{supplier.company}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Location:</span>
                              <span className="font-medium">{supplier.location}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Capacity:</span>
                              <span className="font-medium text-green-600">{supplier.capacity}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Active Hours:</span>
                              <span className="font-medium">{supplier.activeHours}</span>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleViewSupplier(supplier)}
                            >
                              View Details
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleEditSupplier(supplier)}
                            >
                              Edit
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common supplier management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {QUICK_ACTIONS.map((action) => (
              <motion.button
                key={action.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className={`p-2 rounded-lg mb-2 bg-${action.color}-50 group-hover:bg-${action.color}-100 transition-colors`}>
                  {action.icon}
                </div>
                <span className="text-sm text-gray-700 text-center">{action.name}</span>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Supplier Dialog */}
      <SupplierDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveSupplier}
        supplier={selectedSupplier}
        mode={dialogMode}
      />
    </div>
  );
}