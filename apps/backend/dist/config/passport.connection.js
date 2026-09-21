"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const user_repository_1 = require("../database/repository/user.repository");
const AuthProvider_1 = require("../entity/user/AuthProvider");
const appError_1 = require("../Error/appError");
dotenv_1.default.config({
    path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});
// registered google strategy in passport
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:6001/auth/google/callback",
}, async (_accessToken, _refreshToken, profile, cb) => {
    try {
        // extract email from profile
        const email = profile.emails?.[0].value;
        if (!email) {
            return cb(new appError_1.AppError("No email found in google profile", 500));
        }
        // check user already exist with google provider ID
        let user = await user_repository_1.userRepository.findByProvider("google", profile.id);
        if (!user) {
            // find user with email
            user = await user_repository_1.userRepository.findUserByEmail(email);
            // if user exist with google email, check if google provider is linked
            if (user) {
                if (!user.hasProvider(AuthProvider_1.ProviderType.GOOGLE)) {
                    user.addProvider(AuthProvider_1.AuthProvider.google(profile.id));
                    await user_repository_1.userRepository.updateUser(user.id.toString(), user);
                }
            }
            else {
                // if not, create a new user
                user = await user_repository_1.userRepository.createUser({
                    email,
                    username: profile.displayName,
                    avatar: profile.photos?.[0]?.value,
                    emailVerified: true,
                    providers: [AuthProvider_1.AuthProvider.google(profile.id)],
                });
            }
        }
        // send user to google callback
        return cb(null, user);
    }
    catch (error) {
        return cb(error);
    }
}));
exports.default = passport_1.default;
