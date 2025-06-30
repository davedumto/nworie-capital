// components/LoanProgramForm.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface LoanProgramFormProps {
  selectedPrograms: string[];
  selectedTerm: string;
  onProgramChange: (programs: string[]) => void;
  onTermChange: (term: string) => void;
}

export function LoanProgramForm({
  selectedPrograms,
  selectedTerm,
  onProgramChange,
  onTermChange
}: LoanProgramFormProps) {
  const handleProgramToggle = (program: string, checked: boolean) => {
    if (checked) {
      onProgramChange([...selectedPrograms, program]);
    } else {
      onProgramChange(selectedPrograms.filter(p => p !== program));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Program Selection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Loan Program (Check Only One):</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="purchaseWithRehab"
                checked={selectedPrograms.includes('purchaseWithRehab')}
                onCheckedChange={(checked) => handleProgramToggle('purchaseWithRehab', checked as boolean)}
              />
              <Label htmlFor="purchaseWithRehab">Purchase With Rehab</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="refinanceWithRehab"
                checked={selectedPrograms.includes('refinanceWithRehab')}
                onCheckedChange={(checked) => handleProgramToggle('refinanceWithRehab', checked as boolean)}
              />
              <Label htmlFor="refinanceWithRehab">Refinance With Rehab</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="purchaseWithoutRehab"
                checked={selectedPrograms.includes('purchaseWithoutRehab')}
                onCheckedChange={(checked) => handleProgramToggle('purchaseWithoutRehab', checked as boolean)}
              />
              <Label htmlFor="purchaseWithoutRehab">Purchase Without Rehab</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="refinanceWithoutRehab"
                checked={selectedPrograms.includes('refinanceWithoutRehab')}
                onCheckedChange={(checked) => handleProgramToggle('refinanceWithoutRehab', checked as boolean)}
              />
              <Label htmlFor="refinanceWithoutRehab">Refinance Without Rehab</Label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-semibold">Term:</Label>
          <RadioGroup value={selectedTerm} onValueChange={onTermChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="shortTerm" id="shortTerm" />
              <Label htmlFor="shortTerm">Short Term Bridge (1 or 2 Years, With or Without Rehab)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="longTerm" id="longTerm" />
              <Label htmlFor="longTerm">Long Term Rental (30yr Fixed, No Rehab Only)</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}

// components/LoanQuoteDisplay.tsx
