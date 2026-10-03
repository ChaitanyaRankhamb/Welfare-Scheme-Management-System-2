import { schemeRepository } from "../../../../database/repository/scheme.repository";
import { AppError } from "../../../../Error/appError";
import { compareTwoStrings } from "string-similarity";

/**
 * Provides a side-by-side comparison between multiple welfare schemes.
 */
export async function compareSchemes(schemeNames: string[]) {
  // 1. Validation
  if (!Array.isArray(schemeNames) || schemeNames.length < 2) {
    return {
      success: false,
      message: "At least two scheme names are required for a comparison.",
    };
  }

  // Cap the number of schemes to prevent UI clutter
  const limitedNames = schemeNames.slice(0, 4);

  try {
    const allSchemes = await schemeRepository.findAllSchemesWithoutLimit();

    // 2. Fetch matching schemes using multi-tiered search strategies
    const fetchPromises = limitedNames.map(async (name) => {
      const normalized = name.trim().toLowerCase();

      // Strategy A: Direct exact/case-insensitive title match
      let scheme = await schemeRepository.findSchemeByName(name.trim());

      // Strategy B: Substring match in titles
      if (!scheme && allSchemes.length > 0) {
        scheme = allSchemes.find(
          (s) =>
            s.getTitle().toLowerCase().includes(normalized) ||
            normalized.includes(s.getTitle().toLowerCase())
        ) || null;
      }

      // Strategy C: Search by keywords
      if (!scheme) {
        const keywordMatches = await schemeRepository.searchByKeywords([name.trim()]);
        if (keywordMatches.length > 0) {
          scheme = keywordMatches[0];
        }
      }

      // Strategy D: Fuzzy similarity match fallback
      if (!scheme && allSchemes.length > 0) {
        let bestMatch = null;
        let bestScore = 0;
        for (const s of allSchemes) {
          const score = compareTwoStrings(normalized, s.getTitle().toLowerCase()) * 100;
          if (score > bestScore) {
            bestScore = score;
            bestMatch = s;
          }
        }
        if (bestMatch && bestScore >= 25) {
          scheme = bestMatch;
        }
      }

      return { requestedName: name, scheme };
    });

    const results = await Promise.all(fetchPromises);
    const validSchemes = results
      .filter((r) => r.scheme !== null)
      .map((r) => r.scheme!);
    const missingNames = results
      .filter((r) => r.scheme === null)
      .map((r) => r.requestedName);

    if (validSchemes.length < 2) {
      return {
        success: false,
        message: `Could not find enough matching schemes to perform a comparison. Found ${validSchemes.length} matching scheme(s).`,
        found: validSchemes.length,
        foundSchemes: validSchemes.map((s) => s.getTitle()),
        missing: missingNames,
      };
    }

    // 3. Build Comparison Data
    const comparisonData = validSchemes.map((s) => {
      const eligibility = s.getEligibility();

      return {
        id: s.id.toString(),
        title: s.getTitle(),
        ministry: s.getMinistry(),
        category: s.getCategory(),
        description: s.getDescription(),
        benefitHighlights: s.getBenefits(),
        eligibilityRules: {
          age: `${eligibility.age.min} to ${eligibility.age.max} years`,
          annualIncome:
            eligibility.income.max > 9999999
              ? "No upper limit"
              : `Up to ₹${eligibility.income.max.toLocaleString("en-IN")}`,
          gender:
            eligibility.gender === "any" ? "All Genders" : eligibility.gender,
          employment:
            eligibility.employment.employmentStatus && eligibility.employment.employmentStatus.length > 0
              ? eligibility.employment.employmentStatus.join(", ")
              : "All backgrounds",
          caste: eligibility.social.caste && eligibility.social.caste.length > 0 ? eligibility.social.caste.join(", ") : "All categories",
        },
        documentsRequired: s.getDocumentsRequired(),
        applicationUrl: s.getApplicationUrl(),
        tags: s.getTags(),
      };
    });

    return {
      success: true,
      comparedCount: validSchemes.length,
      data: comparisonData,
      skipped: missingNames,
      summary: `Successfully generated comparison data for ${validSchemes.length} schemes: ${validSchemes.map((s) => s.getTitle()).join(", ")}.`,
    };
  } catch (error) {
    console.error("Compare Schemes Error:", error);

    if (error instanceof AppError) throw error;
    throw new AppError(
      "An error occurred while generating the scheme comparison.",
      500,
    );
  }
}

