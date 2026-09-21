'use client'

import { BookOpen } from 'lucide-react'
import { ProfileSection } from './profile-section'
import { FormField } from './form-field'

interface EducationData {
  educationLevel: string
  institutionName: string
  course: string
  stream: string
  boardUniversity: string
  admissionYear: string
  passingYear: string
  resultType: string
  resultValue: string
  educationMode: string
}

interface EducationDetailsProps {
  data: EducationData
  onChange: (field: keyof EducationData, value: any) => void
  onSave?: () => void
  isSaving?: boolean
  isSaved?: boolean
  completionPercent?: number
  errors?: Partial<Record<keyof EducationData, string>>
}

const educationLevelOptions = [
  { label: 'Secondary (SSC)', value: 'ssc' },
  { label: 'Higher Secondary (HSC)', value: 'hsc' },
  { label: 'Diploma', value: 'diploma' },
  { label: 'Undergraduate (UG)', value: 'ug' },
  { label: 'Postgraduate (PG)', value: 'pg' },
  { label: 'Doctorate (PhD)', value: 'phd' },
  { label: 'Other', value: 'other' },
]

const resultTypeOptions = [
  { label: 'Percentage (%)', value: 'percentage' },
  { label: 'CGPA', value: 'cgpa' },
]

const modeOptions = [
  { label: 'Regular', value: 'regular' },
  { label: 'Distance/Correspondence', value: 'distance' },
]

export function EducationDetails({
  data,
  onChange,
  onSave,
  isSaving,
  isSaved,
  completionPercent,
  errors = {},
}: EducationDetailsProps) {
  const requiredFields: (keyof EducationData)[] = [
    'educationLevel',
    'institutionName',
    'course',
    'stream',
    'boardUniversity',
    'admissionYear',
    'passingYear',
    'resultType',
    'resultValue',
    'educationMode',
  ]
  const canSave = requiredFields.every((f) => data[f] !== '' && data[f] !== null && data[f] !== undefined)

  return (
    <ProfileSection
      id="education"
      title="Educational Details"
      description="Tell us about your academic background to unlock student benefits"
      icon={<BookOpen className="h-full w-full" />}
      completionPercent={completionPercent || 0}
      onSave={onSave}
      isSaving={isSaving}
      isSaved={isSaved}
      canSave={canSave}
    >
      <FormField
        label="Qualification Level"
        name="educationLevel"
        type="select"
        value={data.educationLevel}
        onChange={(value) => onChange('educationLevel', value)}
        options={educationLevelOptions}
        required
        error={errors.educationLevel}
      />
      <FormField
        label="Course Name"
        name="course"
        type="text"
        value={data.course}
        onChange={(value) => onChange('course', value)}
        placeholder="e.g. B.E., B.Com, 12th"
        required
        error={errors.course}
      />
      <FormField
        label="Stream/Specialization"
        name="stream"
        type="text"
        value={data.stream}
        onChange={(value) => onChange('stream', value)}
        placeholder="e.g. Computer Science, Science"
        error={errors.stream}
      />
      <FormField
        label="College/School Name"
        name="institutionName"
        type="text"
        value={data.institutionName}
        onChange={(value) => onChange('institutionName', value)}
        placeholder="Enter institution name"
        required
        error={errors.institutionName}
      />
      <FormField
        label="Board/University"
        name="boardUniversity"
        type="text"
        value={data.boardUniversity}
        onChange={(value) => onChange('boardUniversity', value)}
        placeholder="e.g. Pune University, CBSE"
        required
        error={errors.boardUniversity}
      />
      <FormField
        label="Admission Year"
        name="admissionYear"
        type="number"
        value={data.admissionYear}
        onChange={(value) => onChange('admissionYear', value)}
        placeholder="YYYY"
        error={errors.admissionYear}
      />
      <FormField
        label="Passing Year"
        name="passingYear"
        type="number"
        value={data.passingYear}
        onChange={(value) => onChange('passingYear', value)}
        placeholder="YYYY"
        required
        error={errors.passingYear}
      />
      <div className="flex gap-4 col-span-1 md:col-span-2">
        <div className="flex-1">
          <FormField
            label="Result Type"
            name="resultType"
            type="select"
            value={data.resultType}
            onChange={(value) => onChange('resultType', value)}
            options={resultTypeOptions}
            error={errors.resultType}
          />
        </div>
        <div className="flex-1">
          <FormField
            label="Result Value"
            name="resultValue"
            type="text"
            value={data.resultValue}
            onChange={(value) => onChange('resultValue', value)}
            placeholder={data.resultType === 'cgpa' ? 'e.g. 9.5' : 'e.g. 85.5'}
            error={errors.resultValue}
          />
        </div>
      </div>
      <FormField
        label="Study Mode"
        name="educationMode"
        type="select"
        value={data.educationMode}
        onChange={(value) => onChange('educationMode', value)}
        options={modeOptions}
        error={errors.educationMode}
      />
    </ProfileSection>
  )
}
