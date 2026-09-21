import { z } from 'zod';

/**
 * Helper to handle empty strings as undefined for optional fields
 */
const emptyToUndefined = z.preprocess((val) => (val === '' ? undefined : val), z.any());

/**
 * @description Validation schema for the updated user profile module
 * Handles string-to-number conversions, terminology alignment, and empty-string normalization.
 */
export const profileValidationSchema = z.object({
  body: z.object({
    // Personal Info
    firstName: z.preprocess((val) => (val === '' ? undefined : val), z.string().min(1, 'First name is required')),
    middleName: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional().nullable()),
    lastName: z.preprocess((val) => (val === '' ? undefined : val), z.string().min(1, 'Last name is required')),
    gender: z.preprocess((val) => {
      if (!val || val === '') return undefined;
      return String(val).toUpperCase();
    }, z.enum(['MALE', 'FEMALE', 'OTHER']).optional()),
    dateOfBirth: z.preprocess((arg) => {
      if (!arg || arg === '') return undefined;
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    }, z.date().optional()),
    mobileNumber: z.preprocess((val) => (val === '' ? undefined : val), z.string().regex(/^\d{10}$/, 'Mobile number must be 10 digits').optional()),
    alternateContact: z.preprocess((val) => (val === '' ? undefined : val), z.string().regex(/^\d{10}$/, 'Alternate contact must be 10 digits').optional().nullable()),

    // Address
    country: z.string().default('India'),
    state: z.preprocess((val) => (val === '' ? undefined : val), z.string().min(1, 'State is required').optional()),
    district: z.preprocess((val) => (val === '' ? undefined : val), z.string().min(1, 'District is required').optional()),
    taluka: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional().nullable()),
    village: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional().nullable()),
    pincode: z.preprocess((val) => (val === '' ? undefined : val), z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits').optional()),
    areaType: z.preprocess((val) => {
      if (!val || val === '') return undefined;
      return String(val).toUpperCase();
    }, z.enum(['RURAL', 'URBAN', 'SEMI-URBAN']).optional()),

    // Socio-Economic
    annualIncome: z.preprocess((val) => (val === '' || val === undefined) ? undefined : Number(val), z.number().min(0).optional()),
    incomeCategory: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional().nullable()),
    bplStatus: z.boolean().optional(),
    casteCategory: z.preprocess((val) => (val === '' ? undefined : val), z.string().min(1, 'Caste category is required').optional()),
    religion: z.preprocess((val) => (val === '' ? undefined : val), z.string().min(1, 'Religion is required').optional()),
    rationCardType: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional().nullable()),

    // Education
    educationLevel: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional().nullable()),
    institutionName: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional().nullable()),
    course: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional().nullable()),
    stream: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional().nullable()),
    boardUniversity: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional().nullable()),
    admissionYear: z.preprocess((val) => (val === '' || val === undefined) ? undefined : Number(val), z.number().optional()),
    passingYear: z.preprocess((val) => (val === '' || val === undefined) ? undefined : Number(val), z.number().optional()),
    resultType: z.preprocess((val) => (val === '' ? undefined : val), z.enum(['percentage', 'cgpa']).optional().nullable()),
    resultValue: z.preprocess((val) => (val === '' || val === undefined) ? undefined : Number(val), z.number().optional()),
    educationMode: z.preprocess((val) => (val === '' ? undefined : val), z.enum(['regular', 'distance']).optional().nullable()),

    // Professional
    occupationType: z.preprocess((val) => (val === '' ? undefined : val), z.string().min(1, 'Occupation type is required').optional()),
    employmentStatus: z.preprocess((val) => (val === '' ? undefined : val), z.string().min(1, 'Employment status is required').optional()),
    laborType: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional().nullable()),
    skillLevel: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional().nullable()),
    yearsOfExperience: z.preprocess((val) => (val === '' || val === undefined) ? undefined : Number(val), z.number().min(0).optional()),

    // Agriculture
    landSize: z.preprocess((val) => (val === '' || val === undefined) ? undefined : Number(val), z.number().min(0).optional()),
    cropType: z.preprocess((val) => {
      if (val === '') return undefined;
      if (typeof val === 'string') return [val];
      return val;
    }, z.array(z.string()).optional()),
    irrigationType: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional().nullable()),
  }),
});
