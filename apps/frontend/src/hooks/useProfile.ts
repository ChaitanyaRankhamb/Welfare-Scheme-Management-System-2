import { useState, useEffect, useMemo, useCallback } from 'react'
import { ProfileState, initialState } from '../app/citizenDashboard/profile/type'
import { profileApi } from '../components/api/profileApi'
import { toast } from 'sonner'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import React from 'react'

const FIELD_TO_SECTION: Record<string, string> = {
  firstName: 'personalInformation',
  middleName: 'personalInformation',
  lastName: 'personalInformation',
  gender: 'personalInformation',
  dateOfBirth: 'personalInformation',
  mobileNumber: 'personalInformation',
  alternateContact: 'personalInformation',
  country: 'address',
  state: 'address',
  district: 'address',
  taluka: 'address',
  village: 'address',
  pincode: 'address',
  areaType: 'address',
  annualIncome: 'socioEconomic',
  incomeCategory: 'socioEconomic',
  bplStatus: 'socioEconomic',
  casteCategory: 'socioEconomic',
  religion: 'socioEconomic',
  rationCardType: 'socioEconomic',
  educationLevel: 'education',
  institutionName: 'education',
  course: 'education',
  stream: 'education',
  boardUniversity: 'education',
  admissionYear: 'education',
  passingYear: 'education',
  resultType: 'education',
  resultValue: 'education',
  educationMode: 'education',
  occupationType: 'professional',
  employmentStatus: 'professional',
  laborType: 'professional',
  skillLevel: 'professional',
  yearsOfExperience: 'professional',
  landSize: 'agriculture',
  cropType: 'agriculture',
  irrigationType: 'agriculture',
}

export function useProfile() {
  const [profile, setProfile] = useState<ProfileState>(initialState)
  const [isLoading, setIsLoading] = useState(true)
  const [sectionSaving, setSectionSaving] = useState<Record<string, boolean>>({})
  const [isSaved, setIsSaved] = useState<Record<string, boolean>>({})
  const [sectionCompletion, setSectionCompletion] = useState<Record<string, number>>({
    personalInformation: 0,
    address: 0,
    socioEconomic: 0,
    education: 0,
    professional: 0,
    agriculture: 0,
  })

  // Fetch profile on initial load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const json = await profileApi.getProfile()
        if (json.success && json.data) {
          const data = json.data
          setProfile(prev => ({
            ...prev,
            ...data,
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null
          }))
          
          // Mark sections as saved if they have relevant data
          const savedState = {
            personalInformation: !!data.firstName,
            address: !!data.state,
            socioEconomic: !!data.casteCategory,
            education: !!data.educationLevel || !!data.institutionName,
            professional: !!data.occupationType,
            agriculture: !!data.landSize || !!data.cropType
          }
          setIsSaved(savedState)

          setSectionCompletion({
            personalInformation: savedState.personalInformation ? 100 : 0,
            address: savedState.address ? 100 : 0,
            socioEconomic: savedState.socioEconomic ? 100 : 0,
            education: savedState.education ? 100 : 0,
            professional: savedState.professional ? 100 : 0,
            agriculture: savedState.agriculture ? 100 : 0,
          })
        }
      } catch (error) {
        console.error('Error fetching profile', error)
        toast.error('Failed to load profile data')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [])

  // Update specific field in profile state
  const updateField = useCallback((field: keyof ProfileState, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value,
    }))
    
    // Reset saved status for THIS specific section when it's edited
    const sectionId = FIELD_TO_SECTION[field]
    if (sectionId) {
      setIsSaved(prev => ({ ...prev, [sectionId]: false }))
    }
  }, [])

  // Save specific section to backend
  const saveSection = async (sectionId: string) => {
    setSectionSaving(prev => ({ ...prev, [sectionId]: true }))
    
    try {
      // We pass the entire profile, but the backend extracts only the relevant fields
      // based on the sectionId.
      const json = await profileApi.updateSection(sectionId, profile)
      
      if (json.success) {
        setIsSaved(prev => ({ ...prev, [sectionId]: true }))
        setSectionCompletion(prev => ({
          ...prev,
          [sectionId]: 100, // Mark section as 100% complete once saved
        }))
        toast.success(`${sectionId.charAt(0).toUpperCase() + sectionId.slice(1).replace(/([A-Z])/g, ' $1')} section saved successfully!`, {
          description: 'Your profile has been updated.',
          icon: React.createElement(CheckCircle2, { className: "h-4 w-4 text-green-500" }),
          style: {
            backgroundColor: '#eafbf4',
            color: '#166534',
            border: '1px solid #bbf7d0',
          }
        })
        return true
      } else {
        throw new Error(json.message)
      }
    } catch (error: any) {
      toast.error(`Failed to save ${sectionId} section`, {
        description: error.message || 'Please check your connection and try again.',
        icon: React.createElement(AlertCircle, { className: "h-4 w-4 text-red-500" }),
        style: {
          backgroundColor: '#fef2f2',
          color: '#991b1b',
          border: '1px solid #fecaca',
        }
      })
      return false
    } finally {
      setSectionSaving(prev => ({ ...prev, [sectionId]: false }))
    }
  }

  // Calculate completion percentage based on active sections
  const completionStats = useMemo(() => {
    const isFarmer = profile.occupationType === 'farmer'
    const coreSections = ['personalInformation', 'address', 'socioEconomic', 'education', 'professional']
    const activeSections = isFarmer ? [...coreSections, 'agriculture'] : coreSections
    
    const completedCount = activeSections.filter(s => sectionCompletion[s] === 100).length
    const percent = Math.round((completedCount / activeSections.length) * 100)
    
    return { percent, filledFields: completedCount, totalFields: activeSections.length }
  }, [sectionCompletion, profile.occupationType])

  return {
    profile,
    isLoading,
    updateField,
    saveSection,
    sectionSaving,
    isSaved,
    sectionCompletion,
    completionStats,
  }
}
