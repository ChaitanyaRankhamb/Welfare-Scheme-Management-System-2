import { Scheme } from '../../../entity/schemes/scheme.entity';
import { ProfileSnapshot } from '../../../entity/profile/profile.entity';

export interface RecommendedScheme {
  scheme: Scheme;
  score: number;
  matchReasons: string[];
}

export class RecommendSchemesService {
  /**
   * Generates a list of recommended schemes based on user profile
   */
  public getRecommendations(profile: ProfileSnapshot, allSchemes: Scheme[]): RecommendedScheme[] {
    return allSchemes
      .map(scheme => {
        const result = this.calculateMatch(profile, scheme);
        return {
          scheme,
          score: result.score,
          matchReasons: result.reasons
        };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);
  }

  private calculateMatch(profile: ProfileSnapshot, scheme: Scheme): { score: number; reasons: string[] } {
    const criteria = scheme.getEligibility();
    let score = 0;
    const reasons: string[] = [];

    // --- HARD FILTERS ---

    // 1. Employment Status (MANDATORY HARD FILTER)
    const allowedStatuses = criteria.employment.employmentStatus;
    if (!allowedStatuses.includes(profile.employmentStatus as any)) {
      return { score: 0, reasons: [] };
    }

    // 2. Age Filter (Hard)
    if (criteria.age) {
      const userAge = this.calculateAge(profile.dateOfBirth);
      if (criteria.age.min && userAge < criteria.age.min) return { score: 0, reasons: [] };
      if (criteria.age.max && userAge > criteria.age.max) return { score: 0, reasons: [] };
    }

    // 3. Location Filter (State Match)
    const states = criteria.location?.states || [];
    if (states.length > 0 && profile.state && !states.includes(profile.state)) {
      return { score: 0, reasons: [] };
    }

    // --- SCORING ---

    // 1. Employment Match (High Weight: 25)
    // Since we passed the hard filter, we give a base high score for employment match
    score += 25;
    reasons.push(`Matches target audience: ${profile.employmentStatus}`);

    // 2. Income Match (High Weight: 20)
    if (criteria.income) {
      if (profile.annualIncome <= (criteria.income.max || Infinity) && 
          profile.annualIncome >= (criteria.income.min || 0)) {
        score += 20;
        reasons.push('Meets income eligibility criteria');
      } else {
        // If there's an income criteria and user doesn't meet it, we might want to hard filter
        // but user only asked for scoring logic for income.
        // Actually, usually income is a hard filter too.
        return { score: 0, reasons: [] }; 
      }
    }

    // 3. Category Match (Weight: 15)
    const category = scheme.getCategory().toLowerCase();
    if (profile.occupationType && category.includes(profile.occupationType.toLowerCase())) {
      score += 15;
      reasons.push(`Relevant to your occupation: ${profile.occupationType}`);
    }

    // 4. Caste/Social Match (Weight: 10)
    if (criteria.social) {
      if (criteria.social.caste?.includes(profile.casteCategory)) {
        score += 10;
        reasons.push(`Specifically for ${profile.casteCategory} category`);
      }
      if (criteria.social.minority && profile.religion !== 'Hindu') {
        score += 10;
        reasons.push('Minority welfare benefit');
      }
    }

    return { score, reasons };
  }

  private calculateAge(dob: Date): number {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}

export const recommendSchemesService = new RecommendSchemesService();
