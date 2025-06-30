
import { BorrowerInfo, PropertyInfo, PropertyDetails, LoanQuote, InvestorTier } from '@/types/loan';

export class LoanCalculator {
  static getInvestorTier(experience: number): InvestorTier {
    if (experience >= 10) return 'Platinum';
    if (experience >= 5) return 'Gold';
    if (experience >= 2) return 'Silver';
    return 'Bronze';
  }

  static getInterestRate(tier: InvestorTier, creditScore: number): number {
    // Base rate is 10%, but can vary based on tier and credit score
    let baseRate = 10.0;
    
    // Tier adjustments
    switch (tier) {
      case 'Platinum':
        baseRate += 0.5;
        break;
      case 'Gold':
        baseRate += 1.0;
        break;
      case 'Silver':
        baseRate += 1.5;
        break;
      case 'Bronze':
        baseRate += 2.0;
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

  static calculateLoanQuote(
    borrowerInfo: BorrowerInfo,
    propertyInfo: PropertyInfo,
    propertyDetails: PropertyDetails,
    loanProgram: string,
    loanTerm: string
  ): LoanQuote {
    const tier = this.getInvestorTier(borrowerInfo.experience);
    const interestRate = this.getInterestRate(tier, borrowerInfo.fico);
    
    // Calculate loan amount (90% of purchase price)
    const maxLoanBasedOnPurchase = propertyInfo.purchasePrice * 0.9;
    
    // Calculate ARV cap (75% of ARV)
    const arvCap = propertyInfo.arv * 0.75;
    
    // Loan amount is the lesser of 90% purchase + 100% rehab or 75% ARV
    const loanAmount = Math.min(
      maxLoanBasedOnPurchase + propertyInfo.rehabNeeded,
      arvCap
    );

    // Calculate initial advance (90% of purchase price)
    const initialAdvance = propertyInfo.purchasePrice * 0.9;
    
    // Calculate down payment (10% of purchase price)
    const downPayment = propertyInfo.purchasePrice * 0.1;
    
    // Calculate fees
    const originationFee = loanAmount * 0.02; // 2 points
    const underwriting = 1000;
    const docPrep = 1995;
    const titleEstimate = propertyInfo.purchasePrice * 0.004 + 1000; // Estimate
    const taxEstimate = propertyInfo.purchasePrice * 0.015; // Estimate
    const insuranceEstimate = 1140;
    const closingFee = 0; // Waived
    
    const totalClosingCosts = originationFee + underwriting + docPrep + 
                            titleEstimate + taxEstimate + insuranceEstimate + closingFee;
    
    // Calculate holdback and escrow
    const paymentHoldback = loanAmount * 0.05; // 5% holdback
    const monthlyEscrow = (propertyDetails.annualTaxes + propertyDetails.annualInsurance) / 12;
    
    // Calculate total from borrower
    const totalFromBorrower = downPayment + totalClosingCosts;
    
    return {
      loanProgram,
      purchasePrice: propertyInfo.purchasePrice,
      rehabBudget: propertyInfo.rehabNeeded,
      arv: propertyInfo.arv,
      loanAmount,
      creditScore: borrowerInfo.fico,
      investorTier: tier,
      interestRate,
      loanTerm: loanTerm.includes('Short') ? 12 : 360,
      repaymentType: 'Dutch',
      monthlyPayment: 0, // No monthly payments for short-term
      arvCap,
      initialAdvance,
      drawSchedule: 'Reimbursement',
      paymentHoldback,
      monthlyEscrow,
      downPayment,
      earnestMoneyDeposit: 1000,
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

  static validateApplication(
    borrowerInfo: BorrowerInfo,
    propertyInfo: PropertyInfo
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Credit score validation
    if (borrowerInfo.fico < 660) {
      errors.push('Minimum credit score of 660 required');
    }
    
    // Construction loan validation
    if (propertyInfo.rehabNeeded > propertyInfo.purchasePrice * 0.5) {
      // Likely construction loan
      if (borrowerInfo.fico < 680) {
        errors.push('Ground-up construction requires minimum credit score of 680');
      }
      
      const tier = this.getInvestorTier(borrowerInfo.experience);
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
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}