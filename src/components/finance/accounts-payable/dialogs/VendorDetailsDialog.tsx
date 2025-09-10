import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  DollarSign,
  Calendar,
  TrendingUp,
  FileText,
  User,
  CreditCard,
  BarChart3,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Vendor, PayableInvoice } from '@/types/accountsPayable';

interface VendorDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor | null;
  payableInvoices: PayableInvoice[];
}

export const VendorDetailsDialog = ({
  isOpen,
  onClose,
  vendor,
  payableInvoices
}: VendorDetailsDialogProps) => {
  if (!vendor) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'inactive':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'blocked':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'overdue':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'pending_approval':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'approved':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 100000).toFixed(1)}L`;
  };

  const calculateVendorStats = () => {
    const totalInvoices = payableInvoices.length;
    const paidInvoices = payableInvoices.filter(inv => inv.status === 'paid').length;
    const overdueInvoices = payableInvoices.filter(inv => inv.status === 'overdue').length;
    const totalAmount = payableInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const paidAmount = payableInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const outstandingAmount = payableInvoices.reduce((sum, inv) => sum + inv.balanceAmount, 0);

    return {
      totalInvoices,
      paidInvoices,
      overdueInvoices,
      totalAmount,
      paidAmount,
      outstandingAmount,
      paymentRate: totalInvoices > 0 ? (paidInvoices / totalInvoices) * 100 : 0
    };
  };

  const stats = calculateVendorStats();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Building2 size={24} className="mr-2" />
              {vendor.displayName}
            </span>
            <Badge variant="outline" className={getStatusColor(vendor.status)}>
              {vendor.status.toUpperCase()}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contact">Contact & Address</TabsTrigger>
            <TabsTrigger value="financial">Financial Details</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <FileText size={20} className="text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.totalInvoices}</p>
                      <p className="text-sm text-gray-600">Total Invoices</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign size={20} className="text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</p>
                      <p className="text-sm text-gray-600">Total Amount</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle size={20} className="text-red-600" />
                    <div>
                      <p className="text-2xl font-bold">{formatCurrency(stats.outstandingAmount)}</p>
                      <p className="text-sm text-gray-600">Outstanding</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <BarChart3 size={20} className="text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.paymentRate.toFixed(0)}%</p>
                      <p className="text-sm text-gray-600">Payment Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Vendor Information Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Building2 size={16} className="text-gray-400" />
                      <div>
                        <p className="font-medium">{vendor.name}</p>
                        <p className="text-sm text-gray-600">{vendor.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Mail size={16} className="text-gray-400" />
                      <p className="text-sm">{vendor.email}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone size={16} className="text-gray-400" />
                      <p className="text-sm">{vendor.phone}</p>
                    </div>

                    {vendor.website && (
                      <div className="flex items-center space-x-3">
                        <Globe size={16} className="text-gray-400" />
                        <a 
                          href={vendor.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {vendor.website}
                        </a>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <Calendar size={16} className="text-gray-400" />
                      <p className="text-sm">Payment Terms: {vendor.paymentTerms}</p>
                    </div>
                  </div>

                  {vendor.tags.length > 0 && (
                    <div className="pt-3 border-t">
                      <p className="text-sm font-medium mb-2">Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {vendor.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Current Balance:</span>
                      <span className="font-medium text-red-600">
                        {formatCurrency(vendor.currentBalance)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Credit Limit:</span>
                      <span className="font-medium">
                        {formatCurrency(vendor.creditLimit)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Purchases:</span>
                      <span className="font-medium">
                        {formatCurrency(vendor.totalPurchases)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg Payment Days:</span>
                      <span className="font-medium">{vendor.averagePaymentDays} days</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Credit Utilization:</span>
                      <span className="font-medium">
                        {vendor.creditLimit > 0 
                          ? ((vendor.currentBalance / vendor.creditLimit) * 100).toFixed(1)
                          : 0}%
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(
                            vendor.creditLimit > 0 
                              ? (vendor.currentBalance / vendor.creditLimit) * 100 
                              : 0, 
                            100
                          )}%` 
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Credit utilization</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payableInvoices.slice(0, 5).map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText size={16} className="text-gray-600" />
                        <div>
                          <p className="font-medium">{invoice.invoiceNumber}</p>
                          <p className="text-sm text-gray-600">
                            Due: {new Date(invoice.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">₹{invoice.totalAmount.toLocaleString()}</span>
                        <Badge variant="outline" className={getInvoiceStatusColor(invoice.status)}>
                          {invoice.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User size={20} className="mr-2" />
                    Primary Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">{vendor.contactPerson.name || 'Not specified'}</p>
                      {vendor.contactPerson.designation && (
                        <p className="text-sm text-gray-600">{vendor.contactPerson.designation}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Mail size={14} className="text-gray-400" />
                        <span className="text-sm">{vendor.contactPerson.email || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone size={14} className="text-gray-400" />
                        <span className="text-sm">{vendor.contactPerson.phone || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin size={20} className="mr-2" />
                    Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">{vendor.address.street}</p>
                    <p className="text-sm">
                      {vendor.address.city}, {vendor.address.state} {vendor.address.postalCode}
                    </p>
                    <p className="text-sm font-medium">{vendor.address.country}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tax Information */}
            <Card>
              <CardHeader>
                <CardTitle>Tax & Registration Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Tax ID</p>
                      <p className="text-sm text-gray-600">{vendor.taxId || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Registration Number</p>
                      <p className="text-sm text-gray-600">{vendor.registrationNumber || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Created Date</p>
                      <p className="text-sm text-gray-600">
                        {new Date(vendor.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-sm text-gray-600">
                        {new Date(vendor.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            {/* Bank Details */}
            {vendor.bankDetails && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard size={20} className="mr-2" />
                    Bank Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium">Bank Name</p>
                        <p className="text-sm text-gray-600">{vendor.bankDetails.bankName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Account Number</p>
                        <p className="text-sm text-gray-600">{vendor.bankDetails.accountNumber}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium">Routing Number</p>
                        <p className="text-sm text-gray-600">{vendor.bankDetails.routingNumber}</p>
                      </div>
                      {vendor.bankDetails.swiftCode && (
                        <div>
                          <p className="text-sm font-medium">SWIFT Code</p>
                          <p className="text-sm text-gray-600">{vendor.bankDetails.swiftCode}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.paidInvoices}</div>
                    <div className="text-sm text-gray-600">Paid Invoices</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.overdueInvoices}</div>
                    <div className="text-sm text-gray-600">Overdue Invoices</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{vendor.averagePaymentDays}</div>
                    <div className="text-sm text-gray-600">Avg Payment Days</div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Payment Success Rate</span>
                    <span>{stats.paymentRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stats.paymentRate}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            {vendor.documents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {vendor.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <FileText size={16} className="text-gray-600" />
                          <span className="text-sm">{doc}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            <div className="space-y-4">
              {payableInvoices.map((invoice) => (
                <Card key={invoice.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <FileText size={20} className="text-gray-600" />
                        <div>
                          <h3 className="font-semibold">{invoice.invoiceNumber}</h3>
                          <p className="text-sm text-gray-600">{invoice.description}</p>
                          <p className="text-xs text-gray-500">
                            Created: {new Date(invoice.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">₹{invoice.totalAmount.toLocaleString()}</span>
                          <Badge variant="outline" className={getInvoiceStatusColor(invoice.status)}>
                            {invoice.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Due: {new Date(invoice.dueDate).toLocaleDateString()}
                        </p>
                        {invoice.balanceAmount > 0 && (
                          <p className="text-sm text-red-600">
                            Balance: ₹{invoice.balanceAmount.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};