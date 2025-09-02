'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Handshake, Scale, Calculator, UserCheck, Truck, Shield, Megaphone, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const documentCategories = [
  {
    id: 'business-relationship',
    title: 'Business Relationship Documents',
    description: 'Letters of Intent, MOUs, Partnership Agreements, and Business Proposals',
    icon: <Handshake size={24} />,
    color: 'bg-blue-50 text-blue-600',
    borderColor: 'border-blue-200',
    documents: [
      { name: 'Letters of Intent (LOI)', href: '/documents/loi', badge: 'Popular' },
      { name: 'Memorandum of Understanding (MOU)', href: '/documents/mou', badge: 'New' },
      { name: 'Partnership Agreements', href: '/documents/partnership', badge: null },
      { name: 'Business Proposals', href: '/documents/proposals', badge: null },
      { name: 'Non-Disclosure Agreements (NDA)', href: '/documents/nda', badge: null },
    ]
  },
  {
    id: 'sales-documents',
    title: 'Sales Documents',
    description: 'Quotations, Purchase Orders, Invoices, and Sales Agreements',
    icon: <Calculator size={24} />,
    color: 'bg-green-50 text-green-600',
    borderColor: 'border-green-200',
    documents: [
      { name: 'Quotation/Estimate', href: '/documents/quotation', badge: 'Popular' },
      { name: 'Purchase Order (PO)', href: '/documents/purchase-order', badge: null },
      { name: 'Sales Order (SO)', href: '/documents/sales-order', badge: null },
      { name: 'Invoice', href: '/documents/invoice', badge: null },
      { name: 'Receipt', href: '/documents/receipt', badge: null },
    ]
  },
  {
    id: 'legal-documents',
    title: 'Contract & Legal Documents',
    description: 'Service Agreements, Employment Contracts, and Legal Documents',
    icon: <Scale size={24} />,
    color: 'bg-red-50 text-red-600',
    borderColor: 'border-red-200',
    documents: [
      { name: 'Service Agreement', href: '/documents/service-agreement', badge: null },
      { name: 'Employment Contract', href: '/documents/employment-contract', badge: null },
      { name: 'Vendor/Supplier Agreement', href: '/documents/vendor-agreement', badge: null },
      { name: 'Lease Agreement', href: '/documents/lease-agreement', badge: null },
    ]
  },
  {
    id: 'hr-documents',
    title: 'HR & Employee Documents',
    description: 'Offer Letters, Employee Handbooks, Payslips, and Performance Reviews',
    icon: <UserCheck size={24} />,
    color: 'bg-orange-50 text-orange-600',
    borderColor: 'border-orange-200',
    documents: [
      { name: 'Offer Letter / Appointment Letter', href: '/documents/offer-letter', badge: 'Featured' },
      { name: 'Employee Handbook / HR Policy', href: '/documents/handbook', badge: null },
      { name: 'Payslips & Salary Registers', href: '/documents/payslips', badge: null },
      { name: 'Performance Appraisals', href: '/documents/performance', badge: null },
    ]
  },
  {
    id: 'operations-documents',
    title: 'Operations & Logistics Documents',
    description: 'Bill of Lading, Consignment Notes, Stock Registers, and Quality Certificates',
    icon: <Truck size={24} />,
    color: 'bg-indigo-50 text-indigo-600',
    borderColor: 'border-indigo-200',
    documents: [
      { name: 'Bill of Lading (BOL)', href: '/documents/bill-of-lading', badge: null },
      { name: 'Consignment Note / Waybill', href: '/documents/consignment', badge: null },
      { name: 'Stock Register / Inventory Sheets', href: '/documents/stock-register', badge: null },
      { name: 'Quality Assurance Certificates', href: '/documents/quality-certificates', badge: null },
    ]
  },
  {
    id: 'compliance-documents',
    title: 'Compliance & Legal Documents',
    description: 'Business Registration, Licenses, Insurance Policies, and Board Resolutions',
    icon: <Shield size={24} />,
    color: 'bg-teal-50 text-teal-600',
    borderColor: 'border-teal-200',
    documents: [
      { name: 'Business Registration Certificates', href: '/documents/registration', badge: null },
      { name: 'Licenses & Permits', href: '/documents/licenses', badge: null },
      { name: 'Insurance Policies', href: '/documents/insurance', badge: null },
      { name: 'Board Resolutions & Meeting Minutes', href: '/documents/board-resolutions', badge: null },
    ]
  }
];

export default function DocumentsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileText className="w-8 h-8 mr-3 text-blue-600" />
            Document Management System
          </h1>
          <p className="text-gray-600 mt-1">Generate, manage, and organize all your business documents in one place</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="outline">
            📊 Document Analytics
          </Button>
          <Button>
            📁 My Documents
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Templates</p>
                <p className="text-2xl font-bold text-gray-900">45+</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText size={20} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Generated This Month</p>
                <p className="text-2xl font-bold text-green-600">127</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <ArrowRight size={20} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-purple-600">6</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Megaphone size={20} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saved Drafts</p>
                <p className="text-2xl font-bold text-orange-600">23</p>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg">
                <FileText size={20} className="text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {documentCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={`h-full border-2 ${category.borderColor} hover:shadow-lg transition-shadow`}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                    <p className="text-sm text-gray-600 font-normal">{category.description}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {category.documents.map((doc) => (
                    <Link key={doc.name} href={doc.href}>
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-gray-400 rounded-full group-hover:bg-blue-500 transition-colors"></div>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                            {doc.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {doc.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {doc.badge}
                            </Badge>
                          )}
                          <ArrowRight size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Generated Documents</CardTitle>
          <CardDescription>Your latest document generation activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Partnership Agreement - TechCorp', type: 'Business Relationship', date: '2 hours ago', status: 'Completed' },
              { name: 'Service Agreement - ClientXYZ', type: 'Legal Document', date: '1 day ago', status: 'Draft' },
              { name: 'Purchase Order #PO-2024-001', type: 'Sales Document', date: '2 days ago', status: 'Completed' },
              { name: 'Employee Offer Letter - John Doe', type: 'HR Document', date: '3 days ago', status: 'Completed' },
            ].map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{doc.name}</h4>
                    <p className="text-sm text-gray-600">{doc.type} • {doc.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={doc.status === 'Completed' ? 'default' : 'secondary'}>
                    {doc.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}