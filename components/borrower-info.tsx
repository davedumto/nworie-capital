// components/borrower-info.tsx
'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BorrowerInfo } from '@/types/loan';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface BorrowerInfoFormProps {
  form: UseFormReturn<BorrowerInfo>;
}

export function BorrowerInfoForm({ form }: BorrowerInfoFormProps) {
  const { register, formState: { errors }, setValue, watch } = form;
  
  // Convert to numbers explicitly to prevent string concatenation
  const propertiesOwned = Number(watch('propertiesOwned')) || 0;
  const propertiesSold = Number(watch('propertiesSold')) || 0;
  const totalExperience = propertiesOwned + propertiesSold;
  
  // Update total experience when properties change
  React.useEffect(() => {
    setValue('totalExperience', totalExperience);
  }, [propertiesOwned, propertiesSold, setValue, totalExperience]);
  
  const getInvestorTier = (experience: number) => {
    if (experience >= 10) return 'Platinum';
    if (experience >= 5) return 'Gold';
    if (experience >= 2) return 'Silver';
    return 'Bronze';
  };
  
  const getInterestRate = (tier: string) => {
    switch (tier) {
      case 'Platinum': return '11%';
      case 'Gold': return '12%';
      case 'Silver': return '13%';
      case 'Bronze': return '14%';
      default: return '14%';
    }
  };
  
  const tier = getInvestorTier(totalExperience);
  const rate = getInterestRate(tier);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Borrower Information
          <div className="flex items-center space-x-2">
            <Badge variant={tier === 'Platinum' ? 'default' : tier === 'Gold' ? 'secondary' : 'outline'}>
              {tier} Tier
            </Badge>
            <Badge variant="outline">
              {rate} Rate
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="guarantorFullName">Guarantor Full Name *</Label>
            <Input
              id="guarantorFullName"
              {...register('guarantorFullName', { required: 'Full name is required' })}
            />
            {errors.guarantorFullName && (
              <p className="text-sm text-red-500">{errors.guarantorFullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guarantorEmail">Email *</Label>
            <Input
              id="guarantorEmail"
              type="email"
              {...register('guarantorEmail', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            {errors.guarantorEmail && (
              <p className="text-sm text-red-500">{errors.guarantorEmail.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              {...register('phoneNumber', { required: 'Phone number is required' })}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fico">FICO Score *</Label>
            <Input
              id="fico"
              type="number"
              {...register('fico', { 
                required: 'FICO score is required',
                min: { value: 300, message: 'FICO score must be at least 300' },
                max: { value: 850, message: 'FICO score cannot exceed 850' },
                valueAsNumber: true  // This ensures the value is stored as a number
              })}
            />
            {errors.fico && (
              <p className="text-sm text-red-500">{errors.fico.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Minimum 660 required (680 for ground-up construction)
            </p>
          </div>
        </div>

        {/* Experience Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Investment Experience</h3>
          <p className="text-sm text-muted-foreground">
            Total experience = Properties Owned + Properties Sold. This determines your investor tier and interest rate.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertiesOwned">Properties Currently Owned</Label>
              <Input
                id="propertiesOwned"
                type="number"
                {...register('propertiesOwned', { 
                  required: 'Number of owned properties is required',
                  min: { value: 0, message: 'Cannot be negative' },
                  valueAsNumber: true  // This ensures the value is stored as a number
                })}
              />
              {errors.propertiesOwned && (
                <p className="text-sm text-red-500">{errors.propertiesOwned.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertiesSold">Properties Sold</Label>
              <Input
                id="propertiesSold"
                type="number"
                {...register('propertiesSold', { 
                  required: 'Number of sold properties is required',
                  min: { value: 0, message: 'Cannot be negative' },
                  valueAsNumber: true  // This ensures the value is stored as a number
                })}
              />
              {errors.propertiesSold && (
                <p className="text-sm text-red-500">{errors.propertiesSold.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Total Experience</Label>
              <div className="flex items-center h-10 px-3 py-2 border border-input bg-background rounded-md">
                <span className="font-medium text-lg">{totalExperience}</span>
                <span className="text-sm text-muted-foreground ml-2">properties</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {propertiesOwned} owned + {propertiesSold} sold = {totalExperience} total
              </p>
            </div>
          </div>

          {/* Tier Information Display */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className={`p-2 rounded ${tier === 'Bronze' ? 'bg-orange-100 dark:bg-orange-900' : ''}`}>
                <div className="font-semibold">Bronze (0-1)</div>
                <div>14% Rate</div>
                <div>Reimbursement</div>
              </div>
              <div className={`p-2 rounded ${tier === 'Silver' ? 'bg-gray-100 dark:bg-gray-900' : ''}`}>
                <div className="font-semibold">Silver (2-4)</div>
                <div>13% Rate</div>
                <div>Reimbursement</div>
              </div>
              <div className={`p-2 rounded ${tier === 'Gold' ? 'bg-yellow-100 dark:bg-yellow-900' : ''}`}>
                <div className="font-semibold">Gold (5-9)</div>
                <div>12% Rate</div>
                <div>Advanced Draws</div>
              </div>
              <div className={`p-2 rounded ${tier === 'Platinum' ? 'bg-blue-100 dark:bg-blue-900' : ''}`}>
                <div className="font-semibold">Platinum (10+)</div>
                <div>11% Rate</div>
                <div>Advanced Draws</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="socialSecurity">Social Security Number *</Label>
            <Input
              id="socialSecurity"
              {...register('socialSecurity', { required: 'SSN is required' })}
            />
            {errors.socialSecurity && (
              <p className="text-sm text-red-500">{errors.socialSecurity.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2 pt-6">
            <Checkbox
              id="usCitizen"
              onCheckedChange={(checked) => setValue('usCitizen', checked as boolean)}
            />
            <Label htmlFor="usCitizen">US Citizen</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
            <Input
              id="dateOfBirth"
              type="date"
              {...register('dateOfBirth', { required: 'Date of birth is required' })}
            />
            {errors.dateOfBirth && (
              <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="primaryResidenceAddress">Primary Residence Address *</Label>
          <Input
            id="primaryResidenceAddress"
            {...register('primaryResidenceAddress', { required: 'Address is required' })}
          />
          {errors.primaryResidenceAddress && (
            <p className="text-sm text-red-500">{errors.primaryResidenceAddress.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ownOrRentPrimary">Own or Rent Primary Residence</Label>
            <Select onValueChange={(value) => setValue('ownOrRentPrimary', value as 'own' | 'rent')}>
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="own">Own</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearsAtPrimaryResidence">Years at Primary Residence</Label>
            <Input
              id="yearsAtPrimaryResidence"
              type="number"
              {...register('yearsAtPrimaryResidence', { 
                required: 'Years at residence is required',
                min: { value: 0, message: 'Cannot be negative' },
                valueAsNumber: true
              })}
            />
            {errors.yearsAtPrimaryResidence && (
              <p className="text-sm text-red-500">{errors.yearsAtPrimaryResidence.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="entityName">Entity Name (LLC)</Label>
            <Input
              id="entityName"
              {...register('entityName')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="einNumber">EIN Number</Label>
            <Input
              id="einNumber"
              {...register('einNumber')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BorrowerInfoForm;