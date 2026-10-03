import { userRepository } from "../../database/repository/user.repository";
import { profileRepository } from "../../database/repository/profile.repository";
import { schemeRepository } from "../../database/repository/scheme.repository";
import { Scheme } from "../../entity/schemes/scheme.entity";
import { sendNotificationQueue } from "../notifications/scheme-notifications/notification.queue";
import { SchemeId } from "../../entity/schemes/schemeId";
import { UnrecoverableError } from "bullmq";

const PAGE_SIZE = 20;

const calculateAge = (dateOfBirth: Date): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

const safeEquals = (a?: string, b?: string): boolean =>
  Boolean(a && b && a.trim().toLowerCase() === b.trim().toLowerCase());

const matchesSchemeEligibility = (
  scheme: Scheme,
  profile: Awaited<ReturnType<typeof profileRepository.findProfileByUserId>>
): boolean => {
  if (!profile) return false;

  const data = profile.getSnapshot();
  const criteria = scheme.getEligibility();

  if (!data.dateOfBirth) return false;
  const age = calculateAge(data.dateOfBirth);
  if (age < criteria.age.min || age > criteria.age.max) return false;

  const income = data.annualIncome ?? 0;
  if (income < criteria.income.min || income > criteria.income.max) return false;

  const gender = (data.gender || "").toLowerCase();
  if (criteria.gender !== "any" && criteria.gender.toLowerCase() !== gender) {
    return false;
  }

  const location = criteria.location;
  if (location.country && !safeEquals(location.country, data.country)) {
    return false;
  }
  if (
    location.states.length > 0 &&
    !location.states.some((state) => safeEquals(state, data.state))
  ) {
    return false;
  }
  if (
    location.districts.length > 0 &&
    !location.districts.some((district) => safeEquals(district, data.district))
  ) {
    return false;
  }
  if (location.ruralOnly && data.areaType !== "RURAL") return false;
  if (location.urbanOnly && data.areaType !== "URBAN") return false;

  if (
    criteria.social.religion.length > 0 &&
    !criteria.social.religion.some((religion) => safeEquals(religion, data.religion))
  ) {
    return false;
  }
  if (
    criteria.social.caste.length > 0 &&
    !criteria.social.caste.some((caste) => safeEquals(caste, data.casteCategory))
  ) {
    return false;
  }

  if (
    criteria.employment.employmentStatus.length > 0 &&
    !criteria.employment.employmentStatus.some((status) => safeEquals(status, data.employmentStatus))
  ) {
    return false;
  }
  if (
    criteria.employment.occupations.length > 0 &&
    !criteria.employment.occupations.some((occupation) => safeEquals(occupation, data.occupationType))
  ) {
    return false;
  }

  return true;
};

export const getEligibleCitizens = async (schemeId: SchemeId) => {
  try {
    const scheme = await schemeRepository.findSchemeById(schemeId.toString());
    if (!scheme) {
      console.error(`Scheme not found for id: ${schemeId}`);
      throw new UnrecoverableError(`Scheme ${schemeId} no longer exists, job terminated.`);
    }

    const eligibleUserIds = await profileRepository.findEligibleUserIds(
      scheme.getEligibility()
    );

    console.log(
      `Found ${eligibleUserIds.length} eligible citizens for scheme ${scheme.getTitle()} (${schemeId.toString()})`
    );

    if (eligibleUserIds.length === 0) {
      return;
    }

    const CHUNK_SIZE = 500;
    for (let i = 0; i < eligibleUserIds.length; i += CHUNK_SIZE) {
      const chunk = eligibleUserIds.slice(i, i + CHUNK_SIZE);
      const jobs = chunk.map((userId) => ({
        name: "send-scheme-notification",
        data: {
          schemeId: scheme.id.toString(),
          userId,
        },
        opts: {
          jobId: `notify:${scheme.id.toString()}:${userId}`,
        },
      }));
      await sendNotificationQueue.addBulk(jobs);
    }
  } catch (error) {
    console.error("Error sending notifications to citizens:", error);
    throw error;
  }
};