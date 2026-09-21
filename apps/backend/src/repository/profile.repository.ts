import { Profile } from '../entity/profile/profile.entity';
import type { ProfileRuralUrban } from '../entity/profile/profile.entity';

export interface CreateProfileData {
  userId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: string;
  dateOfBirth: Date;
  mobileNumber: string;
  alternateContact?: string;
  country: string;
  state: string;
  district: string;
  taluka?: string;
  village?: string;
  pincode: string;
  areaType: ProfileRuralUrban;
  annualIncome: number;
  incomeCategory?: string;
  bplStatus: boolean;
  casteCategory: string;
  religion: string;
  rationCardType?: string;
  educationLevel?: string;
  institutionName?: string;
  course?: string;
  stream?: string;
  boardUniversity?: string;
  admissionYear?: number;
  passingYear?: number;
  resultType?: 'percentage' | 'cgpa';
  resultValue?: number;
  educationMode?: 'regular' | 'distance';
  occupationType: string;
  employmentStatus: string;
  laborType?: string;
  skillLevel?: string;
  yearsOfExperience?: number;
  landSize?: number;
  cropType?: string[];
  irrigationType?: string;
  profileCompletionPercentage?: number;
}

export interface IProfileRepository {
  createProfile(profileData: CreateProfileData): Promise<Profile>;
  findProfileByUserId(userId: string): Promise<Profile | null>;
  updateProfile(userId: string, profile: Profile): Promise<Profile | null>;
}
