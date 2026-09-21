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
exports.UserModel = exports.UserValidationSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const zod_1 = require("zod");
const AuthProvider_1 = require("../../../entity/user/AuthProvider");
exports.UserValidationSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    username: zod_1.z.string().optional(),
    avatar: zod_1.z.string().optional(),
    emailVerified: zod_1.z.boolean().default(false),
    isActive: zod_1.z.boolean().default(true),
    passwordHash: zod_1.z.string().optional(),
    role: zod_1.z.enum(['citizen', 'admin']).default('citizen'),
    providers: zod_1.z.array(zod_1.z.object({
        type: zod_1.z.nativeEnum(AuthProvider_1.ProviderType),
        providerId: zod_1.z.string()
    })).default([]),
    verificationCode: zod_1.z.number().optional(),
    verificationExpiry: zod_1.z.date().optional(),
});
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String },
    avatar: { type: String },
    emailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    passwordHash: { type: String },
    role: { type: String, enum: ['citizen', 'admin'], default: 'citizen' },
    providers: [{
            type: { type: String, enum: Object.values(AuthProvider_1.ProviderType) },
            providerId: { type: String }
        }],
    verificationCode: { type: Number },
    verificationExpiry: { type: Date }
}, { timestamps: true });
exports.UserModel = mongoose_1.default.model('User', userSchema);
