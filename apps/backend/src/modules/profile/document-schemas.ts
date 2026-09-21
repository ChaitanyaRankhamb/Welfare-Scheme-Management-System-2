import { Type } from '@google/genai';

// ==========================================
// 1. Aadhaar Gemini Data Schema
// ==========================================
export const aadhaarGeminiSchema = {
  type: Type.OBJECT,
  properties: {
    firstName: { type: Type.STRING, nullable: true },
    middleName: { type: Type.STRING, nullable: true },
    lastName: { type: Type.STRING, nullable: true },
    gender: { type: Type.STRING, nullable: true },
    dateOfBirth: { type: Type.STRING, nullable: true },
    state: { type: Type.STRING, nullable: true },
    district: { type: Type.STRING, nullable: true },
    taluka: { type: Type.STRING, nullable: true },
    village: { type: Type.STRING, nullable: true },
    pincode: { type: Type.STRING, nullable: true },
    areaType: { type: Type.STRING, nullable: true },
  },
  nullable: true,
};

// ==========================================
// 2. Bank Passbook Gemini Data Schema
// ==========================================
export const passbookGeminiSchema = {
  type: Type.OBJECT,
  properties: {
    accountHolderName: { type: Type.STRING, nullable: true },
    accountNumber: { type: Type.STRING, nullable: true },
    bankName: { type: Type.STRING, nullable: true },
    branchName: { type: Type.STRING, nullable: true },
    ifscCode: { type: Type.STRING, nullable: true },
    accountType: { type: Type.STRING, nullable: true },
  },
  nullable: true,
};

// ==========================================
// 3. Income Certificate Gemini Data Schema
// ==========================================
export const incomeGeminiSchema = {
  type: Type.OBJECT,
  properties: {
    annualIncome: { type: Type.NUMBER, nullable: true },
    incomeCategory: { type: Type.STRING, nullable: true },
  },
  nullable: true,
};

// ==========================================
// 4. Caste Certificate Gemini Data Schema
// ==========================================
export const casteGeminiSchema = {
  type: Type.OBJECT,
  properties: {
    casteCategory: { type: Type.STRING, nullable: true },
    religion: { type: Type.STRING, nullable: true },
    
  },
  nullable: true,
};

// ==========================================
// 5. Domicile Certificate Gemini Data Schema
// ==========================================
export const domicileGeminiSchema = {
  type: Type.OBJECT,
  properties: {
    state: { type: Type.STRING, nullable: true },
    district: { type: Type.STRING, nullable: true },
    taluka: { type: Type.STRING, nullable: true },
    village: { type: Type.STRING, nullable: true },
    pincode: { type: Type.STRING, nullable: true },
  },
  nullable: true,
};

export function getGeminiDataSchema(documentType: string) {
  const normType = documentType.toLowerCase().trim();

  if (normType === 'aadhaar') return aadhaarGeminiSchema;
  if (normType === 'bank_passbook' || normType === 'passbook') return passbookGeminiSchema;
  if (normType === 'income_certificate' || normType === 'income') return incomeGeminiSchema;
  if (normType === 'caste_certificate' || normType === 'caste') return casteGeminiSchema;
  if (normType === 'domicile_certificate' || normType === 'domicile') return domicileGeminiSchema;

  return aadhaarGeminiSchema;
}
