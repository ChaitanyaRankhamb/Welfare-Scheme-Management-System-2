"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerService = void 0;
const resend_1 = require("resend");
const user_repository_1 = require("../../../database/repository/user.repository");
const appError_1 = require("../../../Error/appError");
const AuthProvider_1 = require("../../../entity/user/AuthProvider");
const verificationCode_structure_1 = require("../../../utils/verificationCode.structure");
const generateVerifyCode_1 = require("../../../utils/generateVerifyCode");
const generateVerifyExpiry_1 = require("../../../utils/generateVerifyExpiry");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
const registerService = async (email, username) => {
    // check existing user
    const existingUser = await user_repository_1.userRepository.findUserByEmail(email);
    if (existingUser) {
        // if exist then check provider and link it
        // check email provider
        const hasEmailProvider = existingUser.hasProvider(AuthProvider_1.ProviderType.CREDENTIALS);
        // check google provider
        const hasGoogleProvider = existingUser.hasProvider(AuthProvider_1.ProviderType.GOOGLE);
        // if user already with same email
        if (hasEmailProvider) {
            throw new appError_1.AppError("User already exist", 400);
        }
        // if user exist with google account, just link this email credentials with account
        if (!hasEmailProvider && hasGoogleProvider) {
            // link user with credentials
            existingUser.addProvider(AuthProvider_1.AuthProvider.credentials(email));
            // update the user
            await user_repository_1.userRepository.updateUser(existingUser.id.toString(), existingUser);
        }
    }
    else {
        // create new user from scratch with credentials data
        // create random 6 digit number
        const verifyCode = await (0, generateVerifyCode_1.generateVerifyCode)();
        // apply the verification expiry (15 minutes)
        const verifyExpiry = await (0, generateVerifyExpiry_1.generateVerifyExpiry)();
        // add credentials as auth providers
        const authProvider = AuthProvider_1.AuthProvider.credentials(email);
        // prepare create new user data
        const userData = {
            email,
            username,
            verificationCode: verifyCode,
            verificationExpiry: verifyExpiry,
            providers: [authProvider],
        };
        const user = await user_repository_1.userRepository.createUser(userData);
        if (!user) {
            throw new appError_1.AppError("Error in user creation. Please try again!", 500);
        }
        // send email to user email with verification Code
        try {
            if (!user.isEmailVerified()) {
                await resend.emails.send({
                    from: "Walefare-Scheme Platform <onboarding@resend.dev>",
                    to: email,
                    subject: "Verify your account",
                    html: (0, verificationCode_structure_1.verificationEmailTemplate)(username, verifyCode),
                });
            }
        }
        catch (error) {
            console.error("Failed to send verification email:", error);
            // We don't necessarily want to fail the whole registration if email fails,
            // but in a strict system we might. For now, we'll just log it.
        }
    }
};
exports.registerService = registerService;
