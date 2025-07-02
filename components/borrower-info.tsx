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
  const owned = Number(watch('propertiesOwned')) || 0;
  const sold = Number(watch('propertiesSold')) || 0;
  const total = owned + sold;
  

  React.useEffect(() => {
    setValue('totalExperience', total);
  }, [owned, sold, setValue, total]);
  
  const getTier = (exp: number) => {
    if (exp >= 10) return 'Platinum';
    if (exp >= 5) return 'Gold';
    if (exp >= 2) return 'Silver';
    return 'Bronze';
  };
  
  const getRate = (tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze') => {
    const rates = { Platinum: '11%', Gold: '12%', Silver: '13%', Bronze: '14%' };
    return rates[tier];
  };
  
  const tier = getTier(total);
  const rate = getRate(tier);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Borrower Info
          <div className="flex items-center space-x-2">
            <Badge variant={tier === 'Platinum' ? 'default' : tier === 'Gold' ? 'secondary' : 'outline'}>
              {tier}
            </Badge>
            <Badge variant="outline">
              {rate}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="guarantorFullName">Full Name *</Label>
            <Input
              id="guarantorFullName"
              {...register('guarantorFullName', { required: 'Name required' })}
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
                required: 'Email required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email'
                }
              })}
            />
            {errors.guarantorEmail && (
              <p className="text-sm text-red-500">{errors.guarantorEmail.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone *</Label>
            <Input
              id="phoneNumber"
              {...register('phoneNumber', { required: 'Phone required' })}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fico">Credit Score *</Label>
            <Input
              id="fico"
              type="number"
              {...register('fico', { 
                required: 'Credit score required',
                min: { value: 300, message: 'Must be at least 300' },
                max: { value: 850, message: 'Cannot exceed 850' },
                valueAsNumber: true
              })}
            />
            {errors.fico && (
              <p className="text-sm text-red-500">{errors.fico.message}</p>
            )}
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Minimum 660 for Renovation Loans</p>
              <p>• Minimum 680 for Construction Loans</p>
              <p>• Minimum 650 for DSCR Loans</p>
              <p>• Scores above 750+ get best DSCR pricing</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Experience</h3>
          <p className="text-sm text-muted-foreground">
            Owned + Sold = Total (this sets your tier and rate)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertiesOwned">Properties Owned</Label>
              <Input
                id="propertiesOwned"
                type="number"
                {...register('propertiesOwned', { 
                  required: 'Required',
                  min: { value: 0, message: 'Cannot be negative' },
                  valueAsNumber: true
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
                  required: 'Required',
                  min: { value: 0, message: 'Cannot be negative' },
                  valueAsNumber: true
                })}
              />
              {errors.propertiesSold && (
                <p className="text-sm text-red-500">{errors.propertiesSold.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Total</Label>
              <div className="flex items-center h-10 px-3 py-2 border border-input bg-background rounded-md">
                <span className="font-medium text-lg">{total}</span>
                <span className="text-sm text-muted-foreground ml-2">properties</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {owned} + {sold} = {total}
              </p>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className={`p-2 rounded ${tier === 'Bronze' ? 'bg-orange-100 dark:bg-orange-900' : ''}`}>
                <div className="font-semibold">Bronze (0-1)</div>
                <div>14% Rate</div>
              </div>
              <div className={`p-2 rounded ${tier === 'Silver' ? 'bg-gray-100 dark:bg-gray-900' : ''}`}>
                <div className="font-semibold">Silver (2-4)</div>
                <div>13% Rate</div>
              </div>
              <div className={`p-2 rounded ${tier === 'Gold' ? 'bg-yellow-100 dark:bg-yellow-900' : ''}`}>
                <div className="font-semibold">Gold (5-9)</div>
                <div>12% Rate</div>
              </div>
              <div className={`p-2 rounded ${tier === 'Platinum' ? 'bg-blue-100 dark:bg-blue-900' : ''}`}>
                <div className="font-semibold">Platinum (10+)</div>
                <div>11% Rate</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="socialSecurity">SSN (optional)</Label>
            <Input
              id="socialSecurity"
              {...register('socialSecurity')}
              placeholder="Not needed for quote"
            />
          </div>

          <div className="flex items-center space-x-2 pt-6">
            <Checkbox
              id="usCitizen"
              onCheckedChange={(checked) => setValue('usCitizen', checked as boolean)}
            />
            <Label htmlFor="usCitizen">US Citizen</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">DOB (optional)</Label>
            <Input
              id="dateOfBirth"
              type="date"
              {...register('dateOfBirth')}
              placeholder="Not needed for quote"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="primaryResidenceAddress">Home Address *</Label>
          <Input
            id="primaryResidenceAddress"
            {...register('primaryResidenceAddress', { required: 'Address required' })}
          />
          {errors.primaryResidenceAddress && (
            <p className="text-sm text-red-500">{errors.primaryResidenceAddress.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ownOrRentPrimary">Own or Rent?</Label>
            <Select onValueChange={(value) => setValue('ownOrRentPrimary', value as 'own' | 'rent')}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="own">Own</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearsAtPrimaryResidence">Years There</Label>
            <Input
              id="yearsAtPrimaryResidence"
              type="number"
              {...register('yearsAtPrimaryResidence', { 
                required: 'Required',
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
            <Label htmlFor="entityName">LLC Name</Label>
            <Input
              id="entityName"
              {...register('entityName')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="einNumber">EIN</Label>
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