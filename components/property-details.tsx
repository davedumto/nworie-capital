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
  hasRehab?: boolean; // Optional prop for rehab-related logic
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
        {/* Liquid Cash Available */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="liquidCashAvailable">Liquid Cash Available ($) *</Label>
            <Input
              id="liquidCashAvailable"
              type="number"
              {...register('liquidCashAvailable', { 
                required: 'Liquid cash amount is required',
                min: { value: 1, message: 'Liquid cash must be greater than 0' }
              })}
              placeholder="Enter liquid cash available"
            />
            {errors.liquidCashAvailable && (
              <p className="text-sm text-red-500">{errors.liquidCashAvailable.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Required for loan approval. Applications with $0 liquid cash will be rejected.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Checkbox
                id="isIncomeLoan"
                onCheckedChange={(checked) => setValue('isIncomeLoan', checked as boolean)}
              />
              <span>Income-based loan</span>
            </Label>
            <p className="text-xs text-muted-foreground">
              Check if this loan will be based on property income
            </p>
          </div>
        </div>

        {/* Property Square Footage */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Property Square Footage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentSquareFootage">Current Square Footage *</Label>
              <Input
                id="currentSquareFootage"
                type="number"
                {...register('currentSquareFootage', { 
                  required: 'Current square footage is required',
                  min: { value: 1, message: 'Must be greater than 0' }
                })}
                placeholder="e.g., 1200"
              />
              {errors.currentSquareFootage && (
                <p className="text-sm text-red-500">{errors.currentSquareFootage.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="afterRenovationSquareFootage">After Renovations *</Label>
              <Input
                id="afterRenovationSquareFootage"
                type="number"
                {...register('afterRenovationSquareFootage', { 
                  required: 'After renovation square footage is required',
                  min: { value: 1, message: 'Must be greater than 0' }
                })}
                placeholder="e.g., 1500"
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
              <Label htmlFor="currentBedrooms">Current Bedrooms</Label>
              <Input
                id="currentBedrooms"
                type="number"
                {...register('currentBedrooms', { 
                  min: { value: 0, message: 'Cannot be negative' }
                })}
                placeholder="e.g., 3"
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
                  min: { value: 0, message: 'Cannot be negative' }
                })}
                placeholder="e.g., 4"
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
              <Label htmlFor="currentBathrooms">Current Bathrooms</Label>
              <Input
                id="currentBathrooms"
                type="number"
                step="0.5"
                {...register('currentBathrooms', { 
                  min: { value: 0, message: 'Cannot be negative' }
                })}
                placeholder="e.g., 2.5"
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
                  min: { value: 0, message: 'Cannot be negative' }
                })}
                placeholder="e.g., 3"
              />
              {errors.afterRenovationBathrooms && (
                <p className="text-sm text-red-500">{errors.afterRenovationBathrooms.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Monthly Income Section - Only show if income loan or always required */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Monthly Income 
            {isIncomeLoan && <span className="text-red-500"> *</span>}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyIncome">
                Monthly Income ($)
                {isIncomeLoan && <span className="text-red-500"> *</span>}
              </Label>
              <Input
                id="monthlyIncome"
                type="number"
                {...register('monthlyIncome', { 
                  required: isIncomeLoan ? 'Monthly income is required for income loans' : false,
                  min: { value: 0, message: 'Cannot be negative' }
                })}
                placeholder="e.g., 2500"
              />
              {errors.monthlyIncome && (
                <p className="text-sm text-red-500">{errors.monthlyIncome.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <Label>Income Type</Label>
              <RadioGroup
                defaultValue={isActualRent ? "actual" : "market"}
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
            If yes, include a copy of the Lease Agreement(s) with your application
          </p>
        </div>

        {/* Annual Expenses */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Annual Expenses
            {isIncomeLoan && <span className="text-red-500"> * Required for income loans</span>}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="annualTaxes">
                Annual Taxes ($)
                {isIncomeLoan && <span className="text-red-500"> *</span>}
              </Label>
              <Input
                id="annualTaxes"
                type="number"
                {...register('annualTaxes', { 
                  required: isIncomeLoan ? 'Annual taxes required for income loans' : 'Annual taxes is required',
                  min: { value: 0, message: 'Cannot be negative' }
                })}
                placeholder="e.g., 3500"
              />
              {errors.annualTaxes && (
                <p className="text-sm text-red-500">{errors.annualTaxes.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualInsurance">
                Annual Insurance ($)
                {isIncomeLoan && <span className="text-red-500"> *</span>}
              </Label>
              <Input
                id="annualInsurance"
                type="number"
                {...register('annualInsurance', { 
                  required: isIncomeLoan ? 'Annual insurance required for income loans' : 'Annual insurance is required',
                  min: { value: 0, message: 'Cannot be negative' }
                })}
                placeholder="e.g., 1200"
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
                placeholder="e.g., 500"
              />
              {errors.annualFloodInsurance && (
                <p className="text-sm text-red-500">{errors.annualFloodInsurance.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualHOA">Annual HOA (optional) ($)</Label>
              <Input
                id="annualHOA"
                type="number"
                {...register('annualHOA', { 
                  min: { value: 0, message: 'Cannot be negative' }
                })}
                placeholder="e.g., 1800"
              />
              {errors.annualHOA && (
                <p className="text-sm text-red-500">{errors.annualHOA.message}</p>
              )}
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
              {...register('propertyManager')}
              placeholder="Describe who will manage the property (e.g., self-managed, property management company name, etc.)"
              rows={3}
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

            {existingLiens && (
              <div className="space-y-2">
                <Label htmlFor="existingLiensAmount">Existing Liens Amount ($) *</Label>
                <Input
                  id="existingLiensAmount"
                  type="number"
                  {...register('existingLiensAmount', { 
                    required: existingLiens ? 'Lien amount is required when liens exist' : false,
                    min: { value: 0, message: 'Cannot be negative' }
                  })}
                  placeholder="e.g., 150000"
                />
                {errors.existingLiensAmount && (
                  <p className="text-sm text-red-500">{errors.existingLiensAmount.message}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Summary Information */}
        {hasRehab && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <h4 className="font-semibold mb-2">Rehab Project Information</h4>
            <p className="text-sm text-muted-foreground">
              Since this is a rehab project, ensure all `after renovation` fields reflect the final 
              state of the property. This information will be used for loan calculations and ARV verification.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}