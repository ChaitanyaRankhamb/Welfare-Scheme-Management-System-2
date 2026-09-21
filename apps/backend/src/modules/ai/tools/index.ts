// FUNCTIONS (MOCK/STUBS)
import { getSchemeDetails } from "./functions/get-scheme-details";
import { searchSchemes } from "./functions/search-schemes";
import { checkEligibilityForScheme } from "./functions/check-eligibility";
import { getApplicationSteps } from "./functions/get-application-steps";

import { recommendSchemes } from "./functions/recommend-schemes";
import { getAllApplicationsStatus } from "./functions/get-all-applications-status";
import { compareSchemes } from "./functions/compare-schemes";

// DEFINITIONS (JSON SCHEMAS)
import { getSchemeDetailsDefinition } from "./definitions/get-scheme-details";
import { getEligibleSchemesDefinition } from "./definitions/get-eligible-schemes";
import { searchSchemesDefinition } from "./definitions/search-schemes";
import { checkEligibilityForSchemeDefinition } from "./definitions/check-eligibility";
import { getApplicationStepsDefinition } from "./definitions/get-application-steps";
import { getApplicationStatusDefinition } from "./definitions/get-application-status";
import { compareSchemesDefinition } from "./definitions/compare-schemes";
import { recommendSchemesDefinition } from "./definitions/recommend-schemes";
import { getAllApplicationStatusesDefinition } from "./definitions/get-all-applications-status";
import { getApplicationStatus } from "./functions/get-application-status";
import { getEligibleSchemes } from "./functions/get-eligible-schemes";

/**
 * AI Tool Definitions for LLM (OpenAI Format)
 */
export const aiTools = [
  getSchemeDetailsDefinition,
  getEligibleSchemesDefinition,
  searchSchemesDefinition,
  checkEligibilityForSchemeDefinition,
  getApplicationStepsDefinition,
  getApplicationStatusDefinition,
  compareSchemesDefinition,
  recommendSchemesDefinition,
  getAllApplicationStatusesDefinition
];

/**
 * Map of tool names to their implementation functions
 */
export const aiToolFunctions = {
  getSchemeDetails,
  searchSchemes,
  checkEligibilityForScheme,
  getApplicationSteps,
  getApplicationStatus,
  getEligibleSchemes,
  compareSchemes,
  recommendSchemes,
  getAllApplicationStatuses: getAllApplicationsStatus
};