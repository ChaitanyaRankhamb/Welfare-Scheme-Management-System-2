import { UnrecoverableError } from "bullmq";
import { novu } from "../../../config/novu.config";
import { userRepository } from "../../../database/repository/user.repository";
import { VerifyOtpNotificationJobData } from "./verifyOtpNotification.queue";

export const sendVerifyOtpNotification = async ({
  userId,
}: VerifyOtpNotificationJobData) => {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new UnrecoverableError(
      `User ${userId} no longer exists; verification email cannot be sent.`,
    );
  }

  if (user.isEmailVerified()) {
    throw new UnrecoverableError(
      `User ${userId} is already verified; verification email is not needed.`,
    );
  }

  const verificationCode = user.getVerificationCode();
  const verificationExpiry = user.getVerificationExpiry();
  if (
    verificationCode === undefined ||
    !verificationExpiry ||
    verificationExpiry.getTime() <= Date.now()
  ) {
    throw new UnrecoverableError(
      `User ${userId} has no current unexpired verification code.`,
    );
  }

  if (!user.getEmail()) {
    throw new UnrecoverableError(
      `User ${userId} does not have an email address; verification email cannot be sent.`,
    );
  }

  if (!novu) {
    throw new UnrecoverableError(
      "Novu is not configured; verification email cannot be sent.",
    );
  }

  const workflowId = process.env.NOVU_VERIFY_OTP_WORKFLOW_ID || "verify-otp";

  try {
    await novu.trigger({
      workflowId,
      to: {
        subscriberId: user.id.toString(),
        email: user.getEmail(),
        firstName: user.getUsername() || "User",
      },
      payload: {
        username: user.getUsername() || "User",
        verificationCode: String(verificationCode).padStart(6, "0"),
        expiryMinutes: Math.max(
          1,
          Math.ceil((verificationExpiry.getTime() - Date.now()) / 60000),
        ),
      },
    });
  } catch (error: any) {
    const statusCode = error?.status || error?.statusCode;
    if (statusCode >= 400 && statusCode < 500 && statusCode !== 429) {
      throw new UnrecoverableError(
        `Permanent Novu verification email error for user ${userId}: ${error.message || error}`,
      );
    }
    throw error;
  }
};
