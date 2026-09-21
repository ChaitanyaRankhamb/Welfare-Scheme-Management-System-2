import { profileRepository } from "../../database/repository/profile.repository";
import { userRepository } from "../../database/repository/user.repository";
import { UserId } from "../../entity/user/userId";
import { AppError } from "../../Error/appError";

type AreaType = 'rural' | 'urban';

interface LocationType {
  country?: string;
  state?: string;
  district?: string;
  taluka?: string;
  village?: string;
  areaType?: AreaType;
}

export interface ProfileServiceResponseType {
  age: number;
  gender: 'male' | 'female' | 'other';
  annualIncome: number;
  location: LocationType;
  employmentStatus: string;
  occupationType: string;
  casteCategory: string;
  religion: string;
}

function normalizeLocation(raw: any): LocationType {
  return {
    country: raw?.country,
    state: raw?.state,
    district: raw?.district,
    taluka: raw?.taluka,
    village: raw?.village,
    areaType:
      raw?.ruralOrUrban === 'rural'
        ? 'rural'
        : raw?.ruralOrUrban === 'urban'
        ? 'urban'
        : undefined,
  };
}

export const getUserProfileData = async (
  userId: UserId
): Promise<ProfileServiceResponseType | null> => {
  const user = await userRepository.findUserById(userId.toString());

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.getRole() !== 'citizen') {
    throw new AppError('User is not a citizen', 400);
  }

  const profileData = await profileRepository.findProfileByUserId(
    userId.toString()
  );

  if (!profileData) {
    return null;
  }

  return {
    age: profileData.getAge(),
    gender: profileData.getGender().toLowerCase() as 'male' | 'female' | 'other',
    annualIncome: Number(profileData.getAnnualIncome()),
    location: normalizeLocation(profileData.getLocation()),
    employmentStatus: profileData.getEmploymentStatus(),
    occupationType: (profileData.getSnapshot().occupationType || "").toLowerCase(),
    casteCategory: profileData.getCasteCategory(),
    religion: profileData.getReligion(),
  };
};