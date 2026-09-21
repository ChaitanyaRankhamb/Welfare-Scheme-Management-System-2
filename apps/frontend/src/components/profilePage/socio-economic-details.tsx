'use client'

import { Wallet } from 'lucide-react'
import { ProfileSection } from './profile-section'
import { FormField } from './form-field'

interface SocioEconomicData {
  annualIncome: string
  incomeCategory: string
  bplStatus: boolean
  casteCategory: string
  religion: string
  rationCardType: string
}

interface SocioEconomicDetailsProps {
  data: SocioEconomicData
  onChange: (field: keyof SocioEconomicData, value: any) => void
  onSave?: () => void
  isSaving?: boolean
  isSaved?: boolean
  completionPercent?: number
  errors?: Partial<Record<keyof SocioEconomicData, string>>
}

const incomeCategoryOptions = [
  { label: 'Below 1 Lakh', value: 'below-1-lakh' },
  { label: '1-3 Lakh', value: '1-3-lakh' },
  { label: '3-5 Lakh', value: '3-5-lakh' },
  { label: 'Above 5 Lakh', value: 'above-5-lakh' },
]

const casteCategoryOptions = [
  { label: 'General', value: 'general' },
  { label: 'OBC', value: 'obc' },
  { label: 'SC', value: 'sc' },
  { label: 'ST', value: 'st' },
  { label: 'EWS', value: 'ews' },
]

const religionOptions = [
  { label: 'Hindu', value: 'hindu' },
  { label: 'Muslim', value: 'muslim' },
  { label: 'Christian', value: 'christian' },
  { label: 'Sikh', value: 'sikh' },
  { label: 'Buddhist', value: 'buddhist' },
  { label: 'Jain', value: 'jain' },
  { label: 'Other', value: 'other' },
]

const rationCardOptions = [
  { label: 'APL (White)', value: 'apl' },
  { label: 'BPL (Yellow)', value: 'bpl' },
  { label: 'Antyodaya (AAY)', value: 'aay' },
  { label: 'PHH (Priority)', value: 'phh' },
  { label: 'NPHH (Non-Priority)', value: 'nphh' },
  { label: 'Annapurna', value: 'annapurna' },
  { label: 'No Ration Card', value: 'none' },
]

export function SocioEconomicDetails({
  data,
  onChange,
  onSave,
  isSaving,
  isSaved,
  completionPercent,
  errors = {},
}: SocioEconomicDetailsProps) {
  // Auto-suggest income category based on income value
  const incomeNum = parseInt(data.annualIncome) || 0
  const suggestedCategory =
    incomeNum < 100000
      ? 'below-1-lakh'
      : incomeNum < 300000
        ? '1-3-lakh'
        : incomeNum < 500000
          ? '3-5-lakh'
          : 'above-5-lakh'

  // Validation for save button visibility
  const requiredFields: (keyof SocioEconomicData)[] = [
    'annualIncome',
    'incomeCategory',
    'casteCategory',
    'religion',
  ]
  const canSave = requiredFields.every((f) => data[f] !== '' && data[f] !== null && data[f] !== undefined)

  return (
    <ProfileSection
      id="socio-economic"
      title="Socio-Economic Details"
      description="Financial and social details crucial for scheme eligibility determination"
      icon={<Wallet className="h-full w-full" />}
      completionPercent={completionPercent || 0}
      onSave={onSave}
      isSaving={isSaving}
      isSaved={isSaved}
      canSave={canSave}
    >
      <FormField
        label="Annual Income (₹)"
        name="annualIncome"
        type="number"
        value={data.annualIncome}
        onChange={(value) => onChange('annualIncome', value)}
        placeholder="Enter total annual income"
        helperText="Helps determine eligibility for income-gated schemes"
        error={errors.annualIncome}
      />
      <FormField
        label="Income Category"
        name="incomeCategory"
        type="select"
        value={data.incomeCategory || suggestedCategory}
        onChange={(value) => onChange('incomeCategory', value)}
        options={incomeCategoryOptions}
        helperText={
          data.annualIncome
            ? `Calculated Suggestion: ${incomeCategoryOptions.find((o) => o.value === suggestedCategory)?.label}`
            : undefined
        }
        error={errors.incomeCategory}
      />
      <FormField
        label="Caste Category"
        name="casteCategory"
        type="select"
        value={data.casteCategory}
        onChange={(value) => onChange('casteCategory', value)}
        options={casteCategoryOptions}
        required
        error={errors.casteCategory}
        tooltip="Verification of category is required for reserved schemes"
      />
      <FormField
        label="Religion"
        name="religion"
        type="select"
        value={data.religion}
        onChange={(value) => onChange('religion', value)}
        options={religionOptions}
        error={errors.religion}
      />
      <FormField
        label="BPL Status"
        name="bplStatus"
        type="toggle"
        value={data.bplStatus}
        onChange={(value) => onChange('bplStatus', value)}
        placeholder="Are you registered as BPL?"
        tooltip="Below Poverty Line status grants expanded benefits"
      />
      <FormField
        label="Ration Card Type"
        name="rationCardType"
        type="select"
        value={data.rationCardType}
        onChange={(value) => onChange('rationCardType', value)}
        options={rationCardOptions}
        error={errors.rationCardType}
      />
    </ProfileSection>
  )
}
