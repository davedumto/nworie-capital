import { 
  BorrowerInfo, 
  PropertyInfo, 
  PropertyDetails, 
  LoanQuote, 
  InvestorTier,
  BorrowerInfoProcessed,
  PropertyInfoProcessed,
  PropertyDetailsProcessed
} from '@/types/loan';

type AvailableLoanPrograms = {
  purchaseWithRehab: boolean;
  purchaseWithoutRehab: boolean;
  refinanceWithRehab: boolean;
  refinanceWithoutRehab: boolean;
  allowedTerms: {
    shortTerm: boolean;
    longTerm: boolean;
  };
};

export class LoanCalculator {
  // Helper function to safely convert string | number to number
  private static toNumber(value: string | number | undefined): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  }

  // Convert form data to processed data for calculations
  static convertBorrowerData(formData: BorrowerInfo): BorrowerInfoProcessed {
    return {
      ...formData,
      propertiesOwned: this.toNumber(formData.propertiesOwned),
      propertiesSold: this.toNumber(formData.propertiesSold),
      totalExperience: this.toNumber(formData.totalExperience),
      fico: this.toNumber(formData.fico),
      yearsAtPrimaryResidence: this.toNumber(formData.yearsAtPrimaryResidence)
    };
  }

  static convertPropertyData(formData: PropertyInfo): PropertyInfoProcessed {
    return {
      ...formData,
      numberOfUnits: this.toNumber(formData.numberOfUnits),
      purchasePrice: this.toNumber(formData.purchasePrice),
      asIsValue: this.toNumber(formData.asIsValue),
      estimatedPayoff: this.toNumber(formData.estimatedPayoff),
      rehabNeeded: this.toNumber(formData.rehabNeeded),
      rehabAlreadyCompleted: this.toNumber(formData.rehabAlreadyCompleted),
      arv: this.toNumber(formData.arv),
      earnestMoneyDeposit: this.toNumber(formData.earnestMoneyDeposit)
    };
  }

  static convertDetailsData(formData: PropertyDetails): PropertyDetailsProcessed {
    return {
      ...formData,
      liquidCashAvailable: this.toNumber(formData.liquidCashAvailable),
      currentSquareFootage: this.toNumber(formData.currentSquareFootage),
      afterRenovationSquareFootage: this.toNumber(formData.afterRenovationSquareFootage),
      currentBedrooms: formData.currentBedrooms ? this.toNumber(formData.currentBedrooms) : undefined,
      afterRenovationBedrooms: formData.afterRenovationBedrooms ? this.toNumber(formData.afterRenovationBedrooms) : undefined,
      currentBathrooms: formData.currentBathrooms ? this.toNumber(formData.currentBathrooms) : undefined,
      afterRenovationBathrooms: formData.afterRenovationBathrooms ? this.toNumber(formData.afterRenovationBathrooms) : undefined,
      monthlyIncome: formData.monthlyIncome ? this.toNumber(formData.monthlyIncome) : undefined,
      annualTaxes: this.toNumber(formData.annualTaxes),
      annualInsurance: this.toNumber(formData.annualInsurance),
      annualFloodInsurance: formData.annualFloodInsurance ? this.toNumber(formData.annualFloodInsurance) : undefined,
      annualHOA: formData.annualHOA ? this.toNumber(formData.annualHOA) : undefined,
      existingLiensAmount: this.toNumber(formData.existingLiensAmount)
    };
  }

  static calculateTotalExperience(propertiesOwned: number, propertiesSold: number): number {
    return propertiesOwned + propertiesSold;
  }

  static getInvestorTier(totalExperience: number): InvestorTier {
    if (totalExperience >= 10) return 'Platinum';
    if (totalExperience >= 5) return 'Gold';
    if (totalExperience >= 2) return 'Silver';
    return 'Bronze';
  }

  static getInterestRate(tier: InvestorTier, creditScore: number): number {
    // New interest rate structure based on tier
    let baseRate: number;
    
    switch (tier) {
      case 'Platinum':
        baseRate = 11.0;
        break;
      case 'Gold':
        baseRate = 12.0;
        break;
      case 'Silver':
        baseRate = 13.0;
        break;
      case 'Bronze':
        baseRate = 14.0;
        break;
    }

    // Credit score adjustments
    if (creditScore >= 750) {
      baseRate -= 0.25;
    } else if (creditScore >= 700) {
      baseRate -= 0.1;
    } else if (creditScore < 680) {
      baseRate += 0.5;
    }

    return Math.round(baseRate * 100) / 100;
  }

  static getLoanToValue(numberOfUnits: number): number {
    if (numberOfUnits <= 4) return 0.90; // 90%
    if (numberOfUnits <= 11) return 0.70; // 70%
    return 0; // Contact sales for 12+ units
  }

  static getAvailableLoanPrograms(
    isPurchase: boolean,
    hasRehab: boolean
  ): AvailableLoanPrograms {
    if (isPurchase) {
      if (hasRehab) {
        return {
          purchaseWithRehab: true,
          purchaseWithoutRehab: false,
          refinanceWithRehab: false,
          refinanceWithoutRehab: false,
          allowedTerms: {
            shortTerm: true,
            longTerm: false // Purchase with rehab is short-term only
          }
        };
      } else {
        return {
          purchaseWithRehab: false,
          purchaseWithoutRehab: true,
          refinanceWithRehab: false,
          refinanceWithoutRehab: false,
          allowedTerms: {
            shortTerm: true,
            longTerm: true // Purchase without rehab can be either
          }
        };
      }
    } else {
      // Refinance
      if (hasRehab) {
        return {
          purchaseWithRehab: false,
          purchaseWithoutRehab: false,
          refinanceWithRehab: true,
          refinanceWithoutRehab: false,
          allowedTerms: {
            shortTerm: true,
            longTerm: false // Refinance with rehab is short-term only
          }
        };
      } else {
        return {
          purchaseWithRehab: false,
          purchaseWithoutRehab: false,
          refinanceWithRehab: false,
          refinanceWithoutRehab: true,
          allowedTerms: {
            shortTerm: true,
            longTerm: true // Refinance without rehab can be either
          }
        };
      }
    }
  }

  static getLoanTermMonths(loanProgram: string, hasRehab: boolean, isGroundUp: boolean): number {
    if (isGroundUp) return 24; // Ground-up construction is 24 months
    if (hasRehab) return 12; // Renovations are 12 months
    // Long-term loans are 24 months (not 360)
    return loanProgram.includes('longTerm') ? 24 : 12;
  }

  static getDrawSchedule(tier: InvestorTier): string {
    return (tier === 'Gold' || tier === 'Platinum') ? 'Advanced' : 'Reimbursement';
  }

  // Updated method that accepts form data and converts it internally
  static calculateLoanQuote(
    borrowerInfoForm: BorrowerInfo,
    propertyInfoForm: PropertyInfo,
    propertyDetailsForm: PropertyDetails,
    loanProgram: string
  ): LoanQuote {
    // Convert form data to processed data for calculations
    const borrowerInfo = this.convertBorrowerData(borrowerInfoForm);
    const propertyInfo = this.convertPropertyData(propertyInfoForm);
    const propertyDetails = this.convertDetailsData(propertyDetailsForm);

    const totalExperience = this.calculateTotalExperience(borrowerInfo.propertiesOwned, borrowerInfo.propertiesSold);
    const tier = this.getInvestorTier(totalExperience);
    const interestRate = this.getInterestRate(tier, borrowerInfo.fico);
    const loanToValue = this.getLoanToValue(propertyInfo.numberOfUnits);
    
    if (loanToValue === 0) {
      throw new Error('Properties with 12+ units require contacting sales for assistance');
    }

    // Calculate loan amount based on LTV
    const maxLoanBasedOnPurchase = propertyInfo.purchasePrice * loanToValue;
    
    // Calculate ARV cap (75% of ARV)
    const arvCap = propertyInfo.arv * 0.75;
    
    // Loan amount calculation
    const loanAmount = Math.min(
      maxLoanBasedOnPurchase + propertyInfo.rehabNeeded,
      arvCap
    );

    // Calculate initial advance
    const initialAdvance = propertyInfo.purchasePrice * loanToValue;
    
    // Calculate down payment
    const downPayment = propertyInfo.purchasePrice * (1 - loanToValue);
    
    // Calculate fees - 3 points for origination
    const originationFee = loanAmount * 0.03; // 3 points
    const underwriting = 1000;
    const docPrep = 1995;
    
    // Use actual property details for title, tax, and insurance estimates
    const titleEstimate = propertyInfo.purchasePrice * 0.004 + 1000;
    const taxEstimate = propertyDetails.annualTaxes || (propertyInfo.purchasePrice * 0.015);
    const insuranceEstimate = propertyDetails.annualInsurance || 1140;
    const closingFee = 0; // Waived
    
    const totalClosingCosts = originationFee + underwriting + docPrep + 
                            titleEstimate + taxEstimate + insuranceEstimate + closingFee;
    
    // Calculate holdback using the specific formula:
    // Payment holdback = (initial advance + rehab budget) * interest rate for investor tier
    const holdbackBase = initialAdvance + propertyInfo.rehabNeeded;
    const paymentHoldback = holdbackBase * (interestRate / 100);
    
    const monthlyEscrow = (propertyDetails.annualTaxes + propertyDetails.annualInsurance) / 12;
    
    // Determine loan term months
    const isGroundUp = propertyInfo.rehabNeeded > propertyInfo.purchasePrice * 0.5;
    const hasRehab = propertyInfo.rehabNeeded > 0;
    const termMonths = this.getLoanTermMonths(loanProgram, hasRehab, isGroundUp);
    
    // Calculate total from borrower
    const earnestMoney = propertyInfo.isPurchase ? propertyInfo.earnestMoneyDeposit : 0;
    const totalFromBorrower = downPayment + totalClosingCosts + earnestMoney;
    
    return {
      loanProgram,
      purchasePrice: propertyInfo.purchasePrice,
      rehabBudget: propertyInfo.rehabNeeded,
      arv: propertyInfo.arv,
      loanAmount,
      creditScore: borrowerInfo.fico,
      investorTier: tier,
      interestRate,
      loanTerm: termMonths,
      repaymentType: 'Dutch',
      monthlyPayment: 0, // No monthly payments for short-term
      arvCap,
      initialAdvance,
      drawSchedule: this.getDrawSchedule(tier),
      paymentHoldback,
      monthlyEscrow,
      downPayment,
      earnestMoneyDeposit: earnestMoney,
      fees: {
        originationFee,
        underwriting,
        docPrep,
        titleEstimate,
        taxEstimate,
        insuranceEstimate,
        closingFee,
        totalClosingCosts
      },
      totalFromBorrower,
      liquidityRequired: totalFromBorrower
    };
  }

  // Updated validation method that accepts form data and converts it internally
  static validateApplication(
    borrowerInfoForm: BorrowerInfo,
    propertyInfoForm: PropertyInfo,
    propertyDetailsForm: PropertyDetails
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Convert form data to processed data for validation
    const borrowerInfo = this.convertBorrowerData(borrowerInfoForm);
    const propertyInfo = this.convertPropertyData(propertyInfoForm);
    const propertyDetails = this.convertDetailsData(propertyDetailsForm);
    
    // Liquid cash validation - if 0, reject
    if (propertyDetails.liquidCashAvailable === 0) {
      errors.push('Liquid cash available cannot be zero. We are not interested in applications with no liquid cash.');
      return { isValid: false, errors };
    }
    
    // Credit score validation
    if (borrowerInfo.fico < 660) {
      errors.push('Minimum credit score of 660 required');
    }
    
    // Units validation
    if (propertyInfo.numberOfUnits >= 12) {
      errors.push('Properties with 12+ units require contacting sales for assistance');
    }
    
    // Construction loan validation
    if (propertyInfo.rehabNeeded > propertyInfo.purchasePrice * 0.5) {
      // Likely construction loan
      if (borrowerInfo.fico < 680) {
        errors.push('Ground-up construction requires minimum credit score of 680');
      }
      
      const totalExperience = this.calculateTotalExperience(borrowerInfo.propertiesOwned, borrowerInfo.propertiesSold);
      const tier = this.getInvestorTier(totalExperience);
      if (tier === 'Bronze' || tier === 'Silver') {
        errors.push('Ground-up construction only available to Gold and Platinum tier investors');
      }
    }
    
    // Loan amount validation
    if (propertyInfo.purchasePrice < 100000 || propertyInfo.purchasePrice > 3000000) {
      errors.push('Loan amount must be between $100,000 and $3,000,000');
    }
    
    // ARV validation
    if (propertyInfo.arv <= propertyInfo.purchasePrice + propertyInfo.rehabNeeded) {
      errors.push('ARV must be higher than purchase price plus rehab costs');
    }
    
    // Required field validations
    if (!propertyInfo.city.trim()) {
      errors.push('City is required');
    }
    
    if (!propertyInfo.zipCode.trim()) {
      errors.push('Zip code is required');
    }
    
    // Income loan validations
    if (propertyDetails.isIncomeLoan) {
      if (!propertyDetails.monthlyIncome || propertyDetails.monthlyIncome <= 0) {
        errors.push('Monthly income is required for income loans');
      }
      
      if (!propertyDetails.annualTaxes || propertyDetails.annualTaxes <= 0) {
        errors.push('Annual taxes are required for income loans');
      }
      
      if (!propertyDetails.annualInsurance || propertyDetails.annualInsurance <= 0) {
        errors.push('Annual insurance is required for income loans');
      }
    }
    
    // Purchase specific validations
    if (propertyInfo.isPurchase && (!propertyInfo.earnestMoneyDeposit || propertyInfo.earnestMoneyDeposit <= 0)) {
      errors.push('Earnest money deposit amount is required for purchases');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Helper method for form validation (accepts form data directly)
  static validateFormData(
    borrowerData: BorrowerInfo,
    propertyData: PropertyInfo,
    detailsData: PropertyDetails
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Basic required field validation (string fields)
    if (!borrowerData.guarantorFullName?.trim()) {
      errors.push('Guarantor full name is required');
    }

    if (!borrowerData.guarantorEmail?.trim()) {
      errors.push('Guarantor email is required');
    }

    if (!propertyData.subjectPropertyAddress?.trim()) {
      errors.push('Property address is required');
    }

    // Numeric field validation (convert and validate)
    const fico = this.toNumber(borrowerData.fico);
    if (fico === 0) {
      errors.push('FICO score is required');
    }

    const purchasePrice = this.toNumber(propertyData.purchasePrice);
    if (purchasePrice === 0) {
      errors.push('Purchase price is required');
    }

    const arv = this.toNumber(propertyData.arv);
    if (arv === 0) {
      errors.push('ARV is required');
    }

    const liquidCash = this.toNumber(detailsData.liquidCashAvailable);
    if (liquidCash === 0) {
      errors.push('Liquid cash available is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}