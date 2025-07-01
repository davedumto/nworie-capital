// components/loan-program.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

interface LoanProgramFormProps {
  selectedProgram: string;
  selectedTerm: string;
  onProgramChange: (program: string) => void;
  onTermChange: (term: string) => void;
  isPurchase: boolean;
  hasRehab: boolean;
  numberOfUnits: number;
}

export function LoanProgramForm({
  selectedProgram,
  selectedTerm,
  onProgramChange,
  onTermChange,
  isPurchase,
  hasRehab,
  numberOfUnits
}: LoanProgramFormProps) {
  
  const getAvailablePrograms = () => {
    if (isPurchase) {
      return hasRehab 
        ? [{ id: 'purchaseWithRehab', name: 'Purchase With Rehab', shortTermOnly: true }]
        : [{ id: 'purchaseWithoutRehab', name: 'Purchase Without Rehab', shortTermOnly: false }];
    } else {
      // Refinance
      return hasRehab 
        ? [{ id: 'refinanceWithRehab', name: 'Refinance With Rehab', shortTermOnly: true }]
        : [{ id: 'refinanceWithoutRehab', name: 'Refinance Without Rehab', shortTermOnly: false }];
    }
  };

  const getTermOptions = () => {
    const programs = getAvailablePrograms();
    const currentProgram = programs.find(p => p.id === selectedProgram);
    
    if (!currentProgram) return [];
    
    const terms = [
      { id: 'shortTerm', name: 'Short Term (12 months)', description: 'Standard renovation/flip loan' }
    ];
    
    // Only add long term option if program allows it
    if (!currentProgram.shortTermOnly) {
      terms.push({ 
        id: 'longTerm', 
        name: 'Long Term (24 months)', 
        description: 'For rental properties without rehab' 
      });
    }
    
    return terms;
  };

  const getLoanToValue = () => {
    if (numberOfUnits <= 4) return '90%';
    if (numberOfUnits <= 11) return '70%';
    return 'Contact Sales Required';
  };

  const availablePrograms = getAvailablePrograms();
  const termOptions = getTermOptions();

  // Auto-select the only available program
  React.useEffect(() => {
    if (availablePrograms.length === 1 && !selectedProgram) {
      onProgramChange(availablePrograms[0].id);
    }
  }, [availablePrograms, selectedProgram, onProgramChange]);

  // Auto-select short term if it's the only option
  React.useEffect(() => {
    if (termOptions.length === 1 && !selectedTerm) {
      onTermChange(termOptions[0].id);
    }
  }, [termOptions, selectedTerm, onTermChange]);

  // Handle 12+ units case
  if (numberOfUnits >= 12) {
    return (
      <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
        <CardHeader>
          <CardTitle className="text-orange-800 dark:text-orange-200">Sales Assistance Required</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 p-3 bg-orange-100 dark:bg-orange-900 border border-orange-200 dark:border-orange-700 rounded-md">
            <Info className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <p className="text-sm text-orange-700 dark:text-orange-300">
              Properties with 12 or more units require contacting our sales team for assistance. 
              Please call our office to discuss your financing options.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Loan Program Selection
          <Badge variant="outline">
            LTV: {getLoanToValue()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Transaction Summary */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Transaction Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Type:</span> {isPurchase ? 'Purchase' : 'Refinance'}
            </div>
            <div>
              <span className="font-medium">Rehab:</span> {hasRehab ? 'Yes' : 'No'}
            </div>
            <div>
              <span className="font-medium">Units:</span> {numberOfUnits}
            </div>
            <div>
              <span className="font-medium">LTV:</span> {getLoanToValue()}
            </div>
          </div>
        </div>

        {/* Available Programs */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Available Loan Programs</Label>
          
          {availablePrograms.length > 0 ? (
            <RadioGroup value={selectedProgram} onValueChange={onProgramChange}>
              {availablePrograms.map((program) => (
                <div key={program.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={program.id} id={program.id} />
                  <Label htmlFor={program.id} className="flex-1 cursor-pointer">
                    {program.name}
                    {program.shortTermOnly && (
                      <Badge variant="secondary" className="ml-2">Short Term Only</Badge>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Please complete the property information to see available loan programs.
              </p>
            </div>
          )}
        </div>

        {/* Term Selection */}
        {selectedProgram && termOptions.length > 0 && (
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Loan Term</Label>
            <RadioGroup value={selectedTerm} onValueChange={onTermChange}>
              {termOptions.map((term) => (
                <div key={term.id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={term.id} id={term.id} />
                    <Label htmlFor={term.id} className="flex-1 cursor-pointer">
                      {term.name}
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">{term.description}</p>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Loan Program Rules */}
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Loan Program Rules:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Purchase with rehab:</strong> Short-term only (12 months)</li>
            <li><strong>Purchase without rehab:</strong> Short-term or long-term available</li>
            <li><strong>Refinance with rehab:</strong> Short-term only (12 months)</li>
            <li><strong>Refinance without rehab:</strong> Short-term or long-term available</li>
            <li><strong>Ground-up construction:</strong> 24 months available</li>
          </ul>
        </div>

        {/* Program Features */}
        {selectedProgram && (
          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Program Features:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Up to {getLoanToValue()} Loan-to-Value</li>
              <li>100% rehab coverage (if applicable)</li>
              <li>No monthly payments during construction/renovation</li>
              <li>Dutch-style draws (interest only on funds used)</li>
              <li>Only soft credit check required</li>
              <li>Fast closing: 5 days with full documentation</li>
              <li>No tax returns, W-2s, or DTI required</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default LoanProgramForm;