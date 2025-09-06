export interface CompanyInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  website: string;
  logo?: string;
}

export interface CandidateInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface JobDetails {
  title: string;
  department: string;
  reportingManager: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Temporary' | 'Internship';
  startDate: string;
  workLocation: 'Office' | 'Remote' | 'Hybrid';
  workSchedule: string;
}

export interface CompensationDetails {
  baseSalary: string;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  payFrequency: 'Monthly' | 'Bi-weekly' | 'Weekly' | 'Annually';
  bonus: string;
  stockOptions: string;
  otherCompensation: string;
}

export interface BenefitsPackage {
  healthInsurance: boolean;
  dentalInsurance: boolean;
  visionInsurance: boolean;
  lifeInsurance: boolean;
  retirementPlan: boolean;
  paidTimeOff: string;
  sickLeave: string;
  maternityPaternityLeave: string;
  professionalDevelopment: boolean;
  gymMembership: boolean;
  flexibleWorkArrangements: boolean;
  otherBenefits: string;
}

export interface OfferTerms {
  probationPeriod: '3 months' | '6 months' | '12 months' | 'No probation';
  noticePeriod: '15 days' | '30 days' | '60 days' | '90 days';
  confidentialityAgreement: boolean;
  nonCompeteClause: boolean;
  nonSolicitationClause: boolean;
  backgroundCheck: boolean;
  drugTest: boolean;
  offerValidUntil: string;
  additionalTerms: string;
}

export interface OfferLetterData {
  company: CompanyInfo;
  candidate: CandidateInfo;
  job: JobDetails;
  compensation: CompensationDetails;
  benefits: BenefitsPackage;
  terms: OfferTerms;
  letterDate: string;
  signerName: string;
  signerTitle: string;
  hrContactName: string;
  hrContactEmail: string;
  hrContactPhone: string;
}

export interface OfferLetterTemplate {
  id: string;
  name: string;
  description: string;
  data: Partial<OfferLetterData>;
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
}

export interface OfferLetterHistory {
  id: string;
  candidateName: string;
  jobTitle: string;
  department: string;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Declined' | 'Expired';
  createdAt: string;
  sentAt?: string;
  respondedAt?: string;
  data: OfferLetterData;
}