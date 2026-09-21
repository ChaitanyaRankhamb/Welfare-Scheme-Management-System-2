"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVillages = exports.getTalukas = exports.getDistricts = exports.getStates = void 0;
const location_service_1 = require("../service/location.service");
const response_1 = require("../../../reuse-components/response");
const appError_1 = require("../../../Error/appError");
const getStates = async (req, res) => {
    console.log("🎯 [Controller] getStates called");
    try {
        // 1. Check auth data
        const userId = req.userId;
        console.log("👤 [Controller] userId:", userId);
        if (!userId) {
            console.log("❌ [Controller] No userId found");
            throw new appError_1.AppError('User not authenticated', 401);
        }
        // 2. Call service
        console.log("⚙️ [Controller] Calling getStatesService...");
        const result = await (0, location_service_1.getStatesService)();
        // 3. Log service result
        console.log("📊 [Controller] Service result:", result);
        if (!result || !result.data) {
            console.log("❌ [Controller] No data returned from service");
        }
        else {
            console.log("✅ [Controller] States count:", result.data.length);
        }
        // 4. Send response
        console.log("📤 [Controller] Sending response to client");
        return (0, response_1.successResponse)(res, result.data, result.message);
    }
    catch (error) {
        console.log("🔥 [Controller] Error occurred:", error);
        return (0, response_1.errorResponse)(res, error.message || 'Error fetching states', error.statusCode || 500);
    }
};
exports.getStates = getStates;
const getDistricts = async (req, res) => {
    try {
        const { state } = req.query;
        const result = await (0, location_service_1.getDistrictsService)(state);
        return (0, response_1.successResponse)(res, result.data, result.message);
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, error.message || 'Error fetching districts', error.statusCode || 500);
    }
};
exports.getDistricts = getDistricts;
const getTalukas = async (req, res) => {
    try {
        const { district } = req.query;
        const result = await (0, location_service_1.getTalukasService)(district);
        return (0, response_1.successResponse)(res, result.data, result.message);
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, error.message || 'Error fetching talukas', error.statusCode || 500);
    }
};
exports.getTalukas = getTalukas;
const getVillages = async (req, res) => {
    try {
        const { taluka } = req.query;
        const result = await (0, location_service_1.getVillagesService)(taluka);
        return (0, response_1.successResponse)(res, result.data, result.message);
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, error.message || 'Error fetching villages', error.statusCode || 500);
    }
};
exports.getVillages = getVillages;
