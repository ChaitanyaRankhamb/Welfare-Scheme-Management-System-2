"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVillagesService = exports.getTalukasService = exports.getDistrictsService = exports.getStatesService = void 0;
const location_repository_1 = require("../../../database/repository/location.repository");
const AppError_1 = require("../../../reuse-components/AppError");
const getStatesService = async () => {
    console.log("states service hit");
    const states = await location_repository_1.locationRepository.getStates();
    console.log("states", states);
    return {
        success: true,
        data: states.sort(),
        message: 'States fetched successfully'
    };
};
exports.getStatesService = getStatesService;
const getDistrictsService = async (state) => {
    if (!state)
        throw new AppError_1.AppError('State is required', 400);
    const districts = await location_repository_1.locationRepository.getDistricts(state);
    return {
        success: true,
        data: districts.sort(),
        message: 'Districts fetched successfully'
    };
};
exports.getDistrictsService = getDistrictsService;
const getTalukasService = async (district) => {
    if (!district)
        throw new AppError_1.AppError('District is required', 400);
    const talukas = await location_repository_1.locationRepository.getTalukas(district);
    return {
        success: true,
        data: talukas.sort(),
        message: 'Talukas fetched successfully'
    };
};
exports.getTalukasService = getTalukasService;
const getVillagesService = async (taluka) => {
    if (!taluka)
        throw new AppError_1.AppError('Taluka is required', 400);
    const villages = await location_repository_1.locationRepository.getVillages(taluka);
    return {
        success: true,
        data: villages.sort(),
        message: 'Villages fetched successfully'
    };
};
exports.getVillagesService = getVillagesService;
