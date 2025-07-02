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
  numberOfUnits: number;
}

export function LoanProgramForm({
  selectedProgram,
  selectedTerm,
  onProgramChange,
  onTermChange,
  numberOfUnits
}: LoanProgramFormProps) {
  
  const programs = [
    { 
      id: 'purchaseWithRehab', 
      name: 'Purchase + Rehab (Fix & Flip)', 
      description: 'Buy and fix properties to sell',
      hasRehab: true,
      isPurchase: true
    },
    { 
      id: 'purchaseWithoutRehab', 
      name: 'Purchase Only (DSCR)', 
      description: 'Buy rental properties as-is',
      hasRehab: false,
      isPurchase: true
    },
    { 
      id: 'refinanceWithRehab', 
      name: 'Refi + Rehab', 
      description: 'Refinance and renovate',
      hasRehab: true,
      isPurchase: false
    },
    { 
      id: 'refinanceWithoutRehab', 
      name: 'Refi Only (DSCR)', 
      description: 'Cash-out refi without work',
      hasRehab: false,
      isPurchase: false
    }
  ];

  const getTerms = () => {
    const program = programs.find(p => p.id === selectedProgram);
    
    if (!program) return [];
    if (program.hasRehab) {
      return [
        { id: 'shortTerm12', name: '12 Months', description: 'Interest only' },
        { id: 'shortTerm24', name: '24 Months', description: 'More time for reno' }
      ];
    }
    return [
      { id: 'shortTerm12', name: '12 Months', description: 'Interest only' },
      { id: 'shortTerm24', name: '24 Months', description: 'Interest only' },
      { id: 'dscr30', name: '30 Year Fixed', description: 'P&I payments' }
    ];
  };

  const getLTV = () => {
    if (numberOfUnits <= 4) return '90%';
    if (numberOfUnits <= 11) return '70%';
    return 'Call Us';
  };

  const getFeatures = () => {
    const program = programs.find(p => p.id === selectedProgram);
    
    if (!program) return [];

    if (program.hasRehab) {
      return [
        'Up to ' + getLTV() + ' LTV',
        '100% rehab funding',
        'No payments during construction',
        'Interest only on funds used',
        'Soft credit check only',
        '5-day close with docs'
      ];
    } else {
      return [
        'Up to ' + getLTV() + ' LTV',
        'Income from rent qualifies loan',
        'No personal income needed',
        '30-year option available',
        'Soft credit check only',
        '5-day close with docs'
      ];
    }
  };
  if (numberOfUnits >= 12) {
    return (
      <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
        <CardHeader>
          <CardTitle className="text-orange-800 dark:text-orange-200">Call Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 p-3 bg-orange-100 dark:bg-orange-900 border border-orange-200 dark:border-orange-700 rounded-md">
            <Info className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <p className="text-sm text-orange-700 dark:text-orange-300">
              12+ units need special handling. Give us a call to discuss options.
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
          Pick Your Program
          <Badge variant="outline">
            LTV: {getLTV()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-lg font-semibold">What do you want to do?</Label>
          
          <RadioGroup value={selectedProgram} onValueChange={onProgramChange}>
            {programs.map((program) => (
              <div key={program.id} className="flex items-center space-x-2">
                <RadioGroupItem value={program.id} id={program.id} />
                <Label htmlFor={program.id} className="flex-1 cursor-pointer">
                  <div>
                    <div className="font-medium">{program.name}</div>
                    <div className="text-sm text-muted-foreground">{program.description}</div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        {selectedProgram && (
          <div className="space-y-4">
            <Label className="text-lg font-semibold">How long?</Label>
            <RadioGroup value={selectedTerm} onValueChange={onTermChange}>
              {getTerms().map((term) => (
                <div key={term.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={term.id} id={term.id} />
                  <Label htmlFor={term.id} className="flex-1 cursor-pointer">
                    <div>
                      <div className="font-medium">{term.name}</div>
                      <div className="text-sm text-muted-foreground">{term.description}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}
        {selectedProgram && (
          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">What you get:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {getFeatures().map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Quick Guide:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Fix & Flip:</strong> Short term only, we fund the rehab</li>
            <li><strong>DSCR:</strong> Rent income qualifies you, not your W-2</li>
            <li><strong>30-Year Fixed:</strong> Regular monthly payments like a normal mortgage</li>
            <li><strong>Short Term:</strong> Interest only, balloon payment at end</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default LoanProgramForm;