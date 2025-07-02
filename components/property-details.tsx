'use client';

import { UseFormReturn } from 'react-hook-form';
import { PropertyDetails } from '@/types/loan';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

interface PropertyDetailsFormProps {
  form: UseFormReturn<PropertyDetails>;
  hasRehab?: boolean;
}

export function PropertyDetailsForm({ form, hasRehab }: PropertyDetailsFormProps) {
  const { register, formState: { errors }, setValue, watch } = form;

  const isActualRent = watch('isActualRent');
  const existingLiens = watch('existingLiens');
  const isIncomeLoan = watch('isIncomeLoan');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="liquidCashAvailable">Cash Available ($) *</Label>
            <Input
              id="liquidCashAvailable"
              type="number"
              {...register('liquidCashAvailable', { 
                required: 'Cash required',
                min: { value: 1, message: 'Must be greater than 0' }
              })}
              placeholder="50000"
            />
            {errors.liquidCashAvailable && (
              <p className="text-sm text-red-500">{errors.liquidCashAvailable.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              No cash = no loan
            </p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Checkbox
                id="isIncomeLoan"
                onCheckedChange={(checked) => setValue('isIncomeLoan', checked as boolean)}
              />
              <span>Income-based loan (DSCR)</span>
            </Label>
            <p className="text-xs text-muted-foreground">
              Check for rental income qualification
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Square Footage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentSquareFootage">Current Sqft *</Label>
              <Input
                id="currentSquareFootage"
                type="number"
                {...register('currentSquareFootage', { 
                  required: 'Required',
                  min: { value: 1, message: 'Must be > 0' }
                })}
                placeholder="1200"
              />
              {errors.currentSquareFootage && (
                <p className="text-sm text-red-500">{errors.currentSquareFootage.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="afterRenovationSquareFootage">After Reno Sqft *</Label>
              <Input
                id="afterRenovationSquareFootage"
                type="number"
                {...register('afterRenovationSquareFootage', { 
                  required: 'Required',
                  min: { value: 1, message: 'Must be > 0' }
                })}
                placeholder="1500"
              />
              {errors.afterRenovationSquareFootage && (
                <p className="text-sm text-red-500">{errors.afterRenovationSquareFootage.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Bed/Bath</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentBedrooms">Current Beds</Label>
              <Input
                id="currentBedrooms"
                type="number"
                {...register('currentBedrooms', { 
                  min: { value: 0, message: 'Cannot be negative' }
                })}
                placeholder="3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="afterRenovationBedrooms">After Beds</Label>
              <Input
                id="afterRenovationBedrooms"
                type="number"
                {...register('afterRenovationBedrooms', { 
                  min: { value: 0, message: 'Cannot be negative' }
                })}
                placeholder="4"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentBathrooms">Current Baths</Label>
              <Input
                id="currentBathrooms"
                type="number"
                step="0.5"
                {...register('currentBathrooms', { 
                  min: { value: 0, message: 'Cannot be negative' }
                })}
                placeholder="2.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="afterRenovationBathrooms">After Baths</Label>
              <Input
                id="afterRenovationBathrooms"
                type="number"
                step="0.5"
                {...register('afterRenovationBathrooms', { 
                  min: { value: 0, message: 'Cannot be negative' }
                })}
                placeholder="3"
              />
            </div>
          </div>
        </div>
        {isIncomeLoan && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Monthly Rent *</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">Monthly Rent ($) *</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  {...register('monthlyIncome', { 
                    required: 'Monthly rent required for DSCR loans',
                    min: { value: 0, message: 'Cannot be negative' }
                  })}
                  placeholder="2500"
                />
                {errors.monthlyIncome && (
                  <p className="text-sm text-red-500">{errors.monthlyIncome.message}</p>
                )}
              </div>

              <div className="space-y-4">
                <Label>Rent Type</Label>
                <RadioGroup
                  defaultValue={isActualRent ? "actual" : "market"}
                  onValueChange={(value) => setValue('isActualRent', value === 'actual')}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="actual" id="actual" />
                    <Label htmlFor="actual">Actual (have lease)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="market" id="market" />
                    <Label htmlFor="market">Market estimate</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasActiveLease"
                onCheckedChange={(checked) => setValue('hasActiveLease', checked as boolean)}
              />
              <Label htmlFor="hasActiveLease">Have active lease?</Label>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Annual Expenses *</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="annualTaxes">Taxes ($) *</Label>
              <Input
                id="annualTaxes"
                type="number"
                {...register('annualTaxes', { 
                  required: 'Taxes required',
                  min: { value: 0, message: 'Cannot be negative' }
                })}
                placeholder="3500"
              />
              {errors.annualTaxes && (
                <p className="text-sm text-red-500">{errors.annualTaxes.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualInsurance">Insurance ($) *</Label>
              <Input
                id="annualInsurance"
                type="number"
                {...register('annualInsurance', { 
                  required: 'Insurance required',
                  min: { value: 0, message: 'Cannot be negative' }
                })}
                placeholder="1200"
              />
              {errors.annualInsurance && (
                <p className="text-sm text-red-500">{errors.annualInsurance.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualFloodInsurance">Flood Insurance ($)</Label>
              <Input
                id="annualFloodInsurance"
                type="number"
                {...register('annualFloodInsurance', { 
                  min: { value: 0, message: 'Cannot be negative' }
                })}
                placeholder="500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualHOA">HOA ($)</Label>
              <Input
                id="annualHOA"
                type="number"
                {...register('annualHOA', { 
                  min: { value: 0, message: 'Cannot be negative' }
                })}
                placeholder="1800"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="propertyManager">Who manages the property?</Label>
          <Textarea
            id="propertyManager"
            {...register('propertyManager')}
            placeholder="Self-managed, ABC Property Management, etc."
            rows={2}
          />
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Other Info</h3>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sponsorIntentToOccupy"
              onCheckedChange={(checked) => setValue('sponsorIntentToOccupy', checked as boolean)}
            />
            <Label htmlFor="sponsorIntentToOccupy">
              Will you live in the property?
            </Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="existingLiens"
                onCheckedChange={(checked) => setValue('existingLiens', checked as boolean)}
              />
              <Label htmlFor="existingLiens">Existing liens on property?</Label>
            </div>

            {existingLiens && (
              <div className="space-y-2">
                <Label htmlFor="existingLiensAmount">Lien Amount ($) *</Label>
                <Input
                  id="existingLiensAmount"
                  type="number"
                  {...register('existingLiensAmount', { 
                    required: 'Lien amount required',
                    min: { value: 0, message: 'Cannot be negative' }
                  })}
                  placeholder="150000"
                />
                {errors.existingLiensAmount && (
                  <p className="text-sm text-red-500">{errors.existingLiensAmount.message}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {hasRehab && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-sm">
              <strong>Rehab project:</strong> Fill out `after reno` fields with your final plans.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}