export interface BorrowerInfo {
  guarantorFullName: string;
  guarantorEmail: string;
  phoneNumber: string;
  propertiesOwned: string | number;
  propertiesSold: string | number;
  totalExperience: string | number; 
  fico: string | number;
  socialSecurity?: string; 
  usCitizen: boolean;
  dateOfBirth?: string; 
  primaryResidenceAddress: string;
  ownOrRentPrimary: 'own' | 'rent';
  yearsAtPrimaryResidence: string | number;
  entityName: string;
  einNumber: string;
}

export interface PropertyInfo {
  subjectPropertyAddress: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  numberOfUnits: string | number;
  purchasePrice: string | number;
  asIsValue: string | number;
  purchaseDate: string;
  estimatedPayoff?: string | number; 
  rehabNeeded?: string | number; 
  rehabAlreadyCompleted?: string | number; 
  arv?: string | number; 
  hasComps?: boolean; 
  earnestMoneyDeposit?: string | number;
  annualTaxes?: string | number;
  annualInsurance?: string | number;
  annualFloodInsurance?: string | number;
  annualHOA?: string | number;
   monthlyIncome?: number;
   isActualRent?: boolean;
}


export interface PropertyDetails {
  liquidCashAvailable: string | number; 
  currentSquareFootage: string | number;
  afterRenovationSquareFootage: string | number;
  currentBedrooms?: string | number; 
  afterRenovationBedrooms?: string | number; 
  currentBathrooms?: string | number; 
  afterRenovationBathrooms?: string | number; 
  monthlyIncome?: string | number; 
  isActualRent: boolean;
  hasActiveLease: boolean;
  annualTaxes: string | number; 
  annualInsurance: string | number; 
  annualFloodInsurance?: string | number;
  annualHOA?: string | number;
  propertyManager?: string; 
  sponsorIntentToOccupy: boolean;
  existingLiens: boolean;
  existingLiensAmount: string | number;
  isIncomeLoan: boolean; 
}

export interface BorrowerInfoProcessed {
  guarantorFullName: string;
  guarantorEmail: string;
  phoneNumber: string;
  propertiesOwned: number;
  propertiesSold: number;
  totalExperience: number;
  fico: number;
  socialSecurity?: string; 
  usCitizen: boolean;
  dateOfBirth?: string; 
  primaryResidenceAddress: string;
  ownOrRentPrimary: 'own' | 'rent';
  yearsAtPrimaryResidence: number;
  entityName: string;
  einNumber: string;
}

export interface PropertyInfoProcessed {
  subjectPropertyAddress: string;
  city: string;
  state: string; 
  zipCode: string;
  propertyType: string;
  numberOfUnits: number;
  purchasePrice: number;
  asIsValue: number;
  purchaseDate: string;
  estimatedPayoff?: number; 
  rehabNeeded?: number; 
  rehabAlreadyCompleted?: number; 
  arv?: number; 
  hasComps?: boolean; 
  earnestMoneyDeposit?: number;
  annualTaxes?: number;
  annualInsurance?: number;
  annualFloodInsurance?: number;
  annualHOA?: number;
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
  hasRehab: boolean;
  isPurchase: boolean;
  allowedTerms: LoanTermType[];
}

export interface LoanTerm {
  id: string;
  name: string;
  months: number;
  description: string;
}

export type LoanTermType = 'shortTerm12' | 'shortTerm24' | 'dscr30';
export type InvestorTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';


export type LoanProgramType = 
  | 'purchaseWithRehab' 
  | 'purchaseWithoutRehab' 
  | 'refinanceWithRehab' 
  | 'refinanceWithoutRehab';

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

export interface LeadData {
  id: string;
  timestamp: string;
  borrowerInfo: {
    name: string;
    email: string;
    phone: string;
    experience: number;
    tier: InvestorTier;
  };
  loanProgram: LoanProgramType;
  quote?: {
    loanAmount: number;
    interestRate: number;
    loanTerm: number;
    totalFromBorrower: number;
  };
  status: 'quote-generated' | 'in-progress' | 'incomplete';
}

export interface LoanApplication {
  borrower: BorrowerInfoProcessed;
  property: PropertyInfoProcessed;
  details: PropertyDetailsProcessed;
  program: LoanProgramType;
  term: LoanTermType;
  quote?: LoanQuote;
}