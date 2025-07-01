// components/LoanQuoteDisplay.tsx
'use client';

import { LoanQuote } from '@/types/loan';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface LoanQuoteDisplayProps {
  quote: LoanQuote | null;
  errors: string[];
}

export function LoanQuoteDisplay({ quote, errors }: LoanQuoteDisplayProps) {
  if (errors.length > 0) {
    return (
      <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
        <CardHeader>
          <CardTitle className="text-red-800 dark:text-red-200">Application Errors</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-red-700 dark:text-red-300">{error}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  }

  if (!quote) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Complete the form to generate your loan quote
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (rate: number) => {
    return `${rate.toFixed(2)}%`;
  };

  const getDrawScheduleDescription = (tier: string) => {
    return tier === 'Gold' || tier === 'Platinum' ? 'Advanced Draws' : 'Reimbursement Draws';
  };

  const getLoanTermDescription = (months: number) => {
    if (months === 24) return '24 months (Long-term/Ground-up construction)';
    if (months === 12) return '12 months (Short-term/Renovation)';
    return `${months} months`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Loan Quote Breakdown
          <div className="flex items-center space-x-2">
            <Badge variant={quote.investorTier === 'Platinum' ? 'default' : quote.investorTier === 'Gold' ? 'secondary' : 'outline'}>
              {quote.investorTier} Tier
            </Badge>
            <Badge variant="outline">
              {formatPercentage(quote.interestRate)}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overview Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p><span className="font-medium">Loan Program:</span> {quote.loanProgram}</p>
              <p><span className="font-medium">Purchase Price:</span> {formatCurrency(quote.purchasePrice)}</p>
              <p><span className="font-medium">Rehab Budget:</span> {formatCurrency(quote.rehabBudget)}</p>
              <p><span className="font-medium">After Repair Value (ARV):</span> {formatCurrency(quote.arv)}</p>
            </div>
            <div className="space-y-2">
              <p><span className="font-medium">Loan Amount Offered:</span> {formatCurrency(quote.loanAmount)}</p>
              <p><span className="font-medium">Credit Score:</span> {quote.creditScore} ({quote.investorTier} Tier)</p>
              <p><span className="font-medium">Interest Rate:</span> {formatPercentage(quote.interestRate)} Fixed</p>
              <p><span className="font-medium">Loan Term:</span> {getLoanTermDescription(quote.loanTerm)}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Loan Terms Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Loan Terms & Structure</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p><span className="font-medium">Repayment Type:</span> {quote.repaymentType} (Interest only on drawn funds)</p>
              <p><span className="font-medium">Monthly Payment:</span> {formatCurrency(quote.monthlyPayment)} (No payments during construction)</p>
              <p><span className="font-medium">ARV Cap:</span> {formatCurrency(quote.arvCap)} (75% of ARV)</p>
              <p><span className="font-medium">Initial Advance:</span> {formatCurrency(quote.initialAdvance)} (90% of purchase)</p>
            </div>
            <div className="space-y-2">
              <p><span className="font-medium">Draw Schedule:</span> {getDrawScheduleDescription(quote.investorTier)}</p>
              <p><span className="font-medium">Payment Holdback:</span> {formatCurrency(quote.paymentHoldback)}</p>
              <p><span className="font-medium">Monthly Escrow:</span> {formatCurrency(quote.monthlyEscrow)}</p>
              {quote.earnestMoneyDeposit > 0 && (
                <p><span className="font-medium">Earnest Money Deposit:</span> {formatCurrency(quote.earnestMoneyDeposit)}</p>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Updated Fees and Closing Costs */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Fees and Closing Costs</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Origination Fee (3 points):</span>
              <span>{formatCurrency(quote.fees.originationFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Underwriting:</span>
              <span>{formatCurrency(quote.fees.underwriting)}</span>
            </div>
            <div className="flex justify-between">
              <span>Doc Prep:</span>
              <span>{formatCurrency(quote.fees.docPrep)}</span>
            </div>
            <div className="flex justify-between">
              <span>Title Estimate:</span>
              <span>{formatCurrency(quote.fees.titleEstimate)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax Estimate:</span>
              <span>{formatCurrency(quote.fees.taxEstimate)}</span>
            </div>
            <div className="flex justify-between">
              <span>Insurance Estimate:</span>
              <span>{formatCurrency(quote.fees.insuranceEstimate)}</span>
            </div>
            <div className="flex justify-between">
              <span>Closing Fee:</span>
              <span>{formatCurrency(quote.fees.closingFee)} (waived)</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total Closing Costs:</span>
              <span>{formatCurrency(quote.fees.totalClosingCosts)}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            *Tax and insurance estimates are based on your provided property details
          </p>
        </div>

        <Separator />

        {/* Borrower Requirements */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Borrower Requirements</h3>
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Down Payment ({((quote.purchasePrice - quote.initialAdvance) / quote.purchasePrice * 100).toFixed(0)}%):</span>
                <span>{formatCurrency(quote.downPayment)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Closing Costs:</span>
                <span>{formatCurrency(quote.fees.totalClosingCosts)}</span>
              </div>
              {quote.earnestMoneyDeposit > 0 && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Earnest Money:</span>
                  <span>{formatCurrency(quote.earnestMoneyDeposit)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Cash Required from Borrower:</span>
                <span>{formatCurrency(quote.totalFromBorrower)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Liquidity Verification Required:</span>
                <span>{formatCurrency(quote.liquidityRequired)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Updated Important Features */}
        <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Loan Features & Benefits:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <ul className="list-disc list-inside space-y-1">
              <li>No monthly payments during {quote.loanTerm === 24 ? 'construction' : 'renovation'}</li>
              <li>Interest charged only on drawn funds (Dutch-style)</li>
              <li>100% rehab coverage available</li>
              <li>Fast closing: 5 days with full documentation</li>
            </ul>
            <ul className="list-disc list-inside space-y-1">
              <li>Only soft credit check required to close</li>
              <li>No tax returns, W-2s, or DTI required</li>
              <li>{getDrawScheduleDescription(quote.investorTier)} based on {quote.investorTier} tier</li>
              <li>Up to {quote.arvCap === quote.arv * 0.75 ? '75%' : '90%'} loan-to-value</li>
            </ul>
          </div>
        </div>

        {/* Tier-Specific Information */}
        <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">{quote.investorTier} Tier Benefits:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Interest Rate:</strong> {formatPercentage(quote.interestRate)} (Based on experience level)</li>
            <li><strong>Draw Schedule:</strong> {getDrawScheduleDescription(quote.investorTier)}</li>
            {quote.investorTier === 'Gold' || quote.investorTier === 'Platinum' ? (
              <>
                <li><strong>Advanced Draws:</strong> Get funds upfront with 10% down</li>
                <li><strong>Nationwide Construction:</strong> Ground-up projects available anywhere</li>
              </>
            ) : (
              <>
                <li><strong>Reimbursement Draws:</strong> Get reimbursed for completed work</li>
                <li><strong>Construction Loans:</strong> Available in Texas only</li>
              </>
            )}
          </ul>
        </div>

        {/* Payment Holdback Explanation */}
        <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Payment Holdback Calculation:</h4>
          <p className="text-sm">
            Holdback Amount = (Initial Advance + Rehab Budget) × Interest Rate<br/>
            {formatCurrency(quote.initialAdvance)} + {formatCurrency(quote.rehabBudget)} × {formatPercentage(quote.interestRate)} = <strong>{formatCurrency(quote.paymentHoldback)}</strong>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            This amount is held until project completion to ensure loan performance.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default LoanQuoteDisplay;