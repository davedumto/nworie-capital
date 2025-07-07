// components/PropertyInfoForm.tsx
'use client';

import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PropertyInfo } from '@/types/loan';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { ZipCodeLookup, ZipCodeLookupResult } from '@/utils/zip-code-lookup';
import { Loader2, MapPin, Building2, Trees } from 'lucide-react';

interface PropertyInfoFormProps {
  form: UseFormReturn<PropertyInfo>;
  selectedProgram: string; 
}

export function PropertyInfoForm({ form, selectedProgram }: PropertyInfoFormProps) {
  const { register, formState: { errors }, setValue, watch } = form;
  
  const [zipLookupResult, setZipLookupResult] = useState<ZipCodeLookupResult | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  
  const numberOfUnits = watch('numberOfUnits') || 1;
  const currentZipCode = watch('zipCode');
  const isPurchase = selectedProgram?.includes('purchase') || false;
  const hasRehab = selectedProgram?.includes('WithRehab') || false;
  const isDSCR = !hasRehab && selectedProgram; // DSCR programs are without rehab
  const isActualRent = watch('isActualRent');

  const handleZipCodeLookup = async () => {
    if (!currentZipCode) return;
    
    setIsLookingUp(true);
    try {
      const result = await ZipCodeLookup.classifyZipCode(currentZipCode);
      setZipLookupResult(result);
      
    } catch {
      setZipLookupResult({
        found: false,
        error: 'Failed to lookup zip code classification'
      });
    } finally {
      setIsLookingUp(false);
    }
  };

  const getLoanToValue = (units: number) => {
    if (units <= 4) return '90%';
    if (units <= 11) return '70%';
    return 'Contact Sales';
  };

  const getAreaTypeDisplay = (areaType: 'urban' | 'rural', confidence: 'high' | 'medium' | 'low') => {
    const isUrban = areaType === 'urban';
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        isUrban 
          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      }`}>
        {isUrban ? <Building2 className="w-4 h-4 mr-1" /> : <Trees className="w-4 h-4 mr-1" />}
        {areaType.charAt(0).toUpperCase() + areaType.slice(1)} Area
        <span className={`ml-2 text-xs px-1 py-0.5 rounded ${
          confidence === 'high' 
            ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
            : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
        }`}>
          {confidence} confidence
        </span>
      </div>
    );
  };

  const getProgramTitle = () => {
    switch (selectedProgram) {
      case 'purchaseWithRehab':
        return 'Purchase with Rehab (Fix-n-Flip) - Property Information';
      case 'purchaseWithoutRehab':
        return 'Purchase without Rehab (DSCR) - Property Information';
      case 'refinanceWithRehab':
        return 'Refinance with Rehab - Property Information';
      case 'refinanceWithoutRehab':
        return 'Refinance without Rehab (DSCR) - Property Information';
      default:
        return 'Property Information';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getProgramTitle()}</CardTitle>
        {selectedProgram && (
          <p className="text-sm text-muted-foreground">
            {hasRehab 
              ? 'Provide property details including renovation costs and after-repair value (ARV).'
              : 'Provide property details for this DSCR loan based on current rental income potential.'
            }
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="subjectPropertyAddress">Subject Property Address *</Label>
          <Input
            id="subjectPropertyAddress"
            {...register('subjectPropertyAddress', { required: 'Property address is required' })}
          />
          {errors.subjectPropertyAddress && (
            <p className="text-sm text-red-500">{errors.subjectPropertyAddress.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              {...register('city', { required: 'City is required' })}
            />
            {errors.city && (
              <p className="text-sm text-red-500">{errors.city.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              {...register('state', { required: 'State is required' })}
              placeholder="TX"
              maxLength={2}
            />
            {errors.state && (
              <p className="text-sm text-red-500">{errors.state.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">Zip Code *</Label>
            <div className="flex space-x-2">
              <Input
                id="zipCode"
                {...register('zipCode', { 
                  required: 'Zip code is required',
                  pattern: {
                    value: /^\d{5}$/,
                    message: 'Zip code must be 5 digits'
                  }
                })}
                maxLength={5}
                placeholder="12345"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleZipCodeLookup}
                disabled={isLookingUp || !currentZipCode || currentZipCode.length !== 5}
                className="px-3 shrink-0"
                title="Classify area as rural or urban"
              >
                {isLookingUp ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.zipCode && (
              <p className="text-sm text-red-500">{errors.zipCode.message}</p>
            )}
            
            {/* Zip Code Classification Results */}
            {zipLookupResult && (
              <div className="mt-2">
                {zipLookupResult.found && zipLookupResult.classification ? (
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">Area Classification</h4>
                        {getAreaTypeDisplay(
                          zipLookupResult.classification.areaType, 
                          zipLookupResult.classification.confidence
                        )}
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        <p><strong>Zip Code:</strong> {zipLookupResult.classification.zipCode}</p>
                        <p><strong>Data Source:</strong> {
                          zipLookupResult.classification.source === 'census_api' 
                            ? 'US Census Bureau (Real-time)'
                            : zipLookupResult.classification.source === 'population_threshold'
                            ? 'Population Analysis'
                            : 'Pattern Analysis'
                        }</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-md">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      {zipLookupResult.error}
                    </p>
                  </div>
                )}
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              Click the map icon to classify area as rural or urban
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="propertyType">Property Type *</Label>
            <Input
              id="propertyType"
              placeholder="SFR, Apartment, Retail, Warehouse, etc."
              {...register('propertyType', { required: 'Property type is required' })}
            />
            {errors.propertyType && (
              <p className="text-sm text-red-500">{errors.propertyType.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfUnits">Number of Units *</Label>
            <Input
              id="numberOfUnits"
              type="number"
              {...register('numberOfUnits', { 
                required: 'Number of units is required',
                min: { value: 1, message: 'Must be at least 1' },
                valueAsNumber: true
              })}
            />
            {errors.numberOfUnits && (
              <p className="text-sm text-red-500">{errors.numberOfUnits.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Loan-to-Value: {getLoanToValue(Number(numberOfUnits))}
              {Number(numberOfUnits) >= 12 && ' (12+ units require sales assistance)'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="purchasePrice">
              {isPurchase ? 'Purchase Price ($) *' : 'Current Property Value ($) *'}
            </Label>
            <Input
              id="purchasePrice"
              type="number"
              {...register('purchasePrice', { 
                required: 'Property value is required',
                min: { value: 1, message: 'Must be greater than 0' },
                valueAsNumber: true
              })}
            />
            {errors.purchasePrice && (
              <p className="text-sm text-red-500">{errors.purchasePrice.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="asIsValue">As-Is Value ($) *</Label>
            <Input
              id="asIsValue"
              type="number"
              {...register('asIsValue', { 
                required: 'As-is value is required',
                min: { value: 1, message: 'Must be greater than 0' },
                valueAsNumber: true
              })}
            />
            {errors.asIsValue && (
              <p className="text-sm text-red-500">{errors.asIsValue.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="purchaseDate">
              {isPurchase ? 'Purchase Date *' : 'Refinance Date *'}
            </Label>
            <Input
              id="purchaseDate"
              type="date"
              {...register('purchaseDate', { required: 'Date is required' })}
            />
            {errors.purchaseDate && (
              <p className="text-sm text-red-500">{errors.purchaseDate.message}</p>
            )}
          </div>

          {!isPurchase && (
            <div className="space-y-2">
              <Label htmlFor="estimatedPayoff">Estimated Payoff ($) *</Label>
              <Input
                id="estimatedPayoff"
                type="number"
                {...register('estimatedPayoff', { 
                  required: !isPurchase ? 'Payoff amount is required for refinancing' : false,
                  valueAsNumber: true
                })}
              />
              {errors.estimatedPayoff && (
                <p className="text-sm text-red-500">{errors.estimatedPayoff.message}</p>
              )}
            </div>
          )}
        </div>

        {isPurchase && (
          <div className="space-y-2">
            <Label htmlFor="earnestMoneyDeposit">Earnest Money Deposit ($) *</Label>
            <Input
              id="earnestMoneyDeposit"
              type="number"
              {...register('earnestMoneyDeposit', { 
                required: 'Earnest money deposit is required for purchases',
                min: { value: 1, message: 'Must be greater than 0' },
                valueAsNumber: true
              })}
            />
            {errors.earnestMoneyDeposit && (
              <p className="text-sm text-red-500">{errors.earnestMoneyDeposit.message}</p>
            )}
          </div>
        )}

        
        {isDSCR && (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold mb-2">DSCR Loan - Monthly Rent Income</h3>
              <p className="text-sm text-muted-foreground">
                This loan program qualifies based on the property`s rental income (Debt Service Coverage Ratio).
              </p>
            </div>

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
                <p className="text-xs text-muted-foreground">
                  Expected monthly rental income
                </p>
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
          </div>
        )}

        {/* ANNUAL EXPENSES SECTION - Only for DSCR programs */}
        {isDSCR && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Annual Expenses</h3>
            <p className="text-sm text-muted-foreground">
              Provide the annual property expenses for DSCR calculation.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="annualTaxes">Annual Property Taxes ($) *</Label>
                <Input
                  id="annualTaxes"
                  type="number"
                  {...register('annualTaxes', { 
                    required: isDSCR ? 'Annual taxes required for DSCR loans' : false,
                    min: { value: 0, message: 'Cannot be negative' },
                    valueAsNumber: true
                  })}
                  placeholder="3500"
                />
                {errors.annualTaxes && (
                  <p className="text-sm text-red-500">{errors.annualTaxes.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="annualInsurance">Annual Insurance ($) *</Label>
                <Input
                  id="annualInsurance"
                  type="number"
                  {...register('annualInsurance', { 
                    required: isDSCR ? 'Annual insurance required for DSCR loans' : false,
                    min: { value: 0, message: 'Cannot be negative' },
                    valueAsNumber: true
                  })}
                  placeholder="1200"
                />
                {errors.annualInsurance && (
                  <p className="text-sm text-red-500">{errors.annualInsurance.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="annualFloodInsurance">Annual Flood Insurance ($)</Label>
                <Input
                  id="annualFloodInsurance"
                  type="number"
                  {...register('annualFloodInsurance', { 
                    min: { value: 0, message: 'Cannot be negative' },
                    valueAsNumber: true
                  })}
                  placeholder="500"
                />
                <p className="text-xs text-muted-foreground">Optional</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="annualHOA">Annual HOA Fees ($)</Label>
                <Input
                  id="annualHOA"
                  type="number"
                  {...register('annualHOA', { 
                    min: { value: 0, message: 'Cannot be negative' },
                    valueAsNumber: true
                  })}
                  placeholder="1800"
                />
                <p className="text-xs text-muted-foreground">Optional</p>
              </div>
            </div>
          </div>
        )}

        {/* REHAB SECTION - Only for rehab programs */}
        {hasRehab && (
          <>
            <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <h3 className="font-semibold mb-2">Renovation Details</h3>
              <p className="text-sm text-muted-foreground">
                Since you selected a rehab program, please provide renovation costs and after-repair value (ARV).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rehabNeeded">Rehab Budget ($) *</Label>
                <Input
                  id="rehabNeeded"
                  type="number"
                  {...register('rehabNeeded', { 
                    required: hasRehab ? 'Rehab budget is required for rehab programs' : false,
                    min: { value: 1, message: 'Must be greater than 0 for rehab programs' },
                    valueAsNumber: true
                  })}
                  placeholder="50000"
                />
                {errors.rehabNeeded && (
                  <p className="text-sm text-red-500">{errors.rehabNeeded.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Total estimated renovation costs
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rehabAlreadyCompleted">Rehab Already Completed ($)</Label>
                <Input
                  id="rehabAlreadyCompleted"
                  type="number"
                  {...register('rehabAlreadyCompleted', { 
                    min: { value: 0, message: 'Cannot be negative' },
                    valueAsNumber: true
                  })}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">
                  Amount already spent on renovations
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="arv">ARV - After Repair Value ($) *</Label>
                <Input
                  id="arv"
                  type="number"
                  {...register('arv', { 
                    required: hasRehab ? 'ARV is required for rehab programs' : false,
                    min: { value: 1, message: 'Must be greater than 0' },
                    valueAsNumber: true
                  })}
                  placeholder="300000"
                />
                {errors.arv && (
                  <p className="text-sm text-red-500">{errors.arv.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Estimated property value after renovations
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="hasComps"
                  onCheckedChange={(checked) => setValue('hasComps', checked as boolean)}
                />
                <Label htmlFor="hasComps">Do you have Comps for ARV?</Label>
              </div>
            </div>
          </>
        )}

        {zipLookupResult?.found && zipLookupResult.classification && (
          <div className={`p-4 rounded-lg border-2 ${
            zipLookupResult.classification.areaType === 'rural'
              ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
              : 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Property Area Summary</h4>
              {getAreaTypeDisplay(
                zipLookupResult.classification.areaType, 
                zipLookupResult.classification.confidence
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              <p>
                This {zipLookupResult.classification.areaType} area classification can affect loan terms, 
                property values, and rental market dynamics. Consider this when structuring your investment strategy.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PropertyInfoForm;