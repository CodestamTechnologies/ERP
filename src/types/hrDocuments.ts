export interface CompanyInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  website?: string;
  panNumber?: string;
  pfNumber?: string;
  esiNumber?: string;
}

export interface EmployeeInfo {
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  dateOfJoining: string;
  reportingManager?: string;
  panNumber?: string;
  pfNumber?: string;
  esiNumber?: string;
  bankAccount?: string;
  bankName?: string;
  ifscCode?: string;
}

export interface BaseHRDocument extends Record<string, unknown> {
  company: CompanyInfo;
  employee: EmployeeInfo;
}

// Rating scale for performance evaluations
export type RatingScale = 1 | 2 | 3 | 4 | 5;

export interface RatingOption {
  value: string;
  label: string;
}

export const RATING_OPTIONS: RatingOption[] = [
  { value: '1', label: '1 - Unsatisfactory' },
  { value: '2', label: '2 - Below Expectations' },
  { value: '3', label: '3 - Meets Expectations' },
  { value: '4', label: '4 - Exceeds Expectations' },
  { value: '5', label: '5 - Outstanding' }
];

export const getRatingLabel = (rating: number): string => {
  if (rating >= 4.5) return 'Outstanding';
  if (rating >= 3.5) return 'Exceeds Expectations';
  if (rating >= 2.5) return 'Meets Expectations';
  if (rating >= 1.5) return 'Below Expectations';
  return 'Unsatisfactory';
};

export const DEFAULT_COMPANY: CompanyInfo = {
  name: 'Codestam Technologies Pvt Ltd',
  address: '123 Business Park',
  city: 'Mumbai',
  state: 'Maharashtra',
  zip: '400001',
  phone: '+91 98765 43210',
  email: 'info@codestam.com',
  website: 'www.codestam.com',
  panNumber: 'ABCDE1234F',
  pfNumber: 'MH/12345/67890',
  esiNumber: '12345678901234567'
};

export const DEFAULT_EMPLOYEE: EmployeeInfo = {
  employeeId: 'EMP001',
  name: '',
  designation: '',
  department: '',
  dateOfJoining: '',
  reportingManager: '',
  panNumber: '',
  pfNumber: '',
  esiNumber: '',
  bankAccount: '',
  bankName: '',
  ifscCode: ''
};