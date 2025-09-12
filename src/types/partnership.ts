
export interface PartnerInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  representative: string;
  title: string;
  contribution: string;
  ownershipPercentage: string;
  signerName: string;
  signerTitle: string;
  signerDate: string;
}

export interface PartnershipData {
  date: string;
  partnershipName: string;
  businessPurpose: string;
  businessAddress: string;
  businessCity: string;
  businessState: string;
  businessZip: string;
  partnershipType: string;
  effectiveDate: string;
  duration: string;
  initialCapital: string;
  profitSharingRatio: string;
  lossSharingRatio: string;
  capitalContributions: string;
  drawingLimits: string;
  managementStructure: string;
  decisionMaking: string;
  rolesResponsibilities: string;
  meetingRequirements: string;
  terminationClause: string;
  disputeResolution: string;
  nonCompeteClause: string;
  confidentialityClause: string;
  governingLaw: string;
  amendments: string;
}

export interface AgreementData {
  partnership: PartnershipData;
  partner1: PartnerInfo;
  partner2: PartnerInfo;
}
