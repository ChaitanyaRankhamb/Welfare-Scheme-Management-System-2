'use client'

import { Briefcase } from 'lucide-react'
import { ProfileSection } from './profile-section'
import { FormField } from './form-field'

interface ProfessionalData {
  occupationType: string
  employmentStatus: string
  laborType: string
  skillLevel: string
  yearsOfExperience: string
}

interface ProfessionalDetailsProps {
  data: ProfessionalData
  onChange: (field: keyof ProfessionalData, value: any) => void
  onSave?: () => void
  isSaving?: boolean
  isSaved?: boolean
  completionPercent?: number
  errors?: Partial<Record<keyof ProfessionalData, string>>
}

const occupationTypeOptions = [
  { label: 'Farmer', value: 'farmer' },
  { label: 'Laborer', value: 'laborer' },
  { label: 'Employee', value: 'employee' },
  { label: 'Self-Employed', value: 'self-employed' },
  { label: 'Student', value: 'student' },
  { label: 'Housewife', value: 'housewife' },
  { label: 'Unemployed', value: 'unemployed' },
  { label: 'Other', value: 'other' },
]

const employmentStatusOptions = [
  { label: 'Full-Time', value: 'full-time' },
  { label: 'Part-Time', value: 'part-time' },
  { label: 'Seasonal', value: 'seasonal' },
  { label: 'Contractual', value: 'contractual' },
]

const laborTypeOptions = [
  { label: 'Skilled', value: 'skilled' },
  { label: 'Semi-Skilled', value: 'semi-skilled' },
  { label: 'Unskilled', value: 'unskilled' },
  { label: 'Professional', value: 'professional' },
]

const skillLevelOptions = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
  { label: 'Expert', value: 'expert' },
]

export function ProfessionalDetails({
  data,
  onChange,
  onSave,
  isSaving,
  isSaved,
  completionPercent,
  errors = {},
}: ProfessionalDetailsProps) {
  const requiredFields: (keyof ProfessionalData)[] = [
    'occupationType',
    'employmentStatus',
  ]
  const canSave = requiredFields.every((f) => data[f] && data[f] !== '')

  return (
    <ProfileSection
      id="professional"
      title="Professional Details"
      description="Help us understand your employment and skill domain"
      icon={<Briefcase className="h-full w-full" />}
      completionPercent={completionPercent || 0}
      onSave={onSave}
      isSaving={isSaving}
      isSaved={isSaved}
      canSave={canSave}
    >
      <FormField
        label="Occupation Type"
        name="occupationType"
        type="select"
        value={data.occupationType}
        onChange={(value) => onChange('occupationType', value)}
        options={occupationTypeOptions}
        required
        error={errors.occupationType}
      />
      <FormField
        label="Employment Status"
        name="employmentStatus"
        type="select"
        value={data.employmentStatus}
        onChange={(value) => onChange('employmentStatus', value)}
        options={employmentStatusOptions}
        error={errors.employmentStatus}
      />
      <FormField
        label="Labor Type"
        name="laborType"
        type="select"
        value={data.laborType}
        onChange={(value) => onChange('laborType', value)}
        options={laborTypeOptions}
        error={errors.laborType}
      />
      <FormField
        label="Skill Level"
        name="skillLevel"
        type="select"
        value={data.skillLevel}
        onChange={(value) => onChange('skillLevel', value)}
        options={skillLevelOptions}
        error={errors.skillLevel}
      />
      <FormField
        label="Years of Experience"
        name="yearsOfExperience"
        type="number"
        value={data.yearsOfExperience}
        onChange={(value) => onChange('yearsOfExperience', value)}
        placeholder="0"
        helperText="Total collective years of work"
        error={errors.yearsOfExperience}
      />
    </ProfileSection>
  )
}
