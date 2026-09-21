import { schemeRepository } from "../../database/repository/scheme.repository";
import { UserId } from "../../entity/user/userId";
import { ProfileServiceResponseType } from "./profile.service";
import { ruleBasedFilterationService } from "./rule-based-filteration.service";
import { aiFilterationService } from "./ai-filteration.service";

export const recommendSchemesService = {
  async getRecommendations(
    profile: ProfileServiceResponseType,
    userId: UserId,
    allSchemes?: any[]
  ) {
    // 1. Use passed schemes OR fetch once
    const schemes = allSchemes ?? await schemeRepository.findAllSchemesWithoutLimit();

    // 2. Rule-based filtering (PASS schemes to avoid duplicate DB call)
    const filteredSchemes = await ruleBasedFilterationService(profile, schemes);

    if (!filteredSchemes.length) {
      return {
        filteredSchemes: [],
        recommendations: []
      };
    }

    // 3. AI scoring
    const scoredSchemes = await aiFilterationService(
      userId,
      filteredSchemes,
      profile
    );

    // 4. Final sort
    scoredSchemes.sort((a, b) => b.aiScore - a.aiScore);

    return {
      filteredSchemes,
      recommendations: scoredSchemes
    };
  }
};