import { schemeRepository } from "../../../../database/repository/scheme.repository";
import { AppError } from "../../../../Error/appError";

type GetRequiredDocumentsInput = {
  schemeName?: string;
};

export async function getRequiredDocuments(
  input: GetRequiredDocumentsInput | string,
) {
  const schemeName = typeof input === "string" ? input : input?.schemeName;

  if (!schemeName || typeof schemeName !== "string" || !schemeName.trim()) {
    return {
      success: false,
      message: "A valid scheme name is required to fetch required documents.",
    };
  }

  const normalizedName = schemeName.trim();

  try {
    let scheme = await schemeRepository.findSchemeByName(normalizedName);
    let matchType: "EXACT" | "FUZZY" = "EXACT";

    if (!scheme) {
      const suggestion =
        await schemeRepository.findFuzzySchemeByName(normalizedName);

      if (suggestion && suggestion.score >= 70) {
        scheme = await schemeRepository.findSchemeByName(suggestion.schemeName);
        if (scheme) matchType = "FUZZY";
      }
    }

    if (!scheme) {
      return {
        success: false,
        message: `We couldn't find a scheme matching "${normalizedName}". Please verify the scheme name.`,
      };
    }

    const requiredDocuments = scheme.getDocumentsRequired();

    return {
      success: true,
      schemeTitle: scheme.getTitle(),
      requiredDocuments,
      ...(requiredDocuments.length === 0 && {
        message: "No required documents are listed for this scheme.",
      }),
      matchType,
    };
  } catch (error) {
    console.error("Get Required Documents Error:", error);

    if (error instanceof AppError) throw error;
    throw new AppError(
      "An error occurred while retrieving the required documents.",
      500,
    );
  }
}
