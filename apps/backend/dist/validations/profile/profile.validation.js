"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileValidationSchema = void 0;
const zod_1 = require("zod");
/**
 * Helper to handle empty strings as undefined for optional fields
 */
const emptyToUndefined = zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.any());
/**
 * @description Validation schema for the updated user profile module
 * Handles string-to-number conversions, terminology alignment, and empty-string normalization.
 */
exports.profileValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        // Personal Info
        firstName: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.string().min(1, 'First name is required')),
        middleName: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.string().optional().nullable()),
        lastName: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.string().min(1, 'Last name is required')),
        gender: zod_1.z.preprocess((val) => {
            if (!val || val === '')
                return undefined;
            return String(val).toUpperCase();
        }, zod_1.z.enum(['MALE', 'FEMALE', 'OTHER']).optional()),
        dateOfBirth: zod_1.z.preprocess((arg) => {
            if (!arg || arg === '')
                return undefined;
            if (typeof arg === "string" || arg instanceof Date)
                return new Date(arg);
        }, zod_1.z.date().optional()),
        mobileNumber: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.string().regex(/^\d{10}$/, 'Mobile number must be 10 digits').optional()),
        alternateContact: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.string().regex(/^\d{10}$/, 'Alternate contact must be 10 digits').optional().nullable()),
        // Address
        country: zod_1.z.string().default('India'),
        state: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.string().min(1, 'State is required').optional()),
        district: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.string().min(1, 'District is required').optional()),
        taluka: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.string().optional().nullable()),
        village: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.string().optional().nullable()),
        pincode: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits').optional()),
        areaType: zod_1.z.preprocess((val) => {
            if (!val || val === '')
                return undefined;
            return String(val).toUpperCase();
        }, zod_1.z.enum(['RURAL', 'URBAN', 'SEMI-URBAN']).optional()),
        // Socio-Economic
        annualIncome: zod_1.z.preprocess((val) => (val === '' || val === undefined) ? undefined : Number(val), zod_1.z.number().min(0).optional()),
        incomeCategory: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.string().optional().nullable()),
        bplStatus: zod_1.z.boolean().optional(),
        casteCategory: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.string().min(1, 'Caste category is required').optional()),
        religion: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.string().min(1, 'Religion is required').optional()),
        rationCardType: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.string().optional().nullable()),
        // Education
        educationLevel: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.string().optional().nullable()),
        institutionName: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.string().optional().nullable()),
        course: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.string().optional().nullable()),
        stream: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.string().optional().nullable()),
        boardUniversity: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.string().optional().nullable()),
        admissionYear: zod_1.z.preprocess((val) => (val === '' || val === undefined) ? undefined : Number(val), zod_1.z.number().optional()),
        passingYear: zod_1.z.preprocess((val) => (val === '' || val === undefined) ? undefined : Number(val), zod_1.z.number().optional()),
        resultType: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.enum(['percentage', 'cgpa']).optional().nullable()),
        resultValue: zod_1.z.preprocess((val) => (val === '' || val === undefined) ? undefined : Number(val), zod_1.z.number().optional()),
        educationMode: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.enum(['regular', 'distance']).optional().nullable()),
        // Professional
        occupationType: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.string().min(1, 'Occupation type is required').optional()),
        employmentStatus: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.string().min(1, 'Employment status is required').optional()),
        laborType: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.string().optional().nullable()),
        skillLevel: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.string().optional().nullable()),
        yearsOfExperience: zod_1.z.preprocess((val) => (val === '' || val === undefined) ? undefined : Number(val), zod_1.z.number().min(0).optional()),
        // Agriculture
        landSize: zod_1.z.preprocess((val) => (val === '' || val === undefined) ? undefined : Number(val), zod_1.z.number().min(0).optional()),
        cropType: zod_1.z.preprocess((val) => {
            if (val === '')
                return undefined;
            if (typeof val === 'string')
                return [val];
            return val;
        }, zod_1.z.array(zod_1.z.string()).optional()),
        irrigationType: zod_1.z.preprocess((val) => (val === '' ? undefined : val), zod_1.z.string().optional().nullable()),
    }),
});
