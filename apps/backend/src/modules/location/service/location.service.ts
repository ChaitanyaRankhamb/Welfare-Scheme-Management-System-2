import { locationRepository } from '../../../database/repository/location.repository';
import { AppError } from '../../../reuse-components/AppError';

export const getStatesService = async () => {
  console.log("states service hit");
  const states = await locationRepository.getStates();
  console.log("states", states);
  return {
    success: true,
    data: states.sort(),
    message: 'States fetched successfully'
  };
};

export const getDistrictsService = async (state: string) => {
  if (!state) throw new AppError('State is required', 400);
  const districts = await locationRepository.getDistricts(state);
  return {
    success: true,
    data: districts.sort(),
    message: 'Districts fetched successfully'
  };
};

export const getTalukasService = async (district: string) => {
  if (!district) throw new AppError('District is required', 400);
  const talukas = await locationRepository.getTalukas(district);
  return {
    success: true,
    data: talukas.sort(),
    message: 'Talukas fetched successfully'
  };
};

export const getVillagesService = async (taluka: string) => {
  if (!taluka) throw new AppError('Taluka is required', 400);
  const villages = await locationRepository.getVillages(taluka);
  return {
    success: true,
    data: villages.sort(),
    message: 'Villages fetched successfully'
  };
};
