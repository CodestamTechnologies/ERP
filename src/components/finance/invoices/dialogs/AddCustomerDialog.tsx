'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Customer } from '@/hooks/useInvoices';
import { User, Plus } from 'lucide-react';
import { useState } from 'react';

interface AddCustomerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomer: (customerData: Partial<Customer>) => Promise<void>;
  isProcessing: boolean;
}

export const AddCustomerDialog = ({
  isOpen,
  onClose,
  onAddCustomer,
  isProcessing
}: AddCustomerDialogProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('USA');
  const [taxId, setTaxId] = useState('');
  const [paymentTerms, setPaymentTerms] = useState(30);
  const [creditLimit, setCreditLimit] = useState<number | undefined>();
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      return;
    }

    const customerData: Partial<Customer> = {
      name,
      email,
      phone: phone || undefined,
      address,
      city,
      state,
      zipCode,
      country,
      taxId: taxId || undefined,
      paymentTerms,
      creditLimit,
      isActive
    };

    try {
      await onAddCustomer(customerData);
      handleClose();
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  const handleClose = () => {
    onClose();
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setCity('');
    setState('');
    setZipCode('');
    setCountry('USA');
    setTaxId('');
    setPaymentTerms(30);
    setCreditLimit(undefined);
    setIsActive(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus size={24} className="text-blue-600" />
            Add New Customer
          </DialogTitle>
          <DialogDescription>
            Add a new customer to your database for invoicing
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <User size={18} />
                Basic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company/Customer Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Acme Corporation"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="billing@company.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1-555-0123"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID</Label>
                  <Input
                    id="taxId"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder="TAX123456789"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Address Information</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Business Ave"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="New York"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="NY"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                    <Input
                      id="zipCode"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="10001"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USA">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Settings */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Payment Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Payment Terms (Days)</Label>
                  <Select value={paymentTerms.toString()} onValueChange={(value) => setPaymentTerms(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">Net 15</SelectItem>
                      <SelectItem value="30">Net 30</SelectItem>
                      <SelectItem value="45">Net 45</SelectItem>
                      <SelectItem value="60">Net 60</SelectItem>
                      <SelectItem value="90">Net 90</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="creditLimit">Credit Limit ($)</Label>
                  <Input
                    id="creditLimit"
                    type="number"
                    value={creditLimit || ''}
                    onChange={(e) => setCreditLimit(e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="50000"
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="isActive">Active Customer</Label>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-900 mb-3">Customer Preview</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {name || 'Customer Name'}</p>
                <p><strong>Email:</strong> {email || 'customer@email.com'}</p>
                {phone && <p><strong>Phone:</strong> {phone}</p>}
                {address && <p><strong>Address:</strong> {address}, {city}, {state} {zipCode}</p>}
                <p><strong>Payment Terms:</strong> Net {paymentTerms} days</p>
                {creditLimit && <p><strong>Credit Limit:</strong> ${creditLimit.toLocaleString()}</p>}
                <p><strong>Status:</strong> {isActive ? 'Active' : 'Inactive'}</p>
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isProcessing || !name || !email}>
              {isProcessing ? 'Adding...' : 'Add Customer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};