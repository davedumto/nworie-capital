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
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [quote, setQuote] = useState<LoanQuote | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Quick helper - don't overthink it
  const toNumber = (val: unknown) => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };

  const borrowerForm = useForm<BorrowerInfo>({
    defaultValues: {
      guarantorFullName: '',
      guarantorEmail: '',
      phoneNumber: '',
      propertiesOwned: '',
      propertiesSold: '',
      totalExperience: '',
      fico: '',
      socialSecurity: '', 
      usCitizen: false,
      dateOfBirth: '',
      primaryResidenceAddress: '',
      ownOrRentPrimary: 'own',
      yearsAtPrimaryResidence: '',
      entityName: '',
      einNumber: ''
    }
  });

  const propertyForm = useForm<PropertyInfo>({
    defaultValues: {
      subjectPropertyAddress: '',
      city: '',
      zipCode: '',
      propertyType: '',
      numberOfUnits: '',
      purchasePrice: '',
      asIsValue: '',
      purchaseDate: '',
      estimatedPayoff: '',
      rehabNeeded: '', 
      rehabAlreadyCompleted: '',
      arv: '',
      hasComps: false, 
      earnestMoneyDeposit: ''
    }
  });

  const detailsForm = useForm<PropertyDetails>({
    defaultValues: {
      liquidCashAvailable: '',
      currentSquareFootage: '',
      afterRenovationSquareFootage: '',
      currentBedrooms: '',
      afterRenovationBedrooms: '',
      currentBathrooms: '',
      afterRenovationBathrooms: '',
      monthlyIncome: '',
      isActualRent: false,
      hasActiveLease: false,
      annualTaxes: '',
      annualInsurance: '',
      annualFloodInsurance: '',
      annualHOA: '',
      propertyManager: '',
      sponsorIntentToOccupy: false,
      existingLiens: false,
      existingLiensAmount: '',
      isIncomeLoan: false
    }
  });

  // TODO: Make this more sophisticated later
  const calculateProgress = () => {
    const borrowerData = borrowerForm.watch();
    const propertyData = propertyForm.watch();
    const detailsData = detailsForm.watch();

    let completed = 0;
    let total = 0;

    // Check required borrower fields
    const borrowerRequired = [
      borrowerData.guarantorFullName,
      borrowerData.guarantorEmail,
      borrowerData.phoneNumber,
      borrowerData.fico,
      borrowerData.primaryResidenceAddress
    ];
    total += borrowerRequired.length;
    completed += borrowerRequired.filter(f => f && f.toString().trim()).length;

    // Property fields - depends on program type
    const propertyRequired = [
      propertyData.subjectPropertyAddress,
      propertyData.city,
      propertyData.zipCode,
      propertyData.propertyType,
      propertyData.numberOfUnits,
      propertyData.purchasePrice,
      propertyData.asIsValue
    ];
    
    if (selectedProgram?.includes('WithRehab')) {
      [propertyData.rehabNeeded, propertyData.arv].filter((v): v is string | number => v !== undefined).forEach(v => propertyRequired.push(v));
    }
    
    if (selectedProgram?.includes('purchase')) {
      if (propertyData.earnestMoneyDeposit !== undefined) {
        propertyRequired.push(propertyData.earnestMoneyDeposit);
      }
    }

    total += propertyRequired.length;
    completed += propertyRequired.filter(f => f && f.toString().trim()).length;

    // Basic details
    const detailsRequired = [
      detailsData.liquidCashAvailable,
      detailsData.currentSquareFootage,
      detailsData.afterRenovationSquareFootage,
      detailsData.annualTaxes,
      detailsData.annualInsurance
    ];
    total += detailsRequired.length;
    completed += detailsRequired.filter(f => f && f.toString().trim()).length;

    // Program selection
    total += 2;
    if (selectedProgram) completed++;
    if (selectedTerm) completed++;

    return Math.round((completed / total) * 100);
  };

  const generateQuote = () => {
    const borrowerData = borrowerForm.getValues();
    const propertyData = propertyForm.getValues();
    const detailsData = detailsForm.getValues();
    
    // Basic validation first
    const validationErrors = [];
    
    if (!selectedProgram) {
      validationErrors.push('Select a loan program');
    }
    
    if (!selectedTerm) {
      validationErrors.push('Select a loan term');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const validation = LoanCalculator.validateApplication(
        borrowerData, 
        propertyData, 
        detailsData,
        selectedProgram
      );
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        setQuote(null);
        return;
      }

      const newQuote = LoanCalculator.calculateLoanQuote(
        borrowerData,
        propertyData,
        detailsData,
        selectedProgram,
        selectedTerm 
      );

      setQuote(newQuote);
      setErrors([]);
      setCurrentTab('quote');
    } catch (err) {
      console.log('Quote generation failed:', err);
      setErrors(['Something went wrong generating the quote']);
      setQuote(null);
    }
  };

  const progress = calculateProgress();
  const propertyData = propertyForm.watch();
  const numUnits = toNumber(propertyData.numberOfUnits || 1);
  const hasRehab = selectedProgram?.includes('WithRehab') || false;

  return (
    <div className="min-h-screen bg-background">
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

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-6xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Real Estate Loan Application</CardTitle>
            <p className="text-center text-muted-foreground">
              Fill this out to get your quote
            </p>
          </CardHeader>
          <CardContent>
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="borrower">Borrower</TabsTrigger>
                <TabsTrigger value="program">Program</TabsTrigger>
                <TabsTrigger value="property">Property</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="quote">Quote</TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="borrower" className="space-y-6">
                  <BorrowerInfoForm form={borrowerForm} />
                  <div className="flex justify-end">
                    <Button onClick={() => setCurrentTab('program')}>
                      Next
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="program" className="space-y-6">
                  <LoanProgramForm
                    selectedProgram={selectedProgram}
                    selectedTerm={selectedTerm}
                    onProgramChange={setSelectedProgram}
                    onTermChange={setSelectedTerm}
                    numberOfUnits={numUnits}
                  />
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentTab('borrower')}>
                      Back
                    </Button>
                    <Button onClick={() => setCurrentTab('property')}>
                      Next
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="property" className="space-y-6">
                  <PropertyInfoForm 
                    form={propertyForm} 
                    selectedProgram={selectedProgram}
                  />
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentTab('program')}>
                      Back
                    </Button>
                    <Button onClick={() => setCurrentTab('details')}>
                      Next
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-6">
                  <PropertyDetailsForm 
                    form={detailsForm} 
                    hasRehab={hasRehab}
                  />
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentTab('property')}>
                      Back
                    </Button>
                    <Button onClick={generateQuote} className="bg-primary">
                      Get Quote
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="quote" className="space-y-6">
                  <LoanQuoteDisplay quote={quote} errors={errors} />
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentTab('details')}>
                      Back to Details
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

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Investor Tiers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>Bronze (0-1):</strong> 14% rate, 660+ FICO</div>
                <div><strong>Silver (2-4):</strong> 13% rate, 660+ FICO</div>
                <div><strong>Gold (5-9):</strong> 12% rate, advanced draws</div>
                <div><strong>Platinum (10+):</strong> 11% rate, best terms</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Loan Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>• Up to 90% LTV (1-4 units)</div>
                <div>• Up to 70% LTV (5-11 units)</div>
                <div>• 100% rehab coverage</div>
                <div>• No payments during renovation</div>
                <div>• 30-year fixed available</div>
                <div>• Soft credit check only</div>
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
                <div>• Liquid cash verified</div>
                <div>• 12+ units call us</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t bg-muted/50 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Quote is for info only, not a loan commitment.
            </p>
            <p className="text-sm text-muted-foreground">
              Soft credit check to close. Cash verified with 60 days bank statements.
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