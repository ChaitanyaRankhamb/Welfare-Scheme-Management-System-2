"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyService = void 0;
const user_repository_1 = require("../../database/repository/user.repository");
const appError_1 = require("../../Error/appError");
/**
 * Handles the email verification logic.
 * @param email The user's email address
 * @param code The verification code provided by the user
 */
const verifyService = async (email, code) => {
    // 1. Find user by email
    const user = await user_repository_1.userRepository.findUserByEmail(email);
    if (!user) {
        throw new appError_1.AppError("User not found", 404);
    }
    // 2. Check if user is already verified
    if (user.isEmailVerified()) {
        throw new appError_1.AppError("Email is already verified", 400);
    }
    // 3. Verify the email using the provided code
    const expiry = user.getVerificationExpiry();
    // verify expiry data
    if (!expiry || Date.now() > expiry.getTime()) {
        throw new appError_1.AppError("Verification code expired. Please request a new one.", 400);
    }
    // verify code
    if (user.getVerificationCode() !== code) {
        throw new appError_1.AppError("Please enter valid verification code.", 400);
    }
    // make user verified
    user.setEmailVerified(true);
    // clear verification data
    user.clearVerificationData();
    // 4. Update the user record in the database
    await user_repository_1.userRepository.updateUser(user.id.toString(), user);
    return {
        message: "Email verified successfully",
    };
};
exports.verifyService = verifyService;
