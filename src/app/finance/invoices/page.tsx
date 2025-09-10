'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useInvoices } from '@/hooks/useInvoices';
import { 
  FileText,
  Plus,
  Search,
  Download, 
  DollarSign,
  Calendar,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { useState } from 'react';

// Import components
import { StatsCard } from '@/components/shared/StatsCard';
import { InvoiceCard } from '@/components/finance/invoices/InvoiceCard';
import { BillCard } from '@/components/finance/invoices/BillCard';
import { CustomerCard } from '@/components/finance/invoices/CustomerCard';
import { TemplateCard } from '@/components/finance/invoices/TemplateCard';
import { CreateInvoiceDialog } from '@/components/finance/invoices/dialogs/CreateInvoiceDialog';
import { CreateBillDialog } from '@/components/finance/invoices/dialogs/CreateBillDialog';
import { InvoiceDetailsDialog } from '@/components/finance/invoices/dialogs/InvoiceDetailsDialog';
import { SendInvoiceDialog } from '@/components/finance/invoices/dialogs/SendInvoiceDialog';
import { PaymentTrackingDialog } from '@/components/finance/invoices/dialogs/PaymentTrackingDialog';
import { AddCustomerDialog } from '@/components/finance/invoices/dialogs/AddCustomerDialog';
import { CreateTemplateDialog } from '@/components/finance/invoices/dialogs/CreateTemplateDialog';
import { EditBillDialog } from '@/components/finance/invoices/dialogs/EditBillDialog';
import { TemplatePreviewDialog } from '@/components/finance/invoices/dialogs/TemplatePreviewDialog';

const InvoicesPage = () => {
  const {
    invoices,
    bills,
    customers,
    templates,
    summary,
    loading,
    filters,
    isProcessing,
    updateFilters,
    createInvoice,
    createBill, 
    updateBill,
    sendInvoice,
    duplicateInvoice,
    deleteInvoice,
    recordPayment,
    exportData,
    generateReport,
    addCustomer,   
    addTemplate,
    deleteBill
  } = useInvoices();

  const [activeTab, setActiveTab] = useState('overview');
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isCreateBillOpen, setIsCreateBillOpen] = useState(false);
  const [isInvoiceDetailsOpen, setIsInvoiceDetailsOpen] = useState(false);
  const [isSendInvoiceOpen, setIsSendInvoiceOpen] = useState(false);
  const [isPaymentTrackingOpen, setIsPaymentTrackingOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false);
  const [isEditBillOpen, setIsEditBillOpen] = useState(false);
  const [isTemplatePreviewOpen, setIsTemplatePreviewOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<typeof invoices[0] | null>(null);
  const [selectedBill, setSelectedBill] = useState<typeof bills[0] | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);

  const STATS_CARDS = [
    {
      title: 'Total Invoices',
      value: summary.totalInvoices.toString(),
      change: `${summary.draftInvoices} drafts`,
      icon: <FileText size={24} />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      progress: summary.totalInvoices > 0 ? ((summary.totalInvoices - summary.draftInvoices) / summary.totalInvoices) * 100 : 0
    },
    {
      title: 'Total Revenue',
      value: `$${(summary.totalRevenue / 1000).toFixed(0)}K`,
      change: `${summary.paidAmount > 0 ? '+' : ''}$${(summary.paidAmount / 1000).toFixed(0)}K collected`,
      icon: <DollarSign size={24} />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      progress: summary.totalRevenue > 0 ? (summary.paidAmount / summary.totalRevenue) * 100 : 0
    },
    {
      title: 'Outstanding',
      value: `$${(summary.outstandingAmount / 1000).toFixed(0)}K`,
      change: `${summary.overdueInvoices} overdue`,
      icon: <TrendingUp size={24} />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      progress: summary.totalRevenue > 0 ? (summary.outstandingAmount / summary.totalRevenue) * 100 : 0
    },
    {
      title: 'This Month',
      value: `$${(summary.monthlyRevenue / 1000).toFixed(0)}K`,
      change: `${summary.monthlyInvoices} invoices`,
      icon: <Calendar size={24} />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      progress: summary.monthlyTarget > 0 ? (summary.monthlyRevenue / summary.monthlyTarget) * 100 : 0
    }
  ];

  // Event Handlers with proper error handling and success messages
  const handleViewInvoiceDetails = (invoice: typeof invoices[0]) => {
    setSelectedInvoice(invoice);
    setIsInvoiceDetailsOpen(true);
  };

  const handleViewBillDetails = (bill: typeof bills[0]) => {
    // Convert bill to invoice-like structure for the details dialog
    const invoiceFromBill = {
      ...bill,
      invoiceNumber: bill.billNumber || bill.id,
      customerId: bill.vendorId || '',
      customerName: bill.vendorName || '',
      customerEmail: bill.vendorEmail || '',
      dueDate: bill.dueDate || new Date().toISOString(),
      balanceAmount: bill.totalAmount || 0
    };
    setSelectedInvoice(invoiceFromBill as unknown as typeof invoices[0]);
    setIsInvoiceDetailsOpen(true);
  };

  const handleSendInvoice = (invoice: typeof invoices[0]) => {
    setSelectedInvoice(invoice);
    setIsSendInvoiceOpen(true);
  };

  const handleDuplicateInvoice = async (invoiceId: string) => {
    try {
      await duplicateInvoice(invoiceId);
      alert('Invoice duplicated successfully!');
    } catch (error) {
      alert('Error duplicating invoice. Please try again.');
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      try {
        await deleteInvoice(invoiceId);
        alert('Invoice deleted successfully!');
      } catch (error) {
        alert('Error deleting invoice. Please try again.');
      }
    }
  };

  const handleRecordPayment = async (invoiceId: string, paymentData: Parameters<typeof recordPayment>[1]) => {
    try {
      await recordPayment(invoiceId, paymentData);
      alert('Payment recorded successfully!');
    } catch (error) {
      alert('Error recording payment. Please try again.');
    }
  };

  const handleExportData = async () => {
    try {
      await exportData();
      alert('Data exported successfully!');
    } catch (error) {
      alert('Error exporting data. Please try again.');
    }
  };

  const handleGenerateReport = async () => {
    try {
      await generateReport();
      alert('Report generated successfully!');
    } catch (error) {
      alert('Error generating report. Please try again.');
    }
  };

  const handleCreateInvoice = async (invoiceData: {
    customerId: string;
    customerName?: string;
    customerEmail?: string;
    customerAddress?: string;
    issueDate: string;
    dueDate: string;
    templateId?: string;
    notes: string;
    terms: string;
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;
    lineItems: Array<Partial<{
      id: string;
      description: string;
      quantity: number;
      unitPrice: number;
      taxRate: number;
      discountRate: number;
      totalAmount: number;
      productId?: string;
      productName?: string;
    }> & { id: string }>;
  }) => {
    try {
      // Convert dialog InvoiceData to hook's expected Partial<Invoice>
      const hookInvoiceData = {
        customerId: invoiceData.customerId,
        customerName: invoiceData.customerName,
        customerEmail: invoiceData.customerEmail,
        customerAddress: invoiceData.customerAddress,
        issueDate: invoiceData.issueDate,
        dueDate: invoiceData.dueDate,
        templateId: invoiceData.templateId,
        notes: invoiceData.notes,
        terms: invoiceData.terms,
        subtotal: invoiceData.subtotal,
        taxAmount: invoiceData.taxAmount,
        discountAmount: invoiceData.discountAmount,
        totalAmount: invoiceData.totalAmount,
        lineItems: invoiceData.lineItems.map(item => ({
          id: item.id,
          description: item.description || '',
          quantity: item.quantity || 0,
          unitPrice: item.unitPrice || 0,
          taxRate: item.taxRate || 0,
          discountRate: item.discountRate || 0,
          totalAmount: item.totalAmount || 0,
          productId: item.productId,
          productName: item.productName
        }))
      };
      
      await createInvoice(hookInvoiceData);
      alert('Invoice created successfully!');
      setIsCreateInvoiceOpen(false);
    } catch (error) {
      alert('Error creating invoice. Please try again.');
    }
  };

  const handleCreateBill = async (billData: Parameters<typeof createBill>[0]) => {
    try {
      await createBill(billData);
      alert('Bill created successfully!');
      setIsCreateBillOpen(false);
    } catch (error) {
      alert('Error creating bill. Please try again.');
    }
  };

  const handleSendInvoiceEmail = async (invoiceId: string, emailData: Parameters<typeof sendInvoice>[1]) => {
    try {
      await sendInvoice(invoiceId, emailData);
      alert('Invoice sent successfully!');
      setIsSendInvoiceOpen(false);
    } catch (error) {
      alert('Error sending invoice. Please try again.');
    }
  };

  const handleUpdateBill = async (billId: string, updates: Parameters<typeof updateBill>[1]) => {
    try {
      await updateBill(billId, updates);
      alert('Bill updated successfully!');
      setIsEditBillOpen(false);
    } catch (error) {
      alert('Error updating bill. Please try again.');
    }
  };

  const handleAddCustomer = async (customerData: Parameters<typeof addCustomer>[0]) => {
    try {
      await addCustomer(customerData);
      alert('Customer added successfully!');
      setIsAddCustomerOpen(false);
    } catch (error) {
      alert('Error adding customer. Please try again.');
    }
  };

  const handleCreateTemplate = async (templateData: Parameters<typeof addTemplate>[0]) => {
    try {
      await addTemplate(templateData);
      alert('Template created successfully!');
      setIsCreateTemplateOpen(false);
    } catch (error) {
      alert('Error creating template. Please try again.');
    }
  };

  const handleEditBill = (billId: string, updates: Parameters<typeof updateBill>[1]) => {
    const bill = bills.find(b => b.id === billId);
    if (bill) {
      setSelectedBill(bill);
      setIsEditBillOpen(true);
    }
  };

  const handlePreviewTemplate = (template: typeof templates[0]) => {
    setSelectedTemplate(template);
    setIsTemplatePreviewOpen(true);
  };

  const handleDeleteBill = async (billId: string) => {
    if (confirm('Are you sure you want to delete this bill?')) {
      try {
        await deleteBill(billId);
        alert('Bill deleted successfully!');
      } catch (error) {
        alert('Error deleting bill. Please try again.');
      }
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
            <FileText size={28} className="mr-3 text-indigo-600" />
            Create/Send Invoices & Bills
          </h1>
          <p className="text-gray-600 mt-1">Manage invoices, bills, and customer billing efficiently</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setIsPaymentTrackingOpen(true)}>
            <CreditCard size={16} className="mr-2" />
            Track Payments
          </Button>
          <Button variant="outline" onClick={handleExportData} disabled={isProcessing}>
            <Download size={16} className="mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsCreateInvoiceOpen(true)}>
            <Plus size={16} className="mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS_CARDS.map((stat, index) => (
          <StatsCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <Card>
          <CardHeader>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="bills">Bills</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="overview" className="space-y-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setIsCreateInvoiceOpen(true)}>
                  <CardContent className="p-6 text-center">
                    <Plus size={32} className="mx-auto text-blue-600 mb-3" />
                    <h3 className="font-semibold mb-2">Create Invoice</h3>
                    <p className="text-sm text-gray-600">New customer invoice</p>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setIsCreateBillOpen(true)}>
                  <CardContent className="p-6 text-center">
                    <FileText size={32} className="mx-auto text-green-600 mb-3" />
                    <h3 className="font-semibold mb-2">Create Bill</h3>
                    <p className="text-sm text-gray-600">Vendor bill entry</p>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setIsPaymentTrackingOpen(true)}>
                  <CardContent className="p-6 text-center">
                    <CreditCard size={32} className="mx-auto text-purple-600 mb-3" />
                    <h3 className="font-semibold mb-2">Track Payments</h3>
                    <p className="text-sm text-gray-600">Payment status</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleGenerateReport}>
                  <CardContent className="p-6 text-center">
                    <TrendingUp size={32} className="mx-auto text-orange-600 mb-3" />
                    <h3 className="font-semibold mb-2">Generate Report</h3>
                    <p className="text-sm text-gray-600">Revenue analytics</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Invoices</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {invoices.slice(0, 3).map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100" onClick={() => handleViewInvoiceDetails(invoice)}>
                          <div className="flex items-center gap-3">
                            <FileText size={20} className="text-blue-600" />
                            <div>
                              <p className="font-medium">{invoice.invoiceNumber}</p>
                              <p className="text-sm text-gray-500">
                                {invoice.customerName} • ${invoice.totalAmount.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className={
                            invoice.status === 'paid' ? 'text-green-600 bg-green-50 border-green-200' :
                            invoice.status === 'sent' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                            invoice.status === 'overdue' ? 'text-red-600 bg-red-50 border-red-200' :
                            'text-gray-600 bg-gray-50 border-gray-200'
                          }>
                            {invoice.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Outstanding Payments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {invoices.filter(i => i.status === 'sent' || i.status === 'overdue').slice(0, 3).map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100" onClick={() => handleRecordPayment(invoice.id, { amount: invoice.balanceAmount })}>
                          <div className="flex items-center gap-3">
                            <DollarSign size={20} className="text-orange-600" />
                            <div>
                              <p className="font-medium">{invoice.invoiceNumber}</p>
                              <p className="text-sm text-gray-500">
                                {invoice.customerName} • Due: {new Date(invoice.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${invoice.totalAmount.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">
                              {Math.ceil((new Date(invoice.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
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
                  <Input
                    placeholder="Search invoices..."
                    value={filters.search}
                    onChange={(e) => updateFilters({ search: e.target.value })}
                    className="pl-10"
                  />
                </div>
                <Select 
                  value={filters.status || 'all'} 
                  onValueChange={(value) => updateFilters({ status: value === 'all' ? undefined : value })}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  value={filters.customer || 'all'} 
                  onValueChange={(value) => updateFilters({ customer: value === 'all' ? undefined : value })}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Invoices List */}
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <InvoiceCard
                    key={invoice.id}
                    invoice={invoice}
                    onViewDetails={handleViewInvoiceDetails}
                    onSend={handleSendInvoice}
                    onDuplicate={handleDuplicateInvoice}
                    onDelete={handleDeleteInvoice}
                    onRecordPayment={(invoiceId, paymentData) => {
                      // Convert PaymentData to the expected format
                      const convertedPaymentData = {
                        ...paymentData,
                        paymentMethod: paymentData.paymentMethod as 'bank_transfer' | 'check' | 'cash' | 'credit_card' | 'online' | undefined
                      };
                      return handleRecordPayment(invoiceId, convertedPaymentData);
                    }}
                    isProcessing={isProcessing}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="bills" className="space-y-6">
              {/* Bills Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Vendor Bills</h3>
                  <p className="text-gray-600">Manage incoming bills and payments</p>
                </div>
                <Button onClick={() => setIsCreateBillOpen(true)}>
                  <Plus size={16} className="mr-2" />
                  New Bill
                </Button>
              </div>

              {/* Bills List */}
              <div className="space-y-4">
                {bills.map((bill) => (
                  <BillCard
                    key={bill.id}
                    bill={bill}
                    onViewDetails={handleViewBillDetails}
                    onEdit={handleEditBill}
                    onDelete={handleDeleteBill}
                    isProcessing={isProcessing}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="customers" className="space-y-6">
              {/* Customers Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Customer Management</h3>
                  <p className="text-gray-600">Manage customer information and billing details</p>
                </div>
                <Button onClick={() => setIsAddCustomerOpen(true)}>
                  <Plus size={16} className="mr-2" />
                  Add Customer
                </Button>
              </div>

              {/* Customers List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customers.map((customer) => (
                  <CustomerCard
                    key={customer.id}
                    customer={customer}
                    onCreateInvoice={() => setIsCreateInvoiceOpen(true)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              {/* Templates Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Invoice Templates</h3>
                  <p className="text-gray-600">Customize and manage invoice templates</p>
                </div>
                <Button onClick={() => setIsCreateTemplateOpen(true)}>
                  <Plus size={16} className="mr-2" />
                  Create Template
                </Button>
              </div>

              {/* Templates List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onUse={() => setIsCreateInvoiceOpen(true)}
                    onPreview={() => handlePreviewTemplate(template)}
                  />
                ))}
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      {/* Dialogs */}
      <CreateInvoiceDialog
        isOpen={isCreateInvoiceOpen}
        onClose={() => setIsCreateInvoiceOpen(false)}
        onCreateInvoice={handleCreateInvoice}
        customers={customers}
        templates={templates}
        isProcessing={isProcessing}
      />

      <CreateBillDialog
        isOpen={isCreateBillOpen}
        onClose={() => setIsCreateBillOpen(false)}
        onCreateBill={handleCreateBill}
        isProcessing={isProcessing}
      />

      <InvoiceDetailsDialog
        isOpen={isInvoiceDetailsOpen}
        onClose={() => setIsInvoiceDetailsOpen(false)}
        invoice={selectedInvoice}
        onSend={handleSendInvoice}
        onRecordPayment={handleRecordPayment}
        isProcessing={isProcessing}
      />

      <SendInvoiceDialog
        isOpen={isSendInvoiceOpen}
        onClose={() => setIsSendInvoiceOpen(false)}
        invoice={selectedInvoice}
        onSend={handleSendInvoiceEmail}
        isProcessing={isProcessing}
      />

      <PaymentTrackingDialog
        isOpen={isPaymentTrackingOpen}
        onClose={() => setIsPaymentTrackingOpen(false)}
        invoices={invoices}
        onRecordPayment={handleRecordPayment}
        isProcessing={isProcessing}
      />

      <AddCustomerDialog
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        onAddCustomer={handleAddCustomer}
        isProcessing={isProcessing}
      />

      <CreateTemplateDialog
        isOpen={isCreateTemplateOpen}
        onClose={() => setIsCreateTemplateOpen(false)}
        onCreateTemplate={handleCreateTemplate}
        isProcessing={isProcessing}
      />

      <EditBillDialog
        isOpen={isEditBillOpen}
        onClose={() => setIsEditBillOpen(false)}
        bill={selectedBill}
        onUpdateBill={handleUpdateBill}
        isProcessing={isProcessing}
      />

      <TemplatePreviewDialog
        isOpen={isTemplatePreviewOpen}
        onClose={() => setIsTemplatePreviewOpen(false)}
        template={selectedTemplate}
      />
    </div>
  );
};

export default InvoicesPage;