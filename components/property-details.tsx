// components/PropertyDetailsForm.tsx
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
}

export function PropertyDetailsForm({ form }: PropertyDetailsFormProps) {
  const { register, formState: { errors }, setValue } = form;


  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="loanAmountRequested">Loan Amount Requested ($)</Label>
            <Input
              id="loanAmountRequested"
              type="number"
              {...register('loanAmountRequested', { 
                required: 'Loan amount is required',
                min: { value: 1, message: 'Must be greater than 0' }
              })}
            />
            {errors.loanAmountRequested && (
              <p className="text-sm text-red-500">{errors.loanAmountRequested.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="liquidCashAvailable">Liquid Cash Available ($)</Label>
            <Input
              id="liquidCashAvailable"
              type="number"
              {...register('liquidCashAvailable', { 
                required: 'Liquid cash amount is required',
                min: { value: 0, message: 'Cannot be negative' }
              })}
            />
            {errors.liquidCashAvailable && (
              <p className="text-sm text-red-500">{errors.liquidCashAvailable.message}</p>
            )}
          </div>
        </div>

        {/* Property Square Footage */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Property Square Footage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentSquareFootage">Current</Label>
              <Input
                id="currentSquareFootage"
                type="number"
                {...register('currentSquareFootage', { 
                  required: 'Current square footage is required',
                  min: { value: 1, message: 'Must be greater than 0' }
                })}
              />
              {errors.currentSquareFootage && (
                <p className="text-sm text-red-500">{errors.currentSquareFootage.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="afterRenovationSquareFootage">After Renovations</Label>
              <Input
                id="afterRenovationSquareFootage"
                type="number"
                {...register('afterRenovationSquareFootage', { 
                  required: 'After renovation square footage is required',
                  min: { value: 1, message: 'Must be greater than 0' }
                })}
              />
              {errors.afterRenovationSquareFootage && (
                <p className="text-sm text-red-500">{errors.afterRenovationSquareFootage.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Property Bedrooms */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Property Bedrooms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentBedrooms">Current</Label>
              <Input
                id="currentBedrooms"
                type="number"
                {...register('currentBedrooms', { 
                  required: 'Current bedrooms is required',
                  min: { value: 0, message: 'Cannot be negative' }
                })}
              />
              {errors.currentBedrooms && (
                <p className="text-sm text-red-500">{errors.currentBedrooms.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="afterRenovationBedrooms">After Renovations</Label>
              <Input
                id="afterRenovationBedrooms"
                type="number"
                {...register('afterRenovationBedrooms', { 
                  required: 'After renovation bedrooms is required',
                  min: { value: 0, message: 'Cannot be negative' }
                })}
              />
              {errors.afterRenovationBedrooms && (
                <p className="text-sm text-red-500">{errors.afterRenovationBedrooms.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Property Bathrooms */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Property Bathrooms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentBathrooms">Current</Label>
              <Input
                id="currentBathrooms"
                type="number"
                step="0.5"
                {...register('currentBathrooms', { 
                  required: 'Current bathrooms is required',
                  min: { value: 0, message: 'Cannot be negative' }
                })}
              />
              {errors.currentBathrooms && (
                <p className="text-sm text-red-500">{errors.currentBathrooms.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="afterRenovationBathrooms">After Renovations</Label>
              <Input
                id="afterRenovationBathrooms"
                type="number"
                step="0.5"
                {...register('afterRenovationBathrooms', { 
                  required: 'After renovation bathrooms is required',
                  min: { value: 0, message: 'Cannot be negative' }
                })}
              />
              {errors.afterRenovationBathrooms && (
                <p className="text-sm text-red-500">{errors.afterRenovationBathrooms.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Monthly Income */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Monthly Income</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyIncome">Monthly Income ($)</Label>
              <Input
                id="monthlyIncome"
                type="number"
                {...register('monthlyIncome', { 
                  required: 'Monthly income is required',
                  min: { value: 0, message: 'Cannot be negative' }
                })}
              />
              {errors.monthlyIncome && (
                <p className="text-sm text-red-500">{errors.monthlyIncome.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <Label>Income Type</Label>
              <RadioGroup
                defaultValue="market"
                onValueChange={(value) => setValue('isActualRent', value === 'actual')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="actual" id="actual" />
                  <Label htmlFor="actual">Actual Rent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="market" id="market" />
                  <Label htmlFor="market">Market Estimate</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* Lease Agreement */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasActiveLease"
              onCheckedChange={(checked) => setValue('hasActiveLease', checked as boolean)}
            />
            <Label htmlFor="hasActiveLease">Is there an active Lease Agreement?</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            If yes, include a copy of the Lease Agreement(s)
          </p>
        </div>

        {/* Annual Expenses */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Annual Expenses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="annualTaxes">Annual Taxes ($)</Label>
              <Input
                id="annualTaxes"
                type="number"
                {...register('annualTaxes', { 
                  required: 'Annual taxes is required',
                  min: { value: 0, message: 'Cannot be negative' }
                })}
              />
              {errors.annualTaxes && (
                <p className="text-sm text-red-500">{errors.annualTaxes.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualInsurance">Annual Insurance ($)</Label>
              <Input
                id="annualInsurance"
                type="number"
                {...register('annualInsurance', { 
                  required: 'Annual insurance is required',
                  min: { value: 0, message: 'Cannot be negative' }
                })}
              />
              {errors.annualInsurance && (
                <p className="text-sm text-red-500">{errors.annualInsurance.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualFloodInsurance">Annual Flood Insurance (optional) ($)</Label>
              <Input
                id="annualFloodInsurance"
                type="number"
                {...register('annualFloodInsurance', { 
                  min: { value: 0, message: 'Cannot be negative' }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualHOA">Annual HOA (optional) ($)</Label>
              <Input
                id="annualHOA"
                type="number"
                {...register('annualHOA', { 
                  min: { value: 0, message: 'Cannot be negative' }
                })}
              />
            </div>
          </div>
        </div>

        {/* Property Management */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Property Management</h3>
          <div className="space-y-2">
            <Label htmlFor="propertyManager">Who will manage the property?</Label>
            <Textarea
              id="propertyManager"
              {...register('propertyManager', { required: 'Property manager information is required' })}
              placeholder="Describe who will manage the property"
            />
            {errors.propertyManager && (
              <p className="text-sm text-red-500">{errors.propertyManager.message}</p>
            )}
          </div>
        </div>

        {/* Additional Questions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Additional Information</h3>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sponsorIntentToOccupy"
              onCheckedChange={(checked) => setValue('sponsorIntentToOccupy', checked as boolean)}
            />
            <Label htmlFor="sponsorIntentToOccupy">
              Do any of the sponsors or entity members intend to occupy the property?
            </Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="existingLiens"
                onCheckedChange={(checked) => setValue('existingLiens', checked as boolean)}
              />
              <Label htmlFor="existingLiens">Are there any existing liens on the property?</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="existingLiensAmount">If so, how much? ($)</Label>
              <Input
                id="existingLiensAmount"
                type="number"
                {...register('existingLiensAmount', { 
                  min: { value: 0, message: 'Cannot be negative' }
                })}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}