"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemeModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// ─── Sub-Schemas ──────────────────────────────────────────────────────────────
const ageSchema = new mongoose_1.Schema({
    min: { type: Number, required: true, default: 0 },
    max: { type: Number, required: true, default: 150 },
}, { _id: false });
const incomeSchema = new mongoose_1.Schema({
    min: { type: Number, required: true, default: 0 },
    max: { type: Number, required: true, default: 99999999 },
}, { _id: false });
const locationSchema = new mongoose_1.Schema({
    country: { type: String, required: true, default: 'India' },
    states: { type: [String], default: [] },
    districts: { type: [String], default: [] },
    ruralOnly: { type: Boolean, required: true, default: false },
    urbanOnly: { type: Boolean, required: true, default: false },
}, { _id: false });
const socialSchema = new mongoose_1.Schema({
    religion: { type: [String], default: [] },
    caste: { type: [String], default: [] },
    minority: { type: Boolean, required: true, default: false },
    disability: { type: Boolean, required: true, default: false },
}, { _id: false });
const employmentSchema = new mongoose_1.Schema({
    employmentStatus: {
        type: [String],
        enum: ['student', 'employed', 'self_employed', 'unemployed', 'farmer', 'laborer', 'homemaker', 'other'],
        required: true,
        validate: {
            validator: (v) => Array.isArray(v) && v.length > 0,
            message: 'Scheme must define at least one employmentStatus.',
        },
    },
    occupations: { type: [String], default: [] },
}, { _id: false });
const eligibilitySchema = new mongoose_1.Schema({
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
}, { _id: false });
// ─── Main Schema ──────────────────────────────────────────────────────────────
const schemeSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
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
exports.SchemeModel = mongoose_1.default.model('Scheme', schemeSchema);
