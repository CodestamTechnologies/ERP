export interface PartyInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  representative: string;
  title: string;
  signerName: string;
  signerTitle: string;
  signerDate: string;
}

export interface MOUData {
  date: string;
  title: string;
  purpose: string;
  background: string;
  objectives: string;
  scopeOfWork: string;
  responsibilities: string;
  duration: string;
  effectiveDate: string;
  terminationClause: string;
  confidentiality: string;
  intellectualProperty: string;
  disputeResolution: string;
  governingLaw: string;
  amendments: string;
}

export interface AgreementData {
  mou: MOUData;
  partyA: PartyInfo;
  partyB: PartyInfo;
}