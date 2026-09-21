import { Scheme } from "../../entity/schemes/scheme.entity";
import { ProfileServiceResponseType } from "./profile.service";

export const ruleBasedFilterationService = async (
  profileData: ProfileServiceResponseType,
  allSchemes: Scheme[]
) => {
  return allSchemes.filter((scheme) => {
    if (scheme.getStatus() !== "published") return false;

    const e = scheme.getEligibility();

    // Age
    if (e.age) {
      if (profileData.age < e.age.min || profileData.age > e.age.max) {
        return false;
      }
    }

    // Income
    if (e.income) {
      if (
        profileData.annualIncome < e.income.min ||
        profileData.annualIncome > e.income.max
      ) {
        return false;
      }
    }

    // Gender
    const profileGender = (profileData.gender || "").toLowerCase();
    const schemeGender = e.gender?.toLowerCase() || "any";
    if (schemeGender !== "any" && schemeGender !== profileGender) {
      console.log(`[filter] gender fail for ${scheme.getTitle()}: expected ${schemeGender}, got ${profileGender}`);
      return false;
    }

    // State
    if (e.location.states.length > 0) {
      if (!profileData.location.state) {
        console.log(`[filter] state mission for ${scheme.getTitle()}`);
        return false;
      }
      const pState = profileData.location.state.toLowerCase();
      const hasState = e.location.states.some(
        (s) => s.toLowerCase() === pState
      );
      if (!hasState) {
        console.log(`[filter] state fail for ${scheme.getTitle()}: user in ${pState}, scheme in ${e.location.states}`);
        return false;
      }
    }

    // Rural / Urban
    const pAreaType = profileData.location.areaType?.toLowerCase();
    if (e.location.ruralOnly && pAreaType !== "rural") {
      console.log(`[filter] ruralOnly fail for ${scheme.getTitle()}: user is ${pAreaType}`);
      return false;
    }
    if (e.location.urbanOnly && pAreaType !== "urban") {
      console.log(`[filter] urbanOnly fail for ${scheme.getTitle()}: user is ${pAreaType}`);
      return false;
    }

    // Caste
    if (e.social.caste.length > 0) {
      const pCaste = (profileData.casteCategory || "").toLowerCase();
      // Map ews to general since ews is a subcategory of general
      const normalizedCaste = pCaste === 'ews' ? 'general' : pCaste;
      
      const hasCaste = e.social.caste.some(
        (c) => c.toLowerCase() === pCaste || c.toLowerCase() === normalizedCaste
      );
      if (!hasCaste) {
        console.log(`[filter] caste fail for ${scheme.getTitle()}: user is ${pCaste}, scheme wants ${e.social.caste}`);
        return false;
      }
    }

    // Religion
    if (e.social.religion.length > 0) {
      const pReligion = (profileData.religion || "").toLowerCase();
      const hasReligion = e.social.religion.some(
        (r) => r.toLowerCase() === pReligion
      );
      if (!hasReligion) {
        console.log(`[filter] religion fail for ${scheme.getTitle()}: user is ${pReligion}, scheme wants ${e.social.religion}`);
        return false;
      }
    }

    // Employment (FIXED)
    if (e.employment.employmentStatus.length > 0) {
      const pStatus = (profileData.employmentStatus || "").toLowerCase();
      const pOccupation = (profileData.occupationType || "").toLowerCase();
      
      const hasStatus = e.employment.employmentStatus.some(
        (s) => s.toLowerCase() === pStatus || s.toLowerCase() === pOccupation
      );
      if (!hasStatus) {
        console.log(`[filter] employment fail for ${scheme.getTitle()}: expected ${e.employment.employmentStatus}, got status=${pStatus}, occ=${pOccupation}`);
        return false;
      }
    }

    return true;
  });
};