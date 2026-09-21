import mongoose, { Document, Schema } from 'mongoose';
import type { SchemeEligibilityCriteria, SchemeStatus } from '../../../entity/schemes/scheme.entity';

// ─── Document Interface ───────────────────────────────────────────────────────

export interface IScheme extends Document {
  title: string;
  description: string;
  ministry: string;
  category: string;
  tags: string[];
  eligibility: SchemeEligibilityCriteria;
  benefits: string[];
  documentsRequired: string[];
  applicationUrl?: string;
  trackingMeta?: {
    type: 'direct' | 'multi_step' | 'login_required' | 'none';
    instructions?: string[];
  };
  status: SchemeStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Sub-Schemas ──────────────────────────────────────────────────────────────

const ageSchema = new Schema(
  {
    min: { type: Number, required: true, default: 0 },
    max: { type: Number, required: true, default: 150 },
  },
  { _id: false }
);

const incomeSchema = new Schema(
  {
    min: { type: Number, required: true, default: 0 },
    max: { type: Number, required: true, default: 99999999 },
  },
  { _id: false }
);

const locationSchema = new Schema(
  {
    country: { type: String, required: true, default: 'India' },
    states: { type: [String], default: [] },
    districts: { type: [String], default: [] },
    ruralOnly: { type: Boolean, required: true, default: false },
    urbanOnly: { type: Boolean, required: true, default: false },
  },
  { _id: false }
);

const socialSchema = new Schema(
  {
    religion: { type: [String], default: [] },
    caste: { type: [String], default: [] },
    minority: { type: Boolean, required: true, default: false },
    disability: { type: Boolean, required: true, default: false },
  },
  { _id: false }
);

const employmentSchema = new Schema(
  {
    employmentStatus: {
      type: [String],
      enum: ['student', 'employed', 'self_employed', 'unemployed', 'farmer', 'laborer', 'homemaker', 'other'],
      required: true,
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'Scheme must define at least one employmentStatus.',
      },
    },
    occupations: { type: [String], default: [] },
  },
  { _id: false }
);

const eligibilitySchema = new Schema(
  {
    age: { type: ageSchema, required: true, default: () => ({ min: 0, max: 150 }) },
    income: { type: incomeSchema, required: true, default: () => ({ min: 0, max: 99999999 }) },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'any'],
      required: true,
      default: 'any',
    },
    location: { type: locationSchema, required: true, default: () => ({}) },
    social: { type: socialSchema, required: true, default: () => ({}) },
    employment: { type: employmentSchema, required: true },
  },
  { _id: false }
);

// ─── Main Schema ──────────────────────────────────────────────────────────────

const schemeSchema = new Schema<IScheme>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    ministry: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    eligibility: { type: eligibilitySchema, required: true },
    benefits: [{ type: String, required: true }],
    documentsRequired: [{ type: String }],
    applicationUrl: { type: String },
    trackingMeta: {
      type: { type: String, enum: ['direct', 'multi_step', 'login_required', 'none'], default: 'none' },
      instructions: [{ type: String }],
    },
    status: {
      type: String,
      enum: ['drafted', 'published', 'archived'],
      default: 'drafted',
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

// Full-text search
schemeSchema.index({ title: 'text', description: 'text' });

// Status filter (most common top-level filter)
schemeSchema.index({ status: 1 });

// Eligibility filters
schemeSchema.index({ 'eligibility.age.min': 1 });
schemeSchema.index({ 'eligibility.age.max': 1 });
schemeSchema.index({ 'eligibility.income.max': 1 });
schemeSchema.index({ 'eligibility.gender': 1 });
schemeSchema.index({ 'eligibility.employment.employmentStatus': 1 });
schemeSchema.index({ 'eligibility.social.caste': 1 });
schemeSchema.index({ 'eligibility.location.states': 1 });

// Compound index for core citizen profile filter
schemeSchema.index({
  status: 1,
  'eligibility.gender': 1,
  'eligibility.age.min': 1,
  'eligibility.age.max': 1,
  'eligibility.income.max': 1,
});

export const SchemeModel = mongoose.model<IScheme>('Scheme', schemeSchema);