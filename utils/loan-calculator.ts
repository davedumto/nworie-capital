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

export class LoanCalculator {

  private static toNumber(val: unknown): number {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  }
  static convertBorrowerData(data: BorrowerInfo): BorrowerInfoProcessed {
    return {
      ...data,
      propertiesOwned: this.toNumber(data.propertiesOwned),
      propertiesSold: this.toNumber(data.propertiesSold),
      totalExperience: this.toNumber(data.totalExperience),
      fico: this.toNumber(data.fico),
      yearsAtPrimaryResidence: this.toNumber(data.yearsAtPrimaryResidence)
    };
  }

  static convertPropertyData(data: PropertyInfo): PropertyInfoProcessed {
    return {
      ...data,
      numberOfUnits: this.toNumber(data.numberOfUnits),
      purchasePrice: this.toNumber(data.purchasePrice),
      asIsValue: this.toNumber(data.asIsValue),
      estimatedPayoff: data.estimatedPayoff ? this.toNumber(data.estimatedPayoff) : undefined,
      rehabNeeded: data.rehabNeeded ? this.toNumber(data.rehabNeeded) : undefined,
      rehabAlreadyCompleted: data.rehabAlreadyCompleted ? this.toNumber(data.rehabAlreadyCompleted) : undefined,
      arv: data.arv ? this.toNumber(data.arv) : undefined,
      hasComps: data.hasComps || false,
      earnestMoneyDeposit: data.earnestMoneyDeposit ? this.toNumber(data.earnestMoneyDeposit) : undefined
    };
  }

  static convertDetailsData(data: PropertyDetails): PropertyDetailsProcessed {
    return {
      ...data,
      liquidCashAvailable: this.toNumber(data.liquidCashAvailable),
      currentSquareFootage: this.toNumber(data.currentSquareFootage),
      afterRenovationSquareFootage: this.toNumber(data.afterRenovationSquareFootage),
      currentBedrooms: data.currentBedrooms ? this.toNumber(data.currentBedrooms) : undefined,
      afterRenovationBedrooms: data.afterRenovationBedrooms ? this.toNumber(data.afterRenovationBedrooms) : undefined,
      currentBathrooms: data.currentBathrooms ? this.toNumber(data.currentBathrooms) : undefined,
      afterRenovationBathrooms: data.afterRenovationBathrooms ? this.toNumber(data.afterRenovationBathrooms) : undefined,
      monthlyIncome: data.monthlyIncome ? this.toNumber(data.monthlyIncome) : undefined,
      annualTaxes: this.toNumber(data.annualTaxes),
      annualInsurance: this.toNumber(data.annualInsurance),
      annualFloodInsurance: data.annualFloodInsurance ? this.toNumber(data.annualFloodInsurance) : undefined,
      annualHOA: data.annualHOA ? this.toNumber(data.annualHOA) : undefined,
      existingLiensAmount: this.toNumber(data.existingLiensAmount)
    };
  }

  static calculateTotalExperience(owned: number, sold: number): number {
    return owned + sold;
  }

  static getInvestorTier(totalExp: number): InvestorTier {
    if (totalExp >= 10) return 'Platinum';
    if (totalExp >= 5) return 'Gold';
    if (totalExp >= 2) return 'Silver';
    return 'Bronze';
  }

  static getInterestRate(tier: InvestorTier, creditScore: number): number {

    let rate = 14.0;
    
    switch (tier) {
      case 'Platinum': rate = 11.0; break;
      case 'Gold': rate = 12.0; break;
      case 'Silver': rate = 13.0; break;
    }
    if (creditScore >= 750) {
      rate -= 0.25;
    } else if (creditScore >= 700) {
      rate -= 0.1;
    } else if (creditScore < 680) {
      rate += 0.5;
    }

    return Math.round(rate * 100) / 100;
  }

  static getLoanToValue(units: number): number {
    if (units <= 4) return 0.90;
    if (units <= 11) return 0.70;
    return 0; 
  }

