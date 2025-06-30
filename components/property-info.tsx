'use client';

import { UseFormReturn } from 'react-hook-form';
import { PropertyInfo } from '@/types/loan';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface PropertyInfoFormProps {
  form: UseFormReturn<PropertyInfo>;
}

export function PropertyInfoForm({ form }: PropertyInfoFormProps) {
  const { register, formState: { errors }, setValue } = form;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="subjectPropertyAddress">Subject Property Address</Label>
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
            <Label htmlFor="propertyType">Property Type</Label>
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
            <Label htmlFor="numberOfUnits">Number of Units</Label>
            <Input
              id="numberOfUnits"
              type="number"
              {...register('numberOfUnits', { 
                required: 'Number of units is required',
                min: { value: 1, message: 'Must be at least 1' }
              })}
            />
            {errors.numberOfUnits && (
              <p className="text-sm text-red-500">{errors.numberOfUnits.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
            <Input
              id="purchasePrice"
              type="number"
              {...register('purchasePrice', { 
                required: 'Purchase price is required',
                min: { value: 1, message: 'Must be greater than 0' }
              })}
            />
            {errors.purchasePrice && (
              <p className="text-sm text-red-500">{errors.purchasePrice.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="asIsValue">As-Is Value ($)</Label>
            <Input
              id="asIsValue"
              type="number"
              {...register('asIsValue', { 
                required: 'As-is value is required',
                min: { value: 1, message: 'Must be greater than 0' }
              })}
            />
            {errors.asIsValue && (
              <p className="text-sm text-red-500">{errors.asIsValue.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="purchaseDate">Purchase Date</Label>
            <Input
              id="purchaseDate"
              type="date"
              {...register('purchaseDate', { required: 'Purchase date is required' })}
            />
            {errors.purchaseDate && (
              <p className="text-sm text-red-500">{errors.purchaseDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedPayoff">Estimated Payoff ($)</Label>
            <Input
              id="estimatedPayoff"
              type="number"
              {...register('estimatedPayoff')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rehabNeeded">Rehab Needed ($)</Label>
            <Input
              id="rehabNeeded"
              type="number"
              {...register('rehabNeeded', { 
                required: 'Rehab needed is required',
                min: { value: 0, message: 'Cannot be negative' }
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
                min: { value: 0, message: 'Cannot be negative' }
              })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="arv">ARV - After Repair Value ($)</Label>
            <Input
              id="arv"
              type="number"
              {...register('arv', { 
                required: 'ARV is required',
                min: { value: 1, message: 'Must be greater than 0' }
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
      </CardContent>
    </Card>
  );
}