"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendService = void 0;
const resend_1 = require("resend");
const user_repository_1 = require("../../database/repository/user.repository");
const appError_1 = require("../../Error/appError");
const verificationCode_structure_1 = require("../../utils/verificationCode.structure");
const generateVerifyExpiry_1 = require("../../utils/generateVerifyExpiry");
const generateVerifyCode_1 = require("../../utils/generateVerifyCode");
// Initializing Resend with the API key from environment variables
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
const resendService = async (email) => {
    // 1. Find user by email
    const user = await user_repository_1.userRepository.findUserByEmail(email);
    if (!user) {
        throw new appError_1.AppError("User not found", 404);
    }
    // 2. Check if user is already verified
    if (user.isEmailVerified()) {
        throw new appError_1.AppError("Email is already verified", 400);
    }
    // 3. Generate a new verification code and expiry
    // generate random 6 digit number
    const verifyCode = await (0, generateVerifyCode_1.generateVerifyCode)();
    // apply the verification expiry (15 minutes)
    const verifyExpiry = await (0, generateVerifyExpiry_1.generateVerifyExpiry)();
    // 4. Update the user entity with new verification data
    user.setVerification(verifyCode, verifyExpiry);
    // 5. Update the user record in the database
    await user_repository_1.userRepository.updateUser(user.id.toString(), user);
    // 6. Send the verification email using Resend
    try {
        await resend.emails.send({
            from: "Welfare-Scheme Platform <onboarding@resend.dev>",
            to: email,
            subject: "Your new verification code",
            html: (0, verificationCode_structure_1.verificationEmailTemplate)(user.getUsername() || "User", verifyCode),
        });
    }
    catch (error) {
        console.error("Failed to resend verification email:", error);
        // Even if email fails, we don't necessarily want to crash the whole process
        // But we should notify that email failed
        throw new appError_1.AppError("Failed to send verification email. Please try again.", 500);
    }
    return {
        message: "A new verification code has been sent to your email",
    };
};
exports.resendService = resendService;
