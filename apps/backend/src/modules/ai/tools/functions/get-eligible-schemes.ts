import { profileRepository } from "../../../../database/repository/profile.repository";
import { schemeRepository } from "../../../../database/repository/scheme.repository";
import { UserId } from "../../../../entity/user/userId";
import { AppError } from "../../../../Error/appError";
import { getUserProfileData } from "../../../citizenDashboardData/profile.service";
import { ruleBasedFilterationService } from "../../../citizenDashboardData/rule-based-filteration.service";

export async function getEligibleSchemes(userIdStr: string, args?: any) {
  if (!userIdStr) {
    throw new AppError("User ID is required", 400);
  }
  const userId = new UserId(userIdStr);
  // get all schemes
  const allSchemes = await schemeRepository.findAllSchemesWithoutLimit();

  if (!allSchemes || allSchemes.length === 0) {
    return {
      success: true,
      totalEligible: 0,
      schemes: [],
      message: "No schemes available"
    };
  }

  // get profile data
  const profileData = await getUserProfileData(userId);

  if (!profileData) {
    return {
      success: false,
      status: "PROFILE_INCOMPLETE",
      message: "Please complete your profile to check eligibility",
      schemes: []
    };
  }

  // apply rule based filteration
  const filteredSchemes = await ruleBasedFilterationService(profileData, allSchemes);

  return {
    success: true,
    totalEligible: filteredSchemes.length,
    schemes: filteredSchemes,
    message: filteredSchemes.length
      ? "Eligible schemes fetched successfully"
      : "No eligible schemes found"
  };

}
