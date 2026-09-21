import { Resend } from "resend";
import { userRepository } from "../../../database/repository/user.repository";
import { AppError } from "../../../Error/appError";
import { AuthProvider, ProviderType } from "../../../entity/user/AuthProvider";
import { verificationEmailTemplate } from "../../../utils/verificationCode.structure";
import { generateVerifyCode } from "../../../utils/generateVerifyCode";
import { generateVerifyExpiry } from "../../../utils/generateVerifyExpiry";
import { CreateUserData } from "../../../repository/user.repository";

const resend = new Resend(process.env.RESEND_API_KEY);

export const registerService = async (email: string, username: string) => {
  // check existing user
  const existingUser = await userRepository.findUserByEmail(email);

  if (existingUser) {
    // if exist then check provider and link it
    // check email provider
    const hasEmailProvider = existingUser.hasProvider(ProviderType.CREDENTIALS);

    // check google provider
    const hasGoogleProvider = existingUser.hasProvider(ProviderType.GOOGLE);

    // if user already with same email
    if (hasEmailProvider) {
      throw new AppError("User already exist", 400);
    }

    // if user exist with google account, just link this email credentials with account
    if (!hasEmailProvider && hasGoogleProvider) {
      // link user with credentials
      existingUser.addProvider(AuthProvider.credentials(email));

      // update the user
      await userRepository.updateUser(existingUser.id.toString(), existingUser);
    }
  } else {
    // create new user from scratch with credentials data

    // create random 6 digit number
    const verifyCode = await generateVerifyCode();

    // apply the verification expiry (15 minutes)
    const verifyExpiry = await generateVerifyExpiry();

    // add credentials as auth providers
    const authProvider = AuthProvider.credentials(email);

    // prepare create new user data
    const userData: CreateUserData = {
      email,
      username,
      verificationCode: verifyCode,
      verificationExpiry: verifyExpiry,
      providers: [authProvider],
    };

    const user = await userRepository.createUser(userData);

    if (!user) {
      throw new AppError("Error in user creation. Please try again!", 500);
    }

    // send email to user email with verification Code
    try {
      if (!user.isEmailVerified()) {
        await resend.emails.send({
          from: "Walefare-Scheme Platform <onboarding@resend.dev>",
          to: email,
          subject: "Verify your account",
          html: verificationEmailTemplate(username, verifyCode),
        });
      }
    } catch (error) {
      console.error("Failed to send verification email:", error);
      // We don't necessarily want to fail the whole registration if email fails,
      // but in a strict system we might. For now, we'll just log it.
    }
  }
};
