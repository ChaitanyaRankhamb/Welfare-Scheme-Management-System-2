import { applicationRepository } from "../../../database/repository/application.repository";
import { userRepository } from "../../../database/repository/user.repository";
import type { ApplicationStatus } from "../../../entity/application/application.entity";
import { AppError } from "../../../reuse-components/AppError";

export const updateApplicationStatusService = async (
  userId: string,
  applicationId: string,
  status: ApplicationStatus,
) => {
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const adminUser = await userRepository.findUserById(userId);
  if (!adminUser || adminUser.getRole() !== "admin") {
    throw new AppError("Forbidden: Admin access required", 403);
  }

  const application =
    await applicationRepository.findApplicationById(applicationId);
  if (!application) {
    throw new AppError("Application not found", 404);
  }

  if (!["INITIATED", "APPLIED", "REJECTED"].includes(status)) {
    throw new AppError("Invalid application status", 400);
  }

  application.updateStatus(status);

  const updated = await applicationRepository.updateApplication(
    applicationId,
    application,
  );

  return {
    success: true,
    data: updated,
    message: "Application status updated successfully",
  };
};
