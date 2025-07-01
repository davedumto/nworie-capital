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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Helper function to convert string to number safely
  const toNumber = (value: string | number | undefined): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  // Helper function to check if a field has a meaningful value
  const hasValue = (field: string | number | undefined): boolean => {
    if (typeof field === 'string') {
      return field.trim() !== '';
    }
    return field !== 0 && field !== null && field !== undefined;
  };

  const borrowerForm = useForm<BorrowerInfo>({
    defaultValues: {
      guarantorFullName: '',
      guarantorEmail: '',
      phoneNumber: '',
      propertiesOwned: '', // String for better UX
      propertiesSold: '', // String for better UX
      totalExperience: '', // String for better UX
      fico: '', // String for better UX
      socialSecurity: '',
      usCitizen: false,
      dateOfBirth: '',
      primaryResidenceAddress: '',
      ownOrRentPrimary: 'own',
      yearsAtPrimaryResidence: '', // String for better UX
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
      numberOfUnits: '', // String for better UX
      purchasePrice: '', // String for better UX
      asIsValue: '', // String for better UX
      purchaseDate: '',
      estimatedPayoff: '', // String for better UX
      rehabNeeded: '', // String for better UX
      rehabAlreadyCompleted: '', // String for better UX
      arv: '', // String for better UX
      hasComps: false,
      isPurchase: true,
      earnestMoneyDeposit: '' // String for better UX
    }
  });

  const detailsForm = useForm<PropertyDetails>({
    defaultValues: {
      liquidCashAvailable: '', // String for better UX
      currentSquareFootage: '', // String for better UX
      afterRenovationSquareFootage: '', // String for better UX
      currentBedrooms: '', // String for better UX
      afterRenovationBedrooms: '', // String for better UX
      currentBathrooms: '', // String for better UX
      afterRenovationBathrooms: '', // String for better UX
      monthlyIncome: '', // String for better UX
      isActualRent: false,
      hasActiveLease: false,
      annualTaxes: '', // String for better UX
      annualInsurance: '', // String for better UX
      annualFloodInsurance: '', // String for better UX
      annualHOA: '', // String for better UX
      propertyManager: '',
      sponsorIntentToOccupy: false,
      existingLiens: false,
      existingLiensAmount: '', // String for better UX
      isIncomeLoan: false
    }
  });

  const calculateProgress = () => {
    const borrowerData = borrowerForm.watch();
    const propertyData = propertyForm.watch();
    const detailsData = detailsForm.watch();

    let completedFields = 0;
    let totalFields = 0;

    // Required borrower fields
    const requiredBorrowerFields = [
      borrowerData.guarantorFullName,
      borrowerData.guarantorEmail,
      borrowerData.phoneNumber,
      borrowerData.fico,
      borrowerData.socialSecurity,
      borrowerData.dateOfBirth,
      borrowerData.primaryResidenceAddress
    ];
    totalFields += requiredBorrowerFields.length;
    completedFields += requiredBorrowerFields.filter(field => hasValue(field)).length;

    // Required property fields
    const requiredPropertyFields = [
      propertyData.subjectPropertyAddress,
      propertyData.city,
      propertyData.zipCode,
      propertyData.propertyType,
      propertyData.numberOfUnits,
      propertyData.purchasePrice,
      propertyData.asIsValue,
      propertyData.arv
    ];
    totalFields += requiredPropertyFields.length;
    completedFields += requiredPropertyFields.filter(field => hasValue(field)).length;

    // Required details fields
    const requiredDetailsFields = [
      detailsData.liquidCashAvailable,
      detailsData.currentSquareFootage,
      detailsData.afterRenovationSquareFootage,
      detailsData.annualTaxes,
      detailsData.annualInsurance
    ];
    totalFields += requiredDetailsFields.length;
    completedFields += requiredDetailsFields.filter(field => hasValue(field)).length;

    // Program selection
    totalFields += 2;
    if (selectedProgram) completedFields += 1;
    if (selectedTerm) completedFields += 1;

    return Math.round((completedFields / totalFields) * 100);
  };

  // Convert form data to the format expected by LoanCalculator
  const convertBorrowerData = (formData: BorrowerInfo) => ({
    ...formData,
    propertiesOwned: toNumber(formData.propertiesOwned),
    propertiesSold: toNumber(formData.propertiesSold),
    totalExperience: toNumber(formData.totalExperience),
    fico: toNumber(formData.fico),
    yearsAtPrimaryResidence: toNumber(formData.yearsAtPrimaryResidence)
  });

  const convertPropertyData = (formData: PropertyInfo) => ({
    ...formData,
    numberOfUnits: toNumber(formData.numberOfUnits),
    purchasePrice: toNumber(formData.purchasePrice),
    asIsValue: toNumber(formData.asIsValue),
    estimatedPayoff: toNumber(formData.estimatedPayoff),
    rehabNeeded: toNumber(formData.rehabNeeded),
    rehabAlreadyCompleted: toNumber(formData.rehabAlreadyCompleted),
    arv: toNumber(formData.arv),
    earnestMoneyDeposit: toNumber(formData.earnestMoneyDeposit)
  });

  const convertDetailsData = (formData: PropertyDetails) => ({
    ...formData,
    liquidCashAvailable: toNumber(formData.liquidCashAvailable),
    currentSquareFootage: toNumber(formData.currentSquareFootage),
    afterRenovationSquareFootage: toNumber(formData.afterRenovationSquareFootage),
    currentBedrooms: formData.currentBedrooms ? toNumber(formData.currentBedrooms) : undefined,
    afterRenovationBedrooms: formData.afterRenovationBedrooms ? toNumber(formData.afterRenovationBedrooms) : undefined,
    currentBathrooms: formData.currentBathrooms ? toNumber(formData.currentBathrooms) : undefined,
    afterRenovationBathrooms: formData.afterRenovationBathrooms ? toNumber(formData.afterRenovationBathrooms) : undefined,
    monthlyIncome: formData.monthlyIncome ? toNumber(formData.monthlyIncome) : undefined,
    annualTaxes: toNumber(formData.annualTaxes),
    annualInsurance: toNumber(formData.annualInsurance),
    annualFloodInsurance: formData.annualFloodInsurance ? toNumber(formData.annualFloodInsurance) : undefined,
    annualHOA: formData.annualHOA ? toNumber(formData.annualHOA) : undefined,
    existingLiensAmount: toNumber(formData.existingLiensAmount)
  });

  const generateQuote = () => {
    const borrowerFormData = borrowerForm.getValues();
    const propertyFormData = propertyForm.getValues();
    const detailsFormData = detailsForm.getValues();

    // Convert form data to proper types for validation and calculation
    convertBorrowerData(borrowerFormData);
    convertPropertyData(propertyFormData);
    convertDetailsData(detailsFormData);

    // Validate the application
    const validation = LoanCalculator.validateApplication(borrowerFormData, propertyFormData, detailsFormData);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setQuote(null);
      return;
    }

    // Additional validations
    const errors: string[] = [];
    
    if (!selectedProgram) {
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
      const generatedQuote = LoanCalculator.calculateLoanQuote(
        borrowerFormData,
        propertyFormData,
        detailsFormData,
        selectedProgram
      );

      setQuote(generatedQuote);
      setValidationErrors([]);
      setCurrentTab('quote');
    } catch (error) {
      setValidationErrors([error instanceof Error ? error.message : 'Error generating quote. Please check your inputs.']);
      setQuote(null);
    }
  };

  const progress = calculateProgress();
  
  // Watch property data for loan program form
  const propertyData = propertyForm.watch();
  const isPurchase = propertyData.isPurchase;
  const hasRehab = toNumber(propertyData.rehabNeeded || 0) > 0;
  const numberOfUnits = toNumber(propertyData.numberOfUnits || 1);

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
              {/* Correct tab order: Borrower → Loan Program → Property → Details → Quote */}
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="borrower">Borrower Info</TabsTrigger>
                <TabsTrigger value="program">Loan Program</TabsTrigger>
                <TabsTrigger value="property">Property Info</TabsTrigger>
                <TabsTrigger value="details">Property Details</TabsTrigger>
                <TabsTrigger value="quote">Quote</TabsTrigger>
              </TabsList>

              <div className="mt-6">
                {/* Step 1: Borrower Information */}
                <TabsContent value="borrower" className="space-y-6">
                  <BorrowerInfoForm form={borrowerForm} />
                  <div className="flex justify-end">
                    <Button onClick={() => setCurrentTab('program')}>
                      Next: Loan Program
                    </Button>
                  </div>
                </TabsContent>

                {/* Step 2: Loan Program Selection */}
                <TabsContent value="program" className="space-y-6">
                  <LoanProgramForm
                    selectedProgram={selectedProgram}
                    selectedTerm={selectedTerm}
                    onProgramChange={setSelectedProgram}
                    onTermChange={setSelectedTerm}
                    isPurchase={isPurchase}
                    hasRehab={hasRehab}
                    numberOfUnits={numberOfUnits}
                  />
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentTab('borrower')}>
                      Previous
                    </Button>
                    <Button onClick={() => setCurrentTab('property')}>
                      Next: Property Info
                    </Button>
                  </div>
                </TabsContent>

                {/* Step 3: Property Information */}
                <TabsContent value="property" className="space-y-6">
                  <PropertyInfoForm form={propertyForm} />
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentTab('program')}>
                      Previous
                    </Button>
                    <Button onClick={() => setCurrentTab('details')}>
                      Next: Property Details
                    </Button>
                  </div>
                </TabsContent>

                {/* Step 4: Property Details */}
                <TabsContent value="details" className="space-y-6">
                  <PropertyDetailsForm 
                    form={detailsForm} 
                    hasRehab={hasRehab}
                  />
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentTab('property')}>
                      Previous
                    </Button>
                    <Button onClick={generateQuote} className="bg-primary">
                      Generate Quote
                    </Button>
                  </div>
                </TabsContent>

                {/* Step 5: Quote Display */}
                <TabsContent value="quote" className="space-y-6">
                  <LoanQuoteDisplay quote={quote} errors={validationErrors} />
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentTab('details')}>
                      Back to Property Details
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

        {/* Updated Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Investor Tiers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>Bronze (0-1 total):</strong> 14% rate, 660+ FICO, reimbursement draws</div>
                <div><strong>Silver (2-4 total):</strong> 13% rate, 660+ FICO, reimbursement draws</div>
                <div><strong>Gold (5-9 total):</strong> 12% rate, 660+ FICO, advanced draws</div>
                <div><strong>Platinum (10+ total):</strong> 11% rate, best terms, advanced draws</div>
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
                <div>• No monthly payments during construction/renovation</div>
                <div>• Only soft credit check required</div>
                <div>• 12 months standard / 24 months long-term/construction</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>• 660+ FICO (680+ for ground-up construction)</div>
                <div>• Non-owner occupied only</div>
                <div>• $100K - $3M loan range</div>
                <div>• Liquid cash required (verified with bank statements)</div>
                <div>• 12+ units contact sales for assistance</div>
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
              Only a soft credit check is needed to close. Liquid cash will be verified with 60 days of bank statements.
            </p>
            <p className="text-sm text-muted-foreground">
              Experience calculated as: Properties Owned + Properties Sold = Total Experience
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