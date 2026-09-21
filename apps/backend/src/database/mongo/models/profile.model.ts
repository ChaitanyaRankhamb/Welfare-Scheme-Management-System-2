import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProfile extends Document {
  userId: Types.ObjectId;

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
  areaType: 'RURAL' | 'URBAN' | 'SEMI-URBAN';

  // Socio-Economic
  annualIncome: number;
  incomeCategory?: string;
  bplStatus: boolean;
  casteCategory: string;
  religion: string;
  rationCardType?: string;

  // Education (Expanded for MAHADBT style)
  educationLevel?: string;   // Qualification Level
  institutionName?: string;  // College/School Name
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
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<IProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

  // Personal Info
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  mobileNumber: { type: String, required: true },
  alternateContact: { type: String },

  // Address
  country: { type: String, required: true, default: 'India' },
  state: { type: String, required: true },
  district: { type: String, required: true },
  taluka: { type: String },
  village: { type: String },
  pincode: { type: String, required: true },
  areaType: { type: String, enum: ['RURAL', 'URBAN', 'SEMI-URBAN'], required: true },

  // Socio-Economic
  annualIncome: { type: Number, required: true },
  incomeCategory: { type: String },
  bplStatus: { type: Boolean, required: true, default: false },
  casteCategory: { type: String, required: true },
  religion: { type: String, required: true },
  rationCardType: { type: String },

  // Education
  educationLevel: { type: String },
  institutionName: { type: String },
  course: { type: String },
  stream: { type: String },
  boardUniversity: { type: String },
  admissionYear: { type: Number },
  passingYear: { type: Number },
  resultType: { type: String, enum: ['percentage', 'cgpa'] },
  resultValue: { type: Number },
  educationMode: { type: String, enum: ['regular', 'distance'] },

  // Professional
  occupationType: { type: String, required: true },
  employmentStatus: { type: String, required: true },
  laborType: { type: String },
  skillLevel: { type: String },
  yearsOfExperience: { type: Number },

  // Agriculture
  landSize: { type: Number },
  cropType: [{ type: String }],
  irrigationType: { type: String },

  // Meta
  profileCompletionPercentage: { type: Number, default: 0 },

}, { timestamps: true });

profileSchema.index({ state: 1, district: 1 });
profileSchema.index({ casteCategory: 1 });
profileSchema.index({ occupationType: 1 });
profileSchema.index({ religion: 1 });

export const ProfileModel = mongoose.model<IProfile>('Profile', profileSchema);
