import { 
  FileText, 
  Handshake, 
  Scale, 
  Calculator, 
  UserCheck, 
  Truck, 
  Shield, 
  Megaphone,
  ShoppingCart,
  Award
} from 'lucide-react';
import { SecondarySidebarConfig } from '@/components/layout/SecondarySidebar';

export const documentsServicesConfig: SecondarySidebarConfig = {
  title: 'Document Management',
  icon: <FileText size={20} />,
  iconBgColor: 'bg-blue-100',
  iconColor: 'text-blue-600',
  stats: [
    {
      label: 'Templates',
      value: '45+',
      icon: <FileText size={16} />,
      color: 'text-blue-400'
    },
    {
      label: 'Generated',
      value: '127',
      icon: <FileText size={16} />,
      color: 'text-green-400'
    },
    {
      label: 'Active Docs',
      value: '89',
      icon: <FileText size={16} />,
      color: 'text-purple-400'
    },
    {
      label: 'Categories',
      value: '6',
      icon: <FileText size={16} />,
      color: 'text-orange-400'
    }
  ],
  sections: [
    {
      title: 'Business Relationship Documents',
      icon: <Handshake size={18} />,
      layout: 'list',
      options: [
        {
          id: 'loi',
          name: 'Letters of Intent (LOI)',
          icon: <span className="text-blue-600">•</span>,
          badge: 'Popular',
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/documents/brd/loi'
        },
        {
          id: 'mou',
          name: 'Memorandum of Understanding (MOU)',
          icon: <span className="text-green-600">•</span>,
          badge: 'New',
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          href: '/documents/brd/mou'
        },
        {
          id: 'partnership',
          name: 'Partnership Agreements',
          icon: <span className="text-purple-600">•</span>,
          badge: null,
          color: 'text-purple-600',
          bgColor: 'hover:bg-purple-50',
          href: '/documents/brd/partnership'
        }
      ]
    },
    {
      title: 'Sales Documents',
      icon: <ShoppingCart size={18} />,
      layout: 'list',
      options: [
        {
          id: 'quotation',
          name: 'Quotation/Estimate',
          icon: <span className="text-green-600">•</span>,
          badge: 'Popular',
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          href: '/documents/sales/quotation'
        },
        {
          id: 'purchase-order',
          name: 'Purchase Order (PO)',
          icon: <span className="text-blue-600">•</span>,
          badge: null,
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/documents/sales/purchase-order'
        },
        {
          id: 'sales-order',
          name: 'Sales Order (SO)',
          icon: <span className="text-indigo-600">•</span>,
          badge: null,
          color: 'text-indigo-600',
          bgColor: 'hover:bg-indigo-50',
          href: '/documents/sales/sales-order'
        },
        {
          id: 'invoice',
          name: 'Invoice',
          icon: <span className="text-orange-600">•</span>,
          badge: null,
          color: 'text-orange-600',
          bgColor: 'hover:bg-orange-50',
          href: '/documents/sales/invoice'
        }
      ]
    },
    {
      title: 'Contract & Legal Documents',
      icon: <Scale size={18} />,
      layout: 'list',
      options: [
        {
          id: 'service-agreement',
          name: 'Service Agreement',
          icon: <span className="text-blue-600">•</span>,
          badge: null,
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/documents/legal/service-agreement'
        },
        {
          id: 'employment-contract',
          name: 'Employment Contract',
          icon: <span className="text-green-600">•</span>,
          badge: null,
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          href: '/documents/legal/employment-contract'
        },
        {
          id: 'vendor-agreement',
          name: 'Vendor/Supplier Agreement',
          icon: <span className="text-purple-600">•</span>,
          badge: null,
          color: 'text-purple-600',
          bgColor: 'hover:bg-purple-50',
          href: '/documents/legal/vendor-agreement'
        }
      ]
    },
    {
      title: 'HR & Employee Documents',
      icon: <UserCheck size={18} />,
      layout: 'list',
      options: [
        {
          id: 'offer-letter',
          name: 'Offer Letter / Appointment Letter',
          icon: <span className="text-orange-600">•</span>,
          badge: 'Featured',
          color: 'text-orange-600',
          bgColor: 'hover:bg-orange-50',
          href: '/documents/hr/offer-letter'
        },
        {
          id: 'handbook',
          name: 'Employee Handbook / HR Policy',
          icon: <span className="text-blue-600">•</span>,
          badge: null,
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/documents/hr/handbook'
        },
        {
          id: 'payslips',
          name: 'Payslips & Salary Registers',
          icon: <span className="text-green-600">•</span>,
          badge: null,
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          href: '/documents/hr/payslips'
        },
        {
          id: 'performance',
          name: 'Performance Appraisals',
          icon: <span className="text-purple-600">•</span>,
          badge: null,
          color: 'text-purple-600',
          bgColor: 'hover:bg-purple-50',
          href: '/documents/hr/performance'
        }
      ]
    },
    {
      title: 'Operations & Logistics Documents',
      icon: <Truck size={18} />,
      layout: 'list',
      options: [
        {
          id: 'bill-of-lading',
          name: 'Bill of Lading (BOL)',
          icon: <span className="text-blue-600">•</span>,
          badge: null,
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/documents/operations/bill-of-lading'
        },
        {
          id: 'consignment',
          name: 'Consignment Note / Waybill',
          icon: <span className="text-green-600">•</span>,
          badge: null,
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          href: '/documents/operations/consignment'
        },
        {
          id: 'stock-register',
          name: 'Stock Register / Inventory Sheets',
          icon: <span className="text-purple-600">•</span>,
          badge: null,
          color: 'text-purple-600',
          bgColor: 'hover:bg-purple-50',
          href: '/documents/operations/stock-register'
        }
      ]
    },
    {
      title: 'Compliance & Legal Documents',
      icon: <Shield size={18} />,
      layout: 'list',
      options: [
        {
          id: 'registration',
          name: 'Business Registration Certificates',
          icon: <span className="text-red-600">•</span>,
          badge: null,
          color: 'text-red-600',
          bgColor: 'hover:bg-red-50',
          href: '/documents/compliance/registration'
        },
        {
          id: 'licenses',
          name: 'Licenses & Permits',
          icon: <span className="text-orange-600">•</span>,
          badge: null,
          color: 'text-orange-600',
          bgColor: 'hover:bg-orange-50',
          href: '/documents/compliance/licenses'
        },
        {
          id: 'insurance',
          name: 'Insurance Policies',
          icon: <span className="text-indigo-600">•</span>,
          badge: null,
          color: 'text-indigo-600',
          bgColor: 'hover:bg-indigo-50',
          href: '/documents/compliance/insurance'
        }
      ]
    }
  ],
  accountInfo: {
    name: 'Document Management System',
    status: 'All templates active and ready',
    statusColor: 'bg-blue-500'
  }
};