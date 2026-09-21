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
exports.ProfileModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const profileSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
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
exports.ProfileModel = mongoose_1.default.model('Profile', profileSchema);
