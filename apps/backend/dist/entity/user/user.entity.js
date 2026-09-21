"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const appError_1 = require("../../Error/appError");
class User {
    id;
    email;
    username;
    avatar;
    emailVerified;
    isActive;
    createdAt;
    updatedAt;
    passwordHash;
    role;
    profile;
    providers = [];
    verificationCode;
    verificationExpiry;
    constructor(id, email, username, avatar, emailVerified = false, isActive = true, providers = [], verificationCode, verificationExpiry, createdAt = new Date(), updatedAt = new Date(), 
    // Additional fields for welfare logic
    passwordHash, role = 'citizen', profile) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.avatar = avatar;
        this.emailVerified = emailVerified;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.passwordHash = passwordHash;
        this.role = role;
        this.profile = profile;
        this.providers = providers;
        this.verificationCode = verificationCode;
        this.verificationExpiry = verificationExpiry;
    }
    addProvider(provider) {
        const exists = this.providers.find((p) => p.type === provider.type);
        if (exists) {
            throw new appError_1.AppError("Provider Already Linked", 400);
        }
        this.providers.push(provider);
        this.touch();
    }
    getProviders() {
        return this.providers;
    }
    hasProvider(type) {
        return this.providers.some((p) => p.type === type);
    }
    setVerification(code, expiry) {
        this.verificationCode = code;
        this.verificationExpiry = expiry;
        this.touch();
    }
    clearVerificationData() {
        this.verificationCode = undefined;
        this.verificationExpiry = undefined;
    }
    isEmailVerified() {
        return this.emailVerified;
    }
    setEmailVerified(value) {
        this.emailVerified = value;
        this.touch();
    }
    getEmail() {
        return this.email;
    }
    getUsername() {
        return this.username;
    }
    getAvatar() {
        return this.avatar;
    }
    isUserActive() {
        return this.isActive;
    }
    getVerificationCode() {
        return this.verificationCode;
    }
    getVerificationExpiry() {
        return this.verificationExpiry;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
    // --- Added Methods for Core Business Logic ---
    getPasswordHash() {
        return this.passwordHash;
    }
    setPasswordHash(hash) {
        this.passwordHash = hash;
        this.touch();
    }
    getRole() {
        return this.role;
    }
    getProfile() {
        return this.profile;
    }
    updateProfile(newProfile) {
        this.profile = { ...this.profile, ...newProfile };
        this.touch();
    }
    setActiveStatus(status) {
        this.isActive = status;
        this.touch();
    }
    touch() {
        this.updatedAt = new Date();
    }
}
exports.User = User;
