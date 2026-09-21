import redisClient from "../../config/redis.connection";
import { userRepository } from "../../database/repository/user.repository";
import { UserId } from "../../entity/user/userId";
import { AppError } from "../../Error/appError";
import { aiFilterationService } from "./ai-filteration.service";
import { getUserProfileData } from "./profile.service";
import { applicationRepository } from "../../database/repository/application.repository";
import { schemeRepository } from "../../database/repository/scheme.repository";
import { ruleBasedFilterationService } from "./rule-based-filteration.service";
import { recommendSchemesService } from "./recommend-schemes.service";

const cache_TTL = 60 * 60 * 24; // 1 day

export const citizenDataService = async (userId: UserId) => {
  try {
    // check user and it's role
    const user = await userRepository.findUserById(userId.toString());
    if (!user) {
      throw new AppError("User not found", 404);
    }
    if (user.getRole() !== "citizen") {
      throw new AppError("User is not a citizen", 400);
    }

    // check if user has already logged in
    const cacheKey = `schemes:${userId.toString()}`;

    try {
      const cached = await redisClient.get(cacheKey);

      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          console.log("cache parsed data", parsed);
          return {
            fromCache: true,
            ...parsed,
          };
        } catch (error) {
          console.warn("[redis] cache is currupted, deleting it");
          redisClient.del(cacheKey);
        }
      }
    } catch {
      console.warn("[redis] is failed, continuing with normal flow");
    }

    // call the profile data service
    const allSchemes = await schemeRepository.findAllSchemesWithoutLimit();
    const profileData = await getUserProfileData(userId);
    let filteredSchemes: any[] = [];
    let recommendations: any[] = [];
    let profileHealthScore = 0;

    if (profileData) {
      console.log("Profile used for filtering:", profileData);
      const result = await recommendSchemesService.getRecommendations(
        profileData,
        userId,
        allSchemes,
      );
      filteredSchemes = result.filteredSchemes || [];
      recommendations = result.recommendations || [];

      const fields = [
        profileData.age,
        profileData.gender,
        profileData.annualIncome,
        profileData.location?.state,
        profileData.employmentStatus,
        profileData.casteCategory,
        profileData.religion,
      ];
      const filledCount = fields.filter(
        (f) => f !== undefined && f !== null && f !== "" && f !== 0,
      ).length;
      profileHealthScore = Math.round((filledCount / fields.length) * 100);
    } else {
      console.log(
        "No profile data found for user. Returning empty/unfilled profile dashboard data.",
      );
    }

    // Fetch application data
    const { applications } =
      await applicationRepository.findApplicationsByUserId(
        userId.toString(),
        false,
      );

    // Categorize applications
    const categorizedApps = {
      applied: [] as any[],
      approved: [] as any[],
      rejected: [] as any[],
      inProgress: [] as any[],
    };

    for (const app of applications) {
      const scheme = await schemeRepository.findSchemeById(
        app.getSchemeId().toString(),
      );
      const appData = {
        id: app.id.toString(),
        schemeName: scheme?.getTitle() || "Unknown Scheme",
        status: app.getStatus() === "APPLIED" ? "Applied" : "Initiated",
        date: app.getCreatedAt().toISOString().split("T")[0],
      };

      if (app.getStatus() === "APPLIED") {
        categorizedApps.applied.push(appData);
      } else {
        categorizedApps.inProgress.push(appData);
      }
    }

    const responseData = {
      summary: {
        totalSchemes: allSchemes.map((s) => ({
          id: s.id.toString(),
          title: s.getTitle(),
          category: s.getCategory(),
          description: s.getDescription(),
          ministry: s.getMinistry(),
          state: "National",
          eligibility: s.getEligibility(),
          benefits: s.getBenefits(),
          applicationLink: s.getApplicationUrl(),
          trackingMeta: s.getTrackingMeta(),
        })),
        totalMatchedSchemes: filteredSchemes.length,
        totalApplications: applications.length,
        totalApproved: 0, // Not yet tracked in schema
        profileHealthScore,
      },
      matchedSchemes: filteredSchemes.map((s: any) => ({
        id: s.id.toString(),
        title: s.getTitle(),
        category: s.getCategory(),
        state: "National", // Or fetch from eligibility
        description: s.getDescription(),
      })),
      applications: categorizedApps,
      recommendations: {
        schemes: recommendations.slice(0, 10).map((s: any) => ({
          ...s,
          matchReason: "AI Score: " + s.aiScore + "%",
        })),
        applications: [],
      },
    };

    console.log("Response data to be sent:", {
      summary: responseData.summary,
      matchedCount: responseData.matchedSchemes.length,
      recommendationsCount: responseData.recommendations.schemes.length,
    });

    // Redis Write
    try {
      await redisClient.set(cacheKey, JSON.stringify(responseData), {
        EX: cache_TTL,
      });
    } catch (error) {
      console.warn("[redis] write failed", error);
    }

    console.log("response data", responseData);

    return {
      fromCache: false,
      ...responseData,
    };
  } catch (error) {
    throw error;
  }
};
