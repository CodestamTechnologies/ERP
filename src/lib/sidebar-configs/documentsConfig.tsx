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

export const documentsServicesConfig = {
  title: 'Document Management',
  icon: <FileText size={20} />,
  iconBgColor: 'bg-blue-500',
  iconColor: 'text-white',
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
    }
  ],
  sections: [
    {
      title: 'Business Relationship Documents',
      icon: <Handshake size={18} />,
      options: [
        {
          id: 'loi',
          name: 'Letters of Intent (LOI)',
          icon: <FileText size={16} />,
          href: '/documents/brd/loi',
          badge: 'Popular'
        },
        {
          id: 'mou',
          name: 'Memorandum of Understanding (MOU)',
          icon: <FileText size={16} />,
          href: '/documents/brd/mou',
          badge: 'New'
        },
        {
          id: 'partnership',
          name: 'Partnership Agreements',
          icon: <FileText size={16} />,
          href: '/documents/brd/partnership'
        }
      ]
    },
    {
      title: 'Sales Documents',
      icon: <ShoppingCart size={18} />,
      options: [
        {
          id: 'quotation',
          name: 'Quotation/Estimate',
          icon: <Calculator size={16} />,
          href: '/documents/sales/quotation',
          badge: 'Popular'
        },
        {
          id: 'purchase-order',
          name: 'Purchase Order (PO)',
          icon: <FileText size={16} />,
          href: '/documents/sales/purchase-order'
        },
        {
          id: 'sales-order',
          name: 'Sales Order (SO)',
          icon: <FileText size={16} />,
          href: '/documents/sales/sales-order'
        },
        {
          id: 'invoice',
          name: 'Invoice',
          icon: <FileText size={16} />,
          href: '/documents/sales/invoice'
        }
      ]
    },
    {
      title: 'Contract & Legal Documents',
      icon: <Scale size={18} />,
      options: [
        {
          id: 'service-agreement',
          name: 'Service Agreement',
          icon: <Scale size={16} />,
          href: '/documents/legal/service-agreement'
        },
        {
          id: 'employment-contract',
          name: 'Employment Contract',
          icon: <FileText size={16} />,
          href: '/documents/legal/employment-contract'
        },
        {
          id: 'vendor-agreement',
          name: 'Vendor/Supplier Agreement',
          icon: <FileText size={16} />,
          href: '/documents/legal/vendor-agreement'
        }
      ]
    },
    {
      title: 'HR & Employee Documents',
      icon: <UserCheck size={18} />,
      options: [
        {
          id: 'offer-letter',
          name: 'Offer Letter / Appointment Letter',
          icon: <Award size={16} />,
          href: '/documents/hr/offer-letter',
          badge: 'Featured'
        },
        {
          id: 'handbook',
          name: 'Employee Handbook / HR Policy',
          icon: <FileText size={16} />,
          href: '/documents/hr/handbook'
        },
        {
          id: 'payslips',
          name: 'Payslips & Salary Registers',
          icon: <Calculator size={16} />,
          href: '/documents/hr/payslips'
        },
        {
          id: 'performance',
          name: 'Performance Appraisals',
          icon: <FileText size={16} />,
          href: '/documents/hr/performance'
        }
      ]
    },
    {
      title: 'Operations & Logistics Documents',
      icon: <Truck size={18} />,
      options: [
        {
          id: 'bill-of-lading',
          name: 'Bill of Lading (BOL)',
          icon: <Truck size={16} />,
          href: '/documents/operations/bill-of-lading'
        },
        {
          id: 'consignment',
          name: 'Consignment Note / Waybill',
          icon: <FileText size={16} />,
          href: '/documents/operations/consignment'
        },
        {
          id: 'stock-register',
          name: 'Stock Register / Inventory Sheets',
          icon: <FileText size={16} />,
          href: '/documents/operations/stock-register'
        }
      ]
    },
    {
      title: 'Compliance & Legal Documents',
      icon: <Shield size={18} />,
      options: [
        {
          id: 'registration',
          name: 'Business Registration Certificates',
          icon: <Shield size={16} />,
          href: '/documents/compliance/registration'
        },
        {
          id: 'licenses',
          name: 'Licenses & Permits',
          icon: <FileText size={16} />,
          href: '/documents/compliance/licenses'
        },
        {
          id: 'insurance',
          name: 'Insurance Policies',
          icon: <Shield size={16} />,
          href: '/documents/compliance/insurance'
        }
      ]
    }
  ]
};