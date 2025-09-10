import { 
  BarChart3, 
  Handshake,
  ShoppingCart,
  Scale,
  Calculator,
  UserCheck,
  Truck,
  Shield,
  Megaphone
} from 'lucide-react';
import { SecondarySidebarConfig } from '@/components/layout/SecondarySidebar';

export const reportsServicesConfig: SecondarySidebarConfig = {
  title: 'Document Types',
  icon: <BarChart3 size={20} />,
  iconBgColor: 'bg-purple-100',
  iconColor: 'text-purple-600',
  sections: [
    {
      title: 'Business Relationship Documents',
      icon: <Handshake size={18} />,
      layout: 'list',
      options: [
        {
          id: 'letters-of-intent',
          name: 'Letters of Intent (LOI)',
          icon: <span className="text-blue-600">•</span>,
          badge: null,
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/documents/brd/loi'
        },
        {
          id: 'memorandum-understanding',
          name: 'Memorandum of Understanding (MOU)',
          icon: <span className="text-blue-600">•</span>,
          badge: null,
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/documents/brd/mou'
        },
        {
          id: 'partnership-agreements',
          name: 'Partnership Agreements',
          icon: <span className="text-blue-600">•</span>,
          badge: null,
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/documents/brd/partnership'
        },
        {
          id: 'business-proposals',
          name: 'Business Proposals',
          icon: <span className="text-blue-600">•</span>,
          badge: null,
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/reports'
        },
        {
          id: 'business-correspondence',
          name: 'Business Correspondence',
          icon: <span className="text-blue-600">•</span>,
          badge: null,
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/reports'
        },
        {
          id: 'non-disclosure-agreements',
          name: 'Non-Disclosure Agreements (NDA)',
          icon: <span className="text-blue-600">•</span>,
          badge: null,
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/reports'
        }
      ]
    },
    {
      title: 'Sales Documents',
      icon: <ShoppingCart size={18} />,
      layout: 'list',
      options: [
        {
          id: 'quotation-estimate',
          name: 'Quotation/Estimate',
          icon: <span className="text-green-600">•</span>,
          badge: 'Popular',
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          href: '/reports'
        },
        {
          id: 'purchase-order',
          name: 'Purchase Order (PO)',
          icon: <span className="text-green-600">•</span>,
          badge: null,
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          href: '/reports'
        },
        {
          id: 'sales-order',
          name: 'Sales Order (SO)',
          icon: <span className="text-green-600">•</span>,
          badge: null,
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          href: '/reports'
        },
        {
          id: 'invoice',
          name: 'Invoice',
          icon: <span className="text-green-600">•</span>,
          badge: null,
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          href: '/reports'
        },
        {
          id: 'receipt',
          name: 'Receipt',
          icon: <span className="text-green-600">•</span>,
          badge: null,
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          href: '/reports'
        },
        {
          id: 'delivery-note',
          name: 'Delivery Note / Challan',
          icon: <span className="text-green-600">•</span>,
          badge: null,
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          href: '/reports'
        },
        {
          id: 'credit-debit-note',
          name: 'Credit Note / Debit Note',
          icon: <span className="text-green-600">•</span>,
          badge: null,
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          href: '/reports'
        },
        {
          id: 'sales-agreement',
          name: 'Sales Agreement',
          icon: <span className="text-green-600">•</span>,
          badge: null,
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          href: '/reports'
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
          icon: <span className="text-red-600">•</span>,
          badge: null,
          color: 'text-red-600',
          bgColor: 'hover:bg-red-50',
          href: '/reports'
        },
        {
          id: 'employment-contract',
          name: 'Employment Contract',
          icon: <span className="text-red-600">•</span>,
          badge: null,
          color: 'text-red-600',
          bgColor: 'hover:bg-red-50',
          href: '/reports'
        },
        {
          id: 'vendor-supplier-agreement',
          name: 'Vendor/Supplier Agreement',
          icon: <span className="text-red-600">•</span>,
          badge: null,
          color: 'text-red-600',
          bgColor: 'hover:bg-red-50',
          href: '/reports'
        },
        {
          id: 'franchise-agreement',
          name: 'Franchise Agreement',
          icon: <span className="text-red-600">•</span>,
          badge: null,
          color: 'text-red-600',
          bgColor: 'hover:bg-red-50',
          href: '/reports'
        },
        {
          id: 'lease-agreement',
          name: 'Lease Agreement',
          icon: <span className="text-red-600">•</span>,
          badge: null,
          color: 'text-red-600',
          bgColor: 'hover:bg-red-50',
          href: '/reports'
        },
        {
          id: 'joint-venture-agreement',
          name: 'Joint Venture Agreement',
          icon: <span className="text-red-600">•</span>,
          badge: null,
          color: 'text-red-600',
          bgColor: 'hover:bg-red-50',
          href: '/reports'
        },
        {
          id: 'master-service-agreement',
          name: 'Master Service Agreement (MSA)',
          icon: <span className="text-red-600">•</span>,
          badge: null,
          color: 'text-red-600',
          bgColor: 'hover:bg-red-50',
          href: '/reports'
        }
      ]
    },
    {
      title: 'Financial & Accounting Documents',
      icon: <Calculator size={18} />,
      layout: 'list',
      options: [
        {
          id: 'balance-sheet',
          name: 'Balance Sheet',
          icon: <span className="text-purple-600">•</span>,
          badge: null,
          color: 'text-purple-600',
          bgColor: 'hover:bg-purple-50',
          href: '/reports'
        },
        {
          id: 'profit-loss-statement',
          name: 'Profit & Loss Statement',
          icon: <span className="text-purple-600">•</span>,
          badge: null,
          color: 'text-purple-600',
          bgColor: 'hover:bg-purple-50',
          href: '/reports'
        },
        {
          id: 'cash-flow-statement',
          name: 'Cash Flow Statement',
          icon: <span className="text-purple-600">•</span>,
          badge: null,
          color: 'text-purple-600',
          bgColor: 'hover:bg-purple-50',
          href: '/reports'
        },
        {
          id: 'bank-statements',
          name: 'Bank Statements',
          icon: <span className="text-purple-600">•</span>,
          badge: null,
          color: 'text-purple-600',
          bgColor: 'hover:bg-purple-50',
          href: '/reports'
        },
        {
          id: 'tax-returns',
          name: 'Tax Returns & Tax Invoices',
          icon: <span className="text-purple-600">•</span>,
          badge: null,
          color: 'text-purple-600',
          bgColor: 'hover:bg-purple-50',
          href: '/reports'
        },
        {
          id: 'expense-reports',
          name: 'Expense Reports & Vouchers',
          icon: <span className="text-purple-600">•</span>,
          badge: null,
          color: 'text-purple-600',
          bgColor: 'hover:bg-purple-50',
          href: '/reports'
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
          badge: null,
          color: 'text-orange-600',
          bgColor: 'hover:bg-orange-50',
          href: '/reports'
        },
        {
          id: 'employee-handbook',
          name: 'Employee Handbook / HR Policy',
          icon: <span className="text-orange-600">•</span>,
          badge: null,
          color: 'text-orange-600',
          bgColor: 'hover:bg-orange-50',
          href: '/reports'
        },
        {
          id: 'payslips',
          name: 'Payslips & Salary Registers',
          icon: <span className="text-orange-600">•</span>,
          badge: null,
          color: 'text-orange-600',
          bgColor: 'hover:bg-orange-50',
          href: '/reports'
        },
        {
          id: 'performance-appraisals',
          name: 'Performance Appraisals',
          icon: <span className="text-orange-600">•</span>,
          badge: null,
          color: 'text-orange-600',
          bgColor: 'hover:bg-orange-50',
          href: '/reports'
        },
        {
          id: 'termination-letters',
          name: 'Termination/Resignation Letters',
          icon: <span className="text-orange-600">•</span>,
          badge: null,
          color: 'text-orange-600',
          bgColor: 'hover:bg-orange-50',
          href: '/reports'
        },
        {
          id: 'leave-applications',
          name: 'Leave Applications / Attendance',
          icon: <span className="text-orange-600">•</span>,
          badge: null,
          color: 'text-orange-600',
          bgColor: 'hover:bg-orange-50',
          href: '/reports'
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
          icon: <span className="text-indigo-600">•</span>,
          badge: null,
          color: 'text-indigo-600',
          bgColor: 'hover:bg-indigo-50',
          href: '/reports'
        },
        {
          id: 'consignment-note',
          name: 'Consignment Note / Waybill',
          icon: <span className="text-indigo-600">•</span>,
          badge: null,
          color: 'text-indigo-600',
          bgColor: 'hover:bg-indigo-50',
          href: '/reports'
        },
        {
          id: 'stock-register',
          name: 'Stock Register / Inventory Sheets',
          icon: <span className="text-indigo-600">•</span>,
          badge: null,
          color: 'text-indigo-600',
          bgColor: 'hover:bg-indigo-50',
          href: '/reports'
        },
        {
          id: 'quality-certificates',
          name: 'Quality Assurance Certificates',
          icon: <span className="text-indigo-600">•</span>,
          badge: null,
          color: 'text-indigo-600',
          bgColor: 'hover:bg-indigo-50',
          href: '/reports'
        },
        {
          id: 'maintenance-logs',
          name: 'Maintenance Logs',
          icon: <span className="text-indigo-600">•</span>,
          badge: null,
          color: 'text-indigo-600',
          bgColor: 'hover:bg-indigo-50',
          href: '/reports'
        }
      ]
    },
    {
      title: 'Compliance & Legal Documents',
      icon: <Shield size={18} />,
      layout: 'list',
      options: [
        {
          id: 'business-registration',
          name: 'Business Registration Certificates',
          icon: <span className="text-teal-600">•</span>,
          badge: null,
          color: 'text-teal-600',
          bgColor: 'hover:bg-teal-50',
          href: '/reports'
        },
        {
          id: 'licenses-permits',
          name: 'Licenses & Permits',
          icon: <span className="text-teal-600">•</span>,
          badge: null,
          color: 'text-teal-600',
          bgColor: 'hover:bg-teal-50',
          href: '/reports'
        },
        {
          id: 'insurance-policies',
          name: 'Insurance Policies',
          icon: <span className="text-teal-600">•</span>,
          badge: null,
          color: 'text-teal-600',
          bgColor: 'hover:bg-teal-50',
          href: '/reports'
        },
        {
          id: 'board-resolutions',
          name: 'Board Resolutions & Meeting Minutes',
          icon: <span className="text-teal-600">•</span>,
          badge: null,
          color: 'text-teal-600',
          bgColor: 'hover:bg-teal-50',
          href: '/reports'
        },
        {
          id: 'privacy-policies',
          name: 'Data Protection & Privacy Policies',
          icon: <span className="text-teal-600">•</span>,
          badge: null,
          color: 'text-teal-600',
          bgColor: 'hover:bg-teal-50',
          href: '/reports'
        }
      ]
    },
    {
      title: 'Marketing & Customer Documents',
      icon: <Megaphone size={18} />,
      layout: 'list',
      options: [
        {
          id: 'brochures-catalogs',
          name: 'Brochures, Catalogs, Flyers',
          icon: <span className="text-pink-600">•</span>,
          badge: 'New',
          color: 'text-pink-600',
          bgColor: 'hover:bg-pink-50',
          href: '/reports'
        },
        {
          id: 'customer-feedback',
          name: 'Customer Feedback Forms & Surveys',
          icon: <span className="text-pink-600">•</span>,
          badge: null,
          color: 'text-pink-600',
          bgColor: 'hover:bg-pink-50',
          href: '/reports'
        },
        {
          id: 'case-studies',
          name: 'Case Studies / Testimonials',
          icon: <span className="text-pink-600">•</span>,
          badge: null,
          color: 'text-pink-600',
          bgColor: 'hover:bg-pink-50',
          href: '/reports'
        },
        {
          id: 'marketing-agreements',
          name: 'Marketing Agreements',
          icon: <span className="text-pink-600">•</span>,
          badge: null,
          color: 'text-pink-600',
          bgColor: 'hover:bg-pink-50',
          href: '/reports'
        },
        {
          id: 'newsletters',
          name: 'Newsletters & Press Releases',
          icon: <span className="text-pink-600">•</span>,
          badge: null,
          color: 'text-pink-600',
          bgColor: 'hover:bg-pink-50',
          href: '/reports'
        }
      ]
    }
  ]
};