  static getDrawSchedule(tier: InvestorTier): string {
    return (tier === 'Gold' || tier === 'Platinum') ? 'Advanced' : 'Reimbursement';
  }


  private static isPurchase(program: string): boolean {
    return program.includes('purchase');
  }

  private static hasRehab(program: string): boolean {
    return program.includes('WithRehab');
  }

  private static getTermMonths(term: string): number {
    switch (term) {
      case 'shortTerm12': return 12;
      case 'shortTerm24': return 24;
      case 'dscr30': return 360;
      default: return 12;
    }
  }

  private static getProgramName(program: string): string {
    switch (program) {
      case 'purchaseWithRehab': return 'Purchase with Rehab (Fix-n-Flip)';
      case 'purchaseWithoutRehab': return 'Purchase without Rehab (DSCR)';
      case 'refinanceWithRehab': return 'Refinance with Rehab';
      case 'refinanceWithoutRehab': return 'Refinance without Rehab (DSCR)';
      default: return program;
    }
  }

  private static calcMonthlyPayment(loanAmount: number, rate: number, months: number): number {
    if (months <= 24) return 0;
    
    const monthlyRate = rate / 100 / 12;
    const payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                   (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(payment * 100) / 100;
  }

  static calculateLoanQuote(
    borrowerForm: BorrowerInfo,
    propertyForm: PropertyInfo,
    detailsForm: PropertyDetails,
    program: string,
    term: string = 'shortTerm12'
  ): LoanQuote {
    const borrower = this.convertBorrowerData(borrowerForm);
    const property = this.convertPropertyData(propertyForm);
    const details = this.convertDetailsData(detailsForm);

    const isPurchaseProgram = this.isPurchase(program);
    const isRehabProgram = this.hasRehab(program);

    const totalExp = this.calculateTotalExperience(borrower.propertiesOwned, borrower.propertiesSold);
    const tier = this.getInvestorTier(totalExp);
    const rate = this.getInterestRate(tier, borrower.fico);
    const ltv = this.getLoanToValue(property.numberOfUnits);
    
    if (ltv === 0) {
      throw new Error('12+ units need to call sales');
    }
    const maxLoanBase = property.purchasePrice * ltv;
    const rehabBudget = isRehabProgram ? (property.rehabNeeded || 0) : 0;
    const arv = isRehabProgram ? (property.arv || property.purchasePrice) : property.purchasePrice;
    const arvCap = isRehabProgram ? arv * 0.75 : maxLoanBase;
    
    const loanAmount = Math.min(maxLoanBase + rehabBudget, arvCap);
    const initialAdvance = property.purchasePrice * ltv;
    const downPayment = property.purchasePrice * (1 - ltv);
    const origFee = loanAmount * 0.03; 
    const underwriting = 1000;
    const docPrep = 1995;
    const titleEst = property.purchasePrice * 0.004 + 1000;
    const taxEst = details.annualTaxes || (property.purchasePrice * 0.015);
    const insEst = details.annualInsurance || 1140;
    
    const totalClosing = origFee + underwriting + docPrep + titleEst + taxEst + insEst;
    const holdbackBase = initialAdvance + rehabBudget;
    const paymentHoldback = holdbackBase * (rate / 100);
    
    const monthlyEscrow = (details.annualTaxes + details.annualInsurance) / 12;
    const termMonths = this.getTermMonths(term);
    const earnestMoney = isPurchaseProgram ? (property.earnestMoneyDeposit || 0) : 0;
    const totalFromBorrower = downPayment + totalClosing + earnestMoney;
    
    return {
      loanProgram: this.getProgramName(program),
      purchasePrice: property.purchasePrice,
      rehabBudget,
      arv,
      loanAmount,
      creditScore: borrower.fico,
      investorTier: tier,
      interestRate: rate,
      loanTerm: termMonths,
      repaymentType: termMonths <= 24 ? 'Dutch (Interest Only)' : 'Principal & Interest',
      monthlyPayment: this.calcMonthlyPayment(loanAmount, rate, termMonths),
      arvCap,
      initialAdvance,
      drawSchedule: this.getDrawSchedule(tier),
      paymentHoldback,
      monthlyEscrow,
      downPayment,
      earnestMoneyDeposit: earnestMoney,
      fees: {
        originationFee: origFee,
        underwriting,
        docPrep,
        titleEstimate: titleEst,
        taxEstimate: taxEst,
        insuranceEstimate: insEst,
        closingFee: 0, // Waived
        totalClosingCosts: totalClosing
      },
      totalFromBorrower,
      liquidityRequired: totalFromBorrower
    };
  }

  static validateApplication(
    borrowerForm: BorrowerInfo,
    propertyForm: PropertyInfo,
    detailsForm: PropertyDetails,
    program: string = ''
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    const borrower = this.convertBorrowerData(borrowerForm);
    const property = this.convertPropertyData(propertyForm);
    const details = this.convertDetailsData(detailsForm);
    
    const isRehabProgram = this.hasRehab(program);
    const isPurchaseProgram = this.isPurchase(program);
    if (details.liquidCashAvailable === 0) {
      errors.push('Need liquid cash to qualify');
      return { isValid: false, errors };
    }
    if (borrower.fico < 660) {
      errors.push('Need 660+ credit score');
    }
    
    if (property.numberOfUnits >= 12) {
      errors.push('12+ units - call sales');
    }
    
    if (property.purchasePrice < 100000 || property.purchasePrice > 3000000) {
      errors.push('Loan must be $100K - $3M');
    }
    if (!property.city.trim()) errors.push('City required');
    if (!property.zipCode.trim()) errors.push('Zip code required');
    if (isRehabProgram) {
      const rehabNeeded = property.rehabNeeded || 0;
      const arv = property.arv || 0;
      
      if (rehabNeeded <= 0) errors.push('Rehab budget required');
      if (arv <= 0) errors.push('ARV required');
      
      if (arv > 0 && arv <= property.purchasePrice + rehabNeeded) {
        errors.push('ARV must be higher than purchase + rehab');
      }

      if (rehabNeeded > property.purchasePrice * 0.5) {
        if (borrower.fico < 680) {
          errors.push('Construction needs 680+ credit');
        }
        
        const totalExp = this.calculateTotalExperience(borrower.propertiesOwned, borrower.propertiesSold);
        const tier = this.getInvestorTier(totalExp);
        if (tier === 'Bronze' || tier === 'Silver') {
          errors.push('Construction only for Gold/Platinum investors');
        }
      }
    }
    if (isPurchaseProgram && (!property.earnestMoneyDeposit || property.earnestMoneyDeposit <= 0)) {
      errors.push('Earnest money required for purchases');
    }
    if (!isRehabProgram && details.isIncomeLoan) {
      if (!details.monthlyIncome || details.monthlyIncome <= 0) {
        errors.push('Monthly income required for DSCR');
      }
    }
    if (!details.annualTaxes || details.annualTaxes <= 0) {
      errors.push('Annual taxes required');
    }
    
    if (!details.annualInsurance || details.annualInsurance <= 0) {
      errors.push('Annual insurance required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  static validateFormData(
    borrower: BorrowerInfo,
    property: PropertyInfo,
    details: PropertyDetails
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!borrower.guarantorFullName?.trim()) errors.push('Name required');
    if (!borrower.guarantorEmail?.trim()) errors.push('Email required');
    if (!property.subjectPropertyAddress?.trim()) errors.push('Property address required');

    const fico = this.toNumber(borrower.fico);
    if (fico === 0) errors.push('FICO score required');

    const price = this.toNumber(property.purchasePrice);
    if (price === 0) errors.push('Purchase price required');

    const cash = this.toNumber(details.liquidCashAvailable);
    if (cash === 0) errors.push('Liquid cash required');

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}