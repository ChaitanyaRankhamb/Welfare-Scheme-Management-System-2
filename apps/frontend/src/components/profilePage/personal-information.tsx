'use client'

import { User } from 'lucide-react'
import { ProfileSection } from './profile-section'
import { FormField } from './form-field'

interface PersonalData {
  firstName: string
  middleName: string
  lastName: string
  gender: string
  dateOfBirth: Date | null
  mobileNumber: string
  alternateContact: string
}

interface PersonalInformationProps {
  data: PersonalData
  onChange: (field: keyof PersonalData, value: any) => void
  onSave?: () => void
  isSaving?: boolean
  isSaved?: boolean
  completionPercent?: number
  errors?: Partial<Record<keyof PersonalData, string>>
}

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
]

export function PersonalInformation({
  data,
  onChange,
  onSave,
  isSaving,
  isSaved,
  completionPercent,
  errors = {},
}: PersonalInformationProps) {
  const requiredFields: (keyof PersonalData)[] = [
    'firstName',
    'lastName',
    'gender',
    'dateOfBirth',
    'mobileNumber',
  ]
  const canSave = requiredFields.every((f) => data[f] !== '' && data[f] !== null && data[f] !== undefined)

  return (
    <ProfileSection
      id="personal"
      title="Personal Information"
      description="Tell us about yourself to help identity validation"
      icon={<User className="h-full w-full" />}
      completionPercent={completionPercent || 0}
      onSave={onSave}
      isSaving={isSaving}
      isSaved={isSaved}
      canSave={canSave}
    >
      <FormField
        label="First Name"
        name="firstName"
        type="text"
        value={data.firstName}
        onChange={(value) => onChange('firstName', value)}
        placeholder="Enter your first name"
        required
        error={errors.firstName}
      />
      <FormField
        label="Middle Name"
        name="middleName"
        type="text"
        value={data.middleName}
        onChange={(value) => onChange('middleName', value)}
        placeholder="Enter your middle name"
      />
      <FormField
        label="Last Name"
        name="lastName"
        type="text"
        value={data.lastName}
        onChange={(value) => onChange('lastName', value)}
        placeholder="Enter your last name"
        required
        error={errors.lastName}
      />
      <FormField
        label="Gender"
        name="gender"
        type="select"
        value={data.gender}
        onChange={(value) => onChange('gender', value)}
        options={genderOptions}
        required
        error={errors.gender}
      />
      <FormField
        label="Date of Birth"
        name="dateOfBirth"
        type="date"
        value={data.dateOfBirth}
        onChange={(value) => onChange('dateOfBirth', value)}
        required
        error={errors.dateOfBirth}
      />
      <FormField
        label="Mobile Number"
        name="mobileNumber"
        type="tel"
        value={data.mobileNumber}
        onChange={(value) => onChange('mobileNumber', value)}
        placeholder="+91 XXXXX XXXXX"
        required
        error={errors.mobileNumber}
      />
      <FormField
        label="Alternate Contact"
        name="alternateContact"
        type="tel"
        value={data.alternateContact}
        onChange={(value) => onChange('alternateContact', value)}
        placeholder="+91 XXXXX XXXXX"
        helperText="Optional: Provide an additional contact number"
      />
    </ProfileSection>
  )
}
