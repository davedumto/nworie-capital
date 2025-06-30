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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Loan Quote Breakdown
          <Badge variant="secondary" className="ml-2">
            {quote.investorTier} Tier
          </Badge>
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
              <p><span className="font-medium">Loan Term:</span> {quote.loanTerm} Months</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Loan Terms Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Loan Terms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p><span className="font-medium">Repayment Type:</span> {quote.repaymentType}</p>
              <p><span className="font-medium">Monthly Payment:</span> {formatCurrency(quote.monthlyPayment)}</p>
              <p><span className="font-medium">ARV Cap:</span> {formatCurrency(quote.arvCap)} (75% of ARV)</p>
              <p><span className="font-medium">Initial Advance:</span> {formatCurrency(quote.initialAdvance)}</p>
            </div>
            <div className="space-y-2">
              <p><span className="font-medium">Draw Schedule:</span> {quote.drawSchedule}</p>
              <p><span className="font-medium">Payment Holdback:</span> {formatCurrency(quote.paymentHoldback)}</p>
              <p><span className="font-medium">Monthly Escrow:</span> {formatCurrency(quote.monthlyEscrow)}</p>
              <p><span className="font-medium">Earnest Money Deposit:</span> {formatCurrency(quote.earnestMoneyDeposit)}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Fees and Closing Costs */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Fees and Closing Costs</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Origination Fee (2 points):</span>
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
        </div>

        <Separator />

        {/* Borrower Requirements */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Borrower Requirements</h3>
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Down Payment:</span>
                <span>{formatCurrency(quote.downPayment)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Closing Costs:</span>
                <span>{formatCurrency(quote.fees.totalClosingCosts)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total from Borrower:</span>
                <span>{formatCurrency(quote.totalFromBorrower)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Liquidity Check Required:</span>
                <span>{formatCurrency(quote.liquidityRequired)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Important Notes:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>No monthly payments for {quote.loanTerm > 24 ? 'first 5 months' : 'loan term'}</li>
            <li>Interest charged only on drawn funds (Dutch-style)</li>
            <li>100% rehab coverage available</li>
            <li>Fast closing: 5 days with full documentation</li>
            <li>No tax returns, W-2s, or DTI required</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}