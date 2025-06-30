// types/loan.ts
export interface BorrowerInfo {
  guarantorFullName: string;
  guarantorEmail: string;
  phoneNumber: string;
  investmentProperties: number;
  fico: number;
  experience: number; // Total flips completed in last 36 months
  socialSecurity: string;
  usCitizen: boolean;
  dateOfBirth: string;
  primaryResidenceAddress: string;
  ownOrRentPrimary: 'own' | 'rent';
  yearsAtPrimaryResidence: number;
  entityName: string;
  einNumber: string;
}

export interface PropertyInfo {
  subjectPropertyAddress: string;
  propertyType: string;
  numberOfUnits: number;
  purchasePrice: number;
  asIsValue: number;
  purchaseDate: string;
  estimatedPayoff: number;
  rehabNeeded: number;
  rehabAlreadyCompleted: number;
  arv: number;
  hasComps: boolean;
}

export interface PropertyDetails {
  loanAmountRequested: number;
  liquidCashAvailable: number;
  currentSquareFootage: number;
  afterRenovationSquareFootage: number;
  currentBedrooms: number;
  afterRenovationBedrooms: number;
  currentBathrooms: number;
  afterRenovationBathrooms: number;
  monthlyIncome: number;
  isActualRent: boolean;
  hasActiveLease: boolean;
  annualTaxes: number;
  annualInsurance: number;
  annualFloodInsurance: number;
  annualHOA: number;
  propertyManager: string;
  sponsorIntentToOccupy: boolean;
  existingLiens: boolean;
  existingLiensAmount: number;
}

export interface LoanProgram {
  id: string;
  name: string;
  purchaseWithRehab: boolean;
  purchaseWithoutRehab: boolean;
  refinanceWithRehab: boolean;
  refinanceWithoutRehab: boolean;
}

export interface LoanTerm {
  id: string;
  name: string;
  shortTermBridge: boolean;
  longTermRental: boolean;
}

export type InvestorTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface LoanQuote {
  loanProgram: string;
  purchasePrice: number;
  rehabBudget: number;
  arv: number;
  loanAmount: number;
  creditScore: number;
  investorTier: InvestorTier;
  interestRate: number;
  loanTerm: number;
  repaymentType: string;
  monthlyPayment: number;
  arvCap: number;
  initialAdvance: number;
  drawSchedule: string;
  paymentHoldback: number;
  monthlyEscrow: number;
  downPayment: number;
  earnestMoneyDeposit: number;
  fees: {
    originationFee: number;
    underwriting: number;
    docPrep: number;
    titleEstimate: number;
    taxEstimate: number;
    insuranceEstimate: number;
    closingFee: number;
    totalClosingCosts: number;
  };
  totalFromBorrower: number;
  liquidityRequired: number;
}
