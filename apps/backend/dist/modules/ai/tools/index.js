"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiToolFunctions = exports.aiTools = void 0;
// FUNCTIONS (MOCK/STUBS)
const get_scheme_details_1 = require("./functions/get-scheme-details");
const search_schemes_1 = require("./functions/search-schemes");
const check_eligibility_1 = require("./functions/check-eligibility");
const get_application_steps_1 = require("./functions/get-application-steps");
const recommend_schemes_1 = require("./functions/recommend-schemes");
const get_all_applications_status_1 = require("./functions/get-all-applications-status");
const compare_schemes_1 = require("./functions/compare-schemes");
// DEFINITIONS (JSON SCHEMAS)
const get_scheme_details_2 = require("./definitions/get-scheme-details");
const get_eligible_schemes_1 = require("./definitions/get-eligible-schemes");
const search_schemes_2 = require("./definitions/search-schemes");
const check_eligibility_2 = require("./definitions/check-eligibility");
const get_application_steps_2 = require("./definitions/get-application-steps");
const get_application_status_1 = require("./definitions/get-application-status");
const compare_schemes_2 = require("./definitions/compare-schemes");
const recommend_schemes_2 = require("./definitions/recommend-schemes");
const get_all_applications_status_2 = require("./definitions/get-all-applications-status");
const get_application_status_2 = require("./functions/get-application-status");
const get_eligible_schemes_2 = require("./functions/get-eligible-schemes");
/**
 * AI Tool Definitions for LLM (OpenAI Format)
 */
exports.aiTools = [
    get_scheme_details_2.getSchemeDetailsDefinition,
    get_eligible_schemes_1.getEligibleSchemesDefinition,
    search_schemes_2.searchSchemesDefinition,
    check_eligibility_2.checkEligibilityForSchemeDefinition,
    get_application_steps_2.getApplicationStepsDefinition,
    get_application_status_1.getApplicationStatusDefinition,
    compare_schemes_2.compareSchemesDefinition,
    recommend_schemes_2.recommendSchemesDefinition,
    get_all_applications_status_2.getAllApplicationStatusesDefinition
];
/**
 * Map of tool names to their implementation functions
 */
exports.aiToolFunctions = {
    getSchemeDetails: get_scheme_details_1.getSchemeDetails,
    searchSchemes: search_schemes_1.searchSchemes,
    checkEligibilityForScheme: check_eligibility_1.checkEligibilityForScheme,
    getApplicationSteps: get_application_steps_1.getApplicationSteps,
    getApplicationStatus: get_application_status_2.getApplicationStatus,
    getEligibleSchemes: get_eligible_schemes_2.getEligibleSchemes,
    compareSchemes: compare_schemes_1.compareSchemes,
    recommendSchemes: recommend_schemes_1.recommendSchemes,
    getAllApplicationStatuses: get_all_applications_status_1.getAllApplicationsStatus
};
