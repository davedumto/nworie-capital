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
}

export  function PropertyInfoForm({ form }: PropertyInfoFormProps) {
  const { register, formState: { errors }, setValue, watch } = form;
  
  const [zipLookupResult, setZipLookupResult] = useState<ZipCodeLookupResult | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  
  const isPurchase = watch('isPurchase');
  const numberOfUnits = watch('numberOfUnits') || 1;
  const currentZipCode = watch('zipCode');

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Purchase vs Refinance */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Transaction Type</Label>
          <RadioGroup
            value={isPurchase ? 'purchase' : 'refinance'}
            onValueChange={(value) => setValue('isPurchase', value === 'purchase')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="purchase" id="purchase" />
              <Label htmlFor="purchase">Purchase</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="refinance" id="refinance" />
              <Label htmlFor="refinance">Refinance</Label>
            </div>
          </RadioGroup>
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                      {/* Loan implications based on area type */}
                      <div className={`p-3 rounded-md text-sm ${
                        zipLookupResult.classification.areaType === 'rural'
                          ? 'bg-amber-50 border border-amber-200 dark:bg-amber-950 dark:border-amber-800'
                          : 'bg-blue-50 border border-blue-200 dark:bg-blue-950 dark:border-blue-800'
                      }`}>
                        <p className="font-medium mb-1">
                          {zipLookupResult.classification.areaType === 'rural' ? ' Rural Area Notes:' : ' Urban Area Notes:'}
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                          {zipLookupResult.classification.areaType === 'rural' ? (
                            <>
                              <li>May qualify for USDA rural development programs</li>
                              <li>Lower property values typically mean lower loan amounts</li>
                              <li>Consider longer commute times for tenants</li>
                              <li>Limited comparable sales data</li>
                            </>
                          ) : (
                            <>
                              <li>Higher property values and rental demand</li>
                              <li>More comparable sales data available</li>
                              <li>Better access to services and transportation</li>
                              <li>Potentially higher renovation costs</li>
                            </>
                          )}
                        </ul>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rehabNeeded">Rehab Needed ($) *</Label>
            <Input
              id="rehabNeeded"
              type="number"
              {...register('rehabNeeded', { 
                required: 'Rehab needed is required (enter 0 if none)',
                min: { value: 0, message: 'Cannot be negative' },
                valueAsNumber: true
              })}
            />
            {errors.rehabNeeded && (
              <p className="text-sm text-red-500">{errors.rehabNeeded.message}</p>
            )}
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
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="arv">ARV - After Repair Value ($) *</Label>
            <Input
              id="arv"
              type="number"
              {...register('arv', { 
                required: 'ARV is required',
                min: { value: 1, message: 'Must be greater than 0' },
                valueAsNumber: true
              })}
            />
            {errors.arv && (
              <p className="text-sm text-red-500">{errors.arv.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2 pt-6">
            <Checkbox
              id="hasComps"
              onCheckedChange={(checked) => setValue('hasComps', checked as boolean)}
            />
            <Label htmlFor="hasComps">Do you have Comps?</Label>
          </div>
        </div>

        {/* Quick Area Classification Summary */}
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