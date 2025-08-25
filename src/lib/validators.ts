// Form validation utilities
import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address');
export const phoneSchema = z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number');
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

// Auth validation schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  role: z.string().min(1, 'Role is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Employee validation schema
export const employeeSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: emailSchema,
  phone: phoneSchema,
  department: z.string().min(1, 'Department is required'),
  position: z.string().min(1, 'Position is required'),
  salary: z.number().positive('Salary must be positive'),
  hireDate: z.date(),
  status: z.enum(['active', 'inactive', 'terminated']),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  emergencyContact: z.object({
    name: z.string().min(1, 'Emergency contact name is required'),
    relationship: z.string().min(1, 'Relationship is required'),
    phone: phoneSchema,
  }),
});

// Customer validation schema
export const customerSchema = z.object({
  type: z.enum(['individual', 'business']),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  companyName: z.string().optional(),
  email: emailSchema,
  phone: phoneSchema,
  website: z.string().url().optional().or(z.literal('')),
  industry: z.string().optional(),
  taxId: z.string().optional(),
  paymentTerms: z.string().min(1, 'Payment terms are required'),
  creditLimit: z.number().min(0, 'Credit limit must be non-negative'),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
}).refine((data) => {
  if (data.type === 'individual') {
    return data.firstName && data.lastName;
  } else {
    return data.companyName;
  }
}, {
  message: 'Either first/last name or company name is required',
  path: ['firstName'],
});

// Product validation schema
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  barcode: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().optional(),
  unitOfMeasure: z.string().min(1, 'Unit of measure is required'),
  costPrice: z.number().min(0, 'Cost price must be non-negative'),
  sellingPrice: z.number().min(0, 'Selling price must be non-negative'),
  weight: z.number().min(0).optional(),
  dimensions: z.object({
    length: z.number().min(0),
    width: z.number().min(0),
    height: z.number().min(0),
  }).optional(),
  minStockLevel: z.number().min(0, 'Minimum stock level must be non-negative'),
  maxStockLevel: z.number().min(0, 'Maximum stock level must be non-negative'),
  reorderPoint: z.number().min(0, 'Reorder point must be non-negative'),
  reorderQuantity: z.number().min(0, 'Reorder quantity must be non-negative'),
}).refine((data) => data.sellingPrice >= data.costPrice, {
  message: 'Selling price must be greater than or equal to cost price',
  path: ['sellingPrice'],
}).refine((data) => data.maxStockLevel >= data.minStockLevel, {
  message: 'Maximum stock level must be greater than or equal to minimum stock level',
  path: ['maxStockLevel'],
});

// Invoice validation schema
export const invoiceSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  issueDate: z.date(),
  dueDate: z.date(),
  items: z.array(z.object({
    description: z.string().min(1, 'Item description is required'),
    quantity: z.number().positive('Quantity must be positive'),
    unitPrice: z.number().min(0, 'Unit price must be non-negative'),
  })).min(1, 'At least one item is required'),
  tax: z.number().min(0, 'Tax must be non-negative'),
  discount: z.number().min(0, 'Discount must be non-negative'),
  paymentTerms: z.string().min(1, 'Payment terms are required'),
  notes: z.string().optional(),
}).refine((data) => data.dueDate >= data.issueDate, {
  message: 'Due date must be after issue date',
  path: ['dueDate'],
});

// Expense validation schema
export const expenseSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  amount: z.number().positive('Amount must be positive'),
  date: z.date(),
  paymentMethod: z.enum(['cash', 'card', 'bank_transfer', 'check']),
  vendor: z.string().optional(),
  receipt: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Order validation schema
export const orderSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  expectedDeliveryDate: z.date().optional(),
  items: z.array(z.object({
    productId: z.string().min(1, 'Product is required'),
    quantity: z.number().positive('Quantity must be positive'),
    unitPrice: z.number().min(0, 'Unit price must be non-negative'),
    discount: z.number().min(0, 'Discount must be non-negative'),
  })).min(1, 'At least one item is required'),
  shipping: z.number().min(0, 'Shipping cost must be non-negative'),
  tax: z.number().min(0, 'Tax must be non-negative'),
  discount: z.number().min(0, 'Discount must be non-negative'),
  shippingAddress: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  notes: z.string().optional(),
});

// Supplier validation schema
export const supplierSchema = z.object({
  name: z.string().min(1, 'Supplier name is required'),
  code: z.string().min(1, 'Supplier code is required'),
  contactPerson: z.string().min(1, 'Contact person is required'),
  email: emailSchema,
  phone: phoneSchema,
  website: z.string().url().optional().or(z.literal('')),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  paymentTerms: z.string().min(1, 'Payment terms are required'),
  currency: z.string().min(1, 'Currency is required'),
  taxId: z.string().optional(),
  rating: z.number().min(1).max(5),
});

// Validation helper functions
export const validateSchema = <T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
} => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'Validation failed' } };
  }
};

export const getFieldError = (errors: Record<string, string> | undefined, field: string): string | undefined => {
  return errors?.[field];
};

export const hasFieldError = (errors: Record<string, string> | undefined, field: string): boolean => {
  return Boolean(errors?.[field]);
};