'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  FileText, Plus, Search, Download, Send, RefreshCw, Building2, Clock, 
  AlertTriangle, Eye, CreditCard, ArrowUpDown, ArrowUp, ArrowDown, 
  CalendarDays, Receipt, DollarSign, TrendingUp
} from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';
import { useAccountsReceivable } from '@/hooks/useAccountsReceivable';
import { CreateInvoiceDialog } from '@/components/finance/accounts-receivable/dialogs/CreateInvoiceDialog';
import { PaymentRecordDialog } from '@/components/finance/accounts-receivable/dialogs/PaymentRecordDialog';
import { BulkReminderDialog } from '@/components/finance/accounts-receivable/dialogs/BulkReminderDialog';
import { InvoiceDetailsDialog } from '@/components/finance/accounts-receivable/dialogs/InvoiceDetailsDialog';
import { FollowUpDialog } from '@/components/finance/accounts-receivable/dialogs/FollowUpDialog';
import { InvoiceCard } from '@/components/finance/accounts-receivable/InvoiceCard';
import { OverdueCard } from '@/components/finance/accounts-receivable/OverdueCard';
import { CustomerSummaryCard } from '@/components/finance/accounts-receivable/CustomerSummaryCard';

const AccountsReceivablePage = () => {
  const {
    invoices, overdueInvoices, customers, summary, loading, filters, isProcessing,
    updateFilters, createInvoice, recordPayment, sendReminder, bulkReminder,
    followUp, exportData, refreshData
  } = useAccountsReceivable();

  const [activeTab, setActiveTab] = useState('invoices');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState({ key: 'dueDate', direction: 'asc' });
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
  const [dialogs, setDialogs] = useState({
    createInvoice: false, recordPayment: false, bulkReminder: false,
    invoiceDetails: false, followUp: false
  });
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const statsData = useMemo(() => [
    {
      name: 'Total Outstanding',
      value: `₹${(summary.totalOutstanding / 100000).toFixed(1)}L`,
      change: '+6.2%', changeType: 'negative' as const,
      icon: <DollarSign size={20} />, target: `₹${((summary.totalOutstanding * 0.8) / 100000).toFixed(1)}L`, progress: 80
    },
    {
      name: 'Due This Week',
      value: `₹${(summary.dueThisWeek / 100000).toFixed(1)}L`,
      change: '+4.8%', changeType: 'negative' as const,
      icon: <Clock size={20} />, target: `₹${((summary.dueThisWeek * 0.6) / 100000).toFixed(1)}L`, progress: 60
    },
    {
      name: 'Overdue Amount',
      value: `₹${(summary.overdueAmount / 100000).toFixed(1)}L`,
      change: '-8.1%', changeType: 'positive' as const,
      icon: <AlertTriangle size={20} />, target: `₹${((summary.overdueAmount * 0.4) / 100000).toFixed(1)}L`, progress: 40
    },
    {
      name: 'Active Customers',
      value: summary.activeCustomers.toString(),
      change: '+5 customers', changeType: 'positive' as const,
      icon: <Building2 size={20} />, target: `${Math.round(summary.activeCustomers * 1.1)}`, progress: 91
    }
  ], [summary]);

  const filteredInvoices = useMemo(() => {
    let filtered = invoices.filter(invoice => {
      const matchesSearch = !filters.search || 
        invoice.invoiceNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        invoice.customerName.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = !filters.status || filters.status === 'all' || invoice.status === filters.status;
      const matchesCustomer = !filters.customer || filters.customer === 'all' || invoice.customerId === filters.customer;
      return matchesSearch && matchesStatus && matchesCustomer;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof typeof a];
      const bValue = b[sortConfig.key as keyof typeof b];
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return filtered;
  }, [invoices, filters, sortConfig]);

  const handleSort = useCallback((key: string) => {
    setSortConfig(prev => ({
      key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handleSelectInvoice = useCallback((invoiceId: string, selected: boolean) => {
    setSelectedInvoices(prev => 
      selected ? [...prev, invoiceId] : prev.filter(id => id !== invoiceId)
    );
  }, []);

  const handleSelectAll = useCallback((selected: boolean) => {
    setSelectedInvoices(selected ? filteredInvoices.map(inv => inv.id) : []);
  }, [filteredInvoices]);

  const handlers = {
    createInvoice: async (data: any) => {
      try {
        await createInvoice(data);
        setDialogs(prev => ({ ...prev, createInvoice: false }));
      } catch (error) { console.error('Error creating invoice:', error); }
    },
    recordPayment: async (invoiceId: string, data: any) => {
      try {
        await recordPayment(invoiceId, data);
        setDialogs(prev => ({ ...prev, recordPayment: false }));
        setSelectedInvoice(null);
      } catch (error) { console.error('Error recording payment:', error); }
    },
    bulkReminder: async (invoiceIds: string[], data: any) => {
      try {
        await bulkReminder(invoiceIds, data);
        setDialogs(prev => ({ ...prev, bulkReminder: false }));
        setSelectedInvoices([]);
      } catch (error) { console.error('Error sending reminders:', error); }
    },
    followUp: async (invoiceId: string, data: any) => {
      try {
        await followUp(invoiceId, data);
        setDialogs(prev => ({ ...prev, followUp: false }));
        setSelectedInvoice(null);
      } catch (error) { console.error('Error creating follow-up:', error); }
    }
  };

  const renderSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={14} className="ml-1" />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-50 border-green-200';
      case 'overdue': return 'text-red-600 bg-red-50 border-red-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'sent': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'draft': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0
  }).format(amount);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded"></div>)}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Receipt size={28} className="mr-3 text-blue-600" />
            Accounts Receivable
          </h1>
          <p className="text-gray-600 mt-1">Manage customer invoices, track payments, and follow up on outstanding amounts</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          {selectedInvoices.length > 0 && (
            <Button variant="outline" onClick={() => setDialogs(prev => ({ ...prev, bulkReminder: true }))} disabled={isProcessing}>
              <Send size={16} className="mr-2" />Send Reminders ({selectedInvoices.length})
            </Button>
          )}
          <Button variant="outline" onClick={exportData} disabled={isProcessing}>
            <Download size={16} className="mr-2" />Export
          </Button>
          <Button variant="outline" onClick={refreshData} disabled={isProcessing}>
            <RefreshCw size={16} className="mr-2" />Refresh
          </Button>
          <Button onClick={() => setDialogs(prev => ({ ...prev, createInvoice: true }))}>
            <Plus size={16} className="mr-2" />New Invoice
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <motion.div key={stat.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-50 rounded-lg mr-3">
                      <div className="text-blue-600">{stat.icon}</div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.change}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Target: {stat.target}</span>
                    <span>{stat.progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={stat.progress} className="w-full" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full overflow-x-auto flex justify-start">
              <TabsTrigger value="invoices" className="flex items-center space-x-2">
                <FileText size={16} className="text-blue-600" />
                <span>All Invoices ({invoices.length})</span>
              </TabsTrigger>
              <TabsTrigger value="overdue" className="flex items-center space-x-2">
                <AlertTriangle size={16} className="text-red-600" />
                <span>Overdue ({overdueInvoices.length})</span>
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center space-x-2">
                <Clock size={16} className="text-orange-600" />
                <span>Pending ({invoices.filter(i => i.status === 'pending').length})</span>
              </TabsTrigger>
              <TabsTrigger value="customers" className="flex items-center space-x-2">
                <Building2 size={16} className="text-green-600" />
                <span>Customers ({customers.length})</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input placeholder="Search invoices, customers..." value={filters.search} onChange={(e) => updateFilters({ search: e.target.value })} className="pl-10" />
                </div>
                
                <Select value={filters.status || 'all'} onValueChange={(value) => updateFilters({ status: value === 'all' ? undefined : value })}>
                  <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    {['all', 'draft', 'sent', 'pending', 'paid', 'overdue', 'cancelled'].map(status => (
                      <SelectItem key={status} value={status}>{status === 'all' ? 'All Status' : status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.customer || 'all'} onValueChange={(value) => updateFilters({ customer: value === 'all' ? undefined : value })}>
                  <SelectTrigger className="w-[140px]"><SelectValue placeholder="Customer" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button variant={viewMode === 'table' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('table')}>Table</Button>
                  <Button variant={viewMode === 'card' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('card')}>Cards</Button>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'invoices' && (
                <div className="space-y-4">
                  {selectedInvoices.length > 0 && (
                    <Card className="border-blue-200 bg-blue-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-blue-800">{selectedInvoices.length} invoice(s) selected</p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setDialogs(prev => ({ ...prev, bulkReminder: true }))} disabled={isProcessing}>
                              <Send size={16} className="mr-2" />Send Reminders
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setSelectedInvoices([])}>Clear Selection</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {viewMode === 'table' ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">
                              <Checkbox checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0} onCheckedChange={handleSelectAll} />
                            </TableHead>
                            <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort('invoiceNumber')}>
                              <div className="flex items-center">Invoice Number{renderSortIcon('invoiceNumber')}</div>
                            </TableHead>
                            <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort('customerName')}>
                              <div className="flex items-center">Customer{renderSortIcon('customerName')}</div>
                            </TableHead>
                            <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort('amount')}>
                              <div className="flex items-center">Amount{renderSortIcon('amount')}</div>
                            </TableHead>
                            <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort('dueDate')}>
                              <div className="flex items-center">Due Date{renderSortIcon('dueDate')}</div>
                            </TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredInvoices.map((invoice) => {
                            const daysUntilDue = getDaysUntilDue(invoice.dueDate);
                            return (
                              <TableRow key={invoice.id} className="hover:bg-gray-50">
                                <TableCell>
                                  <Checkbox checked={selectedInvoices.includes(invoice.id)} onCheckedChange={(checked) => handleSelectInvoice(invoice.id, checked as boolean)} />
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{invoice.invoiceNumber}</div>
                                    <div className="text-sm text-gray-500">{formatDate(invoice.invoiceDate)}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">{invoice.customerName}</div>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">{formatCurrency(invoice.amount)}</div>
                                  {invoice.paidAmount > 0 && (
                                    <div className="text-sm text-green-600">Paid: {formatCurrency(invoice.paidAmount)}</div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{formatDate(invoice.dueDate)}</div>
                                    <div className={`text-sm ${
                                      daysUntilDue < 0 ? 'text-red-600' : daysUntilDue <= 7 ? 'text-yellow-600' : 'text-gray-500'
                                    }`}>
                                      {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` :
                                       daysUntilDue === 0 ? 'Due today' : `${daysUntilDue} days left`}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center justify-end space-x-2">
                                    <Button variant="ghost" size="sm" onClick={() => { setSelectedInvoice(invoice); setDialogs(prev => ({ ...prev, invoiceDetails: true })); }}>
                                      <Eye size={16} />
                                    </Button>
                                    {invoice.status !== 'paid' && (
                                      <Button variant="ghost" size="sm" onClick={() => { setSelectedInvoice(invoice); setDialogs(prev => ({ ...prev, recordPayment: true })); }}>
                                        <CreditCard size={16} />
                                      </Button>
                                    )}
                                    <Button variant="ghost" size="sm" onClick={() => { setSelectedInvoice(invoice); setDialogs(prev => ({ ...prev, followUp: true })); }}>
                                      <CalendarDays size={16} />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredInvoices.map((invoice) => (
                        <InvoiceCard key={invoice.id} invoice={invoice} isSelected={selectedInvoices.includes(invoice.id)}
                          onSelect={(selected) => handleSelectInvoice(invoice.id, selected)}
                          onViewDetails={() => { setSelectedInvoice(invoice); setDialogs(prev => ({ ...prev, invoiceDetails: true })); }}
                          onRecordPayment={() => { setSelectedInvoice(invoice); setDialogs(prev => ({ ...prev, recordPayment: true })); }}
                          onFollowUp={() => { setSelectedInvoice(invoice); setDialogs(prev => ({ ...prev, followUp: true })); }}
                          formatCurrency={formatCurrency} formatDate={formatDate} getDaysUntilDue={getDaysUntilDue} getStatusColor={getStatusColor} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'overdue' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {overdueInvoices.map((invoice) => (
                    <OverdueCard key={invoice.id} invoice={invoice}
                      onRecordPayment={() => { setSelectedInvoice(invoice); setDialogs(prev => ({ ...prev, recordPayment: true })); }}
                      onFollowUp={() => { setSelectedInvoice(invoice); setDialogs(prev => ({ ...prev, followUp: true })); }}
                      formatCurrency={formatCurrency} formatDate={formatDate} getDaysUntilDue={getDaysUntilDue} />
                  ))}
                </div>
              )}

              {activeTab === 'pending' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {invoices.filter(invoice => invoice.status === 'pending').map((invoice) => (
                    <InvoiceCard key={invoice.id} invoice={invoice} isSelected={selectedInvoices.includes(invoice.id)}
                      onSelect={(selected) => handleSelectInvoice(invoice.id, selected)}
                      onViewDetails={() => { setSelectedInvoice(invoice); setDialogs(prev => ({ ...prev, invoiceDetails: true })); }}
                      onRecordPayment={() => { setSelectedInvoice(invoice); setDialogs(prev => ({ ...prev, recordPayment: true })); }}
                      onFollowUp={() => { setSelectedInvoice(invoice); setDialogs(prev => ({ ...prev, followUp: true })); }}
                      formatCurrency={formatCurrency} formatDate={formatDate} getDaysUntilDue={getDaysUntilDue} getStatusColor={getStatusColor} />
                  ))}
                </div>
              )}

              {activeTab === 'customers' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {customers.map((customer) => (
                    <CustomerSummaryCard key={customer.id} customer={customer}
                      invoices={invoices.filter(invoice => invoice.customerId === customer.id)}
                      onViewInvoices={() => updateFilters({ customer: customer.id })}
                      formatCurrency={formatCurrency} />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateInvoiceDialog isOpen={dialogs.createInvoice} onClose={() => setDialogs(prev => ({ ...prev, createInvoice: false }))} onCreateInvoice={handlers.createInvoice} customers={customers} isProcessing={isProcessing} />
      <PaymentRecordDialog isOpen={dialogs.recordPayment} onClose={() => setDialogs(prev => ({ ...prev, recordPayment: false }))} invoice={selectedInvoice} onRecordPayment={handlers.recordPayment} isProcessing={isProcessing} />
      <BulkReminderDialog isOpen={dialogs.bulkReminder} onClose={() => setDialogs(prev => ({ ...prev, bulkReminder: false }))} selectedInvoices={invoices.filter(invoice => selectedInvoices.includes(invoice.id))} onSendReminders={handlers.bulkReminder} isProcessing={isProcessing} />
      <InvoiceDetailsDialog isOpen={dialogs.invoiceDetails} onClose={() => setDialogs(prev => ({ ...prev, invoiceDetails: false }))} invoice={selectedInvoice} onEdit={() => setDialogs(prev => ({ ...prev, invoiceDetails: false, createInvoice: true }))} onRecordPayment={() => setDialogs(prev => ({ ...prev, invoiceDetails: false, recordPayment: true }))} formatCurrency={formatCurrency} formatDate={formatDate} />
      <FollowUpDialog isOpen={dialogs.followUp} onClose={() => setDialogs(prev => ({ ...prev, followUp: false }))} invoice={selectedInvoice} onCreateFollowUp={handlers.followUp} isProcessing={isProcessing} />
    </div>
  );
};

export default AccountsReceivablePage;