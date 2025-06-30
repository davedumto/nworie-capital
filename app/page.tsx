
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Moon, Sun, Calculator } from 'lucide-react';
import { useTheme } from 'next-themes';

import { BorrowerInfo, PropertyInfo, PropertyDetails, LoanQuote } from '@/types/loan';
import { LoanCalculator } from '@/utils/loan-calculator';
import { BorrowerInfoForm } from '@/components/borrower-info';
import { PropertyInfoForm } from '@/components/property-info';
import { PropertyDetailsForm } from '@/components/property-details';
import { LoanProgramForm } from '@/components/loan-program';
import { LoanQuoteDisplay } from '@/components/loan-quote';

export default function LoanApplication() {
  const { theme, setTheme } = useTheme();
  const [currentTab, setCurrentTab] = useState('borrower');
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [quote, setQuote] = useState<LoanQuote | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const borrowerForm = useForm<BorrowerInfo>({
    defaultValues: {
      guarantorFullName: '',
      guarantorEmail: '',
      phoneNumber: '',
      investmentProperties: 0,
      fico: 700,
      experience: 0,
      socialSecurity: '',
      usCitizen: false,
      dateOfBirth: '',
      primaryResidenceAddress: '',
      ownOrRentPrimary: 'own',
      yearsAtPrimaryResidence: 0,
      entityName: '',
      einNumber: ''
    }
  });

  const propertyForm = useForm<PropertyInfo>({
    defaultValues: {
      subjectPropertyAddress: '',
      propertyType: '',
      numberOfUnits: 1,
      purchasePrice: 0,
      asIsValue: 0,
      purchaseDate: '',
      estimatedPayoff: 0,
      rehabNeeded: 0,
      rehabAlreadyCompleted: 0,
      arv: 0,
      hasComps: false
    }
  });

  const detailsForm = useForm<PropertyDetails>({
    defaultValues: {
      loanAmountRequested: 0,
      liquidCashAvailable: 0,
      currentSquareFootage: 0,
      afterRenovationSquareFootage: 0,
      currentBedrooms: 0,
      afterRenovationBedrooms: 0,
      currentBathrooms: 0,
      afterRenovationBathrooms: 0,
      monthlyIncome: 0,
      isActualRent: false,
      hasActiveLease: false,
      annualTaxes: 0,
      annualInsurance: 0,
      annualFloodInsurance: 0,
      annualHOA: 0,
      propertyManager: '',
      sponsorIntentToOccupy: false,
      existingLiens: false,
      existingLiensAmount: 0
    }
  });

  const calculateProgress = () => {
    const borrowerData = borrowerForm.watch();
    const propertyData = propertyForm.watch();
    const detailsData = detailsForm.watch();

    let completedFields = 0;
    let totalFields = 0;

    // Count borrower form completion
    const borrowerFields = Object.values(borrowerData);
    totalFields += borrowerFields.length;
    completedFields += borrowerFields.filter(field => 
      field !== '' && field !== 0 && field !== false
    ).length;

    // Count property form completion
    const propertyFields = Object.values(propertyData);
    totalFields += propertyFields.length;
    completedFields += propertyFields.filter(field => 
      field !== '' && field !== 0 && field !== false
    ).length;

    // Count details form completion
    const detailsFields = Object.values(detailsData);
    totalFields += detailsFields.length;
    completedFields += detailsFields.filter(field => 
      field !== '' && field !== 0 && field !== false
    ).length;

    // Add program selection
    totalFields += 2;
    if (selectedPrograms.length > 0) completedFields += 1;
    if (selectedTerm) completedFields += 1;

    return Math.round((completedFields / totalFields) * 100);
  };

  const generateQuote = () => {
    const borrowerData = borrowerForm.getValues();
    const propertyData = propertyForm.getValues();
    const detailsData = detailsForm.getValues();

    // Validate the application
    const validation = LoanCalculator.validateApplication(borrowerData, propertyData);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setQuote(null);
      return;
    }

    // Additional validations
    const errors: string[] = [];
    
    if (selectedPrograms.length === 0) {
      errors.push('Please select a loan program');
    }
    
    if (!selectedTerm) {
      errors.push('Please select a loan term');
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      setQuote(null);
      return;
    }

    // Generate the quote
    try {
      const loanProgram = selectedPrograms[0]; // Use first selected program
      const generatedQuote = LoanCalculator.calculateLoanQuote(
        borrowerData,
        propertyData,
        detailsData,
        loanProgram,
        selectedTerm
      );

      setQuote(generatedQuote);
      setValidationErrors([]);
      setCurrentTab('quote');
    } catch {
      setValidationErrors(['Error generating quote. Please check your inputs.']);
      setQuote(null);
    }
  };

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calculator className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Nworie Capital</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Progress:</span>
                <Progress value={progress} className="w-20" />
                <span className="text-sm font-medium">{progress}%</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-6xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Real Estate Loan Application</CardTitle>
            <p className="text-center text-muted-foreground">
              Complete the form below to get an instant loan quote
            </p>
          </CardHeader>
          <CardContent>
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="borrower">Borrower Info</TabsTrigger>
                <TabsTrigger value="property">Property Info</TabsTrigger>
                <TabsTrigger value="details">Property Details</TabsTrigger>
                <TabsTrigger value="program">Loan Program</TabsTrigger>
                <TabsTrigger value="quote">Quote</TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="borrower" className="space-y-6">
                  <BorrowerInfoForm form={borrowerForm} />
                  <div className="flex justify-end">
                    <Button onClick={() => setCurrentTab('property')}>
                      Next: Property Info
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="property" className="space-y-6">
                  <PropertyInfoForm form={propertyForm} />
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentTab('borrower')}>
                      Previous
                    </Button>
                    <Button onClick={() => setCurrentTab('details')}>
                      Next: Property Details
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-6">
                  <PropertyDetailsForm form={detailsForm} />
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentTab('property')}>
                      Previous
                    </Button>
                    <Button onClick={() => setCurrentTab('program')}>
                      Next: Loan Program
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="program" className="space-y-6">
                  <LoanProgramForm
                    selectedPrograms={selectedPrograms}
                    selectedTerm={selectedTerm}
                    onProgramChange={setSelectedPrograms}
                    onTermChange={setSelectedTerm}
                  />
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentTab('details')}>
                      Previous
                    </Button>
                    <Button onClick={generateQuote} className="bg-primary">
                      Generate Quote
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="quote" className="space-y-6">
                  <LoanQuoteDisplay quote={quote} errors={validationErrors} />
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentTab('program')}>
                      Back to Program Selection
                    </Button>
                    {quote && (
                      <Button onClick={() => window.print()}>
                        Print Quote
                      </Button>
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Additional Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Investor Tiers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>Bronze (0-1 projects):</strong> 660+ FICO, TX construction only</div>
                <div><strong>Silver (2-4 projects):</strong> 660+ FICO, TX construction only</div>
                <div><strong>Gold (5-9 projects):</strong> 660+ FICO, nationwide construction</div>
                <div><strong>Platinum (10+ projects):</strong> Best rates, nationwide construction</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Loan Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>• Up to 90% LTV</div>
                <div>• 100% rehab coverage</div>
                <div>• No monthly payments</div>
                <div>• 5-day fast closing</div>
                <div>• No tax returns required</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>• 660+ FICO (680+ for construction)</div>
                <div>• Non-owner occupied only</div>
                <div>• $100K - $3M loan range</div>
                <div>• Investment properties only</div>
                <div>• Liquidity verification required</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              This quote is for informational purposes only and does not constitute a loan commitment.
            </p>
            <p className="text-sm text-muted-foreground">
              Please provide 60 days of current statements to verify liquidity mentioned above.
            </p>
            <p className="text-sm text-muted-foreground">
              Note that we will use a discount against retirement accounts, stocks, and other liquid assets 
              in calculating total liquidity for our loan requirements.
            </p>
            <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
              <span>© 2025 Nworie Capital</span>
              <span>•</span>
              <span>Licensed Mortgage Lender</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}