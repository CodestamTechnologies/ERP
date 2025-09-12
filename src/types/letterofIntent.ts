// letterOfIntent.ts

export interface PartyInfo {
  company: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
}

export interface RecipientInfo extends PartyInfo {
  name: string;
  title: string;
}

export interface LOIData {
  date: string;
  subject: string;
  projectDescription: string;
  proposedTerms: string;
  timeline: string;
  budget: string;
  nextSteps: string;
  validityPeriod: string;
  signerName: string;
  signerTitle: string;
  signerDate: string;
}

export interface AgreementData {
  loi: LOIData;
  sender: PartyInfo;
  recipient: RecipientInfo;
}

export const initialSenderData = (): PartyInfo => ({
  company: 'Codestam Technologies Pvt Ltd',
  address: '123 Business Park',
  city: 'Mumbai',
  state: 'Maharashtra',
  zip: '400001',
  phone: '+91 98765 43210',
  email: 'info@codestam.com',
});

export const initialRecipientData = (): RecipientInfo => ({
  company: '',
  name: '',
  title: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  email: '',
});

export const initialLOIData = (): LOIData => ({
  date: new Date().toISOString().split('T')[0],
  subject: '',
  projectDescription: '',
  proposedTerms: '',
  timeline: '',
  budget: '',
  nextSteps: '',
  validityPeriod: '30 days',
  signerName: '',
  signerTitle: '',
  signerDate: new Date().toISOString().split('T')[0],
});
