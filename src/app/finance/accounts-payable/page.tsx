'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { useAccountsPayable } from '@/hooks/useAccountsPayable';
import { 
  CreditCard, Plus, Search, Filter, Download, Calendar, Send, RefreshCw, Activity, FileText,
  DollarSign, Building2, CheckCircle, TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import { PayableInvoice, Vendor } from '@/types/accountsPayable';

// Import components
import { PayableInvoiceCard } from '@/components/finance/accounts-payable/PayableInvoiceCard';
import { VendorCard } from '@/components/finance/accounts-payable/VendorCard';
import { PaymentScheduleCard } from '@/components/finance/accounts-payable/PaymentScheduleCard';
import { AgingReportCard } from '@/components/finance/accounts-payable/AgingReportCard';
import { CreatePayableDialog } from '@/components/finance/accounts-payable/dialogs/CreatePayableDialog';
import { PaymentDialog } from '@/components/finance/accounts-payable/dialogs/PaymentDialog';
import { VendorDetailsDialog } from '@/components/finance/accounts-payable/dialogs/VendorDetailsDialog';
import { BulkPaymentDialog } from '@/components/finance/accounts-payable/dialogs/BulkPaymentDialog';
import { StatsCard } from '@/components/shared/StatsCard';

const AccountsPayablePage = () => {
  const {
    payableInvoices, vendors, paymentSchedules, agingReport, summary, loading, filters, isProcessing,
    updateFilters, createPayableInvoice, processPayment, bulkPayment, schedulePayment,
    generateAgingReport, exportData, sendReminder, approvePayment, rejectPayment
  } = useAccountsPayable();

  const [activeTab, setActiveTab] = useState('overview');
  const [dialogs, setDialogs] = useState({
    createPayable: false, payment: false, vendorDetails: false, bulkPayment: false
  });
  const [selected, setSelected] = useState({
    invoice: null as PayableInvoice | null,
    vendor: null as Vendor | null,
    invoices: [] as string[]
  });

  const handlers = {
    createPayable: async (data: any) => {
      try {
        await createPayableInvoice(data);
        setDialogs(prev => ({ ...prev, createPayable: false }));
        alert('Payable invoice created successfully!');
      } catch { alert('Error creating payable invoice.'); }
    },
    processPayment: async (invoiceId: string, data: any) => {
      try {
        await processPayment(invoiceId, data);
        setDialogs(prev => ({ ...prev, payment: false }));
        alert('Payment processed successfully!');
      } catch { alert('Error processing payment.'); }
    },
    bulkPayment: async (invoiceIds: string[], data: any) => {
      try {
        await bulkPayment(invoiceIds, data);
        setDialogs(prev => ({ ...prev, bulkPayment: false }));
        setSelected(prev => ({ ...prev, invoices: [] }));
        alert('Bulk payment processed successfully!');
      } catch { alert('Error processing bulk payment.'); }
    },
    schedulePayment: async (invoiceId: string, data: any) => {
      try {
        await schedulePayment(invoiceId, data);
        alert('Payment scheduled successfully!');
      } catch { alert('Error scheduling payment.'); }
    },
    sendReminder: async (invoiceId: string) => {
      try { await sendReminder(invoiceId); alert('Reminder sent!'); } 
      catch { alert('Error sending reminder.'); }
    },
    approvePayment: async (invoiceId: string) => {
      try { await approvePayment(invoiceId); alert('Payment approved!'); } 
      catch { alert('Error approving payment.'); }
    },
    rejectPayment: async (invoiceId: string, reason: string) => {
      try { await rejectPayment(invoiceId, reason); alert('Payment rejected!'); } 
      catch { alert('Error rejecting payment.'); }
    },
    exportData: async () => {
      try { await exportData(); alert('Data exported!'); } 
      catch { alert('Error exporting data.'); }
    },
    invoiceSelection: (invoiceId: string, isSelected: boolean) => {
      setSelected(prev => ({
        ...prev,
        invoices: isSelected 
          ? [...prev.invoices, invoiceId]
          : prev.invoices.filter(id => id !== invoiceId)
      }));
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
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
            <CreditCard size={28} className="mr-3 text-red-600" />
            Accounts Payable
          </h1>
          <p className="text-gray-600 mt-1">Manage vendor bills, payments, and payable obligations</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          {selected.invoices.length > 0 && (
            <Button variant="outline" onClick={() => setDialogs(prev => ({ ...prev, bulkPayment: true }))}>
              <Send size={16} className="mr-2" />Bulk Payment ({selected.invoices.length})
            </Button>
          )}
          <Button variant="outline" onClick={handlers.exportData} disabled={isProcessing}>
            <Download size={16} className="mr-2" />Export
          </Button>
          <Button variant="outline" onClick={() => generateAgingReport()} disabled={isProcessing}>
            <RefreshCw size={16} className="mr-2" />Refresh
          </Button>
          <Button onClick={() => setDialogs(prev => ({ ...prev, createPayable: true }))}>
            <Plus size={16} className="mr-2" />New Payable
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            name: 'Total Payables',
            value: `₹${(summary.totalPayables / 100000).toFixed(1)}L`,
            description: 'Outstanding vendor obligations',
            change: '+12.5%',
            changeType: 'negative',
            icon: <CreditCard size={20} />,
            target: `₹${((summary.totalPayables * 0.85) / 100000).toFixed(1)}L`,
            progress: 85
          },
          {
            name: 'Due This Month',
            value: `₹${(summary.dueThisMonth / 100000).toFixed(1)}L`,
            description: 'Payments due within 30 days',
            change: '+8.2%',
            changeType: 'negative',
            icon: <Calendar size={20} />,
            target: `₹${((summary.dueThisMonth * 0.75) / 100000).toFixed(1)}L`,
            progress: 75
          },
          {
            name: 'Paid This Month',
            value: `₹${(summary.paidThisMonth / 100000).toFixed(1)}L`,
            description: 'Completed payments this period',
            change: '+15.3%',
            changeType: 'positive',
            icon: <CheckCircle size={20} />,
            target: `₹${((summary.paidThisMonth * 1.2) / 100000).toFixed(1)}L`,
            progress: 83
          },
          {
            name: 'Active Vendors',
            value: summary.activeVendors.toString(),
            description: 'Vendors with outstanding balances',
            change: '+2 vendors',
            changeType: 'positive',
            icon: <Building2 size={20} />,
            target: `${Math.round(summary.activeVendors * 1.1)}`,
            progress: 91
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-50 rounded-lg mr-3">
                      <div className="text-blue-600">
                        {stat.icon}
                      </div>
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <Card>
          <CardHeader>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="invoices">Payable Invoices</TabsTrigger>
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
              <TabsTrigger value="payments">Payment Schedule</TabsTrigger>
              <TabsTrigger value="aging">Aging Report</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="overview" className="space-y-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setDialogs(prev => ({ ...prev, createPayable: true }))}>
                  <CardContent className="p-6 text-center">
                    <Plus size={32} className="mx-auto text-red-600 mb-3" />
                    <h3 className="font-semibold mb-2">Record Bill</h3>
                    <p className="text-sm text-gray-600">Add new vendor bill</p>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setDialogs(prev => ({ ...prev, bulkPayment: true }))}>
                  <CardContent className="p-6 text-center">
                    <Send size={32} className="mx-auto text-green-600 mb-3" />
                    <h3 className="font-semibold mb-2">Make Payment</h3>
                    <p className="text-sm text-gray-600">Process payments</p>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('aging')}>
                  <CardContent className="p-6 text-center">
                    <Activity size={32} className="mx-auto text-orange-600 mb-3" />
                    <h3 className="font-semibold mb-2">Aging Report</h3>
                    <p className="text-sm text-gray-600">View aging analysis</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handlers.exportData}>
                  <CardContent className="p-6 text-center">
                    <Download size={32} className="mx-auto text-blue-600 mb-3" />
                    <h3 className="font-semibold mb-2">Export Data</h3>
                    <p className="text-sm text-gray-600">Download reports</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader><CardTitle>Recent Payable Invoices</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {payableInvoices.slice(0, 5).map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100" 
                             onClick={() => { setSelected(prev => ({ ...prev, invoice })); setDialogs(prev => ({ ...prev, payment: true })); }}>
                          <div className="flex items-center gap-3">
                            <FileText size={20} className="text-red-600" />
                            <div>
                              <p className="font-medium">{invoice.invoiceNumber}</p>
                              <p className="text-sm text-gray-500">{invoice.vendorName} • ₹{invoice.totalAmount.toLocaleString()}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className={
                            invoice.status === 'paid' ? 'text-green-600 bg-green-50 border-green-200' :
                            invoice.status === 'overdue' ? 'text-red-600 bg-red-50 border-red-200' :
                            invoice.status === 'pending_approval' ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
                            'text-blue-600 bg-blue-50 border-blue-200'
                          }>
                            {invoice.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Upcoming Payments</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {paymentSchedules.filter(p => p.status === 'scheduled').slice(0, 5).map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Calendar size={20} className="text-orange-600" />
                            <div>
                              <p className="font-medium">{payment.invoiceNumber}</p>
                              <p className="text-sm text-gray-500">Due: {new Date(payment.scheduledDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">₹{payment.amount.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">
                              {Math.ceil((new Date(payment.scheduledDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="invoices" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input placeholder="Search invoices..." value={filters.search} 
                         onChange={(e) => updateFilters({ search: e.target.value })} className="pl-10" />
                </div>
                <Select value={filters.status || 'all'} onValueChange={(value) => updateFilters({ status: value === 'all' ? undefined : value })}>
                  <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    {['all', 'draft', 'pending_approval', 'approved', 'paid', 'overdue', 'cancelled'].map(status => (
                      <SelectItem key={status} value={status}>{status === 'all' ? 'All Status' : status.replace('_', ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filters.vendor || 'all'} onValueChange={(value) => updateFilters({ vendor: value === 'all' ? undefined : value })}>
                  <SelectTrigger className="w-[140px]"><SelectValue placeholder="Vendor" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vendors</SelectItem>
                    {vendors.map(vendor => <SelectItem key={vendor.id} value={vendor.id}>{vendor.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm"><Filter size={16} className="mr-2" />More Filters</Button>
              </div>

              {/* Bulk Actions */}
              {selected.invoices.length > 0 && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-blue-800">{selected.invoices.length} invoice(s) selected</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setDialogs(prev => ({ ...prev, bulkPayment: true }))}>
                          <Send size={16} className="mr-2" />Bulk Payment
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setSelected(prev => ({ ...prev, invoices: [] }))}>
                          Clear Selection
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Invoices List */}
              <div className="space-y-4">
                {payableInvoices.map((invoice) => (
                  <PayableInvoiceCard key={invoice.id} invoice={invoice} 
                    isSelected={selected.invoices.includes(invoice.id)}
                    onSelect={(isSelected) => handlers.invoiceSelection(invoice.id, isSelected)}
                    onViewDetails={(inv) => { setSelected(prev => ({ ...prev, invoice: inv })); setDialogs(prev => ({ ...prev, payment: true })); }}
                    onProcessPayment={(inv) => { setSelected(prev => ({ ...prev, invoice: inv })); setDialogs(prev => ({ ...prev, payment: true })); }}
                    onSchedulePayment={handlers.schedulePayment} onSendReminder={handlers.sendReminder}
                    onApprove={handlers.approvePayment} onReject={handlers.rejectPayment} isProcessing={isProcessing} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="vendors" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Vendor Management</h3>
                  <p className="text-gray-600">Manage vendor information and payment terms</p>
                </div>
                <Button onClick={() => setDialogs(prev => ({ ...prev, createPayable: true }))}>
                  <Plus size={16} className="mr-2" />Add Vendor
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendors.map((vendor) => (
                  <VendorCard key={vendor.id} vendor={vendor}
                    onViewDetails={(v) => { setSelected(prev => ({ ...prev, vendor: v })); setDialogs(prev => ({ ...prev, vendorDetails: true })); }}
                    onCreatePayable={() => setDialogs(prev => ({ ...prev, createPayable: true }))} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="payments" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Payment Schedule</h3>
                  <p className="text-gray-600">Manage scheduled and upcoming payments</p>
                </div>
                <Button onClick={() => setDialogs(prev => ({ ...prev, bulkPayment: true }))}>
                  <Send size={16} className="mr-2" />Process Payments
                </Button>
              </div>
              <div className="space-y-4">
                {paymentSchedules.map((payment) => (
                  <PaymentScheduleCard key={payment.id} payment={payment}
                    onProcessPayment={(p) => {
                      const invoice = payableInvoices.find(inv => inv.invoiceNumber === p.invoiceNumber);
                      if (invoice) { setSelected(prev => ({ ...prev, invoice })); setDialogs(prev => ({ ...prev, payment: true })); }
                    }}
                    onReschedule={handlers.schedulePayment} isProcessing={isProcessing} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="aging" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Accounts Payable Aging Report</h3>
                  <p className="text-gray-600">Analyze payables by age and vendor</p>
                </div>
                <Button onClick={() => generateAgingReport()} disabled={isProcessing}>
                  <RefreshCw size={16} className="mr-2" />Refresh Report
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {agingReport.buckets.map((bucket, index) => (
                  <AgingReportCard key={bucket.range} bucket={bucket} index={index} />
                ))}
              </div>
              <Card>
                <CardHeader><CardTitle>Detailed Aging Analysis</CardTitle></CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          {['Vendor', 'Current', '1-30 Days', '31-60 Days', '61-90 Days', '90+ Days', 'Total'].map(header => (
                            <th key={header} className={`p-3 ${header === 'Vendor' ? 'text-left' : 'text-right'}`}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {agingReport.vendorBreakdown.map((vendor) => (
                          <tr key={vendor.vendorId} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{vendor.vendorName}</td>
                            <td className="p-3 text-right">₹{vendor.current.toLocaleString()}</td>
                            <td className="p-3 text-right">₹{vendor.days1to30.toLocaleString()}</td>
                            <td className="p-3 text-right">₹{vendor.days31to60.toLocaleString()}</td>
                            <td className="p-3 text-right">₹{vendor.days61to90.toLocaleString()}</td>
                            <td className="p-3 text-right">₹{vendor.days90plus.toLocaleString()}</td>
                            <td className="p-3 text-right font-bold">₹{vendor.total.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      {/* Dialogs */}
      <CreatePayableDialog isOpen={dialogs.createPayable} onClose={() => setDialogs(prev => ({ ...prev, createPayable: false }))}
        onCreatePayable={handlers.createPayable} vendors={vendors} isProcessing={isProcessing} />
      <PaymentDialog isOpen={dialogs.payment} onClose={() => setDialogs(prev => ({ ...prev, payment: false }))}
        invoice={selected.invoice} onProcessPayment={handlers.processPayment} onSchedulePayment={handlers.schedulePayment} isProcessing={isProcessing} />
      <VendorDetailsDialog isOpen={dialogs.vendorDetails} onClose={() => setDialogs(prev => ({ ...prev, vendorDetails: false }))}
        vendor={selected.vendor} payableInvoices={payableInvoices.filter(inv => inv.vendorId === selected.vendor?.id)} />
      <BulkPaymentDialog isOpen={dialogs.bulkPayment} onClose={() => setDialogs(prev => ({ ...prev, bulkPayment: false }))}
        selectedInvoices={payableInvoices.filter(inv => selected.invoices.includes(inv.id))} onProcessBulkPayment={handlers.bulkPayment} isProcessing={isProcessing} />
    </div>
  );
};

export default AccountsPayablePage;