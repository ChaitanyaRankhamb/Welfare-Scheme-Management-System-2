"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEligibilityForScheme = checkEligibilityForScheme;
const scheme_repository_1 = require("../../../../database/repository/scheme.repository");
const appError_1 = require("../../../../Error/appError");
const profile_service_1 = require("../../../citizenDashboardData/profile.service");
async function compareEligibility(eligibilityData, profileData) {
    const eligible = [];
    const nonEligible = [];
    const addResult = (field, isMet, criteriaValue, userValue, successReason, failReason) => {
        const item = {
            field,
            status: isMet ? "eligible" : "non-eligible",
            criteriaValue,
            userValue,
            reason: isMet ? successReason : failReason,
        };
        if (isMet)
            eligible.push(item);
        else
            nonEligible.push(item);
    };
    // 1. Age
    const ageMet = profileData.age >= eligibilityData.age.min && profileData.age <= eligibilityData.age.max;
    addResult("Age", ageMet, `${eligibilityData.age.min} - ${eligibilityData.age.max} years`, `${profileData.age} years`, `Age ${profileData.age} is within the required range.`, `Required age range is ${eligibilityData.age.min}-${eligibilityData.age.max}, but you are ${profileData.age}.`);
    // 2. Income
    const incomeMet = profileData.annualIncome >= eligibilityData.income.min && profileData.annualIncome <= eligibilityData.income.max;
    addResult("Annual Income", incomeMet, `₹${eligibilityData.income.min} - ₹${eligibilityData.income.max}`, `₹${profileData.annualIncome}`, `Income ₹${profileData.annualIncome} meets the eligibility threshold.`, `Income limit is ₹${eligibilityData.income.max}, but your income is ₹${profileData.annualIncome}.`);
    // 3. Gender
    const schemeGender = eligibilityData.gender.toLowerCase();
    const profileGender = profileData.gender.toLowerCase();
    const genderMet = schemeGender === "any" || schemeGender === profileGender;
    addResult("Gender", genderMet, eligibilityData.gender, profileData.gender, `Gender requirement met.`, `This scheme is specifically for ${eligibilityData.gender}, but your profile says ${profileData.gender}.`);
    // 4. Employment
    const pStatus = profileData.employmentStatus.toLowerCase();
    const employmentMet = eligibilityData.employment.employmentStatus.some((s) => s.toLowerCase() === pStatus);
    addResult("Employment Status", employmentMet, eligibilityData.employment.employmentStatus.join(", "), profileData.employmentStatus, `Employment condition met.`, `Scheme is for ${eligibilityData.employment.employmentStatus.join(", ")}, but your status is ${profileData.employmentStatus}.`);
    // 5. State
    if (eligibilityData.location.states.length > 0) {
        const pState = profileData.location.state?.toLowerCase();
        const stateMet = pState ? eligibilityData.location.states.some(s => s.toLowerCase() === pState) : false;
        addResult("State Residency", stateMet, eligibilityData.location.states.join(", "), profileData.location.state || "Not Provided", `State residency requirement met.`, `Residency in ${eligibilityData.location.states.join(", ")} required.`);
    }
    // 6. Caste
    if (eligibilityData.social.caste.length > 0) {
        const pCaste = profileData.casteCategory.toLowerCase();
        const casteMet = eligibilityData.social.caste.some(c => c.toLowerCase() === pCaste);
        addResult("Caste Category", casteMet, eligibilityData.social.caste.join(", "), profileData.casteCategory, `Category requirement met.`, `Scheme is for ${eligibilityData.social.caste.join(", ")}, but you fall under ${profileData.casteCategory}.`);
    }
    return { eligible, nonEligible };
}
async function checkEligibilityForScheme(schemeName, userId) {
    if (!userId) {
        throw new appError_1.AppError("User is not Authenticated", 401);
    }
    if (!schemeName || typeof schemeName !== "string" || !schemeName.trim()) {
        return {
            success: false,
            message: "Scheme name is required",
        };
    }
    const normalizedSchemeName = schemeName.trim().toLocaleLowerCase();
    const scheme = await scheme_repository_1.schemeRepository.findSchemeByName(normalizedSchemeName);
    if (!scheme) {
        return {
            success: false,
            message: `Scheme "${schemeName}" not found.`,
        };
    }
    // get user profile data
    const profileData = await (0, profile_service_1.getUserProfileData)(userId);
    if (!profileData) {
        return {
            success: false,
            status: "PROFILE_INCOMPLETE",
            message: "Please complete your profile to check eligibility",
            schemes: []
        };
    }
    // get eligibility data
    const eligibilityData = scheme.getEligibility();
    // compare eligibility data with user profile data
    const result = await compareEligibility(eligibilityData, profileData);
    const isEligible = result.nonEligible.length === 0;
    return {
        success: true,
        schemeTitle: scheme.getTitle(),
        isEligible,
        breakdown: {
            eligible: result.eligible,
            nonEligible: result.nonEligible
        },
        summary: isEligible
            ? `Congratulations! You are eligible for the ${scheme.getTitle()}.`
            : `You are currently ineligible for ${scheme.getTitle()} due to ${result.nonEligible.length} unmet criteria.`
    };
}
