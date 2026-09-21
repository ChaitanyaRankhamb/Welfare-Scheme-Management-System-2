import type { ProfileId } from './profileId';
import { UserId } from '../user/userId';

export type ProfileRuralUrban = 'RURAL' | 'URBAN' | 'SEMI-URBAN';

export interface ProfileSnapshot {
  userId: UserId;

  // Personal Info
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: string;
  dateOfBirth: Date;
  mobileNumber: string;
  alternateContact?: string;

  // Address
  country: string;
  state: string;
  district: string;
  taluka?: string;
  village?: string;
  pincode: string;
  areaType: ProfileRuralUrban;

  // Socio-Economic
  annualIncome: number;
  incomeCategory?: string;
  bplStatus: boolean;
  casteCategory: string;
  religion: string;
  rationCardType?: string;

  // Education (Expanded)
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

  // Professional
  occupationType: string;
  employmentStatus: string;
  laborType?: string;
  skillLevel?: string;
  yearsOfExperience?: number;

  // Agriculture
  landSize?: number;
  cropType?: string[];
  irrigationType?: string;

  // Meta
  profileCompletionPercentage: number;
}

export class Profile {
  constructor(
    public readonly id: ProfileId,
    private snapshot: ProfileSnapshot,
    public readonly createdAt: Date,
    private updatedAt: Date
  ) {}

  getUserId(): UserId {
    return this.snapshot.userId;
  }

  getSnapshot(): Readonly<ProfileSnapshot> {
    return this.snapshot;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  /**
   * Calculates age from date of birth
   */
  getAge(): number {
    const today = new Date();
    const dob = this.snapshot.dateOfBirth;
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }

  getGender(): "MALE" | "FEMALE" | "OTHER" {
    return this.snapshot.gender as "MALE" | "FEMALE" | "OTHER";
  }

  getAnnualIncome(): number {
    return this.snapshot.annualIncome;
  }

  getEmploymentStatus(): string {
    return this.snapshot.employmentStatus;
  }

  getCasteCategory(): string {
    return this.snapshot.casteCategory;
  }

  getReligion(): string {
    return this.snapshot.religion;
  }

  getLocation(): {
    country: string;
    state: string;
    district: string;
    taluka?: string;
    village?: string;
    rularOrUrban: "rular" | "urban";
  } {
    return {
      country: this.snapshot.country,
      state: this.snapshot.state,
      district: this.snapshot.district,
      taluka: this.snapshot.taluka,
      village: this.snapshot.village,
      rularOrUrban: this.snapshot.areaType === 'RURAL' ? 'rular' : 'urban'
    };
  }

  /**
   * Partial update; recalculates completion percentage after merge.
   */
  patch(partial: Partial<Omit<ProfileSnapshot, 'userId' | 'profileCompletionPercentage'>>): void {
    const cleanPartial = Object.fromEntries(
      Object.entries(partial).filter(([_, v]) => v !== undefined)
    );

    const merged: ProfileSnapshot = {
      ...this.snapshot,
      ...cleanPartial,
      cropType: cleanPartial.cropType ? [...(cleanPartial.cropType as string[])] : (this.snapshot.cropType ? [...this.snapshot.cropType] : undefined)
    };

    this.snapshot = merged;
    this.recalculateCompletion();
    this.touch();
  }

  /**
   * Recalculates the profile completion percentage based on filled fields.
   */
  public recalculateCompletion(): void {
    let totalScore = 0;

    // 1. Personal Info (20%) - 5 core fields: firstName, lastName, gender, dob, mobile
    const personalFields = ['firstName', 'lastName', 'gender', 'dateOfBirth', 'mobileNumber'];
    totalScore += this.calculateSectionScore(personalFields, 20);

    // 2. Address (20%) - 6 core fields
    const addressFields = ['country', 'state', 'district', 'taluka', 'village', 'pincode', 'areaType'];
    totalScore += this.calculateSectionScore(addressFields, 20);

    // 3. Socio-Economic (20%) - 4 fields: annualIncome, casteCategory, religion, bplStatus (boolean is always there)
    const socioFields = ['annualIncome', 'casteCategory', 'religion', 'bplStatus'];
    totalScore += this.calculateSectionScore(socioFields, 20);

    // 4. Education (10%) - 9 fields
    const educationFields = [
      'educationLevel', 'institutionName', 'course', 'stream', 
      'boardUniversity', 'admissionYear', 'passingYear', 
      'resultType', 'resultValue', 'educationMode'
    ];
    totalScore += this.calculateSectionScore(educationFields, 10);

    // 5. Professional (15%) - occ, status, labor, skill, exp
    const professionalFields = ['occupationType', 'employmentStatus', 'laborType', 'skillLevel', 'yearsOfExperience'];
    totalScore += this.calculateSectionScore(professionalFields, 15);

    // 6. Agriculture (15%) - size, crops, irrigation
    const agricultureFields = ['landSize', 'cropType', 'irrigationType'];
    totalScore += this.calculateSectionScore(agricultureFields, 15);

    this.snapshot.profileCompletionPercentage = Math.round(totalScore);
  }

  private calculateSectionScore(fields: string[], weight: number): number {
    if (fields.length === 0) return 0;
    let filled = 0;
    for (const field of fields) {
      const val = (this.snapshot as any)[field];
      if (val !== undefined && val !== null && val !== '') {
        if (Array.isArray(val) && val.length === 0) continue;
        filled++;
      }
    }
    return (filled / fields.length) * weight;
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}
