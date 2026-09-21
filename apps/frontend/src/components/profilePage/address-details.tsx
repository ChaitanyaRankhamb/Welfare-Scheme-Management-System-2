'use client'

import { MapPin } from 'lucide-react'
import { ProfileSection } from './profile-section'
import { FormField } from './form-field'

interface AddressData {
  country: string
  state: string
  district: string
  taluka: string
  village: string
  pincode: string
  areaType: string
}

interface AddressDetailsProps {
  data: AddressData
  onChange: (field: keyof AddressData, value: any) => void
  onSave?: () => void
  isSaving?: boolean
  isSaved?: boolean
  completionPercent?: number
  errors?: Partial<Record<keyof AddressData, string>>
}

export function AddressDetails({
  data,
  onChange,
  onSave,
  isSaving,
  isSaved,
  completionPercent,
  errors = {},
}: AddressDetailsProps) {
  const areaTypeOptions = [
    { label: 'Rural', value: 'rural' },
    { label: 'Urban', value: 'urban' },
    { label: 'Semi-Urban', value: 'semi-urban' },
  ]

  const requiredFields: (keyof AddressData)[] = [
    'country',
    'state',
    'district',
    'taluka',
    'village',
    'pincode',
    'areaType',
  ]
  const canSave = requiredFields.every((f) => data[f] && data[f] !== '')

  return (
    <ProfileSection
      id="address"
      title="Address Details"
      description="Tell us where you stay to determine local scheme eligibility"
      icon={<MapPin className="h-full w-full" />}
      completionPercent={completionPercent}
      onSave={onSave}
      isSaving={isSaving}
      isSaved={isSaved}
      canSave={canSave}
    >
      <FormField
        label="Country"
        name="country"
        type="text"
        value={data.country}
        onChange={(value) => onChange('country', value)}
        placeholder="E.g. India"
        required
        error={errors.country}
      />
      <FormField
        label="State"
        name="state"
        type="text"
        value={data.state}
        onChange={(value) => onChange('state', value)}
        placeholder="E.g. Maharashtra"
        required
        error={errors.state}
      />
      <FormField
        label="District"
        name="district"
        type="text"
        value={data.district}
        onChange={(value) => onChange('district', value)}
        placeholder="E.g. Pune"
        required
        error={errors.district}
      />
      <FormField
        label="Taluka"
        name="taluka"
        type="text"
        value={data.taluka}
        onChange={(value) => onChange('taluka', value)}
        placeholder="E.g. Haveli"
        required
        error={errors.taluka}
      />
      <FormField
        label="Village/City"
        name="village"
        type="text"
        value={data.village}
        onChange={(value) => onChange('village', value)}
        placeholder="E.g. Kothrud"
        required
        error={errors.village}
      />
      <FormField
        label="Pincode"
        name="pincode"
        type="text"
        value={data.pincode}
        onChange={(value) => onChange('pincode', value)}
        placeholder="6-digit code"
        required
        error={errors.pincode}
      />
      <FormField
        label="Area Type"
        name="areaType"
        type="select"
        value={data.areaType}
        onChange={(value) => onChange('areaType', value)}
        options={areaTypeOptions}
        required
        error={errors.areaType}
      />
    </ProfileSection>
  )
}
