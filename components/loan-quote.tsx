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
          <CardTitle className="text-red-800 dark:text-red-200">Issues Found</CardTitle>
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
            Fill out the form to get your quote
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatRate = (rate: number) => {
    return `${rate.toFixed(2)}%`;
  };

  const getDrawType = (tier: string) => {
    return tier === 'Gold' || tier === 'Platinum' ? 'Advanced' : 'Reimbursement';
  };

  const getTermDesc = (months: number) => {
    if (months === 24) return '24 months';
    if (months === 12) return '12 months';
    if (months === 360) return '30 years';
    return `${months} months`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Your Quote
          <div className="flex items-center space-x-2">
            <Badge variant={quote.investorTier === 'Platinum' ? 'default' : quote.investorTier === 'Gold' ? 'secondary' : 'outline'}>
              {quote.investorTier}
            </Badge>
            <Badge variant="outline">
              {formatRate(quote.interestRate)}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">The Basics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p><span className="font-medium">Program:</span> {quote.loanProgram}</p>
              <p><span className="font-medium">Purchase Price:</span> {formatMoney(quote.purchasePrice)}</p>
              {quote.rehabBudget > 0 && (
                <p><span className="font-medium">Rehab Budget:</span> {formatMoney(quote.rehabBudget)}</p>
              )}
              <p><span className="font-medium">ARV:</span> {formatMoney(quote.arv)}</p>
            </div>
            <div className="space-y-2">
              <p><span className="font-medium">Loan Amount:</span> {formatMoney(quote.loanAmount)}</p>
              <p><span className="font-medium">Rate:</span> {formatRate(quote.interestRate)}</p>
              <p><span className="font-medium">Term:</span> {getTermDesc(quote.loanTerm)}</p>
              <p><span className="font-medium">Tier:</span> {quote.investorTier} ({quote.creditScore} FICO)</p>
            </div>
          </div>
        </div>

        <Separator />
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Payments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p><span className="font-medium">Type:</span> {quote.repaymentType}</p>
              {quote.monthlyPayment > 0 ? (
                <p><span className="font-medium">Monthly Payment:</span> {formatMoney(quote.monthlyPayment)}</p>
              ) : (
                <p><span className="font-medium">Monthly Payment:</span> Interest only (no payments during work)</p>
              )}
              <p><span className="font-medium">Initial Advance:</span> {formatMoney(quote.initialAdvance)}</p>
            </div>
            <div className="space-y-2">
              <p><span className="font-medium">Draw Type:</span> {getDrawType(quote.investorTier)}</p>
              <p><span className="font-medium">Holdback:</span> {formatMoney(quote.paymentHoldback)}</p>
              <p><span className="font-medium">Monthly Escrow:</span> {formatMoney(quote.monthlyEscrow)}</p>
            </div>
          </div>
        </div>

        <Separator />
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Fees</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Origination (3%):</span>
              <span>{formatMoney(quote.fees.originationFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Underwriting:</span>
              <span>{formatMoney(quote.fees.underwriting)}</span>
            </div>
            <div className="flex justify-between">
              <span>Doc Prep:</span>
              <span>{formatMoney(quote.fees.docPrep)}</span>
            </div>
            <div className="flex justify-between">
              <span>Title/Tax/Insurance:</span>
              <span>{formatMoney(quote.fees.titleEstimate + quote.fees.taxEstimate + quote.fees.insuranceEstimate)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total Closing Costs:</span>
              <span>{formatMoney(quote.fees.totalClosingCosts)}</span>
            </div>
          </div>
        </div>

        <Separator />
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Cash You Need</h3>
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Down Payment:</span>
                <span>{formatMoney(quote.downPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span>Closing Costs:</span>
                <span>{formatMoney(quote.fees.totalClosingCosts)}</span>
              </div>
              {quote.earnestMoneyDeposit > 0 && (
                <div className="flex justify-between">
                  <span>Earnest Money:</span>
                  <span>{formatMoney(quote.earnestMoneyDeposit)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Cash Needed:</span>
                <span>{formatMoney(quote.totalFromBorrower)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">What You Get:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <ul className="list-disc list-inside space-y-1">
              <li>No payments during construction</li>
              <li>Interest only on funds used</li>
              <li>100% rehab funding</li>
              <li>5-day close</li>
            </ul>
            <ul className="list-disc list-inside space-y-1">
              <li>Soft credit check only</li>
              <li>No tax returns needed</li>
              <li>{getDrawType(quote.investorTier)} draws</li>
              <li>Up to 90% LTV</li>
            </ul>
          </div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">{quote.investorTier} Tier Benefits:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Rate:</strong> {formatRate(quote.interestRate)} (based on your experience)</li>
            <li><strong>Draws:</strong> {getDrawType(quote.investorTier)} funding</li>
            {quote.investorTier === 'Gold' || quote.investorTier === 'Platinum' ? (
              <li><strong>Advanced Draws:</strong> Get money upfront with 10% down</li>
            ) : (
              <li><strong>Reimbursement:</strong> Get paid back for completed work</li>
            )}
          </ul>
        </div>
        {quote.paymentHoldback > 0 && (
          <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">About the Holdback:</h4>
            <p className="text-sm">
              We hold back {formatMoney(quote.paymentHoldback)} until the project is done. 
              This covers interest payments and ensures the work gets finished.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default LoanQuoteDisplay;