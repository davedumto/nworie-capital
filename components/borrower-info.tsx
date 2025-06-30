// components/BorrowerInfoForm.tsx
'use client';

import { UseFormReturn } from 'react-hook-form';
import { BorrowerInfo } from '@/types/loan';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BorrowerInfoFormProps {
  form: UseFormReturn<BorrowerInfo>;
}

export function BorrowerInfoForm({ form }: BorrowerInfoFormProps) {
  const { register, formState: { errors }, setValue } = form;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Borrower Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="guarantorFullName">Guarantor Full Name</Label>
            <Input
              id="guarantorFullName"
              {...register('guarantorFullName', { required: 'Full name is required' })}
            />
            {errors.guarantorFullName && (
              <p className="text-sm text-red-500">{errors.guarantorFullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guarantorEmail">Email</Label>
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
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              {...register('phoneNumber', { required: 'Phone number is required' })}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="investmentProperties">Investment Properties Owned</Label>
            <Input
              id="investmentProperties"
              type="number"
              {...register('investmentProperties', { 
                required: 'Number of properties is required',
                min: { value: 0, message: 'Cannot be negative' }
              })}
            />
            {errors.investmentProperties && (
              <p className="text-sm text-red-500">{errors.investmentProperties.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fico">FICO Score</Label>
            <Input
              id="fico"
              type="number"
              {...register('fico', { 
                required: 'FICO score is required',
                min: { value: 300, message: 'FICO score must be at least 300' },
                max: { value: 850, message: 'FICO score cannot exceed 850' }
              })}
            />
            {errors.fico && (
              <p className="text-sm text-red-500">{errors.fico.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Experience (Flips in last 36 months)</Label>
            <Input
              id="experience"
              type="number"
              {...register('experience', { 
                required: 'Experience is required',
                min: { value: 0, message: 'Cannot be negative' }
              })}
            />
            {errors.experience && (
              <p className="text-sm text-red-500">{errors.experience.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="socialSecurity">Social Security Number</Label>
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
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
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
          <Label htmlFor="primaryResidenceAddress">Primary Residence Address</Label>
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
                min: { value: 0, message: 'Cannot be negative' }
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

// components/PropertyInfoForm.tsx
