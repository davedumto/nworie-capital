export interface BorrowerInfo {
  guarantorFullName: string;
  guarantorEmail: string;
  phoneNumber: string;
  propertiesOwned: string | number;
  propertiesSold: string | number;
  totalExperience: string | number; 
  fico: string | number;
  socialSecurity: string;
  usCitizen: boolean;
  dateOfBirth: string;
  primaryResidenceAddress: string;
  ownOrRentPrimary: 'own' | 'rent';
  yearsAtPrimaryResidence: string | number;
  entityName: string;
  einNumber: string;
}

export interface PropertyInfo {
  subjectPropertyAddress: string;
  city: string;
  zipCode: string;
  propertyType: string;
  numberOfUnits: string | number;
  purchasePrice: string | number;
  asIsValue: string | number;
  purchaseDate: string;
  estimatedPayoff: string | number;
  rehabNeeded: string | number;
  rehabAlreadyCompleted: string | number;
  arv: string | number;
  hasComps: boolean;
  isPurchase: boolean;
  earnestMoneyDeposit: string | number; 
}

export interface PropertyDetails {
  liquidCashAvailable: string | number; 
  currentSquareFootage: string | number;
  afterRenovationSquareFootage: string | number;
  currentBedrooms?: string | number; 
  afterRenovationBedrooms?: string | number; // Optional
  currentBathrooms?: string | number; // Optional
  afterRenovationBathrooms?: string | number; // Optional
  monthlyIncome?: string | number; // Only mandatory for income loans
  isActualRent: boolean;
  hasActiveLease: boolean;
  annualTaxes: string | number; // Mandatory for income loans
  annualInsurance: string | number; // Mandatory for income loans
  annualFloodInsurance?: string | number;
  annualHOA?: string | number;
  propertyManager?: string; // Optional
  sponsorIntentToOccupy: boolean;
  existingLiens: boolean;
  existingLiensAmount: string | number;
  isIncomeLoan: boolean; // Determines if monthly income and expenses are required
}

// Processed types for calculations (numbers only)
export interface BorrowerInfoProcessed {
  guarantorFullName: string;
  guarantorEmail: string;
  phoneNumber: string;
  propertiesOwned: number;
  propertiesSold: number;
  totalExperience: number;
  fico: number;
  socialSecurity: string;
  usCitizen: boolean;
  dateOfBirth: string;
  primaryResidenceAddress: string;
  ownOrRentPrimary: 'own' | 'rent';
  yearsAtPrimaryResidence: number;
  entityName: string;
  einNumber: string;
}

export interface PropertyInfoProcessed {
  subjectPropertyAddress: string;
  city: string;
  zipCode: string;
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
  isPurchase: boolean;
  earnestMoneyDeposit: number;
}

export interface PropertyDetailsProcessed {
  liquidCashAvailable: number;
  currentSquareFootage: number;
  afterRenovationSquareFootage: number;
  currentBedrooms?: number;
  afterRenovationBedrooms?: number;
  currentBathrooms?: number;
  afterRenovationBathrooms?: number;
  monthlyIncome?: number;
  isActualRent: boolean;
  hasActiveLease: boolean;
  annualTaxes: number;
  annualInsurance: number;
  annualFloodInsurance?: number;
  annualHOA?: number;
  propertyManager?: string;
  sponsorIntentToOccupy: boolean;
  existingLiens: boolean;
  existingLiensAmount: number;
  isIncomeLoan: boolean;
}

export interface LoanProgram {
  id: string;
  name: string;
  purchaseWithRehab: boolean;
  purchaseWithoutRehab: boolean;
  refinanceWithRehab: boolean;
  refinanceWithoutRehab: boolean;
  allowedTerms: ('short' | 'long')[]; // Which terms are allowed for this program
}

export interface LoanTerm {
  id: string;
  name: string;
  months: number;
  isShortTerm: boolean;
}

export type InvestorTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

// New interface for available loan programs based on property type
export interface AvailableLoanPrograms {
  purchaseWithRehab: boolean;
  purchaseWithoutRehab: boolean;
  refinanceWithRehab: boolean;
  refinanceWithoutRehab: boolean;
  allowedTerms: {
    shortTerm: boolean;
    longTerm: boolean;
  };
}

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

// Combined loan application type for final submission
export interface LoanApplication {
  borrower: BorrowerInfoProcessed;
  property: PropertyInfoProcessed;
  details: PropertyDetailsProcessed;
  program: string;
  term: string;
  quote?: LoanQuote;
}