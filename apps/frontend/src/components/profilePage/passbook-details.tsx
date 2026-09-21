'use client'

import { Landmark } from 'lucide-react'
import { FormField } from './form-field'
import { ProfileSection } from './profile-section'

interface PassbookData {
  accountHolderName: string
  accountNumber: string
  bankName: string
  branchName: string
  ifscCode: string
  accountType: string
}

interface PassbookDetailsProps {
  data: PassbookData
  onChange: (field: keyof PassbookData, value: string) => void
  onSave?: () => void
  isSaving?: boolean
  isSaved?: boolean
  completionPercent?: number
}

const accountTypeOptions = [
  { label: 'Savings Account', value: 'savings' },
  { label: 'Current Account', value: 'current' },
]

export function PassbookDetails({
  data,
  onChange,
  onSave,
  isSaving,
  isSaved,
  completionPercent,
}: PassbookDetailsProps) {
  const requiredFields: (keyof PassbookData)[] = [
    'accountHolderName',
    'accountNumber',
    'bankName',
    'branchName',
    'ifscCode',
    'accountType',
  ]
  const canSave = requiredFields.every((field) => data[field].trim() !== '')

  return (
    <ProfileSection
      id="passbook"
      title="Passbook Details"
      description="Add the bank account that should receive your scheme benefits."
      icon={<Landmark className="h-full w-full" />}
      completionPercent={completionPercent || 0}
      onSave={onSave}
      isSaving={isSaving}
      isSaved={isSaved}
      canSave={canSave}
    >
      <FormField
        label="Account Holder Name"
        name="accountHolderName"
        type="text"
        value={data.accountHolderName}
        onChange={(value) => onChange('accountHolderName', value)}
        placeholder="Name as shown in your passbook"
        required
      />
      <FormField
        label="Account Number"
        name="accountNumber"
        type="text"
        value={data.accountNumber}
        onChange={(value) => onChange('accountNumber', value.replace(/\s/g, ''))}
        placeholder="Enter your account number"
        required
      />
      <FormField
        label="Bank Name"
        name="bankName"
        type="text"
        value={data.bankName}
        onChange={(value) => onChange('bankName', value)}
        placeholder="E.g. State Bank of India"
        required
      />
      <FormField
        label="Branch Name"
        name="branchName"
        type="text"
        value={data.branchName}
        onChange={(value) => onChange('branchName', value)}
        placeholder="E.g. Pune Main Branch"
        required
      />
      <FormField
        label="IFSC Code"
        name="ifscCode"
        type="text"
        value={data.ifscCode}
        onChange={(value) => onChange('ifscCode', value.toUpperCase().replace(/\s/g, ''))}
        placeholder="E.g. SBIN0001234"
        helperText="11-character bank branch code"
        required
      />
      <FormField
        label="Account Type"
        name="accountType"
        type="select"
        value={data.accountType}
        onChange={(value) => onChange('accountType', value)}
        options={accountTypeOptions}
        placeholder="Select account type"
        required
      />
    </ProfileSection>
  )
}
