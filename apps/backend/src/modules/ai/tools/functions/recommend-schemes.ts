import { schemeRepository } from "../../../../database/repository/scheme.repository";
import { AppError } from "../../../../Error/appError";
import { recommendSchemesService } from "../../../citizenDashboardData/recommend-schemes.service";
import { getUserProfileData } from "../../../citizenDashboardData/profile.service";
import { UserId } from "../../../../entity/user/userId";

export async function recommendSchemes(userId: string) {
  if (!userId) throw new AppError("Authentication required", 401);

  try {
    const userDomainId = new UserId(userId);
    const [profileData, allSchemes] = await Promise.all([
      getUserProfileData(userDomainId).catch(() => null),
      schemeRepository.findAllSchemesWithoutLimit()
    ]);

    if (!profileData) {
      return {
        message: "Please complete your profile.",
        recommendations: [],
        status: "PROFILE_INCOMPLETE"
      };
    }

    // ✅ Use central engine
    const result = await recommendSchemesService.getRecommendations(
      profileData,
      userDomainId,
      allSchemes
    );
    const recommendations = result.recommendations;

    if (!recommendations.length) {
      return {
        message: "No matching schemes found.",
        recommendations: []
      };
    }

    const topChoices = recommendations.slice(0, 5).map((s: any) => ({
      title: s.title,
      score: s.aiScore,
      category: s.category,
      ministry: s.ministry
    }));

    return {
      success: true,
      totalRecommended: recommendations.length,
      recommendations: topChoices,
      message: "Top personalized schemes for you."
    };

  } catch (error) {
    console.error("Recommend Tool Error:", error);
    throw new AppError("Failed to generate recommendations", 500);
  }
}