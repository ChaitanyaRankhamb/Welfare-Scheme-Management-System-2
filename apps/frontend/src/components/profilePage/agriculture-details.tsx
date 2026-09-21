'use client'

import { Trees } from 'lucide-react'
import { ProfileSection } from './profile-section'
import { FormField } from './form-field'

interface AgricultureData {
  landSize: string
  cropType: string
  irrigationType: string
}

interface AgricultureDetailsProps {
  data: AgricultureData
  onChange: (field: keyof AgricultureData, value: any) => void
  onSave?: () => void
  isSaving?: boolean
  isSaved?: boolean
  completionPercent?: number
  errors?: Partial<Record<keyof AgricultureData, string>>
  isVisible?: boolean
}

const cropTypeOptions = [
  { label: 'Wheat', value: 'wheat' },
  { label: 'Rice', value: 'rice' },
  { label: 'Corn', value: 'corn' },
  { label: 'Cotton', value: 'cotton' },
  { label: 'Sugarcane', value: 'sugarcane' },
  { label: 'Vegetables', value: 'vegetables' },
  { label: 'Fruits', value: 'fruits' },
  { label: 'Spices', value: 'spices' },
  { label: 'Other', value: 'other' },
]

const irrigationTypeOptions = [
  { label: 'Canal', value: 'canal' },
  { label: 'Well', value: 'well' },
  { label: 'Borewell', value: 'borewell' },
  { label: 'Drip', value: 'drip' },
  { label: 'Sprinkler', value: 'sprinkler' },
  { label: 'Rainfed', value: 'rainfed' },
]

export function AgricultureDetails({
  data,
  onChange,
  onSave,
  isSaving,
  isSaved,
  completionPercent,
  errors = {},
  isVisible = true,
}: AgricultureDetailsProps) {
  if (!isVisible) return null

  const requiredFields: (keyof AgricultureData)[] = [
    'landSize',
    'cropType',
    'irrigationType',
  ]
  const canSave = requiredFields.every((f) => data[f] && data[f] !== '')

  return (
    <ProfileSection
      id="agriculture"
      title="Agricultural Details"
      description="Farm land and irrigation details for agricultural subsidies"
      icon={<Trees className="h-full w-full" />}
      completionPercent={completionPercent || 0}
      onSave={onSave}
      isSaving={isSaving}
      isSaved={isSaved}
      canSave={canSave}
    >
      <FormField
        label="Land Size (Acres)"
        name="landSize"
        type="number"
        value={data.landSize}
        onChange={(value) => onChange('landSize', value)}
        placeholder="0.00"
        helperText="Total cultivable land area"
        error={errors.landSize}
      />
      <FormField
        label="Primary Crop Type"
        name="cropType"
        type="select"
        value={data.cropType}
        onChange={(value) => onChange('cropType', value)}
        options={cropTypeOptions}
        error={errors.cropType}
      />
      <FormField
        label="Irrigation Type"
        name="irrigationType"
        type="select"
        value={data.irrigationType}
        onChange={(value) => onChange('irrigationType', value)}
        options={irrigationTypeOptions}
        error={errors.irrigationType}
      />
    </ProfileSection>
  )
}
