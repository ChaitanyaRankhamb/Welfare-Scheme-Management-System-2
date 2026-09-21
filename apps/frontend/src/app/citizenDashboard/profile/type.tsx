export interface ProfileState {
  // Personal Information
  firstName: string
  middleName: string
  lastName: string
  gender: string
  dateOfBirth: Date | null
  mobileNumber: string
  alternateContact: string

  // Address Details
  country: string
  state: string
  district: string
  taluka: string
  village: string
  pincode: string
  areaType: string

  // Socio-Economic Details
  annualIncome: string
  incomeCategory: string
  bplStatus: boolean
  casteCategory: string
  religion: string
  rationCardType: string

  // Education (Expanded for MAHADBT style)
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

  // Professional
  occupationType: string
  employmentStatus: string
  laborType: string
  skillLevel: string
  yearsOfExperience: string

  // Agriculture
  landSize: string
  cropType: string
  irrigationType: string
}

export const initialState: ProfileState = {
  firstName: '',
  middleName: '',
  lastName: '',
  gender: '',
  dateOfBirth: null,
  mobileNumber: '',
  alternateContact: '',

  country: '',
  state: '',
  district: '',
  taluka: '',
  village: '',
  pincode: '',
  areaType: '',

  annualIncome: '',
  incomeCategory: '',
  bplStatus: false,
  casteCategory: '',
  religion: '',
  rationCardType: '',

  educationLevel: '',
  institutionName: '',
  course: '',
  stream: '',
  boardUniversity: '',
  admissionYear: '',
  passingYear: '',
  resultType: '',
  resultValue: '',
  educationMode: '',

  occupationType: '',
  employmentStatus: '',
  laborType: '',
  skillLevel: '',
  yearsOfExperience: '',

  landSize: '',
  cropType: '',
  irrigationType: '',
}