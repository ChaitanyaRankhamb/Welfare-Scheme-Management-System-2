import { z } from 'zod';

// ==========================================
// 1. Aadhaar Card Extraction Schema
// ==========================================
export const aadhaarExtractionSchema = z.object({
  firstName: z.string().nullable().optional(),
  middleName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  dateOfBirth: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  district: z.string().nullable().optional(),
  taluka: z.string().nullable().optional(),
  village: z.string().nullable().optional(),
  pincode: z.string().nullable().optional(),
  areaType: z.string().nullable().optional(),
});

// ==========================================
// 2. Bank Passbook Extraction Schema
// ==========================================
export const passbookExtractionSchema = z.object({
  accountHolderName: z.string().nullable().optional(),
  accountNumber: z.string().nullable().optional(),
  bankName: z.string().nullable().optional(),
  branchName: z.string().nullable().optional(),
  ifscCode: z.string().nullable().optional(),
  accountType: z.string().nullable().optional(),
});

// ==========================================
// 3. Income Certificate Extraction Schema
// ==========================================
export const incomeExtractionSchema = z.object({
  annualIncome: z.number().nullable().optional(),
  incomeCategory: z.string().nullable().optional(),
});

// ==========================================
// 4. Caste Certificate Extraction Schema
// ==========================================
export const casteExtractionSchema = z.object({
  casteCategory: z.string().nullable().optional(),
  religion: z.string().nullable().optional(),
});

// ==========================================
// 5. Domicile Certificate Extraction Schema
// ==========================================
export const domicileExtractionSchema = z.object({
  state: z.string().nullable().optional(),
  district: z.string().nullable().optional(),
  taluka: z.string().nullable().optional(),
  village: z.string().nullable().optional(),
  pincode: z.string().nullable().optional(),
});

// ==========================================
// 5 Individual Document Validation Functions
// ==========================================

export function validateAadhaarData(data: unknown) {
  return aadhaarExtractionSchema.safeParse(data);
}

export function validatePassbookData(data: unknown) {
  return passbookExtractionSchema.safeParse(data);
}

export function validateIncomeData(data: unknown) {
  return incomeExtractionSchema.safeParse(data);
}

export function validateCasteData(data: unknown) {
  return casteExtractionSchema.safeParse(data);
}

export function validateDomicileData(data: unknown) {
  return domicileExtractionSchema.safeParse(data);
}

// Dispatcher function to pick the right validator
export function validateDocumentExtraction(documentType: string, data: unknown) {
  const normType = documentType.toLowerCase().trim();

  if (normType === 'aadhaar') {
    return validateAadhaarData(data);
  }
  if (normType === 'bank_passbook' || normType === 'passbook') {
    return validatePassbookData(data);
  }
  if (normType === 'income_certificate' || normType === 'income') {
    return validateIncomeData(data);
  }
  if (normType === 'caste_certificate' || normType === 'caste') {
    return validateCasteData(data);
  }
  if (normType === 'domicile_certificate' || normType === 'domicile') {
    return validateDomicileData(data);
  }

  // Fallback permissive validation if documentType is custom
  return { success: true, data, error: undefined };
}
