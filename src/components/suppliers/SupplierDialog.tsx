'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Supplier } from '@/types/supplier';
import { X, Plus } from 'lucide-react';

interface SupplierDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supplier: Partial<Supplier>) => void;
  supplier?: Supplier | null;
  mode: 'add' | 'edit' | 'view';
}

const CATEGORIES = [
  'Electronics',
  'Raw Materials',
  'Packaging',
  'Logistics',
  'Services',
  'Machinery'
];

const MARKETS = [
  'Electronics & Components',
  'Raw Materials & Chemicals',
  'Packaging & Printing',
  'Transportation & Logistics',
  'Professional Services',
  'Industrial Machinery',
  'Sustainable Packaging',
  'Electronic Components'
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
  { value: 'suspended', label: 'Suspended' }
];

export default function SupplierDialog({ isOpen, onClose, onSave, supplier, mode }: SupplierDialogProps) {
  const [formData, setFormData] = useState<Partial<Supplier>>({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    company: '',
    number: '',
    category: '',
    location: '',
    capacity: '',
    activeHours: '',
    market: '',
    status: 'active',
    rating: 0,
    paymentTerms: '30 days',
    tags: []
  });

  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (supplier && (mode === 'edit' || mode === 'view')) {
      setFormData(supplier);
    } else if (mode === 'add') {
      setFormData({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        company: '',
        number: '',
        category: '',
        location: '',
        capacity: '',
        activeHours: '',
        market: '',
        status: 'active',
        rating: 0,
        paymentTerms: '30 days',
        tags: []
      });
    }
  }, [supplier, mode]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.contactPerson?.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    if (!formData.phone?.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.company?.trim()) newErrors.company = 'Company is required';
    if (!formData.number?.trim()) newErrors.number = 'Supplier number is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.location?.trim()) newErrors.location = 'Location is required';
    if (!formData.capacity?.trim()) newErrors.capacity = 'Capacity is required';
    if (!formData.activeHours?.trim()) newErrors.activeHours = 'Active hours are required';
    if (!formData.market) newErrors.market = 'Market is required';

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'view') return;
    
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleInputChange = (field: keyof Supplier, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const isReadOnly = mode === 'view';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' && 'Add New Supplier'}
            {mode === 'edit' && 'Edit Supplier'}
            {mode === 'view' && 'Supplier Details'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' && 'Fill in the details to add a new supplier to your system.'}
            {mode === 'edit' && 'Update the supplier information below.'}
            {mode === 'view' && 'View detailed information about this supplier.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Supplier Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter supplier name"
                  disabled={isReadOnly}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={formData.company || ''}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Enter company name"
                  disabled={isReadOnly}
                  className={errors.company ? 'border-red-500' : ''}
                />
                {errors.company && <p className="text-sm text-red-500">{errors.company}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="number">Supplier Number *</Label>
                <Input
                  id="number"
                  value={formData.number || ''}
                  onChange={(e) => handleInputChange('number', e.target.value)}
                  placeholder="e.g., SUP001"
                  disabled={isReadOnly}
                  className={errors.number ? 'border-red-500' : ''}
                />
                {errors.number && <p className="text-sm text-red-500">{errors.number}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson || ''}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                  placeholder="Enter contact person name"
                  disabled={isReadOnly}
                  className={errors.contactPerson ? 'border-red-500' : ''}
                />
                {errors.contactPerson && <p className="text-sm text-red-500">{errors.contactPerson}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  disabled={isReadOnly}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  disabled={isReadOnly}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>
            </div>

            {/* Business Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category || ''}
                  onValueChange={(value) => handleInputChange('category', value)}
                  disabled={isReadOnly}
                >
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="market">Market *</Label>
                <Select
                  value={formData.market || ''}
                  onValueChange={(value) => handleInputChange('market', value)}
                  disabled={isReadOnly}
                >
                  <SelectTrigger className={errors.market ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select market" />
                  </SelectTrigger>
                  <SelectContent>
                    {MARKETS.map((market) => (
                      <SelectItem key={market} value={market}>
                        {market}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.market && <p className="text-sm text-red-500">{errors.market}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter location"
                  disabled={isReadOnly}
                  className={errors.location ? 'border-red-500' : ''}
                />
                {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  value={formData.capacity || ''}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  placeholder="e.g., 50,000 units/month"
                  disabled={isReadOnly}
                  className={errors.capacity ? 'border-red-500' : ''}
                />
                {errors.capacity && <p className="text-sm text-red-500">{errors.capacity}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="activeHours">Active Hours *</Label>
                <Input
                  id="activeHours"
                  value={formData.activeHours || ''}
                  onChange={(e) => handleInputChange('activeHours', e.target.value)}
                  placeholder="e.g., 9:00 AM - 6:00 PM IST"
                  disabled={isReadOnly}
                  className={errors.activeHours ? 'border-red-500' : ''}
                />
                {errors.activeHours && <p className="text-sm text-red-500">{errors.activeHours}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || 'active'}
                  onValueChange={(value) => handleInputChange('status', value)}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Input
                  id="paymentTerms"
                  value={formData.paymentTerms || ''}
                  onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                  placeholder="e.g., 30 days"
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags?.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {!isReadOnly && (
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline" size="sm">
                  <Plus size={16} />
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {mode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {!isReadOnly && (
              <Button type="submit">
                {mode === 'add' ? 'Add Supplier' : 'Update Supplier'}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}